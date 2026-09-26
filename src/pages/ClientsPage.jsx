import React, { useState } from 'react';
import { Search, UserPlus, Eye, Users, Loader2, Phone, AlertTriangle, ShieldAlert } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-zinc-950 p-2 md:p-4 gap-2 md:gap-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900 border border-zinc-800 p-4 rounded-xl shrink-0 gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Directorio de Clientes
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gestioná el historial, inasistencias y preferencias de tus clientes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Buscar por nombre, email o teléfono..."
            />
          </div>

          <button
            onClick={() => setIsClientFormOpen(true)}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 h-10 px-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/80 text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[11px]">Cliente</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[11px]">Teléfono</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[11px] text-center">Visitas</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[11px] text-center">No-Shows</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[11px]">Última Visita</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wider text-[11px] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan="6">
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-500 gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                      <span>Cargando clientes...</span>
                    </div>
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-500 gap-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Search className="w-6 h-6 text-zinc-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-zinc-300">No se encontraron clientes</div>
                        <div className="text-xs mt-1">Intentá buscar con otro término o agregá un cliente nuevo.</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map(client => {
                  const initials = client.fullName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                  return (
                    <tr key={client.id} className="hover:bg-zinc-800/40 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-100 flex items-center gap-2">
                              {client.fullName}
                              {client.requireDepositOverride && (
                                <span title="Se requiere seña para reservar" className="flex items-center gap-1 text-[9px] bg-rose-500/10 border border-rose-500/30 text-rose-500 px-1.5 py-0.5 rounded uppercase font-black tracking-wider">
                                  <ShieldAlert className="w-3 h-3" /> Seña
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-500 mt-0.5">{client.email || 'Sin email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {client.phone ? (
                          <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs group/phone">
                            {client.phone}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const cleanPhone = client.phone.replace(/\D/g, '');
                                const phoneE164 = cleanPhone.startsWith('549') ? cleanPhone : (cleanPhone.startsWith('54') ? cleanPhone.replace('54', '549') : '549' + cleanPhone);
                                window.open(`https://wa.me/${phoneE164}`, '_blank');
                              }}
                              className="opacity-0 group-hover/phone:opacity-100 p-1 text-emerald-500 hover:bg-emerald-500/10 rounded transition-all"
                              title="Enviar WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-600 text-xs italic">Sin teléfono</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 bg-zinc-800 rounded-md text-xs font-bold font-mono text-zinc-300">
                          {client.totalVisits}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        {client.noshowCount > 0 ? (
                          <div className="inline-flex items-center justify-center gap-1 px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-md text-xs font-bold font-mono">
                            <AlertTriangle className="w-3 h-3" />
                            {client.noshowCount}
                          </div>
                        ) : (
                          <span className="text-zinc-600 font-mono text-xs">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-zinc-400">
                        {client.lastVisitAt ? new Date(client.lastVisitAt).toLocaleDateString('es-AR') : '-'}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => navigate(`/clients/${client.id}`)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Perfil
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isClientFormOpen && (
        <ClientFormModal onClose={() => setIsClientFormOpen(false)} />
      )}
    </div>
  );
}
