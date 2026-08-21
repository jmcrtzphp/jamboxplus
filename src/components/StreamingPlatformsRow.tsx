import React from 'react';

const STREAMING_PLATFORMS_CARDS = [
  { id: 'netflix', title: 'Netflix', img: 'https://i.imgflip.com/azc2q3.gif' },
  { id: 'disney', title: 'Disney+', img: 'https://i.imgflip.com/azc2gs.gif' },
  { id: 'prime', title: 'Prime Video', img: 'https://i.imgflip.com/azc9xy.gif' },
  { id: 'apple', title: 'Apple TV+', img: 'https://i.imgflip.com/azc2on.gif' },
  { id: 'max', title: 'HBO Max', img: 'https://i.imgflip.com/azc2lu.gif' }
];

interface Props {
  onSelectPlatform: (id: string) => void;
}

export function StreamingPlatformsRow({ onSelectPlatform }: Props) {
  return (
    <div className="relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto pt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 12C22 14.7578 20.8836 17.2549 19.0782 19.064M2 12C2 9.235 3.12222 6.73208 4.93603 4.92188M19.1414 5.00003C19.987 5.86254 20.6775 6.87757 21.1679 8.00003M5 19.1415C4.08988 18.2493 3.34958 17.1845 2.83209 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M16.2849 8.04397C17.3458 9.05877 18 10.4488 18 11.9822C18 13.5338 17.3302 14.9386 16.2469 15.9564M7.8 16C6.68918 14.9789 6 13.556 6 11.9822C6 10.4266 6.67333 9.01843 7.76162 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M13.6563 10.4511C14.5521 11.1088 15 11.4376 15 12C15 12.5624 14.5521 12.8912 13.6563 13.5489C13.4091 13.7304 13.1638 13.9014 12.9384 14.0438C12.7407 14.1688 12.5168 14.298 12.2849 14.4249C11.3913 14.914 10.9444 15.1586 10.5437 14.8878C10.1429 14.617 10.1065 14.0502 10.0337 12.9166C10.0131 12.596 10 12.2817 10 12C10 11.7183 10.0131 11.404 10.0337 11.0834C10.1065 9.94977 10.1429 9.38296 10.5437 9.1122C10.9444 8.84144 11.3913 9.08599 12.2849 9.57509C12.5168 9.70198 12.7407 9.83123 12.9384 9.95619C13.1638 10.0986 13.4091 10.2696 13.6563 10.4511Z" stroke="currentColor" strokeWidth="1.5"></path> </g></svg>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white drop-shadow">
            Streaming Platforms
          </h3>
        </div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {STREAMING_PLATFORMS_CARDS.map(platform => (
          <div 
            key={platform.id}
            onClick={() => onSelectPlatform(platform.id)}
            className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] aspect-video rounded-2xl overflow-hidden glass-subtle hover:glass-medium border border-white/15 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group/card shadow-lg flex flex-col justify-end relative"
          >
            <img 
              src={platform.img} 
              alt={platform.title} 
              loading="lazy"
              decoding="async"
              
              className="absolute inset-0 w-full h-full object-cover scale-[1.15] transition-transform duration-500 ease-out group-hover/card:scale-125"
            />
            <div className="absolute inset-0 bg-black/10 group-hover/card:bg-transparent transition-colors duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
