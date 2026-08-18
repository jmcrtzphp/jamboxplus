import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Movies } from './components/Movies';

const CookieBanner = lazy(() => import('./components/Legal').then(module => ({ default: module.CookieBanner })));
const CookiePreferences = lazy(() => import('./components/Legal').then(module => ({ default: module.CookiePreferences })));
const PrivacyPolicy = lazy(() => import('./components/Legal').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./components/Legal').then(module => ({ default: module.TermsOfService })));

const pageTransition = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }
};

export default function App() {
  const [showCookies, setShowCookies] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

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
    <>
      <AnimatePresence mode="wait">
        <motion.div key="movies" {...pageTransition} className="w-full min-h-screen">
          <Movies
              onBack={() => {}}
              onNavigate={() => {}}
              onOpenCookies={() => setShowCookies(true)}
              onOpenPrivacy={() => setShowPrivacy(true)}
              onOpenTerms={() => setShowTerms(true)}
            />
        </motion.div>
      </AnimatePresence>

      <Suspense fallback={null}>
        <CookieBanner onOpenPreferences={() => setShowCookies(true)} />
      </Suspense>

      <Suspense fallback={null}>
        <AnimatePresence>
          {showCookies && <CookiePreferences key="cookies" onClose={() => setShowCookies(false)} onOpenPrivacy={() => { setShowCookies(false); setShowPrivacy(true); }} />}
          {showPrivacy && <PrivacyPolicy key="privacy" onClose={() => setShowPrivacy(false)} />}
          {showTerms && <TermsOfService key="terms" onClose={() => setShowTerms(false)} />}
        </AnimatePresence>
      </Suspense>
    </>
  );
}
