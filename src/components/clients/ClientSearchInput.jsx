import React, { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';

export function ClientSearchInput({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Mocked clients
  const mockClients = [
    { id: 1, fullName: 'Juan Perez', email: 'juan@example.com', phone: '1165432100', noshowCount: 0 },
    { id: 2, fullName: 'Maria Gomez', email: 'maria@example.com', phone: '1122334455', noshowCount: 3 }, // Alert
    { id: 3, fullName: 'Carlos Lopez', email: 'carlos@example.com', phone: '1199887766', noshowCount: 1 },
  ];

  const results = query
    ? mockClients.filter(c => c.fullName.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()))
    : mockClients;

  const handleSelect = (client) => {
    onChange(client);
    setQuery(client.fullName);
    setIsOpen(false);
  };

  useEffect(() => {
    if (value) {
      setQuery(value.fullName);
    }
  }, [value]);

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
            if (value && e.target.value !== value.fullName) {
              onChange(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
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
                  {client.email} • {client.phone}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-zinc-500 text-sm">
              No se encontraron clientes.
            </div>
          )}
          
          <div className="p-2 bg-zinc-950 border-t border-zinc-800">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 text-sm text-amber-500 hover:text-amber-400 font-medium py-2 rounded-lg hover:bg-amber-500/10 transition-colors"
              onClick={() => alert('Abrir modal de crear cliente')}
            >
              <UserPlus className="w-4 h-4" />
              Crear nuevo cliente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
