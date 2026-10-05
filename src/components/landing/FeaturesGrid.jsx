import {
  Globe,
  CalendarDays,
  Banknote,
  Hourglass,
  Percent,
  Users,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { Reveal } from './Reveal';

const FEATURES = [
  {
    icon: Globe,
    tag: 'Tu Identidad',
    title: 'Portal con tu Marca',
    description:
      'Tus clientes entran a tu propio subdominio con tu logo, portada y colores de marca. Cero diseños genéricos.',
    badge: 'Subdominio propio',
  },
  {
    icon: CalendarDays,
    tag: 'Agenda en Vivo',
    title: 'Día y Semana, por Barbero',
    description:
      'Vista por día con una columna por profesional o semana completa. Mové, reprogramá y cobrá desde la misma pantalla.',
    badge: 'Multi-barbero',
  },
  {
    icon: Banknote,
    tag: 'Menos Ausencias',
    title: 'Señas con Comprobante',
    description:
      'El cliente adjunta el comprobante de transferencia al reservar. Vos lo aprobás y el turno queda confirmado.',
    badge: 'Cero no-shows',
  },
  {
    icon: Hourglass,
    tag: 'Cero Huecos',
    title: 'Lista de Espera',
    description:
      'Cuando un día se llena, el cliente se anota y vos cubrís las cancelaciones de último momento.',
    badge: 'Turnos recuperados',
  },
  {
    icon: Percent,
    tag: 'Tu Equipo',
    title: 'Comisiones por Barbero',
    description:
      'Definí un porcentaje distinto para cada profesional y obtené la liquidación del mes sin planillas de Excel.',
    badge: 'Liquidación clara',
  },
  {
    icon: Users,
    tag: 'Fidelización',
    title: 'Ficha de Cada Cliente',
    description:
      'Historial de visitas, gasto total y notas de cada cliente para reconocerlo y hacerlo volver.',
    badge: 'CRM integrado',
  },
  {
    icon: Calculator,
    tag: 'Control Total',
    title: 'Caja y Cobros del Día',
    description:
      'Registrá efectivo, transferencia y tarjeta por turno y cerrá la caja del día sin diferencias.',
    badge: 'Cuentas claras',
  },
  {
    icon: ShieldCheck,
    tag: 'Seguridad',
    title: 'Roles y Accesos por Persona',
    description:
      'Cada barbero entra con su usuario y ve solo su agenda y sus ganancias. Nada más, nada menos.',
    badge: 'Acceso seguro',
  },
];

export function FeaturesGrid() {
  return (
    <section id="funciones" className="scroll-mt-24 py-20 md:py-28 bg-white relative border-y border-zinc-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <h2 className="lp-serif lp-balance text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 mb-5 leading-tight">
            Agenda, señas, equipo y clientes{' '}
            <span className="text-indigo-600">sin pagar software por separado.</span>
          </h2>
          <p className="lp-balance text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            Unificá toda la operación de tu barbería en un solo sistema web ágil que no te cobra comisión por cada turno
            ni te ata a contratos.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {FEATURES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 4) * 70}>
                <div className="h-full rounded-2xl bg-white border border-zinc-200/90 p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-zinc-200/60 hover:border-zinc-300 hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#faf9f8] border border-zinc-200/80 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="lp-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100/90 px-2.5 py-0.5 rounded border border-zinc-200/80">
                        {item.badge}
                      </span>
                    </div>

                    <span className="lp-mono text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                      {item.tag}
                    </span>
                    <h3 className="lp-serif text-lg font-bold text-zinc-950 mb-2 leading-snug">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
