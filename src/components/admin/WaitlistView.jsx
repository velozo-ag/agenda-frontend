import React, { useState } from 'react';
import { useWaitlist, useRemoveFromWaitlist } from '../../hooks/useWaitlist';
import { useMyTenant } from '../../hooks/useTenantBranding';
import { AppointmentFormModal } from '../agenda/AppointmentFormModal';
import { 
  Loader2, 
  Trash2, 
  MessageCircle, 
  CalendarPlus, 
  Search, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';

export function WaitlistView() {
  const { data: waitlistData, isLoading } = useWaitlist({});
  const { mutate: remove, isPending: isRemoving } = useRemoveFromWaitlist();
  const { data: tenant } = useMyTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'waiting' | 'notified'
  const [assigningEntry, setAssigningEntry] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  const rawWaitlist = waitlistData?.data?.content || waitlistData?.data || [];
  const waitlist = Array.isArray(rawWaitlist) ? rawWaitlist : [];

  // Metrics
  const waitingCount = waitlist.filter(e => !e.notified).length;
  const notifiedCount = waitlist.filter(e => e.notified).length;
  const totalCount = waitlist.length;

  // Filtered entries
  const filteredEntries = waitlist.filter(entry => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (entry.clientName && entry.clientName.toLowerCase().includes(q)) ||
      (entry.clientEmail && entry.clientEmail.toLowerCase().includes(q)) ||
      (entry.clientPhone && entry.clientPhone.includes(q)) ||
      (entry.serviceName && entry.serviceName.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (statusFilter === 'waiting') return !entry.notified;
    if (statusFilter === 'notified') return !!entry.notified;
    return true;
  });

  const handleWhatsApp = (entry) => {
    if (!entry.clientPhone) return;
    const cleanPhone = entry.clientPhone.replace(/\D/g, '');
    const phoneE164 = cleanPhone.startsWith('549') 
      ? cleanPhone 
      : (cleanPhone.startsWith('54') ? cleanPhone.replace('54', '549') : '549' + cleanPhone);

    const tenantName = tenant?.storeName || tenant?.name || 'la barbería';
    const prefDate = entry.preferredDate ? new Date(entry.preferredDate).toLocaleDateString('es-AR') : '';
    const serviceInfo = entry.serviceName ? ` para ${entry.serviceName}` : '';

    const msg = `Hola ${entry.clientName}! Te escribimos de ${tenantName}. Vimos que te anotaste en la lista de espera${serviceInfo}${prefDate ? ` para el ${prefDate}` : ''}. ¿Te gustaría que te coordinemos un turno disponible?`;

    window.open(`https://wa.me/${phoneE164}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAppointmentSuccess = (entry) => {
    remove(entry.id);
    setSuccessToast(`¡Turno asignado a ${entry.clientName} en estado A Confirmar! Se le notificó por correo.`);
    setTimeout(() => setSuccessToast(null), 5000);
    setAssigningEntry(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Success Feedback Alert ─── */}
      {successToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-zinc-900/70 border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">En Espera</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{waitingCount}</div>
            <div className="text-xs text-zinc-500 mt-0.5">Aguardando turno</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Oferta Enviada</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">{notifiedCount}</div>
            <div className="text-xs text-zinc-500 mt-0.5">Notificados por cancelación</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Total en Lista</div>
            <div className="text-2xl font-black text-zinc-100 mt-1">{totalCount}</div>
            <div className="text-xs text-zinc-500 mt-0.5">Clientes registrados</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ─── Main Panel: Search, Filter & Table ─── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
        {/* Toolbar */}
        <div className="p-3 sm:p-4 border-b border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/40">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, email, servicio o teléfono..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Todos ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('waiting')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'waiting'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Esperando ({waitingCount})
            </button>
            <button
              onClick={() => setStatusFilter('notified')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'notified'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Notificados ({notifiedCount})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/60 text-zinc-500 border-b border-zinc-800 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-4 py-3.5">Cliente</th>
                <th className="px-4 py-3.5">Contacto</th>
                <th className="px-4 py-3.5">Servicio</th>
                <th className="px-4 py-3.5">Barbero Pref.</th>
                <th className="px-4 py-3.5">Fecha Pref.</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-400 mb-2" />
                    <span className="text-xs text-zinc-500">Cargando lista de espera...</span>
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-500 mx-auto mb-3">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-200">No hay clientes en esta vista</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                      {searchQuery
                        ? 'No se encontraron resultados para los filtros aplicados.'
                        : 'Cuando los clientes elijan una fecha sin disponibilidad en el portal público, aparecerán aquí.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-800/40 transition-colors">
                    {/* Cliente */}
                    <td className="px-4 py-3.5 font-bold text-zinc-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-xs font-black text-amber-400 shrink-0">
                          {entry.clientName?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <span className="truncate max-w-[150px] sm:max-w-none">{entry.clientName}</span>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-xs text-zinc-300">{entry.clientPhone || 'Sin teléfono'}</div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-[160px]">{entry.clientEmail}</div>
                    </td>

                    {/* Servicio */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700/50 text-xs font-medium text-zinc-200">
                        {entry.serviceName || 'Cualquier servicio'}
                      </span>
                    </td>

                    {/* Barbero */}
                    <td className="px-4 py-3.5 text-xs text-zinc-300">
                      {entry.barberName ? (
                        <span className="font-medium text-zinc-200">{entry.barberName}</span>
                      ) : (
                        <span className="text-zinc-500 italic">Cualquiera</span>
                      )}
                    </td>

                    {/* Fecha Pref. */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>
                          {entry.preferredDate 
                            ? new Date(entry.preferredDate).toLocaleDateString('es-AR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })
                            : 'Cualquiera'}
                        </span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3.5">
                      {entry.notified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase font-black bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          Oferta enviada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase font-black bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          En espera
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Botón Asignar Turno */}
                        <button
                          onClick={() => setAssigningEntry(entry)}
                          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                          title="Asignar turno y enviar confirmación por email"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                          <span>Asignar Turno</span>
                        </button>

                        {/* WhatsApp */}
                        {entry.clientPhone && (
                          <button
                            onClick={() => handleWhatsApp(entry)}
                            className="p-2 text-emerald-400 hover:text-emerald-300 rounded-xl hover:bg-emerald-500/20 transition-colors inline-flex cursor-pointer border border-transparent hover:border-emerald-500/30"
                            title="Contactar por WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Eliminar */}
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Seguro que deseas eliminar a ${entry.clientName} de la lista de espera?`)) {
                              remove(entry.id);
                            }
                          }}
                          disabled={isRemoving}
                          className="p-2 text-zinc-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/20 transition-colors inline-flex disabled:opacity-50 cursor-pointer"
                          title="Eliminar de la lista"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal Asignar Turno (Reutiliza AppointmentFormModal con auto-fill y estado A Confirmar) ─── */}
      {assigningEntry && (
        <AppointmentFormModal
          onClose={() => setAssigningEntry(null)}
          defaultClient={{
            id: assigningEntry.clientId || null,
            fullName: assigningEntry.clientName,
            email: assigningEntry.clientEmail,
            phone: assigningEntry.clientPhone,
          }}
          defaultServiceId={assigningEntry.serviceId}
          defaultBarberId={assigningEntry.barberId}
          defaultDate={assigningEntry.preferredDate}
          defaultStatus="PENDING_REVIEW"
          onSuccess={() => handleAppointmentSuccess(assigningEntry)}
        />
      )}
    </div>
  );
}
