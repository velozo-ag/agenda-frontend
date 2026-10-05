import { Store, Share2, Wallet, Ban, Landmark } from 'lucide-react';
import { Reveal } from './Reveal';

const STEPS = [
  {
    n: '01',
    code: 'Alta',
    icon: Store,
    title: 'Creá tu cuenta',
    desc: 'En 2 minutos tenés tu link, tus servicios y tus horarios listos.',
  },
  {
    n: '02',
    code: 'Link',
    icon: Share2,
    title: 'Compartí tu link',
    desc: 'Tus clientes reservan solos desde tu Instagram o tu WhatsApp.',
  },
  {
    n: '03',
    code: 'Cobro',
    icon: Wallet,
    title: 'Cobrá la seña',
    desc: 'Pedí seña, confirmá el turno y mantené la agenda en orden.',
  },
];

/**
 * Seccion CLARA (contraste con el resto oscuro de la landing).
 * Titulo en serif (Merriweather via .lp-serif) como acento editorial; el resto en sans.
 * El panel de cobros vuelve a oscuro para sostener el contraste dentro de la banda clara.
 */
export function StepsSection() {
  return (
    <section id="como-funciona" className="scroll-mt-24 py-32 bg-zinc-100 text-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="lp-serif text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 leading-[1.15] mb-6">
            Automatizá el caos.
          </h2>
          <p className="text-lg text-zinc-600 font-normal leading-relaxed tracking-tight max-w-xl mx-auto">
            Tus clientes reservan solos. Vos te dedicás a cortar.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.n} delay={i * 90}>
                <div className="h-full p-1 rounded-3xl bg-zinc-200/70 border border-zinc-300/60">
                  <div className="h-full bg-white rounded-[22px] border border-zinc-200/80 p-8 flex flex-col shadow-[0_1px_2px_rgba(24,24,27,0.04)]">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-right leading-none">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-1.5">
                          {s.code}
                        </span>
                        <span className="font-sans text-2xl font-bold text-zinc-300 tracking-tighter">{s.n}</span>
                      </div>
                    </div>
                    <h3 className="font-sans text-xl font-bold text-zinc-950 mb-3 tracking-tighter">{s.title}</h3>
                    <p className="text-sm text-zinc-600 font-normal leading-relaxed tracking-tight">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12 md:mt-16">
          <div className="p-1 rounded-3xl bg-zinc-300/50 border border-zinc-300/60">
            <div className="relative overflow-hidden rounded-[22px] bg-zinc-950 p-8 sm:p-12 lg:p-16">
              <div className="absolute -top-24 right-0 w-[420px] h-[260px] bg-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />
              <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-white leading-tight mb-5">
                    Vos decidís <br />
                    <span className="text-zinc-500">cómo cobrar.</span>
                  </h3>
                  <p className="text-base text-zinc-400 font-normal leading-relaxed max-w-md tracking-tight">
                    Confirmá turnos al instante o pedí seña por servicio. Menos ausencias, agenda llena.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-1 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="bg-zinc-900 rounded-[22px] p-6 h-full">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 text-zinc-400 flex items-center justify-center mb-4">
                        <Ban className="w-4 h-4" />
                      </div>
                      <div className="font-sans text-lg font-bold text-white mb-2 tracking-tighter">Reserva libre</div>
                      <p className="text-[13px] text-zinc-400 font-normal leading-relaxed tracking-tight">
                        El turno se confirma al instante, sin pasos extra.
                      </p>
                    </div>
                  </div>
                  <div className="p-1 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors">
                    <div className="bg-zinc-900 rounded-[22px] p-6 h-full">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div className="font-sans text-lg font-bold text-white mb-2 tracking-tighter">Seña requerida</div>
                      <p className="text-[13px] text-zinc-400 font-normal leading-relaxed tracking-tight">
                        El cliente adjunta el comprobante y el turno queda asegurado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
