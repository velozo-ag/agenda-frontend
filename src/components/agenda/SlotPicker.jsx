import React from 'react';
import { useAvailableSlots } from '../../hooks/useAppointments';
import { Loader2, Clock } from 'lucide-react';

export function SlotPicker({ serviceId, barberId, date, value, onChange }) {
  const dateStr = date
    ? (date instanceof Date ? date.toISOString().split('T')[0] : String(date).split('T')[0])
    : null;

  const params = {
    serviceId,
    barberId: barberId || undefined,
    date: dateStr,
  };

  const { data: response, isLoading } = useAvailableSlots(params);

  if (!serviceId || !date) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-zinc-500 gap-2 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 border-dashed">
        <Clock className="w-6 h-6 opacity-40" />
        <span className="text-xs font-medium">Seleccioná un servicio y una fecha</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="text-xs text-zinc-500 font-medium">Consultando disponibilidad...</span>
      </div>
    );
  }

  const slots = response?.data || [];

  if (slots.length === 0) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 border-dashed rounded-2xl p-6 text-center">
        <Clock className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
        <div className="text-sm font-semibold text-zinc-400">Sin turnos disponibles</div>
        <div className="text-xs text-zinc-600 mt-1">No hay horarios libres para este día</div>
      </div>
    );
  }

  // Group by morning / afternoon
  const morning = slots.filter(s => new Date(s).getHours() < 13);
  const afternoon = slots.filter(s => new Date(s).getHours() >= 13);

  const SlotGroup = ({ label, items }) => (
    <div className="space-y-2">
      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">{label}</div>
      <div className="grid grid-cols-3 gap-2.5">
        {items.map(slotIso => {
          const d = new Date(slotIso);
          const timeString = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
          const isSelected = value === slotIso;

          return (
            <button
              key={slotIso}
              type="button"
              onClick={() => onChange(slotIso)}
              className={`py-3 rounded-xl text-sm font-mono font-bold border transition-all cursor-pointer active:scale-[0.97] ${
                isSelected
                  ? 'bg-amber-500 border-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            >
              {timeString}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {morning.length > 0 && <SlotGroup label="☀️ Mañana" items={morning} />}
      {afternoon.length > 0 && <SlotGroup label="🌙 Tarde / Noche" items={afternoon} />}
    </div>
  );
}
