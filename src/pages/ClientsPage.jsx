import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Users,
  Loader2,
  Phone,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../hooks/useClients';
import { ClientFormModal } from '../components/clients/ClientFormModal';

function useDebounceLocal(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounceLocal(searchTerm, 300);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);

  const { data: clientsData, isLoading } = useClients({ query: debouncedSearch });
  const clients = clientsData?.data?.content || clientsData?.data || [];

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-3 md:p-5 gap-4 animate-in fade-in duration-300">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-lg font-black text-zinc-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            Clientes
          </h1>
          <p className="text-[11px] text-zinc-600 font-mono mt-0.5 ml-10">
            Historial, inasistencias y preferencias
          </p>
        </div>

        <button
          onClick={() => setIsClientFormOpen(true)}
          className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 h-10 px-4 rounded-xl font-black text-xs transition-all shadow-sm active:scale-[0.98] shrink-0 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Nuevo Cliente
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative shrink-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          placeholder="Buscar por nombre, email o teléfono..."
        />
      </div>

      {/* ── Flat List ── */}
      <div className="flex-1 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl overflow-hidden flex flex-col">

        {/* Desktop: column headers */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] px-5 py-3 border-b border-zinc-800/50 bg-zinc-950/40 shrink-0">
          {['Cliente', 'Teléfono', 'Visitas', 'No-Shows', 'Última visita', ''].map((h) => (
            <span key={h} className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">
              {h}
            </span>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
              <span className="text-xs font-mono">Cargando clientes...</span>
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800/60 border border-zinc-800 flex items-center justify-center">
                <Search className="w-6 h-6 text-zinc-700" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-zinc-500">Sin resultados</div>
                <div className="text-xs text-zinc-700 mt-1">
                  {searchTerm ? 'Intentá con otro término de búsqueda' : 'Aún no hay clientes cargados'}
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/40">
              {clients.map((client) => {
                const initials = client.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                const hasRisk = client.noshowCount > 0;

                return (
                  <button
                    key={client.id}
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors text-left group cursor-pointer"
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 border ${
                        hasRisk
                          ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {initials}
                    </div>

                    {/* Name + email */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-zinc-100 truncate">
                          {client.fullName}
                        </span>
                        {client.requireDepositOverride && (
                          <span
                            title="Requiere seña"
                            className="hidden sm:flex items-center gap-1 text-[9px] bg-rose-500/10 border border-rose-500/25 text-rose-400 px-1.5 py-0.5 rounded-md uppercase font-black tracking-wider shrink-0"
                          >
                            <ShieldAlert className="w-2.5 h-2.5" />
                            Seña
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-600 font-mono truncate mt-0.5">
                        {client.email || 'Sin email'}
                      </div>
                    </div>

                    {/* Desktop: teléfono */}
                    <div className="hidden md:flex items-center gap-1.5 text-zinc-500 font-mono text-xs min-w-[120px]">
                      {client.phone ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            const clean = client.phone.replace(/\D/g, '');
                            const e164 = clean.startsWith('549')
                              ? clean
                              : clean.startsWith('54')
                              ? clean.replace('54', '549')
                              : '549' + clean;
                            window.open(`https://wa.me/${e164}`, '_blank');
                          }}
                          title="WhatsApp"
                          className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <Phone className="w-3 h-3" />
                          {client.phone}
                        </span>
                      ) : (
                        <span className="text-zinc-800 italic text-[11px]">—</span>
                      )}
                    </div>

                    {/* Desktop: visitas */}
                    <div className="hidden md:flex justify-center min-w-[60px]">
                      <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 bg-zinc-800/80 rounded-lg text-xs font-bold font-mono text-zinc-300 border border-zinc-700/50">
                        {client.totalVisits ?? 0}
                      </span>
                    </div>

                    {/* Desktop: no-shows */}
                    <div className="hidden md:flex justify-center min-w-[60px]">
                      {client.noshowCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-bold font-mono">
                          <AlertTriangle className="w-3 h-3" />
                          {client.noshowCount}
                        </span>
                      ) : (
                        <span className="text-zinc-700 font-mono text-xs">—</span>
                      )}
                    </div>

                    {/* Desktop: última visita */}
                    <div className="hidden md:flex items-center gap-1 font-mono text-xs text-zinc-600 min-w-[90px]">
                      {client.lastVisitAt ? (
                        <>
                          <Calendar className="w-3 h-3 shrink-0" />
                          {new Date(client.lastVisitAt).toLocaleDateString('es-AR')}
                        </>
                      ) : (
                        <span className="text-zinc-800">—</span>
                      )}
                    </div>

                    {/* Mobile: compact stats */}
                    <div className="flex md:hidden items-center gap-2 shrink-0">
                      {client.totalVisits > 0 && (
                        <span className="text-[10px] font-mono text-zinc-600">
                          {client.totalVisits}v
                        </span>
                      )}
                      {client.noshowCount > 0 && (
                        <span className="text-[10px] font-bold font-mono text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-md">
                          {client.noshowCount}✗
                        </span>
                      )}
                    </div>

                    {/* Nav arrow */}
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 shrink-0 transition-colors" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer count */}
        {clients.length > 0 && (
          <div className="px-5 py-2.5 border-t border-zinc-800/40 text-[10px] text-zinc-700 font-mono shrink-0">
            {clients.length} cliente{clients.length !== 1 ? 's' : ''} encontrado{clients.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {isClientFormOpen && (
        <ClientFormModal onClose={() => setIsClientFormOpen(false)} />
      )}
    </div>
  );
}
