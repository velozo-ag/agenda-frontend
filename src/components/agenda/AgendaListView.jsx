import React from 'react';
import { Clock, User, CheckCircle, XCircle, AlertCircle, PlayCircle, Ban } from 'lucide-react';

const statusColors = {
  PENDING_REVIEW: 'bg-amber-500/20 text-amber-500 border-amber-500/40',
  CONFIRMED: 'bg-blue-500/20 text-blue-500 border-blue-500/40',
  IN_PROGRESS: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40',
  COMPLETED: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',
  CANCELLED: 'bg-rose-500/20 text-rose-500 border-rose-500/40',
  NO_SHOW: 'bg-orange-500/20 text-orange-500 border-orange-500/40',
};

const statusLabels = {
  PENDING_REVIEW: 'Pendiente',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Ausente',
};

const statusIcons = {
  PENDING_REVIEW: <AlertCircle className="w-4 h-4" />,
  CONFIRMED: <CheckCircle className="w-4 h-4" />,
  IN_PROGRESS: <PlayCircle className="w-4 h-4" />,
  COMPLETED: <CheckCircle className="w-4 h-4" />,
  CANCELLED: <XCircle className="w-4 h-4" />,
  NO_SHOW: <Ban className="w-4 h-4" />,
};

export function AgendaListView({ appointments, onAppointmentClick }) {
  if (appointments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
        <Clock className="w-12 h-12 mb-4 opacity-20" />
        <p>No hay turnos agendados en este período.</p>
      </div>
    );
  }

  // Sort by start time just in case
  const sorted = [...appointments].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Group by day
  const grouped = sorted.reduce((acc, appt) => {
    const dateStr = new Date(appt.startTime).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(appt);
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-auto bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {Object.entries(grouped).map(([dateStr, appts]) => (
          <div key={dateStr} className="flex flex-col gap-3">
            <h3 className="text-zinc-100 font-medium text-lg capitalize border-b border-zinc-800 pb-2">
              {dateStr}
            </h3>
            <div className="flex flex-col gap-2">
              {appts.map(appt => {
                const start = new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const end = new Date(appt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div 
                    key={appt.id}
                    onClick={() => onAppointmentClick(appt)}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl cursor-pointer transition-colors group relative"
                  >
                    <div className="flex items-center sm:flex-col justify-between sm:justify-center sm:min-w-[80px]">
                      <div className="flex items-baseline gap-2 sm:flex-col sm:gap-0 sm:items-center">
                        <span className="text-lg font-bold text-zinc-100">{start}</span>
                        <span className="text-xs text-zinc-500 font-mono">{end}</span>
                      </div>
                      {/* Mobile Status Badge (top right) */}
                      <div className={`sm:hidden flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold ${statusColors[appt.status] || statusColors.PENDING_REVIEW}`}>
                        {statusIcons[appt.status]}
                        {statusLabels[appt.status] || appt.status}
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-10 bg-zinc-800 shrink-0" />

                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span className="font-medium text-zinc-100 truncate">{appt.clientName}</span>
                        {appt.barberAlert && <span title="Alerta de inasistencias" className="text-amber-500 text-xs shrink-0">⚠️</span>}
                      </div>
                      <div className="text-sm text-zinc-400 truncate">
                        {appt.serviceNameSnapshot} • {appt.durationMinSnapshot} min
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium whitespace-nowrap ${statusColors[appt.status] || statusColors.PENDING_REVIEW}`}>
                        {statusIcons[appt.status]}
                        {statusLabels[appt.status] || appt.status}
                      </div>
                      {appt.depositProofUrl && !appt.depositPaid && (
                        <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded whitespace-nowrap">
                          Revisar seña
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
