const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/agenda/DayView.jsx', 'utf8');

c = c.replace(
  /<AppointmentCard appointment=\{appt\} onClick=\{onAppointmentClick\} \/>/g,
  '<AppointmentCard appointment={appt} barberColor={barbers.find(b => b.id === appt.barberId)?.color} onClick={onAppointmentClick} />'
);

if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/agenda/DayView.jsx', c, 'utf8');
