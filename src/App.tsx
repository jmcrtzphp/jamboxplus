import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { Movies } from './components/Movies';

const pageTransition = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }
};

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <motion.div key="movies" {...pageTransition} className="w-full min-h-screen">
        <Movies 
           onBack={() => {}} 
           onNavigate={() => {}} 
         />
      </motion.div>
      <Analytics />
    </AnimatePresence>
  );
}
