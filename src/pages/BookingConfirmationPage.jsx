import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CalendarPlus, ArrowRight, User, Calendar as CalendarIcon, Clock, Scissors, ShieldCheck, MessageCircle } from 'lucide-react';
import { useSalonInfo, usePublicBarbers } from '../hooks/useBooking';
import { getTenantSlug } from '../api/axiosClient';
import { applyTenantTheme } from '../hooks/useTenantBranding';
import { getImageUrl } from '../utils/imageUrl';

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1600&auto=format&fit=crop';

export function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appt = location.state?.appointment;
  const urlSlug = searchParams.get('slug') || searchParams.get('tenant');
  const effectiveSlug = urlSlug || appt?.tenantSlug || getTenantSlug() || 'admin';
  const { data: salonInfoData } = useSalonInfo(effectiveSlug);
  const { data: barbersData } = usePublicBarbers(effectiveSlug);
  
  const salon = salonInfoData?.data || {};
  const barbers = barbersData?.data || [];

  useEffect(() => {
    if (salon && Object.keys(salon).length > 0) {
      applyTenantTheme(salon, 'Turno Confirmado');
    }
  }, [salon]);

  useEffect(() => {
    if (appt?.clientEmail || appt?.clientPhone) {
      sessionStorage.setItem('roosty_last_client_query', appt.clientEmail || appt.clientPhone);
    }
  }, [appt?.clientEmail, appt?.clientPhone]);

  if (!appt) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="text-zinc-500 mb-4">No hay información de reserva activa.</div>
        <button 
          onClick={() => navigate(`/book?slug=${effectiveSlug}`)} 
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all"
        >
          Volver a la agenda
        </button>
      </div>
    );
  }

  const primaryColor = salon.primaryColor || '#f59e0b';
  const requiresDeposit = appt.depositAmount > 0 && !appt.depositPaid;
  const isPendingReview = appt.status === 'PENDING_REVIEW';
  const assignedBarber = appt.barberId ? barbers.find(b => b.id === appt.barberId) : null;
  const effectiveWhatsapp = salon.whatsappPhone || salon.contactWhatsapp || salon.phone || '5491100000000';

  const coverImageUrl = (salon.heroUrl || salon.backgroundImageUrl)
    ? getImageUrl(salon.heroUrl || salon.backgroundImageUrl)
    : DEFAULT_COVER_IMAGE;

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center p-4 sm:p-6 text-center animate-in fade-in zoom-in-95 duration-300 relative overflow-x-hidden font-sans">
      {/* Background Banner */}
      <div className="absolute top-0 left-0 right-0 h-[260px] sm:h-[320px] overflow-hidden pointer-events-none z-0">
        <img
          src={coverImageUrl}
          alt={salon.storeName || salon.name || 'Portada'}
          className="w-full h-full object-cover object-center opacity-30 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/80 to-zinc-950" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative z-10 py-6">
        {/* Salon Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          {salon.logoUrl ? (
            <img 
              src={getImageUrl(salon.logoUrl)} 
              alt={salon.storeName || salon.name || 'Logo'} 
              className="h-14 sm:h-16 max-w-[200px] object-contain drop-shadow-md"
            />
          ) : (
            <div className="text-xl font-black text-white tracking-wide uppercase">
              {salon.storeName || salon.name || 'Roosty Agenda'}
            </div>
          )}
        </div>

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          {isPendingReview ? 'Solicitud de turno recibida' : '¡Turno confirmado con éxito!'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mb-6 leading-relaxed">
          {isPendingReview && !requiresDeposit
            ? 'Tu solicitud de turno está pendiente de confirmación por el equipo del salón.'
            : isPendingReview && requiresDeposit
            ? 'Tu solicitud fue recibida. Para asegurar tu lugar, realizá la transferencia de la seña. El local confirmará tu reserva al verificar el comprobante.'
            : 'Tu turno ya quedó agendado en el sistema del salón. ¡Te esperamos!'}
        </p>

        {/* Appointment Summary Card */}
        <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-3xl w-full p-5 sm:p-6 text-left mb-5 space-y-4 shadow-xl backdrop-blur-xs">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Servicio</span>
              <div className="font-bold text-base text-white mt-0.5">
                {appt.serviceNameSnapshot || appt.serviceName || 'Servicio'}
              </div>
            </div>
            {appt.priceSnapshot && (
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total</span>
                <div className="text-lg font-black font-mono text-amber-400 mt-0.5">
                  ${Number(appt.priceSnapshot).toLocaleString('es-AR')}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Barbero</span>
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
        </div>

        {/* Deposit Card if required */}
        {requiresDeposit && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl w-full p-5 sm:p-6 text-left mb-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-amber-400 text-sm">Seña Requerida: ${Number(appt.depositAmount).toLocaleString('es-AR')}</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Para confirmar tu lugar, realizá la transferencia y subí el comprobante desde la pantalla de estado del turno.
            </p>
            {(salon.depositCbu || salon.depositAlias) && (
              <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-2xl font-mono text-xs text-zinc-200 space-y-1">
                {salon.depositAlias && <div><span className="text-zinc-500">Alias:</span> <strong className="text-amber-400">{salon.depositAlias}</strong></div>}
                {salon.depositCbu && <div><span className="text-zinc-500">CBU:</span> <strong className="text-zinc-300">{salon.depositCbu}</strong></div>}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button 
            onClick={() => navigate(`/book/status?token=${appt.token}${effectiveSlug ? `&slug=${effectiveSlug}` : ''}`)}
            className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <span>Ver Estado y Gestionar Turno</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {effectiveWhatsapp && (
            <a
              href={`https://wa.me/${effectiveWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${salon.storeName || salon.name || ''}! Te escribo por mi solicitud de turno para el ${new Date(appt.startTime).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} hs.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Escribir al WhatsApp del Salón</span>
            </a>
          )}

          <button 
            onClick={handleDownloadIcs}
            className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-amber-400" />
            <span>Agregar al Calendario (.ics)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmationPage;
