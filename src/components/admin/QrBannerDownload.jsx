import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const WIDTH = 1200;
const HEIGHT = 630;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`));
    img.src = src;
  });
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitText(ctx, text, maxWidth, startSize, weight = '800', family = 'Montserrat, Inter, sans-serif') {
  let size = startSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && size > 26) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

function wrapLines(ctx, text, maxWidth, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

async function renderBanner({ tenant, publicUrl }) {
  const storeName = tenant?.storeName || tenant?.name || 'Mi Barbería';
  const primary = /^#[0-9a-f]{3,8}$/i.test(tenant?.primaryColor || '') ? tenant.primaryColor : '#f59e0b';
  const displayUrl = publicUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');

  try {
    await document.fonts?.load('800 64px Montserrat');
    await document.fonts?.load('600 28px Montserrat');
  } catch {
    /* fuentes opcionales */
  }

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // Fondo
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const glow = ctx.createRadialGradient(150, 120, 0, 150, 120, 700);
  glow.addColorStop(0, `${primary}33`);
  glow.addColorStop(1, 'rgba(9,9,11,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, WIDTH - 2, HEIGHT - 2);

  // QR (tarjeta blanca derecha)
  const cardX = 780;
  const cardY = 100;
  const cardW = 340;
  const cardH = 430;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#ffffff';
  roundedRect(ctx, cardX, cardY, cardW, cardH, 34);
  ctx.fill();
  ctx.restore();

  const qrSize = 280;
  const qr = await loadImage(
    `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=0&format=png&data=${encodeURIComponent(publicUrl)}`
  );
  ctx.drawImage(qr, cardX + (cardW - qrSize) / 2, cardY + 30, qrSize, qrSize);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#09090b';
  ctx.font = '800 20px Montserrat, Inter, sans-serif';
  ctx.fillText('ESCANEÁ CON TU CÁMARA', cardX + cardW / 2, cardY + 365);
  ctx.fillStyle = '#71717a';
  ctx.font = '500 15px Montserrat, Inter, sans-serif';
  ctx.fillText('Reservá tu turno sin descargar apps', cardX + cardW / 2, cardY + 393);
  ctx.textAlign = 'left';

  // Columna izquierda
  const leftX = 80;
  const maxTextW = 640;
  let cursorY = 190;

  // Logo (opcional: si falla la carga/CORS se omite)
  const logoSrc = tenant?.logoUrl ? getImageUrl(tenant.logoUrl) : null;
  if (logoSrc) {
    try {
      const logo = await loadImage(logoSrc);
      const size = 96;
      ctx.save();
      roundedRect(ctx, leftX, 70, size, size, 22);
      ctx.clip();
      ctx.fillStyle = '#18181b';
      ctx.fillRect(leftX, 70, size, size);
      const ratio = Math.min(size / logo.width, size / logo.height);
      const w = logo.width * ratio;
      const h = logo.height * ratio;
      ctx.drawImage(logo, leftX + (size - w) / 2, 70 + (size - h) / 2, w, h);
      ctx.restore();
      cursorY = 250;
    } catch {
      /* sin logo */
    }
  }

  // Nombre del local
  ctx.fillStyle = '#ffffff';
  const nameSize = fitText(ctx, storeName, maxTextW, 68);
  ctx.fillText(storeName, leftX, cursorY);
  cursorY += Math.round(nameSize * 0.55);

  // Subtítulo
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 28px Montserrat, Inter, sans-serif';
  ctx.fillText('Reservas Online 24/7', leftX, cursorY + 20);
  cursorY += 50;

  // Pill con URL
  ctx.font = '700 24px "JetBrains Mono", Consolas, monospace';
  const pillW = Math.min(ctx.measureText(displayUrl).width + 72, maxTextW + 20);
  const pillH = 50;
  roundedRect(ctx, leftX, cursorY, pillW, pillH, 25);
  ctx.fillStyle = `${primary}1f`;
  ctx.fill();
  ctx.strokeStyle = `${primary}99`;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.arc(leftX + 26, cursorY + pillH / 2, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f4f4f5';
  ctx.fillText(displayUrl, leftX + 46, cursorY + 33, pillW - 60);
  cursorY += pillH + 38;

  // Datos del local
  ctx.font = '500 20px Montserrat, Inter, sans-serif';
  ctx.fillStyle = '#a1a1aa';
  const infoLines = [];
  if (tenant?.address) infoLines.push(...wrapLines(ctx, tenant.address, maxTextW, 2));
  if (tenant?.openingHours) infoLines.push(tenant.openingHours);
  const contact = tenant?.whatsappPhone || tenant?.phone;
  if (contact) infoLines.push(`WhatsApp: ${contact}`);
  infoLines.slice(0, 4).forEach((line) => {
    ctx.fillText(line, leftX, cursorY, maxTextW);
    cursorY += 30;
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('No se pudo generar el banner'))), 'image/png');
  });
}

export function QrBannerDownload({ tenant, publicUrl, onDone, onError }) {
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    setBusy(true);
    try {
      const blob = await renderBanner({ tenant, publicUrl });
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `banner-qr-${tenant?.slug || 'reservas'}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 2000);
      onDone?.('¡Banner con QR descargado!');
    } catch (err) {
      onError?.(err?.message || 'No se pudo generar el banner');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      className="btn-touch px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
      <span>Descargar Banner QR</span>
    </button>
  );
}

export default QrBannerDownload;
