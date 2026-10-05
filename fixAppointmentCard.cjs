const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/agenda/AppointmentCard.jsx', 'utf8');

// Add barberColor to props
c = c.replace(
  /export function AppointmentCard\(\{ appointment, onClick \}\) \{/,
  'export function AppointmentCard({ appointment, barberColor, onClick }) {'
);

// Inject inline styles for the bar and dot
c = c.replace(
  /<div className=\{`w-\[3px\] self-stretch rounded-full shrink-0 my-1 \$\{styles\.bar\}`\} \/>/g,
  '<div className={`w-[3px] self-stretch rounded-full shrink-0 my-1 ${styles.bar}`} style={barberColor ? { backgroundColor: barberColor } : {}} />'
);

c = c.replace(
  /<div className=\{`w-\[3px\] shrink-0 self-stretch rounded-l-xl \$\{styles\.bar\}`\} \/>/g,
  '<div className={`w-[3px] shrink-0 self-stretch rounded-l-xl ${styles.bar}`} style={barberColor ? { backgroundColor: barberColor } : {}} />'
);

c = c.replace(
  /<div className=\{`h-0\.5 rounded-full mb-1\.5 mx-1 shrink-0 \$\{styles\.dot\}`\} \/>/g,
  '<div className={`h-0.5 rounded-full mb-1.5 mx-1 shrink-0 ${styles.dot}`} style={barberColor ? { backgroundColor: barberColor } : {}} />'
);

if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/agenda/AppointmentCard.jsx', c, 'utf8');
