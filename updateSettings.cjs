const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/AdminSettingsPage.jsx', 'utf8');

// Replace tabs array
c = c.replace(
  /\{\s*id:\s*'users',\s*name:\s*'Barberos & Staff',\s*description:\s*'Gesti.n de equipo y roles',\s*icon:\s*Users,\s*\}/g,
  `{ id: 'barbers', name: 'Barberos', description: 'Comisiones y perfiles', icon: Scissors },\n  { id: 'users', name: 'Staff (Admins)', description: 'Otros empleados', icon: Users }`
);

// Add component render
c = c.replace(
  /\{activeTab === 'users' && <UsersAdminPage \/>\}/g,
  `{activeTab === 'barbers' && <BarbersAdminPage />}\n          {activeTab === 'users' && <UsersAdminPage />}`
);

// Add import
c = c.replace(
  /import { UsersAdminPage } from '\.\/UsersAdminPage';/g,
  `import { UsersAdminPage } from './UsersAdminPage';\nimport BarbersAdminPage from './BarbersAdminPage';`
);

// Also add Scissors icon
c = c.replace(
  /import \{ (.*?)Users/g,
  `import { $1Users, Scissors`
);

if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/AdminSettingsPage.jsx', c, 'utf8');
