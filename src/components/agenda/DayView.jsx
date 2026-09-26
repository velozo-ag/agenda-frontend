import React from 'react';
import { AppointmentCard } from './AppointmentCard';

export function DayView({ appointments, onSlotClick, onAppointmentClick, selectedDate }) {
  const hours = Array.from({ length: 14 }).map((_, i) => i + 8); // 8 AM to 9 PM

  const dayAppointments = appointments.filter(a => {
    const apptDate = new Date(a.startTime);
    return apptDate.getDate() === selectedDate.getDate() && apptDate.getMonth() === selectedDate.getMonth();
  });

  return (
    <div className="flex-1 overflow-auto bg-zinc-950 flex relative min-w-[300px]">
      <div className="w-16 shrink-0 relative">
        {hours.map(h => (
          <div key={h} className="h-[6rem] min-h-[6rem] border-b border-zinc-800 flex items-start justify-center pt-2">
            <span className="text-xs font-mono text-zinc-500">{h}:00</span>
          </div>
        ))}
      </div>

      <div className="flex-1 relative border-l border-zinc-800">
        {hours.map(h => (
          <div 
            key={h} 
            onClick={() => {
              const slotTime = new Date(selectedDate);
              slotTime.setHours(h, 0, 0, 0);
              onSlotClick(slotTime);
            }}
            className="h-[6rem] min-h-[6rem] border-b border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-colors"
          />
        ))}

        {dayAppointments.map((appt, index) => {
          const start = new Date(appt.startTime);
          const end = new Date(appt.endTime);
          
          // h-24 = 6rem. We use rem to ensure it scales with mobile font-size accessibility settings.
          const topRem = ((start.getHours() - 8) + start.getMinutes() / 60) * 6; 
          const heightRem = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 6;
          
          // Calculate overlap (simple visual stagger if they start at the exact same hour)
          const overlappingIndex = dayAppointments.filter((a, i) => i < index && new Date(a.startTime).getTime() === start.getTime()).length;
          const leftOffset = overlappingIndex > 0 ? `calc(4px + ${overlappingIndex * 15}%)` : '4px';
          const rightOffset = '4px';
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
    </div>
  );
}
