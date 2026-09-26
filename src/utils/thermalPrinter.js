/**
 * Isolated Thermal Printing Utility for 80mm POS Printers
 * 
 * Renders print content into a clean, isolated iframe with 0 DOM pollution from Tailwind,
 * dark overlays, or main app styles. Ensures pure white background, crisp high-contrast
 * text, and exact roll height without wasting paper.
 */

export function printThermalElement(element) {
  if (!element) return;

  const htmlContent = typeof element === 'string' ? element : (element.innerHTML || element.outerHTML);

  // Remove existing print iframes if any
  const existingIframe = document.getElementById('pos-thermal-print-iframe');
  if (existingIframe && document.body.contains(existingIframe)) {
    document.body.removeChild(existingIframe);
  }

  // Create isolated invisible iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'pos-thermal-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    // Fallback if iframe access fails
    window.print();
    return;
  }

  const thermalCss = `
    @page {
      size: 80mm auto;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: #000000 !important;
      background: transparent !important;
      text-shadow: none !important;
      box-shadow: none !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      width: 80mm;
      max-width: 80mm;
      margin: 0 auto;
      padding: 0;
      background: #ffffff !important;
      color: #000000 !important;
      font-family: 'JetBrains Mono', 'Courier New', Courier, monospace, sans-serif;
      font-size: 11.5px;
      line-height: 1.35;
      overflow: visible;
    }
    .ticket-wrapper {
      width: 72mm;
      max-width: 72mm;
      margin: 0 auto;
      padding: 2mm 0 4mm 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }
    .font-black { font-weight: 900; }
    .uppercase { text-transform: uppercase; }
    .italic { font-style: italic; }
    
    /* Support classes from ticket markup */
    .border-b, .border-t, .border-dashed {
      border-color: #000000 !important;
      border-style: dashed !important;
      border-width: 1px !important;
    }
    .border-solid {
      border-style: solid !important;
    }
    .border {
      border-color: #000000 !important;
      border-width: 1px !important;
      border-style: solid !important;
    }
    .rounded, .rounded-xl, .rounded-2xl {
      border-radius: 0 !important;
    }
    .space-y-0\\.5 > * + * { margin-top: 2px; }
    .space-y-1 > * + * { margin-top: 4px; }
    .space-y-1\\.5 > * + * { margin-top: 5px; }
    .space-y-2 > * + * { margin-top: 6px; }
    .space-y-2\\.5 > * + * { margin-top: 7px; }
    .space-y-3 > * + * { margin-top: 8px; }
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .text-xs { font-size: 11.5px; }
    .text-sm { font-size: 13px; }
    .text-base { font-size: 14.5px; }
    .text-lg { font-size: 16px; }
    .text-\\[10px\\] { font-size: 10px; }
    .text-\\[11px\\] { font-size: 11px; }
    .text-\\[9px\\] { font-size: 9px; }
    .pb-0\\.5 { padding-bottom: 2px; }
    .pb-1 { padding-bottom: 3px; }
    .pb-2 { padding-bottom: 5px; }
    .pb-3 { padding-bottom: 7px; }
    .pt-1 { padding-top: 3px; }
    .pt-1\\.5 { padding-top: 4px; }
    .pt-2 { padding-top: 5px; }
    .pl-2 { padding-left: 5px; }
    .pl-4 { padding-left: 10px; }
    .pl-6 { padding-left: 14px; }
    .pr-2 { padding-right: 5px; }
    .p-1 { padding: 3px; }
    .p-1\\.5 { padding: 4px; }
    .p-2 { padding: 5px; }
    .p-3 { padding: 7px; }
    .p-4 { padding: 8px; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .shrink-0 { flex-shrink: 0; }
    .flex-1 { flex: 1 1 0%; }
    .block { display: block; }
    .inline-block { display: inline-block; }
    .num-tabular { font-variant-numeric: tabular-nums; }
  `;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Ticket POS 80mm</title>
        <style>${thermalCss}</style>
      </head>
      <body>
        <div class="ticket-wrapper">
          ${htmlContent}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Trigger print in iframe after render
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error('Error invoking print on thermal iframe', err);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }
  }, 100);
}
