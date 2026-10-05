import React from 'react';
import { Scissors, User, BadgeDollarSign, AlertTriangle, Clock, CheckCircle2, PlayCircle, XCircle, UserX } from 'lucide-react';

const statusStyles = {
  PENDING_REVIEW: {
    card: 'bg-zinc-900/60 border-zinc-700/30 backdrop-blur-md',
    text: 'text-zinc-200',
    badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    dot: 'bg-zinc-400',
    opacity: 'opacity-100',
    icon: Clock,
    iconColor: 'text-zinc-400',
  },
  CONFIRMED: {
    card: 'bg-zinc-900/60 border-blue-900/30 backdrop-blur-md',
    text: 'text-zinc-100',
    badge: 'bg-blue-900/50 text-blue-400 border-blue-700/30',
    dot: 'bg-blue-400',
    opacity: 'opacity-100',
    icon: CheckCircle2,
    iconColor: 'text-blue-400',
  },
  IN_PROGRESS: {
    card: 'bg-zinc-900/80 border-indigo-600/50 backdrop-blur-md shadow-lg',
    text: 'text-white',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 animate-pulse',
    dot: 'bg-indigo-400',
    opacity: 'opacity-100',
    icon: PlayCircle,
    iconColor: 'text-indigo-400',
  },
  COMPLETED: {
    card: 'bg-zinc-900/60 border-emerald-900/30 backdrop-blur-md',
    text: 'text-zinc-300',
    badge: 'bg-emerald-900/30 text-emerald-500 border-emerald-800/30',
    dot: 'bg-emerald-500',
    opacity: 'opacity-75',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
  },
  CANCELLED: {
    card: 'bg-zinc-950/80 border-zinc-900/50 backdrop-blur-md',
    text: 'text-zinc-500',
    badge: 'bg-zinc-900/50 text-zinc-600 border-zinc-800',
    dot: 'bg-zinc-700',
    opacity: 'opacity-50 grayscale',
    icon: XCircle,
    iconColor: 'text-zinc-500',
  },
  NO_SHOW: {
    card: 'bg-zinc-950/80 border-rose-950/30 backdrop-blur-md',
    text: 'text-rose-400/70',
    badge: 'bg-rose-950/30 text-rose-500 border-rose-900/30',
    dot: 'bg-rose-600',
    opacity: 'opacity-60 grayscale',
    icon: UserX,
    iconColor: 'text-rose-500',
  },
};

const statusLabels = {
  PENDING_REVIEW: 'Pendiente',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Ausente',
};

export function AppointmentCard({ appointment, barberColor, onClick }) {
  const {
    clientName,
    serviceNameSnapshot: serviceName,
    startTime,
    endTime,
    status,
    barberAlert,
    depositProofUrl,
    depositPaid,
  } = appointment;

  const start = new Date(startTime);
  const end = new Date(endTime);
  const startTimeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const durationMins = (end.getTime() - start.getTime()) / 60000;

  const styles = statusStyles[status] || statusStyles.PENDING_REVIEW;
  const accentColor = barberColor || '#a1a1aa'; // fallback to zinc-400
  const StatusIcon = styles.icon;

  // Render tiny colored background behind the card
  const CardBg = () => (
    <div 
      className="absolute inset-0 pointer-events-none" 
      style={{ backgroundColor: accentColor, opacity: 0.12 }} 
    />
  );

  // --- SINGLE-ROW (<=30 min) ---
  if (durationMins <= 30) {
    return (
      <div
        onClick={() => onClick(appointment)}
        title={`${startTimeStr} - ${endTimeStr} | ${serviceName} | ${clientName} (${statusLabels[status] || status})`}
        className={`relative h-full w-full rounded-lg border cursor-pointer flex items-center gap-1 px-1.5 overflow-hidden transition-all ${styles.card} ${styles.opacity}`}
      >
        <CardBg />
        {/* Barber Accent Bar */}
        <div className="w-[3px] self-stretch rounded-full shrink-0 my-1 z-10" style={{ backgroundColor: accentColor }} />

        {/* Status Icon */}
        <StatusIcon className={`w-3 h-3 shrink-0 z-10 ${styles.iconColor}`} />

        {/* Time */}
        <span className={`font-mono text-[9px] font-bold shrink-0 tabular-nums opacity-80 z-10 ${styles.text}`}>
          {startTimeStr}
        </span>

        <span className={`text-[9px] opacity-30 shrink-0 z-10 ${styles.text}`}>|</span>

        {/* Service */}
        <span className={`text-[10px] font-bold truncate flex-1 min-w-0 z-10 ${styles.text}`}>
          {serviceName}
        </span>

        {/* Client */}
        <span className={`text-[9px] opacity-60 truncate hidden sm:block max-w-[70px] shrink-0 z-10 ${styles.text}`}>
          {clientName}
        </span>

        {/* Alerts */}
        <div className="flex items-center gap-0.5 shrink-0 z-10">
          {barberAlert && <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />}
          {depositProofUrl && !depositPaid && (
            <BadgeDollarSign className="w-2.5 h-2.5 text-amber-400" />
          )}
        </div>
      </div>
    );
  }

  // --- TWO-ROW COMPACT (31-50 min) ---
  if (durationMins <= 50) {
    return (
      <div
        onClick={() => onClick(appointment)}
        title={`${startTimeStr} - ${endTimeStr} | ${serviceName} | ${clientName} (${statusLabels[status] || status})`}
        className={`relative h-full w-full rounded-xl border cursor-pointer flex items-stretch gap-1.5 overflow-hidden transition-all ${styles.card} ${styles.opacity}`}
      >
        <CardBg />
        {/* Barber Accent Bar */}
        <div className="w-[3px] shrink-0 self-stretch rounded-l-xl z-10" style={{ backgroundColor: accentColor }} />

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 pr-1 py-1 z-10">
          <div className={`flex items-center gap-1 ${styles.text}`}>
            <span className="text-[11px] font-bold truncate flex-1 min-w-0">{serviceName}</span>
            {barberAlert && <AlertTriangle className="w-2.5 h-2.5 text-amber-400 shrink-0" />}
            {depositProofUrl && !depositPaid && <BadgeDollarSign className="w-2.5 h-2.5 text-amber-400 shrink-0" />}
          </div>
          <div className={`flex items-center gap-1 text-[9px] opacity-75 ${styles.text}`}>
            <StatusIcon className={`w-2.5 h-2.5 shrink-0 ${styles.iconColor}`} />
            <span className="font-mono shrink-0 tabular-nums">{startTimeStr}</span>
            <span className="opacity-50">•</span>
            <User className="w-2.5 h-2.5 shrink-0 opacity-60" />
            <span className="truncate opacity-80">{clientName}</span>
          </div>
        </div>
      </div>
    );
  }

  // --- FULL (>50 min) ---
  return (
    <div
      onClick={() => onClick(appointment)}
      title={`${startTimeStr} - ${endTimeStr} | ${serviceName} | ${clientName} (${statusLabels[status] || status})`}
      className={`relative p-1.5 h-full w-full rounded-xl border transition-all cursor-pointer flex flex-col shadow-md overflow-hidden group ${styles.card} ${styles.opacity}`}
    >
      <CardBg />
      {/* Barber Accent Top Dot/Bar */}
      <div className="h-0.5 rounded-full mb-1.5 mx-1 shrink-0 z-10" style={{ backgroundColor: accentColor }} />

      {/* Header */}
      <div className="flex justify-between items-start shrink-0 mb-1 px-1 z-10">
        <div className={`font-bold text-[11px] truncate leading-tight flex items-center gap-1 flex-1 ${styles.text}`}>
          <Scissors className="w-3 h-3 shrink-0 opacity-70" />
          <span className="truncate">{serviceName}</span>
        </div>
        {barberAlert && (
          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 ml-1" title="Alerta de inasistencias" />
        )}
      </div>

      {/* Client */}
      <div className={`text-[10px] font-medium opacity-75 truncate leading-tight flex items-center gap-1 mb-1 px-1 z-10 ${styles.text}`}>
        <User className="w-2.5 h-2.5 shrink-0" />
        <span className="truncate">{clientName}</span>
      </div>

      {/* Footer */}
      <div className="mt-auto px-1 flex flex-col gap-1 overflow-hidden z-10">
        <div className={`font-mono text-[9px] font-semibold opacity-60 border-t border-white/10 pt-1 border-dashed truncate ${styles.text}`}>
          {startTimeStr} - {endTimeStr}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold tracking-wide uppercase border flex items-center gap-1 ${styles.badge} truncate`}>
            <StatusIcon className="w-2.5 h-2.5" />
            {statusLabels[status] || status}
          </div>

          {depositProofUrl && !depositPaid && (
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 truncate">
              <BadgeDollarSign className="w-2.5 h-2.5 shrink-0" />
              SEÑA
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
