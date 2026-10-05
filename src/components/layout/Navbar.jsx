import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMyTenant } from '../../hooks/useTenantBranding';
import { useTenantUsage } from '../../hooks/useTenantUsage';
import {
  Calendar,
  ClipboardList,
  Users,
  Vault,
  BarChart2,
  Scissors,
  Settings,
  ShieldCheck,
  Clock,
  LogOut,
  ChevronDown,
  Maximize,
  Minimize,
  ExternalLink,
  Activity,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUrl';

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-zinc-500 pl-2.5 border-l border-zinc-800/80">
      <Clock className="w-3.5 h-3.5 text-zinc-600" />
      <span className="num-tabular font-bold text-zinc-300">{formattedTime}</span>
    </div>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN' || user?.username === 'superadmin';
  const isAdmin = user?.role === 'ADMIN' || isSuperAdmin;
  const { data: tenant } = useMyTenant({ enabled: !isSuperAdmin });
  const { data: usage } = useTenantUsage();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const userMenuRef = useRef(null);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentPath = location.pathname;

  const pct = usage?.maxAppointmentsMonth ? (usage.currentMonthAppointments / usage.maxAppointmentsMonth) * 100 : 0;
  
  let usageColorText = 'text-emerald-500';
  let usageColorBg = 'bg-emerald-500';
  let UsageIcon = Activity;
  
  if (pct >= 100) {
    usageColorText = 'text-red-500';
    usageColorBg = 'bg-red-500';
    UsageIcon = AlertCircle;
  } else if (pct >= 70) {
    usageColorText = 'text-amber-500';
    usageColorBg = 'bg-amber-500';
    UsageIcon = AlertTriangle;
  }

  const handleUsageClick = () => {
    toast((t) => (
      <div onClick={() => toast.dismiss(t.id)} className="cursor-pointer flex items-center gap-2 block w-full">
        <UsageIcon className={`w-4 h-4 ${usageColorText}`} />
        <span>Llevás {usage.currentMonthAppointments} de {usage.maxAppointmentsMonth} turnos este mes.</span>
      </div>
    ), { id: 'usage-toast' });
  };

  const handleNav = (path) => {
    setIsUserMenuOpen(false);
    navigate(path);
  };

  const homePath = isSuperAdmin ? '/superadmin' : '/agenda';

  const navItems = [
    { label: 'Agenda', path: '/agenda', icon: Calendar, publicStaff: true },
    { label: 'Turnos', path: '/appointments', icon: ClipboardList, publicStaff: true },
    { label: 'Clientes', path: '/clients', icon: Users, publicStaff: true },
    { label: 'Servicios', path: '/admin/services', icon: Scissors, adminOnly: true },
    { label: 'Ingresos', path: '/earnings', icon: Vault, publicStaff: true },
    { label: 'Dashboard', path: '/dashboard', icon: BarChart2, adminOnly: true },
  ];

  return (
    <>
      <header className="h-14 w-full max-w-full bg-zinc-950 border-b border-zinc-800/80 px-3 sm:px-4 flex items-center justify-between sticky top-0 z-40 select-none overflow-visible">
        {/* ─── Left: Dynamic Brand Logo & Status ─── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          {/* LOGO */}
          {tenant?.logoUrl && !logoFailed ? (
            <button
              onClick={() => handleNav(homePath)}
              className="h-8 max-w-[140px] flex items-center justify-center hover:opacity-90 transition-all active:scale-95 cursor-pointer shrink-0"
              title={tenant?.name || 'Roosty Agenda'}
            >
              <img
                src={getImageUrl(tenant.logoUrl)}
                alt={tenant.name || 'Logo'}
                className="h-8 w-auto max-h-8 object-contain"
                onError={() => setLogoFailed(true)}
              />
            </button>
          ) : (
            <button
              onClick={() => handleNav(homePath)}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 cursor-pointer shrink-0"
              title={tenant?.name || 'Roosty Agenda'}
            >
              <img
                src="/icon-R.png"
                alt="Roosty Logo"
                className="w-7 h-7 object-contain drop-shadow-sm"
              />
            </button>
          )}

          {/* MOBILE INFO (Store Name & Staff) - Takes advantage of the empty top space */}
          <div className="flex flex-col justify-center min-w-0 md:hidden ml-1">
            <span className="text-xs font-bold text-zinc-100 truncate w-full max-w-[130px]">
              {tenant?.storeName || tenant?.name || 'Roosty Agenda'}
            </span>
            <div className="flex items-center gap-1.5 mt-[1px]">
              <span className="text-[10px] text-[var(--primary-color,#818cf8)] font-medium truncate max-w-[70px]">
                {user?.fullName || user?.username || 'Staff'}
              </span>
              {usage?.maxAppointmentsMonth > 0 && !isSuperAdmin && (
                <button 
                  onClick={handleUsageClick}
                  className={`flex items-center gap-1.5 px-1.5 py-[2px] rounded-sm text-[9px] font-mono font-bold border cursor-pointer active:scale-95 transition-all ${
                  usage.limitReached 
                    ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}>
                  <div className="w-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${usageColorBg}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <span>{usage.currentMonthAppointments}/{usage.maxAppointmentsMonth}</span>
                </button>
              )}
            </div>
          </div>

          {/* Caja & Ingresos shortcut (Desktop Only) */}
          <button
            onClick={() => handleNav('/earnings')}
            className="btn-touch px-2.5 py-1 rounded-lg text-[11px] font-medium border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-850 hidden sm:flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ver Ingresos"
          >
            <Vault className="w-3.5 h-3.5 text-amber-500" />
            <span>Ingresos</span>
          </button>

          {/* Usage Badge (Desktop) */}
          {usage?.maxAppointmentsMonth > 0 && !isSuperAdmin && (
            <button 
              onClick={handleUsageClick}
              className="hidden xl:flex items-center gap-1.5 px-2.5 h-6 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer active:scale-95 transition-all" 
              title={`Turnos este mes: ${usage.currentMonthAppointments} / ${usage.maxAppointmentsMonth}`}
            >
              <div className="flex-1 w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${usageColorBg}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-zinc-400 font-mono">
                {usage.currentMonthAppointments}/{usage.maxAppointmentsMonth}
              </span>
            </button>
          )}

          {/* Live Clock (Desktop Only) */}
          <LiveClock />
        </div>

        {/* ─── Center: Main Navigation Segmented Control (Desktop Only) ─── */}
        <nav className="flex-1 hidden md:flex items-center justify-start lg:justify-center gap-0.5 sm:gap-1 bg-zinc-900/50 lg:bg-zinc-900 p-1 rounded-xl border-none lg:border lg:border-zinc-800 mx-1 lg:mx-2 overflow-x-auto scrollbar-none min-w-0">
          {navItems
            .filter((item) => (item.adminOnly ? isAdmin : true))
            .map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path !== '/' && currentPath.startsWith(item.path));

              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`btn-touch px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className={isActive ? 'block' : 'hidden lg:block'}>{item.label}</span>
                </button>
              );
            })}
        </nav>

        {/* ─── Right: Settings & User Profile ─── */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto md:ml-0">{isAdmin && (<button onClick={() => handleNav('/dashboard')} className="btn-touch p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors cursor-pointer shrink-0" title="Dashboard"><BarChart2 className="w-4 h-4" /></button>)}{/* Ver Portal Clientes shortcut - Moved here for mobile balance, muted color */}
          <a
            href={tenant?.slug ? `https://${tenant.slug}.agenda.roosty.site` : '/'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-touch px-2 py-1 rounded-lg text-[10px] font-medium border border-zinc-800/50 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Abrir Portal Público"
          >
            <span className="md:hidden">Portal</span>
            <span className="hidden md:inline">
              {tenant?.slug ? `${tenant.slug}.agenda.roosty.site` : 'Portal Público'}
            </span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          {/* SuperAdmin Link */}
          {isSuperAdmin && (
            <button
              onClick={() => handleNav('/superadmin')}
              className={`btn-touch px-2 py-1.5 rounded-xl text-xs font-bold items-center gap-1.5 transition-colors cursor-pointer border hidden lg:flex ${
                currentPath === '/superadmin'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
              }`}
              title="Panel Maestro Super-Admin"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>SuperAdmin</span>
            </button>
          )}

          {/* Quick Settings Icon */}
          {isAdmin && (
            <button
              onClick={() => handleNav('/admin/settings')}
              className={`btn-touch w-8 h-8 rounded-lg items-center justify-center transition-colors cursor-pointer hidden sm:flex ${
                currentPath.startsWith('/admin/settings')
                  ? 'text-zinc-100 bg-zinc-800 border border-zinc-700 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
              }`}
              title="Configuración del Salón"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* User Menu Dropdown */}
          <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`btn-touch flex items-center gap-2 pl-1.5 pr-1.5 md:pr-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
              isUserMenuOpen
                ? 'bg-zinc-850 border-zinc-700 text-zinc-100 shadow-xs'
                : 'bg-zinc-900/90 hover:bg-zinc-850 border-zinc-800 text-zinc-300'
            }`}
            title="Perfil de Usuario y Opciones"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-300 text-[10px] font-bold flex items-center justify-center border border-amber-500/30 font-mono shrink-0">
              {user?.username ? user.username.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <span className="text-xs font-semibold text-zinc-200 hidden md:inline max-w-[100px] truncate">
              {user?.fullName || user?.username || 'Usuario'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 hidden md:block ${
                isUserMenuOpen ? 'rotate-180 text-zinc-300' : ''
              }`}
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* User Summary Header */}
              <div className="p-2.5 bg-zinc-950/70 rounded-xl border border-zinc-800/80 mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 text-amber-300 text-xs font-bold flex items-center justify-center border border-amber-500/40 font-mono shrink-0">
                    {user?.username ? user.username.slice(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-zinc-100 truncate">
                      {user?.fullName || 'Usuario'}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono truncate">
                      @{user?.username || 'usuario'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[10px]">
                  <span className="text-zinc-500">Rol:</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono font-bold uppercase">
                    {user?.role || 'BARBER'}
                  </span>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="space-y-0.5 text-xs">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => handleNav('/dashboard')}
                      className="w-full px-2.5 py-2 rounded-xl text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <BarChart2 className="w-4 h-4 text-zinc-400" />
                      <span>Métricas & Dashboard</span>
                    </button>

                    <button
                      onClick={() => handleNav('/admin/waitlist')}
                      className="w-full px-2.5 py-2 rounded-xl text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-zinc-400" />
                      <span>Lista de Espera</span>
                    </button>

                    <button
                      onClick={() => handleNav('/admin/settings')}
                      className="w-full px-2.5 py-2 rounded-xl text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-zinc-400" />
                      <span>Configuración del Salón</span>
                    </button>
                  </>
                )}

                {isSuperAdmin && (
                  <button
                    onClick={() => handleNav('/superadmin')}
                    className="w-full px-2.5 py-2 rounded-xl text-amber-300 hover:text-amber-100 hover:bg-zinc-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Panel Super-Admin</span>
                  </button>
                )}

                <button
                  onClick={() => handleNav(tenant?.slug ? `/?slug=${tenant?.slug}` : '/')}
                  className="w-full px-2.5 py-2 rounded-xl text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  <span>Ver Portal de Clientes (/)</span>
                </button>
              </div>

              <div className="my-1.5 border-t border-zinc-800/80" />

              {/* Utility Tools */}
              <div className="space-y-0.5 text-xs">
                <button
                  onClick={toggleFullscreen}
                  className="w-full px-2.5 py-2 rounded-xl text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Maximize className="w-4 h-4 text-zinc-400" />
                    )}
                    <span>{isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono font-bold">
                    F11
                  </kbd>
                </button>
              </div>

              <div className="my-1.5 border-t border-zinc-800/80" />

              {/* Logout */}
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                }}
                className="w-full px-2.5 py-2 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors font-medium text-xs cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

      {/* ─── Bottom Tab Bar (Mobile Only) ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-zinc-950 border-t border-zinc-800 z-50 flex items-center justify-around px-1 pb-safe">
        {navItems
          .filter((item) => (item.adminOnly ? isAdmin : true))
          .slice(0, 5) // Show max 5 items to prevent overflow
          .map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              (item.path !== '/' && currentPath.startsWith(item.path));

            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'fill-amber-500/20' : ''}`} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
      </nav>
    </>
  );
}
