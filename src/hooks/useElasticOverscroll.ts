import { useMotionValue, useTransform, useSpring } from 'motion/react';

interface UseElasticOverscrollProps {
  activeIndex: number;
  itemCount: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function useElasticOverscroll({
  activeIndex,
  itemCount,
  onSwipeLeft,
  onSwipeRight
}: UseElasticOverscrollProps) {
  const dragX = useMotionValue(0);

  // Calculate base scale based on drag stretch
  // Only stretch when dragging past the boundaries (first or last item)
  const rawScale = useTransform(dragX, (x) => {
    if (typeof x !== 'number') return 1;
    if (activeIndex === 0 && x > 0) {
      return 1 + (x / 2500); // Stretch zoom when pulling at start
    }
    if (activeIndex === itemCount - 1 && x < 0) {
      return 1 - (x / 2500); // Stretch zoom when pulling at end
    }
    return 1;
  });

  // Apply a spring to the scale for fluid elasticity and a natural bounce-back
  const scale = useSpring(rawScale, {
    stiffness: 400,
    damping: 30,
    restDelta: 0.001
  });

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipePower = Math.abs(offset.x) * velocity.x;
    
    // Swipe Right (Go to Previous)
    if (offset.x > 80 || swipePower > 500) {
      if (activeIndex > 0) onSwipeRight();
    } 
    // Swipe Left (Go to Next)
    else if (offset.x < -80 || swipePower < -500) {
      if (activeIndex < itemCount - 1) onSwipeLeft();
    }
  };

  return { dragX, scale, handleDragEnd };
}
