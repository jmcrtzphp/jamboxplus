/**
 * Liquid Glass Optical Refraction Engine
 * High Performance & Smooth GPU Pipeline
 * 
 * Pipeline:
 * 1. Surface Profile & Normal Map generation on quantized canvas
 * 2. SVG feDisplacementMap + feColorMatrix (chromatic separation) + feBlend
 * 3. Cache maps per aspect ratio & size bucket for optimal 60/120fps performance
 * 4. Graceful fallback for non-supporting browsers & prefers-reduced-motion
 */
const SVG_NS = "http://www.w3.org/2000/svg";
let uid = 0;
let svgDefs: SVGDefsElement | null = null;

// Cache generated displacement map data URLs by key: `${w}_${h}_${radius}_${border}_${mapBlur}`
const mapCache = new Map<string, string>();
const MAX_CACHE_SIZE = 80;

export interface LiquidGlassOptions {
  scale?: number;         // Displacement intensity (default: -32)
  chroma?: number;        // Chromatic aberration separation (default: 4)
  border?: number;        // Rim border proportion (default: 0.08)
  mapBlur?: number;       // Blur on displacement map (default: 10)
  blur?: number;          // Backdrop blur (default: 16)
  saturate?: number;      // Saturation multiplier (default: 1.4)
  brightness?: number;    // Brightness adjustment (default: 1.04)
  radius?: number | null; // Border radius in px (or auto-detected from element)
  fallbackBlur?: number;  // Fallback blur when SVG displacement is unsupported (default: 20)
  disabled?: boolean;     // Force fallback (e.g. on low power devices or reduced motion)
}

/**
 * Check if current browser supports SVG displacement within backdrop-filter
 */
export const isLiquidGlassSupported = (() => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || typeof document === 'undefined') return false;
  
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }

    const ua = navigator.userAgent || '';
    const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    
    // Firefox & pure Safari do not support SVG filter references in backdrop-filter
    if (isSafari || isFirefox) return false;
    
    if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') return false;
    
    let cssOk = false;
    try {
      cssOk = CSS.supports("backdrop-filter", "url(#lg)") || CSS.supports("-webkit-backdrop-filter", "url(#lg)");
    } catch (_) {
      cssOk = false;
    }

    if (!cssOk) return false;

    // Verify 2D canvas support
    const c = document.createElement("canvas");
    c.width = c.height = 4;
    const ctx = c.getContext("2d");
    if (!ctx) return false;
    ctx.getImageData(0, 0, 1, 1);
    
    return true;
  } catch (_) {
    return false;
  }
})();

function ensureDefs(): SVGDefsElement | null {
  if (svgDefs && document.body.contains(svgDefs)) return svgDefs;
  try {
    const existing = document.getElementById("liquid-glass-defs-container");
    if (existing) {
      const defs = existing.querySelector("defs");
      if (defs) {
        svgDefs = defs as SVGDefsElement;
        return svgDefs;
      }
    }

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.id = "liquid-glass-defs-container";
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true");
    svg.style.position = "absolute";
    svg.style.pointerEvents = "none";

    svgDefs = document.createElementNS(SVG_NS, "defs");
    svg.appendChild(svgDefs);
    (document.body || document.documentElement).appendChild(svg);

    return svgDefs;
  } catch (_) {
    return null;
  }
}

/**
 * Generate a physical surface normal map with smooth squircle bevels
 * Neutral center (rgb 128, 128, 128) -> no displacement
 * Curved edges produce dX in R, dY in B, with smooth falloff
 */
function makeDisplacementMap(
  w: number, 
  h: number, 
  radius: number, 
  border: number, 
  mapBlur: number
): string {
  // Quantize dimensions to multiples of 8 to maximize cache hits
  const quantW = Math.max(16, Math.round(w / 8) * 8);
  const quantH = Math.max(16, Math.round(h / 8) * 8);
  const quantR = Math.max(0, Math.round(radius / 4) * 4);
  const cacheKey = `${quantW}_${quantH}_${quantR}_${border}_${mapBlur}`;

  if (mapCache.has(cacheKey)) {
    return mapCache.get(cacheKey)!;
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = quantW;
    canvas.height = quantH;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return "";

    // Step 1: Base surface normal gradient along X axis (Red)
    const gx = ctx.createLinearGradient(0, 0, quantW, 0);
    gx.addColorStop(0, "rgb(0, 128, 128)");
    gx.addColorStop(0.5, "rgb(128, 128, 128)");
    gx.addColorStop(1, "rgb(255, 128, 128)");
    ctx.fillStyle = gx;
    ctx.fillRect(0, 0, quantW, quantH);

    // Step 2: Surface normal gradient along Y axis (Blue)
    const gy = ctx.createLinearGradient(0, 0, 0, quantH);
    gy.addColorStop(0, "rgb(128, 128, 0)");
    gy.addColorStop(0.5, "rgb(128, 128, 128)");
    gy.addColorStop(1, "rgb(128, 128, 255)");
    ctx.globalCompositeOperation = "difference";
    ctx.fillStyle = gy;
    ctx.fillRect(0, 0, quantW, quantH);

    // Step 3: Squircle bevel mask - flattening the center so refraction concentrates on curved edges
    ctx.globalCompositeOperation = "source-over";
    const inset = Math.max(2, border * Math.min(quantW, quantH));
    const drawW = Math.max(1, quantW - inset * 2);
    const drawH = Math.max(1, quantH - inset * 2);
    const r = Math.max(0, Math.min(quantR - inset, drawW / 2, drawH / 2));

    ctx.filter = `blur(${Math.max(0, mapBlur)}px)`;
    ctx.fillStyle = "rgba(128, 128, 128, 0.95)";
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(inset, inset, drawW, drawH, r);
    } else {
      ctx.rect(inset, inset, drawW, drawH);
    }
    ctx.fill();
    ctx.filter = "none";

    const dataUrl = canvas.toDataURL("image/png");
    
    // Prune cache if needed
    if (mapCache.size >= MAX_CACHE_SIZE) {
      const firstKey = mapCache.keys().next().value;
      if (firstKey) mapCache.delete(firstKey);
    }
    mapCache.set(cacheKey, dataUrl);
    
    return dataUrl;
  } catch (_) {
    return "";
  }
}

/**
 * Build SVG Filter pipeline with chromatic dispersion
 */
function buildFilter(id: string, scales: number[]) {
  const defs = ensureDefs();
  if (!defs) return null;

  try {
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", id);
    filter.setAttribute("x", "-10%");
    filter.setAttribute("y", "-10%");
    filter.setAttribute("width", "120%");
    filter.setAttribute("height", "120%");
    filter.setAttribute("color-interpolation-filters", "sRGB");

    const feImage = document.createElementNS(SVG_NS, "feImage");
    feImage.setAttribute("x", "0");
    feImage.setAttribute("y", "0");
    feImage.setAttribute("result", "map");
    feImage.setAttribute("preserveAspectRatio", "none");
    filter.appendChild(feImage);

    // Channel isolation matrices for RGB chromatic dispersion
    const colorMatrices = [
      "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
      "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
      "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
    ];

    const channels: string[] = [];

    for (let i = 0; i < 3; i++) {
      const disp = document.createElementNS(SVG_NS, "feDisplacementMap");
      disp.setAttribute("in", "SourceGraphic");
      disp.setAttribute("in2", "map");
      disp.setAttribute("scale", (scales[i] || 0).toString());
      disp.setAttribute("xChannelSelector", "R");
      disp.setAttribute("yChannelSelector", "B");
      disp.setAttribute("result", "d" + i);
      filter.appendChild(disp);

      const cm = document.createElementNS(SVG_NS, "feColorMatrix");
      cm.setAttribute("in", "d" + i);
      cm.setAttribute("type", "matrix");
      cm.setAttribute("values", colorMatrices[i]);
      cm.setAttribute("result", "c" + i);
      filter.appendChild(cm);

      channels.push("c" + i);
    }

    const blend1 = document.createElementNS(SVG_NS, "feBlend");
    blend1.setAttribute("in", channels[0]);
    blend1.setAttribute("in2", channels[1]);
    blend1.setAttribute("mode", "screen");
    blend1.setAttribute("result", "c01");
    filter.appendChild(blend1);

    const blend2 = document.createElementNS(SVG_NS, "feBlend");
    blend2.setAttribute("in", "c01");
    blend2.setAttribute("in2", channels[2]);
    blend2.setAttribute("mode", "screen");
    filter.appendChild(blend2);

    defs.appendChild(filter);

    return { filter, feImage };
  } catch (_) {
    return null;
  }
}

function resolveRadius(el: HTMLElement, w: number, h: number, override: number | null | undefined): number {
  if (override != null) return override;
  try {
    const raw = getComputedStyle(el).borderTopLeftRadius || "24px";
    const v = parseFloat(raw) || 24;
    return raw.trim().endsWith("%") ? (v / 100) * Math.min(w, h) : v;
  } catch (_) {
    return 24;
  }
}

/**
 * Apply Liquid Glass effect to an element
 */
export function liquidGlass(el: HTMLElement, opts: LiquidGlassOptions = {}) {
  const o: Required<LiquidGlassOptions> = Object.assign(
    {
      scale: -32,
      chroma: 4,
      border: 0.08,
      mapBlur: 10,
      blur: 16,
      saturate: 1.4,
      brightness: 1.04,
      radius: null as any,
      fallbackBlur: 20,
      disabled: false
    },
    opts
  );

  const applyFallback = () => {
    try {
      const frosted = `blur(${o.fallbackBlur}px) saturate(${o.saturate}) brightness(${o.brightness})`;
      el.style.backdropFilter = frosted;
      (el.style as any).webkitBackdropFilter = frosted;
      el.classList.add("lg-glass-fallback");
    } catch (_) {}

    return {
      supported: false,
      refresh: () => {},
      destroy: () => {
        try {
          el.style.backdropFilter = "";
          (el.style as any).webkitBackdropFilter = "";
          el.classList.remove("lg-glass-fallback");
        } catch (_) {}
      },
    };
  };

  if (!isLiquidGlassSupported || o.disabled) {
    return applyFallback();
  }

  try {
    const id = `lg-refract-${++uid}`;
    const scales = [o.scale, o.scale + o.chroma, o.scale + 2 * o.chroma];
    const parts = buildFilter(id, scales);

    if (!parts) {
      return applyFallback();
    }

    let lastW = 0;
    let lastH = 0;

    const refresh = () => {
      try {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        if (!w || !h || !parts) return;
        
        // Skip if size hasn't materially changed
        if (Math.abs(w - lastW) < 4 && Math.abs(h - lastH) < 4) return;
        
        lastW = w;
        lastH = h;
        
        const radius = resolveRadius(el, w, h, o.radius);
        const mapUrl = makeDisplacementMap(w, h, radius, o.border, o.mapBlur);
        
        if (mapUrl) {
          parts.feImage.setAttribute("href", mapUrl);
          parts.feImage.setAttribute("width", w.toString());
          parts.feImage.setAttribute("height", h.toString());
        }
      } catch (_) {}
    };

    refresh();
    
    try {
      const filterVal = `url(#${id}) blur(${o.blur}px) saturate(${o.saturate}) brightness(${o.brightness})`;
      el.style.backdropFilter = filterVal;
      (el.style as any).webkitBackdropFilter = filterVal;
    } catch (_) {
      return applyFallback();
    }

    let rafId: number | null = null;
    let ro: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(refresh);
      });
      ro.observe(el);
    }

    return {
      supported: true,
      refresh,
      destroy: () => {
        try {
          if (rafId) cancelAnimationFrame(rafId);
          if (ro) ro.disconnect();
          parts.filter.remove();
          el.style.backdropFilter = "";
          (el.style as any).webkitBackdropFilter = "";
        } catch (_) {}
      },
    };
  } catch (_) {
    return applyFallback();
  }
}
