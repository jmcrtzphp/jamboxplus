import { useEffect, RefObject } from 'react';
import { useMotionValue, useSpring, useTransform } from 'motion/react';

export interface PullDownZoomOptions {
  /** Optional custom scroll target container ref (e.g. for modal scroll containers) */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  /** Max scale multiplier at max pull (default: 1.22) */
  maxScale?: number;
  /** Max drag distance range in pixels (default: 220) */
  pullRange?: number;
  /** Content parallax multiplier (default: -0.35) */
  contentParallaxRatio?: number;
}

export function usePullDownZoom(
  ref: RefObject<HTMLElement | null>,
  options: PullDownZoomOptions = {}
) {
  const { 
    scrollContainerRef, 
    maxScale = 1.0, 
    pullRange = 220, 
    contentParallaxRatio = -0.35 
  } = options;

  // Motion values driven directly without React re-renders
  const pullMotionValue = useMotionValue(0);

  // Fast, jitter-free spring with tuned critical damping for smooth 60fps/120fps GPU animations
  const springPull = useSpring(pullMotionValue, {
    stiffness: 380,
    damping: 32,
    mass: 0.5,
    restDelta: 0.001
  });

  // 1. Proportional Image Scale: strictly fixed at 1.0 (no distortion/zooming on mobile)
  const imageScale = useTransform(springPull, [0, pullRange], [1.0, maxScale], { clamp: true });

  // 2. Parallax Content Layer: negative translation offset
  const contentY = useTransform(springPull, (pull) => -(Number(pull) * Math.abs(contentParallaxRatio)));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let isTracking = false;
    let isIntentDetermined = false;
    let isVerticalPull = false;
    let initialScrollY = 0;
    let currentDrag = 0;
    let currentNativePull = 0;

    const getScrollTop = () => {
      if (scrollContainerRef && scrollContainerRef.current) {
        return scrollContainerRef.current.scrollTop;
      }
      return window.pageYOffset || document.documentElement?.scrollTop || document.body?.scrollTop || window.scrollY || 0;
    };

    const updateCombined = () => {
      const activePull = Math.max(currentDrag, currentNativePull);
      pullMotionValue.set(activePull);
    };

    // 1. Scroll listener for rubber-band overscroll detection on iOS
    const handleScroll = () => {
      const sY = getScrollTop();
      if (sY < 0) {
        currentNativePull = Math.abs(sY);
      } else {
        currentNativePull = 0;
      }
      updateCombined();
    };

    const scrollTarget = scrollContainerRef?.current || window;
    scrollTarget.addEventListener('scroll', handleScroll as EventListener, { passive: true });

    // 2. Touch gesture listener
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      initialScrollY = getScrollTop();

      if (initialScrollY > 5) return;

      startX = touch.clientX;
      startY = touch.clientY;
      isTracking = true;
      isIntentDetermined = false;
      isVerticalPull = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTracking || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const currentScroll = getScrollTop();

      if (!isIntentDetermined && (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4)) {
        isIntentDetermined = true;
        if (deltaY > 0 && deltaY > Math.abs(deltaX) && (currentScroll <= 3 || initialScrollY <= 3)) {
          isVerticalPull = true;
        } else {
          isVerticalPull = false;
        }
      }

      if (isVerticalPull && deltaY > 0 && currentScroll <= 3) {
        if (e.cancelable) {
          e.preventDefault();
        }
        // Logarithmic rubber-banding resistance
        currentDrag = 220 * (1 - Math.exp(-deltaY / 240));
        updateCombined();
      } else if (!isVerticalPull && currentDrag > 0) {
        currentDrag = 0;
        updateCombined();
      }
    };

    const handleTouchEnd = () => {
      isTracking = false;
      isIntentDetermined = false;
      isVerticalPull = false;
      currentDrag = 0;
      updateCombined();
    };

    // 3. Pointer events for desktop drag support
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === 'touch') return;
      initialScrollY = getScrollTop();
      if (initialScrollY > 5) return;

      startX = e.clientX;
      startY = e.clientY;
      isTracking = true;
      isIntentDetermined = false;
      isVerticalPull = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isTracking || e.pointerType === 'touch') return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const currentScroll = getScrollTop();

      if (!isIntentDetermined && (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4)) {
        isIntentDetermined = true;
        if (deltaY > 0 && deltaY > Math.abs(deltaX) && currentScroll <= 3) {
          isVerticalPull = true;
        }
      }

      if (isVerticalPull && deltaY > 0 && currentScroll <= 3) {
        currentDrag = 220 * (1 - Math.exp(-deltaY / 240));
        updateCombined();
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    element.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handleTouchEnd, { passive: true });
    window.addEventListener('pointercancel', handleTouchEnd, { passive: true });

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll as EventListener);

      element.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);

      element.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handleTouchEnd);
      window.removeEventListener('pointercancel', handleTouchEnd);
    };
  }, [pullMotionValue, ref, scrollContainerRef]);

  return { imageScale, contentY, springPull };
}
