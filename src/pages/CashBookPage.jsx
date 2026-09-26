import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCashMovements, useCreateCashMovement } from '../hooks/usePayment';
import { useCurrentShift } from '../hooks/useCurrentShift';
import { paymentService } from '../services/paymentService';
import { cashService } from '../services/cashService';
import { ShiftHistoryAccordionItem } from '../components/cash/ShiftHistoryAccordionItem';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Minus, 
  Search,
  BookOpen,
  Calendar,
  Printer,
  Download,
  X,
  Receipt,
  TrendingUp,
  TrendingDown,
  History,
  Clock,
  Loader2
} from 'lucide-react';

export function CashBookPage() {
  const { data: currentShift } = useCurrentShift();
  const isOpen = currentShift?.status === 'OPEN';
  const shiftId = currentShift?.id;

  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'history'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movementType, setMovementType] = useState('EXPENSE'); // 'INCOME' | 'EXPENSE'
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'SALES' | 'INCOME' | 'EXPENSE'

  const { data: manualMovements = [], isLoading: isLoadingMovements } = useCashMovements(isOpen);
  const createMovementMutation = useCreateCashMovement();

  // Fetch payments for current shift if active
  const { data: shiftPayments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ['shifts', shiftId, 'payments'],
    queryFn: () => (shiftId ? paymentService.getByShift(shiftId) : []),
    enabled: Boolean(isOpen && shiftId && activeTab === 'current'),
    staleTime: 1000 * 10,
  });

  // Fetch closed shift history
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['shifts', 'history'],
    queryFn: () => cashService.getShiftHistory(0, 30),
    enabled: activeTab === 'history',
  });

  const shiftHistory = historyData?.content || [];

  // Combine unified transactions for current shift
  const transactions = useMemo(() => {
    const list = [];

    // 1. Sales payments from backend
    shiftPayments.forEach((p) => {
      list.push({
        id: `pay-${p.id}`,
        category: 'SALE',
        type: 'INCOME',
        title: `Cita #${p.appointmentId || 'S/N'}`,
        description: `Cobro en ${p.method}${p.changeReturned > 0 ? ` (Vuelto: $${Number(p.changeReturned).toLocaleString('es-AR')})` : ''}`,
        amount: Number(p.amount),
        method: p.method,
        createdAt: p.paidAt,
        operator: p.processorName || 'Admin',
      });
    });

    // 2. Manual cash movements
    manualMovements.forEach((m) => {
      list.push({
        id: `mov-${m.id}`,
        category: m.type === 'INCOME' ? 'MANUAL_INCOME' : 'MANUAL_EXPENSE',
        type: m.type,
        title: m.type === 'INCOME' ? 'Ingreso Extra de Caja' : 'Egreso / Retiro de Caja',
        description: m.description,
        amount: Number(m.amount),
        method: 'CASH',
        createdAt: m.createdAt,
        operator: m.creatorName || 'Admin',
      });
    });

    // Sort descending by date
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filter by type & search
    return list.filter((item) => {
      if (typeFilter === 'SALES' && item.category !== 'SALE') return false;
      if (typeFilter === 'INCOME' && item.category !== 'MANUAL_INCOME') return false;
      if (typeFilter === 'EXPENSE' && item.category !== 'MANUAL_EXPENSE') return false;

      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchOperator = item.operator.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchOperator;
      }
      return true;
    });
  }, [shiftPayments, manualMovements, typeFilter, searchFilter]);

  // Totals calculations
  const totalEntradas = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalSalidas = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const saldoNeto = totalEntradas - totalSalidas;

  const handleOpenModal = (type) => {
    setMovementType(type);
    setDescription('');
    setAmount('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) return;

    try {
      await createMovementMutation.mutateAsync({
        type: movementType,
        amount: Number(amount),
        description: description.trim(),
      });
      setIsModalOpen(false);
      setDescription('');
      setAmount('');
    } catch (err) {
      alert(err.message || 'Error al registrar movimiento');
    }
  };

  // Export current shift CSV
  const handleExportCurrentCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Fecha/Hora', 'Categoría', 'Tipo', 'Título', 'Detalle', 'Operador', 'Monto'];
    const rows = transactions.map((item) => [
      item.createdAt ? new Date(item.createdAt).toLocaleString('es-AR') : '',
      item.category,
      item.type,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      item.operator,
      item.amount,
    ]);

    rows.push([]);
    rows.push(['--- BALANCE TOTAL ---']);
    rows.push(['Total Ingresos', '', '', '', '', '', totalEntradas]);
    rows.push(['Total Egresos', '', '', '', '', '', totalSalidas]);
    rows.push(['Saldo Neto', '', '', '', '', '', saldoNeto]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Libro_Diario_Turno_Actual_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-5xl mx-auto min-h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-y-auto lg:overflow-hidden animate-in fade-in select-none">
      {/* Top Header & Subtabs */}
      <div className="pb-3 border-b border-zinc-800/80 flex-shrink-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h1 className="text-base sm:text-lg font-bold text-zinc-100">Libro Diario de Caja</h1>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Registro contable cronológico, auditoría de turnos cerrados y arqueos
            </p>
          </div>

          {/* Action Buttons for Current Shift */}
          {activeTab === 'current' && isOpen && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleExportCurrentCSV}
                className="btn-touch px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Descargar libro diario actual en CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenModal('INCOME')}
                className="btn-touch px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ingreso Extra</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenModal('EXPENSE')}
                className="btn-touch px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Registrar Egreso</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Subtabs: Live Shift vs History Accordion */}
        <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('current')}
            className={`btn-touch px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'current'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Turno Activo</span>
            {isOpen ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ABIERTO
              </span>
            ) : (
              <span className="text-[10px] font-mono text-zinc-500">(Caja Cerrada)</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`btn-touch px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial de Cierres ({shiftHistory.length})</span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: CURRENT LIVE SHIFT ─── */}
      {activeTab === 'current' && (
        <div className="flex-1 flex flex-col min-h-0">
          {!isOpen ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-900/30 rounded-xl border border-zinc-800/60 my-4 space-y-3">
              <BookOpen className="w-10 h-10 text-zinc-700" />
              <div>
                <h3 className="text-sm font-bold text-zinc-200">La caja está cerrada</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                  Abrí un nuevo turno desde el módulo de Caja para comenzar a registrar ventas y movimientos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="btn-touch px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2"
              >
                <History className="w-3.5 h-3.5" />
                <span>Ver Historial de Cierres Anteriores</span>
              </button>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3 py-3 border-b border-zinc-800/60 flex-shrink-0">
                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Total Ingresos</span>
                  </div>
                  <div className="text-base sm:text-xl font-bold text-emerald-400 font-mono num-tabular">
                    +${totalEntradas.toLocaleString('es-AR')}
                  </div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    <span>Total Egresos</span>
                  </div>
                  <div className="text-base sm:text-xl font-bold text-rose-400 font-mono num-tabular">
                    -${totalSalidas.toLocaleString('es-AR')}
                  </div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Balance Neto</span>
                  </div>
                  <div className={`text-base sm:text-xl font-bold font-mono num-tabular ${saldoNeto >= 0 ? 'text-zinc-100' : 'text-rose-400'}`}>
                    ${saldoNeto.toLocaleString('es-AR')}
                  </div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-zinc-800/60 flex-shrink-0 text-xs">
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  {[
                    { id: 'ALL', label: 'Todos' },
                    { id: 'SALES', label: 'Ventas' },
                    { id: 'INCOME', label: 'Ingresos Extra' },
                    { id: 'EXPENSE', label: 'Egresos' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setTypeFilter(f.id)}
                      className={`btn-touch px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        typeFilter === f.id
                          ? 'bg-zinc-800 text-zinc-100 font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Buscar por comanda, motivo..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-full sm:w-64"
                  />
                </div>
              </div>

              {/* Transactions Feed */}
              <div className="flex-1 overflow-y-auto mt-2 pr-1 space-y-2 font-mono text-xs">
                {isLoadingMovements || isLoadingPayments ? (
                  <div className="flex items-center justify-center py-16 gap-2 text-zinc-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    <span>Cargando libro diario de caja...</span>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-16 text-zinc-500 border border-dashed border-zinc-800 rounded-xl font-sans">
                    No se encontraron movimientos registrados en este turno con los filtros aplicados.
                  </div>
                ) : (
                  transactions.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-center justify-between font-sans hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            item.category === 'SALE'
                              ? 'bg-indigo-500/10 text-indigo-400'
                              : item.type === 'INCOME'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {item.category === 'SALE' ? (
                            <Receipt className="w-4 h-4" />
                          ) : item.type === 'INCOME' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-200">{item.title}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 font-mono text-zinc-400">
                              {item.method}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                            {item.description} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • por {item.operator}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`text-sm font-bold font-mono num-tabular ${
                          item.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.type === 'INCOME' ? '+' : '-'}${Number(item.amount).toLocaleString('es-AR')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── TAB 2: HISTORICAL CLOSED SHIFTS ACCORDION (PIANO) ─── */}
      {activeTab === 'history' && (
        <div className="flex-1 flex flex-col min-h-0 pt-2 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
            <span className="font-semibold text-zinc-200">
              Historial de Cierres & Libro Diario de Turnos Anteriores ({shiftHistory.length})
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">auditoría inmutable</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-16 gap-2 text-zinc-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span>Cargando auditoría de turnos...</span>
              </div>
            ) : shiftHistory.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-xs font-sans bg-zinc-900/30 rounded-xl border border-zinc-800/60 p-6 space-y-2">
                <History className="w-8 h-8 mx-auto text-zinc-700" />
                <p>No hay turnos cerrados registrados todavía.</p>
                <p className="text-[11px] text-zinc-600">Al cerrar la caja, aparecerá aquí su desglose completo y libro diario descargable.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {shiftHistory.map((s) => (
                  <ShiftHistoryAccordionItem key={s.id} shift={s} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Movement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 select-none">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-5 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-semibold text-zinc-100 mb-1">
              {movementType === 'INCOME' ? 'Registrar Ingreso Extra' : 'Registrar Egreso / Retiro'}
            </h3>
            <p className="text-[11px] text-zinc-500 mb-3">Movimiento manual en el libro diario de caja</p>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1 font-mono">MONTO EN PESOS ($)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold font-mono text-zinc-100 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1 font-mono">MOTIVO / DESCRIPCIÓN</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pago de hielo, cambio, etc..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={createMovementMutation.isPending}
                  className="flex-1 py-2 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-bold hover:bg-zinc-200"
                >
                  {createMovementMutation.isPending ? 'Guardando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
