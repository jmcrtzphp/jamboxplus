import { useEffect, RefObject } from 'react';
import { useMotionValue, useSpring, useTransform, useScroll } from 'motion/react';

export function usePullDownZoom(ref: RefObject<HTMLElement | null>) {
  const { scrollY } = useScroll();
  const dragY = useMotionValue(0);

  // Combine native overscroll (negative scrollY) with manual drag (dragY)
  const combinedPull = useTransform(
    [scrollY, dragY],
    ([latestScroll, latestDrag]: any[]) => {
      const scrollDist = typeof latestScroll === 'number' && latestScroll < 0 ? Math.abs(latestScroll) : 0;
      const dragDist = typeof latestDrag === 'number' && latestDrag > 0 ? latestDrag : 0;
      return Math.max(scrollDist, dragDist);
    }
  );

  // Map pull distance (0 to 400px) to subtle scale (1 to 1.08)
  const rawScale = useTransform(combinedPull, [0, 400], [1, 1.08], { clamp: true });

  const scale = useSpring(rawScale, {
    stiffness: 400,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let startY = 0;
    let isPulling = false;

    const handleStart = (clientY: number) => {
      if (window.scrollY > 0) return;
      startY = clientY;
      isPulling = true;
    };

    const handleMove = (clientY: number) => {
      if (!isPulling) return;
      const deltaY = clientY - startY;
      if (deltaY > 0 && window.scrollY <= 0) {
        dragY.set(deltaY);
      } else {
        dragY.set(0);
      }
    };

    const handleEnd = () => {
      isPulling = false;
      dragY.set(0);
    };

    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
    
    const onMouseDown = (e: MouseEvent) => handleStart(e.clientY);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    element.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', handleEnd);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);

      element.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [dragY]);

  return scale;
}
