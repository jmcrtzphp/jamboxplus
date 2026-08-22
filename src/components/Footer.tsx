import React, { useState, useEffect } from 'react';
import { JamBoxText } from './Logo';
import { Eye } from 'lucide-react';

export const Footer: React.FC<{ onOpenCookies?: () => void, onOpenPrivacy?: () => void, onOpenTerms?: () => void }> = ({ onOpenCookies, onOpenPrivacy, onOpenTerms }) => {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    let sse: EventSource | null = null;
    
    const fetchVisits = async () => {
      try {
        const hasVisited = sessionStorage.getItem('has_visited');
        // If not visited this session, post to increment
        if (!hasVisited) {
          await fetch('/api/visits', { method: 'POST' });
          sessionStorage.setItem('has_visited', 'true');
        }
        
        // Connect to SSE stream for live updates
        sse = new EventSource('/api/visits');
        sse.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setVisits(data.visits);
        };
      } catch (err) {
        // ignore
      }
    };
    
    fetchVisits();
    
    return () => {
      if (sse) {
        sse.close();
      }
    };
  }, []);

  return (
    <footer className="w-full bg-[#080A0E] border-t border-white/5 pt-16 pb-24 md:pb-8 mt-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <div className="mb-6">
              <JamBoxText className="text-2xl" />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Premium cinematic entertainment. Stream the latest blockbuster movies and exclusive original series in stunning Ultra HD.
            </p>
            <p className="text-white/30 text-xs leading-relaxed mt-4">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-amber-500 text-sm transition-colors">Movies</a></li>
              <li><a href="#" className="text-white/50 hover:text-amber-500 text-sm transition-colors">TV Shows</a></li>
                            <li><a href="#" className="text-white/50 hover:text-amber-500 text-sm transition-colors">Favorites</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <div className="flex flex-col gap-5 text-sm">
              <div className="flex flex-col gap-2">
                <span className="text-white/40 text-xs uppercase tracking-wider font-semibold">Feedback & Requests</span>
                <a href="mailto:uj2b6eb4dfna@mail.dpdns.org" className="text-amber-500 hover:text-amber-400 transition-colors inline-flex items-center gap-2">
                  uj2b6eb4dfna@mail.dpdns.org
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs flex items-center gap-4">
            <span>&copy; 2026 JamBox+. All rights reserved.</span>
            {visits !== null && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-white/60 font-mono tracking-widest">{visits.toLocaleString()}</span>
                <span className="sr-only">Visits</span>
              </span>
            )}
          </p>
          <div className="flex gap-6">
            <button onClick={onOpenPrivacy} className="text-white/40 hover:text-amber-500 text-xs transition-colors cursor-pointer bg-transparent border-none p-0 text-left">Privacy</button>
            <button onClick={onOpenTerms} className="text-white/40 hover:text-amber-500 text-xs transition-colors cursor-pointer bg-transparent border-none p-0 text-left">Terms</button>
            <button onClick={onOpenCookies} className="text-white/40 hover:text-amber-500 text-xs transition-colors cursor-pointer bg-transparent border-none p-0 text-left">Cookie Preferences</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
