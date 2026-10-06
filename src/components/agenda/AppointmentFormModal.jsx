import React, { useState } from 'react';
import { X, Calendar, User, Scissors, Clock, Banknote, CheckCircle2 } from 'lucide-react';
import { ClientSearchInput } from '../clients/ClientSearchInput';
import { useSalonServices } from '../../hooks/useSalonServices';
import { useBarbers } from '../../hooks/useBarbers';
import { SlotPicker } from './SlotPicker';
import { useCreateAppointment } from '../../hooks/useAppointments';
import { useTenantUsage } from '../../hooks/useTenantUsage';
import { getLocalISODate } from '../../utils/dateUtils';


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
  const { data: usage } = useTenantUsage();

  const isLimitReached = usage?.limitReached;

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

  const filledCount = [selectedClient, serviceId, date, selectedSlot].filter(Boolean).length;
  const progressPercent = Math.round((filledCount / 4) * 100);

  const inputCls =
    'w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all shadow-xs appearance-none';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0a0a0c] border border-zinc-200 dark:border-zinc-800/80 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800/60 shrink-0">
          <div>
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">Nuevo Turno</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Completá los datos para agendar</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Progress Bar (zero text/checkpoint clutter) */}
        <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden shrink-0">
          <div
            className="h-full bg-amber-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* 1. Cliente */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Cliente</label>
            </div>
            <ClientSearchInput value={selectedClient} onChange={setSelectedClient} />
          </div>

          {/* 2. Servicio */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Servicio</label>
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
                <User className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Barbero</label>
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
              <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Fecha</label>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => { setDate(e.target.value); setSelectedSlot(''); }}
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>

          {/* 5. Horario */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Horario Disponible</label>
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
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">Notas internas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 min-h-[72px] resize-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder-zinc-400 dark:placeholder-zinc-500 shadow-xs"
              placeholder="Ej: cliente frecuente, prefiere nuca corta..."
            />
          </div>

          {/* Estado del turno */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">Estado del Turno</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('CONFIRMED')}
                className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  status === 'CONFIRMED'
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
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
                    ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/50 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>A Confirmar (Pendiente)</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5">
              {status === 'CONFIRMED'
                ? 'El cliente recibirá el correo de turno confirmado directamente.'
                : 'Se notificará al cliente la propuesta y el turno quedará pendiente de confirmación.'}
            </p>
          </div>

          {/* Deposit warning */}
          {selectedServiceObj && selectedServiceObj.depositAmount > 0 && (
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 rounded-xl p-3">
              <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-800 dark:text-amber-400">Requiere seña previa</div>
                <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                  El cliente deberá abonar ${selectedServiceObj.depositAmount} para confirmar la reserva.
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/40 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-bold rounded-xl transition-colors cursor-pointer text-sm border border-zinc-200 dark:border-zinc-800 shadow-xs"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!selectedClient || !serviceId || !selectedSlot || isPending || isLimitReached}
            className={`flex-1 h-12 font-black rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm shadow-md active:scale-[0.98] ${
              isLimitReached 
                ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30 shadow-none' 
                : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
            }`}
          >
            {isPending ? 'Creando...' : isLimitReached ? 'Límite Mensual Alcanzado' : 'Crear Turno'}
          </button>
        </div>
      </div>
    </div>
  );
}
