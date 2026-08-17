import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Movies } from './components/Movies';

const pageTransition = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }
};

export default function App() {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch("https://analytics.digitalplat.org/a/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-DigitalPlat-Server-Key": "dps_7e34aa29f9049fc308850072ece22e1534153d52a472ff65" },
          body: JSON.stringify({"property":"dpa_4AAYP3zfz7MEdIMrW2KGAcC-VCKZWA8","event":"page_view","url": window.location.href})
        });
      } catch (err) {
        console.error("Failed to track page view:", err);
      }
    };
    trackPageView();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div key="movies" {...pageTransition} className="w-full min-h-screen">
        <Movies 
           onBack={() => {}} 
           onNavigate={() => {}} 
         />
      </motion.div>
    </AnimatePresence>
  );
}
