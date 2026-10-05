const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/agenda/WeeklyCalendar.jsx', 'utf8');

c = c.replace(
  /export function WeeklyCalendar\(\{ appointments, onSlotClick, onAppointmentClick, selectedDate, barberId \}\) \{/,
  'export function WeeklyCalendar({ appointments, onSlotClick, onAppointmentClick, selectedDate, barbers = [], barberId }) {'
);

c = c.replace(
  /<AppointmentCard appointment=\{appt\} onClick=\{onAppointmentClick\} \/>/g,
  '<AppointmentCard appointment={appt} barberColor={barbers.find(b => b.id === appt.barberId)?.color} onClick={onAppointmentClick} />'
);

if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/agenda/WeeklyCalendar.jsx', c, 'utf8');
