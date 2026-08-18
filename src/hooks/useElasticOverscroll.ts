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

  // Keep fixed 1:1 scale proportion without stretching or zooming on mobile swipes
  const rawScale = useTransform(dragX, () => 1);

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
