const fs = require('fs');
const files = [
  'C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/components/layout/Navbar.jsx',
  'C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/DashboardPage.jsx'
];

const fixes = {
  'Mǟtricas': 'Métricas',
  'Mǟtricas': 'Métricas',
  'mǟtricas': 'métricas',
  'mǟtricas': 'métricas',
  'Configuraciǟn': 'Configuración',
  'Configuraciǟn': 'Configuración',
  'Salǟn': 'Salón',
  'Salǟn': 'Salón',
  'Sesiǟn': 'Sesión',
  'Sesiǟn': 'Sesión',
  'Facturaciǟn': 'Facturación',
  'Facturaciǟn': 'Facturación',
  'ǟltimos': 'Últimos',
  'ǟltimos': 'Últimos',
  'dǟas': 'días',
  'dǟas': 'días',
  'mǟs': 'más',
  'mǟs': 'más',
  'perǟodo': 'período',
  'perǟodo': 'período'
};

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    for (const [bad, good] of Object.entries(fixes)) {
      if (content.includes(bad)) {
        content = content.split(bad).join(good);
        changed = true;
      }
    }
    
    // Check for other variants
    content = content.replace(/Mǟ.tricas/g, 'Métricas');
    content = content.replace(/mǟ.tricas/g, 'métricas');
    content = content.replace(/Configuraciǟ.n/g, 'Configuración');
    content = content.replace(/Salǟ.n/g, 'Salón');
    content = content.replace(/Sesiǟ.n/g, 'Sesión');
    content = content.replace(/Facturaciǟ.n/g, 'Facturación');
    content = content.replace(/ǟ.ltimos/g, 'Últimos');
    content = content.replace(/dǟ.as/g, 'días');
    content = content.replace(/mǟ.s/g, 'más');
    content = content.replace(/perǟ.odo/g, 'período');
    content = content.replace(/ǽ\?\?'ǽ\?\?'ǽ\?\?'/g, '───');

    // Make sure we don't have BOM
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
