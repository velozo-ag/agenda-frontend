const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/AgendaPage.jsx', 'utf8');

c = c.replace(
  /<WeeklyCalendar\s+appointments=\{appointments\}\s+selectedDate=\{selectedDate\}\s+barberId=\{selectedBarberId\}\s+onSlotClick=\{handleSlotClick\}\s+onAppointmentClick=\{handleAppointmentClick\}\s+\/>/g,
  '<WeeklyCalendar\n              appointments={appointments}\n              selectedDate={selectedDate}\n              barbers={barbers}\n              barberId={selectedBarberId}\n              onSlotClick={handleSlotClick}\n              onAppointmentClick={handleAppointmentClick}\n            />'
);

if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/AgendaPage.jsx', c, 'utf8');
