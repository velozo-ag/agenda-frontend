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
  MessageCircle,
  Scissors,
  ArrowRight,
  User,
  Calendar as CalendarIcon,
  ShieldCheck,
  ChevronLeft,
  X,
} from 'lucide-react';
import {
  useAppointmentStatus,
  useCancelAppointment,
  useRescheduleAppointment,
  usePublicAvailableSlots,
  usePublicBarbers,
  useSalonInfo,
  useUploadDeposit,
} from '../hooks/useBooking';
import { getTenantSlug } from '../api/axiosClient';
import { applyTenantTheme } from '../hooks/useTenantBranding';
import { getImageUrl } from '../utils/imageUrl';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const DEFAULT_COVER_IMAGE =
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1600&auto=format&fit=crop';

export function BookingStatusPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const urlSlug = searchParams.get('slug') || searchParams.get('tenant');
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef(null);

  const { data: statusData, isLoading, error } = useAppointmentStatus(token);
  const effectiveSlug = urlSlug || statusData?.data?.tenantSlug || getTenantSlug() || 'admin';
  const { data: salonInfoData } = useSalonInfo(effectiveSlug);
  const salon = salonInfoData?.data || salonInfoData || {};
  const { data: barbersData } = usePublicBarbers(effectiveSlug);
  const barbers = barbersData?.data || barbersData || [];

  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment(token);
  const { mutate: uploadDeposit, isPending: isUploading } = useUploadDeposit(token);
  const { mutate: rescheduleAppointment, isPending: isRescheduling } = useRescheduleAppointment(token);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const getLocalISODate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [rescheduleDate, setRescheduleDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return getLocalISODate(d);
  });
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState(null);

  const appt = statusData?.data || statusData;

  const isTerminated = ['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(appt?.status);
  const isFuture = appt?.startTime ? new Date(appt.startTime) > new Date() : false;
  const canCancel = appt?.canCancel ?? (!isTerminated && isFuture);
  const canReschedule = appt?.canReschedule ?? (!isTerminated && isFuture);

  const { data: slotsData, isLoading: isLoadingSlots } = usePublicAvailableSlots(effectiveSlug, {
    serviceId: appt?.serviceId,
    barberId: appt?.barberId,
    date: rescheduleDate,
  });
  const availableSlots = Array.isArray(slotsData?.data) ? slotsData.data : (Array.isArray(slotsData) ? slotsData : []);

  useEffect(() => {
    if (salon?.tenant) {
      applyTenantTheme(salon.tenant);
    }
  }, [salon]);

  const handleCancel = () => {
    cancelAppointment(cancelReason, {
      onSuccess: () => {
        setShowCancelConfirm(false);
        setCancelReason('');
        toast.success('Turno cancelado correctamente');
        queryClient.invalidateQueries({ queryKey: ['appointment-status', token] });
      },
      onError: () => toast.error('Error al cancelar el turno'),
    });
  };

  const handleConfirmReschedule = () => {
    if (!selectedRescheduleSlot) return;
    rescheduleAppointment(selectedRescheduleSlot, {
      onSuccess: () => {
        toast.success('Turno reprogramado exitosamente');
        setShowRescheduleModal(false);
        setSelectedRescheduleSlot(null);
        queryClient.invalidateQueries({ queryKey: ['appointment-status', token] });
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Error al reprogramar el turno');
      },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }

    uploadDeposit(file, {
      onSuccess: () => {
        toast.success('Comprobante enviado exitosamente');
        queryClient.invalidateQueries({ queryKey: ['appointment-status', token] });
      },
      onError: (err) => {
        toast.error('Error al subir comprobante. Intente de nuevo.');
        console.error(err);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[var(--primary-color,#6366f1)] animate-spin mb-4" />
        <p className="text-zinc-400 font-medium animate-pulse">Cargando estado de tu turno...</p>
      </div>
    );
  }

  if (error || !statusData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl flex flex-col items-center text-center max-w-sm">
          <AlertCircle className="w-12 h-12 mb-3" />
          <h2 className="text-lg font-bold mb-1">No se pudo cargar el turno</h2>
          <p className="text-sm opacity-80 mb-6">El enlace puede haber expirado o es incorrecto.</p>
          <button
            onClick={() => navigate(`/book?slug=${effectiveSlug}`)}
            className="h-10 px-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-lg transition-colors text-sm"
          >
            Volver a reservar
          </button>
        </div>
      </div>
    );
  }

  if (!appt || !appt.status) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[var(--primary-color,#6366f1)] animate-spin mb-4" />
        <p className="text-zinc-400 font-medium animate-pulse">Cargando...</p>
      </div>
    );
  }

  const assignedBarber = barbers.find((b) => b.id === appt.barberId);
  const rawCover = salon.heroUrl || salon.backgroundImageUrl;
  const coverImageUrl = (rawCover ? getImageUrl(rawCover) : null) || DEFAULT_COVER_IMAGE;

  return (
    <div className="font-sans relative">
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
      <div className="relative z-10 min-h-screen bg-zinc-950/40 backdrop-blur-sm flex flex-col items-center p-4 sm:p-6 overflow-x-hidden text-zinc-100">
        <div className="w-full max-w-md flex flex-col gap-6 relative z-10">
          
          {/* Top Navigation */}
          <div className="w-full flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate(`/book?slug=${effectiveSlug}`)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/80 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer backdrop-blur-md"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-400" />
              <span>Volver</span>
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
              <div className="text-xl font-bold text-white tracking-wide uppercase">
                {salon.storeName || salon.name || 'Roosty Agenda'}
              </div>
            )}
            <span className="text-xs text-zinc-400 font-medium tracking-wide">Portal de Turnos Online</span>
          </div>

          {/* Status UI (Top) NO box */}
          <div className="flex flex-col items-center text-center mt-4 mb-4 gap-3">
            {appt.status === 'CONFIRMED' && <CheckCircle className="w-16 h-16 text-emerald-400 animate-in zoom-in duration-300" />}
            {appt.status === 'PENDING_REVIEW' && <Clock className="w-16 h-16 text-amber-400 animate-pulse" />}
            {appt.status === 'CANCELLED' && <XCircle className="w-16 h-16 text-rose-400" />}
            {appt.status === 'COMPLETED' && <CheckCircle className="w-16 h-16 text-emerald-400" />}

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {appt.status === 'CONFIRMED' && '¡Tu turno está Confirmado!'}
                {appt.status === 'PENDING_REVIEW' && 'Solicitud Pendiente'}
                {appt.status === 'CANCELLED' && 'Turno Cancelado'}
                {appt.status === 'COMPLETED' && 'Turno Completado'}
              </h1>
              <p className="text-sm text-zinc-300 mt-2 max-w-xs mx-auto leading-relaxed">
                {appt.status === 'CONFIRMED' && '¡Te esperamos en el local!'}
                {appt.status === 'PENDING_REVIEW' && 'Tu reserva está pendiente de confirmación por el salón.'}
                {appt.status === 'CANCELLED' && (appt.cancellationReason || 'Esta reserva ha sido cancelada.')}
                {appt.status === 'COMPLETED' && 'Esperamos que hayas disfrutado tu visita.'}
              </p>
            </div>
          </div>

          {/* Master Ticket Card */}
          <div className="w-full bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
            {/* Service & Price */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Servicio</span>
                <div className="text-base font-medium text-white mt-1">
                  {appt.serviceNameSnapshot || appt.serviceName || 'Servicio'}
                </div>
              </div>
              {appt.priceSnapshot && (
                <div className="text-right">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total</span>
                  <div className="text-lg font-mono tabular-nums font-medium text-[var(--primary-color,#818cf8)] mt-1">
                    ${Number(appt.priceSnapshot).toLocaleString('es-AR')}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Profesional</span>
                <div className="font-medium text-zinc-200 mt-1">
                  {assignedBarber ? assignedBarber.fullName : 'Cualquiera disponible'}
                </div>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Fecha y Hora</span>
                <div className="font-medium text-zinc-200 mt-1">
                  {new Date(appt.startTime).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  hs
                </div>
              </div>
            </div>

            {appt.clientName && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400 block mb-1">
                  Titular de la reserva
                </span>
                <span className="text-zinc-200 font-medium">{appt.clientName}</span>
                {appt.clientPhone && <span className="text-zinc-400 ml-2">⬢ {appt.clientPhone}</span>}
              </div>
            )}

            {/* Upload Deposit (Immersive UI) */}
            {appt.status === 'PENDING_REVIEW' && !appt.depositPaid && appt.depositAmount > 0 && (
              <>
                <div className="border-t border-dashed border-white/10 my-1" />
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[var(--primary-color,#818cf8)]" />
                      <span className="text-sm font-medium text-white">Seña Requerida</span>
                    </div>
                    <span className="text-sm font-mono tabular-nums text-[var(--primary-color,#818cf8)]">
                      ${Number(appt.depositAmount).toLocaleString('es-AR')}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Realizá la transferencia y adjuntá la foto para confirmar tu lugar.
                  </p>
                  {appt.depositProofUrl ? (
                    <div className="text-sm font-medium text-emerald-400 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center">
                      Comprobante enviado y en revisión
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <button
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-11 bg-[var(--primary-color,#6366f1)] hover:bg-[var(--primary-color,#4f46e5)] text-zinc-950 rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {isUploading ? 'Subiendo...' : 'Adjuntar Comprobante'}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-3">
            {showCancelConfirm ? (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-base text-rose-400">¿Estás seguro de cancelar tu turno?</h3>
                  <p className="text-xs text-zinc-400 mt-1">Esta acción liberará tu horario inmediatamente.</p>
                </div>
                <input
                  type="text"
                  placeholder="Motivo de la cancelación (opcional)"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-rose-500/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 h-11 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="flex-1 h-11 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
                  >
                    {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Cancelación'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {(salon.whatsappPhone || salon.contactWhatsapp || salon.phone) && (
                  <a
                    href={`https://wa.me/${(
                      salon.whatsappPhone ||
                      salon.contactWhatsapp ||
                      salon.phone
                    ).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hola ${salon.storeName || salon.name || ''}! Te escribo por mi turno para el ${new Date(
                        appt.startTime
                      ).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} hs.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 border border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Escribir al WhatsApp del Salón</span>
                  </a>
                )}

                {canReschedule && (
                  <button
                    onClick={() => setShowRescheduleModal(true)}
                    disabled={isRescheduling}
                    className="w-full h-11 border border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CalendarClock className="w-4 h-4" /> Reprogramar Turno
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full h-11 hover:bg-rose-500/10 hover:text-rose-400 text-zinc-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CalendarX className="w-4 h-4" /> Cancelar Turno
                  </button>
                )}
              </>
            )}

            <div className="mt-4 border-t border-white/10 pt-4">
              <button
                onClick={() => navigate(`/book?slug=${effectiveSlug}`)}
                className="w-full h-11 bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Reservar otro turno</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-[var(--primary-color,#818cf8)]" />
                <h3 className="font-semibold text-white text-base">Reprogramar Turno</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">Elegí la nueva fecha</label>
              <input
                type="date"
                min={getLocalISODate(new Date())}
                value={rescheduleDate}
                onChange={(e) => {
                  setRescheduleDate(e.target.value);
                  setSelectedRescheduleSlot(null);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 outline-none focus:border-[var(--primary-color,#6366f1)]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">Horarios Disponibles</label>
              {isLoadingSlots ? (
                <div className="py-6 flex items-center justify-center text-zinc-400 text-xs gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--primary-color,#6366f1)]" />
                  <span>Buscando horarios...</span>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="py-6 text-center text-zinc-400 text-xs bg-zinc-950/50 rounded-lg border border-zinc-800/60 p-4">
                  No hay turnos disponibles para esta fecha. Probá seleccionando otro día.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => {
                    const time = new Date(slot).toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const isSelected = selectedRescheduleSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedRescheduleSlot(slot)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[var(--primary-color,#6366f1)] text-zinc-950 font-bold border-transparent'
                            : 'bg-zinc-950/80 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/60'
                        }`}
                      >
                        {time} hs
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                disabled={!selectedRescheduleSlot || isRescheduling}
                onClick={handleConfirmReschedule}
                className="flex-1 h-10 bg-[var(--primary-color,#6366f1)] hover:bg-[var(--primary-color,#4f46e5)] text-zinc-950 font-bold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isRescheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Cambio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingStatusPage;
