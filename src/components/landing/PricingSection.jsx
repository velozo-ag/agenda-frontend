import { Check, X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Reveal } from './Reveal';

const PLANS = [
  {
    code: 'CERO',
    name: 'Cero',
    badge: 'Para empezar',
    headline: 'Tu barbería online hoy, sin pagar nada. Ideal para validar el sistema.',
    target: 'Barberos independientes que recién arrancan.',
    price: '$0',
    period: 'para siempre',
    note: 'Sin tarjeta de crédito',
    popular: false,
    button: 'Empezar gratis',
    buttonStyle: 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm',
    limits: { turnos: 'Hasta 40 turnos por mes', barberos: '1 barbero' },
    features: [
      { t: 'Portal público con subdominio propio', ok: true },
      { t: 'Agenda por día y semana', ok: true },
      { t: 'Ficha de clientes (CRM)', ok: true },
      { t: 'Caja y cobros del día', ok: true },
      { t: 'Cobro de seña con comprobante', ok: false },
      { t: 'Varios barberos y selección de profesional', ok: false },
      { t: 'Comisiones y liquidación por barbero', ok: false },
    ],
  },
  {
    code: 'NAVAJA',
    name: 'Navaja',
    badge: 'Solo Barber',
    headline: 'Turnos ilimitados y señas para que nadie te deje plantado.',
    target: 'Barberos con agenda llena que trabajan solos.',
    price: '$14.900',
    period: '/mes',
    note: 'Abono mensual sin permanencia',
    popular: false,
    button: 'Empezar y mejorar después',
    buttonStyle: 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm',
    limits: { turnos: 'Turnos ilimitados', barberos: '1 barbero' },
    features: [
      { t: 'Todo lo incluido en el plan Cero', ok: true },
      { t: 'Cobro de seña con comprobante', ok: true },
      { t: 'Lista de espera para cancelaciones', ok: true },
      { t: 'Dashboard de ingresos y turnos', ok: true },
      { t: 'Varios barberos y selección de profesional', ok: false },
      { t: 'Comisiones y liquidación por barbero', ok: false },
    ],
  },
  {
    code: 'CREW',
    name: 'Crew',
    badge: 'El plan más elegido',
    headline: 'Todo el equipo en una sola agenda, con comisiones claras para cada uno.',
    target: 'Barberías y salones con 2 o más profesionales.',
    price: '$24.900',
    period: '/mes',
    note: 'Hasta 10 barberos incluidos',
    popular: true,
    button: 'Empezar y mejorar después',
    buttonStyle: 'lp-btn-indigo',
    limits: { turnos: 'Turnos ilimitados', barberos: 'Hasta 10 barberos' },
    features: [
      { t: 'Todo lo incluido en el plan Navaja', ok: true },
      { t: 'El cliente elige a su profesional', ok: true },
      { t: 'Agenda por columnas y color por barbero', ok: true },
      { t: 'Comisión propia y liquidación por barbero', ok: true },
      { t: 'Cada barbero entra con su usuario', ok: true },
      { t: 'Mapa de calor de horarios pico', ok: true },
    ],
  },
];

export function PricingSection({ onOpenWizard }) {
  return (
    <section id="precios" className="scroll-mt-24 py-20 md:py-28 bg-[#faf9f8] relative border-t border-zinc-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <h2 className="lp-serif lp-balance text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 leading-tight mb-5">
            Elegí cómo querés <br className="hidden sm:inline" />
            <span className="text-indigo-600">crecer con Roosty Agenda.</span>
          </h2>
          <p className="lp-balance text-base sm:text-lg text-zinc-600 font-light leading-relaxed mb-7">
            Sin costos ocultos y sin contratos de permanencia. Empezás gratis y pasás de plan cuando tu barbería lo pida.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 text-xs text-zinc-600 font-medium">
            {['Plan Cero sin tarjeta', 'Subdominio propio en todos los planes', 'Sin comisión por turno'].map((t) => (
              <div
                key={t}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200/80 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.code} delay={i * 90} className={plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}>
              <div
                className={`relative h-full rounded-3xl p-1.5 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-500/30 to-indigo-500/5 shadow-[0_30px_60px_-20px_rgba(79,70,229,0.35)]'
                    : 'bg-zinc-200/40'
                }`}
              >
                <div
                  className={`h-full rounded-[1.4rem] bg-white p-6 sm:p-7 flex flex-col border ${
                    plan.popular ? 'border-indigo-200' : 'border-zinc-200/90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`lp-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                        plan.popular
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="lp-serif text-2xl font-bold text-zinc-950 mb-2">{plan.name}</h3>
                  <p className="text-sm text-zinc-600 font-light leading-relaxed mb-1.5 min-h-[3.75rem]">{plan.headline}</p>
                  <p className="text-xs text-zinc-500 mb-6">{plan.target}</p>

                  <div className="mb-1 flex items-baseline gap-1.5">
                    <span className="lp-serif lp-tabular text-4xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
                      {plan.price}
                    </span>
                    <span className="lp-mono text-[11px] text-zinc-500 font-semibold">ARS {plan.period}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mb-5">{plan.note}</p>

                  <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="rounded-xl bg-[#faf9f8] border border-zinc-200/80 px-3 py-2">
                      <div className="lp-mono text-[9px] uppercase tracking-wider text-zinc-400 mb-0.5">Turnos</div>
                      <div className="text-[11px] font-bold text-zinc-800 leading-tight">{plan.limits.turnos}</div>
                    </div>
                    <div className="rounded-xl bg-[#faf9f8] border border-zinc-200/80 px-3 py-2">
                      <div className="lp-mono text-[9px] uppercase tracking-wider text-zinc-400 mb-0.5">Equipo</div>
                      <div className="text-[11px] font-bold text-zinc-800 leading-tight">{plan.limits.barberos}</div>
                    </div>
                  </div>

                  <div className="lp-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    Qué incluye
                  </div>
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f.t}
                        className={`flex items-start gap-2.5 text-[13px] leading-snug ${
                          f.ok ? 'text-zinc-700' : 'text-zinc-400'
                        }`}
                      >
                        {f.ok ? (
                          <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-px stroke-[2.5]" />
                        ) : (
                          <X className="w-4 h-4 text-zinc-300 shrink-0 mt-px" />
                        )}
                        <span className={f.ok ? '' : 'line-through decoration-zinc-300'}>{f.t}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={onOpenWizard}
                    className={`group w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold cursor-pointer active:scale-[0.98] transition-all duration-200 ${plan.buttonStyle}`}
                  >
                    <span>{plan.button}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="max-w-3xl mx-auto flex items-start sm:items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-sm text-zinc-600 font-light leading-relaxed">
              <span className="font-semibold text-zinc-900">Todas las cuentas nacen en el plan Cero.</span> Creás tu
              barbería en 2 minutos, la probás con tus clientes reales y subís de plan solo si lo necesitás. Precios en
              pesos argentinos.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
