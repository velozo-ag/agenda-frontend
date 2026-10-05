const fs = require('fs');

const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix utf8 mojibake patterns
  content = content.replace(/LlevÃ¡s/g, 'Llevás');
  content = content.replace(/PÃºblico/g, 'Público');
  content = content.replace(/ConfiguraciÃ³n/g, 'Configuración');
  content = content.replace(/SalÃ³n/g, 'Salón');
  content = content.replace(/MÃ©tricas/g, 'Métricas');
  content = content.replace(/SesiÃ³n/g, 'Sesión');
  content = content.replace(/FacturaciÃ³n/g, 'Facturación');
  content = content.replace(/Ãšltimos/g, 'Últimos');
  content = content.replace(/dÃ­as/g, 'días');
  content = content.replace(/mÃ¡s/g, 'más');
  content = content.replace(/perÃ­odo/g, 'período');
  content = content.replace(/â”€â”€â”€/g, '───');

  fs.writeFileSync(filePath, content, 'utf8');
};

fixFile('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/layout/Navbar.jsx');
fixFile('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/DashboardPage.jsx');
