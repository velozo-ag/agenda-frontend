import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateClient, useUpdateClient } from '../../hooks/useClients';

export function ClientFormModal({ onClose, client = null }) {
  const [fullName, setFullName] = useState(client?.fullName || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [email, setEmail] = useState(client?.email || '');
  const [notes, setNotes] = useState(client?.notes || '');

  const { mutate: createClient, isPending: isCreating } = useCreateClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();

  const isPending = isCreating || isUpdating;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName) return;

    const payload = { fullName, phone, email, notes };

    if (client) {
      updateClient(
        { id: client.id, ...payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createClient(payload, { onSuccess: () => onClose() });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">{client ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 h-11 text-zinc-100 focus:outline-none focus:border-amber-500/50"
              placeholder="Ej: Juan Perez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Teléfono</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 h-11 text-zinc-100 focus:outline-none focus:border-amber-500/50"
              placeholder="Ej: 1122334455"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 h-11 text-zinc-100 focus:outline-none focus:border-amber-500/50"
              placeholder="Ej: juan@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Notas (Opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 min-h-[80px] resize-none focus:outline-none focus:border-amber-500/50"
              placeholder="Ej: Prefiere corte a tijera..."
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium rounded-lg transition-colors">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={!fullName || isPending}
              className="flex-1 h-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
