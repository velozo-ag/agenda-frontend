import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Clock, MapPin, User, Calendar, Edit, Phone, CreditCard, AlertTriangle, FileText, CheckCircle2, Scissors } from 'lucide-react';
import { useUpdateAppointmentStatus, useAppointment, useConfirmDeposit, useRejectDeposit, useUndoNoShow } from '../../hooks/useAppointments';
import { useMyTenant } from '../../hooks/useTenantBranding';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  PENDING_REVIEW: { label: 'Pendiente', color: 'bg-amber-500/20 text-amber-500 border-amber-500/30' },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
  IN_PROGRESS: { label: 'En Curso', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  COMPLETED: { label: 'Cobrado', color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' },
  NO_SHOW: { label: 'No Show', color: 'bg-orange-500/20 text-orange-500 border-orange-500/30' },
  CANCELLED: { label: 'Cancelado', color: 'bg-rose-500/20 text-rose-500 border-rose-500/30' },
};

export function AppointmentDetailPanel({ appointment: initialAppointment, onClose, onEdit, inline = false }) {
  const [internalNotes, setInternalNotes] = useState(initialAppointment?.internalNotes || '');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const { data: fetchedData } = useAppointment(initialAppointment?.id);
  const appointment = fetchedData?.data || fetchedData || initialAppointment;
  
  const { mutate: updateStatus } = useUpdateAppointmentStatus();
  const { mutate: confirmDep } = useConfirmDeposit();
  const { mutate: rejectDep } = useRejectDeposit();
  const { mutate: undoNS } = useUndoNoShow();
  const { data: tenant } = useMyTenant();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger slide in
    const timer = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Wait for transition
  };

  if (!appointment) return null;

  const { id, clientName, clientPhone, serviceNameSnapshot: serviceName, startTime, endTime, status, depositProofUrl, depositPaid, notes } = appointment;

  const handleStatusChange = (newStatus) => {
    updateStatus({ id, status: newStatus });
    if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED' || newStatus === 'NO_SHOW') {
      handleClose();
    }
  };

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

  const baseClasses = `fixed inset-y-0 right-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isSlideOpen ? 'translate-x-0' : 'translate-x-full'}`;
  
  const inlineClasses = inline
    ? `hidden lg:flex lg:relative lg:inset-auto lg:right-auto lg:w-[400px] lg:max-w-none lg:shrink-0 lg:bg-zinc-900 lg:border lg:border-zinc-800 lg:rounded-xl lg:shadow-sm lg:z-auto transition-opacity duration-200 ${isSlideOpen ? 'opacity-100' : 'opacity-0'}`
    : "";

  const wrapperClasses = inline ? inlineClasses : baseClasses;

  return (
    <>
      {/* Mobile Backdrop */}
      {!inline && (
        <div 
          onClick={handleClose}
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSlideOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        />
      )}

      <div className={wrapperClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-zinc-100">Detalle del Turno</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${conf.color}`}>
              {conf.label}
            </span>
          </div>
          <button onClick={handleClose} className="p-2 -mr-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
          
          {/* Client Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-black text-lg">
                {initials}
              </div>
              <div>
                <div className="font-bold text-zinc-100 text-lg leading-none mb-1">{clientName}</div>
                <div className="text-zinc-400 text-sm font-mono">{clientPhone || 'Sin teléfono'}</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {clientPhone && (
                <>
                  <a 
                    href={`tel:${cleanPhone}`}
                    className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={handleWhatsApp} 
                    className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 flex items-center justify-center transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Service & Time Info */}
          <div className="space-y-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Fecha y Hora</div>
                <div className="font-bold text-zinc-200 capitalize">
                  {new Date(startTime).toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'short' })}
                </div>
                <div className="text-amber-500 font-mono font-semibold mt-0.5">
                  {new Date(startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} - {new Date(endTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Servicio</div>
                <div className="font-bold text-zinc-200">{serviceName}</div>
                {depositPaid && (
                  <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                    <CheckCircle2 className="w-3 h-3" /> Seña Pagada
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Notas del Cliente
              </h3>
              <div className="text-zinc-300 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-sm italic">
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
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 min-h-[80px] resize-none focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-zinc-600"
              placeholder="Ej: Prefiere degradé alto, no usar navaja..."
            />
          </div>

          {depositProofUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  Comprobante de Seña Adjunto
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
                      const reason = window.prompt('Motivo del rechazo de la seña (ej: importe insuficiente, comprobante no legible):');
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

        {/* Action Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/50 space-y-3">
          
          {/* Primary Action */}
          {status === 'PENDING_REVIEW' && (
            <button onClick={() => handleStatusChange('CONFIRMED')} className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]">
              Confirmar Turno
            </button>
          )}
          {status === 'CONFIRMED' && (
            <button onClick={() => handleStatusChange('IN_PROGRESS')} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-[0.98]">
              Iniciar Turno (Sillón)
            </button>
          )}
          {status === 'IN_PROGRESS' && (
            <button onClick={() => handleStatusChange('COMPLETED')} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
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
              className="w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold rounded-xl transition-all border border-amber-500/20 flex items-center justify-center gap-2"
            >
              Restaurar Turno (Deshacer No-Show)
            </button>
          )}

          {/* Secondary Actions Row */}
          {['PENDING_REVIEW', 'CONFIRMED'].includes(status) && (
            <div className="flex gap-2">
               <button 
                  onClick={() => {
                    handleClose();
                    onEdit && setTimeout(() => onEdit(appointment), 300);
                  }}
                  className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
               >
                <Edit className="w-3.5 h-3.5" />
                Reprogramar
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('¿Marcar como No-Show? Esto afectará el historial del cliente.')) {
                    handleStatusChange('NO_SHOW');
                  }
                }}
                className="flex-1 h-10 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
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
                className="flex-1 h-10 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
