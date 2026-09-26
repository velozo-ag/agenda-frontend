import React from 'react';
import { useTenantBranding } from '../hooks/useTenantBranding';
import { Lock, MessageCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

export function DemoExpiredPage() {
  const { data: tenant } = useTenantBranding();

  const storeName = tenant?.storeName || tenant?.name || 'Tu local';
  const slug = tenant?.slug || 'demo';
  const purgeDate = tenant?.demoPurgeAt
    ? new Date(tenant.demoPurgeAt).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'los próximos días';

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5491100000000';
  const message = encodeURIComponent(
    `Hola equipo Roosty. Estuve probando la demo de ${storeName} (${slug}.agenda.roosty.site) y quiero activar mi cuenta real. ¿Cómo avanzo?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 p-6 selection:bg-orange-500 selection:text-white select-none">
      <div className="max-w-md w-full bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl">
        {/* Roosty Brand Icon with Status */}
        <div className="relative mb-5">
          <img
            src="/icon-R.png"
            alt="Roosty"
            className="w-16 h-16 object-contain filter drop-shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 bg-zinc-900 border border-zinc-700/60 text-amber-400 rounded-full p-1 shadow-sm">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-2">
          Período de prueba finalizado
        </h1>

        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          El local <strong className="text-zinc-200">{storeName}</strong> completó el plazo de prueba gratuita.
        </p>

        {/* Data Resguard Notification (Hairline divider instead of heavy box) */}
        <div className="w-full py-3.5 px-4 mb-6 text-left text-xs text-zinc-300 bg-zinc-950/60 rounded-xl border border-zinc-800/60 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-zinc-200 block mb-0.5">Tus datos están resguardados</span>
            Mesas, productos y configuraciones se conservan intactos hasta el{' '}
            <strong className="text-amber-300 font-semibold">{purgeDate}</strong>. Al contratar, tu terminal se reactiva al instante.
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#d94827] hover:bg-[#ea580c] active:scale-[0.98] transition-all text-white font-semibold py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-950/40 text-sm cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Activar Roosty POS Definitivo &rarr;</span>
          </a>

          <a
            href="https://roosty.site"
            className="w-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al sitio web</span>
          </a>
        </div>

        {/* Roosty Footer Endorsement */}
        <div className="mt-6 pt-4 border-t border-zinc-800/60 w-full flex items-center justify-center gap-2 text-xs text-zinc-500">
          <span>Potenciado por</span>
          <img
            src="/roosty2.png"
            alt="roosty."
            className="h-3.5 w-auto brightness-0 invert opacity-50 hover:opacity-80 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
}

export default DemoExpiredPage;
