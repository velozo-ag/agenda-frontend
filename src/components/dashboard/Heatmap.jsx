import React from 'react';
import { CalendarDays } from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
// Only show realistic salon hours (e.g., 9:00 to 20:00) to keep the heatmap compact
const HOURS = Array.from({ length: 12 }, (_, i) => i + 9); 

export function Heatmap({ distribution }) {
  if (!distribution) return null;

  // Find max value to calculate color intensity
  let maxCount = 1;
  Object.values(distribution).forEach(hoursObj => {
    Object.values(hoursObj).forEach(count => {
      if (count > maxCount) maxCount = count;
    });
  });

  const getColor = (count) => {
    if (!count) return 'bg-zinc-800/40 hover:bg-zinc-800/80';
    const intensity = count / maxCount;
    // Usamos colores de esmeralda claros y legibles
    if (intensity > 0.75) return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] text-zinc-950 font-bold';
    if (intensity > 0.5) return 'bg-emerald-600 text-white font-medium';
    if (intensity > 0.25) return 'bg-emerald-800 text-emerald-100';
    return 'bg-emerald-950 text-emerald-300';
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-medium text-zinc-100">Mapa de Calor (Horarios Pico)</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Distribución de turnos por día y hora</p>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs">
          <span className="text-zinc-500">Menos concurrido</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-sm bg-zinc-800/40"></div>
            <div className="w-4 h-4 rounded-sm bg-emerald-950"></div>
            <div className="w-4 h-4 rounded-sm bg-emerald-800"></div>
            <div className="w-4 h-4 rounded-sm bg-emerald-600"></div>
            <div className="w-4 h-4 rounded-sm bg-emerald-500"></div>
          </div>
          <span className="text-zinc-500">Más concurrido</span>
        </div>
      </div>
      
      <div className="p-6 overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header (Hours) */}
          <div className="flex mb-2">
            <div className="w-12 shrink-0"></div>
            {HOURS.map(h => (
              <div key={h} className="flex-1 text-center text-[10px] font-mono text-zinc-500">
                {h}:00
              </div>
            ))}
          </div>
          
          {/* Grid */}
          <div className="flex flex-col gap-2">
            {DAYS.map((day, idx) => (
              <div key={day} className="flex items-center">
                <div className="w-12 shrink-0 text-xs font-medium text-zinc-400">
                  {DAY_LABELS[idx]}
                </div>
                <div className="flex flex-1 gap-1">
                  {HOURS.map(h => {
                    const count = distribution[day]?.[h] || 0;
                    return (
                      <div 
                        key={h}
                        title={`${count} turnos el ${DAY_LABELS[idx]} a las ${h}:00`}
                        className={`flex-1 h-8 rounded-md transition-colors cursor-crosshair flex items-center justify-center text-[11px] ${getColor(count)} hover:brightness-110`}
                      >
                        {count > 0 && count}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
