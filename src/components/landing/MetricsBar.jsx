import { Clock, CalendarClock, Globe, BadgeDollarSign } from 'lucide-react';

const METRICS = [
  {
    value: '2 min',
    title: 'Alta de local',
    label: 'Tu subdominio propio activo (ej. tubarberia.agenda.roosty.site) sin instalaciones.',
    icon: Clock,
  },
  {
    value: '24/7',
    title: 'Reservas online',
    label: 'Tus clientes reservan solos desde Instagram o WhatsApp, sin escribirte un mensaje.',
    icon: CalendarClock,
  },
  {
    value: '100% Web',
    title: 'Cloud SaaS',
    label: 'Accesible desde celular, tablet o PC. Nada para instalar ni para actualizar.',
    icon: Globe,
  },
  {
    value: '$0',
    title: 'Plan Cero',
    label: 'Empezás gratis con hasta 40 turnos por mes. Sin tarjeta de crédito.',
    icon: BadgeDollarSign,
  },
];

export function MetricsBar() {
  return (
    <section className="border-b border-zinc-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/80">
          {METRICS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="py-8 sm:py-10 px-4 sm:px-6 flex flex-col justify-between first:pl-0 last:pr-0 group hover:bg-[#faf9f8]/70 transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-md bg-zinc-100/90 border border-zinc-200/80 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="lp-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      {item.title}
                    </span>
                  </div>
                  <div className="lp-serif lp-tabular text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight mb-2">
                    {item.value}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 font-light leading-relaxed">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
