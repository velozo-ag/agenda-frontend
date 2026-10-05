import React, { useState, useEffect } from 'react';
import { AppointmentCard } from './AppointmentCard';

export function WeeklyCalendar({ appointments, onSlotClick, onAppointmentClick, selectedDate, barbers = [], barberId }) {
  // Mobile responsiveness
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // A rolling view starting from the selected date
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setHours(0,0,0,0);

  const daysToShow = isMobile ? 1 : 7;
  const days = Array.from({ length: daysToShow }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 14 }).map((_, i) => i + 8); // 8 AM to 9 PM

  // Real-time indicator
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex-1 overflow-auto bg-zinc-950 flex flex-col relative ${!isMobile && 'min-w-[800px]'}`}>
      <div className="flex border-b border-zinc-800 sticky top-0 bg-zinc-950 z-30">
        <div className="w-16 shrink-0 border-r border-zinc-800"></div>
        {days.map(d => {
          const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          return (
            <div key={d.toISOString()} className={`flex-1 p-3 text-center border-r border-zinc-800 last:border-0 ${isToday ? 'bg-zinc-900/40' : ''}`}>
              <div className={`text-[11px] font-semibold ${isToday ? 'text-amber-500' : 'text-zinc-400'}`}>
                {d.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase()}
              </div>
              <div className={`text-2xl font-bold mt-0.5 ${isToday ? 'text-amber-500' : 'text-zinc-100'}`}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-1 relative">
        <div className="w-16 shrink-0 relative z-10 bg-zinc-950">
          {hours.map(h => (
            <div key={h} className="h-[4rem] min-h-[4rem] border-b border-zinc-800 flex items-start justify-center pt-1">
              <span className="text-[10px] font-mono text-zinc-600">{h}:00</span>
            </div>
          ))}
        </div>

        <div className="flex-1 flex relative border-l border-zinc-800">
          
          {/* Global Time Pill on the left axis (only if today is visible in the current view) */}
          {days.some(d => d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) && 
           now.getHours() >= 8 && now.getHours() < 22 && (
            <div 
              className="absolute left-0 right-0 z-20 pointer-events-none"
              style={{ top: `${((now.getHours() - 8) + now.getMinutes() / 60) * 4}rem` }}
            >
              <div className="absolute -left-14 bg-rose-500/90 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm transform -translate-y-1/2">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}

          {days.map(d => {
            const dayAppointments = appointments.filter(a => {
              const apptDate = new Date(a.startTime);
              return apptDate.getDate() === d.getDate() && apptDate.getMonth() === d.getMonth() && apptDate.getFullYear() === d.getFullYear();
            });

            const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

            return (
              <div key={d.toISOString()} className={`flex-1 border-r border-zinc-800 last:border-0 relative ${isToday ? 'bg-zinc-900/10' : ''}`}>
                {hours.map(h => (
                  <div 
                    key={h} 
                    onClick={() => {
                      const slotTime = new Date(d);
                      slotTime.setHours(h, 0, 0, 0);
                      onSlotClick(slotTime);
                    }}
                    className="h-[4rem] min-h-[4rem] border-b border-zinc-800 hover:bg-zinc-800/40 cursor-pointer transition-colors"
                  />
                ))}
                
                {/* Current Time Line (Only on Today's column) */}
                {isToday && now.getHours() >= 8 && now.getHours() < 22 && (
                  <div 
                    className="absolute left-0 right-0 border-t-2 border-rose-500/80 border-dashed z-40 pointer-events-none"
                    style={{ top: `${((now.getHours() - 8) + now.getMinutes() / 60) * 4}rem` }}
                  >
                    <div className="absolute -left-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] transform -translate-y-1/2"></div>
                  </div>
                )}
                
                {/* Render appointments */}
                {dayAppointments.map(appt => {
                  const start = new Date(appt.startTime);
                  const end = new Date(appt.endTime);
                  
                  const topRem = ((start.getHours() - 8) + start.getMinutes() / 60) * 4; 
                  const heightRem = Math.max(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 4, 1);
                  
                  // Dinámico: se dividen el espacio equitativamente (50%, 33%, etc)
                  const overlapping = dayAppointments.filter(a => {
                    const as = new Date(a.startTime).getTime();
                    const ae = new Date(a.endTime).getTime();
                    return start.getTime() < ae && end.getTime() > as;
                  });
                  
                  // Ordenarlos para asignarles una 'columna' consistente
                  overlapping.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime() || a.id - b.id);
                  const overlapCount = overlapping.length;
                  const overlapIndex = overlapping.findIndex(a => a.id === appt.id);
                  
                  const stepPct = 90 / overlapCount;
                  const leftPct = overlapIndex * stepPct;
                  
                  const leftOffset = `calc(${leftPct}% + 1px)`;
                  const widthOffset = `calc(${100 - leftPct}% - 2px)`; // CASCADING: extends fully to the right edge
                  const zIndex = 10 + overlapIndex;

                  return (
                    <div 
                      key={appt.id}
                      style={{ 
                        top: `${topRem}rem`, 
                        height: `${heightRem}rem`,
                        left: leftOffset,
                        width: widthOffset,
                        zIndex: zIndex
                      }}
                      className="absolute group px-0.5 py-0.5 hover:z-30 hover:scale-[1.02] transition-transform duration-200 overflow-visible"
                    >
                      <AppointmentCard appointment={appt} barberColor={barbers.find(b => b.id === appt.barberId)?.color} onClick={onAppointmentClick} />
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
