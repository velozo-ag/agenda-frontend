import React, { useState } from 'react';
import { useBarbers } from '../hooks/useBarbers';
import { Clock, CalendarOff } from 'lucide-react';
import BarberScheduleEditor from '../components/schedule/BarberScheduleEditor';
import TimeOffModal from '../components/schedule/TimeOffModal';

export default function SchedulesAdminPage() {
  const { barbers, isLoading } = useBarbers();
  
  const [selectedBarberForSchedule, setSelectedBarberForSchedule] = useState(null);
  const [selectedBarberForTimeOff, setSelectedBarberForTimeOff] = useState(null);

  if (isLoading) return <div className="p-8 text-center text-zinc-500">Cargando profesionales...</div>;

  const activeBarbers = barbers.filter(b => b.active);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">Disponibilidad y Horarios</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">Configura el horario semanal y ausencias de tu equipo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeBarbers.map((barber) => (
          <div key={barber.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 transition-all shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-inner"
                style={{ backgroundColor: barber.color || '#3b82f6' }}
              >
                {barber.avatarUrl ? (
                  <img src={barber.avatarUrl} alt={barber.fullName} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  barber.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{barber.fullName}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Horarios y ausencias</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setSelectedBarberForSchedule(barber)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  <div className="p-2 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg group-hover:bg-violet-500/20 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">Editar Horario Semanal</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedBarberForTimeOff(barber)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  <div className="p-2 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg group-hover:bg-amber-500/20 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    <CalendarOff className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">Gestionar Ausencias</span>
                </div>
              </button>
            </div>
          </div>
        ))}

        {activeBarbers.length === 0 && (
          <div className="col-span-full text-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">No hay profesionales activos</h3>
            <p className="text-zinc-500 dark:text-zinc-400">Ve a la sección de Staff para dar de alta a tu equipo.</p>
          </div>
        )}
      </div>

      <BarberScheduleEditor 
        isOpen={!!selectedBarberForSchedule} 
        onClose={() => setSelectedBarberForSchedule(null)}
        barber={selectedBarberForSchedule}
      />

      <TimeOffModal 
        isOpen={!!selectedBarberForTimeOff} 
        onClose={() => setSelectedBarberForTimeOff(null)}
        barber={selectedBarberForTimeOff}
      />
    </div>
  );
}
