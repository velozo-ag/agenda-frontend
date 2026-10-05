import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Settings,
  Users,
  Palette,
  ChevronRight,
  Calendar,
  Bell,
  CreditCard,
  Scissors,
} from 'lucide-react';
import BarbersAdminPage from './BarbersAdminPage';
import { UsersAdminPage } from './UsersAdminPage';
import SchedulesAdminPage from './SchedulesAdminPage';
import { TenantBrandingSettingsView } from '../components/admin/TenantBrandingSettingsView';
import { TenantBookingSettingsView } from '../components/admin/TenantBookingSettingsView';
import { useTenantPlan } from '../hooks/useTenantBranding';

const SETTINGS_TABS = [
  {
    id: 'branding',
    name: 'Identidad & Portal',
    description: 'Logo, colores y datos del salón',
    icon: Palette,
  },
  {
    id: 'agenda',
    name: 'Turnos',
    description: 'Slots, cancelaciones y reprogramaciones',
    icon: Calendar,
  },
  {
    id: 'notifications',
    name: 'Alertas',
    description: 'Alertas de inasistencia (no-show)',
    icon: Bell,
  },
  {
    id: 'payments',
    name: 'Señas & Pagos',
    description: 'CBU/Alias para señas de reservas',
    icon: CreditCard,
  },
  {
    id: 'barbers',
    name: 'Barberos',
    description: 'Comisiones y perfiles',
    icon: Scissors,
  },
  {
    id: 'users',
    name: 'Staff (Admins)',
    description: 'Gestión de equipo y roles',
    icon: Users,
  },
  {
    id: 'schedules',
    name: 'Horarios',
    description: 'Días, horarios y ausencias',
    icon: Calendar,
  },
];

export function AdminSettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'branding';
  const { planType } = useTenantPlan();

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const getPlanName = (type) => {
    if (type === 'CERO' || type === 'FREE') return 'Plan Cero';
    if (type === 'NAVAJA' || type === 'STARTER' || type === 'SOLO_BARBER') return 'Plan Navaja';
    if (type === 'CREW' || type === 'PRO_SALON' || type === 'BARBER_CREW') return 'Plan Crew';
    return type || 'Admin';
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col select-none animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ─── Header ─── */}
      <div className="mb-6 pb-4 border-b border-zinc-800/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center shrink-0">
          <Settings className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-base font-bold text-zinc-100 flex items-center gap-2 flex-wrap">
            <span>Configuración</span>
            <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px] font-mono font-semibold">
              {getPlanName(planType)}
            </span>
          </h1>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
            Identidad, agenda, pagos y equipo de tu barbería
          </p>
        </div>
      </div>

      {/* ─── Layout: Sidebar + Content ─── */}
      <div className="flex-1 flex flex-col md:flex-row gap-5 min-h-0">

        {/* ─── Sidebar navigation ─── */}
        <nav className="md:w-52 lg:w-56 shrink-0">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono px-1 mb-2 hidden md:block">
            Módulos
          </p>

          <div
            className="
              flex md:flex-col gap-1
              overflow-x-auto md:overflow-visible
              pb-1 md:pb-0
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
            "
          >
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    shrink-0 md:shrink md:w-full text-left
                    flex items-center gap-2.5
                    px-3 py-2.5 rounded-xl border
                    transition-all duration-150 cursor-pointer
                    ${active
                      ? 'bg-indigo-500/10 border-indigo-500/30 shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-zinc-900/60 hover:border-zinc-800/50'}
                  `}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-900 text-zinc-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="hidden md:block min-w-0 flex-1">
                    <div className={`text-xs font-semibold truncate leading-tight ${active ? 'text-indigo-300' : 'text-zinc-400'}`}>
                      {tab.name}
                    </div>
                    <div className="text-[10px] text-zinc-600 truncate font-mono leading-tight mt-0.5">
                      {tab.description}
                    </div>
                  </div>

                  <span className={`text-xs font-medium md:hidden whitespace-nowrap ${active ? 'text-indigo-300' : 'text-zinc-400'}`}>
                    {tab.name}
                  </span>

                  <ChevronRight className={`w-3 h-3 shrink-0 ml-auto hidden md:block transition-colors ${
                    active ? 'text-indigo-500' : 'text-zinc-700'
                  }`} />
                </button>
              );
            })}
          </div>
        </nav>

        {/* ─── Content area ─── */}
        <div className="flex-1 overflow-hidden flex flex-col min-w-0">
          {activeTab === 'branding' && <TenantBrandingSettingsView />}

          {(activeTab === 'agenda' || activeTab === 'notifications' || activeTab === 'payments') && (
            <TenantBookingSettingsView section={activeTab} />
          )}

          {activeTab === 'barbers' && <BarbersAdminPage />}
          {activeTab === 'users' && <UsersAdminPage />}
          {activeTab === 'schedules' && <SchedulesAdminPage />}
        </div>
      </div>
    </div>
  );
}
