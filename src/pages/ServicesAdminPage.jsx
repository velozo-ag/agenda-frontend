import React, { useState } from 'react';
import { useSalonServices } from '../hooks/useSalonServices';
import { Plus, GripVertical, Settings2, Power, Scissors } from 'lucide-react';
import CategoryFormModal from '../components/services/CategoryFormModal';
import ServiceFormModal from '../components/services/ServiceFormModal';

export default function ServicesAdminPage() {
  const { categories: allCategories, isLoading, toggleService } = useSalonServices(true);
  const categories = allCategories.filter(cat => cat.active !== false);
  
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [targetCategoryId, setTargetCategoryId] = useState(null);

  if (isLoading) return <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">Cargando catálogo...</div>;

  const handleEditCategory = (cat) => {
    setSelectedCategory(cat);
    setCategoryModalOpen(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setServiceModalOpen(true);
  };

  const handleNewService = (categoryId) => {
    setTargetCategoryId(categoryId);
    setSelectedService(null);
    setServiceModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Header - Clean Text, No Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Scissors className="w-5 h-5 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Servicios</h1>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
            Gestioná los cortes, precios y duraciones. Organizalos en categorías para que tus clientes puedan reservar fácilmente.
          </p>
        </div>
        
        <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full md:w-auto mt-4 md:mt-0">
          <button
            onClick={() => { setSelectedCategory(null); setCategoryModalOpen(true); }}
            className="flex-1 sm:flex-none bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700/60 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            Nueva Categoría
          </button>
          <button
            onClick={() => handleNewService(null)}
            className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nuevo Servicio
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden group/cat transition-colors hover:border-zinc-300 dark:hover:border-zinc-700/50 shadow-sm">
            <div className="bg-zinc-50/80 dark:bg-zinc-900/80 p-4 sm:p-5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-move text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors hidden sm:block">
                  <GripVertical className="w-5 h-5" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">{cat.name}</h2>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => handleNewService(cat.id)}
                  className="text-[10px] sm:text-xs font-bold text-zinc-950 bg-amber-500 hover:bg-amber-400 px-2 sm:px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-[0.98] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">Servicio</span>
                </button>
                <button
                  onClick={() => handleEditCategory(cat)}
                  className="p-2 text-zinc-400 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  title="Editar Categoría"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
              {cat.services?.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-3">
                    <Scissors className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                  </div>
                  No hay servicios en esta categoría.
                </div>
              ) : (
                cat.services?.map((srv) => (
                  <div key={srv.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${!srv.active ? 'opacity-50 grayscale' : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30'}`}>
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                        {srv.imageUrl ? (
                          <img src={srv.imageUrl} alt={srv.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-700 bg-zinc-100 dark:bg-zinc-900/50">
                            <Scissors className="w-6 h-6 opacity-50" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-zinc-900 dark:text-zinc-100 font-bold text-lg">{srv.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border border-zinc-200/80 dark:border-transparent font-mono text-xs font-bold">
                            ${Number(srv.price).toLocaleString()}
                          </span>
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-transparent text-xs font-medium">
                            {srv.durationMinutes} min
                          </span>
                          {srv.depositAmount > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-wider">
                              Seña: ${Number(srv.depositAmount).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {srv.description && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-1 max-w-md">{srv.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => toggleService.mutate(srv.id)}
                        className={`p-2.5 rounded-xl transition-colors cursor-pointer ${srv.active ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20' : 'text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
                        title={srv.active ? 'Desactivar Servicio' : 'Activar Servicio'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditService(srv)}
                        className="p-2.5 text-zinc-400 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                        title="Editar Servicio"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Comenzá creando tu primer servicio</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-sm mx-auto text-sm">
              Agrupá tus cortes, arreglos de barba y tratamientos en categorías para organizarlos en el portal de reservas.
            </p>
            <button
              onClick={() => { setSelectedCategory(null); setCategoryModalOpen(true); }}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Crear mi primera categoría
            </button>
          </div>
        )}
      </div>

      <CategoryFormModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setCategoryModalOpen(false)} 
        categoryToEdit={selectedCategory} 
      />

      <ServiceFormModal 
        isOpen={isServiceModalOpen} 
        onClose={() => setServiceModalOpen(false)} 
        serviceToEdit={selectedService} 
        categoryId={targetCategoryId || selectedService?.categoryId}
        categories={categories}
      />
    </div>
  );
}
