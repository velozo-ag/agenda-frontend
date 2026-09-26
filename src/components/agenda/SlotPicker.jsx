import React from 'react';
import { useAvailableSlots } from '../../hooks/useAppointments';
import { Loader2 } from 'lucide-react';

export function SlotPicker({ serviceId, barberId, date, value, onChange }) {
  const params = {
    serviceId,
    barberId: barberId || undefined,
    date: date ? date.toISOString().split('T')[0] : null
  };

  const { data: response, isLoading } = useAvailableSlots(params);

  if (!serviceId || !date) {
    return <div className="text-zinc-500 text-sm italic">Selecciona un servicio y una fecha para ver horarios.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 text-amber-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const slots = response?.data || []; // Assuming backend returns List<String> ISO datetimes

  if (slots.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center text-sm text-zinc-400">
        No hay turnos disponibles para este día.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
      {slots.map(slotIso => {
        const d = new Date(slotIso);
        const timeString = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isSelected = value === slotIso;

        return (
          <button
            key={slotIso}
            type="button"
            onClick={() => onChange(slotIso)}
            className={`py-2 px-1 rounded-lg text-sm font-mono transition-colors ${
              isSelected 
                ? 'bg-amber-500 text-zinc-950 font-bold' 
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800'
            }`}
          >
            {timeString}
          </button>
        );
      })}
    </div>
  );
}
