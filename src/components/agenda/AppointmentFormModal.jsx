import React, { useState } from 'react';
import { X, Calendar, User, Scissors, Clock, Banknote, CheckCircle2 } from 'lucide-react';
import { ClientSearchInput } from '../clients/ClientSearchInput';
import { useSalonServices } from '../../hooks/useSalonServices';
import { useBarbers } from '../../hooks/useBarbers';
import { SlotPicker } from './SlotPicker';
import { useCreateAppointment } from '../../hooks/useAppointments';
import { getLocalISODate } from '../../utils/dateUtils';

// Step indicator component
function StepBadge({ number, label, active, done }) {
  return (
    <div className={`flex items-center gap-2 ${active ? '' : 'opacity-60'}`}>
      <span
        className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 border transition-all ${
          done
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : active
            ? 'bg-indigo-500 border-indigo-500 text-white'
            : 'bg-zinc-800 border-zinc-700 text-zinc-500'
        }`}
      >
        {done ? '✓' : number}
      </span>
      <span className={`text-xs font-semibold ${active ? 'text-zinc-200' : 'text-zinc-500'}`}>{label}</span>
    </div>
  );
}

export function AppointmentFormModal({
  onClose,
  defaultDate,
  defaultBarberId,
  defaultClient = null,
  defaultServiceId = '',
  defaultStatus = 'CONFIRMED',
  onSuccess = null,
}) {
  const [selectedClient, setSelectedClient] = useState(defaultClient);
  const [serviceId, setServiceId] = useState(defaultServiceId ? String(defaultServiceId) : '');
  const [barberId, setBarberId] = useState(defaultBarberId ? String(defaultBarberId) : '');
  const [date, setDate] = useState(() => {
    if (!defaultDate) return getLocalISODate();
    if (typeof defaultDate === 'string') {
      return defaultDate.includes('T') ? defaultDate.split('T')[0] : defaultDate;
    }
    return getLocalISODate(defaultDate);
  });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [status, setStatus] = useState(defaultStatus);
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
        clientId: selectedClient.id || null,
        serviceId: Number(serviceId),
        barberId: barberId ? Number(barberId) : null,
        startTime: selectedSlot,
        clientName: selectedClient.fullName || selectedClient.name || '',
        clientEmail: selectedClient.email || '',
        clientPhone: selectedClient.phone || '',
        status,
        notes,
      },
      {
        onSuccess: (data) => {
          if (onSuccess) onSuccess(data);
          onClose();
        },
      }
    );
  };

  // Determine step completeness for visual indicator
  const s1Done = !!selectedClient;
  const s2Done = !!serviceId;
  const s3Done = !!barberId;
  const s4Done = !!date;
  const s5Done = !!selectedSlot;

  const inputCls =
    'w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all appearance-none';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0a0a0c] border border-zinc-800/80 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 shrink-0">
          <div>
            <h2 className="text-base font-black text-zinc-100">Nuevo Turno</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Completá los datos para agendar</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-200 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800/40 overflow-x-auto no-scrollbar shrink-0">
          <StepBadge number="1" label="Cliente" active={!s1Done} done={s1Done} />
          <div className="flex-1 h-px bg-zinc-800/60 min-w-[12px]" />
          <StepBadge number="2" label="Servicio" active={s1Done && !s2Done} done={s2Done} />
          <div className="flex-1 h-px bg-zinc-800/60 min-w-[12px]" />
          <StepBadge number="3" label="Barbero" active={s2Done && !s3Done} done={s3Done} />
          <div className="flex-1 h-px bg-zinc-800/60 min-w-[12px]" />
          <StepBadge number="4" label="Fecha" active={s3Done && !s4Done} done={s4Done} />
          <div className="flex-1 h-px bg-zinc-800/60 min-w-[12px]" />
          <StepBadge number="5" label="Horario" active={s4Done && !s5Done} done={s5Done} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* 1. Cliente */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Cliente</label>
            </div>
            <ClientSearchInput value={selectedClient} onChange={setSelectedClient} />
          </div>

          {/* 2. Servicio */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="w-3.5 h-3.5 text-indigo-400" />
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Servicio</label>
            </div>
            <select
              required
              value={serviceId}
              onChange={(e) => { setServiceId(e.target.value); setSelectedSlot(''); }}
              className={inputCls}
            >
              <option value="">Seleccioná un servicio</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — ${s.price} ({s.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>

          {/* 3. Barbero */}
          {barbers.length > 1 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Barbero</label>
              </div>
              <select
                value={barberId}
                onChange={(e) => { setBarberId(e.target.value); setSelectedSlot(''); }}
                className={inputCls}
              >
                <option value="">Cualquiera disponible</option>
                {barbers.map(b => (
                  <option key={b.id} value={b.id}>{b.fullName}</option>
                ))}
              </select>
            </div>
          )}

          {/* 4. Fecha */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Fecha</label>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => { setDate(e.target.value); setSelectedSlot(''); }}
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          {/* 5. Horario */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Horario Disponible</label>
            </div>
            <SlotPicker
              serviceId={serviceId}
              barberId={barberId}
              date={date ? new Date(date) : null}
              value={selectedSlot}
              onChange={setSelectedSlot}
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Notas internas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 min-h-[72px] resize-none focus:outline-none focus:border-indigo-500/60 transition-all placeholder-zinc-600"
              placeholder="Ej: cliente frecuente, prefiere nuca corta..."
            />
          </div>

          {/* Estado del turno */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Estado del Turno</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('CONFIRMED')}
                className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  status === 'CONFIRMED'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmado</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('PENDING_REVIEW')}
                className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  status === 'PENDING_REVIEW'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>A Confirmar (Pendiente)</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              {status === 'CONFIRMED'
                ? 'El cliente recibirá el correo de turno confirmado directamente.'
                : 'Se notificará al cliente la propuesta y el turno quedará pendiente de confirmación.'}
            </p>
          </div>

          {/* Deposit warning */}
          {selectedServiceObj && selectedServiceObj.depositAmount > 0 && (
            <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/25 rounded-xl p-3">
              <Banknote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-400">Requiere seña</div>
                <div className="text-[11px] text-amber-400/70 mt-0.5">
                  El cliente deberá abonar ${selectedServiceObj.depositAmount} para confirmar.
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-800/60 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-semibold rounded-xl transition-colors cursor-pointer text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!selectedClient || !serviceId || !selectedSlot || isPending}
            className="flex-1 h-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-sm shadow-md shadow-amber-500/20 active:scale-[0.98]"
          >
            {isPending ? 'Creando...' : 'Crear Turno'}
          </button>
        </div>
      </div>
    </div>
  );
}
