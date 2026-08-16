const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

if (!app.includes("import { AnimatePresence, motion } from 'motion/react'")) {
  app = app.replace("import { useState, useEffect, lazy, Suspense } from 'react';", "import { useState, useEffect, lazy, Suspense } from 'react';\nimport { AnimatePresence, motion } from 'motion/react';");
}

app = app.replace(
  /function AppContentWithEvents\(\) \{[\s\S]*?return \(\s*<AuthProvider>/,
  `
const pageTransition = {
  initial: { opacity: 0, y: 15, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -15, scale: 0.99 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

function AppContentWithEvents() {
  const { user, activeProfile, loading, setActiveProfile } = useAuth();
  
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [profileView, setProfileView] = useState<'select' | 'add' | 'manage'>('select');
  const [currentView, setCurrentView] = useState<'home' | 'livetv' | 'movies' | 'settings'>('movies');

  useEffect(() => {
    const handleManage = () => {
      setActiveProfile(null);
      setProfileView('manage');
    };
    window.addEventListener('nav-manage-profiles', handleManage);
    // @ts-ignore
    return () => window.removeEventListener('nav-manage-profiles', handleManage);
  }, [setActiveProfile]);

  let content;

  if (loading) {
    content = (
      <motion.div key="loading" {...pageTransition} className="min-h-screen bg-[#0F1113] flex items-center justify-center relative overflow-hidden">
        <AuthBackground />
        <div className="z-10 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
          <p className="text-[#9099A2] font-medium animate-pulse">Loading JamBox+...</p>
        </div>
      </motion.div>
    );
  } else if (!user) {
    if (authView === 'login') {
      content = <motion.div key="login" {...pageTransition} className="w-full h-full"><Login onSwitchToRegister={() => setAuthView('register')} /></motion.div>;
    } else {
      content = <motion.div key="register" {...pageTransition} className="w-full h-full"><Register onSwitchToLogin={() => setAuthView('login')} /></motion.div>;
    }
  } else if (!activeProfile) {
    if (profileView === 'add') {
      content = (
        <motion.div key="profile-add" {...pageTransition} className="w-full h-full">
          <Suspense fallback={<ViewFallback message="Loading..." />}>
            <AddProfile onBack={() => setProfileView('select')} onComplete={() => setProfileView('select')} />
          </Suspense>
        </motion.div>
      );
    } else if (profileView === 'manage') {
      content = (
        <motion.div key="profile-manage" {...pageTransition} className="w-full h-full">
          <Suspense fallback={<ViewFallback message="Loading..." />}>
            <ManageProfiles onBack={() => setProfileView('select')} onAddProfile={() => setProfileView('add')} />
          </Suspense>
        </motion.div>
      );
    } else {
      content = (
        <motion.div key="profile-select" {...pageTransition} className="w-full h-full">
          <ProfileSelection onAddProfile={() => setProfileView('add')} />
        </motion.div>
      );
    }
  } else if (currentView === 'settings') {
    content = (
      <motion.div key="settings" {...pageTransition} className="w-full min-h-screen">
        <Suspense fallback={<ViewFallback message="Loading settings..." />}>
          <div className="absolute top-6 right-6 z-50">
            <ProfileMenuProxy onNavigate={(v) => setCurrentView(v as any)} />
          </div>
          <Settings onBack={() => setCurrentView('movies')} />
        </Suspense>
      </motion.div>
    );
  } else if (currentView === 'livetv') {
    content = (
      <motion.div key="livetv" {...pageTransition} className="w-full min-h-screen">
        <Suspense fallback={<ViewFallback message="Starting Live TV..." />}>
          <LiveTV 
            onBack={() => setCurrentView('movies')} 
            profileMenu={<ProfileMenuProxy onNavigate={(v) => setCurrentView(v as any)} />} 
          />
        </Suspense>
      </motion.div>
    );
  } else if (currentView === 'movies') {
    content = (
      <motion.div key="movies" {...pageTransition} className="w-full min-h-screen">
        <Suspense fallback={<ViewFallback message="Loading catalog..." />}>
          <Movies 
            onBack={() => setCurrentView('home')} 
            onNavigate={(v) => setCurrentView(v as any)} 
            profileMenu={<ProfileMenuProxy onNavigate={(v) => setCurrentView(v as any)} />} 
          />
        </Suspense>
      </motion.div>
    );
  } else {
    content = (
      <motion.div key="home" {...pageTransition} className="w-full min-h-screen">
        <div className="min-h-screen bg-[#0F1113] text-[#F4F5F7] flex flex-col items-center justify-center relative overflow-hidden">
          <AmbientGlassBackground />
          <div className="absolute top-6 right-6 z-50">
            <ProfileMenuProxy onNavigate={(v) => setCurrentView(v as any)} />
          </div>
          <div className="z-10 text-center mb-12">
            <h1 className="text-5xl font-bold tracking-tight mb-4 flex items-center justify-center gap-3">
              <JamBoxText className="text-5xl" />
            </h1>
            <p className="text-[#9099A2] text-lg">Choose your entertainment</p>
          </div>
          <div className="z-10 flex gap-6 px-4 w-full max-w-4xl justify-center">
            <GlassCard 
              intensity="medium"
              radius={32}
              onClick={() => setCurrentView('livetv')}
              className="group relative flex flex-col items-center justify-center gap-6 p-8 cursor-pointer w-64 h-64 hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]"
            >
              <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><Tv size={40} className="text-amber-500 group-hover:text-amber-400 transition-colors" /></div>
              <span className="text-2xl font-semibold">Live TV</span>
            </GlassCard>
            <GlassCard 
              intensity="medium"
              radius={32}
              onClick={() => setCurrentView('movies')}
              className="group relative flex flex-col items-center justify-center gap-6 p-8 cursor-pointer w-64 h-64 hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]"
            >
              <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Film size={40} className="text-amber-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <span className="text-2xl font-semibold">Movies</span>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    );
  }

  return <AnimatePresence mode="wait">{content}</AnimatePresence>;
}

export default function App() {
  return (
    <AuthProvider>`
);
fs.writeFileSync('src/App.tsx', app);
