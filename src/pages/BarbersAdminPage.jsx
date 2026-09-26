import React, { useState } from 'react';
import { useBarbers } from '../hooks/useBarbers';
import { useTenantPlan } from '../hooks/useTenantBranding';
import { Plus, Settings2, Power, Scissors, Sparkles } from 'lucide-react';
import BarberFormModal from '../components/barbers/BarberFormModal';
import BarberServicesModal from '../components/barbers/BarberServicesModal';

export default function BarbersAdminPage() {
  const { barbers, isLoading, toggleBarber } = useBarbers();
  const { isSoloBarber, maxBarbers, planType } = useTenantPlan();
  
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  
  const [isServicesOpen, setServicesOpen] = useState(false);

  if (isLoading) return <div className="p-8 text-center text-zinc-500">Cargando barberos...</div>;

  const isLimitReached = isSoloBarber && barbers.length >= (maxBarbers || 1);

  const handleEdit = (barber) => {
    setSelectedBarber(barber);
    setFormOpen(true);
  };

  const handleServices = (barber) => {
    setSelectedBarber(barber);
    setServicesOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Staff de Barberos</h1>
          <p className="text-zinc-400 mt-1">Administra los barberos y los servicios que ofrecen.</p>
        </div>
        <button
          onClick={() => { setSelectedBarber(null); setFormOpen(true); }}
          disabled={isLimitReached}
          title={isLimitReached ? `Límite de ${maxBarbers || 1} barbero alcanzado para tu plan` : 'Agregar barbero'}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            isLimitReached
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-500/20 cursor-pointer'
          }`}
        >
          <Plus className="w-4 h-4" />
          Nuevo Barbero
        </button>
      </div>

      {isLimitReached && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white text-sm">Límite de staff alcanzado ({maxBarbers || 1} barbero)</div>
            <p className="mt-1 text-zinc-300 leading-relaxed">
              Tu plan actual ({planType === 'CERO' ? 'Plan Cero' : 'Plan Navaja'}) permite 1 solo barbero. Para sumar múltiples barberos en tu local y que tus clientes elijan con quién cortarse, pasate al <strong>Plan Crew ($24.900/mes)</strong>.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map((barber) => (
          <div key={barber.id} className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all ${!barber.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-inner"
                  style={{ backgroundColor: barber.color || '#3b82f6' }}
                >
                  {barber.avatarUrl ? (
                    <img src={barber.avatarUrl} alt={barber.fullName} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    barber.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{barber.fullName}</h3>
                  <p className="text-sm text-zinc-400">{barber.email}</p>
                </div>
              </div>
              <button
                onClick={() => toggleBarber.mutate(barber.id)}
                className={`p-2 rounded-lg transition-colors ${barber.active ? 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20' : 'text-zinc-500 bg-zinc-800 hover:bg-zinc-700'}`}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-zinc-300 line-clamp-2 mb-6 min-h-[40px]">
              {barber.bio || 'Sin descripción'}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
              <button
                onClick={() => handleServices(barber)}
                className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <Scissors className="w-4 h-4" />
                {barber.serviceIds?.length || 0} Servicios
              </button>
              
              <button
                onClick={() => handleEdit(barber)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BarberFormModal 
        isOpen={isFormOpen} 
        onClose={() => setFormOpen(false)} 
        barberToEdit={selectedBarber} 
      />

      <BarberServicesModal 
        isOpen={isServicesOpen} 
        onClose={() => setServicesOpen(false)} 
        barber={selectedBarber} 
      />
    </div>
  );
}
