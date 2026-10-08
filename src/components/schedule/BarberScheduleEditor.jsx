import React, { useState, useEffect } from 'react';
import { X, Save, CheckCheck, Clock, CalendarDays } from 'lucide-react';
import { useSchedules } from '../../hooks/useSchedules';

const DAYS = [
  { id: 1, name: 'Lunes', short: 'Lun' },
  { id: 2, name: 'Martes', short: 'Mar' },
  { id: 3, name: 'Miércoles', short: 'Mié' },
  { id: 4, name: 'Jueves', short: 'Jue' },
  { id: 5, name: 'Viernes', short: 'Vie' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
  { id: 7, name: 'Domingo', short: 'Dom' }
];

export default function BarberScheduleEditor({ isOpen, onClose, barber }) {
  const { schedule, isLoading, setSchedule } = useSchedules(barber?.id);
  const [formData, setFormData] = useState([]);

  // Estado para la aplicación rápida en bloque
  const [bulkDays, setBulkDays] = useState([1, 2, 3, 4, 5]); // Lun-Vie por defecto
  const [bulkStart, setBulkStart] = useState('09:00');
  const [bulkEnd, setBulkEnd] = useState('13:00');
  const [bulkStart2, setBulkStart2] = useState('15:00');
  const [bulkEnd2, setBulkEnd2] = useState('19:00');
  const [useBulkSplit, setUseBulkSplit] = useState(false);

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
          endTime: existing?.endTime || '18:00',
          startTime2: existing?.startTime2 || '',
          endTime2: existing?.endTime2 || ''
        };
      });
      setFormData(mapped);
    } else {
      setFormData(DAYS.map(d => ({
        dayOfWeek: d.id,
        name: d.name,
        isActive: false,
        startTime: '09:00',
        endTime: '18:00',
        startTime2: '',
        endTime2: ''
      })));
    }
  }, [schedule, isOpen]);

  if (!isOpen || !barber) return null;

  const handleChange = (dayId, field, value) => {
    setFormData(prev => prev.map(d => 
      d.dayOfWeek === dayId ? { ...d, [field]: value } : d
    ));
  };

  const toggleBulkDay = (dayId) => {
    setBulkDays(prev => 
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
  };

  const selectWorkdays = () => setBulkDays([1, 2, 3, 4, 5]);
  const selectAllDays = () => setBulkDays([1, 2, 3, 4, 5, 6, 7]);
  const clearBulkDays = () => setBulkDays([]);

  const handleApplyBulk = () => {
    if (bulkDays.length === 0) return;
    setFormData(prev => prev.map(d => {
      if (bulkDays.includes(d.dayOfWeek)) {
        return {
          ...d,
          isActive: true,
          startTime: bulkStart,
          endTime: bulkEnd,
          startTime2: useBulkSplit ? bulkStart2 : '',
          endTime2: useBulkSplit ? bulkEnd2 : ''
        };
      }
      return d;
    }));
  };

  const handleSave = () => {
    const payload = {
      schedules: formData.map(d => ({
        dayOfWeek: d.dayOfWeek,
        isActive: d.isActive,
        startTime: d.startTime,
        endTime: d.endTime,
        startTime2: d.startTime2 || null,
        endTime2: d.endTime2 || null
      }))
    };
    
    setSchedule.mutate(payload, {
      onSuccess: () => onClose()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Horario Semanal</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{barber.fullName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-5">
          {/* Quick Bulk Schedule Configuration Toolbar */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                <CalendarDays className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                <span>Aplicar mismo horario a varios días</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={selectWorkdays}
                  className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  Lun-Vie
                </button>
                <button
                  type="button"
                  onClick={selectAllDays}
                  className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={clearBulkDays}
                  className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  Limpiar
                </button>
              </div>
            </div>

            {/* Day Selector Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {DAYS.map(d => {
                const isSelected = bulkDays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleBulkDay(d.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {d.short}
                  </button>
                );
              })}
            </div>

            {/* Time Pickers and Apply Button */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">De:</span>
                  <input
                    type="time"
                    value={bulkStart}
                    onChange={(e) => setBulkStart(e.target.value)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-900 dark:text-white focus:ring-1 focus:ring-violet-500 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">A:</span>
                  <input
                    type="time"
                    value={bulkEnd}
                    onChange={(e) => setBulkEnd(e.target.value)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-900 dark:text-white focus:ring-1 focus:ring-violet-500 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <label className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={useBulkSplit}
                      onChange={(e) => setUseBulkSplit(e.target.checked)}
                      className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                    />
                    Turno partido
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleApplyBulk}
                  disabled={bulkDays.length === 0}
                  className="ml-auto px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Aplicar a {bulkDays.length} días</span>
                </button>
              </div>
              
              {useBulkSplit && (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">De:</span>
                    <input
                      type="time"
                      value={bulkStart2}
                      onChange={(e) => setBulkStart2(e.target.value)}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-900 dark:text-white focus:ring-1 focus:ring-violet-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">A:</span>
                    <input
                      type="time"
                      value={bulkEnd2}
                      onChange={(e) => setBulkEnd2(e.target.value)}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-900 dark:text-white focus:ring-1 focus:ring-violet-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

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
                <div key={day.dayOfWeek} className={`grid grid-cols-12 gap-4 items-center p-4 rounded-xl border transition-colors ${day.isActive ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700' : 'bg-zinc-100/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-60'}`}>
                  <div className="col-span-4 flex items-center gap-3">
                    <button
                      onClick={() => handleChange(day.dayOfWeek, 'isActive', !day.isActive)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors ${day.isActive ? 'bg-violet-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${day.isActive ? 'translate-x-2' : '-translate-x-2'}`} />
                    </button>
                    <span className={`font-medium text-sm ${day.isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      {day.name}
                    </span>
                  </div>
                  
                  <div className="col-span-8 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="time"
                        disabled={!day.isActive}
                        value={day.startTime}
                        onChange={(e) => handleChange(day.dayOfWeek, 'startTime', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 text-sm"
                      />
                      <input
                        type="time"
                        disabled={!day.isActive}
                        value={day.endTime}
                        onChange={(e) => handleChange(day.dayOfWeek, 'endTime', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 text-sm"
                      />
                    </div>
                    {/* Shift 2 */}
                    {day.startTime2 || day.endTime2 ? (
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <input
                          type="time"
                          disabled={!day.isActive}
                          value={day.startTime2}
                          onChange={(e) => handleChange(day.dayOfWeek, 'startTime2', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 text-sm"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            disabled={!day.isActive}
                            value={day.endTime2}
                            onChange={(e) => handleChange(day.dayOfWeek, 'endTime2', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 text-sm"
                          />
                          <button 
                            onClick={() => { handleChange(day.dayOfWeek, 'startTime2', ''); handleChange(day.dayOfWeek, 'endTime2', ''); }}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                            title="Quitar turno"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start">
                        <button
                          type="button"
                          disabled={!day.isActive}
                          onClick={() => { handleChange(day.dayOfWeek, 'startTime2', '15:00'); handleChange(day.dayOfWeek, 'endTime2', '19:00'); }}
                          className="text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          + Agregar turno partido
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3 flex-shrink-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={setSchedule.isPending}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            {setSchedule.isPending ? 'Guardando...' : 'Guardar Horario'}
          </button>
        </div>
      </div>
    </div>
  );
}
