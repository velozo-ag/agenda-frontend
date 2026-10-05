import { Percent, Wallet, Palette, Lock, Users } from 'lucide-react';
import { Reveal } from './Reveal';

const BENEFITS = [
  {
    icon: Percent,
    title: 'Porcentaje propio por barbero',
    description:
      'Cada profesional tiene su comisión. Cambiala cuando quieras y el sistema recalcula la liquidación del período.',
  },
  {
    icon: Wallet,
    title: 'Liquidación de fin de mes en 1 clic',
    description:
      'Ves cuánto facturó cada barbero, cuánto le corresponde y cuánto queda para el local. Sin cuentas en el celular.',
  },
  {
    icon: Palette,
    title: 'Color propio en la agenda',
    description:
      'Cada barbero tiene su color: de un vistazo sabés quién tiene qué turno, aunque la agenda esté llena.',
  },
  {
    icon: Lock,
    title: 'Cada uno ve lo suyo',
    description:
      'Tus barberos entran con su usuario y ven solo su agenda y sus ganancias. La caja total es solo tuya.',
  },
];

const ROWS = [
  { name: 'Tomás', dot: 'bg-indigo-400', turns: '48', billed: '$624.000', pct: '50%', pay: '$312.000' },
  { name: 'Lucho', dot: 'bg-emerald-400', turns: '41', billed: '$512.500', pct: '45%', pay: '$230.625' },
  { name: 'Nico', dot: 'bg-violet-400', turns: '37', billed: '$444.000', pct: '40%', pay: '$177.600' },
];

function EarningsMock() {
  return (
    <div className="rounded-xl sm:rounded-[1.25rem] bg-[#0b0b0e] border border-zinc-800 overflow-hidden text-left">
      <div className="flex items-center justify-between px-4 py-3 bg-[#101014] border-b border-zinc-800/80">
        <div>
          <div className="text-xs font-bold text-white">Liquidación de junio</div>
          <div className="text-[10px] lp-mono text-zinc-500 mt-0.5">Plan Crew · 3 profesionales</div>
        </div>
        <span className="text-[9px] lp-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-2 py-1 rounded">
          Vista de ejemplo
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-px bg-zinc-800/60 border-b border-zinc-800/80">
        {[
          { l: 'Facturado', v: '$1.580.500', c: 'text-white' },
          { l: 'A liquidar', v: '$720.225', c: 'text-sky-300' },
          { l: 'Neto del local', v: '$860.275', c: 'text-emerald-300' },
        ].map((k) => (
          <div key={k.l} className="bg-[#0e0e12] px-3 sm:px-4 py-3">
            <div className="text-[9px] lp-mono uppercase tracking-wider text-zinc-500">{k.l}</div>
            <div className={`mt-1 text-sm sm:text-base font-bold lp-tabular ${k.c}`}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="px-3 sm:px-4 py-2">
        <div className="grid grid-cols-[1.2fr_0.6fr_1fr_0.6fr_1fr] gap-2 py-2 text-[9px] lp-mono uppercase tracking-wider text-zinc-500 border-b border-zinc-800/70">
          <span>Barbero</span>
          <span className="text-right">Turnos</span>
          <span className="text-right">Facturado</span>
          <span className="text-right">%</span>
          <span className="text-right">A pagar</span>
        </div>
        {ROWS.map((r) => (
          <div
            key={r.name}
            className="grid grid-cols-[1.2fr_0.6fr_1fr_0.6fr_1fr] gap-2 py-3 text-[11px] sm:text-xs items-center border-b border-zinc-900 last:border-0"
          >
            <span className="flex items-center gap-2 font-semibold text-zinc-100">
              <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
              {r.name}
            </span>
            <span className="text-right text-zinc-400 lp-tabular">{r.turns}</span>
            <span className="text-right text-zinc-300 lp-tabular">{r.billed}</span>
            <span className="text-right text-indigo-300 lp-tabular font-semibold">{r.pct}</span>
            <span className="text-right text-white font-bold lp-tabular">{r.pay}</span>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-[#101014] border-t border-zinc-800/80 flex items-center justify-between">
        <span className="text-[10px] text-zinc-500 flex items-center gap-1.5">
          <Users className="w-3 h-3" /> Cada barbero ve solo su fila
        </span>
        <span className="text-[10px] font-semibold text-indigo-300">Exportar a Excel →</span>
      </div>
    </div>
  );
}

export function CommissionsSection() {
  return (
    <section
      id="equipo"
      className="scroll-mt-24 py-20 md:py-28 bg-[#09090b] text-zinc-100 relative overflow-hidden"
    >
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-emerald-500/5 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 lp-dots-dark pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Reveal className="max-w-3xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-indigo-400 mb-5 shadow-sm">
            <Percent className="w-3.5 h-3.5" />
            <span className="lp-mono tracking-wide">Equipo &amp; Comisiones</span>
          </div>
          <h2 className="lp-serif lp-balance text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-5">
            Cada barbero, su comisión. <br className="hidden sm:inline" />
            <span className="text-indigo-400">Vos solo contás la plata.</span>
          </h2>
          <p className="lp-balance text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            Se acabaron las cuentas a fin de mes con el celular en la mano. Roosty Agenda calcula lo que le corresponde a
            cada profesional y lo que queda para el local, turno por turno.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-3.5">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <Reveal key={b.title} delay={i * 80}>
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#121214] border border-zinc-800/90 hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition-transform duration-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="lp-serif text-sm sm:text-base font-bold text-white mb-1">{b.title}</h3>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">{b.description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="lg:col-span-7" delay={120}>
            <div className="lp-bezel-dark rounded-2xl sm:rounded-3xl p-1.5 sm:p-2">
              <EarningsMock />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
