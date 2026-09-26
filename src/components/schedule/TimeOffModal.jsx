import React, { useState, useEffect } from 'react';
import { X, CalendarOff, Trash2 } from 'lucide-react';
import { useTimeOffs } from '../../hooks/useSchedules';

export default function TimeOffModal({ isOpen, onClose, barber }) {
  // Para simplificar, cargamos desde hace 1 mes hasta 1 año adelante
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 1);
  const toDate = new Date();
  toDate.setFullYear(toDate.getFullYear() + 1);

  const { timeOffs, isLoading, createTimeOff, deleteTimeOff } = useTimeOffs(
    barber?.id, 
    fromDate.toISOString(), 
    toDate.toISOString()
  );

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('23:59');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
      setStartTime('00:00');
      setEndTime('23:59');
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen || !barber) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      startDatetime: `${startDate}T${startTime}:00`,
      endDatetime: `${endDate}T${endTime}:00`,
      reason
    };
    
    createTimeOff.mutate(data, {
      onSuccess: () => {
        // Reset form but keep modal open to see the new entry
        const today = new Date();
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        setStartTime('00:00');
        setEndTime('23:59');
        setReason('');
      }
    });
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CalendarOff className="w-5 h-5 text-amber-500" />
              Gestión de Ausencias
            </h2>
            <p className="text-sm text-zinc-400 mt-1">{barber.fullName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* List of TimeOffs */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-300">Ausencias Registradas</h3>
            {isLoading ? (
              <p className="text-sm text-zinc-500">Cargando...</p>
            ) : timeOffs.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-zinc-800 text-center text-sm text-zinc-500">
                No hay ausencias programadas.
              </div>
            ) : (
              <div className="space-y-2">
                {timeOffs.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 group">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {formatDate(t.startDatetime)} - {formatDate(t.endDatetime)}
                      </p>
                      {t.reason && <p className="text-xs text-zinc-500 mt-0.5">{t.reason}</p>}
                    </div>
                    <button
                      onClick={() => {
                        if(window.confirm('¿Eliminar esta ausencia?')) {
                          deleteTimeOff.mutate(t.id);
                        }
                      }}
                      className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full h-px bg-zinc-800/50" />

          {/* New TimeOff Form */}
          <form id="timeoff-form" onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-300">Registrar Nueva Ausencia</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Fecha y Hora Inicio</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-24 shrink-0 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Fecha y Hora Fin</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-24 shrink-0 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Motivo (Opcional)</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej. Vacaciones, Médico..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-zinc-800 flex items-center justify-end gap-3 flex-shrink-0 bg-zinc-900/90 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cerrar
          </button>
          <button
            type="submit"
            form="timeoff-form"
            disabled={createTimeOff.isPending}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-amber-500 hover:bg-amber-600 text-black transition-colors disabled:opacity-50"
          >
            {createTimeOff.isPending ? 'Guardando...' : 'Registrar Ausencia'}
          </button>
        </div>
      </div>
    </div>
  );
}
