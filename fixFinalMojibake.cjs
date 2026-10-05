const fs = require('fs');

const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix utf8 mojibake patterns based on the actual matches
  content = content.replace(/facturaciÃ³n/g, 'facturación');
  content = content.replace(/mÃ©tricas/g, 'métricas');
  
  // Also fix any other possible ones just in case
  content = content.replace(/Ã¡/g, 'á');
  content = content.replace(/Ã©/g, 'é');
  content = content.replace(/Ã­/g, 'í');
  content = content.replace(/Ã³/g, 'ó');
  content = content.replace(/Ãº/g, 'ú');
  content = content.replace(/Ã±/g, 'ñ');
  content = content.replace(/Ã /g, 'Á');
  content = content.replace(/Ã‰/g, 'É');
  content = content.replace(/Ã /g, 'Í'); // Í is usually Ã
  content = content.replace(/Ã“/g, 'Ó');
  content = content.replace(/Ãš/g, 'Ú');
  content = content.replace(/Ã‘/g, 'Ñ');

  fs.writeFileSync(filePath, content, 'utf8');
};

fixFile('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/layout/Navbar.jsx');
fixFile('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/DashboardPage.jsx');
