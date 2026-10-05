import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  User, 
  Check,
  EyeOff,
  CalendarDays,
  ClipboardList,
  Users,
  Scissors,
  DollarSign,
  ChevronRight as ChevronRightIcon,
  X,
  Wallet,
  PieChart
} from 'lucide-react';

export function AgendaPhoneDemo() {
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab(prev => prev === 'list' ? 'day' : 'list');
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="relative w-[285px] sm:w-[310px] [perspective:1200px] group mx-auto">
      
      {/* Floating KPI: Seña */}
      <div className="hidden sm:flex absolute -left-12 lg:-left-28 top-20 z-50 items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-2xl animate-bounce-slow pointer-events-none">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
          <Wallet className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <div className="text-[10px] font-black text-zinc-900 leading-tight">Seña asegurada</div>
          <div className="text-[9px] text-zinc-500 font-medium leading-tight mt-0.5">MercadoPago • $5.000</div>
        </div>
      </div>

      {/* Floating KPI: Comisiones */}
      <div className="hidden sm:flex absolute -right-8 lg:-right-24 bottom-32 z-50 items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#18181b] backdrop-blur-md border border-zinc-800 shadow-2xl animate-bounce-slow-delayed pointer-events-none">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-sm border border-indigo-500/30">
          <PieChart className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <div className="text-[10px] font-black text-white leading-tight">Comisiones listas</div>
          <div className="text-[9px] text-zinc-400 font-medium leading-tight mt-0.5">Calculadas solas al cierre</div>
        </div>
      </div>

      <div className="relative transition-transform duration-500 ease-out will-change-transform group-hover:[transform:translateY(-8px)_rotateY(0deg)_rotateX(0deg)] cursor-default animate-phone-float">
        
        {/* Hardware Buttons */}
        <div className="absolute -left-[3px] top-20 w-[3px] h-5 bg-gradient-to-r from-zinc-700 to-zinc-400 rounded-l-xs shadow-sm" />
        <div className="absolute -left-[3px] top-28 w-[3px] h-9 bg-gradient-to-r from-zinc-700 to-zinc-400 rounded-l-xs shadow-sm" />
        <div className="absolute -left-[3px] top-40 w-[3px] h-9 bg-gradient-to-r from-zinc-700 to-zinc-400 rounded-l-xs shadow-sm" />
        <div className="absolute -right-[3px] top-32 w-[3px] h-12 bg-gradient-to-l from-zinc-700 to-zinc-400 rounded-r-xs shadow-sm" />

        {/* Bezel Ring */}
        <div className="p-[2.5px] rounded-[48px] bg-gradient-to-tr from-zinc-700 via-zinc-400 to-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45),0_0_30px_rgba(0,0,0,0.2)]">
          <div className="relative rounded-[46px] p-2 bg-black border border-zinc-800/80 ring-1 ring-white/10">
            
            {/* Screen */}
            <div className="relative rounded-[36px] overflow-hidden bg-[#09090b] text-zinc-100 aspect-[9/18.5] flex flex-col border border-zinc-800/90">
              
              {/* Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-full z-40 flex items-center justify-between px-2.5 pointer-events-none ring-1 ring-zinc-800/60">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 ring-1 ring-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a14] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-indigo-900/90" />
                </div>
              </div>

              {/* Status Bar Space */}
              <div className="pt-6 px-3 shrink-0" />

              {/* App Content */}
              <div className="flex-1 flex flex-col overflow-hidden relative text-left">
                
                {/* Header & Controls Card */}
                <div className="bg-[#151515] rounded-xl mx-2 mt-0.5 p-1.5 flex flex-col gap-1.5 shrink-0 shadow-sm border border-white/5 relative z-20">
                  
                  {/* Top Row: Navigation & Days */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
                    <button className="px-2 py-1 bg-[#222] hover:bg-[#2a2a2a] text-zinc-200 text-[8px] font-bold rounded-md shrink-0 transition-colors">Hoy</button>
                    <div className="flex items-center bg-[#222] rounded-md shrink-0">
                      <button className="p-1 text-zinc-400 hover:text-white"><ChevronLeft className="w-2.5 h-2.5" /></button>
                      <div className="w-px h-2.5 bg-zinc-700/50" />
                      <button className="p-1 text-zinc-400 hover:text-white"><ChevronRight className="w-2.5 h-2.5" /></button>
                    </div>
                    
                    {/* Days Strip */}
                    <div className="flex gap-0.5 pl-0.5">
                      {[
                        { d: 'MAR', n: '29' },
                        { d: 'MIÉ', n: '30' },
                        { d: 'JUE', n: '1', active: true },
                        { d: 'VIE', n: '2' },
                        { d: 'SÁB', n: '3' },
                      ].map((day, i) => (
                        <div key={i} className={`flex flex-col items-center justify-center w-6 h-8 rounded-md shrink-0 transition-colors ${day.active ? 'bg-indigo-500 text-white' : 'text-zinc-400 hover:bg-[#222]'}`}>
                          <span className={`text-[5px] font-bold ${day.active ? 'text-indigo-100' : 'text-zinc-500'}`}>{day.d}</span>
                          <span className="text-[9px] font-black leading-tight">{day.n}</span>
                          <span className={`w-1 h-1 rounded-full ${day.active ? 'bg-white' : 'bg-indigo-500'}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Row: View Toggles & Filters */}
                  <div className="flex items-center gap-1">
                    <div className="flex bg-[#222] rounded-md p-0.5 relative">
                      <div 
                        className="absolute top-0.5 bottom-0.5 bg-[#333] rounded-[4px] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        style={{
                          left: activeTab === 'day' ? '2px' : 'calc(50% + 1px)',
                          width: 'calc(50% - 3px)'
                        }}
                      />
                      <button 
                        onClick={() => setActiveTab('day')}
                        className={`relative z-10 px-2 py-0.5 w-9 text-center text-[8px] font-bold transition-colors ${activeTab === 'day' ? 'text-white' : 'text-zinc-400'}`}
                      >
                        Día
                      </button>
                      <button 
                        onClick={() => setActiveTab('list')}
                        className={`relative z-10 px-2 py-0.5 w-9 text-center text-[8px] font-bold transition-colors ${activeTab === 'list' ? 'text-white' : 'text-zinc-400'}`}
                      >
                        Lista
                      </button>
                    </div>

                    <button className="p-1 rounded-md bg-[#222] text-zinc-400 hover:text-white transition-colors">
                      <EyeOff className="w-2.5 h-2.5" />
                    </button>

                    <button className="flex-1 flex justify-between items-center px-2 py-0.5 rounded-md bg-[#222] text-zinc-300 text-[8px] font-bold">
                      Todos los Barberos
                    </button>
                  </div>
                </div>

                {/* Main Content Area (Animated Transition) */}
                <div className="flex-1 relative overflow-hidden mt-0.5">
                  
                  {/* ====== LIST VIEW ====== */}
                  <div 
                    className={`absolute inset-0 px-2 py-0.5 overflow-y-auto scrollbar-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${activeTab === 'list' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'}`}
                  >
                    <div className="flex items-center gap-2 mb-2 mt-1 opacity-60">
                      <div className="h-px bg-zinc-800 flex-1" />
                      <span className="text-[6px] font-mono text-zinc-400 uppercase tracking-widest">Jueves, 1 de Octubre de 2026</span>
                      <div className="h-px bg-zinc-800 flex-1" />
                    </div>

                    <div className="space-y-2 relative before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-px before:bg-zinc-800">
                      
                      {/* Appointment Card 1 - Lucho (Emerald) */}
                      <div className="relative pl-5">
                        <div className="absolute left-2.5 top-[18px] w-1 h-1 rounded-full bg-emerald-500 -translate-x-1/2 ring-[3px] ring-[#09090b]" />
                        <div className="bg-[#151515] rounded-xl p-2 flex items-center justify-between border border-white/5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] font-black text-white font-mono">09:00</span>
                              <span className="text-[7px] font-medium text-zinc-500 font-mono">09:45</span>
                            </div>
                            <div className="w-px h-5 bg-zinc-800" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-white flex items-center gap-1">
                                <User className="w-2.5 h-2.5 text-zinc-400" /> Martín R.
                              </span>
                              <span className="text-[7px] text-zinc-500 mt-0.5">Corte Clásico • Lucho</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-emerald-500" />
                            </div>
                            <ChevronRightIcon className="w-3 h-3 text-zinc-600" />
                          </div>
                        </div>
                      </div>

                      {/* Appointment Card 2 - Tomás (Indigo) */}
                      <div className="relative pl-5">
                        <div className="absolute left-2.5 top-[18px] w-1 h-1 rounded-full bg-indigo-500 -translate-x-1/2 ring-[3px] ring-[#09090b]" />
                        <div className="bg-[#151515] rounded-xl p-2 flex items-center justify-between border border-white/5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] font-black text-white font-mono">10:00</span>
                              <span className="text-[7px] font-medium text-zinc-500 font-mono">11:00</span>
                            </div>
                            <div className="w-px h-5 bg-zinc-800" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-white flex items-center gap-1">
                                <User className="w-2.5 h-2.5 text-zinc-400" /> Joaquín Pérez
                              </span>
                              <span className="text-[7px] text-zinc-500 mt-0.5">Corte + Barba • Tomás</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-zinc-600" />
                            </div>
                            <ChevronRightIcon className="w-3 h-3 text-zinc-600" />
                          </div>
                        </div>
                      </div>

                      {/* Appointment Card 3 - Nico (Violet) Cancelled */}
                      <div className="relative pl-5 opacity-60">
                        <div className="absolute left-2.5 top-[18px] w-1 h-1 rounded-full bg-zinc-600 -translate-x-1/2 ring-[3px] ring-[#09090b]" />
                        <div className="bg-[#151515] rounded-xl p-2 flex items-center justify-between border border-white/5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] font-black text-zinc-400 font-mono line-through">11:30</span>
                              <span className="text-[7px] font-medium text-zinc-600 font-mono">12:00</span>
                            </div>
                            <div className="w-px h-5 bg-zinc-800" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-zinc-400 flex items-center gap-1 line-through">
                                <User className="w-2.5 h-2.5 text-zinc-500" /> Fede L.
                              </span>
                              <span className="text-[7px] text-zinc-600 mt-0.5">Perfilado de Barba • Nico</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                              <X className="w-2.5 h-2.5 text-rose-500" />
                            </div>
                            <ChevronRightIcon className="w-3 h-3 text-zinc-600" />
                          </div>
                        </div>
                      </div>

                      {/* Appointment Card 4 - Lucho (Emerald) */}
                      <div className="relative pl-5">
                        <div className="absolute left-2.5 top-[18px] w-1 h-1 rounded-full bg-emerald-500 -translate-x-1/2 ring-[3px] ring-[#09090b]" />
                        <div className="bg-[#151515] rounded-xl p-2 flex items-center justify-between border border-white/5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] font-black text-white font-mono">12:15</span>
                              <span className="text-[7px] font-medium text-zinc-500 font-mono">13:00</span>
                            </div>
                            <div className="w-px h-5 bg-zinc-800" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-white flex items-center gap-1">
                                <User className="w-2.5 h-2.5 text-zinc-400" /> Gastón Vega
                              </span>
                              <span className="text-[7px] text-zinc-500 mt-0.5">Fade Texturizado • Lucho</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-zinc-600" />
                            </div>
                            <ChevronRightIcon className="w-3 h-3 text-zinc-600" />
                          </div>
                        </div>
                      </div>

                      {/* Appointment Card 5 - Nico (Violet) */}
                      <div className="relative pl-5 pb-4">
                        <div className="absolute left-2.5 top-[18px] w-1 h-1 rounded-full bg-violet-500 -translate-x-1/2 ring-[3px] ring-[#09090b]" />
                        <div className="bg-[#151515] rounded-xl p-2 flex items-center justify-between border border-white/5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] font-black text-white font-mono">13:30</span>
                              <span className="text-[7px] font-medium text-zinc-500 font-mono">14:15</span>
                            </div>
                            <div className="w-px h-5 bg-zinc-800" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-white flex items-center gap-1">
                                <User className="w-2.5 h-2.5 text-zinc-400" /> Enzo F.
                              </span>
                              <span className="text-[7px] text-zinc-500 mt-0.5">Corte + Lavado • Nico</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-zinc-600" />
                            </div>
                            <ChevronRightIcon className="w-3 h-3 text-zinc-600" />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ====== DAY VIEW ====== */}
                  <div 
                    className={`absolute inset-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${activeTab === 'day' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'}`}
                  >
                    <div className="flex-1 flex overflow-y-auto scrollbar-none relative pb-14">
                      {/* Time Axis */}
                      <div className="w-10 shrink-0 border-r border-zinc-800/50 pt-1.5 z-20">
                        {[9, 10, 11, 12, 13, 14, 15].map(h => (
                          <div key={h} className="h-[48px] flex justify-end pr-1.5 -mt-1.5">
                            <span className="text-[7px] font-mono text-zinc-600 font-medium">{h}:00</span>
                          </div>
                        ))}
                      </div>

                      {/* Timeline Grid */}
                      <div className="flex-1 relative pt-1.5">
                        {/* Grid lines */}
                        {[9, 10, 11, 12, 13, 14, 15].map(h => (
                          <div key={h} className="h-[48px] border-t border-zinc-800/40 relative">
                            <div className="absolute top-[23px] left-0 right-0 h-px border-t border-dashed border-zinc-800/20" />
                          </div>
                        ))}

                        {/* Current Time Line */}
                        <div className="absolute top-[34px] left-0 right-0 border-t border-indigo-500/80 z-30 pointer-events-none">
                          <div className="absolute -left-1 -top-[2px] w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        </div>

                        {/* Timeline Appointment 1 (Lucho - Emerald) */}
                        <div className="absolute top-[0px] left-0 w-[calc(50%-2px)] h-[36px] z-10 pl-1">
                          <div className="w-full h-full bg-[#062417] border-t-[1.5px] border-t-[#10b981] border-x border-b border-zinc-800/50 rounded-b-md rounded-tr-md flex flex-col p-1 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-0.5 text-[7px] font-bold text-white mb-0.5">
                              <User className="w-2 h-2 text-emerald-400" /> Martín R.
                            </div>
                            <div className="text-[6px] text-zinc-400 mb-auto truncate">Corte Clásico</div>
                            <div className="flex items-center gap-0.5 text-[5px] font-bold text-emerald-500 bg-emerald-500/10 w-max px-1 py-0.5 rounded border border-emerald-500/20">
                              <Check className="w-1.5 h-1.5" /> CONFIRMADO
                            </div>
                          </div>
                        </div>

                        {/* Timeline Appointment 2 (Tomás - Indigo) */}
                        <div className="absolute top-[48px] left-[calc(50%)] w-[calc(50%-4px)] h-[48px] z-10 pl-1">
                          <div className="w-full h-full bg-[#1e1b4b] border-t-[1.5px] border-t-[#6366f1] border-x border-b border-zinc-800/50 rounded-b-md rounded-tr-md flex flex-col p-1 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-0.5 text-[7px] font-bold text-white mb-0.5">
                              <User className="w-2 h-2 text-indigo-400" /> Joaquín
                            </div>
                            <div className="text-[6px] text-zinc-400 mb-auto truncate">Corte + Barba</div>
                            <div className="flex items-center gap-0.5 text-[5px] font-bold text-amber-500 bg-amber-500/10 w-max px-1 py-0.5 rounded border border-amber-500/20">
                              SEÑA
                            </div>
                          </div>
                        </div>

                        {/* Timeline Appointment 3 (Lucho - Emerald) */}
                        <div className="absolute top-[156px] left-0 w-[calc(50%-2px)] h-[36px] z-10 pl-1">
                          <div className="w-full h-full bg-[#062417] border-t-[1.5px] border-t-[#10b981] border-x border-b border-zinc-800/50 rounded-b-md rounded-tr-md flex flex-col p-1 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-0.5 text-[7px] font-bold text-white mb-0.5">
                              <User className="w-2 h-2 text-emerald-400" /> Gastón V.
                            </div>
                            <div className="text-[6px] text-zinc-400 mb-auto truncate">Fade Texturizado</div>
                          </div>
                        </div>

                        {/* Timeline Appointment 4 (Nico - Violet) */}
                        <div className="absolute top-[216px] left-0 w-[calc(100%-4px)] h-[36px] z-10 pl-1">
                          <div className="w-full h-full bg-[#2e1065] border-t-[1.5px] border-t-[#8b5cf6] border-x border-b border-zinc-800/50 rounded-b-md rounded-tr-md flex flex-col p-1 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-0.5 text-[7px] font-bold text-white mb-0.5">
                              <User className="w-2 h-2 text-violet-400" /> Enzo F.
                            </div>
                            <div className="text-[6px] text-zinc-400 mb-auto truncate">Corte + Lavado • Nico</div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

                {/* FAB */}
                <div className="absolute bottom-14 right-3 z-40 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] text-white active:scale-95 transition-transform cursor-pointer">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>

                {/* Bottom Navigation */}
                <div className="bg-[#09090b] border-t border-zinc-800/80 pt-1.5 pb-1 px-3 flex justify-between items-center shrink-0 z-50">
                  <div className="flex flex-col items-center gap-0.5 text-indigo-500">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span className="text-[7px] font-bold">Agenda</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-zinc-500">
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span className="text-[7px] font-medium">Turnos</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-zinc-500">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[7px] font-medium">Clientes</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-zinc-500">
                    <Scissors className="w-3.5 h-3.5" />
                    <span className="text-[7px] font-medium">Servicios</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-zinc-500">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span className="text-[7px] font-medium">Ingresos</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Floor Shadow */}
      <div className="w-3/4 h-5 bg-zinc-950/35 blur-xl rounded-[100%] mx-auto mt-4" />
    </div>
  );
}
