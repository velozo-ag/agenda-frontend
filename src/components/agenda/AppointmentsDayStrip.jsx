import React, { useMemo, useEffect } from 'react';
import { useAppointments } from '../../hooks/useAppointments';

export function AppointmentsDayStrip({ selectedDate, onChange, barberId }) {
  const parseLocalDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    return new Date(y, m - 1, d);
  };

  const currentDateObj = parseLocalDate(selectedDate);
  const now = new Date();
  const todayLocal = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  const days = useMemo(() => {
    const arr = [];
    for (let i = -15; i <= 15; i++) {
      const d = new Date(currentDateObj);
      d.setDate(currentDateObj.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      const iso = `${y}-${m}-${dayStr}`;
      
      const dayName = d.toLocaleDateString('es-AR', { weekday: 'short' });
      const dayNumber = d.getDate();
      arr.push({ iso, dayName, dayNumber, isToday: iso === todayLocal });
    }
    return arr;
  }, [currentDateObj, todayLocal]);

  const fromDate = days[0].iso;
  const toDate = days[days.length - 1].iso;

  const { data: rangeAppointmentsData } = useAppointments({
    fromDate,
    toDate,
    barberId: barberId || undefined,
  });

  const appointments = rangeAppointmentsData?.data || rangeAppointmentsData || [];
  
  const daysWithAppointments = useMemo(() => {
    const set = new Set();
    appointments.forEach(a => {
      const datePart = new Date(a.startTime);
      const isoLocal = new Date(datePart.getTime() - (datePart.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      set.add(isoLocal);
    });
    return set;
  }, [appointments]);

  const scrollContainerRef = React.useRef(null);
  
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedEl = scrollContainerRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDate]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none w-full px-2 snap-x"
    >
      {days.map((d) => {
        const isSelected = selectedDate === d.iso;
        const hasAppts = daysWithAppointments.has(d.iso);
        
        return (
          <button
            key={d.iso}
            data-selected={isSelected}
            onClick={() => onChange(d.iso)}
            className={`relative px-3 py-2 rounded-xl border flex flex-col items-center min-w-[52px] transition-all cursor-pointer shrink-0 snap-center ${
              isSelected
                ? 'border-amber-500 bg-amber-500 text-zinc-950 font-bold shadow-xs scale-105'
                : d.isToday
                  ? 'border-amber-500/50 bg-zinc-900 text-amber-500 hover:bg-zinc-800'
                  : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850'
            }`}
          >
            <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-zinc-950' : 'text-zinc-500'}`}>
              {d.dayName}
            </span>
            <span className="text-sm font-black font-mono">{d.dayNumber}</span>
            {hasAppts && (
              <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-zinc-950' : 'bg-amber-500'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
