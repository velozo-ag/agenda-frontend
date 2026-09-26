import React from 'react';
import { useWaitlist, useRemoveFromWaitlist } from '../../hooks/useWaitlist';
import { Loader2, Trash2 } from 'lucide-react';

export function WaitlistView() {
  const { data: waitlistData, isLoading } = useWaitlist({});
  const { mutate: remove, isPending: isRemoving } = useRemoveFromWaitlist();

  const waitlist = waitlistData?.data?.content || waitlistData?.data || [];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
        <h2 className="text-lg font-bold text-zinc-100">Lista de Espera</h2>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-950/50 text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Servicio</th>
              <th className="px-4 py-3 font-medium">Barbero Pref.</th>
              <th className="px-4 py-3 font-medium">Fecha Pref.</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {isLoading ? (
              <tr><td colSpan="7" className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
            ) : waitlist.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8">La lista de espera está vacía.</td></tr>
            ) : (
              waitlist.map(entry => (
                <tr key={entry.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-100">{entry.clientName}</td>
                  <td className="px-4 py-3">
                    <div>{entry.clientPhone || '-'}</div>
                    <div className="text-xs text-zinc-500">{entry.clientEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-200">{entry.serviceName}</td>
                  <td className="px-4 py-3 text-zinc-300">{entry.barberName || 'Cualquiera'}</td>
                  <td className="px-4 py-3 font-mono">{new Date(entry.preferredDate).toLocaleDateString('es-AR')}</td>
                  <td className="px-4 py-3">
                    {entry.notified ? (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-500 border border-amber-500/40">Notificado</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">Esperando</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm('¿Seguro que deseas eliminar a este cliente de la lista de espera?')) {
                          remove(entry.id);
                        }
                      }}
                      disabled={isRemoving}
                      className="p-2 text-rose-500 hover:text-white rounded-lg hover:bg-rose-500/20 transition-colors inline-flex disabled:opacity-50"
                      title="Eliminar de la lista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
