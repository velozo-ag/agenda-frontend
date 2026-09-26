import { Clock, User } from 'lucide-react';
import React from 'react';

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

export function AppointmentCard({ appointment, onClick }) {
  const { clientName, serviceNameSnapshot: serviceName, startTime, status, barberAlert, depositProofUrl, depositPaid } = appointment;
  const time = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      onClick={() => onClick(appointment)}
      className="p-1.5 h-fit min-h-full w-full rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors flex flex-col relative shadow-sm"
    >
      <div className="flex justify-between items-center shrink-0 mb-0.5 gap-1">
        <span className="font-mono text-zinc-300 font-semibold text-[10px] leading-tight">{time}</span>
        <div className={`px-1 rounded text-[9px] font-bold leading-tight truncate ${statusColors[status] || statusColors.PENDING_REVIEW}`}>
          {statusLabels[status] || status}
        </div>
      </div>
      
      <div className="font-semibold text-zinc-100 text-xs truncate leading-tight flex items-center gap-1 shrink-0">
        {clientName}
        {barberAlert && <span title="Alerta de inasistencias" className="text-[10px]">⚠️</span>}
      </div>
      
      <div className="text-[10px] text-zinc-400 truncate mt-0.5 leading-tight">
        {serviceName}
      </div>

      {depositProofUrl && !depositPaid && (
        <div className="hidden sm:block mt-1 text-[9px] text-amber-500 bg-amber-500/10 px-1 py-0.5 rounded w-fit truncate">
          Seña pdte
        </div>
      )}
    </div>
  );
}
