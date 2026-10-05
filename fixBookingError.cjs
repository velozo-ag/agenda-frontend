const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/BookingPage.jsx', 'utf8');

if (!c.includes("if (isSalonError) {")) {
  c = c.replace(
    /const \{ data: salonInfoData, isLoading: isSalonLoading \} = useSalonInfo\(slug\);/,
    "const { data: salonInfoData, isLoading: isSalonLoading, isError: isSalonError } = useSalonInfo(slug);"
  );

  c = c.replace(
    /if \(isSalonLoading\) \{/,
    `if (isSalonError) {
    // If tenant doesn't exist (e.g. unknown subdomain), redirect to landing page
    if (typeof window !== 'undefined') {
      window.location.href = 'https://agenda.roosty.com.ar';
      return null;
    }
  }

  if (isSalonLoading) {`
  );

  if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
  fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/pages/BookingPage.jsx', c, 'utf8');
}
