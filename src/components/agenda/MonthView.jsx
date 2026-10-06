import React, { useMemo } from 'react';

const formatLocalIso = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatTime = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function MonthView({
  appointments = [],
  selectedDate = new Date(),
  barbers = [],
  selectedBarberId = '',
  onDayClick,
  onAppointmentClick,
}) {
  const today = useMemo(() => new Date(), []);

  // Filter appointments if barber is selected
  const filteredAppointments = useMemo(() => {
    if (!selectedBarberId) return appointments;
    return appointments.filter(a => {
      const aBarberId = a.barber?.id || a.barberId;
      return aBarberId === Number(selectedBarberId);
    });
  }, [appointments, selectedBarberId]);

  // Group appointments by local YYYY-MM-DD
  const appointmentsByDate = useMemo(() => {
    const map = new Map();
    filteredAppointments.forEach(appt => {
      if (!appt.startTime) return;
      const key = formatLocalIso(new Date(appt.startTime));
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(appt);
    });

    // Sort appointments in each day by startTime
    for (const [key, list] of map.entries()) {
      list.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }

    return map;
  }, [filteredAppointments]);

  // Build calendar grid cells (Monday to Sunday)
  const gridCells = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Monday = 0, ..., Sunday = 6
    const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Prev month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i);
      d.setHours(0, 0, 0, 0);
      cells.push({
        date: d,
        iso: formatLocalIso(d),
        dayNumber: d.getDate(),
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      d.setHours(0, 0, 0, 0);
      cells.push({
        date: d,
        iso: formatLocalIso(d),
        dayNumber: i,
        isCurrentMonth: true,
      });
    }

    // Next month padding to complete weeks
    const remainder = 7 - (cells.length % 7);
    if (remainder < 7) {
      for (let i = 1; i <= remainder; i++) {
        const d = new Date(year, month + 1, i);
        d.setHours(0, 0, 0, 0);
        cells.push({
          date: d,
          iso: formatLocalIso(d),
          dayNumber: i,
          isCurrentMonth: false,
        });
      }
    }

    return cells;
  }, [selectedDate]);

  const weekDayNames = [
    { short: 'Lun', long: 'Lunes' },
    { short: 'Mar', long: 'Martes' },
    { short: 'Mié', long: 'Miércoles' },
    { short: 'Jue', long: 'Jueves' },
    { short: 'Vie', long: 'Viernes' },
    { short: 'Sáb', long: 'Sábado' },
    { short: 'Dom', long: 'Domingo' },
  ];

  const todayIso = formatLocalIso(today);
  const selectedIso = formatLocalIso(selectedDate);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 overflow-auto select-none">
      {/* ── Day Names Header ── */}
      <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-slate-50/90 dark:bg-zinc-900/80 sticky top-0 z-20">
        {weekDayNames.map((d, index) => (
          <div
            key={index}
            className="py-2 sm:py-2.5 text-center text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-r border-zinc-200/50 dark:border-zinc-800/50 last:border-r-0"
          >
            <span className="hidden sm:inline">{d.long}</span>
            <span className="sm:hidden">{d.short}</span>
          </div>
        ))}
      </div>

      {/* ── Calendar Grid ── */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-zinc-200/70 dark:bg-zinc-800/70 gap-[1px]">
        {gridCells.map((cell) => {
          const isToday = cell.iso === todayIso;
          const isSelected = cell.iso === selectedIso;
          const dayAppointments = appointmentsByDate.get(cell.iso) || [];
          const count = dayAppointments.length;

          // Max 4 items displayed cleanly as list items without card boxes
          const visibleAppointments = dayAppointments.slice(0, 4);
          const hiddenCount = count - visibleAppointments.length;

          return (
            <div
              key={cell.iso}
              onClick={() => onDayClick?.(cell.date)}
              className={`min-h-[95px] sm:min-h-[120px] p-1.5 sm:p-2 flex flex-col relative transition-colors duration-150 cursor-pointer group ${
                cell.isCurrentMonth
                  ? isToday
                    ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.07] hover:bg-amber-500/[0.08] dark:hover:bg-amber-500/[0.12]'
                    : isSelected
                    ? 'bg-zinc-50 dark:bg-zinc-900/90 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50'
                    : 'bg-white dark:bg-zinc-950 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50'
                  : 'bg-slate-50/60 dark:bg-zinc-950/40 text-zinc-400 dark:text-zinc-600 hover:bg-slate-100/60 dark:hover:bg-zinc-900/40'
              }`}
            >
              {/* Top Cell Bar: Day number & subtle count */}
              <div className="flex items-center justify-between gap-1 mb-1">
                {/* Day number */}
                {isToday ? (
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center shadow-sm shadow-amber-500/30">
                    {cell.dayNumber}
                  </span>
                ) : (
                  <span
                    className={`text-xs sm:text-sm font-bold transition-colors ${
                      isSelected
                        ? 'text-amber-600 dark:text-amber-400 underline decoration-2 underline-offset-4'
                        : cell.isCurrentMonth
                        ? 'text-zinc-700 dark:text-zinc-300 group-hover:text-amber-500 dark:group-hover:text-amber-400'
                        : 'text-zinc-400 dark:text-zinc-600'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                )}

                {/* Right: Subtle count */}
                {count > 0 && (
                  <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {count}
                  </span>
                )}
              </div>

              {/* Appointments List inside cell */}
              <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                {visibleAppointments.map((appt) => {
                  const barber = barbers.find((b) => b.id === (appt.barber?.id || appt.barberId));
                  const barberColor = barber?.color || '#6366f1';
                  const timeStr = formatTime(appt.startTime);
                  const clientDisplayName = appt.clientName || 'Cliente';
                  const serviceName = appt.serviceNameSnapshot || appt.service?.name;
                  const isCancelled = appt.status === 'CANCELLED' || appt.status === 'NO_SHOW';

                  return (
                    <div
                      key={appt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick?.(appt);
                      }}
                      title={`${timeStr} - ${clientDisplayName}${serviceName ? ` (${serviceName})` : ''}\nBarbero: ${barber?.fullName || 'No asignado'}`}
                      className={`group/item flex items-center gap-1.5 px-1 py-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer text-[11px] leading-tight select-none ${
                        isCancelled ? 'opacity-40 line-through' : ''
                      }`}
                    >
                      {/* Barber color dot */}
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 shadow-2xs transition-transform group-hover/item:scale-125"
                        style={{ backgroundColor: barberColor }}
                      />

                      {/* Time */}
                      <span className="font-mono text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 shrink-0 tabular-nums">
                        {timeStr}
                      </span>

                      {/* Client name & service */}
                      <span className="truncate font-medium text-zinc-800 dark:text-zinc-200 group-hover/item:text-zinc-950 dark:group-hover/item:text-white">
                        {clientDisplayName}
                        {serviceName && (
                          <span className="text-zinc-400 dark:text-zinc-500 font-normal"> · {serviceName}</span>
                        )}
                      </span>
                    </div>
                  );
                })}

                {/* More appointments indicator */}
                {hiddenCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDayClick?.(cell.date);
                    }}
                    className="text-left text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 px-1 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors mt-auto shrink-0 cursor-pointer"
                  >
                    +{hiddenCount} más
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
