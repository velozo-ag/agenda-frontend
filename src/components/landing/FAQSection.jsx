import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { getWhatsAppLink } from './landingConfig';

const FAQS = [
  {
    q: '¿Qué incluye el Plan Cero y hasta cuándo puedo usarlo?',
    a: 'El Plan Cero es gratis para siempre: incluye tu portal público con subdominio propio, la agenda por día y semana, la ficha de clientes y la caja del día, con hasta 40 turnos por mes y 1 barbero. No pedimos tarjeta de crédito para crear la cuenta.',
  },
  {
    q: '¿Cómo funciona el link propio de mi barbería?',
    a: 'Al crear tu cuenta elegís un nombre (por ejemplo "elbaron") y tu portal queda activo en elbaron.agenda.roosty.site. Ese es el link que ponés en la bio de Instagram y en WhatsApp para que tus clientes reserven solos, con tu logo, portada y colores.',
  },
  {
    q: '¿Cómo cobro las señas?',
    a: 'Podés pedir seña por servicio. El cliente transfiere, adjunta el comprobante al reservar y vos lo aprobás desde tu panel; recién ahí el turno queda confirmado. Es una función de los planes Navaja y Crew.',
  },
  {
    q: '¿Tengo que instalar algún programa?',
    a: 'No. Roosty Agenda funciona 100% en el navegador, desde el celular, la tablet o la computadora que ya tengas en el local. Tus clientes tampoco instalan nada: reservan desde un link.',
  },
  {
    q: '¿Puedo tener varios barberos con comisiones distintas?',
    a: 'Sí, con el plan Crew podés sumar hasta 10 barberos. Cada uno tiene su usuario, su color en la agenda y su porcentaje de comisión; el sistema calcula la liquidación del período y cada barbero ve solo lo suyo.',
  },
  {
    q: '¿Qué pasa si supero los 40 turnos del Plan Cero?',
    a: 'El sistema te avisa antes de llegar al límite. Si lo alcanzás, podés pasar a Navaja o Crew para seguir recibiendo reservas sin tope; tus clientes, servicios y turnos se mantienen intactos.',
  },
  {
    q: '¿Cómo cargo mis servicios y horarios?',
    a: 'Desde el panel, en minutos: nombre, duración y precio de cada servicio, y los días y franjas horarias en los que atendés. Si necesitás ayuda con la puesta en marcha, escribinos por WhatsApp.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="scroll-mt-24 py-20 md:py-28 bg-white relative border-t border-zinc-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-14">
          <h2 className="lp-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 mb-5 leading-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            Todo lo que necesitás saber antes de empezar a operar con Roosty Agenda.
          </p>
        </Reveal>

        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={faq.q} delay={index * 40}>
                <div
                  className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-zinc-300 bg-[#faf9f8] shadow-sm'
                      : 'border-zinc-200/80 bg-white hover:border-zinc-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="lp-serif text-base sm:text-lg font-bold text-zinc-900 leading-snug">{faq.q}</span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        isOpen ? 'rotate-180 bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-zinc-600 leading-relaxed border-t border-zinc-200/50 font-light">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12">
          <div className="text-center p-6 rounded-2xl bg-[#faf9f8] border border-zinc-200/80">
            <p className="text-sm text-zinc-700 font-medium mb-2">
              ¿Tenés alguna consulta sobre cómo se adapta a tu barbería?
            </p>
            <a
              href={getWhatsAppLink('Hola, tengo una consulta sobre Roosty Agenda')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Chatear con un asesor por WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
