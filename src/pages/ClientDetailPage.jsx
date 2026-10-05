import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Calendar, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Scissors, 
  User, 
  Loader2,
  Mail
} from 'lucide-react';
import { useClientHistory, useSetRequireDeposit, useUpdateClient, useResetNoShowCount } from '../hooks/useClients';
import { useMyTenant } from '../hooks/useTenantBranding';
import { ClientFormModal } from '../components/clients/ClientFormModal';

const statusConfig = {
  PENDING_REVIEW: { label: 'Pendiente', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  IN_PROGRESS: { label: 'En Sillón', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  COMPLETED: { label: 'Cobrado', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  NO_SHOW: { label: 'No-Show', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  CANCELLED: { label: 'Cancelado', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
};

export function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [hasNotesChanged, setHasNotesChanged] = useState(false);

  const { data: response, isLoading } = useClientHistory(id);
  const { mutate: setRequireDeposit, isPending: isSettingDeposit } = useSetRequireDeposit();
  const { mutate: updateClient, isPending: isUpdatingClient } = useUpdateClient();
  const { mutate: resetNoShows, isPending: isResettingNoShows } = useResetNoShowCount();
  const { data: tenant } = useMyTenant();

  const client = response?.data?.client;
  const history = response?.data?.appointments?.content || [];

  useEffect(() => {
    if (client) {
      setNotes(client.notes || '');
      setHasNotesChanged(false);
    }
  }, [client]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    setHasNotesChanged(true);
  };

  const handleNotesBlur = () => {
    if (client && notes !== (client.notes || '')) {
      updateClient({ 
        id: client.id, 
        fullName: client.fullName,
        phone: client.phone,
        email: client.email,
        notes 
      }, {
        onSuccess: () => setHasNotesChanged(false)
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-medium">Cargando perfil del cliente...</span>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-zinc-950 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-zinc-600" />
        </div>
        <h2 className="text-lg font-bold text-zinc-200">Cliente no encontrado</h2>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mb-6">
          El cliente que intentás consultar no existe o fue eliminado del directorio.
        </p>
        <button
          onClick={() => navigate('/clients')}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-sm font-bold transition-colors"
        >
          Volver al Directorio
        </button>
      </div>
    );
  }

  const cleanPhone = client.phone ? client.phone.replace(/\D/g, '') : '';
  const handleWhatsApp = () => {
    if (!cleanPhone) return;
    const msg = encodeURIComponent(`¡Hola ${client.fullName}! Te escribimos de ${tenant?.name || 'la barbería'}.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const completedAppointments = history.filter(a => a.status === 'COMPLETED').length;

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-3 sm:p-4 lg:p-6 gap-4 sm:gap-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── Top Header / Hero ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/clients')}
            className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title="Volver a Clientes"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-black shrink-0 shadow-inner">
            {client.fullName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
                {client.fullName}
              </h1>
              
              {client.noshowCount >= (tenant?.noshowAlertThreshold || 2) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/15 border border-rose-500/30 text-rose-400">
                  <AlertTriangle className="w-3 h-3" />
                  Alerta No-Show ({client.noshowCount})
                </span>
              )}

              {client.requireDepositOverride && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <ShieldAlert className="w-3 h-3" />
                  Seña Obligatoria
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1.5 font-medium">
              {client.phone ? (
                <span className="flex items-center gap-1.5 font-mono text-zinc-300">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  {client.phone}
                </span>
              ) : (
                <span className="text-zinc-600">Sin teléfono</span>
              )}
              <span className="text-zinc-700">•</span>
              {client.email ? (
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  {client.email}
                </span>
              ) : (
                <span className="text-zinc-600">Sin email</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          {cleanPhone && (
            <>
              <button
                onClick={handleWhatsApp}
                className="flex-1 md:flex-none h-10 px-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Escribir por WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
              <a
                href={`tel:${cleanPhone}`}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                title="Llamar"
              >
                <Phone className="w-4 h-4" />
              </a>
            </>
          )}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-[0.98]"
          >
            <Edit className="w-4 h-4" />
            Editar Datos
          </button>
        </div>
      </div>

      {/* ── Metrics Grid (4 KPIs) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Reservas</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-zinc-100">
            {client.totalVisits || 0}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Atendidas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            {completedAppointments}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Inasistencias</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              client.noshowCount > 0 ? 'bg-rose-500/15 text-rose-400' : 'bg-zinc-800/80 text-zinc-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className={`text-2xl sm:text-3xl font-black font-mono ${
              client.noshowCount > 0 ? 'text-rose-500' : 'text-zinc-100'
            }`}>
              {client.noshowCount || 0}
            </div>
            {client.noshowCount > 0 && (
              <button
                type="button"
                disabled={isResettingNoShows}
                onClick={() => {
                  if (window.confirm('¿Deseas perdonar las ausencias y reiniciar el contador a 0?')) {
                    resetNoShows(client.id);
                  }
                }}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer transition-colors"
              >
                Perdonar / 0
              </button>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Última Visita</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-zinc-200 truncate">
            {client.lastVisitAt ? new Date(client.lastVisitAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Primera vez'}
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1">
        
        {/* Left Column: Settings & Notes */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          
          {/* Deposit Policy Toggle Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Política de Seña Personalizada</h3>
                <p className="text-[11px] text-zinc-400">Configuración especial de reservas</p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Al activar esta opción, el cliente estará obligado a abonar seña previa para cualquier servicio que reserve en el portal, incluso si el servicio no lo requiere por defecto.
            </p>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200">
                Exigir seña obligatoria
              </span>
              <button
                type="button"
                disabled={isSettingDeposit}
                onClick={() => setRequireDeposit({ 
                  id: client.id, 
                  requireDepositOverride: !client.requireDepositOverride 
                })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  client.requireDepositOverride ? 'bg-amber-500' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                    client.requireDepositOverride ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Internal Notes Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-zinc-100">Ficha Técnica & Notas</h3>
              </div>
              {isUpdatingClient ? (
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                  <Loader2 className="w-3 h-3 animate-spin" /> Guardando...
                </span>
              ) : hasNotesChanged ? (
                <span className="text-[10px] text-zinc-500 italic">Sin guardar</span>
              ) : (
                <span className="text-[10px] text-zinc-500">Guardado automático</span>
              )}
            </div>

            <textarea
              value={notes}
              onChange={handleNotesChange}
              onBlur={handleNotesBlur}
              rows={6}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-200 leading-relaxed outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 resize-none transition-all placeholder:text-zinc-600 font-sans"
              placeholder="Anotá preferencias del cliente, detalles del corte, productos recomendados o indicaciones para el staff..."
            />
            <p className="text-[11px] text-zinc-500">
              Las notas son 100% privadas y solo visibles para los barberos y administradores.
            </p>
          </div>
        </div>

        {/* Right Column: Appointment History Table */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-500" />
                Historial de Citas
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Registro cronológico de turnos tomados por este cliente
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold text-zinc-300">
              {history.length} citas
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs sm:text-sm text-zinc-400">
              <thead className="bg-zinc-950/80 text-zinc-500 border-b border-zinc-800 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 sm:px-5 py-3.5">Fecha & Hora</th>
                  <th className="px-4 sm:px-5 py-3.5">Servicio</th>
                  <th className="px-4 sm:px-5 py-3.5">Barbero</th>
                  <th className="px-4 sm:px-5 py-3.5 text-right">Monto</th>
                  <th className="px-4 sm:px-5 py-3.5 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="py-16 text-center text-zinc-500 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-1">
                          <Scissors className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-300">Sin historial registrado</span>
                        <span className="text-xs text-zinc-500">Este cliente todavía no ha completado citas en el salón.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map(appt => {
                    const statusInfo = statusConfig[appt.status] || { label: appt.status, color: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
                    return (
                      <tr key={appt.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 sm:px-5 py-4 whitespace-nowrap">
                          <div className="font-bold text-zinc-200">
                            {new Date(appt.startTime).toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' })}
                          </div>
                          <div className="text-xs font-mono text-zinc-500 mt-0.5">
                            {new Date(appt.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                          </div>
                        </td>
                        <td className="px-4 sm:px-5 py-4">
                          <div className="font-semibold text-zinc-200">{appt.serviceName || appt.serviceNameSnapshot}</div>
                          {appt.durationMinutes && (
                            <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{appt.durationMinutes} min</div>
                          )}
                        </td>
                        <td className="px-4 sm:px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-zinc-300 font-medium">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                              {(appt.barberName || 'S').charAt(0).toUpperCase()}
                            </div>
                            <span>{appt.barberName || 'Sin asignar'}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-5 py-4 text-right font-mono font-bold text-zinc-200 whitespace-nowrap">
                          ${Number(appt.price || appt.priceSnapshot || 0).toLocaleString('es-AR')}
                        </td>
                        <td className="px-4 sm:px-5 py-4 text-right whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <ClientFormModal client={client} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
}

export default ClientDetailPage;
