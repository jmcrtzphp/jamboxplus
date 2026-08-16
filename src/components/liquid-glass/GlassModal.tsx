import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { liquidGlass } from '../../lib/liquidGlass';
import { GlassIconButton } from './GlassIconButton';

export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  showCloseButton?: boolean;
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-4xl',
  className = '',
  showCloseButton = true
}: GlassModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const instance = liquidGlass(modalRef.current, {
      scale: -36,
      chroma: 4,
      border: 0.06,
      mapBlur: 12,
      blur: 32,
      saturate: 1.45,
      radius: 32
    });
    return () => {
      try {
        instance?.destroy?.();
      } catch (_) {}
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10">
          {/* Ambient Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Liquid Glass Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ borderRadius: '32px' }}
            className={`relative w-full ${maxWidth} max-h-[92vh] glass-strong glass-specular overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col z-10 border border-white/20 ${className}`}
          >
            {/* Top Specular Edge Highlight */}
            <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-100 via-white to-transparent pointer-events-none blur-[0.2px]" />
            
            {/* Upper Glass Glare */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.12] to-transparent pointer-events-none" />

            {/* Header if title or close button */}
            {(title || showCloseButton) && (
              <div className="relative z-20 flex items-center justify-between px-6 pt-6 pb-2">
                {title ? (
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                    {title}
                  </h3>
                ) : <div />}

                {showCloseButton && (
                  <GlassIconButton
                    size="sm"
                    variant="subtle"
                    onClick={onClose}
                    tooltip="Close"
                    className="ml-auto"
                  >
                    <X size={18} />
                  </GlassIconButton>
                )}
              </div>
            )}

            {/* Content Body */}
            <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
