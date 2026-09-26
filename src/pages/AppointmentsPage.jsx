import React, { useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { AgendaListView } from '../components/agenda/AgendaListView';
import { AppointmentDetailPanel } from '../components/agenda/AppointmentDetailPanel';
import { AppointmentsMonthPicker } from '../components/agenda/AppointmentsMonthPicker';
import { AppointmentsDayStrip } from '../components/agenda/AppointmentsDayStrip';
import { Filter, User } from 'lucide-react';

export function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return (new Date(today.getTime() - offset)).toISOString().split('T')[0];
  });
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { data: appointmentsData, isLoading } = useAppointments({
    fromDate: selectedDate,
    toDate: selectedDate,
    barberId: selectedBarberId || undefined,
    status: statusFilter || undefined
  });

  const { barbers } = useBarbers();

  const appointments = appointmentsData?.data || appointmentsData || [];

  return (
    <div className="flex h-full bg-zinc-950 gap-2 md:gap-4 p-2 md:p-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar: Calendar & Filters */}
      <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto hidden md:flex">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-sm">
          <h1 className="text-xl font-bold text-zinc-100 mb-1">Explorador de Turnos</h1>
          <p className="text-sm text-zinc-400">Seleccioná una fecha para ver la lista detallada.</p>
        </div>

        <AppointmentsMonthPicker 
          selectedDate={selectedDate} 
          onChange={setSelectedDate} 
        />

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col gap-4">
          <h3 className="text-zinc-100 font-semibold flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-amber-500" />
            Filtros Avanzados
          </h3>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Barbero asignado</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedBarberId}
                onChange={(e) => setSelectedBarberId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer hover:border-zinc-700 transition-colors"
              >
                <option value="">Todos los barberos</option>
                {barbers.map(b => (
                  <option key={b.id} value={b.id}>{b.fullName}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Estado del turno</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer hover:border-zinc-700 transition-colors"
            >
              <option value="">Todos los estados</option>
              <option value="PENDING_REVIEW">Pendientes</option>
              <option value="CONFIRMED">Confirmados</option>
              <option value="IN_PROGRESS">En Curso</option>
              <option value="COMPLETED">Completados</option>
              <option value="NO_SHOW">No Shows</option>
              <option value="CANCELLED">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: List */}
      <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm relative">
        {/* Mobile controls (visible only on small screens) */}
        <div className="md:hidden flex flex-col bg-zinc-950 border-b border-zinc-800 shrink-0">
          <AppointmentsDayStrip
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            barberId={selectedBarberId}
          />
          <div className="p-2 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <select
              value={selectedBarberId}
              onChange={(e) => setSelectedBarberId(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none shrink-0"
            >
              <option value="">Todos (Barberos)</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id}>{b.fullName}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none shrink-0"
            >
              <option value="">Todos (Estados)</option>
              <option value="PENDING_REVIEW">Pendientes</option>
              <option value="CONFIRMED">Confirmados</option>
              <option value="IN_PROGRESS">En Curso</option>
              <option value="COMPLETED">Completados</option>
              <option value="NO_SHOW">No Shows</option>
              <option value="CANCELLED">Cancelados</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-zinc-500">Cargando turnos...</div>
        ) : (
          <div className="flex-1 flex flex-col min-w-0 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <AgendaListView 
              appointments={appointments} 
              onAppointmentClick={setSelectedAppointment}
            />
          </div>
        )}
      </div>

      {selectedAppointment && (
        <AppointmentDetailPanel
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}
