import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  Download,
  CheckCircle2,
  Calendar,
  CalendarDays,
  Scissors,
  CreditCard,
  ShieldCheck,
  Clock,
  Wallet,
  Check,
  Maximize2,
  Minimize2,
  Loader2,
  Mail,
  Smartphone,
  X,
  Ban,
} from 'lucide-react';
import { AgendaPhoneDemo } from '../components/landing/AgendaPhoneDemo';
import { BookingPortalPhoneDemo } from '../components/landing/BookingPortalPhoneDemo';

/**
 * WhatsApp Business Catalog Studio (/catalog-cards)
 * - Exportación nativa a 3240 × 3240 px (pixelRatio: 3 sobre lienzo de 1080 × 1080 px).
 * - Tipografía 100% Inter (font-sans) + JetBrains Mono (lp-mono), sin serif.
 * - Distribución espacial idéntica a `01-roosty-pos-portada.png` y `roostyposcards.png`.
 */
export function CatalogCardsPage() {
  const [realSize, setRealSize] = useState(false);
  const [backPhoneView, setBackPhoneView] = useState('day'); // 'day' | 'list'
  const [downloadingId, setDownloadingId] = useState(null);
  const [capturingId, setCapturingId] = useState(null);

  React.useEffect(() => {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const googlebotMeta = document.querySelector('meta[name="googlebot"]');
    const prevRobots = robotsMeta?.getAttribute('content');
    const prevGooglebot = googlebotMeta?.getAttribute('content');
    if (robotsMeta) robotsMeta.setAttribute('content', 'noindex, nofollow');
    if (googlebotMeta) googlebotMeta.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (robotsMeta && prevRobots) robotsMeta.setAttribute('content', prevRobots);
      if (googlebotMeta && prevGooglebot) googlebotMeta.setAttribute('content', prevGooglebot);
    };
  }, []);

  const exportCardAsPng = async (elementId, fileName, width = 1080, height = 1080, pixelRatio = 3) => {
    flushSync(() => {
      setCapturingId(elementId);
    });

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 100));

    const node = document.getElementById(elementId);
    if (!node) {
      setCapturingId(null);
      return;
    }

    const { toPng } = await import('https://esm.sh/html-to-image@1.11.11');
    const dataUrl = await toPng(node, {
      width,
      height,
      pixelRatio,
      quality: 1,
      cacheBust: true,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
      },
    });

    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleDownloadSingle = async (elementId, fileName, width = 1080, height = 1080, pixelRatio = 3) => {
    if (downloadingId) return;
    try {
      setDownloadingId(elementId);
      await exportCardAsPng(elementId, fileName, width, height, pixelRatio);
    } catch (err) {
      console.error('Error al exportar PNG:', err);
    } finally {
      setCapturingId(null);
      setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    if (downloadingId) return;
    const cards = [
      { id: 'card-roosty-agenda-og', name: 'og-roosty-agenda', width: 1200, height: 630, pixelRatio: 1 },
      { id: 'card-roosty-agenda-1', name: '01-roosty-agenda-portada', width: 1080, height: 1080, pixelRatio: 3 },
      { id: 'card-roosty-agenda-2', name: '02-roosty-agenda-flujo-turnos', width: 1080, height: 1080, pixelRatio: 3 },
      { id: 'card-roosty-agenda-3', name: '03-roosty-agenda-ficha-tecnica', width: 1080, height: 1080, pixelRatio: 3 },
    ];
    try {
      setDownloadingId('ALL');
      for (const c of cards) {
        await exportCardAsPng(c.id, c.name, c.width, c.height, c.pixelRatio);
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (err) {
      console.error('Error al exportar todas las imágenes:', err);
    } finally {
      setCapturingId(null);
      setDownloadingId(null);
    }
  };

  return (
    <div className="lp-root min-h-screen bg-[#070709] text-zinc-100 pb-28 selection:bg-indigo-500/30 selection:text-indigo-300 font-sans">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HEADER STUDIO
      ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="rounded-2xl bg-[#111114] border border-white/10 p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-2xl">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              title="Volver a la landing"
              className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 hover:border-indigo-500/40 transition-colors"
            >
              <img src="/inspo/roostylogo.png" alt="Roosty" className="w-9 h-9 object-contain" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  WhatsApp Business Catalog Studio
                </h1>
                <span className="lp-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  3240 × 3240 PX (3X ULTRA HD)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                3 placas cuadradas con las capturas reales de la Agenda y Portal Público listas para descargar en PNG.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Selector de vista del teléfono admin */}
            <div className="inline-flex items-center rounded-xl bg-zinc-950 border border-white/10 p-1 text-xs">
              <button
                type="button"
                onClick={() => setBackPhoneView('day')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  backPhoneView === 'day' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Admin: Grilla Día
              </button>
              <button
                type="button"
                onClick={() => setBackPhoneView('list')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  backPhoneView === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Admin: Lista
              </button>
            </div>

            {/* Segmented Toggle Escala */}
            <div className="inline-flex items-center rounded-xl bg-zinc-950 border border-white/10 p-1 text-xs">
              <button
                type="button"
                onClick={() => setRealSize(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  !realSize ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Vista Ajustada (65%)</span>
              </button>
              <button
                type="button"
                onClick={() => setRealSize(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  realSize ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Tamaño Real 1080×1080</span>
              </button>
            </div>

            {/* Botón Descargar Todas */}
            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={Boolean(downloadingId)}
              className="lp-btn-indigo inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-60"
            >
              {downloadingId === 'ALL' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Exportando OG + 3 PNGs...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar Todo (OG + 3 Cards)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          LISTA VERTICAL DE LAS TARJETAS DE CATÁLOGO Y OPENGRAPH
      ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-14">
        {/* ─────────────────────────────────────────────────────────────────────────
            OPENGRAPH BANNER (1200 × 630 PX) — PREVISUALIZACIÓN DE LINK EN WHATSAPP / REDES
            Misma estética y elementos que la Portada (Card 1), diagramado en formato
            horizontal 1200×630 px para que WhatsApp muestre la tarjeta gigante sin recortar nada.
        ───────────────────────────────────────────────────────────────────────── */}
        <CatalogSectionBlock
          overline="OPENGRAPH BANNER (1200 × 630 PX) • PREVISUALIZACIÓN DE ENLACE EN WHATSAPP Y REDES"
          title="Portada Horizontal Oficial para og:image (Guardar como public/og-roosty-agenda.png)"
          buttonLabel="Descargar og-roosty-agenda.png (1200×630)"
          elementId="card-roosty-agenda-og"
          fileName="og-roosty-agenda"
          width={1200}
          height={630}
          pixelRatio={1}
          realSize={realSize}
          capturingId={capturingId}
          downloadingId={downloadingId}
          onDownload={handleDownloadSingle}
        >
          <div
            id="card-roosty-agenda-og"
            style={{ width: 1200, height: 630 }}
            className="relative w-[1200px] h-[630px] bg-[#f5f4f0] text-zinc-950 overflow-hidden flex items-center justify-between px-12 py-10 select-none font-sans"
          >
            {/* Luz de estudio */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_0%,#ffffff_0%,#f5f4f0_65%,#e7e5de_100%)] pointer-events-none" />
            <div className="absolute right-[110px] top-1/2 -translate-y-1/2 w-[500px] h-[440px] rounded-full bg-indigo-500/12 blur-[75px] pointer-events-none" />

            {/* COLUMNA IZQUIERDA: Header + Titular + Pills + Badge 0% Comisión + Dominio */}
            <div className="relative z-30 w-[565px] h-full flex flex-col justify-between items-start text-left py-1">
              {/* Top: Logo + Divisor + Pill */}
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <img
                    src="/inspo/roostylogoname.png"
                    alt="Roosty"
                    className="h-12 w-auto object-contain"
                  />
                  <div className="h-6 w-[1.5px] bg-zinc-300" />
                  <div className="px-3.5 py-1.5 rounded-full bg-zinc-900 text-white">
                    <span className="lp-mono text-xs font-extrabold tracking-[0.18em] uppercase text-white">
                      ROOSTY AGENDA // TURNOS 24/7
                    </span>
                  </div>
                </div>

                <h2 className="font-sans text-[50px] font-black leading-[1.04] tracking-tighter text-zinc-950 mb-5">
                  Más cortes, cero caos y tu agenda{' '}
                  <span className="text-indigo-600">en un solo lugar.</span>
                </h2>

                <p className="font-sans text-[19px] font-medium text-zinc-600 leading-snug tracking-tight max-w-[520px] mb-5">
                  Reservas online 24/7 con link propio para Instagram y WhatsApp, cobro de señas y liquidación automática de comisiones.
                </p>

                {/* Chips técnicos rápidos */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    'Link propio 24/7',
                    'Señas por transferencia',
                    'Recordatorios por correo',
                    'Comisiones por barbero',
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200/90 text-xs font-bold text-zinc-800 shadow-xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom: Badge 0% Comisión + Dominio */}
              <div className="flex flex-col items-start gap-3">
                <div className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-zinc-900 border border-zinc-800 shadow-[0_16px_36px_rgba(0,0,0,0.25)]">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3.5] text-white" />
                  </div>
                  <span className="font-sans text-[23px] font-extrabold tracking-tight leading-none text-white">
                    0% Comisión por turno
                  </span>
                </div>

                <div className="flex items-center gap-3.5 text-[13px] font-semibold text-zinc-600 pl-1">
                  <span>100% Web en la Nube</span>
                  <span>•</span>
                  <span>PC, Tablet y Celular</span>
                  <span>•</span>
                  <span className="lp-mono font-bold text-indigo-600">agenda.roosty.com.ar</span>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Los 2 celulares reales en proporción exacta dentro de los 630px de alto */}
            <div className="relative z-20 w-[535px] h-[590px]">
              {/* 1) IZQUIERDA (ATRÁS / AGENDA DEL SALÓN) */}
              <div
                className="absolute left-[10px] top-[-36px] z-10 origin-center"
                style={{
                  transform: 'scale(0.81) rotate(-3.5deg)',
                  filter: 'drop-shadow(0 26px 45px rgba(0,0,0,0.34))',
                }}
              >
                <div className="mb-2.5 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 shadow-lg">
                    <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="lp-mono text-[11px] font-bold tracking-[0.16em] uppercase text-indigo-400">
                      AGENDA DEL SALÓN
                    </span>
                  </div>
                </div>
                <AgendaPhoneDemo forcedTab={backPhoneView} isStatic={true} hideFloatingKpis={true} />
              </div>

              {/* 2) DERECHA (ADELANTE / RESERVAS ONLINE 24/7) */}
              <div
                className="absolute right-[-6px] top-[-42px] z-20 origin-center"
                style={{
                  transform: 'scale(0.84) rotate(3.5deg)',
                  filter: 'drop-shadow(-20px 32px 50px rgba(0,0,0,0.48))',
                }}
              >
                <div className="mb-2.5 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 shadow-lg">
                    <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="lp-mono text-[11px] font-bold tracking-[0.16em] uppercase text-indigo-400">
                      RESERVAS ONLINE 24/7
                    </span>
                  </div>
                </div>
                <BookingPortalPhoneDemo
                  forcedStep={2}
                  isStatic={true}
                  businessName="Barbería El Barón"
                  slug="elbaron"
                  preset={{
                    tag: 'Barbería clásica',
                    items: [
                      { name: 'Corte + Barba', desc: '45 min', price: '$13.500' },
                      { name: 'Corte Fade', desc: '30 min', price: '$9.000', hint: 'Requiere seña de $4.500' },
                      { name: 'Perfilado Barba', desc: '30 min', price: '$6.500' },
                    ],
                    cart: 'Corte Fade • Lucho',
                    cartPrice: '$9.000',
                  }}
                />
              </div>
            </div>
          </div>
        </CatalogSectionBlock>
        {/* ─────────────────────────────────────────────────────────────────────────
            IMAGEN 01 • PORTADA DE CATÁLOGO (MINIATURA PRINCIPAL)
            - Arriba: Logo (h-14) + divisor + Pill + Titular Sans en 2 líneas
            - Centro: Los dos celulares escalados proporcionalmente y acomodados comercialmente
            - Abajo: Badge "0% Comisión por turno" + línea de plataforma
        ───────────────────────────────────────────────────────────────────────── */}
        <CatalogSectionBlock
          overline="IMAGEN 01 • PORTADA DE CATÁLOGO (MINIATURA PRINCIPAL)"
          title="Doble Mockup Comercial: Agenda del Salón + Portal Público de Reservas 24/7"
          buttonLabel="Descargar Imagen 1 (PNG)"
          elementId="card-roosty-agenda-1"
          fileName="01-roosty-agenda-portada"
          realSize={realSize}
          capturingId={capturingId}
          downloadingId={downloadingId}
          onDownload={handleDownloadSingle}
        >
          <div
            id="card-roosty-agenda-1"
            style={{ width: 1080, height: 1080 }}
            className="relative w-[1080px] h-[1080px] bg-[#f5f4f0] text-zinc-950 overflow-hidden flex flex-col justify-between px-10 pt-9 pb-8 select-none font-sans"
          >
            {/* Luz de estudio idéntica a 01-roosty-pos-portada.png */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#ffffff_0%,#f5f4f0_65%,#e7e5de_100%)] pointer-events-none" />

            {/* ── 2. HEADER / TOP ── */}
            <div className="relative z-30 flex flex-col items-center text-center pt-1">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="/inspo/roostylogoname.png"
                  alt="Roosty"
                  className="h-14 w-auto object-contain"
                />
                <div className="h-6 w-[1.5px] bg-zinc-300" />
                <div className="px-4 py-1.5 rounded-full bg-zinc-900 text-white">
                  <span className="lp-mono text-sm font-extrabold tracking-[0.2em] uppercase text-white">
                    ROOSTY AGENDA // TURNOS 24/7
                  </span>
                </div>
              </div>

              <h2 className="font-sans max-w-[920px] text-[52px] font-black leading-[1.06] tracking-tighter text-zinc-950">
                Más cortes, cero caos y tu agenda{' '}
                <span className="text-indigo-600">en un solo lugar.</span>
              </h2>
            </div>

            {/* ── COMPOSICIÓN CENTRAL (Doble celular escalado proporcionalmente y centrado comercialmente) ── */}
            <div className="relative z-20 flex-1 flex items-center justify-center">
              <div className="relative w-[960px] h-[700px]">
                {/* Resplandor sutil central detrás de ambos teléfonos */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[520px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

                {/* 1) IZQUIERDA (ATRÁS / PANEL DEL SALÓN): AgendaPhoneDemo escalado proporcionalmente */}
                <div
                  className="absolute left-[105px] top-[70px] z-10 origin-center"
                  style={{
                    transform: 'scale(1.13) rotate(-3.5deg)',
                    filter: 'drop-shadow(0 32px 55px rgba(0,0,0,0.34))',
                  }}
                >
                  <div className="mb-2.5 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 shadow-lg">
                      <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="lp-mono text-[11px] font-bold tracking-[0.16em] uppercase text-indigo-400">
                        AGENDA DEL SALÓN
                      </span>
                    </div>
                  </div>
                  <AgendaPhoneDemo forcedTab={backPhoneView} isStatic={true} hideFloatingKpis={true} />
                </div>

                {/* 2) DERECHA (ADELANTE / PORTAL DE RESERVAS PÚBLICO): BookingPortalPhoneDemo escalado proporcionalmente */}
                <div
                  className="absolute right-[105px] top-[40px] z-20 origin-center"
                  style={{
                    transform: 'scale(1.16) rotate(5deg)',
                    filter: 'drop-shadow(-24px 38px 60px rgba(0,0,0,0.48))',
                  }}
                >
                  <div className="mb-2.5 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 shadow-lg">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="lp-mono text-[11px] font-bold tracking-[0.16em] uppercase text-indigo-400">
                        RESERVAS ONLINE 24/7
                      </span>
                    </div>
                  </div>
                  <BookingPortalPhoneDemo
                    forcedStep={2}
                    isStatic={true}
                    businessName="Barbería El Barón"
                    slug="elbaron"
                    preset={{
                      tag: 'Barbería clásica',
                      items: [
                        { name: 'Corte + Barba', desc: '45 min', price: '$13.500' },
                        { name: 'Corte Fade', desc: '30 min', price: '$9.000', hint: 'Requiere seña de $4.500' },
                        { name: 'Perfilado Barba', desc: '30 min', price: '$6.500' },
                      ],
                      cart: 'Corte Fade • Lucho',
                      cartPrice: '$9.000',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── 3. FOOTER / BOTTOM (Proporciones exactas de 01-roosty-pos-portada.png) ── */}
            <div className="relative z-30 flex flex-col items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-3.5 px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
                <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3.5] text-white" />
                </div>
                <span className="font-sans text-[26px] font-extrabold tracking-tight leading-none text-white">
                  0% Comisión por turno
                </span>
              </div>

              <div className="flex items-center gap-5 text-sm font-semibold text-zinc-600">
                <span>100% Web en la Nube</span>
                <span>•</span>
                <span>PC, Tablet y Celular</span>
                <span>•</span>
                <span className="lp-mono font-bold text-indigo-600">agenda.roosty.com.ar</span>
              </div>
            </div>
          </div>
        </CatalogSectionBlock>

        {/* ─────────────────────────────────────────────────────────────────────────
            IMAGEN 02 • EL "ANTI-CLAVOS" (FLUJO CRÍTICO: SEÑA + RECORDATORIO AUTOMÁTICO)
            Distribución idéntica a la Imagen 2 de `roostyposcards.png`
        ───────────────────────────────────────────────────────────────────────── */}
        <CatalogSectionBlock
          overline='IMAGEN 02 • FLUJO ANTI-AUSENCIAS (RESERVA, SEÑA Y RECORDATORIO)'
          title="Zoom al Detalle de Reserva con Seña + Plantilla de Recordatorio Automático por Correo"
          buttonLabel="Descargar Imagen 2 (PNG)"
          elementId="card-roosty-agenda-2"
          fileName="02-roosty-agenda-flujo-turnos"
          realSize={realSize}
          capturingId={capturingId}
          downloadingId={downloadingId}
          onDownload={handleDownloadSingle}
        >
          <div
            id="card-roosty-agenda-2"
            style={{ width: 1080, height: 1080 }}
            className="relative w-[1080px] h-[1080px] bg-[#09090b] text-zinc-100 overflow-hidden flex flex-col justify-between p-12 select-none font-sans"
          >
            {/* Resplandor superior suave (igual a Imagen 2 de roostyposcards.png) */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[820px] h-[380px] bg-indigo-500/20 blur-[140px] pointer-events-none rounded-full" />

            {/* HEADER SUPERIOR */}
            <div className="relative z-20 flex flex-col items-center text-center pt-1">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 mb-4">
                <span className="lp-mono text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                  PASO A PASO EN VIVO // RESERVA ONLINE A SILLA ASEGURADA
                </span>
              </div>

              <h2 className="font-sans text-[50px] font-black tracking-tighter text-white leading-[1.06] max-w-[920px]">
                Del link de tu bio a tu agenda{' '}
                <span className="text-indigo-400">sin responder un mensaje.</span>
              </h2>
            </div>

            {/* CENTRO: 2 COLUMNAS CON LA MISMA ESTRUCTURA EXACTA DE ROOSTYPOSCARDS IMAGEN 2 */}
            <div className="relative z-20 grid grid-cols-2 gap-7 my-auto items-stretch">
              {/* COLUMNA IZQUIERDA: TARJETA DE RESERVA ENTRANTE CON SEÑA (Misma distribución que Pedido #46) */}
              <div className="flex flex-col">
                <div className="mb-3">
                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 lp-mono text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-400">
                    1. ENTRA LA RESERVA CON SEÑA DESDE TU LINK
                  </span>
                </div>

                <div className="flex-1 rounded-[24px] bg-[#111114] border border-zinc-800/90 p-6 flex flex-col justify-between shadow-2xl">
                  <div>
                    {/* Fila superior: Turno #204 • Joaquín + Badge SEÑA PAGADA */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-white tracking-tight">Turno #204</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-lg font-semibold text-zinc-300">Joaquín Pérez</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500 text-white lp-mono text-[10px] font-extrabold uppercase tracking-wider">
                          <Wallet className="w-3 h-3" /> SEÑA PAGADA
                        </span>
                        <X className="w-4 h-4 text-zinc-500" />
                      </div>
                    </div>

                    {/* Barra de horario y profesional */}
                    <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 px-4 py-3 flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span>Viernes 9 Oct • 15:30 hs</span>
                      </div>
                      <span className="lp-mono text-[11px] text-zinc-400 font-semibold">
                        45 MIN • <strong className="text-zinc-200">TRANSFERENCIA</strong>
                      </span>
                    </div>

                    {/* Detalle de servicios */}
                    <div className="lp-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 mb-2.5 text-left">
                      DETALLE DEL TURNO (2)
                    </div>

                    <div className="space-y-2.5 mb-5">
                      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 lp-mono text-xs font-bold">
                            1x
                          </span>
                          <span className="text-sm font-bold text-white">Corte Fade + Barba</span>
                        </div>
                        <span className="lp-mono text-sm font-bold text-white">$13.500</span>
                      </div>

                      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 lp-mono text-xs font-bold">
                            PRO
                          </span>
                          <span className="text-sm font-bold text-white">Barbero: Tomás Rodríguez</span>
                        </div>
                        <span className="lp-mono text-xs font-bold text-emerald-400">Comisión 50%</span>
                      </div>
                    </div>

                    {/* Desglose de Seña y Saldo */}
                    <div className="space-y-3 pt-3 border-t border-zinc-800/80 text-sm">
                      <div className="flex justify-between items-center text-zinc-300">
                        <span className="font-medium">Valor Total del Servicio:</span>
                        <span className="lp-mono font-bold text-white">$ 13.500</span>
                      </div>

                      <div className="flex justify-between items-center text-zinc-300">
                        <span className="flex items-center gap-1.5 font-medium text-xs">
                          <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Seña Acreditada:
                        </span>
                        <div className="flex items-center gap-1.5 lp-mono text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                            $3.000
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500 text-indigo-300 font-bold">
                            $5.000
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                            50%
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-indigo-500/[0.08] border border-indigo-500/30 px-4 py-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Saldo a Cobrar en Salón:</span>
                        <span className="lp-mono text-2xl font-black text-indigo-400">$ 8.500</span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción inferiores (Idénticos a Rechazar + Aceptar y Marchar) */}
                  <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center gap-4">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400/90 px-2">
                      <Ban className="w-3.5 h-3.5" />
                      <span>Rechazar</span>
                    </div>
                    <div className="flex-1 py-3.5 px-4 rounded-xl bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Confirmar Turno</span>
                      <span className="ml-1 px-2 py-0.5 rounded bg-black/25 lp-mono text-[10px]">Enter</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: RECORDATORIO AUTOMÁTICO POR CORREO + IMPACTO EN AGENDA */}
              <div className="flex flex-col">
                <div className="mb-3">
                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 lp-mono text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-300">
                    2. ENVÍA RECORDATORIO POR CORREO Y BLINDA LA AGENDA
                  </span>
                </div>

                <div className="flex-1 rounded-[24px] bg-[#111114] border border-zinc-800/90 p-6 flex flex-col justify-between shadow-2xl">
                  {/* Header tipo KDS */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
                    <div className="w-11 h-11 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-white tracking-tight uppercase">
                          NOTIFICACIONES & AGENDA
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 lp-mono text-[9px] font-bold uppercase">
                          • AUTOMÁTICO
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Confirmación al instante • Recordatorio 24 hs antes
                      </p>
                    </div>
                  </div>

                  {/* Card interna con borde de acento (igual a COMANDA EN COCINA en roostyposcards.png) */}
                  <div className="my-4 flex-1 rounded-2xl bg-[#0c0c10] border border-indigo-500/40 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-zinc-800/80">
                        <div className="text-left">
                          <div className="lp-mono text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            #204 • CLIENTE JOAQUÍN PÉREZ
                          </div>
                          <div className="text-2xl font-black text-white tracking-tight leading-tight mt-1">
                            RECORDATORIO ENVIADO
                          </div>
                        </div>

                        <div className="px-3 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center gap-2 text-indigo-300 lp-mono text-xs font-bold shrink-0">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <div className="text-left leading-tight">
                            <div>24:00 HS</div>
                            <div className="text-[9px] text-indigo-400">ANTES</div>
                          </div>
                        </div>
                      </div>

                      {/* Dos bloques de estado con tilde (igual a los items de KDS en roostyposcards.png) */}
                      <div className="space-y-3">
                        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-4 flex items-center justify-between gap-3 text-left">
                          <div className="flex items-start gap-3">
                            <span className="px-2 py-1 rounded bg-sky-500/20 text-sky-400 lp-mono text-[10px] font-bold uppercase shrink-0 mt-0.5">
                              EMAIL
                            </span>
                            <div>
                              <div className="text-base font-extrabold text-white leading-snug">
                                ¡Tu cita es mañana a las 15:30 hs!
                              </div>
                              <div className="text-xs font-semibold text-indigo-400 mt-1">
                                | + Botón para reprogramar con anticipación
                              </div>
                            </div>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        </div>

                        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-4 flex items-center justify-between gap-3 text-left">
                          <div className="flex items-start gap-3">
                            <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 lp-mono text-[10px] font-bold uppercase shrink-0 mt-0.5">
                              CAJA
                            </span>
                            <div>
                              <div className="text-base font-extrabold text-white leading-snug">
                                Comisión calculada para Tomás
                              </div>
                              <div className="text-xs font-semibold text-emerald-400 mt-1">
                                | + Liquidación lista al cerrar el turno
                              </div>
                            </div>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botón verde inferior idéntico a "Marchar Todo el Ticket" */}
                    <div className="w-full py-3.5 rounded-xl bg-emerald-600/80 border border-emerald-500/40 text-white font-extrabold text-sm flex items-center justify-center gap-2 mt-4">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Asistencia Confirmada • Cero Ausencias</span>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500 flex items-center justify-between">
                    <span>Plantillas con la marca de tu salón</span>
                    <span className="lp-mono text-indigo-400 font-bold">100% Automático</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER BAR (Idéntico a Imagen 2 de roostyposcards.png) */}
            <div className="relative z-20 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/inspo/roostylogo.png" alt="Roosty" className="h-8 w-auto object-contain" />
                <span className="text-base font-extrabold text-white tracking-tight">Roosty Agenda</span>
                <span className="text-zinc-600">•</span>
                <span className="text-sm text-zinc-400 font-medium">
                  Sin agendar a mano • Recordatorios automáticos por correo
                </span>
              </div>

              <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 lp-mono text-sm font-bold text-zinc-200">
                agenda.roosty.com.ar
              </div>
            </div>
          </div>
        </CatalogSectionBlock>

        {/* ─────────────────────────────────────────────────────────────────────────
            IMAGEN 03 • PLACA TÉCNICA DE BENEFICIOS (PARA COMPARTIR ENTRE SOCIOS)
            Distribución idéntica a la Imagen 3 de `roostyposcards.png`
        ───────────────────────────────────────────────────────────────────────── */}
        <CatalogSectionBlock
          overline="IMAGEN 03 • PLACA TÉCNICA DE BENEFICIOS (PARA COMPARTIR ENTRE SOCIOS)"
          title="Placa Oscura Lisa con Icons Lucide y los 4 Puntos Clave Grandes y Legibles"
          buttonLabel="Descargar Imagen 3 (PNG)"
          elementId="card-roosty-agenda-3"
          fileName="03-roosty-agenda-ficha-tecnica"
          realSize={realSize}
          capturingId={capturingId}
          downloadingId={downloadingId}
          onDownload={handleDownloadSingle}
        >
          <div
            id="card-roosty-agenda-3"
            style={{ width: 1080, height: 1080 }}
            className="relative w-[1080px] h-[1080px] bg-[#09090b] text-zinc-100 overflow-hidden flex flex-col justify-between p-12 select-none font-sans"
          >
            {/* Resplandor superior sutil */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-indigo-500/15 blur-[140px] pointer-events-none rounded-full" />

            {/* HEADER SUPERIOR */}
            <div className="relative z-20 flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                  <img src="/inspo/roostylogo.png" alt="Roosty" className="w-11 h-11 object-contain" />
                </div>
                <div className="text-left">
                  <div className="lp-mono text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-1">
                    FICHA TÉCNICA // ROOSTY AGENDA
                  </div>
                  <h2 className="font-sans text-[38px] font-black tracking-tighter text-white leading-none">
                    Todo tu salón en un solo sistema
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <div className="lp-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1.5">
                  PLATAFORMA
                </div>
                <span className="inline-block lp-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  100% WEB EN LA NUBE
                </span>
              </div>
            </div>

            {/* GRILLA 2x2 DE 4 TARJETAS TÉCNICAS */}
            <div className="relative z-20 grid grid-cols-2 gap-6 my-auto py-2">
              {[
                {
                  icon: Calendar,
                  pills: ['RESERVAS 24/7'],
                  title: 'Link personalizado para bio de Instagram (24/7).',
                  desc: 'Tu propio portal web con la marca de tu barbería. Tus clientes eligen servicio, profesional y horario en segundos sin bajar apps.',
                  footerLabel: 'PORTAL DE MARCA',
                  footerBadge: 'tulocal.agenda.roosty.site',
                  badgeStyle: 'bg-white/5 text-zinc-200 border-white/15',
                },
                {
                  icon: Mail,
                  pills: ['0% COMISIÓN'],
                  title: 'Avisos automáticos por correo (menos ausencias).',
                  desc: 'Confirmación instantánea al reservar, recordatorio automático 24 horas antes del turno y link para reprogramar a tiempo.',
                  footerLabel: 'ALERTAS AUTOMÁTICAS',
                  footerBadge: '100% Tu Rentabilidad',
                  badgeStyle: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                },
                {
                  icon: Scissors,
                  pills: ['AGENDA & EQUIPO'],
                  title: 'Multi-profesional y cálculo de comisiones.',
                  desc: 'Grilla individual por barbero con código de color, permisos por usuario y liquidación automática de porcentajes al cerrar el día.',
                  footerLabel: 'LIQUIDACIÓN EXACTA',
                  footerBadge: 'Cierre en 1 toque',
                  badgeStyle: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                },
                {
                  icon: CreditCard,
                  pills: ['SEÑA', 'CRM', 'CAJA'],
                  title: 'Solicitud de señas e historial de clientes.',
                  desc: 'Cobro de señas por transferencia con validación de comprobante adjunto, historial de visitas por cliente y control de ausencias.',
                  footerLabel: 'AUDITORÍA DE TURNOS',
                  footerBadge: 'Sin sillas vacías',
                  badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="rounded-[26px] bg-[#111115] border border-white/10 p-7 flex flex-col justify-between h-[345px] shadow-xl text-left"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                          <Icon className="w-6 h-6" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          {card.pills.map((p) => (
                            <span
                              key={p}
                              className="lp-mono text-[10px] font-bold uppercase tracking-[0.14em] px-3 py-1 rounded-md bg-white/[0.04] text-indigo-300 border border-white/10"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h3 className="font-sans text-[24px] font-extrabold tracking-tight text-white leading-[1.2] mb-3">
                        {card.title}
                      </h3>

                      <p className="font-sans text-[14px] text-zinc-400 leading-relaxed font-normal">
                        {card.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between">
                      <span className="lp-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                        {card.footerLabel}
                      </span>
                      <span
                        className={`lp-mono text-[11px] font-bold px-3 py-1 rounded-lg border ${card.badgeStyle}`}
                      >
                        {card.footerBadge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER CTA BAR */}
            <div className="relative z-20 rounded-2xl bg-[#111115] border border-white/10 p-5 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-sans text-lg font-extrabold text-white tracking-tight">
                    Plan Cero disponible • Creá tu cuenta gratis en 2 minutos
                  </div>
                  <div className="font-sans text-xs text-zinc-400 mt-0.5">
                    Funciona en cualquier PC, notebook, tablet o celular sin instalar programas
                  </div>
                </div>
              </div>

              <div className="px-6 py-3.5 rounded-xl bg-indigo-600 text-white lp-mono text-base font-bold tracking-tight shadow-lg shadow-indigo-600/30">
                agenda.roosty.com.ar
              </div>
            </div>
          </div>
        </CatalogSectionBlock>
      </div>
    </div>
  );
}

/**
 * Bloque contenedor de cada sección en /catalog-cards
 */
function CatalogSectionBlock({
  overline,
  title,
  buttonLabel,
  elementId,
  fileName,
  width = 1080,
  height = 1080,
  pixelRatio = 3,
  realSize,
  capturingId,
  downloadingId,
  onDownload,
  children,
}) {
  const isDownloading = downloadingId === elementId;
  const isUnscaled = realSize || capturingId === elementId;
  const previewScale = width === 1200 ? 0.78 : 0.65;
  const exportWidth = width * pixelRatio;
  const exportHeight = height * pixelRatio;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-4 px-1">
        <div>
          <div className="lp-mono text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-400 mb-1">
            {overline}
          </div>
          <h2 className="font-sans text-base sm:text-lg font-bold text-white tracking-tight">{title}</h2>
        </div>

        <button
          type="button"
          onClick={() => onDownload(elementId, fileName, width, height, pixelRatio)}
          disabled={Boolean(downloadingId)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-200 transition-colors cursor-pointer disabled:opacity-60"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Exportando {exportWidth}×{exportHeight}...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>{buttonLabel}</span>
            </>
          )}
        </button>
      </div>

      <div className="rounded-[28px] bg-[#0e0e12] border border-white/10 p-4 sm:p-8 flex justify-center overflow-x-auto shadow-2xl">
        {isUnscaled ? (
          <div className="rounded-xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)]">{children}</div>
        ) : (
          <div
            style={{
              width: Math.round(width * previewScale),
              height: Math.round(height * previewScale),
              position: 'relative',
            }}
          >
            <div
              style={{
                width,
                height,
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left',
              }}
              className="rounded-xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)]"
            >
              {children}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
