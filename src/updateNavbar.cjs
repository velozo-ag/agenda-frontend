const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/layout/Navbar.jsx', 'utf8');
c = c.replace(
  /<div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto md:ml-0">\s*{\/\* Ver Portal Clientes shortcut/,
  '<div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto md:ml-0">\n            {isAdmin && (\n              <button onClick={() => handleNav(\'/dashboard\')} className="btn-touch p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors cursor-pointer shrink-0 hidden sm:flex" title="Dashboard">\n                <BarChart2 className="w-5 h-5" />\n              </button>\n            )}\n            {/* Ver Portal Clientes shortcut'
);
if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/layout/Navbar.jsx', c, 'utf8');
