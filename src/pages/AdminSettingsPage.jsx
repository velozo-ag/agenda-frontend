import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Settings, 
  Users, 
  Palette,
  ChevronRight,
  Compass,
  Calendar,
  Bell,
  CreditCard
} from 'lucide-react';
import { UsersAdminPage } from './UsersAdminPage';
import SchedulesAdminPage from './SchedulesAdminPage';
import { TenantBrandingSettingsView } from '../components/admin/TenantBrandingSettingsView';
import { TenantBookingSettingsView } from '../components/admin/TenantBookingSettingsView';
import { useTenantPlan } from '../hooks/useTenantBranding';
// import { useOnboarding } from '../context/OnboardingContext';

const SETTINGS_TABS = [
  {
    id: 'branding',
    name: 'Identidad Visual & Portal',
    description: 'Logo, colores de marca y datos del salón',
    icon: Palette,
  },
  {
    id: 'agenda',
    name: 'Configuración de Turnos',
    description: 'Duración de slots, cancelaciones y reprogramaciones',
    icon: Calendar,
  },
  {
    id: 'notifications',
    name: 'Alertas & Notificaciones',
    description: 'Alertas de no-show y notificaciones',
    icon: Bell,
  },
  {
    id: 'payments',
    name: 'Pagos & Señas',
    description: 'Configuración de CBU/Alias para reserva de turnos',
    icon: CreditCard,
  },
  {
    id: 'users',
    name: 'Barberos & Staff',
    description: 'Gestión de roles y equipo',
    icon: Users,
  },
  {
    id: 'schedules',
    name: 'Horarios de Barberos',
    description: 'Configuración de días, horarios y ausencias',
    icon: Calendar,
  },
];

export function AdminSettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'branding';
  // const { openTour } = useOnboarding();
  const { planType } = useTenantPlan();

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const getPlanName = (type) => {
    if (type === 'CERO' || type === 'FREE') return 'PLAN CERO ($0)';
    if (type === 'NAVAJA' || type === 'STARTER' || type === 'SOLO_BARBER') return 'PLAN NAVAJA ($14.900/mes)';
    if (type === 'CREW' || type === 'PRO_SALON' || type === 'BARBER_CREW') return 'PLAN CREW ($24.900/mes)';
    return type || 'ADMIN';
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col select-none animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 flex items-center justify-center shadow-inner">
            <Settings className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>Panel de Configuración & Administración</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                {getPlanName(planType)}
              </span>
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Control centralizado de identidad, agenda, pagos y staff de la barbería
            </p>
          </div>
        </div>

        {/* Interactive Tour Modal Trigger */}
        <button
          type="button"
          className="btn-touch px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border self-start sm:self-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border-zinc-750 hover:border-amber-500/40 shadow-xs active:scale-95"
          title="Abrir la guía interactiva y tour del sistema"
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Guía Rápida del Sistema</span>
        </button>
      </div>

      {/* Main Grid: Sidebar + View Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-1.5">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-mono px-3 mb-2">
            Módulos de Configuración
          </div>

          <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer shrink-0 md:shrink border ${
                    isActive
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm'
                      : 'bg-zinc-900/40 border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-amber-400 text-zinc-950 font-bold'
                          : 'bg-zinc-850 text-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 hidden sm:block md:block">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {tab.name}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate leading-tight mt-0.5 font-mono">
                        {tab.description}
                      </div>
                    </div>
                    <span className="text-xs font-semibold sm:hidden">{tab.name}</span>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform hidden md:block ${
                      isActive ? 'text-amber-400 translate-x-0.5' : 'text-zinc-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active View Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-w-0">
          {activeTab === 'branding' && (
            <div className="h-full">
              <TenantBrandingSettingsView />
            </div>
          )}

          {(activeTab === 'agenda' || activeTab === 'notifications' || activeTab === 'payments') && (
            <div className="h-full">
              <TenantBookingSettingsView section={activeTab} />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="h-full">
              <UsersAdminPage />
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="h-full">
              <SchedulesAdminPage />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
