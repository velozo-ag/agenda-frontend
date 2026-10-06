import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';

export function AppointmentsMonthPicker({ selectedDate, onChange }) {
  const parseLocalDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    return new Date(y, m - 1, d);
  };

  const [currentMonth, setCurrentMonth] = useState(parseLocalDate(selectedDate));
  
  useEffect(() => {
    setCurrentMonth(parseLocalDate(selectedDate));
  }, [selectedDate]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Fetch appointments for the whole month to show dots
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const formatLocalIso = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const { data: monthAppointmentsData } = useAppointments({
    fromDate: formatLocalIso(firstDay),
    toDate: formatLocalIso(lastDay)
  });

  const appointments = monthAppointmentsData?.data || monthAppointmentsData || [];
  
  const daysWithAppointments = new Set(
    appointments.map(a => new Date(a.startTime).getDate())
  );

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isSelected = (day) => {
    if (!day) return false;
    const d = parseLocalDate(selectedDate);
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  };

  const isToday = (day) => {
    if (!day) return false;
    const d = new Date();
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-zinc-900 dark:text-zinc-100 font-semibold capitalize flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-amber-500" />
          {currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-md transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-md transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500 mb-2">
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          
          const selected = isSelected(day);
          const today = isToday(day);
          const hasAppts = daysWithAppointments.has(day);

          return (
            <button
              key={day}
              onClick={() => {
                const mm = String(month + 1).padStart(2, '0');
                const dd = String(day).padStart(2, '0');
                onChange(`${year}-${mm}-${dd}`);
              }}
              className={`
                relative h-10 rounded-lg text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center
                ${selected 
                  ? 'bg-amber-500 text-zinc-900 dark:text-zinc-950 shadow-md scale-105' 
                  : today 
                    ? 'bg-amber-50 dark:bg-zinc-800/50 text-amber-600 dark:text-amber-500 border border-amber-500/30 hover:bg-amber-100 dark:hover:bg-zinc-800' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'}
              `}
            >
              <span>{day}</span>
              {hasAppts && (
                <span className={`absolute bottom-1.5 w-1 h-1 rounded-full ${selected ? 'bg-zinc-900 dark:bg-zinc-950' : 'bg-amber-500'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
