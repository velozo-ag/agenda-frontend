import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, EyeOff, Eye, Clock } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { useWaitlist } from '../hooks/useWaitlist';
import { WeeklyCalendar } from '../components/agenda/WeeklyCalendar';
import { DayView } from '../components/agenda/DayView';
import { AgendaListView } from '../components/agenda/AgendaListView';
import { AppointmentDetailPanel } from '../components/agenda/AppointmentDetailPanel';
import { AppointmentFormModal } from '../components/agenda/AppointmentFormModal';
import { AppointmentsDayStrip } from '../components/agenda/AppointmentsDayStrip';

export function AgendaPage() {
  const navigate = useNavigate();
  const [view, setView] = useState(() => window.innerWidth < 1024 ? 'day' : 'week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [clickedSlotDate, setClickedSlotDate] = useState(null);
  const [showCancelled, setShowCancelled] = useState(false);

  const startOfWeek = new Date(selectedDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const from =
    view === 'week' || view === 'list'
      ? startOfWeek.toISOString()
      : new Date(new Date(selectedDate).setHours(0, 0, 0, 0)).toISOString();
  const to =
    view === 'week' || view === 'list'
      ? endOfWeek.toISOString()
      : new Date(new Date(selectedDate).setHours(23, 59, 59, 999)).toISOString();

  const { data: appointmentsData } = useAppointments({
    fromDate: from.split('T')[0],
    toDate: to.split('T')[0],
    barberId: selectedBarberId || undefined,
  });

  const { barbers } = useBarbers();
  const { data: waitlistData } = useWaitlist({});
  const waitlist = waitlistData?.data?.content || waitlistData?.data || [];
  const activeWaitlistCount = Array.isArray(waitlist) ? waitlist.filter(w => !w.notified).length : 0;

  const allAppointments = appointmentsData?.data || appointmentsData || [];
  const appointments = showCancelled
    ? allAppointments
    : allAppointments.filter(a => a.status !== 'CANCELLED' && a.status !== 'NO_SHOW');

  
  // If multi-barber and 'Todos' is selected, force 'day' view instead of 'week'
  React.useEffect(() => {
    if (view === 'week' && barbers.length > 1 && !selectedBarberId) {
      setView('day');
    }
  }, [view, barbers.length, selectedBarberId]);
  
  const handlePrev = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - (view === 'day' ? 1 : 7));
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (view === 'day' ? 1 : 7));
    setSelectedDate(newDate);
  };

  const handleToday = () => setSelectedDate(new Date());

  const handleSlotClick = (slotDate) => {
    setClickedSlotDate(slotDate);
    setIsFormOpen(true);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const dateLabel =
    view === 'day'
      ? selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' })
      : `${startOfWeek.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} – ${endOfWeek.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}`;

  return (
    <div className="flex flex-col bg-zinc-950 p-2 md:p-4 gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>

      {/* ── Top Bar ── */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-zinc-900/80 border border-zinc-800/70 backdrop-blur-md px-3 sm:px-4 py-3 rounded-2xl shrink-0 shadow-sm gap-3">

        {/* Left: Nav + date */}
        <div className="flex items-center gap-2 sm:gap-3 w-full xl:w-auto justify-between xl:justify-start">
          <div className="flex items-center gap-2">
            {/* Today button */}
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-bold border border-zinc-700/60 bg-zinc-800/60 text-zinc-300 hover:text-white hover:bg-zinc-700 hover:border-zinc-600 rounded-xl transition-all cursor-pointer"
            >
              Hoy
            </button>
            {/* Prev / Next */}
            <div className="flex items-center bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
              <button
                onClick={handlePrev}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-zinc-800" />
              <button
                onClick={handleNext}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Date label + mobile day strip */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-hidden">
            <div className="md:hidden w-full overflow-hidden">
              <AppointmentsDayStrip
                selectedDate={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`}
                onChange={(iso) => {
                  const parts = iso.split('-');
                  setSelectedDate(new Date(parts[0], parts[1] - 1, parts[2]));
                }}
                barberId={selectedBarberId}
              />
            </div>
            <h2 className="hidden md:block text-zinc-100 font-black text-sm sm:text-lg tracking-tight capitalize truncate max-w-[160px] sm:max-w-none text-right xl:text-left">
              {dateLabel}
            </h2>
          </div>
        </div>

        {/* Right: View switcher + filters + CTA */}
        <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto scrollbar-none">

          {/* View switcher */}
          <div className="flex bg-zinc-950 rounded-xl p-1 border border-zinc-800 shadow-inner shrink-0">
            {[
              { id: 'day', label: 'Día' },
              { id: 'week', label: 'Semana', hideOnMobile: true },
              { id: 'list', label: 'Lista' },
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setView(v.id)} disabled={v.id === 'week' && barbers.length > 1 && !selectedBarberId}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  v.hideOnMobile ? 'hidden lg:block' : ''
                } ${
                  view === v.id
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px h-6 bg-zinc-800 shrink-0" />

          {/* Toggle cancelled */}
          <button
            onClick={() => setShowCancelled(v => !v)}
            title={showCancelled ? 'Ocultar cancelados' : 'Mostrar cancelados'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer ${
              showCancelled
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/15'
                : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
            }`}
          >
            {showCancelled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showCancelled ? 'Cancelados' : 'Cancelados'}</span>
          </button>

          {/* Waitlist pill if any active */}
          {activeWaitlistCount > 0 && (
            <button
              onClick={() => navigate('/admin/waitlist')}
              title={`${activeWaitlistCount} cliente(s) en lista de espera`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 active:scale-95 animate-pulse"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Espera ({activeWaitlistCount})</span>
            </button>
          )}

          <div className="hidden sm:block w-px h-6 bg-zinc-800 shrink-0" />

          {/* Barber filter */}
          <select
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/40 appearance-none min-w-[120px] cursor-pointer hover:border-zinc-700 transition-colors shrink-0"
          >
            <option value="">Todos</option>
            {barbers.map(b => (
              <option key={b.id} value={b.id}>{b.fullName}</option>
            ))}
          </select>

          {/* Nueva Cita — desktop */}
          <button
            onClick={() => { setClickedSlotDate(null); setIsFormOpen(true); }}
            className="hidden sm:flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 rounded-xl font-black text-xs transition-all cursor-pointer shadow-sm shadow-amber-500/20 shrink-0 active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" />
            Nueva Cita
          </button>
        </div>
      </div>

      {/* ── Calendar / List content ── */}
      <div className="flex-1 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl overflow-hidden flex flex-col relative">
        {view === 'list' ? (
          <AgendaListView appointments={appointments} onAppointmentClick={handleAppointmentClick} />
        ) : view === 'week' ? (
          <WeeklyCalendar
              appointments={appointments}
              selectedDate={selectedDate}
              barbers={barbers}
              barberId={selectedBarberId}
              onSlotClick={handleSlotClick}
              onAppointmentClick={handleAppointmentClick}
            />
        ) : (
          <DayView
            appointments={appointments}
            selectedDate={selectedDate}
            barbers={barbers}
            selectedBarberId={selectedBarberId}
            onSlotClick={handleSlotClick}
            onAppointmentClick={handleAppointmentClick}
          />
        )}
      </div>

      {/* Modals */}
      {isFormOpen && (
        <AppointmentFormModal
          onClose={() => setIsFormOpen(false)}
          defaultDate={clickedSlotDate}
          defaultBarberId={selectedBarberId}
        />
      )}

      {selectedAppointment && (
        <AppointmentDetailPanel
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {/* FAB — Nueva Cita (mobile) */}
      <button
        onClick={() => { setClickedSlotDate(null); setIsFormOpen(true); }}
        className="sm:hidden fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-amber-500 border border-amber-400/30 flex items-center justify-center shadow-xl shadow-amber-500/30 hover:bg-amber-400 transition-all cursor-pointer active:scale-95"
        title="Nueva Cita"
      >
        <Plus className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
      </button>
    </div>
  );
}
