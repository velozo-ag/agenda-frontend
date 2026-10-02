import React, { useState, useMemo } from 'react';
import { 
  Vault, 
  DollarSign, 
  TrendingUp, 
  Search, 
  ArrowUpRight, 
  Filter, 
  Calendar, 
  Coins, 
  Users, 
  Receipt,
  Scissors
} from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { useAuth } from '../context/AuthContext';

export function CashierPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN';
  
  // Rango por defecto: Hoy
  const [fromDate, setFromDate] = useState(() => new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(() => new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]);
  
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'commissions'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBarberId, setSelectedBarberId] = useState('');

  const { barbers } = useBarbers();
  const { data: appointmentsData, isLoading } = useAppointments({
    fromDate,
    toDate,
    barberId: selectedBarberId || undefined,
  });

  const appointments = appointmentsData?.data || appointmentsData || [];

  // Calcular métricas generales
  const { filteredAppointments, totalRevenue, totalDeposits, completedCount, avgTicket } = useMemo(() => {
    let filtered = appointments;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.clientName?.toLowerCase().includes(lowerSearch) || 
        a.serviceNameSnapshot?.toLowerCase().includes(lowerSearch) ||
        a.barberName?.toLowerCase().includes(lowerSearch)
      );
    }

    let revenue = 0;
    let deposits = 0;
    let completed = 0;

    appointments.forEach(a => {
      if (a.status === 'COMPLETED') {
        completed++;
        revenue += Number(a.priceSnapshot || 0);
      }
      if (a.depositPaid && a.depositAmount) {
        deposits += Number(a.depositAmount);
      }
    });

    const ticket = completed > 0 ? revenue / completed : 0;

    return {
      filteredAppointments: filtered,
      totalRevenue: revenue,
      totalDeposits: deposits,
      completedCount: completed,
      avgTicket: ticket
    };
  }, [appointments, searchTerm]);

  // Liquidación de comisiones por barbero
  const { barberCommissions, totalCommissionsToPay, totalNetSalon } = useMemo(() => {
    const map = new Map();

    barbers.forEach(b => {
      map.set(b.id, {
        barberId: b.id,
        barberName: b.fullName,
        barberColor: b.color || '#f59e0b',
        commissionPct: Number(b.commissionPct || 0),
        appointmentsCount: 0,
        totalRevenue: 0,
        totalCommission: 0,
        netSalon: 0,
      });
    });

    appointments.forEach(a => {
      if (a.status === 'COMPLETED' && a.barberId) {
        let entry = map.get(a.barberId);
        if (!entry) {
          entry = {
            barberId: a.barberId,
            barberName: a.barberName || 'Barbero Desconocido',
            barberColor: '#71717a',
            commissionPct: 0,
            appointmentsCount: 0,
            totalRevenue: 0,
            totalCommission: 0,
            netSalon: 0,
          };
          map.set(a.barberId, entry);
        }
        const apptPrice = Number(a.priceSnapshot || a.price || 0);
        entry.appointmentsCount += 1;
        entry.totalRevenue += apptPrice;
        const comm = (apptPrice * entry.commissionPct) / 100;
        entry.totalCommission += comm;
        entry.netSalon += (apptPrice - comm);
      }
    });

    const list = Array.from(map.values());
    const totalComm = list.reduce((acc, curr) => acc + curr.totalCommission, 0);
    const totalNet = list.reduce((acc, curr) => acc + curr.netSalon, 0);

    return {
      barberCommissions: list,
      totalCommissionsToPay: totalComm,
      totalNetSalon: totalNet
    };
  }, [appointments, barbers]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Vault className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-100 tracking-tight flex items-center gap-3">
                Caja & Liquidaciones
                <span className="bg-emerald-500 text-emerald-950 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest translate-y-0.5">
                  Libre
                </span>
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Visualizá los ingresos del local y calculá las comisiones del staff por rango de fechas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 shadow-sm w-full md:w-auto overflow-hidden">
          <div className="hidden sm:flex items-center gap-2 px-3 border-r border-zinc-800 text-zinc-500">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between flex-1">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-zinc-100 text-xs sm:text-sm font-medium px-2 sm:px-3 py-2 focus:outline-none cursor-pointer flex-1 min-w-0"
            />
            <span className="text-zinc-600 font-bold px-1 sm:px-2 text-xs sm:text-sm shrink-0">-</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-zinc-100 text-xs sm:text-sm font-medium px-2 sm:px-3 py-2 focus:outline-none cursor-pointer flex-1 min-w-0"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Facturación Total */}
        <div className="bg-amber-500 rounded-2xl p-6 shadow-lg shadow-amber-500/10 text-zinc-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <TrendingUp className="w-16 h-16" />
          </div>
          <div className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Total Cobrado</div>
          <div className="text-4xl font-black font-mono tracking-tighter">
            ${totalRevenue.toLocaleString('es-AR')}
          </div>
        </div>

        {/* Citas Completadas */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Turnos Atendidos</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-zinc-100">
            {completedCount}
          </div>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Ticket Promedio</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-zinc-100">
            ${avgTicket.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* Comisiones a Liquidar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Comisiones a Pagar</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            ${totalCommissionsToPay.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">
            Neto Salón: ${totalNetSalon.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Main Content Card with Tabs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Navigation Tabs & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-zinc-900/60">
          
          {/* Segmented Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'transactions'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Turnos & Cobros ({filteredAppointments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'commissions'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Liquidación de Comisiones ({barberCommissions.length})</span>
            </button>
          </div>
          
          {/* Filters for Transactions tab */}
          {activeTab === 'transactions' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar cliente, servicio o barbero..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {isAdmin && barbers.length > 1 && (
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-500" />
                  <select
                    value={selectedBarberId}
                    onChange={(e) => setSelectedBarberId(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="">Todos los Barberos</option>
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>{b.fullName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* TAB 1: Transacciones y Movimientos */}
        {activeTab === 'transactions' && (
          isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-zinc-500 gap-3">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Cargando movimientos...</span>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-12 text-center">
              <div className="max-w-sm">
                <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <Vault className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-base font-bold text-zinc-300 mb-2">No hay turnos registrados</p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  No se encontraron turnos en el rango de fechas seleccionado. Probá cambiando las fechas en la parte superior.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto flex-1 p-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest border-b border-zinc-800/60 bg-zinc-950/40">
                  <tr>
                    <th className="py-4 px-4 font-normal">Fecha & Hora</th>
                    <th className="py-4 px-4 font-normal">Cliente</th>
                    <th className="py-4 px-4 font-normal">Servicio</th>
                    <th className="py-4 px-4 font-normal">Barbero</th>
                    <th className="py-4 px-4 font-normal">Estado</th>
                    <th className="py-4 px-4 font-normal text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredAppointments.map((appt) => {
                    const startTime = new Date(appt.startTime);
                    const isCompleted = appt.status === 'COMPLETED';

                    return (
                      <tr key={appt.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-4 px-4 font-mono text-zinc-300">
                          <div className="font-bold text-zinc-200">
                            {startTime.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }).replace('.', '')}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {startTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-zinc-200">{appt.clientName}</div>
                          {appt.clientPhone && (
                            <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{appt.clientPhone}</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-zinc-200 font-medium">{appt.serviceNameSnapshot}</div>
                          {appt.durationMinSnapshot && (
                            <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{appt.durationMinSnapshot} min</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs font-semibold text-zinc-300">
                            {appt.barberName || 'Sin asignar'}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                              isCompleted
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : appt.status === 'CONFIRMED'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : appt.status === 'CANCELLED'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {appt.status === 'COMPLETED'
                              ? 'COBRADO'
                              : appt.status === 'CONFIRMED'
                              ? 'CONFIRMADO'
                              : appt.status === 'CANCELLED'
                              ? 'CANCELADO'
                              : appt.status}
                          </span>
                        </td>
                        <td className={`py-4 px-4 text-right font-mono font-bold text-base ${isCompleted ? 'text-zinc-100' : 'text-zinc-500'}`}>
                          ${Number(appt.priceSnapshot || 0).toLocaleString('es-AR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* TAB 2: Liquidación de Comisiones */}
        {activeTab === 'commissions' && (
          <div className="overflow-x-auto flex-1 p-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest border-b border-zinc-800/60 bg-zinc-950/40">
                <tr>
                  <th className="py-4 px-5 font-normal">Barbero / Profesional</th>
                  <th className="py-4 px-5 font-normal text-center">Turnos Cobrados</th>
                  <th className="py-4 px-5 font-normal text-right">Facturación Bruta</th>
                  <th className="py-4 px-5 font-normal text-center">% Comisión</th>
                  <th className="py-4 px-5 font-normal text-right text-emerald-400">A Pagar al Barbero</th>
                  <th className="py-4 px-5 font-normal text-right">Ganancia Salón</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {barberCommissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-zinc-500">
                      No hay barberos registrados en el equipo.
                    </td>
                  </tr>
                ) : (
                  barberCommissions.map((b) => (
                    <tr key={b.barberId} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-zinc-950 shadow-sm"
                            style={{ backgroundColor: b.barberColor }}
                          >
                            {b.barberName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-100">{b.barberName}</div>
                            <div className="text-[11px] text-zinc-500">Staff activo</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center font-mono font-bold text-zinc-200">
                        {b.appointmentsCount}
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-bold text-zinc-200">
                        ${b.totalRevenue.toLocaleString('es-AR')}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {b.commissionPct}%
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-black text-base text-emerald-400">
                        ${b.totalCommission.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-bold text-sm text-zinc-300">
                        ${b.netSalon.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {barberCommissions.length > 0 && (
                <tfoot className="border-t-2 border-zinc-800 bg-zinc-950/60 font-bold">
                  <tr>
                    <td className="py-4 px-5 text-xs uppercase tracking-wider text-zinc-400">
                      Totales del Período
                    </td>
                    <td className="py-4 px-5 text-center font-mono text-zinc-100">
                      {completedCount}
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-zinc-100">
                      ${totalRevenue.toLocaleString('es-AR')}
                    </td>
                    <td className="py-4 px-5 text-center text-zinc-500">—</td>
                    <td className="py-4 px-5 text-right font-mono text-emerald-400 text-base">
                      ${totalCommissionsToPay.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-zinc-100 text-base">
                      ${totalNetSalon.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CashierPage;
