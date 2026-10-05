const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/router/AppRouter.jsx', 'utf8');

if (!c.includes("import { LandingPage }")) {
  c = c.replace(
    /import \{ BookingPage \} from '\.\.\/pages\/BookingPage';/,
    "import { BookingPage } from '../pages/BookingPage';\nimport { LandingPage } from '../pages/LandingPage';"
  );
}

if (!c.includes("const tenantSlug = getTenantSlug();")) {
  c = c.replace(
    /function ProtectedLayoutContent\(\) \{/,
    "function ProtectedLayoutContent() {\n  const tenantSlug = getTenantSlug();"
  );
}

c = c.replace(
  /<Route path="\/" element=\{<BookingPage \/>\} \/>/g,
  '<Route path="/" element={tenantSlug ? <BookingPage /> : <LandingPage />} />'
);

c = c.replace(
  /<Route path="\/book" element=\{<BookingPage \/>\} \/>/g,
  '<Route path="/book" element={tenantSlug ? <BookingPage /> : <LandingPage />} />'
);

// If someone goes to /agenda or /login on the root domain, they shouldn't if there's no tenant, but for now we only override / and /book

if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/router/AppRouter.jsx', c, 'utf8');
