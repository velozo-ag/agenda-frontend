import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Scissors, 
  ArrowRight, 
  Clock, 
  Check, 
  Calendar as CalendarIcon, 
  MapPin, 
  ChevronLeft 
} from 'lucide-react';

export function BookingPortalPhoneDemo({
  forcedStep = null,
  businessName = 'Barber Demo Titulo',
  slug = 'barberdemo',
  isStatic = false,
  preset = {
    tag: 'Barbería clásica',
    items: [
      { name: 'Pintado normal', desc: '120 min', price: '$10.000' },
      { name: 'Corte fade', desc: '30 min', price: '$5.000', hint: 'Requiere seña de $5.000' },
      { name: 'Corte tijera', desc: '30 min', price: '$5.000' },
    ],
    cart: 'Corte fade • empleado2',
    cartPrice: '$5.000'
  }
}) {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => {
    if (forcedStep !== null || isStatic) return;
    const timer = setInterval(() => {
      setInternalStep((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, [forcedStep, isStatic]);

  const step = forcedStep !== null ? forcedStep : internalStep;

  return (
    <div className={`relative w-[285px] sm:w-[310px] [perspective:1200px] group mx-auto ${isStatic ? '' : ''}`}>
      <div className={`relative ${isStatic ? '' : 'transition-transform duration-500 ease-out will-change-transform group-hover:[transform:translateY(-8px)_rotateY(0deg)_rotateX(0deg)] cursor-default animate-phone-float'}`}>
        
        {/* Hardware Buttons */}
        <div className="absolute -left-[3px] top-20 w-[3px] h-5 bg-gradient-to-r from-zinc-700 to-zinc-400 rounded-l-xs shadow-sm" />
        <div className="absolute -left-[3px] top-28 w-[3px] h-9 bg-gradient-to-r from-zinc-700 to-zinc-400 rounded-l-xs shadow-sm" />
        <div className="absolute -left-[3px] top-40 w-[3px] h-9 bg-gradient-to-r from-zinc-700 to-zinc-400 rounded-l-xs shadow-sm" />
        <div className="absolute -right-[3px] top-32 w-[3px] h-12 bg-gradient-to-l from-zinc-700 to-zinc-400 rounded-r-xs shadow-sm" />

        {/* Bezel Ring */}
        <div className="p-[2.5px] rounded-[48px] bg-gradient-to-tr from-zinc-700 via-zinc-400 to-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45),0_0_30px_rgba(0,0,0,0.2)]">
          <div className="relative rounded-[46px] p-2 bg-black border border-zinc-800/80 ring-1 ring-white/10">
            
            {/* Screen */}
            <div className="relative rounded-[36px] overflow-hidden bg-[#111115] text-zinc-100 aspect-[9/18.5] flex flex-col border border-zinc-800/90">
              
              <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />

              {/* Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-full z-40 flex items-center justify-between px-2.5 pointer-events-none ring-1 ring-zinc-800/60">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 ring-1 ring-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a14] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-indigo-900/90" />
                </div>
              </div>

              {/* Browser Address Bar */}
              <div className="pt-7 px-3 pb-1.5 bg-[#121214] border-b border-zinc-800 shrink-0 z-40 relative">
                <div className="mx-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#09090b] border border-zinc-800 text-[8px] text-zinc-400 font-mono w-max max-w-full">
                  <Lock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{slug}.agenda.roosty.site</span>
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 flex flex-col overflow-hidden relative text-left bg-zinc-950">
                
                {/* Background Texture/Blur to mimic image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col">
                  
                  {/* STEP 0: Welcome (p1) */}
                  <div className={`absolute inset-0 p-4 flex flex-col items-center justify-center transition-all duration-500 ease-out ${step === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
                    <div className="w-16 h-16 rounded-full bg-[#e2ceb1] text-zinc-900 flex items-center justify-center shadow-xl mb-4 p-1">
                      <div className="w-full h-full border-[1.5px] border-dashed border-zinc-900 rounded-full flex flex-col items-center justify-center">
                        <span className="font-black text-[9px] uppercase tracking-tighter leading-none mb-0.5 text-center px-1">Est. 2024</span>
                        <Scissors className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-white text-center leading-tight mb-2">{businessName}</h3>
                    <p className="text-[10px] text-zinc-300 text-center mb-6 max-w-[220px] font-medium leading-relaxed">
                      Reservá tu turno online en simples pasos. Rápido, fácil y sin esperas.
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-[9px] font-semibold text-zinc-300 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 mb-6">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      <span>Mar-Sab 10:00-20:00</span>
                    </div>

                    <div className="w-full h-10 bg-white text-black font-black text-[11px] rounded-xl flex items-center justify-center gap-2 mt-auto hover:bg-zinc-100 transition-colors cursor-pointer">
                      Reservar Turno <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* STEP 1: Service Selection (p2) */}
                  <div className={`absolute inset-0 flex flex-col transition-all duration-500 ease-out ${step === 1 ? 'opacity-100 translate-y-0' : step < 1 ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
                    
                    <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-white/10 relative">
                      <div className="absolute bottom-0 left-0 h-[1.5px] bg-indigo-500 w-1/3" />
                      <ChevronLeft className="w-4 h-4 text-zinc-400" />
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-[#e2ceb1]" />
                          <span className="text-[10px] font-black text-white">{businessName}</span>
                        </div>
                        <span className="text-[8px] text-zinc-400 mt-0.5">Paso 2 de 4</span>
                      </div>
                      <div className="w-4" />
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-none p-3 pb-20">
                      <h2 className="text-base font-black text-white mb-3">¿Qué servicio buscás?</h2>
                      
                      <div className="flex items-center gap-1.5 bg-[#1a1a1f] p-2 rounded-lg border border-white/5 mb-3">
                        <span className="text-[9px] text-zinc-500">Con:</span>
                        <span className="text-[9px] font-bold text-indigo-400">empleado2</span>
                        <span className="text-[8px] text-zinc-500 underline ml-auto">Cambiar</span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto scrollbar-none">
                        <div className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-[9px] font-bold whitespace-nowrap">
                          Todos
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-[#1a1a1f] border border-white/5 text-zinc-300 text-[9px] font-medium whitespace-nowrap">
                          Pintado
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-[#1a1a1f] border border-white/5 text-zinc-300 text-[9px] font-medium whitespace-nowrap">
                          Cortes
                        </div>
                      </div>

                      <div className="bg-[#121215] border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5 shadow-lg">
                        {preset.items.map((item, idx) => (
                          <div key={idx} className="p-3 flex justify-between items-center relative">
                            {idx === 1 && <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />}
                            <div>
                              <div className="text-[10px] font-bold text-white mb-0.5">{item.name}</div>
                              <div className="text-[8px] text-zinc-400 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {item.desc}
                              </div>
                              {item.hint && <div className="text-[8px] text-zinc-500 mt-1">{item.hint}</div>}
                            </div>
                            <div className="text-right flex flex-col items-end">
                              <div className="text-[11px] font-black text-indigo-400 font-mono mb-2">{item.price}</div>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${idx === 1 ? 'border-indigo-500 bg-indigo-500/20' : 'border-zinc-600'}`}>
                                {idx === 1 && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: Time Selection (p3) */}
                  <div className={`absolute inset-0 flex flex-col transition-all duration-500 ease-out ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                    
                    <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-white/10 relative">
                      <div className="absolute bottom-0 left-0 h-[1.5px] bg-indigo-500 w-2/3" />
                      <ChevronLeft className="w-4 h-4 text-zinc-400" />
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-[#e2ceb1]" />
                          <span className="text-[10px] font-black text-white">{businessName}</span>
                        </div>
                        <span className="text-[8px] text-zinc-400 mt-0.5">Paso 3 de 4</span>
                      </div>
                      <div className="w-4" />
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-none p-3 pb-20">
                      <h2 className="text-base font-black text-white leading-tight mb-0.5">Seleccioná el día y la hora</h2>
                      <p className="text-[10px] text-zinc-400 font-medium mb-4">{preset.cart}</p>
                      
                      <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Día del turno</div>
                      
                      <div className="flex gap-1.5 mb-5 overflow-x-auto scrollbar-none">
                        <div className="w-12 h-14 rounded-xl bg-[#1a1a1f] border border-white/5 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[8px] font-bold text-zinc-500 mb-0.5">JUE</span>
                          <span className="text-[13px] font-black text-zinc-300">8</span>
                          <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1" />
                        </div>
                        <div className="w-12 h-14 rounded-xl bg-indigo-500 border border-indigo-400 flex flex-col items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                          <span className="text-[8px] font-bold text-indigo-100 mb-0.5">VIE</span>
                          <span className="text-[13px] font-black text-white">9</span>
                          <div className="w-1 h-1 rounded-full bg-white mt-1" />
                        </div>
                        <div className="w-12 h-14 rounded-xl bg-[#1a1a1f] border border-white/5 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[8px] font-bold text-zinc-500 mb-0.5">JUE</span>
                          <span className="text-[13px] font-black text-zinc-300">15</span>
                          <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1" />
                        </div>
                        <div className="w-12 h-14 rounded-xl bg-[#1a1a1f] border border-white/5 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[8px] font-bold text-zinc-500 mb-0.5">VIE</span>
                          <span className="text-[13px] font-black text-zinc-300">16</span>
                          <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Horarios disponibles</div>
                        <div className="text-[9px] font-bold text-zinc-300">8 libres</div>
                      </div>

                      <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Tarde / Noche</div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="py-2.5 rounded-lg bg-[#1a1a1f] border border-white/5 text-center text-[10px] font-mono font-medium text-zinc-300">03:00 p. m.</div>
                        <div className="py-2.5 rounded-lg bg-indigo-500 border border-indigo-400 text-center text-[10px] font-mono font-black text-white shadow-md shadow-indigo-500/20">03:30 p. m.</div>
                        <div className="py-2.5 rounded-lg bg-[#1a1a1f] border border-white/5 text-center text-[10px] font-mono font-medium text-zinc-300">04:00 p. m.</div>
                        <div className="py-2.5 rounded-lg bg-[#1a1a1f] border border-white/5 text-center text-[10px] font-mono font-medium text-zinc-300">04:30 p. m.</div>
                        <div className="py-2.5 rounded-lg bg-[#1a1a1f] border border-white/5 text-center text-[10px] font-mono font-medium text-zinc-300">05:00 p. m.</div>
                        <div className="py-2.5 rounded-lg bg-[#1a1a1f] border border-white/5 text-center text-[10px] font-mono font-medium text-zinc-300">05:30 p. m.</div>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Bottom Bar (Steps 1 & 2) */}
                  <div className={`absolute bottom-0 w-full border-t border-white/5 bg-[#09090b] p-3 shadow-[0_-15px_30px_rgba(0,0,0,0.8)] transition-all duration-300 z-50 ${step > 0 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[9px] text-zinc-400 truncate mb-0.5">{preset.cart}</div>
                        <div className="text-[12px] font-black font-mono text-indigo-400">{preset.cartPrice}</div>
                      </div>
                      <div className="px-4 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1.5 shrink-0 shadow-lg shadow-indigo-500/20 cursor-pointer hover:bg-indigo-400 transition-colors">
                        Continuar <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Home Indicator */}
              <div className="pb-1.5 pt-1 bg-zinc-950 flex justify-center shrink-0 z-50">
                <div className="w-[35%] h-1 bg-zinc-700 rounded-full" />
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Floor Shadow */}
      {!isStatic && <div className="w-3/4 h-5 bg-zinc-950/35 blur-xl rounded-[100%] mx-auto mt-4" />}
    </div>
  );
}
