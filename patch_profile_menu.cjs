const fs = require('fs');
let code = fs.readFileSync('src/components/profiles/ProfileMenu.tsx', 'utf8');

// Replace the button
const oldButton = `<button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button flex items-center gap-2.5 p-1.5 pr-3.5 group cursor-pointer"
      >
        <div className="relative">
          <img 
            src={activeProfile.avatarUrl} 
            alt={activeProfile.name} 
            className="w-7 h-7 rounded-full bg-[#1D2126] border border-white/25 object-cover" 
          />
          <div className="absolute inset-0 rounded-full ring-1 ring-white/30" />
        </div>
        <span className="text-xs font-semibold hidden sm:block text-white/90 group-hover:text-white">
          {activeProfile.name}
        </span>
        <ChevronDown 
          size={13} 
          className={\`text-white/60 group-hover:text-white transition-transform duration-300 \${isOpen ? 'rotate-180' : ''}\`} 
        />
      </button>`;

const newButton = `<button 
        onClick={() => setIsOpen(!isOpen)}
        className={variant === 'mobile' 
          ? "relative flex flex-col items-center justify-center w-14 h-14 rounded-full text-white/70 hover:text-white transition-colors duration-200 outline-none" 
          : "glass-button flex items-center gap-2.5 p-1.5 pr-3.5 group cursor-pointer"}
      >
        <div className="relative">
          <img 
            src={activeProfile.avatarUrl} 
            alt={activeProfile.name} 
            className={variant === 'mobile' ? "w-6 h-6 rounded-full bg-[#1D2126] border border-white/25 object-cover" : "w-7 h-7 rounded-full bg-[#1D2126] border border-white/25 object-cover"} 
          />
          <div className="absolute inset-0 rounded-full ring-1 ring-white/30" />
        </div>
        {variant !== 'mobile' && (
          <span className="text-xs font-semibold hidden sm:block text-white/90 group-hover:text-white">
            {activeProfile.name}
          </span>
        )}
        {variant !== 'mobile' && (
          <ChevronDown 
            size={13} 
            className={\`text-white/60 group-hover:text-white transition-transform duration-300 \${isOpen ? 'rotate-180' : ''}\`} 
          />
        )}
        {variant === 'mobile' && (
          <span className="text-[10px] font-medium leading-none mt-1">Profile</span>
        )}
      </button>`;

code = code.replace(oldButton, newButton);

// Replace the dropdown container
const oldDropdown = `<motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="absolute right-0 top-full mt-2.5 w-60 z-50 origin-top-right"
          >`;

const newDropdown = `<motion.div
            initial={{ opacity: 0, y: variant === 'mobile' ? 10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: variant === 'mobile' ? 10 : 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className={variant === 'mobile' 
              ? "absolute bottom-full right-1/2 translate-x-[40%] mb-4 w-60 z-[100] origin-bottom-right" 
              : "absolute right-0 top-full mt-2.5 w-60 z-50 origin-top-right"}
          >`;

code = code.replace(oldDropdown, newDropdown);

fs.writeFileSync('src/components/profiles/ProfileMenu.tsx', code);
