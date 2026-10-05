import { Clock, CalendarClock, Globe, BadgeDollarSign } from 'lucide-react';

const METRICS = [
  {
    value: '2 min',
    title: 'Alta de local',
    label: 'Subdominio propio activo sin instalaciones previas.',
    icon: Clock,
  },
  {
    value: '24/7',
    title: 'Reservas online',
    label: 'Clientes reservan sin asistencia desde Instagram o WhatsApp.',
    icon: CalendarClock,
  },
  {
    value: '100% Web',
    title: 'Cloud SaaS',
    label: 'Accesible desde cualquier dispositivo. Sin actualizaciones manuales.',
    icon: Globe,
  },
  {
    value: '$0',
    title: 'Plan Cero',
    label: '40 turnos mensuales gratis. Sin tarjeta de crédito.',
    icon: BadgeDollarSign,
  },
];

export function MetricsBar() {
  return (
    <section className="border-b border-white/5 bg-zinc-950 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-1 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors duration-500"
              >
                <div className="relative p-6 rounded-[22px] bg-zinc-900 flex flex-col justify-between overflow-hidden h-full">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                        {item.title}
                      </span>
                    </div>
                    <div className="font-sans text-3xl sm:text-4xl font-bold tracking-tighter text-white mb-3">
                      {item.value}
                    </div>
                  </div>
                  <p className="text-[13px] text-zinc-400 font-normal leading-relaxed tracking-tight">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
