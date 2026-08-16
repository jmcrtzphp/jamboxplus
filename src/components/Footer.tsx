import React from 'react';
import { JamBoxText } from './Logo';

export const Footer: React.FC = () => {
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
            <h4 className="text-white font-semibold mb-6">Support the Developer</h4>
            <div className="flex flex-col gap-5 text-sm">
              <p className="text-white/60 leading-relaxed">
                Please support this ongoing development to keep the cinematic experience ad-free and lightning fast.
              </p>
              <div className="flex flex-col gap-2">
                <span className="text-white/40 text-xs uppercase tracking-wider font-semibold">Feedback & Requests</span>
                <a href="mailto:jmcrtzphp@gmail.com" className="text-amber-500 hover:text-amber-400 transition-colors inline-flex items-center gap-2">
                  jmcrtzphp@gmail.com
                </a>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-white/80 font-medium flex items-center gap-2">
                  ☕ Buy me a coffee
                </span>
                <p className="text-white/50 text-xs">Send via GCash</p>
                <span className="text-amber-500 font-mono text-lg tracking-wider mt-1">0995 014 5525</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            &copy; 2026 JamBox+. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-amber-500 text-xs transition-colors">Privacy</a>
            <a href="#" className="text-white/40 hover:text-amber-500 text-xs transition-colors">Terms</a>
            <a href="#" className="text-white/40 hover:text-amber-500 text-xs transition-colors">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
