import React, { useState, useMemo } from 'react';
import { useDashboardMetrics } from '../hooks/useDashboard';
import { 
  Banknote, 
  CalendarCheck, 
  Receipt, 
  UserX,
  Loader2,
  Scissors,
  Users,
  ChevronDown
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Heatmap } from '../components/dashboard/Heatmap';
import { useMyTenant } from '../hooks/useTenantBranding';

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(amount);
};

export function DashboardPage() {
  const { data: tenant } = useMyTenant();
  const [period, setPeriod] = useState('MONTH'); 
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [isServicesOpen, setIsServicesOpen] = useState(true);
  const [isBarbersOpen, setIsBarbersOpen] = useState(true);

  const { fromDate, toDate } = useMemo(() => {
    const now = new Date();
    
    if (period === 'TODAY') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // Adjust for local timezone offset when using toISOString
      const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      return { 
        fromDate: localDate, 
        toDate: localDate 
      };
    }
    
    if (period === 'WEEK') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dayOfWeek = today.getDay(); // 0 is Sunday
      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const monday = new Date(today.setDate(diff));
      const todayLocal = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const mondayLocal = new Date(monday.getTime() - (monday.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      return { 
        fromDate: mondayLocal, 
        toDate: todayLocal 
      };
    }
    
    if (period === 'MONTH') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const todayLocal = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const startOfMonthLocal = new Date(startOfMonth.getTime() - (startOfMonth.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      return { 
        fromDate: startOfMonthLocal, 
        toDate: todayLocal 
      };
    }
    
    if (period === 'LAST_30_DAYS') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const past30 = new Date(today);
      past30.setDate(today.getDate() - 30);
      const todayLocal = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const past30Local = new Date(past30.getTime() - (past30.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      return { 
        fromDate: past30Local, 
        toDate: todayLocal 
      };
    }

    if (period === 'LAST_60_DAYS') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const past60 = new Date(today);
      past60.setDate(today.getDate() - 60);
      const todayLocal = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const past60Local = new Date(past60.getTime() - (past60.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      return { 
        fromDate: past60Local, 
        toDate: todayLocal 
      };
    }
    
    if (period === 'CUSTOM') {
      return { fromDate: customFrom, toDate: customTo };
    }
    
    return { fromDate: null, toDate: null };
  }, [period, customFrom, customTo]);

  const shouldFetch = period !== 'CUSTOM' || (customFrom && customTo);

  const { data, isLoading, isError } = useDashboardMetrics(
    shouldFetch ? fromDate : null, 
    shouldFetch ? toDate : null
  );

  const kpis = data?.kpis || {};
  const topServices = data?.topServices || [];
  const topBarbers = data?.topBarbers || [];

  return (
    <div className="flex flex-col flex-1 h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header & Date Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Dashboard & Métricas</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Rendimiento general y facturación del negocio
            </p>
          </div>
          
          <div className="flex flex-col xl:flex-row gap-2 w-full lg:w-auto overflow-hidden">
            <div className="flex p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-x-auto scrollbar-none shadow-sm">
              {['TODAY', 'WEEK', 'MONTH', 'LAST_30_DAYS', 'LAST_60_DAYS', 'CUSTOM'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={twMerge(
                    "px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer",
                    period === p 
                      ? "bg-zinc-900 dark:bg-zinc-800 text-white shadow-sm" 
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  )}
                >
                  {p === 'TODAY' && 'Hoy'}
                  {p === 'WEEK' && 'Esta semana'}
                  {p === 'MONTH' && 'Este mes'}
                  {p === 'LAST_30_DAYS' && 'Últimos 30 días'}
                  {p === 'LAST_60_DAYS' && 'Últimos 60 días'}
                  {p === 'CUSTOM' && 'Personalizado'}
                </button>
              ))}
            </div>

            {period === 'CUSTOM' && (
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0 shrink-0">
                <input 
                  type="date" 
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] shrink-0 min-w-[130px] shadow-sm"
                />
                <span className="text-zinc-400 dark:text-zinc-500 shrink-0">-</span>
                <input 
                  type="date" 
                  value={customTo}
                  onChange={e => setCustomTo(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] shrink-0 min-w-[130px] shadow-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[var(--primary-color)] animate-spin" />
          </div>
        )}

        {isError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-center gap-3">
            <UserX className="w-5 h-5 shrink-0" />
            <p>Error al cargar las métricas. Intenta de nuevo más tarde.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* 4 KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <KpiCard 
                title="Facturación" 
                value={formatCurrency(kpis.totalRevenue)} 
                icon={Banknote}
                colorClass="text-emerald-600 dark:text-emerald-500"
                bgClass="bg-emerald-500/10"
              />
              <KpiCard 
                title="Citas Completadas" 
                value={kpis.completedAppointments || 0} 
                icon={CalendarCheck}
                colorClass="text-blue-600 dark:text-blue-500"
                bgClass="bg-blue-500/10"
              />
              <KpiCard 
                title="Ticket Promedio" 
                value={formatCurrency(kpis.avgTicket)} 
                icon={Receipt}
                colorClass="text-amber-600 dark:text-amber-500"
                bgClass="bg-amber-500/10"
              />
              <KpiCard 
                title="Tasa de Ausentismo" 
                value={`${kpis.noShowRate != null ? Number(kpis.noShowRate).toFixed(1) : 0}%`} 
                icon={UserX}
                colorClass="text-rose-600 dark:text-rose-500"
                bgClass="bg-rose-500/10"
              />
            </div>

            {/* Tables / Ranking */}
            <div className={`grid grid-cols-1 gap-6 mt-8 ${tenant?.maxBarbers !== 1 ? 'lg:grid-cols-2' : ''}`}>
              {/* Top Servicios */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <button 
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors w-full text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)]">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Top Servicios</h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-zinc-400 dark:text-zinc-500 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isServicesOpen && (
                  <div className="p-0 flex-1 animate-in slide-in-from-top-2 duration-200">
                  {topServices.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                      No hay datos de servicios para este período
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {topServices.map((svc, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-6 text-center text-zinc-400 dark:text-zinc-500 font-mono text-sm">{i + 1}</div>
                            <div>
                              <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{svc.serviceName}</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{svc.count} citas</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm font-medium num-tabular text-zinc-900 dark:text-zinc-100">{formatCurrency(svc.revenue)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                )}
              </div>

              {/* Top Barberos (Solo si hay más de 1 barbero) */}
              {tenant?.maxBarbers !== 1 && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
                  <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)]">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Rendimiento por Profesional</h3>
                  </div>
                  
                  <div className="p-0 flex-1">
                    {topBarbers.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                        No hay datos de profesionales para este período
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {topBarbers.map((barber, i) => (
                          <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-6 text-center text-zinc-400 dark:text-zinc-500 font-mono text-sm">{i + 1}</div>
                              <div>
                                <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{barber.barberName}</div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{barber.count} citas completadas</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400 num-tabular">
                                {formatCurrency(barber.revenue)}
                              </div>
                              {barber.commission > 0 && (
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono num-tabular mt-0.5">
                                  Com: {formatCurrency(barber.commission)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Heatmap Section */}
            <div className="mt-8">
              <Heatmap distribution={data?.heatmap?.distribution} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, colorClass, bgClass }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl flex items-start gap-4 shadow-sm">
      <div className={twMerge("w-12 h-12 rounded-lg flex items-center justify-center shrink-0", bgClass, colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1 font-mono num-tabular text-zinc-900 dark:text-zinc-100">{value}</p>
      </div>
    </div>
  );
}
