import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { Reveal } from './Reveal';
import { BookingPortalPhoneDemo } from './BookingPortalPhoneDemo';

const PORTAL_POINTS = [
  'Elige servicio, barbero y horario en menos de un minuto',
  'Seña con comprobante cuando el servicio lo requiere',
  'Confirmación directa por WhatsApp, sin app que instalar',
  'Tu logo, tu portada y tus colores en un link propio',
];

export function PortalSection({ onOpenWizard }) {
  return (
    <section id="portal" className="scroll-mt-24 py-20 md:py-28 bg-[#faf9f8] relative overflow-hidden">
      <div className="absolute inset-0 lp-grid-subtle opacity-60 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          <Reveal className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-sm lp-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-5">
              <MessageCircle className="w-3.5 h-3.5" />
              Portal público de reservas
            </span>
            <h2 className="lp-serif lp-balance text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 leading-tight mb-5">
              El portal de reservas que tus clientes{' '}
              <span className="text-indigo-600">realmente disfrutan usar.</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 font-light leading-relaxed mb-8 max-w-xl">
              Sin descargar aplicaciones ni llenar formularios eternos. Tus clientes eligen su servicio, su barbero y el
              horario libre, y el turno cae directo en tu agenda.
            </p>

            <ul className="space-y-3.5 mb-9">
              {PORTAL_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm sm:text-base text-zinc-700 font-medium">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onOpenWizard}
              className="group lp-btn-indigo inline-flex items-center gap-3 pl-7 pr-5 py-3.5 rounded-xl text-sm font-semibold cursor-pointer"
            >
              <span>Crear mi portal gratis</span>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={120}>
            <BookingPortalPhoneDemo />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
