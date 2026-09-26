import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, LayoutList } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { WeeklyCalendar } from '../components/agenda/WeeklyCalendar';
import { DayView } from '../components/agenda/DayView';
import { AgendaListView } from '../components/agenda/AgendaListView';
import { AppointmentDetailPanel } from '../components/agenda/AppointmentDetailPanel';
import { AppointmentFormModal } from '../components/agenda/AppointmentFormModal';
import { AppointmentsDayStrip } from '../components/agenda/AppointmentsDayStrip';

export function AgendaPage() {
  const [view, setView] = useState(() => window.innerWidth < 1024 ? 'day' : 'week'); // default to 'day' on mobile/tablet
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [clickedSlotDate, setClickedSlotDate] = useState(null);

  const startOfWeek = new Date(selectedDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0,0,0,0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23,59,59,999);

  const from = view === 'week' || view === 'list' ? startOfWeek.toISOString() : new Date(new Date(selectedDate).setHours(0,0,0,0)).toISOString();
  const to = view === 'week' || view === 'list' ? endOfWeek.toISOString() : new Date(new Date(selectedDate).setHours(23,59,59,999)).toISOString();

  const { data: appointmentsData } = useAppointments({
    fromDate: from.split('T')[0],
    toDate: to.split('T')[0],
    barberId: selectedBarberId || undefined,
  });

  const { barbers } = useBarbers();

  const appointments = appointmentsData?.data || appointmentsData || [];

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

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleSlotClick = (slotDate) => {
    setClickedSlotDate(slotDate);
    setIsFormOpen(true);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-2 md:p-4 gap-2 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-zinc-900 border border-zinc-800 p-3 sm:p-4 rounded-xl shrink-0 shadow-sm gap-4">
        <div className="flex items-center gap-2 sm:gap-4 w-full xl:w-auto justify-between xl:justify-start">
          <div className="flex items-center gap-2">
            <button onClick={handleToday} className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold border border-zinc-700/50 bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-700 hover:border-zinc-600 rounded-lg transition-colors shadow-sm">
              Hoy
            </button>
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button onClick={handlePrev} className="p-1 sm:p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button onClick={handleNext} className="p-1 sm:p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
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
            <h2 className="hidden md:block text-zinc-100 font-bold text-sm sm:text-xl tracking-tight capitalize truncate max-w-[150px] sm:max-w-none text-right xl:text-left">
              {view === 'day' 
                ? selectedDate.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' })
                : `${startOfWeek.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} - ${endOfWeek.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}`
              }
            </h2>
          </div>
        </div>

        <div className="flex items-center justify-between w-full xl:w-auto gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
          <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800 shadow-inner shrink-0">
            <button 
              onClick={() => setView('day')}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${view === 'day' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Día
            </button>
            <button 
              onClick={() => setView('week')}
              className={`hidden lg:block px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${view === 'week' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setView('list')}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${view === 'list' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Lista
            </button>
          </div>

          <div className="hidden sm:block w-px h-8 bg-zinc-800 mx-1 shrink-0"></div>

          <select
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50 appearance-none min-w-[120px] sm:min-w-[160px] cursor-pointer hover:border-zinc-700 transition-colors shrink-0"
          >
            <option value="">Todos los barberos</option>
            {barbers.map(b => (
              <option key={b.id} value={b.id}>{b.fullName}</option>
            ))}
          </select>

          <button
            onClick={() => { setClickedSlotDate(null); setIsFormOpen(true); }}
            className="flex items-center gap-1.5 sm:gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Cita</span>
            <span className="sm:hidden">Cita</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col relative">
        {view === 'list' ? (
          <AgendaListView
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : view === 'week' ? (
          <WeeklyCalendar 
            appointments={appointments} 
            selectedDate={selectedDate} 
            barberId={selectedBarberId}
            onSlotClick={handleSlotClick}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : (
          <DayView
            appointments={appointments}
            selectedDate={selectedDate}
            onSlotClick={handleSlotClick}
            onAppointmentClick={handleAppointmentClick}
          />
        )}
      </div>

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
    </div>
  );
}
