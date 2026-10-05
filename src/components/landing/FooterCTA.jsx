import { ArrowRight, Globe, Zap, MessageCircle, Scissors } from 'lucide-react';
import { WHATSAPP_SALES_LINK } from './landingConfig';

/**
 * Footer: bloque CTA centrado (chip, titulo serif, CTAs duales, trust chips)
 * + fila inferior: [logo | tagline] [links] [copyright].
 * Tokens alineados con el resto de la landing: fondo zinc-950, hairlines white/10,
 * CTA primario = pill blanca con circulo interno (igual que el hero).
 */
export function FooterCTA({ onOpenWizard }) {
  return (
    <footer className="bg-zinc-950 text-zinc-100 relative overflow-hidden pt-24 pb-12 border-t border-white/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* CTA principal */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-medium mb-8 backdrop-blur-md">
            <span className="tracking-widest uppercase">Alta en 2 minutos, sin tarjeta</span>
          </div>

          <h2 className="lp-serif lp-balance text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
            Probalo un turno. <br className="hidden sm:inline" />
            <span className="text-indigo-400">Después no vas a querer volver.</span>
          </h2>

          <p className="lp-balance text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 font-normal tracking-tight leading-relaxed">
            100% web en la nube, sin instalación en tu local. Tu portal de reservas con link propio activo hoy mismo, y
            la agenda de tu equipo en un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              type="button"
              onClick={onOpenWizard}
              className="group bg-white hover:bg-zinc-100 text-zinc-950 w-full sm:w-auto inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors active:scale-[0.98]"
            >
              <span className="tracking-tight">Crear cuenta gratis</span>
              <span className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </button>

            <a
              href={WHATSAPP_SALES_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-medium text-zinc-300 hover:text-white transition-colors border border-white/10 hover:bg-white/5 active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              <span className="tracking-tight">Hablar con un asesor</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center items-center gap-3 text-xs text-zinc-400 font-medium">
            {[
              { icon: Globe, t: 'Enlace propio incluido' },
              { icon: Scissors, t: 'Pensado para barberías' },
              { icon: Zap, t: 'Cero comisiones por turno' },
            ].map(({ icon: Icon, t }) => (
              <div
                key={t}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="tracking-tight">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fila inferior */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-3">
            <img src="/roosty2.png" alt="Roosty" className="h-6 w-auto object-contain invert opacity-90" />
            <span className="text-zinc-700">|</span>
            <span className="text-xs text-zinc-400">Agenda y gestión para barberías y salones</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
            <a href="#funciones" className="hover:text-white transition-colors">
              Funcionalidades
            </a>
            <a href="#precios" className="hover:text-white transition-colors">
              Planes y Precios
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              Preguntas Frecuentes
            </a>
            <a href={WHATSAPP_SALES_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Contacto
            </a>
          </div>

          <div className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Roosty Agenda. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
