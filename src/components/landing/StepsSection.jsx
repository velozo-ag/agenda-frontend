import { Store, Share2, Wallet, ArrowRight, Ban, Landmark } from 'lucide-react';
import { Reveal } from './Reveal';

const STEPS = [
  {
    n: '01',
    code: 'ALTA',
    icon: Store,
    title: 'Creá tu cuenta en 2 minutos',
    desc: 'Elegí el nombre de tu barbería y tu link propio. Cargá servicios y horarios con un asistente guiado.',
    cta: 'Crear cuenta',
  },
  {
    n: '02',
    code: 'LINK',
    icon: Share2,
    title: 'Compartí tu link de reservas',
    desc: 'Ponelo en la bio de Instagram y en tu WhatsApp. Tus clientes eligen servicio, barbero y horario solos.',
    cta: 'Ver el portal',
  },
  {
    n: '03',
    code: 'COBRO',
    icon: Wallet,
    title: 'Cobrá la seña y cortá',
    desc: 'El cliente adjunta el comprobante, el turno se confirma y tu agenda se llena sin que muevas un dedo.',
    cta: 'Cómo funcionan las señas',
  },
];

export function StepsSection({ onOpenWizard }) {
  return (
    <section id="como-funciona" className="scroll-mt-24 py-20 md:py-28 bg-[#faf9f8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 mb-5 shadow-sm">
            <span className="lp-mono tracking-wide">Operativa de alto rendimiento</span>
          </div>
          <h2 className="lp-serif lp-balance text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 leading-tight mb-5">
            Un sábado a las 18:00 nadie tiene tiempo de contestar WhatsApps.
          </h2>
          <p className="lp-balance text-base sm:text-lg text-zinc-600 font-light leading-relaxed">
            Eliminamos los pasos innecesarios. Que reservar un turno sea tan fácil para tu cliente como cortarse el pelo
            lo es para vos.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.n} delay={i * 90}>
                <div className="h-full lp-bezel-light rounded-2xl p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-right leading-none">
                        <span className="lp-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                          {s.code}
                        </span>
                        <span className="lp-serif lp-tabular text-2xl font-extrabold text-zinc-300">{s.n}</span>
                      </div>
                    </div>
                    <h3 className="lp-serif text-lg sm:text-xl font-bold text-zinc-950 mb-2.5 leading-snug">{s.title}</h3>
                    <p className="text-sm text-zinc-600 font-light leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-zinc-200/70">
                    <button
                      type="button"
                      onClick={onOpenWizard}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"
                    >
                      {s.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Bloque oscuro ancho: señas opcionales (equivalente al bloque KDS/ticket del POS) */}
        <Reveal className="mt-8 md:mt-10">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#111111] border border-zinc-800 p-6 sm:p-10 lg:p-12">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/15 blur-[110px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 lp-dots-dark opacity-40 [mask-image:radial-gradient(ellipse_at_right,black_20%,transparent_70%)] pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="lp-mono text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-3">
                  Flexibilidad total
                </span>
                <h3 className="lp-serif lp-balance text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                  ¿Pedís seña o no?{' '}
                  <span className="text-indigo-400">Vos elegís cómo trabajar.</span>
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-lg">
                  Roosty Agenda se adapta a tu forma de laburar: reservas libres para cortes rápidos o seña obligatoria
                  con comprobante para servicios largos. Configurable por servicio.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className="p-5 rounded-2xl bg-[#16161a] border border-zinc-800">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center mb-3">
                    <Ban className="w-4 h-4" />
                  </div>
                  <div className="lp-serif text-base font-bold text-white mb-1">Reserva libre</div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    El turno se confirma al instante. Ideal para cortes rápidos con clientes de siempre.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#16161a] border border-indigo-500/30 ring-1 ring-indigo-500/10">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 flex items-center justify-center mb-3">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div className="lp-serif text-base font-bold text-white mb-1">Seña con comprobante</div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    El cliente transfiere y adjunta el comprobante. Vos lo aprobás y el turno queda firme.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
