import React, { useState, useEffect, useRef } from 'react';
import { Search, UserPlus, Check, X } from 'lucide-react';
import { useClients } from '../../hooks/useClients';

export function ClientSearchInput({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const { data: response, isLoading } = useClients();
  
  // Safely extract clients array regardless of Spring pagination format
  const rawList = response?.data?.content || response?.data || response?.content || response || [];
  const clients = Array.isArray(rawList) ? rawList : [];

  const trimmedQuery = query.trim().toLowerCase();
  const results = trimmedQuery
    ? clients.filter(c => {
        const name = (c.fullName || c.name || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        return name.includes(trimmedQuery) || email.includes(trimmedQuery) || phone.includes(trimmedQuery);
      })
    : clients;

  const handleSelect = (client) => {
    onChange(client);
    setQuery(client.fullName || client.name || '');
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    const newClient = {
      id: null,
      fullName: query.trim() || 'Cliente Nuevo',
      email: '',
      phone: '',
      noshowCount: 0
    };
    onChange(newClient);
    setQuery(newClient.fullName);
    setIsOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setQuery(value.fullName || value.name || '');
    }
  }, [value]);

  if (value) {
    return (
      <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center text-sm shrink-0">
            {(value.fullName || value.name || 'C').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
              <span>{value.fullName || value.name}</span>
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {value.phone ? `${value.phone} • ` : ''}{value.email || 'Cliente seleccionado'}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { onChange(null); setQuery(''); }}
          className="text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0 ml-2"
        >
          Cambiar
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
        <input
          type="text"
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-9 h-11 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all shadow-xs"
          placeholder="Buscar por nombre, teléfono o email..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden max-h-64 flex flex-col animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="overflow-y-auto max-h-52 divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-zinc-400">Cargando clientes...</div>
            ) : results.length > 0 ? (
              results.map(client => (
                <div
                  key={client.id || client.email || client.phone}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(client);
                  }}
                  onClick={() => handleSelect(client)}
                  className="px-4 py-2.5 hover:bg-amber-50/60 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                        {client.fullName || client.name}
                      </span>
                      {client.noshowCount >= 2 && (
                        <span title="Alerta de inasistencias" className="text-[10px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded font-bold">
                          ⚠️ No-Show
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {client.phone || 'Sin teléfono'} {client.email ? `• ${client.email}` : ''}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    Elegir →
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-zinc-400 dark:text-zinc-500 text-xs">
                No se encontraron clientes guardados con ese criterio.
              </div>
            )}
          </div>
          
          <div className="p-2 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleCreateNew();
              }}
              onClick={handleCreateNew}
              className="w-full flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/15 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Usar "{query.trim() || 'Nuevo'}" como cliente rápido</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
