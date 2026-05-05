import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ text, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      if (position === 'top') {
        top = rect.top - 40;
        left = rect.left + rect.width / 2;
      } else if (position === 'bottom') {
        top = rect.bottom + 10;
        left = rect.left + rect.width / 2;
      } else if (position === 'left') {
        top = rect.top + rect.height / 2;
        left = rect.left - 10;
      } else if (position === 'right') {
        top = rect.top + rect.height / 2;
        left = rect.right + 10;
      }

      setCoords({ top, left });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isVisible]);

  return (
    <div 
      ref={triggerRef}
      className="inline-flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ 
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: position === 'top' || position === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)',
              zIndex: 9999
            }}
            className="whitespace-nowrap bg-gray-900 border border-gray-700/50 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl pointer-events-none"
          >
            {text}
            {/* Pointer Arrow */}
            <div className={`absolute w-2 h-2 bg-gray-900 border-gray-700/50 rotate-45 ${
              position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2 border-b border-r' :
              position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2 border-t border-l' :
              position === 'left' ? '-right-1 top-1/2 -translate-y-1/2 border-t border-r' :
              '-left-1 top-1/2 -translate-y-1/2 border-b border-l'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
