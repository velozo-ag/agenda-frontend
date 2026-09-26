import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  Loader2, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Hourglass,
  CalendarX,
  Sparkles
} from 'lucide-react';
import { useSearchAppointments } from '../../hooks/useBooking';

export function ClientAppointmentsModal({ 
  isOpen, 
  onClose, 
  slug, 
  salonName, 
  initialQuery = '',
  currentAppointmentToken = null,
  onSelectAppointment = null
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(() => initialQuery || (typeof window !== 'undefined' ? sessionStorage.getItem('roosty_last_client_query') || '' : ''));
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);
  
  const { mutate: searchAppointments, isPending, error } = useSearchAppointments(slug);

  const handleSelectAppointment = (selectedAppt) => {
    if (currentAppointmentToken && selectedAppt.token === currentAppointmentToken) {
      if (typeof onClose === 'function') onClose();
      return;
    }
    if (onSelectAppointment) {
      onSelectAppointment(selectedAppt);
    } else {
      if (typeof onClose === 'function') {
        onClose(true);
      }
      navigate(`/book/status?token=${selectedAppt.token}&slug=${slug || selectedAppt.tenantSlug || 'admin'}`);
    }
  };

  // Auto-search if query is provided or remembered
  React.useEffect(() => {
    if (isOpen) {
      const q = (initialQuery || query || (typeof window !== 'undefined' ? sessionStorage.getItem('roosty_last_client_query') || '' : '')).trim();
      if (q && q.length >= 3) {
        setQuery(q);
        searchAppointments(q, {
          onSuccess: (res) => {
            const items = Array.isArray(res)
              ? res
              : (Array.isArray(res?.data)
                  ? res.data
                  : (Array.isArray(res?.data?.data)
                      ? res.data.data
                      : []));
            setResults(items);
            setHasSearched(true);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('roosty_last_client_query', q);
            }
          },
          onError: () => {
            setResults([]);
            setHasSearched(true);
          }
        });
      }
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery || cleanQuery.length < 3) return;

    searchAppointments(cleanQuery, {
      onSuccess: (res) => {
        const items = Array.isArray(res)
          ? res
          : (Array.isArray(res?.data)
              ? res.data
              : (Array.isArray(res?.data?.data)
                  ? res.data.data
                  : []));
        setResults(items);
        setHasSearched(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('roosty_last_client_query', cleanQuery);
        }
      },
      onError: () => {
        setResults([]);
        setHasSearched(true);
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Confirmado
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Hourglass className="w-3 h-3" /> Pendiente
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <CalendarX className="w-3 h-3" /> Cancelado
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
            ✓ Finalizado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
            {status}
          </span>
        );
    }
  };

  const formatApptDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('es-AR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden text-zinc-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Consultar mis Turnos</h2>
              <p className="text-xs text-zinc-400">
                {salonName || 'Roosty Agenda'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="pt-5 pb-3 shrink-0">
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            Ingresá tu correo electrónico, teléfono o nombre
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ej: juan@gmail.com, 1155443322 o Juan Pérez"
                className="w-full pl-10 pr-9 py-3 bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    setHasSearched(false);
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('roosty_last_client_query');
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5 cursor-pointer"
                  title="Borrar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending || query.trim().length < 3}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-zinc-950 font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Buscar'
              )}
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Mostraremos los turnos agendados en este local con esos datos.
          </p>
        </form>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto pt-2 space-y-3 pr-1">
          {isPending && (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <Loader2 className="w-7 h-7 text-amber-500 animate-spin" />
              <span className="text-xs">Buscando tus reservas...</span>
            </div>
          )}

          {!isPending && hasSearched && results.length === 0 && (
            <div className="py-10 text-center flex flex-col items-center justify-center p-6 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-zinc-500 mb-2" />
              <div className="text-sm font-semibold text-zinc-300">No encontramos reservas</div>
              <p className="text-xs text-zinc-500 max-w-xs mt-1">
                No hay turnos registrados con ese correo, teléfono o nombre en este salón.
              </p>
            </div>
          )}

          {!isPending && results.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between px-1">
                <span>Turnos encontrados ({results.length})</span>
                <span className="text-[11px] text-zinc-500">Tocá para gestionar</span>
              </div>

              {results.map((apptItem) => {
                const isCurrent = Boolean(currentAppointmentToken && apptItem.token === currentAppointmentToken);
                return (
                  <div
                    key={apptItem.id || apptItem.token}
                    onClick={() => handleSelectAppointment(apptItem)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 group ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30'
                        : 'bg-zinc-950 border-zinc-800/90 hover:border-amber-500/50 hover:bg-zinc-950/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-sm transition-colors flex items-center gap-2 ${
                        isCurrent ? 'text-amber-400' : 'text-zinc-100 group-hover:text-amber-400'
                      }`}>
                        <Scissors className="w-3.5 h-3.5 text-amber-500" />
                        {apptItem.serviceNameSnapshot || 'Corte de Cabello'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Viendo ahora
                          </span>
                        )}
                        {getStatusBadge(apptItem.status)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-500/80" />
                        {formatApptDate(apptItem.startTime)}
                      </span>
                      {apptItem.priceSnapshot && (
                        <span className="font-mono text-zinc-200 font-semibold">
                          $ {Number(apptItem.priceSnapshot).toLocaleString('es-AR')}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-amber-400 font-semibold">
                      <span>{isCurrent ? 'Estás viendo este turno' : 'Ver estado / Gestionar turno'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!hasSearched && !isPending && (
            <div className="py-8 text-center text-zinc-500 text-xs">
              Ingresá tu correo, teléfono o nombre para recuperar tu turno, ver el comprobante de la seña, cancelar o reprogramar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
