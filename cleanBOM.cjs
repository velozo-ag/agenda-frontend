const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/barbers/BarberFormModal.jsx', 'utf8');
if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/barbers/BarberFormModal.jsx', c, 'utf8');
