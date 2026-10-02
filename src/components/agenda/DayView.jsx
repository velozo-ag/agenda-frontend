import React, { useState, useEffect } from 'react';
import { AppointmentCard } from './AppointmentCard';

const SLOT_REM = 4; // rem per hour — keep in sync with WeeklyCalendar

export function DayView({ appointments, onSlotClick, onAppointmentClick, selectedDate }) {
  const hours = Array.from({ length: 14 }).map((_, i) => i + 8); // 8 AM to 9 PM

  const dayAppointments = appointments.filter(a => {
    const apptDate = new Date(a.startTime);
    return (
      apptDate.getDate() === selectedDate.getDate() &&
      apptDate.getMonth() === selectedDate.getMonth() &&
      apptDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isToday =
    selectedDate.getDate() === now.getDate() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear();

  return (
    <div className="flex-1 overflow-auto bg-zinc-950 flex relative min-w-full">
      {/* Time axis */}
      <div className="w-14 shrink-0 relative z-10 bg-zinc-950 border-r border-zinc-800/50">
        {hours.map(h => (
          <div
            key={h}
            className={`flex items-start justify-end pr-3 pt-1 border-b border-zinc-800/40`}
            style={{ height: `${SLOT_REM}rem`, minHeight: `${SLOT_REM}rem` }}
          >
            <span className="text-[10px] text-zinc-600 font-mono tabular-nums">{h}:00</span>
          </div>
        ))}
      </div>

      {/* Timeline content */}
      <div className="flex-1 relative border-l-2 border-zinc-800">

        {/* Hour grid lines */}
        {hours.map(h => (
          <div
            key={h}
            onClick={() => {
              const slotTime = new Date(selectedDate);
              slotTime.setHours(h, 0, 0, 0);
              onSlotClick(slotTime);
            }}
            className="border-b border-zinc-800/50 hover:bg-zinc-900/30 cursor-pointer transition-colors group relative"
            style={{ height: `${SLOT_REM}rem`, minHeight: `${SLOT_REM}rem` }}
          >
            {/* Half-hour divider */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-800/30 top-1/2" />
          </div>
        ))}

        {/* Current Time Indicator */}
        {isToday && now.getHours() >= 8 && now.getHours() < 22 && (
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none"
            style={{ top: `${((now.getHours() - 8) + now.getMinutes() / 60) * SLOT_REM}rem` }}
          >
            <div className="absolute -left-[57px] bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-lg -translate-y-1/2 whitespace-nowrap">
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="absolute left-0 right-0 border-t-2 border-rose-500/70 z-40 pointer-events-none">
              <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)] -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Appointment blocks */}
        {dayAppointments.map(appt => {
          const start = new Date(appt.startTime);
          const end = new Date(appt.endTime);

          const topRem = ((start.getHours() - 8) + start.getMinutes() / 60) * SLOT_REM;
          const heightRem = Math.max(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * SLOT_REM, 1);

          const overlapping = dayAppointments.filter(a => {
            const as = new Date(a.startTime).getTime();
            const ae = new Date(a.endTime).getTime();
            return start.getTime() < ae && end.getTime() > as;
          });

          overlapping.sort(
            (a, b) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime() || a.id - b.id
          );
          const overlapCount = overlapping.length;
          const overlapIndex = overlapping.findIndex(a => a.id === appt.id);

          const stepPct = 90 / overlapCount;
          const leftPct = overlapIndex * stepPct;

          const leftOffset = `calc(${leftPct}% + 2px)`;
          const widthOffset = `calc(${100 - leftPct}% - 4px)`;
          const zIndex = 10 + overlapIndex;

          return (
            <div
              key={appt.id}
              style={{
                top: `${topRem}rem`,
                height: `${heightRem}rem`,
                left: leftOffset,
                width: widthOffset,
                zIndex,
              }}
              className="absolute group px-0.5 py-0.5 hover:z-30 hover:scale-[1.015] transition-transform duration-150 overflow-visible"
            >
              <AppointmentCard appointment={appt} onClick={onAppointmentClick} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
