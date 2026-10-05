import { Percent, Wallet, Palette, Lock, Users } from 'lucide-react';
import { Reveal } from './Reveal';

const BENEFITS = [
  {
    icon: Percent,
    title: 'Comisión por barbero',
    description: 'Definí un porcentaje distinto para cada profesional. La liquidación se recalcula sola.',
  },
  {
    icon: Wallet,
    title: 'Liquidación en 1 clic',
    description: 'Cuánto facturó el local y cuánto le toca a cada barbero. Cero planillas.',
  },
  {
    icon: Palette,
    title: 'Un color por barbero',
    description: 'Leé la agenda de un vistazo y reconocé cada turno sin abrirlo.',
  },
  {
    icon: Lock,
    title: 'Cada uno ve lo suyo',
    description: 'Tus barberos solo acceden a sus propios números, nunca a los del resto.',
  },
];

const ROWS = [
  { name: 'Tomás', dot: 'bg-indigo-400', turns: '48', billed: '$624.000', pct: '50%', pay: '$312.000' },
  { name: 'Lucho', dot: 'bg-emerald-400', turns: '41', billed: '$512.500', pct: '45%', pay: '$230.625' },
  { name: 'Nico', dot: 'bg-violet-400', turns: '37', billed: '$444.000', pct: '40%', pay: '$177.600' },
];

// Columnas con minmax(0, …) para que ningun valor empuje el ancho de la grilla.
const COLS = 'grid-cols-[minmax(0,1.3fr)_minmax(0,0.6fr)_minmax(0,1.1fr)_minmax(0,0.6fr)_minmax(0,1.1fr)]';

function EarningsMock() {
  return (
    <div className="rounded-[22px] bg-zinc-950 border border-zinc-800 overflow-hidden text-left w-full">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="min-w-0">
          <div className="text-xs font-bold text-white tracking-tight truncate">Liquidación mensual</div>
          <div className="text-[10px] font-mono text-zinc-500 mt-0.5 truncate">3 profesionales activos</div>
        </div>
        <span className="shrink-0 text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded">
          Métricas
        </span>
      </div>

      <div className="grid grid-cols-3 gap-px bg-zinc-800">
        {[
          { l: 'Facturado', v: '$1.580.500', c: 'text-white' },
          { l: 'A liquidar', v: '$720.225', c: 'text-zinc-300' },
          { l: 'Neto local', v: '$860.275', c: 'text-indigo-400' },
        ].map((k) => (
          <div key={k.l} className="bg-zinc-950 px-2.5 sm:px-4 py-3 min-w-0">
            <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 truncate">{k.l}</div>
            <div className={`mt-1 text-[11px] min-[420px]:text-sm sm:text-base font-bold font-mono whitespace-nowrap ${k.c}`}>
              {k.v}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 sm:px-4 py-2 bg-zinc-950">
        <div className={`grid ${COLS} gap-2 py-2 text-[9px] font-mono uppercase tracking-wider text-zinc-500 border-b border-zinc-800`}>
          <span>Barbero</span>
          <span className="text-right">Turnos</span>
          <span className="text-right">Factur.</span>
          <span className="text-right">%</span>
          <span className="text-right">A pagar</span>
        </div>
        {ROWS.map((r) => (
          <div
            key={r.name}
            className={`grid ${COLS} gap-2 py-3 text-[10px] min-[420px]:text-[11px] sm:text-xs items-center border-b border-zinc-900 last:border-0`}
          >
            <span className="flex items-center gap-2 font-semibold text-zinc-100 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.dot}`} />
              <span className="truncate">{r.name}</span>
            </span>
            <span className="text-right text-zinc-400 font-mono">{r.turns}</span>
            <span className="text-right text-zinc-300 font-mono whitespace-nowrap">{r.billed}</span>
            <span className="text-right text-indigo-400 font-mono font-semibold">{r.pct}</span>
            <span className="text-right text-white font-bold font-mono whitespace-nowrap">{r.pay}</span>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-3">
        <span className="text-[10px] text-zinc-500 flex items-center gap-1.5 min-w-0">
          <Users className="w-3 h-3 shrink-0" /> <span className="truncate">Cada barbero ve solo lo suyo</span>
        </span>
        <span className="shrink-0 text-[10px] font-semibold text-indigo-400">Exportar CSV →</span>
      </div>
    </div>
  );
}

export function CommissionsSection() {
  return (
    <section
      id="equipo"
      className="scroll-mt-24 py-32 bg-zinc-950 text-zinc-100 relative overflow-hidden border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Reveal className="max-w-3xl mb-12 md:mb-16">
          <h2 className="font-sans text-4xl lg:text-5xl font-bold tracking-tighter text-white leading-tight mb-5">
            Liquidación precisa. <br className="hidden sm:inline" />
            <span className="text-zinc-500">Automatizada.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-normal tracking-tight leading-relaxed max-w-xl">
            Cada turno suma a la comisión de su barbero. Al cierre del mes, la liquidación ya está calculada.
          </p>
        </Reveal>

        {/* items-start + sin h-full: el mock toma su altura natural y ya no queda un vacio negro debajo. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-3.5">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <Reveal key={b.title} delay={i * 80}>
                  <div className="p-1 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className="p-4 sm:p-5 rounded-[22px] bg-zinc-900 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition-transform duration-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-sans text-sm sm:text-base font-bold tracking-tighter text-white mb-1">{b.title}</h3>
                        <p className="text-xs sm:text-sm text-zinc-400 tracking-tight leading-relaxed font-normal">{b.description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="lg:col-span-7 min-w-0 lg:sticky lg:top-28" delay={120}>
            <div className="p-1 rounded-3xl bg-white/5 border border-white/10">
              <EarningsMock />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
