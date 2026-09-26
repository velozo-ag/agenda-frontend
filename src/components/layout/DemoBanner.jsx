import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMyTenant, useDemoInfo } from '../../hooks/useTenantBranding';
import { AlertCircle, ArrowRight } from 'lucide-react';

export function DemoBanner() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN' || user?.username === 'superadmin';
  const { data: tenant } = useMyTenant({ enabled: !isSuperAdmin });
  const { isActiveDemo, demoTrialEndsAt } = useDemoInfo();

  if (isSuperAdmin || !isActiveDemo) {
    return null;
  }

  const storeName = tenant?.storeName || tenant?.name || 'mi local';
  const slug = tenant?.slug || 'demo';
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5491100000000';

  const formattedDate = demoTrialEndsAt
    ? new Date(demoTrialEndsAt).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '7 días';

  const message = encodeURIComponent(
    `Hola equipo Roosty. Estuve probando la demo de ${storeName} (${slug}.agenda.roosty.site) y quiero activar mi cuenta real. ¿Cómo avanzo?`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <aside
      aria-label="Aviso de Modo Demo"
      className="w-full bg-amber-400 border-b border-amber-500/80 text-stone-950 px-3 sm:px-4 py-1.5 shrink-0 z-40 relative select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        {/* Warning Information */}
        <div className="flex items-center gap-2 min-w-0">
          <AlertCircle className="w-3.5 h-3.5 text-stone-950 shrink-0" />
          <span className="font-bold shrink-0">Entorno de Demostración</span>
          <span className="text-stone-950/40 hidden sm:inline select-none">•</span>
          <span className="text-stone-900 hidden sm:inline truncate">
            Acceso bonificado hasta el <strong className="font-semibold text-stone-950">{formattedDate}</strong>. Tus servicios y citas se conservan intactas.
          </span>
        </div>

        {/* Action Link */}
        <div className="flex items-center shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-stone-950 hover:text-stone-800 underline underline-offset-2 transition-colors cursor-pointer"
          >
            <span>Activar plan definitivo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}

export default DemoBanner;
