import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Check, User } from 'lucide-react';
import { useSalonServices } from '../../hooks/useSalonServices';
import { useBarbers } from '../../hooks/useBarbers';
import { useMyTenant } from '../../hooks/useTenantBranding';

export default function ServiceFormModal({ isOpen, onClose, serviceToEdit, categoryId, categories }) {
  const { data: tenant } = useMyTenant();
  const { createService, updateService } = useSalonServices();
  const { barbers } = useBarbers();
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    durationMinutes: 30,
    bufferMinutes: 0,
    depositAmount: 0,
    imageUrl: ''
  });
  const [selectedBarberIds, setSelectedBarberIds] = useState([]);

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
    setTimeout(onClose, 200); // match transition duration
  };

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        categoryId: serviceToEdit.categoryId,
        name: serviceToEdit.name,
        description: serviceToEdit.description || '',
        price: serviceToEdit.price,
        durationMinutes: serviceToEdit.durationMinutes,
        bufferMinutes: serviceToEdit.bufferMinutes,
        depositAmount: serviceToEdit.depositAmount || 0,
        imageUrl: serviceToEdit.imageUrl || ''
      });
      setSelectedBarberIds(serviceToEdit.barberIds || []);
    } else {
      setFormData({
        categoryId: categoryId || (categories?.length > 0 ? categories[0].id : ''),
        name: '',
        description: '',
        price: '',
        durationMinutes: 30,
        bufferMinutes: 0,
        depositAmount: 0,
        imageUrl: ''
      });
      setSelectedBarberIds([]);
    }
  }, [serviceToEdit, categoryId, categories, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      categoryId: parseInt(formData.categoryId, 10),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      durationMinutes: parseInt(formData.durationMinutes, 10),
      bufferMinutes: parseInt(formData.bufferMinutes, 10),
      depositAmount: parseFloat(formData.depositAmount),
      imageUrl: formData.imageUrl,
      barberIds: selectedBarberIds
    };

    if (serviceToEdit) {
      updateService.mutate({ id: serviceToEdit.id, data }, {
        onSuccess: () => handleClose()
      });
    } else {
      createService.mutate(data, {
        onSuccess: () => handleClose()
      });
    }
  };

  const isSlideOpen = isVisible && !isClosing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-zinc-900/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${isSlideOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={handleClose} 
      />
      
      <div className={`relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-200 ease-out ${isSlideOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 flex-shrink-0">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            {serviceToEdit ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <button onClick={handleClose} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800">
          <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Main Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Nombre del Servicio</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium"
                    placeholder="Ej. Corte Fade"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Categoría</label>
                  <select
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all font-medium appearance-none"
                  >
                    <option value="" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Seleccionar...</option>
                    {categories?.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Precio ($)</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all font-mono font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider mb-2">
                      Seña ($)
                      {tenant?.hasDeposit === false && (
                        <span className="ml-2 text-[10px] text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">Plan Superior</span>
                      )}
                    </label>
                    <input
                      type="number"
                      name="depositAmount"
                      min="0"
                      step="0.01"
                      value={formData.depositAmount}
                      onChange={handleChange}
                      disabled={tenant?.hasDeposit === false}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all font-mono font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Timing & Media */}
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Duración</label>
                    <select
                      name="durationMinutes"
                      required
                      value={formData.durationMinutes}
                      onChange={handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all font-medium appearance-none"
                    >
                      {[15, 30, 45, 60, 75, 90, 120, 150, 180].map(min => (
                        <option key={min} value={min} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{min} min</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Limpieza</label>
                    <select
                      name="bufferMinutes"
                      required
                      value={formData.bufferMinutes}
                      onChange={handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all font-medium appearance-none"
                    >
                      {[0, 5, 10, 15, 30].map(min => (
                        <option key={min} value={min} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{min} min</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Imagen (Opcional)</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all text-sm mb-3 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  />
                  
                  <div className="w-full h-32 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-xl overflow-hidden flex items-center justify-center relative group">
                    {formData.imageUrl ? (
                      <>
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-zinc-400 dark:text-zinc-600 flex flex-col items-center gap-2">
                        <ImageIcon className="w-6 h-6 opacity-50" />
                        <span className="text-xs font-medium">Vista Previa</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Descripción (Opcional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all resize-none text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                placeholder="Detalles sobre qué incluye el servicio para que lo vean tus clientes..."
              />
            </div>

            {barbers && barbers.length > 1 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
                    Profesionales que realizan este servicio ({selectedBarberIds.length === 0 ? 'Todos' : `${selectedBarberIds.length}/${barbers.length}`})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedBarberIds.length === barbers.length) {
                        setSelectedBarberIds([]);
                      } else {
                        setSelectedBarberIds(barbers.map(b => b.id));
                      }
                    }}
                    className="text-[11px] text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 font-semibold cursor-pointer"
                  >
                    {selectedBarberIds.length === barbers.length ? 'Desmarcar todos' : 'Marcar todos'}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl max-h-40 overflow-y-auto">
                  {barbers.map(b => {
                    const isSelected = selectedBarberIds.length === 0 || selectedBarberIds.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          if (selectedBarberIds.length === 0) {
                            setSelectedBarberIds([b.id]);
                          } else if (selectedBarberIds.includes(b.id)) {
                            const next = selectedBarberIds.filter(id => id !== b.id);
                            setSelectedBarberIds(next);
                          } else {
                            setSelectedBarberIds([...selectedBarberIds, b.id]);
                          }
                        }}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500/50 bg-amber-500/10 text-zinc-900 dark:text-white'
                            : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium truncate">{b.fullName}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                  Por defecto, si no seleccionás ninguno específico, todos los profesionales del staff estarán habilitados para realizar este servicio.
                </p>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-transparent transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="service-form"
            disabled={createService.isPending || updateService.isPending}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {createService.isPending || updateService.isPending ? 'Guardando...' : 'Guardar Servicio'}
          </button>
        </div>
      </div>
    </div>
  );
}
