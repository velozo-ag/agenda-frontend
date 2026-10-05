import React from 'react';
import { Clock, User, CheckCircle, XCircle, AlertCircle, PlayCircle, Ban, ChevronRight, BadgeDollarSign, Palmtree } from 'lucide-react';

const statusConfig = {
  PENDING_REVIEW: {
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-500',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    label: 'Pendiente',
  },
  CONFIRMED: {
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    label: 'Confirmado',
  },
  IN_PROGRESS: {
    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    dot: 'bg-indigo-400 animate-pulse',
    icon: <PlayCircle className="w-3.5 h-3.5" />,
    label: 'En curso',
  },
  COMPLETED: {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    label: 'Completado',
  },
  CANCELLED: {
    badge: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    dot: 'bg-rose-700',
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: 'Cancelado',
  },
  NO_SHOW: {
    badge: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    dot: 'bg-orange-600',
    icon: <Ban className="w-3.5 h-3.5" />,
    label: 'Ausente',
  },
};

export function AgendaListView({ appointments, onAppointmentClick }) {
  if (appointments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-3 bg-zinc-950 p-4 md:p-6">
        <Palmtree className="w-12 h-12 opacity-20" />
        <p className="text-sm font-medium">No hay turnos agendados en este período.</p>
      </div>
    );
  }

  const sorted = [...appointments].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Group by day (ISO date key for stable sort)
  const grouped = sorted.reduce((acc, appt) => {
    const iso = new Date(appt.startTime).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[iso]) acc[iso] = [];
    acc[iso].push(appt);
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-auto bg-zinc-950 p-4 md:p-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {Object.entries(grouped).map(([dateStr, appts]) => (
          <div key={dateStr} className="flex flex-col gap-1">
            {/* Day header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-zinc-800/60" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest capitalize font-mono whitespace-nowrap">
                {dateStr}
              </span>
              <div className="h-px flex-1 bg-zinc-800/60" />
            </div>

            {/* Timeline list */}
            <div className="relative pl-4">
              {/* Vertical timeline line */}
              <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-zinc-800 rounded-full" />

              <div className="flex flex-col gap-2">
                {appts.map(appt => {
                  const config = statusConfig[appt.status] || statusConfig.PENDING_REVIEW;
                  const start = new Date(appt.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const end = new Date(appt.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={appt.id}
                      onClick={() => onAppointmentClick(appt)}
                      className="relative flex items-center gap-3 bg-zinc-900 border border-zinc-800/70 hover:border-zinc-700/80 hover:bg-zinc-900/80 p-3.5 rounded-2xl cursor-pointer transition-all group"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute -left-[17px] w-2 h-2 rounded-full ring-2 ring-zinc-950 shrink-0 ${config.dot}`} />

                      {/* Time block */}
                      <div className="flex flex-col items-center text-center shrink-0 min-w-[48px]">
                        <span className="text-sm font-black font-mono text-zinc-100 tabular-nums">{start}</span>
                        <span className="text-[10px] text-zinc-600 font-mono tabular-nums">{end}</span>
                      </div>

                      {/* Divider */}
                      <div className="w-px h-8 bg-zinc-800 shrink-0" />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="font-semibold text-sm text-zinc-100 truncate">{appt.clientName}</span>
                          {appt.barberAlert && (
                            <span title="Alerta de inasistencias" className="text-amber-400 text-xs shrink-0">⚠️</span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 truncate">
                          {appt.serviceNameSnapshot}
                          {appt.durationMinSnapshot && (
                            <span className="font-mono text-zinc-600 ml-1">• {appt.durationMinSnapshot} min</span>
                          )}
                        </div>
                      </div>

                      {/* Right: status + flags */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold whitespace-nowrap ${config.badge}`}>
                          {config.icon}
                          <span className="hidden sm:inline">{config.label}</span>
                        </div>
                        {appt.depositProofUrl && !appt.depositPaid && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md whitespace-nowrap flex items-center gap-1">
                            <BadgeDollarSign className="w-3 h-3" />
                            <span className="hidden sm:inline">Revisar seña</span>
                          </span>
                        )}
                      </div>

                      <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 shrink-0 transition-colors" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
