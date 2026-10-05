const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/AgendaPage.jsx', 'utf8');

if (!c.includes('useEffect(() => {') || !c.includes('if (view === \'week\' && barbers.length > 1 && !selectedBarberId)')) {
  // Add useEffect to switch view if week is selected for all barbers
  const effectStr = `
  // If multi-barber and 'Todos' is selected, force 'day' view instead of 'week'
  React.useEffect(() => {
    if (view === 'week' && barbers.length > 1 && !selectedBarberId) {
      setView('day');
    }
  }, [view, barbers.length, selectedBarberId]);
  
  const handlePrev = () => {`;
  c = c.replace(/const handlePrev = \(\) => \{/, effectStr);

  // Disable week button if barbers.length > 1 and !selectedBarberId
  c = c.replace(
    /<button\s+key=\{v\.id\}\s+onClick=\{.*?\}/g,
    `$& disabled={v.id === 'week' && barbers.length > 1 && !selectedBarberId}`
  );
  
  // Style disabled button
  c = c.replace(
    /v\.id === 'week' \? 'hidden md:block' : ''\s*\}/,
    `v.id === 'week' ? 'hidden md:block' : ''}\n                    \${(v.id === 'week' && barbers.length > 1 && !selectedBarberId) ? 'opacity-30 cursor-not-allowed' : ''}`
  );
  
  if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
  fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/AgendaPage.jsx', c, 'utf8');
}
