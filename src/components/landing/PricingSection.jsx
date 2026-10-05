import { Check, X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Reveal } from './Reveal';

// Nombres de plan alineados con el backend (FREE / Navaja / Crew).
const PLANS = [
  {
    name: 'Cero',
    badge: 'Gratis',
    headline: 'Para arrancar y probar todo sin gastar un peso.',
    target: 'Profesionales independientes.',
    price: '$0',
    period: 'para siempre',
    note: 'Sin tarjeta',
    popular: false,
    button: 'Empezar gratis',
    limits: { turnos: '40 por mes', barberos: '1 profesional' },
    features: [
      { t: 'Link de reservas propio', ok: true },
      { t: 'Agenda online', ok: true },
      { t: 'Ficha de clientes', ok: true },
      { t: 'Caja diaria', ok: true },
      { t: 'Cobro de señas', ok: false },
      { t: 'Gestión de equipo', ok: false },
      { t: 'Liquidación de comisiones', ok: false },
    ],
  },
  {
    name: 'Navaja',
    badge: 'Para crecer',
    headline: 'Turnos ilimitados y señas para frenar las ausencias.',
    target: 'Barberos con la agenda llena.',
    price: '$14.900',
    period: 'por mes',
    note: 'Sin permanencia',
    popular: false,
    button: 'Elegir Navaja',
    limits: { turnos: 'Ilimitados', barberos: '1 profesional' },
    features: [
      { t: 'Todo lo del plan Cero', ok: true },
      { t: 'Cobro de señas', ok: true },
      { t: 'Lista de espera automática', ok: true },
      { t: 'Métricas de ingresos', ok: true },
      { t: 'Gestión de equipo', ok: false },
      { t: 'Liquidación de comisiones', ok: false },
    ],
  },
  {
    name: 'Crew',
    badge: 'Más elegido',
    headline: 'Para locales con equipo: agenda por barbero y comisiones.',
    target: 'Barberías con varios barberos.',
    price: '$24.900',
    period: 'por mes',
    note: 'Hasta 10 profesionales',
    popular: true,
    button: 'Elegir Crew',
    limits: { turnos: 'Ilimitados', barberos: '10 profesionales' },
    features: [
      { t: 'Todo lo del plan Navaja', ok: true },
      { t: 'El cliente elige barbero', ok: true },
      { t: 'Agenda por barbero', ok: true },
      { t: 'Liquidación de comisiones', ok: true },
      { t: 'Permisos por rol', ok: true },
      { t: 'Análisis de demanda', ok: true },
    ],
  },
];

/**
 * Seccion CLARA (contraste con el resto oscuro). El plan destacado (Crew) se invierte a oscuro
 * para que sea el foco de la banda. Titulo en serif (Merriweather via .lp-serif).
 */
export function PricingSection({ onOpenWizard }) {
  return (
    <section id="precios" className="scroll-mt-24 py-32 bg-zinc-100 text-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="lp-serif text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 leading-[1.15] mb-5">
            Empezá gratis. <br className="hidden sm:inline" />
            <span className="text-indigo-600">Crecé cuando lo necesites.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal tracking-tight leading-relaxed mb-8 max-w-xl mx-auto">
            Sin tarjeta y sin permanencia. Pagás más solo si tu agenda lo pide.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 text-xs text-zinc-600 font-medium">
            {['Plan gratis para siempre', 'Link propio incluido', 'Cero comisiones por turno'].map((t) => (
              <div
                key={t}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span className="tracking-tight">{t}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan, i) => {
            const dark = plan.popular;
            return (
              <Reveal key={plan.name} delay={i * 90}>
                <div className="h-full p-1 rounded-3xl bg-zinc-200/70 border border-zinc-300/60">
                  <div
                    className={`h-full rounded-[22px] p-6 sm:p-8 flex flex-col relative overflow-hidden border ${
                      dark
                        ? 'bg-zinc-950 border-zinc-800 shadow-[0_20px_60px_-20px_rgba(79,70,229,0.45)]'
                        : 'bg-white border-zinc-200/80 shadow-[0_1px_2px_rgba(24,24,27,0.04)]'
                    }`}
                  >
                    {dark && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
                    )}

                    <div className="flex items-center justify-between mb-6">
                      <span
                        className={`font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${
                          dark
                            ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>

                    <h3 className={`font-sans text-2xl font-bold tracking-tighter mb-2 ${dark ? 'text-white' : 'text-zinc-950'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm font-normal tracking-tight leading-relaxed mb-2 min-h-[3.5rem] ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {plan.headline}
                    </p>
                    <p className={`text-xs mb-8 tracking-tight ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>{plan.target}</p>

                    <div className="mb-2 flex items-baseline gap-1.5">
                      <span className={`font-sans text-4xl sm:text-5xl font-bold tracking-tighter ${dark ? 'text-white' : 'text-zinc-950'}`}>
                        {plan.price}
                      </span>
                      <span className={`font-mono text-[11px] font-semibold ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                        ARS {plan.period}
                      </span>
                    </div>
                    <p className={`text-xs mb-6 ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>{plan.note}</p>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {[
                        { l: 'Turnos', v: plan.limits.turnos },
                        { l: 'Equipo', v: plan.limits.barberos },
                      ].map((box) => (
                        <div
                          key={box.l}
                          className={`rounded-xl border px-4 py-3 ${
                            dark ? 'bg-zinc-900 border-white/5' : 'bg-zinc-50 border-zinc-200'
                          }`}
                        >
                          <div className={`font-mono text-[9px] uppercase tracking-wider mb-1 ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                            {box.l}
                          </div>
                          <div className={`text-xs font-bold tracking-tight ${dark ? 'text-zinc-200' : 'text-zinc-800'}`}>{box.v}</div>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li
                          key={f.t}
                          className={`flex items-start gap-3 text-[13px] tracking-tight ${
                            f.ok ? (dark ? 'text-zinc-200' : 'text-zinc-800') : dark ? 'text-zinc-600' : 'text-zinc-400'
                          }`}
                        >
                          {f.ok ? (
                            <Check className={`w-4 h-4 shrink-0 mt-px stroke-[2.5] ${dark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          ) : (
                            <X className={`w-4 h-4 shrink-0 mt-px ${dark ? 'text-zinc-700' : 'text-zinc-300'}`} />
                          )}
                          <span className={f.ok ? '' : 'line-through decoration-current/40'}>{f.t}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={onOpenWizard}
                      className={`group w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold tracking-tight cursor-pointer transition-colors ${
                        dark
                          ? 'bg-indigo-500 text-white hover:bg-indigo-400'
                          : 'bg-zinc-950 text-white hover:bg-zinc-800'
                      }`}
                    >
                      <span>{plan.button}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12">
          <div className="max-w-3xl mx-auto p-1 rounded-3xl bg-zinc-200/70 border border-zinc-300/60">
            <div className="bg-white rounded-[22px] border border-zinc-200/80 p-5 w-full flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-sm text-zinc-600 font-normal tracking-tight leading-relaxed">
                <span className="font-bold text-zinc-950">Todas las cuentas empiezan en el plan Cero.</span> Cambiás de plan
                cuando quieras. Precios en pesos argentinos.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
