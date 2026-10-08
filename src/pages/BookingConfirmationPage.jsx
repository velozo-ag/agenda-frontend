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
          className="px-5 py-2.5 rounded-xl bg-[var(--primary-color,#6366f1)] hover:bg-indigo-400 text-zinc-950 font-bold text-sm transition-all"
        >
          Volver a la agenda
        </button>
      </div>
    );
  }

  const requiresDeposit = appt.depositAmount > 0 && !appt.depositPaid;
  const isPendingReview = appt.status === 'PENDING_REVIEW';
  const assignedBarber = appt.barberId ? barbers.find(b => b.id === appt.barberId) : null;
  const effectiveWhatsapp = salon.whatsappPhone || salon.contactWhatsapp || salon.phone || '5491100000000';

  const rawCover = salon.heroUrl || salon.backgroundImageUrl;
  const coverImageUrl = (rawCover ? getImageUrl(rawCover) : null) || DEFAULT_COVER_IMAGE;

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
SUMMARY:Turno de ${serviceTitle} en ${salon.storeName || salon.name || 'nuestro local'}
DESCRIPTION:Profesional: ${barberNameStr}\\nEstado: ${appt.status}
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
    <>
      {/* Global Background */}
      {/* BACKGROUND BANNER FIXED */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={salon.storeName || salon.name || 'Portada'}
            className="w-full h-full object-cover object-center opacity-40"
          />
        ) : null}
        <div className="absolute inset-0 bg-zinc-950/40" />
      </div>

      {/* App Wrapper */}
      <div className="relative z-10 min-h-screen bg-zinc-950/40 backdrop-blur-sm text-zinc-100 flex flex-col items-center p-4 sm:p-6 text-center animate-in fade-in zoom-in-95 duration-300 overflow-x-hidden font-sans">
        
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md py-6">
          {/* Salon Brand Header */}
          <div className="flex flex-col items-center gap-2 mb-8">
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

          {/* Status (Top) */}
          <div className="flex flex-col items-center mb-8">
            {isPendingReview ? (
              <Clock className="w-16 h-16 text-amber-500 mb-4" />
            ) : (
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            )}
            
            <h1 className="text-2xl font-bold text-white mb-2">
              {isPendingReview ? 'Solicitud de turno recibida' : '¡Turno confirmado con éxito!'}
            </h1>
            <p className="text-sm text-zinc-300 max-w-sm leading-relaxed">
              {isPendingReview && !requiresDeposit
                ? 'Tu solicitud de turno está pendiente de confirmación por el equipo del salón.'
                : isPendingReview && requiresDeposit
                ? 'Tu solicitud fue recibida. Para asegurar tu lugar, realizá la transferencia de la seña. El local confirmará tu reserva al verificar el comprobante.'
                : 'Tu turno ya quedó agendado en el sistema del salón. ¡Te esperamos!'}
            </p>
          </div>

          {/* Master Ticket Card */}
          <div className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-md w-full p-5 text-left mb-8 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Servicio</span>
                <div className="font-bold text-base text-white mt-0.5">
                  {appt.serviceNameSnapshot || appt.serviceName || 'Servicio'}
                </div>
              </div>
              {appt.priceSnapshot && (
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total</span>
                  <div className="text-lg font-bold tabular-nums font-mono text-white mt-0.5">
                    ${Number(appt.priceSnapshot).toLocaleString('es-AR')}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Profesional</span>
                <div className="font-medium text-zinc-200 mt-1 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-zinc-400" />
                  <span>{assignedBarber ? assignedBarber.fullName : 'Cualquiera disponible'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Fecha y Hora</span>
                <div className="font-medium text-zinc-200 mt-1 tabular-nums font-mono flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-zinc-400" />
                  <span>
                    {new Date(appt.startTime).toLocaleString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Deposit Info inside Master Ticket */}
            {requiresDeposit && (
              <>
                <hr className="border-dashed border-white/10 my-5" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-zinc-300" />
                    <h3 className="font-bold text-white text-sm">Seña Requerida: ${Number(appt.depositAmount).toLocaleString('es-AR')}</h3>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Para confirmar tu lugar, realizá la transferencia y subí el comprobante desde la pantalla de estado del turno.
                  </p>
                  {(salon.depositCbu || salon.depositAlias) && (
                    <div className="bg-zinc-950/50 rounded-lg p-3 font-mono text-xs text-zinc-200 space-y-1 mt-2">
                      {salon.depositAlias && <div><span className="text-zinc-400">Alias:</span> <strong className="text-white">{salon.depositAlias}</strong></div>}
                      {salon.depositCbu && <div><span className="text-zinc-400">CBU:</span> <strong className="text-white">{salon.depositCbu}</strong></div>}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="bg-[var(--primary-color,#6366f1)]/10 border border-[var(--primary-color,#6366f1)]/20 rounded-lg p-4 text-sm text-zinc-300 text-center mb-6">
              Te enviamos los detalles a tu correo electrónico. Podrás <strong>subir tu comprobante de seña</strong> y consultar el estado ingresando a "Ver Estado".
            </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => navigate(`/book/status?token=${appt.token}${effectiveSlug ? `&slug=${effectiveSlug}` : ''}`)}
              className="w-full h-12 bg-[var(--primary-color,#6366f1)] hover:bg-indigo-400 text-zinc-950 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Ver Estado</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {effectiveWhatsapp && (
              <a
                href={`https://wa.me/${effectiveWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${salon.storeName || salon.name || ''}! Te escribo por mi solicitud de turno para el ${new Date(appt.startTime).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} hs.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}

            
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingConfirmationPage;
