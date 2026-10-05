import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { getWhatsAppLink } from './landingConfig';

const FAQS = [
  {
    q: 'Límites del Plan Base',
    a: 'Operativa gratuita permanente. Incluye portal público, gestión de agenda, CRM y auditoría de caja. Límite de 40 turnos mensuales para un profesional. Sin tarjeta requerida.',
  },
  {
    q: 'Gestión de dominio',
    a: 'Asignación automática de subdominio personalizado (ej. marca.agenda.roosty.site). Listo para integración en redes sociales con identidad visual propia.',
  },
  {
    q: 'Procesamiento de señas',
    a: 'Motor de validación integrado. Confirmación de turnos condicionada a verificación manual de comprobantes. Disponible en planes superiores.',
  },
  {
    q: 'Requisitos de infraestructura',
    a: 'Arquitectura 100% cloud. Accesible vía navegador web desde cualquier dispositivo. Cero instalaciones o actualizaciones locales requeridas.',
  },
  {
    q: 'Soporte multi-usuario',
    a: 'Gestión de hasta 10 profesionales en plan Scale. Aislamiento de datos, liquidación algorítmica de comisiones y control de acceso granular.',
  },
  {
    q: 'Políticas de escalamiento',
    a: 'Alertas proactivas previas al límite de turnos. Escalabilidad transparente sin interrupción de servicio ni migración de datos.',
  },
  {
    q: 'Despliegue inicial',
    a: 'Configuración de servicios y franjas horarias en minutos. Interfaz de administración optimizada. Soporte directo vía WhatsApp disponible.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="scroll-mt-24 py-32 bg-zinc-950 relative border-b border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <h2 className="font-sans text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-5 leading-tight">
            Resolución operativa.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-normal tracking-tight leading-relaxed">
            Especificaciones técnicas y funcionales del sistema.
          </p>
        </Reveal>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={faq.q} delay={index * 40}>
                <div className="p-1 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors">
                  <div
                    className={`rounded-[22px] bg-zinc-900 transition-colors duration-300 overflow-hidden ${
                      isOpen ? 'bg-zinc-900/80 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-sans text-lg font-bold tracking-tighter text-white leading-snug">{faq.q}</span>
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-zinc-400'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 pt-1 text-sm text-zinc-400 leading-relaxed font-normal tracking-tight border-t border-white/5">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12">
          <div className="p-1 rounded-3xl bg-white/5 border border-white/10">
            <div className="text-center p-8 rounded-[22px] bg-zinc-900 flex flex-col items-center">
              <p className="text-sm text-white font-bold tracking-tighter mb-3">
                ¿Requerimientos específicos para su operación?
              </p>
              <a
                href={getWhatsAppLink('Consulta técnica sobre implementación de sistema')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2 transition-colors bg-indigo-500/10 px-5 py-2.5 rounded-xl border border-indigo-500/20"
              >
                <span>Soporte técnico directo</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
