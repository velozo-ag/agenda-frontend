import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { ClientSearchInput } from '../clients/ClientSearchInput';
import { useSalonServices } from '../../hooks/useSalonServices';
import { useBarbers } from '../../hooks/useBarbers';
import { SlotPicker } from './SlotPicker';
import { useCreateAppointment } from '../../hooks/useAppointments';

export function AppointmentFormModal({ onClose, defaultDate, defaultBarberId }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [serviceId, setServiceId] = useState('');
  const [barberId, setBarberId] = useState(defaultBarberId || '');
  const [date, setDate] = useState(defaultDate ? new Date(defaultDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');

  const { services } = useSalonServices();
  const { barbers } = useBarbers();
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const selectedServiceObj = services.find(s => s.id === Number(serviceId));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClient || !serviceId || !selectedSlot) return;

    createAppointment(
      {
        serviceId: Number(serviceId),
        barberId: barberId ? Number(barberId) : null,
        startTime: selectedSlot,
        clientName: selectedClient.fullName,
        clientEmail: selectedClient.email,
        clientPhone: selectedClient.phone,
        notes
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">Nuevo Turno</h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Cliente</label>
            <ClientSearchInput value={selectedClient} onChange={setSelectedClient} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Servicio</label>
            <select
              required
              value={serviceId}
              onChange={(e) => { setServiceId(e.target.value); setSelectedSlot(''); }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500/50 appearance-none"
            >
              <option value="">Selecciona un servicio</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} - ${s.price} ({s.durationMinutes} min)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Barbero (Opcional)</label>
            <select
              value={barberId}
              onChange={(e) => { setBarberId(e.target.value); setSelectedSlot(''); }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500/50 appearance-none"
            >
              <option value="">Cualquier disponible</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id}>{b.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => { setDate(e.target.value); setSelectedSlot(''); }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 h-11 text-zinc-100 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Horario</label>
            <SlotPicker
              serviceId={serviceId}
              barberId={barberId}
              date={date ? new Date(date) : null}
              value={selectedSlot}
              onChange={setSelectedSlot}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Notas internas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 min-h-[80px] resize-none focus:outline-none focus:border-amber-500/50"
              placeholder="Ej: Cliente frecuente..."
            />
          </div>

          {selectedServiceObj && selectedServiceObj.depositAmount > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <div className="text-sm text-amber-500 font-medium">Este servicio requiere seña</div>
              <div className="text-xs text-amber-500/80 mt-1">
                El cliente deberá abonar ${selectedServiceObj.depositAmount} para confirmar el turno.
              </div>
            </div>
          )}
        </form>

        <div className="p-4 border-t border-zinc-800 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium rounded-lg transition-colors">
            Cancelar
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            disabled={!selectedClient || !serviceId || !selectedSlot || isPending}
            className="flex-1 h-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creando...' : 'Crear Turno'}
          </button>
        </div>
      </div>
    </div>
  );
}
