import React from 'react';
import { AppointmentCard } from './AppointmentCard';

export function WeeklyCalendar({ appointments, onSlotClick, onAppointmentClick, selectedDate, barberId }) {
  // A simplified weekly calendar view
  // Generates columns for Mon-Sun
  
  const startOfWeek = new Date(selectedDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0,0,0,0);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 14 }).map((_, i) => i + 8); // 8 AM to 9 PM

  return (
    <div className="flex-1 overflow-auto bg-zinc-950 flex flex-col min-w-[800px]">
      <div className="flex border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
        <div className="w-16 shrink-0 border-r border-zinc-800"></div>
        {days.map(d => (
          <div key={d.toISOString()} className="flex-1 p-3 text-center border-r border-zinc-800 last:border-0">
            <div className="text-sm font-semibold text-zinc-300">
              {d.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase()}
            </div>
            <div className="text-2xl font-bold text-zinc-100">{d.getDate()}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-1 relative">
        <div className="w-16 shrink-0 relative">
          {hours.map(h => (
            <div key={h} className="h-[4rem] min-h-[4rem] border-b border-zinc-800 flex items-start justify-center pt-2">
              <span className="text-xs font-mono text-zinc-500">{h}:00</span>
            </div>
          ))}
        </div>

        <div className="flex-1 flex relative border-l border-zinc-800">
          {days.map(d => {
            const dayAppointments = appointments.filter(a => {
              const apptDate = new Date(a.startTime);
              return apptDate.getDate() === d.getDate() && apptDate.getMonth() === d.getMonth();
            });

            return (
              <div key={d.toISOString()} className="flex-1 border-r border-zinc-800 last:border-0 relative">
                {hours.map(h => (
                  <div 
                    key={h} 
                    onClick={() => {
                      const slotTime = new Date(d);
                      slotTime.setHours(h, 0, 0, 0);
                      onSlotClick(slotTime);
                    }}
                    className="h-[4rem] min-h-[4rem] border-b border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-colors"
                  />
                ))}
                
                {/* Render appointments positioned absolutely */}
                {dayAppointments.map((appt, index) => {
                  const start = new Date(appt.startTime);
                  const end = new Date(appt.endTime);
                  
                  // h-16 = 4rem. We use rem to ensure it scales with root font-size.
                  const topRem = ((start.getHours() - 8) + start.getMinutes() / 60) * 4; 
                  const heightRem = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 4;
                  
                  // Calculate overlap (simple visual stagger if they start at the exact same hour)
                  const overlappingIndex = dayAppointments.filter((a, i) => i < index && new Date(a.startTime).getTime() === start.getTime()).length;
                  const leftOffset = overlappingIndex > 0 ? `calc(2px + ${overlappingIndex * 15}%)` : '2px';
                  const rightOffset = '2px';
                  const zIndex = 10 + overlappingIndex;

                  return (
                    <div 
                      key={appt.id}
                      style={{ 
                        top: `${topRem}rem`, 
                        height: `${heightRem}rem`,
                        left: leftOffset,
                        right: rightOffset,
                        zIndex: zIndex
                      }}
                      className="absolute group"
                    >
                      <AppointmentCard appointment={appt} onClick={onAppointmentClick} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
