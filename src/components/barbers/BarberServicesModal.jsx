import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useBarbers } from '../../hooks/useBarbers';
import { useSalonServices } from '../../hooks/useSalonServices';

export default function BarberServicesModal({ isOpen, onClose, barber }) {
  const { setBarberServices } = useBarbers();
  const { categories } = useSalonServices();
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    if (barber?.serviceIds) {
      setSelectedIds(new Set(barber.serviceIds));
    } else {
      setSelectedIds(new Set());
    }
  }, [barber, isOpen]);

  if (!isOpen || !barber) return null;

  const handleToggle = (serviceId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  };

  const handleSave = () => {
    setBarberServices.mutate(
      { id: barber.id, serviceIds: Array.from(selectedIds) },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Servicios Asignados</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{barber.fullName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {categories.map(cat => (
            <div key={cat.id} className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{cat.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.services?.map(srv => {
                  const isSelected = selectedIds.has(srv.id);
                  return (
                    <button
                      key={srv.id}
                      onClick={() => handleToggle(srv.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-500/10 text-violet-700 dark:text-white' 
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-violet-600 dark:bg-violet-500 border-violet-600 dark:border-violet-500' : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="flex-1 truncate">
                        <p className={`text-sm font-medium ${isSelected ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                          {srv.name}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {srv.durationMinutes} min • ${Number(srv.price).toLocaleString()}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No hay servicios en el catálogo.</div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 flex-shrink-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{selectedIds.size} seleccionados</span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={setBarberServices.isPending}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {setBarberServices.isPending ? 'Guardando...' : 'Guardar Servicios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
