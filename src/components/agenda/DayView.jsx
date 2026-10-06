import React, { useState, useEffect, useMemo } from 'react';
import { AppointmentCard } from './AppointmentCard';

const SLOT_REM = 4; // rem per hour

export function DayView({ appointments, onSlotClick, onAppointmentClick, selectedDate, barbers = [], selectedBarberId }) {
  const hours = Array.from({ length: 14 }).map((_, i) => i + 8); // 8 AM to 9 PM

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isToday =
    selectedDate.getDate() === now.getDate() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear();

  // Filter appointments for the selected day and barber
  const dailyAppointments = useMemo(() => {
    const filtered = appointments.filter(a => {
      const apptDate = new Date(a.startTime);
      const isSameDay = apptDate.getDate() === selectedDate.getDate() &&
                        apptDate.getMonth() === selectedDate.getMonth() &&
                        apptDate.getFullYear() === selectedDate.getFullYear();
      if (!isSameDay) return false;
      
      if (selectedBarberId && selectedBarberId !== 'all') {
        const aBarberId = a.barber?.id || a.barberId;
        if (aBarberId !== Number(selectedBarberId)) return false;
      }
      return true;
    });

    // Sort by start time, then by end time
    return filtered.sort((a, b) => {
      const startDiff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      if (startDiff !== 0) return startDiff;
      return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
    });
  }, [appointments, selectedDate, selectedBarberId]);

  // Cluster and position appointments side-by-side
  const positionedAppointments = useMemo(() => {
    if (dailyAppointments.length === 0) return [];

    const clusters = [];
    let currentCluster = [];
    let currentClusterEnd = 0;

    // Group into independent overlapping clusters
    dailyAppointments.forEach(appt => {
      const start = new Date(appt.startTime).getTime();
      const end = new Date(appt.endTime).getTime();

      if (currentCluster.length === 0) {
        currentCluster.push(appt);
        currentClusterEnd = end;
      } else {
        if (start < currentClusterEnd) {
          // Overlaps with the current cluster
          currentCluster.push(appt);
          currentClusterEnd = Math.max(currentClusterEnd, end);
        } else {
          // New cluster
          clusters.push(currentCluster);
          currentCluster = [appt];
          currentClusterEnd = end;
        }
      }
    });
    if (currentCluster.length > 0) {
      clusters.push(currentCluster);
    }

    const positioned = [];

    // Process each cluster to assign columns
    clusters.forEach(cluster => {
      const columns = []; // Array of end times for each column

      cluster.forEach(appt => {
        const start = new Date(appt.startTime).getTime();
        const end = new Date(appt.endTime).getTime();
        
        let placed = false;
        for (let i = 0; i < columns.length; i++) {
          if (start >= columns[i]) {
            // Can fit in this column
            positioned.push({ appt, colIndex: i, numCols: 0 }); // numCols set later
            columns[i] = end;
            placed = true;
            break;
          }
        }

        if (!placed) {
          // Add a new column
          positioned.push({ appt, colIndex: columns.length, numCols: 0 });
          columns.push(end);
        }
      });

      // Update numCols for all appointments in this cluster so they divide width evenly
      const numCols = columns.length;
      positioned.slice(-cluster.length).forEach(p => {
        p.numCols = numCols;
      });
    });

    return positioned;
  }, [dailyAppointments]);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950 flex flex-col relative w-full overflow-x-hidden">
      
      <div className="flex flex-1 relative w-full">
        {/* Time axis */}
        <div className="w-14 shrink-0 relative z-30 bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-800/50">
          {hours.map(h => (
            <div
              key={h}
              className="flex items-start justify-end pr-3 pt-1 border-b border-zinc-200/40 dark:border-zinc-800/40"
              style={{ height: `${SLOT_REM}rem`, minHeight: `${SLOT_REM}rem` }}
            >
              <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono tabular-nums">{h}:00</span>
            </div>
          ))}
        </div>

        {/* Timeline Content */}
        <div className="flex-1 relative min-w-0">
          
          {/* Current Time Indicator */}
          {isToday && now.getHours() >= 8 && now.getHours() < 22 && (
            <div
              className="absolute left-0 right-0 z-40 pointer-events-none"
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

          {/* Hour Grid Lines */}
          {hours.map(h => (
            <div
              key={h}
              onClick={() => {
                const slotTime = new Date(selectedDate);
                slotTime.setHours(h, 0, 0, 0);
                onSlotClick(slotTime);
              }}
              className="border-b border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/30 cursor-pointer transition-colors group relative w-full"
              style={{ height: `${SLOT_REM}rem`, minHeight: `${SLOT_REM}rem` }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-200/50 dark:bg-zinc-800/30 top-1/2" />
            </div>
          ))}

          {/* Render Appointments */}
          {positionedAppointments.map(({ appt, colIndex, numCols }) => {
            const start = new Date(appt.startTime);
            const end = new Date(appt.endTime);

            const topRem = ((start.getHours() - 8) + start.getMinutes() / 60) * SLOT_REM;
            const heightRem = Math.max(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * SLOT_REM, 1);

            // Cascading offset logic (like stacked cards)
            // numCols represents the max overlapping cards in this cluster.
            // If numCols is 1, stepPct is 90, but leftPct is 0, so width is 100%.
            const stepPct = numCols > 1 ? 90 / numCols : 0;
            const leftPct = colIndex * stepPct;

            const leftOffset = `calc(${leftPct}% + 2px)`;
            const widthOffset = `calc(${100 - leftPct}% - 4px)`;
            const zIndex = 10 + colIndex;

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
                <AppointmentCard 
                  appointment={appt} 
                  barberColor={barbers.find(b => b.id === (appt.barber?.id || appt.barberId))?.color} 
                  onClick={onAppointmentClick} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
