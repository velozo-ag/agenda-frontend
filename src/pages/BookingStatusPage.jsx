import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Upload, 
  XCircle, 
  CalendarX, 
  CalendarClock,
  CalendarPlus,
  MessageCircle,
  Scissors,
  ArrowRight,
  User,
  Calendar as CalendarIcon,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { 
  useAppointmentStatus, 
  useCancelAppointment, 
  useRescheduleAppointment, 
  usePublicBarbers, 
  useSalonInfo 
} from '../hooks/useBooking';
import { getTenantSlug } from '../api/axiosClient';
import { applyTenantTheme } from '../hooks/useTenantBranding';
import { getImageUrl } from '../utils/imageUrl';

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1600&auto=format&fit=crop';

export function BookingStatusPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const urlSlug = searchParams.get('slug') || searchParams.get('tenant');

  const { data: statusData, isLoading, error } = useAppointmentStatus(token);
  const effectiveSlug = urlSlug || statusData?.data?.tenantSlug || getTenantSlug() || 'admin';
  const { data: salonInfoData } = useSalonInfo(effectiveSlug);
  const salon = salonInfoData?.data || {};
  const { data: barbersData } = usePublicBarbers(effectiveSlug);
  const barbers = barbersData?.data || [];

  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment(token);
  const { mutate: rescheduleAppointment, isPending: isRescheduling } = useRescheduleAppointment(token);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const appt = statusData?.data || statusData;

  useEffect(() => {
    setShowCancelConfirm(false);
    setCancelReason('');
  }, [token]);

  useEffect(() => {
    if (salon && Object.keys(salon).length > 0) {
      applyTenantTheme(salon, 'Estado de Reserva');
    }
  }, [salon]);

  useEffect(() => {
    if (appt?.clientEmail || appt?.clientPhone) {
      sessionStorage.setItem('roosty_last_client_query', appt.clientEmail || appt.clientPhone);
    }
  }, [appt?.clientEmail, appt?.clientPhone]);

  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h1 className="text-xl font-bold text-zinc-100 mb-2">Enlace inválido</h1>
        <p className="text-zinc-500 text-center max-w-sm mb-6">El token de tu turno no es válido o falta en la URL.</p>
        <button onClick={() => navigate('/book')} className="text-amber-500 hover:underline">Volver al inicio</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <span className="text-xs text-zinc-400">Consultando estado de tu turno...</span>
      </div>
    );
  }

  if (error || !appt || (!appt.id && !appt.token)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <XCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h1 className="text-xl font-bold text-zinc-100 mb-2">Turno no encontrado</h1>
        <p className="text-zinc-500 max-w-sm mb-6">No pudimos encontrar la reserva. Es posible que haya sido cancelada o que el enlace sea incorrecto.</p>
        <button
          onClick={() => navigate(`/book?slug=${effectiveSlug}`)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all"
        >
          Ir a la agenda del salón
        </button>
      </div>
    );
  }
  const coverImageUrl = (salon.heroUrl || salon.backgroundImageUrl)
    ? getImageUrl(salon.heroUrl || salon.backgroundImageUrl)
    : DEFAULT_COVER_IMAGE;

  const assignedBarber = appt.barberId ? barbers.find((b) => b.id === appt.barberId) : null;

  const handleCancel = () => {
    cancelAppointment(cancelReason, {
      onSuccess: () => setShowCancelConfirm(false)
    });
  };

  const handleReschedule = () => {
    alert("Para reprogramar tu turno, te sugerimos cancelarlo y agendar una nueva fecha, o comunicarte con el local.");
  };

  const handleDownloadIcs = () => {
    const start = new Date(appt.startTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(appt.endTime || appt.startTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const serviceTitle = appt.serviceNameSnapshot || appt.serviceName || 'Servicio';
    const barberNameStr = assignedBarber ? assignedBarber.fullName : 'Cualquiera';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:Turno de ${serviceTitle} en ${salon.storeName || salon.name || 'Barbería'}
DESCRIPTION:Barbero: ${barberNameStr}\\nEstado: ${appt.status}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `turno-${appt.token.substring(0,6)}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center p-4 sm:p-6 relative overflow-x-hidden font-sans">
      {/* Background Banner */}
      <div className="absolute top-0 left-0 right-0 h-[260px] sm:h-[320px] overflow-hidden pointer-events-none z-0">
        <img
          src={coverImageUrl}
          alt={salon.storeName || salon.name || 'Portada'}
          className="w-full h-full object-cover object-center opacity-30 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/80 to-zinc-950" />
      </div>

      <div className="w-full max-w-md flex flex-col gap-6 mt-4 relative z-10">
        {/* Top Navigation Bar with Back & My Appointments */}
        <div className="w-full flex items-center justify-between gap-2 -mb-2">
          <button
            onClick={() => {
              navigate(`/book?slug=${effectiveSlug}`);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer backdrop-blur-xs shadow-md"
            title="Reservar nuevo turno"
          >
            <ChevronLeft className="w-4 h-4 text-amber-500" />
            <span>Reservar nuevo turno</span>
          </button>
        </div>

        {/* Salon Brand Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          {salon.logoUrl ? (
            <img 
              src={getImageUrl(salon.logoUrl)} 
              alt={salon.storeName || salon.name || 'Logo'} 
              className="h-14 sm:h-16 max-w-[220px] object-contain drop-shadow-md"
            />
          ) : (
            <div className="text-xl font-black text-white tracking-wide uppercase">
              {salon.storeName || salon.name || 'Roosty Agenda'}
            </div>
          )}
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">
            Portal de Turnos Online
          </span>
        </div>

        {/* Status Card */}
        <div className={`rounded-3xl border p-6 sm:p-7 flex flex-col items-center text-center gap-4 shadow-xl backdrop-blur-xs ${
          appt.status === 'CONFIRMED' ? 'bg-emerald-500/10 border-emerald-500/30' :
          appt.status === 'PENDING_REVIEW' ? 'bg-amber-500/10 border-amber-500/30' :
          appt.status === 'CANCELLED' ? 'bg-rose-500/10 border-rose-500/30' :
          'bg-zinc-900/90 border-zinc-800'
        }`}>
          {appt.status === 'CONFIRMED' && <CheckCircle className="w-14 h-14 text-emerald-400 animate-in zoom-in duration-300" />}
          {appt.status === 'PENDING_REVIEW' && <Clock className="w-14 h-14 text-amber-400 animate-pulse" />}
          {appt.status === 'CANCELLED' && <XCircle className="w-14 h-14 text-rose-400" />}
          
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white">
              {appt.status === 'CONFIRMED' ? '¡Tu turno está Confirmado!' :
               appt.status === 'PENDING_REVIEW' ? 'Solicitud Pendiente de Confirmación' :
               appt.status === 'CANCELLED' ? 'Turno Cancelado' : appt.status}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xs mx-auto leading-relaxed">
              {appt.status === 'CONFIRMED' && '¡Te esperamos en el local! Guardá este enlace o descargá el evento en tu calendario.'}
              {appt.status === 'PENDING_REVIEW' && 'Solicitud de turno recibida. Tu reserva está pendiente de confirmación por el equipo del salón.'}
              {appt.status === 'CANCELLED' && 'Esta reserva ha sido cancelada. Si querés agendar una nueva cita, podés hacerlo con el botón inferior.'}
            </p>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl backdrop-blur-xs">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3.5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Servicio</span>
              <div className="text-base font-bold text-white mt-0.5">
                {appt.serviceNameSnapshot || appt.serviceName || 'Servicio'}
              </div>
            </div>
            {appt.priceSnapshot && (
              <div className="text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Precio</span>
                <div className="text-lg font-black font-mono text-amber-400 mt-0.5">
                  ${Number(appt.priceSnapshot).toLocaleString('es-AR')}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs border-b border-zinc-800 pb-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Profesional</span>
              <div className="font-semibold text-zinc-200 mt-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>{assignedBarber ? assignedBarber.fullName : 'Cualquiera disponible'}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Fecha y Hora</span>
              <div className="font-semibold text-zinc-200 mt-1 font-mono flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {new Date(appt.startTime).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} hs
                </span>
              </div>
            </div>
          </div>

          {appt.clientName && (
            <div className="text-xs text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-0.5">Titular de la reserva</span>
              <span className="text-zinc-200 font-semibold">{appt.clientName}</span>
              {appt.clientPhone && <span className="text-zinc-500 ml-2">• {appt.clientPhone}</span>}
            </div>
          )}
        </div>

        {/* Upload Receipt (if pending review and deposit required) */}
        {appt.status === 'PENDING_REVIEW' && !appt.depositPaid && appt.depositAmount > 0 && (
          <div className="bg-zinc-900/90 border border-amber-500/30 rounded-3xl p-5 sm:p-6 text-center space-y-3 shadow-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Seña Requerida: ${Number(appt.depositAmount).toLocaleString('es-AR')}</span>
            </div>
            <h3 className="font-bold text-sm text-zinc-200">Subí tu comprobante de pago</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Realizá la transferencia y adjuntá la foto para que el salón confirme tu lugar.
            </p>
            <button className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer shadow-md shadow-amber-500/20">
              <Upload className="w-4 h-4" /> Adjuntar Comprobante
            </button>
          </div>
        )}

        {/* Cancel Confirmation View */}
        {showCancelConfirm ? (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-5 sm:p-6 animate-in slide-in-from-bottom-4 space-y-4">
            <div>
              <h3 className="font-bold text-base text-rose-400">¿Estás seguro de cancelar tu turno?</h3>
              <p className="text-xs text-zinc-400 mt-1">Esta acción liberará tu horario inmediatamente para otros clientes.</p>
            </div>
            <input 
              type="text" 
              placeholder="Motivo de la cancelación (opcional)" 
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-rose-500/50"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setShowCancelConfirm(false)} 
                className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-850 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Volver
              </button>
              <button 
                onClick={handleCancel} 
                disabled={isCancelling} 
                className="flex-1 h-12 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Cancelación'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {appt.status !== 'CANCELLED' && (
              <button 
                onClick={handleDownloadIcs}
                className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-amber-500" />
                <span>Agregar a mi Calendario (Google / Apple)</span>
              </button>
            )}

            {(salon.whatsappPhone || salon.contactWhatsapp || salon.phone) && (
              <a
                href={`https://wa.me/${(salon.whatsappPhone || salon.contactWhatsapp || salon.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${salon.storeName || salon.name || ''}! Te escribo por mi turno para el ${new Date(appt.startTime).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} hs.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escribir al WhatsApp del Salón</span>
              </a>
            )}

            {appt.canReschedule && (
              <button 
                onClick={handleReschedule} 
                disabled={isRescheduling} 
                className="w-full h-12 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-2xl text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CalendarClock className="w-4 h-4" /> Reprogramar Turno
              </button>
            )}

            {appt.canCancel && (
              <button 
                onClick={() => setShowCancelConfirm(true)} 
                className="w-full h-12 border border-zinc-800/80 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 text-zinc-500 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CalendarX className="w-4 h-4" /> Cancelar Turno
              </button>
            )}

            <button
              onClick={() => navigate(`/book?slug=${effectiveSlug}`)}
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-2"
            >
              <span>Reservar otro turno</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingStatusPage;
