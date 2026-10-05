import { ArrowRight, Check } from 'lucide-react';
import { Reveal } from './Reveal';
import { BookingPortalPhoneDemo } from './BookingPortalPhoneDemo';

const PORTAL_POINTS = [
  'Elegí servicio y barbero en segundos.',
  'Seña con comprobante adjunto.',
  'Confirmación por WhatsApp, sin descargar nada.',
  'Tu propio link con la marca de tu local.',
];

export function PortalSection({ onOpenWizard }) {
  return (
    <section id="portal" className="scroll-mt-24 py-32 bg-zinc-950 relative overflow-hidden border-b border-white/5">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          <Reveal className="lg:col-span-6">
            <h2 className="font-sans text-4xl lg:text-5xl font-bold tracking-tighter text-white leading-tight mb-5">
              Interfaz optimizada. <br />
              <span className="text-zinc-500">Cero fricción.</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 font-normal tracking-tight leading-relaxed mb-8 max-w-xl">
              Tus clientes reservan en pocos toques, sin apps ni formularios largos. El turno cae directo en tu agenda.
            </p>

            <ul className="space-y-3.5 mb-9">
              {PORTAL_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm sm:text-base text-zinc-300 font-normal tracking-tight">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onOpenWizard}
              className="group inline-flex items-center gap-3 pl-7 pr-5 py-3.5 rounded-xl text-sm font-semibold cursor-pointer bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              <span>Crear mi portal</span>
              <span className="w-6 h-6 rounded-full bg-zinc-900/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </Reveal>

          {/* El telefono ya trae su propio marco: sin contenedor extra (antes un wrapper gris con overflow-hidden lo cortaba). */}
          <Reveal className="lg:col-span-6 flex justify-center" delay={120}>
            <BookingPortalPhoneDemo />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
