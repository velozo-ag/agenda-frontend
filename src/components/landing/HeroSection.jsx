import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { AgendaPhoneDemo } from './AgendaPhoneDemo';
import { WHATSAPP_SALES_LINK } from './landingConfig';

export function HeroSection({ onOpenWizard }) {
  return (
    <section
      id="top"
      className="relative pt-32 pb-20 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32 overflow-hidden bg-[#faf9f8] border-b border-zinc-200/80"
    >
      {/* Textura + brillo de marca */}
      <div className="absolute inset-0 lp-grid-subtle opacity-70 pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-12 xl:gap-16 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left lg:-mt-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/90 border border-zinc-200/90 text-xs font-semibold text-zinc-800 mb-7 shadow-sm">
              <span className="tracking-wide">
                Agenda para Barberías y Salones <span className="text-indigo-600 font-bold">100% Web</span>
              </span>
            </div>

            <h1 className="lp-serif lp-balance text-4xl sm:text-5xl xl:text-[3.5rem] font-bold tracking-tight text-zinc-950 leading-[1.14]">
              Llená tu agenda, cobrá la seña y{' '}
              <span className="relative inline-block text-indigo-600">
                cortá sin interrupciones.
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-2 text-indigo-500/30 -z-10"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M1 5.5C50 2 150 2 199 5.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="lp-balance mt-7 text-base sm:text-lg text-zinc-600 font-light leading-relaxed max-w-xl lg:max-w-none xl:max-w-2xl">
              El software para barberías y salones que vuela en horas pico. Reservas online 24/7 con tu propio link,
              señas por transferencia y las comisiones de tu equipo calculadas solas.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenWizard}
                className="group lp-btn-indigo w-full sm:w-auto inline-flex items-center justify-center gap-3 pl-7 pr-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold cursor-pointer"
              >
                <span>Crear cuenta gratis</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
              <a
                href={WHATSAPP_SALES_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn-ghost w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-medium"
              >
                <MessageCircle className="w-4 h-4 text-indigo-600" />
                <span>Hablar con ventas</span>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap lg:flex-nowrap whitespace-nowrap items-center justify-center lg:justify-start gap-2.5 text-xs sm:text-[13px] text-zinc-600 font-medium w-full">
              {['Plan Cero sin tarjeta', 'Tu link propio en 2 minutos', 'Sin contratos de permanencia'].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-zinc-200/80 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup */}
          <div className="lg:col-span-5 xl:col-span-4 relative px-1 sm:px-6 lg:px-0 flex justify-center lg:justify-end">
            <AgendaPhoneDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
