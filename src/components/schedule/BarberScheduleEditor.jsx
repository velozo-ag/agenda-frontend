import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useSchedules } from '../../hooks/useSchedules';

const DAYS = [
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' },
  { id: 6, name: 'Sábado' },
  { id: 7, name: 'Domingo' }
];

export default function BarberScheduleEditor({ isOpen, onClose, barber }) {
  const { schedule, isLoading, setSchedule } = useSchedules(barber?.id);
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    if (schedule?.length > 0) {
      // Map API response to our form state
      const mapped = DAYS.map(d => {
        const existing = schedule.find(s => s.dayOfWeek === d.id);
        return {
          dayOfWeek: d.id,
          name: d.name,
          isActive: existing?.isActive || false,
          startTime: existing?.startTime || '09:00',
          endTime: existing?.endTime || '18:00'
        };
      });
      setFormData(mapped);
    } else {
      setFormData(DAYS.map(d => ({
        dayOfWeek: d.id,
        name: d.name,
        isActive: false,
        startTime: '09:00',
        endTime: '18:00'
      })));
    }
  }, [schedule, isOpen]);

  if (!isOpen || !barber) return null;

  const handleChange = (dayId, field, value) => {
    setFormData(prev => prev.map(d => 
      d.dayOfWeek === dayId ? { ...d, [field]: value } : d
    ));
  };

  const handleSave = () => {
    const payload = {
      schedules: formData.map(d => ({
        dayOfWeek: d.dayOfWeek,
        isActive: d.isActive,
        startTime: d.startTime,
        endTime: d.endTime
      }))
    };
    
    setSchedule.mutate(payload, {
      onSuccess: () => onClose()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-white">Horario Semanal</h2>
            <p className="text-sm text-zinc-400 mt-1">{barber.fullName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="text-center text-zinc-500 py-8">Cargando horario...</div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <div className="col-span-4">Día</div>
                <div className="col-span-8 grid grid-cols-2 gap-4">
                  <div>Hora Inicio</div>
                  <div>Hora Fin</div>
                </div>
              </div>
              
              {formData.map((day) => (
                <div key={day.dayOfWeek} className={`grid grid-cols-12 gap-4 items-center p-4 rounded-xl border transition-colors ${day.isActive ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-950 border-zinc-800 opacity-60'}`}>
                  <div className="col-span-4 flex items-center gap-3">
                    <button
                      onClick={() => handleChange(day.dayOfWeek, 'isActive', !day.isActive)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors ${day.isActive ? 'bg-violet-600' : 'bg-zinc-700'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${day.isActive ? 'translate-x-2' : '-translate-x-2'}`} />
                    </button>
                    <span className={`font-medium text-sm ${day.isActive ? 'text-white' : 'text-zinc-500'}`}>
                      {day.name}
                    </span>
                  </div>
                  
                  <div className="col-span-8 grid grid-cols-2 gap-4">
                    <input
                      type="time"
                      disabled={!day.isActive}
                      value={day.startTime}
                      onChange={(e) => handleChange(day.dayOfWeek, 'startTime', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 text-sm"
                    />
                    <input
                      type="time"
                      disabled={!day.isActive}
                      value={day.endTime}
                      onChange={(e) => handleChange(day.dayOfWeek, 'endTime', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800 flex items-center justify-end gap-3 flex-shrink-0 bg-zinc-900/90 backdrop-blur">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={setSchedule.isPending}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {setSchedule.isPending ? 'Guardando...' : 'Guardar Horario'}
          </button>
        </div>
      </div>
    </div>
  );
}
