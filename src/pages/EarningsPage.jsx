import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMyTenant } from '../hooks/useTenantBranding';
import { useEarningsReport, useCommissionReport } from '../hooks/useEarnings';
import { getLocalISODate } from '../utils/dateUtils';
import { Vault, Banknote, BarChart3, Users } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { Link } from 'react-router-dom';

const PRESETS = [
  { label: 'Hoy', getValue: () => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return { from: getLocalISODate(today), to: getLocalISODate(tomorrow) };
    }
  },
  { label: 'Esta Semana', getValue: () => {
      const today = new Date();
      const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1));
      firstDay.setHours(0,0,0,0);
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 7);
      return { from: getLocalISODate(firstDay), to: getLocalISODate(lastDay) };
    }
  },
  { label: 'Este Mes', getValue: () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      return { from: getLocalISODate(firstDay), to: getLocalISODate(lastDay) };
    }
  }
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

export function EarningsPage() {
  const { user } = useAuth();
  const { data: tenant } = useMyTenant();
  
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const dateRange = selectedPreset.getValue();
  
  const { data: earnings, isLoading: loadingEarnings } = useEarningsReport(dateRange.from, dateRange.to);
  const { data: commissionsData, isLoading: loadingCommissions } = useCommissionReport(dateRange.from, dateRange.to);
  const { data: appointments } = useAppointments({ from: dateRange.from, to: dateRange.to, status: 'COMPLETED' });

  const showCommissions = tenant?.hasCommissions && tenant?.maxBarbers > 1;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Vault className="w-6 h-6 text-indigo-400" />
            Ingresos y Liquidaciones
          </h1>
          <p className="text-zinc-400 mt-1">Control de facturación y comisiones del equipo.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.label}
              onClick={() => setSelectedPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedPreset.label === preset.label 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {loadingEarnings ? (
        <div className="text-zinc-400 animate-pulse">Cargando reporte...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 text-zinc-400 mb-2">
              <Banknote className="w-5 h-5" />
              <h3 className="font-medium">Ingresos Brutos</h3>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(earnings?.grossRevenue)}</p>
            <p className="text-sm text-zinc-500 mt-1">{earnings?.totalCompletedAppointments} cortes completados</p>
          </div>

          {showCommissions && (
            <>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-3 text-zinc-400 mb-2">
                  <Users className="w-5 h-5" />
                  <h3 className="font-medium">Comisiones a Pagar</h3>
                </div>
                <p className="text-3xl font-bold text-red-400">{formatCurrency(earnings?.totalCommissions)}</p>
                <p className="text-sm text-zinc-500 mt-1">A repartir entre el equipo</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 bg-gradient-to-br from-indigo-500/10 to-transparent">
                <div className="flex items-center gap-3 text-indigo-400 mb-2">
                  <BarChart3 className="w-5 h-5" />
                  <h3 className="font-medium text-indigo-300">Ingreso Neto (Local)</h3>
                </div>
                <p className="text-3xl font-bold text-indigo-400">{formatCurrency(earnings?.netRevenue)}</p>
                <p className="text-sm text-indigo-400/60 mt-1">Lo que le queda a la barbería</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showCommissions && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
              <h2 className="font-medium text-white">Liquidación por Barbero</h2>
            </div>
            <div className="p-4 overflow-auto flex-1">
              {loadingCommissions ? (
                <div className="text-zinc-500 text-sm animate-pulse">Calculando...</div>
              ) : commissionsData?.commissions?.length === 0 ? (
                <div className="text-zinc-500 text-sm">No hay comisiones en este período.</div>
              ) : (
                <div className="space-y-4">
                  {commissionsData?.commissions?.map(item => (
                    <div key={item.barberId} className="flex justify-between items-center p-3 rounded-lg border border-zinc-800/50 bg-zinc-950/50">
                      <div>
                        <p className="font-medium text-zinc-200">{item.barberName}</p>
                        <p className="text-xs text-zinc-500">{item.completedAppointments} turnos ({item.commissionPct}%)</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-emerald-400 font-bold">{formatCurrency(item.totalCommission)}</p>
                        <p className="text-xs text-zinc-500">de {formatCurrency(item.totalRevenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col ${!showCommissions ? 'col-span-full' : ''}`}>
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
            <h2 className="font-medium text-white">Turnos Cobrados</h2>
          </div>
          <div className="p-4 overflow-auto flex-1 max-h-[400px]">
             {appointments?.data?.length === 0 ? (
                <div className="text-zinc-500 text-sm">No hay turnos completados en este período.</div>
             ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="pb-2 font-medium">Cliente</th>
                      <th className="pb-2 font-medium">Servicio</th>
                      <th className="pb-2 font-medium">Barbero</th>
                      <th className="pb-2 font-medium text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {appointments?.data?.map(appt => (
                      <tr key={appt.id} className="text-zinc-300">
                        <td className="py-2">{appt.clientName}</td>
                        <td className="py-2 text-zinc-400 truncate max-w-[120px]">{appt.serviceNameSnapshot}</td>
                        <td className="py-2">{appt.barberName}</td>
                        <td className="py-2 text-right font-mono text-zinc-200">{formatCurrency(appt.priceSnapshot)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
