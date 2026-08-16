const fs = require('fs');

let content = fs.readFileSync('/tmp/App.tsx', 'utf8');

// Add Sun and Moon to imports
content = content.replace(
  "import { Tv, Search, Menu, X } from 'lucide-react';",
  "import { Tv, Search, Menu, X, Sun, Moon } from 'lucide-react';"
);

// Add isDarkMode state
content = content.replace(
  "  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0]);",
  "  const [isDarkMode, setIsDarkMode] = useState(true);\n  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0]);"
);

// Add toggle button next to Menu
const menuButtonStr = `<LiquidGlass
                            className="p-2.5 bg-white/10 border border-white/30 hover:bg-white/20 rounded-full text-white shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer flex items-center justify-center"
                            onClick={() => setIsSidebarOpen(true)}
                            title="Menu"
                            scale={-40}
                            mapBlur={6}
                            radius={9999}
                          >
                            <Menu size={24} />
                          </LiquidGlass>`;

const menuReplacement = `<LiquidGlass
                            className="p-2.5 bg-white/10 dark:bg-white/10 bg-black/5 border border-black/20 dark:border-white/30 hover:bg-black/10 dark:hover:bg-white/20 rounded-full text-slate-800 dark:text-white shadow-lg transition-all cursor-pointer flex items-center justify-center"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            title="Toggle Theme"
                            scale={-40}
                            mapBlur={6}
                            radius={9999}
                          >
                            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                          </LiquidGlass>
                          <LiquidGlass
                            className="p-2.5 bg-white/10 dark:bg-white/10 bg-black/5 border border-black/20 dark:border-white/30 hover:bg-black/10 dark:hover:bg-white/20 rounded-full text-slate-800 dark:text-white shadow-lg transition-all cursor-pointer flex items-center justify-center"
                            onClick={() => setIsSidebarOpen(true)}
                            title="Menu"
                            scale={-40}
                            mapBlur={6}
                            radius={9999}
                          >
                            <Menu size={24} />
                          </LiquidGlass>`;
content = content.replace(menuButtonStr, menuReplacement);


fs.writeFileSync('/tmp/App2.tsx', content);
console.log('Step 1 Done');
