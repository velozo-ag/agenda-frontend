import React, { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useClients } from '../../hooks/useClients';

export function ClientSearchInput({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: response } = useClients();
  const clients = response?.data || [];

  const results = query
    ? clients.filter(c => c.fullName.toLowerCase().includes(query.toLowerCase()) || (c.email && c.email.toLowerCase().includes(query.toLowerCase())) || (c.phone && c.phone.includes(query)))
    : clients;

  const handleSelect = (client) => {
    onChange(client);
    setQuery(client.fullName);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    const newClient = {
      id: null,
      fullName: query || 'Cliente Nuevo',
      email: '',
      phone: '',
      noshowCount: 0
    };
    onChange(newClient);
    setQuery(newClient.fullName);
    setIsOpen(false);
  };

  useEffect(() => {
    if (value) {
      setQuery(value.fullName || value.name || '');
    }
  }, [value]);

  if (value) {
    return (
      <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-xs">
            {(value.fullName || value.name || 'C').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-100">{value.fullName || value.name}</div>
            <div className="text-xs text-zinc-400">{value.email || value.phone || 'Cliente asignado'}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { onChange(null); setQuery(''); }}
          className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          Cambiar
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 h-11 text-zinc-100 focus:outline-none focus:border-amber-500/50"
          placeholder="Buscar cliente por nombre, email o teléfono..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden max-h-60 flex flex-col">
          <div className="overflow-y-auto max-h-48">
            {results.length > 0 ? (
              results.map(client => (
                <div
                  key={client.id}
                  onClick={() => handleSelect(client)}
                  className="px-4 py-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800/50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-100">{client.fullName}</span>
                    {client.noshowCount >= 2 && (
                      <span title="Alerta de inasistencias" className="text-xs">⚠️</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {client.email || 'Sin email'} • {client.phone || 'Sin teléfono'}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-zinc-500 text-sm">
                No se encontraron clientes guardados.
              </div>
            )}
          </div>
          
          <div className="p-2 bg-zinc-950 border-t border-zinc-800 shrink-0">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 text-sm text-amber-500 hover:text-amber-400 font-medium py-2 rounded-lg hover:bg-amber-500/10 transition-colors"
              onClick={handleCreateNew}
            >
              <UserPlus className="w-4 h-4" />
              Usar "{query || 'Nuevo'}" como cliente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
