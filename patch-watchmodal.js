const fs = require('fs');
let code = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');
code = code.replace(
  /const handleStartPlayback = useCallback\(\(resume: boolean = true\) => \{[\s\S]*?setIsPlaying\(true\);\n  \}, \[\]\);/,
  `const handleStartPlayback = useCallback((resume: boolean = true) => {
    if (!resume) {
      setResumeStartAt(0);
    }
    setIsPlaying(true);
    // Request full screen
    setTimeout(() => {
      const playerContainer = document.getElementById('player-stage-container');
      if (playerContainer) {
        if (playerContainer.requestFullscreen) {
          playerContainer.requestFullscreen().catch(err => console.warn(err));
        } else if ((playerContainer as any).webkitRequestFullscreen) {
          (playerContainer as any).webkitRequestFullscreen();
        }
      }
    }, 100);
  }, []);`
);
code = code.replace(/<div className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-6">/, '<div id="player-stage-container" className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-6 bg-black">');
fs.writeFileSync('src/components/WatchModal.tsx', code);
