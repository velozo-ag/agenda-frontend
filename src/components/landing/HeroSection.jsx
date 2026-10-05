import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { AgendaPhoneDemo } from './AgendaPhoneDemo';
import { WHATSAPP_SALES_LINK } from './landingConfig';

export function HeroSection({ onOpenWizard }) {
  return (
    <section
      id="top"
      className="relative pt-24 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-zinc-950 border-b border-white/5"
    >
      {/* Textura + brillo de marca */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[7fr_3fr] gap-14 lg:gap-12 xl:gap-16 items-center">
          {/* Copy */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:-mt-16 w-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-zinc-300 mb-8 backdrop-blur-md">
              <span className="tracking-widest uppercase">
                Software para Barberías
              </span>
            </div>

            <h1 className="font-sans text-5xl sm:text-6xl xl:text-[4.5rem] font-bold tracking-tighter text-white leading-[1.05] max-w-3xl">
              Más cortes.
              <br />
              Cero caos.
              <br />
              <span className="text-indigo-500">
                Gestión total.
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed max-w-xl lg:max-w-md xl:max-w-lg tracking-tight">
              Automatizá tus turnos, organizá a tu equipo y olvidate de los mensajes. 
              El estándar para salones que buscan crecer.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenWizard}
                className="group bg-white hover:bg-zinc-100 text-zinc-950 w-full sm:w-auto inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors"
              >
                <span className="tracking-tight">Iniciar gratis</span>
                <span className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </button>
              <a
                href={WHATSAPP_SALES_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-medium text-zinc-300 hover:text-white transition-colors border border-transparent hover:border-white/10 hover:bg-white/5"
              >
                <MessageCircle className="w-4 h-4 text-indigo-400" />
                <span className="tracking-tight">Contactar ventas</span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap lg:flex-nowrap whitespace-nowrap items-center justify-center lg:justify-start gap-4 text-xs text-zinc-500 font-medium w-full tracking-tight">
              {['Plan Cero disponible', 'Setup en 2 mins', 'Sin contratos'].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup */}
          <div className="relative px-1 sm:px-6 lg:px-0 flex justify-center lg:justify-end w-full">
            <AgendaPhoneDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
