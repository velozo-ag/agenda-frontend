import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSalonServices } from '../../hooks/useSalonServices';

export default function CategoryFormModal({ isOpen, onClose, categoryToEdit }) {
  const { createCategory, updateCategory, deleteCategory } = useSalonServices();
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(timer);
    } else {
      setIsVisible(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setDisplayOrder(categoryToEdit.displayOrder || 0);
    } else {
      setName('');
      setDisplayOrder(0);
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, displayOrder: parseInt(displayOrder, 10) };
    if (categoryToEdit) {
      updateCategory.mutate({ id: categoryToEdit.id, data }, {
        onSuccess: () => handleClose()
      });
    } else {
      createCategory.mutate(data, {
        onSuccess: () => handleClose()
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm('¿Eliminar esta categoría? Solo si no tiene servicios activos.')) {
      deleteCategory.mutate(categoryToEdit.id, {
        onSuccess: () => handleClose()
      });
    }
  };

  const isSlideOpen = isVisible && !isClosing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${isSlideOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={handleClose} 
      />
      
      <div className={`relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ease-out ${isSlideOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white">
            {categoryToEdit ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button onClick={handleClose} className="p-2 -mr-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Nombre</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-zinc-600 font-medium"
              placeholder="Ej. Cortes Clásicos"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Orden (0 es primero)</label>
            <input
              type="number"
              required
              min="0"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all font-mono font-medium"
            />
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            {categoryToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteCategory.isPending}
                className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                Eliminar
              </button>
            ) : <div/>}
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                {createCategory.isPending || updateCategory.isPending ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
