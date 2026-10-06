import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Clock, MapPin, User, Calendar, Phone, CreditCard, AlertTriangle, FileText, CheckCircle2, Scissors, Mail, ScissorsSquare, CalendarClock, Loader2, PlayCircle, XCircle, UserX } from 'lucide-react';
import { useUpdateAppointmentStatus, useAppointment, useConfirmDeposit, useRejectDeposit, useUndoNoShow, useRescheduleAppointment, useCompleteAppointment, useMarkNoShow } from '../../hooks/useAppointments';
import { useMyTenant } from '../../hooks/useTenantBranding';
import { useBarbers } from '../../hooks/useBarbers';
import { useClient } from '../../hooks/useClients';
import { SlotPicker } from './SlotPicker';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  PENDING_REVIEW: { label: 'Pendiente', color: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700', icon: CalendarClock },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700/30', icon: CheckCircle2 },
  IN_PROGRESS: { label: 'En Curso', color: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40', icon: PlayCircle },
  COMPLETED: { label: 'Completado', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 border-emerald-300 dark:border-emerald-800/30', icon: CheckCircle2 },
  NO_SHOW: { label: 'Ausente', color: 'bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-500 border-rose-300 dark:border-rose-900/30', icon: UserX },
  CANCELLED: { label: 'Cancelado', color: 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800', icon: XCircle },
};

export function AppointmentDetailPanel({ appointment: initialAppointment, onClose, inline = false }) {
  const [internalNotes, setInternalNotes] = useState(initialAppointment?.internalNotes || '');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const { data: fetchedData } = useAppointment(initialAppointment?.id);
  const appointment = fetchedData?.data || fetchedData || initialAppointment;
  
  const { mutate: updateStatus } = useUpdateAppointmentStatus();
  const { mutate: completeAppt } = useCompleteAppointment();
  const { mutate: markNoShow } = useMarkNoShow();
  const { mutate: confirmDep } = useConfirmDeposit();
  const { mutate: rejectDep } = useRejectDeposit();
  const { mutate: undoNS } = useUndoNoShow();
  const { data: tenant } = useMyTenant();
  const { barbers } = useBarbers();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const { id, clientName, clientPhone, clientEmail, serviceNameSnapshot: serviceName, priceSnapshot, durationMinSnapshot, startTime, endTime, status, depositAmount, depositProofUrl, depositPaid, notes, barberId, serviceId, clientId } = appointment;

  const { data: clientRes } = useClient(clientId);
  const clientData = clientRes?.data?.client || clientRes?.data;
  const requireDepositOverride = clientData?.requireDepositOverride;

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(() => {
    if (appointment?.startTime) {
      return new Date(new Date(appointment.startTime).getTime() - new Date(appointment.startTime).getTimezoneOffset() * 60000).toISOString().split('T')[0];
    }
    return new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
  });
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState('');
  const { mutate: reschedule, isPending: isReschedulePending } = useRescheduleAppointment();

  const handleConfirmReschedule = () => {
    if (!selectedRescheduleSlot) return;
    reschedule(
      { id, newStartTime: selectedRescheduleSlot },
      {
        onSuccess: () => {
          setIsRescheduling(false);
          handleClose();
        },
      }
    );
  };

  const handleStatusChange = (newStatus) => {
    updateStatus({ id, status: newStatus });
    if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED' || newStatus === 'NO_SHOW') {
      handleClose();
    }
  };

  const assignedBarber = barbers.find(b => b.id === barberId);

  const cleanPhone = clientPhone ? clientPhone.replace(/\D/g, '') : '';
  const phoneE164 = cleanPhone.startsWith('549') 
    ? cleanPhone 
    : (cleanPhone.startsWith('54') ? cleanPhone.replace('54', '549') : '549' + cleanPhone);

  const handleWhatsApp = () => {
    if (!clientPhone) return;
    const tenantName = tenant?.name || 'nuestro salón';
    const dateObj = new Date(startTime);
    const dateStr = dateObj.toLocaleDateString('es-AR');
    const timeStr = dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    
    const msg = `Hola ${clientName}! Te escribimos de ${tenantName}. `;
    window.open(`https://wa.me/${phoneE164}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const conf = statusConfig[status] || statusConfig.PENDING_REVIEW;
  const initials = clientName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

  const isSlideOpen = isVisible && !isClosing;

  const baseClasses = `fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isSlideOpen ? 'translate-x-0' : 'translate-x-full'}`;
  const inlineClasses = inline
    ? `hidden lg:flex lg:relative lg:inset-auto lg:right-auto lg:w-[400px] lg:max-w-none lg:shrink-0 lg:bg-zinc-50 lg:dark:bg-zinc-900 lg:border lg:border-zinc-200 lg:dark:border-zinc-800 lg:rounded-xl lg:shadow-sm lg:z-auto transition-opacity duration-200 ${isSlideOpen ? 'opacity-100' : 'opacity-0'}`
    : "";
  const wrapperClasses = inline ? inlineClasses : baseClasses;

  return (
    <>
      {!inline && (
        <div 
          onClick={handleClose}
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSlideOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        />
      )}

      <div className={wrapperClasses}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/50 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundColor: assignedBarber?.color || '#a1a1aa' }} />
          <div className="absolute top-0 left-0 bottom-0 w-1 z-0" style={{ backgroundColor: assignedBarber?.color || '#a1a1aa' }} />
          
          <div className="flex items-center gap-3 relative z-10">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Detalle del Turno</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${conf.color}`}>
              {conf.icon && <conf.icon className="w-3 h-3" />}
              {conf.label}
            </span>
          </div>
          <button onClick={handleClose} className="p-2 -mr-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors relative z-10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 relative z-10">
          
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-black text-lg">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-none">{clientName}</div>
                  {requireDepositOverride && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 border border-amber-500/30 text-amber-400">
                      <AlertTriangle className="w-3 h-3" /> Seña Obligatoria
                    </span>
                  )}
                </div>
                <div className="text-zinc-500 dark:text-zinc-400 text-sm font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {clientPhone || 'Sin teléfono'}
                </div>
                {clientEmail && (
                  <div className="text-zinc-500 text-xs flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {clientEmail}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 flex-col">
              {clientPhone && (
                <button 
                  onClick={handleWhatsApp} 
                  className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/20 flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="w-full">
                <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1 flex justify-between">
                  <span>Fecha y Hora</span>
                  {durationMinSnapshot && <span className="text-zinc-500 dark:text-zinc-400">{durationMinSnapshot} min</span>}
                </div>
                <div className="font-bold text-zinc-900 dark:text-zinc-200 capitalize">
                  {new Date(startTime).toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'short' })}
                </div>
                <div className="text-amber-600 dark:text-amber-500 font-mono font-semibold mt-0.5">
                  {new Date(startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} - {new Date(endTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  <ScissorsSquare className="w-4 h-4" /> Servicio
                </div>
                <div className="font-bold text-zinc-900 dark:text-zinc-200">{serviceName}</div>
                {priceSnapshot && <div className="text-amber-600 dark:text-amber-500 font-mono text-sm">${priceSnapshot}</div>}
              </div>
              
              <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  <User className="w-4 h-4" /> Barbero
                </div>
                <div className="font-bold text-zinc-900 dark:text-zinc-200">
                  {assignedBarber ? assignedBarber.fullName : (barberId ? `Barbero #${barberId}` : 'Sin asignar')}
                </div>
              </div>
            </div>
            
            {depositPaid && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase w-full justify-center">
                <CheckCircle2 className="w-4 h-4" /> Seña Pagada Confirmada
              </div>
            )}
          </div>

          {notes && (
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Notas del Cliente
              </h3>
              <div className="text-zinc-700 dark:text-zinc-300 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-sm italic">
                "{notes}"
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Notas Internas (Privadas)
            </h3>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              onBlur={() => {
                // Here we could auto-save notes if an endpoint existed, currently just state
              }}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-200 min-h-[80px] resize-none focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              placeholder="Ej: Prefiere degradé alto..."
            />
          </div>

          {depositAmount > 0 && !depositPaid && !depositProofUrl && status !== 'CANCELLED' && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="w-6 h-6 text-rose-400 mb-2" />
              <div className="text-sm font-bold text-rose-400">Seña Requerida Pendiente</div>
              <div className="text-xs text-rose-500/80 mt-1">El cliente aún no ha subido el comprobante por ${depositAmount}.</div>
            </div>
          )}

          {depositProofUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  Comprobante de Seña
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${depositPaid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                  {depositPaid ? 'Seña Aprobada' : 'Pendiente de Validación'}
                </span>
              </div>
              <a href={depositProofUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-zinc-800 hover:border-amber-500/50 transition-colors">
                <img src={depositProofUrl} alt="Comprobante" className="w-full h-32 object-cover" />
              </a>
              {!depositPaid && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => confirmDep(id)}
                    className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Aprobar Seña
                  </button>
                  <button
                    onClick={() => {
                      const reason = window.prompt('Motivo del rechazo de la seña:');
                      if (reason) rejectDep({ id, reason });
                    }}
                    className="flex-1 h-9 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-lg transition-colors border border-rose-500/20"
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/50 space-y-3">
          
          {status === 'PENDING_REVIEW' && (
            <button onClick={() => handleStatusChange('CONFIRMED')} className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-zinc-900 dark:text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]">
              Confirmar Turno
            </button>
          )}
          {status === 'CONFIRMED' && (
            <button onClick={() => handleStatusChange('IN_PROGRESS')} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-[0.98]">
              Iniciar Turno (Sillón)
            </button>
          )}
          {status === 'IN_PROGRESS' && (
            <button onClick={() => {
              completeAppt(id);
              handleClose();
            }} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Marcar como Terminado y Cobrado
            </button>
          )}

          {status === 'NO_SHOW' && (
            <button
              onClick={() => {
                undoNS(id);
                handleClose();
              }}
              className="w-full h-11 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-amber-600 dark:text-amber-400 font-bold rounded-xl transition-all border border-amber-500/20 flex items-center justify-center gap-2"
            >
              Restaurar Turno (Deshacer No-Show)
            </button>
          )}

          {['PENDING_REVIEW', 'CONFIRMED'].includes(status) && (
            <>
              {isRescheduling ? (
                <div className="bg-white dark:bg-zinc-950 border border-amber-500/40 rounded-2xl p-4 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                      <CalendarClock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span>Elegir Nueva Fecha y Horario</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(false)}
                      className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 cursor-pointer"
                    >
                      Ocultar
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase">Fecha</label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                      onChange={(e) => {
                        setRescheduleDate(e.target.value);
                        setSelectedRescheduleSlot('');
                      }}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase">Horarios Disponibles</label>
                    <SlotPicker
                      serviceId={serviceId}
                      barberId={barberId}
                      date={rescheduleDate}
                      value={selectedRescheduleSlot}
                      onChange={setSelectedRescheduleSlot}
                    />
                  </div>

                  <button
                    disabled={!selectedRescheduleSlot || isReschedulePending}
                    onClick={handleConfirmReschedule}
                    className="w-full h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-900 dark:text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    {isReschedulePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Confirmar Nueva Fecha y Hora</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRescheduling(true)}
                  className="w-full h-11 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold rounded-xl transition-all border border-zinc-300 dark:border-zinc-700 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <CalendarClock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Reprogramar Turno</span>
                </button>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (window.confirm('¿Marcar como No-Show? Esto afectará el historial del cliente.')) {
                      markNoShow(id);
                      handleClose();
                    }
                  }}
                  className="flex-1 h-10 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Ausente
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de cancelar el turno?')) {
                      handleStatusChange('CANCELLED');
                    }
                  }}
                  className="flex-1 h-10 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
