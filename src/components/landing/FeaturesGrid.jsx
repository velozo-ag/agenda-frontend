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
    tag: 'Identidad',
    title: 'Portal de Marca',
    description: 'Subdominio propio con diseño alineado a tu negocio. Cero interfaces genéricas.',
    badge: 'Subdominio',
  },
  {
    icon: CalendarDays,
    tag: 'Agenda',
    title: 'Gestión Multi-Barbero',
    description: 'Visualización diaria por profesional. Operaciones centralizadas en una pantalla.',
    badge: 'Equipo',
  },
  {
    icon: Banknote,
    tag: 'Cobros',
    title: 'Gestión de Señas',
    description: 'Validación de comprobantes de transferencia para confirmación de turnos.',
    badge: 'Liquidez',
  },
  {
    icon: Hourglass,
    tag: 'Optimización',
    title: 'Lista de Espera',
    description: 'Recuperación automática de turnos ante cancelaciones de último momento.',
    badge: 'Eficiencia',
  },
  {
    icon: Percent,
    tag: 'Finanzas',
    title: 'Liquidación Automática',
    description: 'Cálculo de comisiones por profesional sin planillas externas.',
    badge: 'Precisión',
  },
  {
    icon: Users,
    tag: 'CRM',
    title: 'Perfiles de Cliente',
    description: 'Historial de visitas, métricas de gasto y notas operativas.',
    badge: 'Fidelización',
  },
  {
    icon: Calculator,
    tag: 'Control',
    title: 'Cierre de Caja',
    description: 'Registro detallado por método de pago y consolidación diaria.',
    badge: 'Auditoría',
  },
  {
    icon: ShieldCheck,
    tag: 'Seguridad',
    title: 'Control de Acceso',
    description: 'Permisos granulares. Visibilidad restringida por usuario.',
    badge: 'Privacidad',
  },
];

export function FeaturesGrid() {
  return (
    <section id="funciones" className="scroll-mt-24 py-32 bg-zinc-950 relative border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
            Plataforma integral.
            <br />
            <span className="text-zinc-600">Alto rendimiento.</span>
          </h2>
          <p className="text-lg text-zinc-400 font-normal leading-relaxed tracking-tight max-w-xl mx-auto">
            Agenda, cobros, equipo y CRM consolidados. Arquitectura veloz sin fricción operativa.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 4) * 70}>
                <div className="h-full p-1 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors duration-500">
                  <div className="h-full bg-zinc-900 rounded-[22px] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-sans text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                          {item.badge}
                        </span>
                      </div>

                      <span className="font-sans text-[10px] font-bold text-indigo-400 uppercase tracking-[0.15em] block mb-2">
                        {item.tag}
                      </span>
                      <h3 className="font-sans text-lg font-bold tracking-tighter text-white mb-2">{item.title}</h3>
                      <p className="text-[13px] text-zinc-400 leading-relaxed font-normal tracking-tight">{item.description}</p>
                    </div>
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
