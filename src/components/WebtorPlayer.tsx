import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    webtor: any;
  }
}

export function WebtorPlayer({ magnet }: { magnet: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    const initPlayer = () => {
      if (window.webtor && containerRef.current) {
        containerRef.current.innerHTML = '';
        const id = 'webtor-player-' + Math.random().toString(36).substring(7);
        const playerDiv = document.createElement('div');
        playerDiv.id = id;
        containerRef.current.appendChild(playerDiv);

        window.webtor.push({
          id: id,
          magnet: magnet,
          width: '100%',
          height: '100%',
          theme: 'dark',
          header: true,
          controls: true
        });
      }
    };

    if (!window.webtor) {
      window.webtor = window.webtor || [];
      script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js';
      script.async = true;
      script.onload = initPlayer;
      document.body.appendChild(script);
    } else {
      initPlayer();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [magnet]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}
