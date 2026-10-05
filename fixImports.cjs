const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/AdminSettingsPage.jsx', 'utf8');

c = c.replace(/import { Users, ScissorsAdminPage } from '\.\/UsersAdminPage';\nimport BarbersAdminPage from '\.\/BarbersAdminPage';/, "import { UsersAdminPage } from './UsersAdminPage';");
c = c.replace(/import BarbersAdminPage from '\.\/BarbersAdminPage';\nimport { UsersAdminPage } from '\.\/UsersAdminPage';/, "import { UsersAdminPage } from './UsersAdminPage';\nimport BarbersAdminPage from './BarbersAdminPage';");

c = c.replace(/CreditCard,\n} from 'lucide-react';/, "CreditCard,\n  Scissors,\n} from 'lucide-react';");

if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/AdminSettingsPage.jsx', c, 'utf8');
