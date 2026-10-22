import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { getWhatsAppLink } from './landingConfig';

const FAQS = [
  {
    q: '¿Qué incluye el Plan Cero gratuito y cuántos turnos permite?',
    a: 'El Plan Cero es 100% gratis para siempre y no pide tarjeta de crédito. Incluye tu link público de reservas 24/7, agenda online, recordatorios automáticos por correo, base de datos de clientes (CRM) y control de caja diaria para 1 profesional con hasta 40 turnos mensuales.',
  },
  {
    q: '¿Roosty Agenda cobra comisión por cada turno o reserva?',
    a: 'No. Roosty Agenda tiene 0% de comisión por turno. Todo lo que cobres en señas por transferencia o en el salón queda 100% en tu cuenta sin intermediarios.',
  },
  {
    q: '¿Cómo funciona el cobro de señas para evitar ausencias?',
    a: 'Podés configurar qué servicios requieren seña y definir el importe fijo. Cuando el cliente reserva desde tu link, visualiza tu Alias o CBU, realiza la transferencia y adjunta el comprobante en el mismo flujo para que el turno quede asegurado.',
  },
  {
    q: '¿Cómo pongo mi link de turnos en Instagram y WhatsApp?',
    a: 'Al crear tu cuenta recibís un subdominio exclusivo con el nombre de tu local (ej. tubarberia.agenda.roosty.site). Lo pegás en tu biografía de Instagram o en el mensaje de bienvenida de WhatsApp Business para que tus clientes reserven solos las 24 horas sin descargar ninguna aplicación.',
  },
  {
    q: '¿Cómo calcula el sistema las comisiones de cada barbero?',
    a: 'En el Plan Crew podés registrar hasta 10 profesionales y asignarle un porcentaje de comisión individual a cada uno. Cada servicio finalizado suma automáticamente a su liquidación y podés consultar o exportar el cierre exacto en un clic.',
  },
  {
    q: '¿Envía recordatorios automáticos a los clientes antes del turno?',
    a: 'Sí. El sistema envía confirmaciones y recordatorios automáticos por correo electrónico antes de cada cita con el detalle del horario, profesional asignado y un botón directo para consultar el estado o reprogramar con anticipación.',
  },
  {
    q: '¿Tengo que instalar algún programa en la PC o el celular?',
    a: 'No. Roosty Agenda es 100% web en la nube. Podés abrir tu agenda y cobrar desde el navegador de cualquier celular, tablet o computadora en tiempo real.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      aria-label="Preguntas frecuentes sobre Roosty Agenda"
      className="scroll-mt-24 py-32 bg-zinc-950 relative border-b border-white/5"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <h2 className="font-sans text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-5 leading-tight">
            Preguntas frecuentes.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-normal tracking-tight leading-relaxed">
            Todo lo que necesitás saber sobre turnos online, señas, comisiones y planes.
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
