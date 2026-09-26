import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../../services/paymentService';
import { cashService } from '../../services/cashService';
import { 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Download, 
  Banknote, 
  CreditCard, 
  QrCode, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  User, 
  Receipt, 
  AlertCircle, 
  CheckCircle2, 
  FileSpreadsheet,
  Loader2,
  Calendar,
  Layers
} from 'lucide-react';

export function ShiftHistoryAccordionItem({ shift }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ledgerFilter, setLedgerFilter] = useState('ALL'); // 'ALL' | 'SALES' | 'INCOME' | 'EXPENSE'

  // Fetch payments for this specific closed shift (only when expanded)
  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ['shifts', shift.id, 'payments'],
    queryFn: () => paymentService.getByShift(shift.id),
    enabled: isExpanded,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
  });

  // Fetch manual movements for this specific closed shift (only when expanded)
  const { data: manualMovements = [], isLoading: isLoadingMovements } = useQuery({
    queryKey: ['shifts', shift.id, 'movements'],
    queryFn: () => cashService.getShiftMovements(shift.id),
    enabled: isExpanded,
    staleTime: 1000 * 60 * 30,
  });

  // Calculate Unified Ledger of this shift
  const unifiedLedger = useMemo(() => {
    if (!isExpanded) return [];
    const list = [];

    // 1. Sales payments
    payments.forEach((p) => {
      list.push({
        id: `pay-${p.id}`,
        category: 'SALE',
        type: 'INCOME',
        title: `Cobro Comanda #${p.orderId || 'S/N'}`,
        description: `Método: ${p.method}${p.changeReturned > 0 ? ` (Vuelto: $${Number(p.changeReturned).toLocaleString('es-AR')})` : ''}`,
        amount: Number(p.amount || 0),
        time: p.paidAt,
        processedBy: p.processedBy,
      });
    });

    // 2. Manual movements (Expenses / Incomes)
    manualMovements.forEach((m) => {
      list.push({
        id: `mov-${m.id}`,
        category: m.type === 'INCOME' ? 'MANUAL_INCOME' : 'EXPENSE',
        type: m.type,
        title: m.type === 'INCOME' ? 'Ingreso Manual' : 'Egreso / Retiro de Caja',
        description: m.description,
        amount: Number(m.amount || 0),
        time: m.createdAt,
        createdBy: m.createdBy,
      });
    });

    // Sort by timestamp descending
    return list.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
  }, [isExpanded, payments, manualMovements]);

  // Filtered ledger
  const filteredLedger = useMemo(() => {
    if (ledgerFilter === 'ALL') return unifiedLedger;
    if (ledgerFilter === 'SALES') return unifiedLedger.filter((item) => item.category === 'SALE');
    if (ledgerFilter === 'EXPENSE') return unifiedLedger.filter((item) => item.category === 'EXPENSE');
    if (ledgerFilter === 'INCOME') return unifiedLedger.filter((item) => item.category === 'MANUAL_INCOME');
    return unifiedLedger;
  }, [unifiedLedger, ledgerFilter]);

  // Formatted date and time strings
  const openDate = shift.openedAt ? new Date(shift.openedAt) : null;
  const closeDate = shift.closedAt ? new Date(shift.closedAt) : null;

  const dateFormatted = openDate 
    ? openDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Fecha desconocida';

  const timeSpan = `${openDate ? openDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '--:--'} → ${closeDate ? closeDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}`;

  // Difference and status
  const difference = Number(shift.difference || 0);
  const isExact = difference === 0;
  const isPositive = difference > 0;
  const isNegative = difference < 0;

  // CSV Export handler
  const handleExportCSV = (e) => {
    e.stopPropagation();
    if (unifiedLedger.length === 0) return;

    const headers = ['Fecha/Hora', 'Categoría', 'Tipo', 'Detalle', 'Monto'];
    const rows = unifiedLedger.map((item) => [
      item.time ? new Date(item.time).toLocaleString('es-AR') : '',
      item.category,
      item.type,
      `"${(item.title + ' - ' + item.description).replace(/"/g, '""')}"`,
      item.amount,
    ]);

    // Add summary footer
    rows.push([]);
    rows.push(['--- RESUMEN DEL TURNO ---']);
    rows.push(['Fondo Inicial', '', '', '', shift.initialFund || 0]);
    rows.push(['Ventas Efectivo', '', '', '', shift.cashSales || 0]);
    rows.push(['Ventas Tarjetas', '', '', '', shift.cardSales || 0]);
    rows.push(['Ventas QR/Transfer', '', '', '', shift.qrSales || 0]);
    rows.push(['Total Ventas', '', '', '', shift.totalSales || 0]);
    rows.push(['Total Gastos', '', '', '', shift.totalExpenses || 0]);
    rows.push(['Efectivo Esperado', '', '', '', shift.expectedCash || 0]);
    rows.push(['Efectivo Declarado', '', '', '', shift.closingFund || 0]);
    rows.push(['Diferencia Arqueo', '', '', '', shift.difference || 0]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Libro_Diario_Turno_${shift.id}_${dateFormatted.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Thermal Receipt Printing handler
  const handlePrintAudit = (e) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cierre de Caja #${shift.id}</title>
          <style>
            @page { margin: 0; size: 80mm auto; }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.3;
              color: #000;
              margin: 10px;
              width: 72mm;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; }
            .title { font-size: 15px; font-weight: bold; margin-bottom: 4px; }
          </style>
        </head>
        <body>
          <div class="text-center">
            <div class="title">COMPROBANTE DE CIERRE</div>
            <div>TURNO DE CAJA #${shift.id}</div>
            <div>Fecha: ${dateFormatted}</div>
            <div>Horario: ${timeSpan}</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="row"><span>Apertura por:</span><span>${shift.openerName || 'Admin'}</span></div>
          <div class="row"><span>Cierre por:</span><span>${shift.closerName || 'Admin'}</span></div>
          
          <div class="divider"></div>
          
          <div class="row"><span>Fondo Inicial:</span><span>$${Number(shift.initialFund || 0).toLocaleString('es-AR')}</span></div>
          <div class="row"><span>Ventas Efectivo:</span><span>$${Number(shift.cashSales || 0).toLocaleString('es-AR')}</span></div>
          <div class="row"><span>Ventas Tarjetas:</span><span>$${Number(shift.cardSales || 0).toLocaleString('es-AR')}</span></div>
          <div class="row"><span>Ventas QR/Transf:</span><span>$${Number(shift.qrSales || 0).toLocaleString('es-AR')}</span></div>
          
          <div class="divider"></div>
          
          <div class="row bold"><span>TOTAL VENTAS:</span><span>$${Number(shift.totalSales || 0).toLocaleString('es-AR')}</span></div>
          <div class="row"><span>Gastos/Retiros:</span><span>-$${Number(shift.totalExpenses || 0).toLocaleString('es-AR')}</span></div>
          
          <div class="divider"></div>
          
          <div class="row"><span>Efectivo Esperado:</span><span>$${Number(shift.expectedCash || 0).toLocaleString('es-AR')}</span></div>
          <div class="row bold"><span>Efectivo Contado:</span><span>$${Number(shift.closingFund || 0).toLocaleString('es-AR')}</span></div>
          <div class="row bold"><span>Diferencia Arqueo:</span><span>${difference > 0 ? '+' : ''}$${Number(difference).toLocaleString('es-AR')}</span></div>
          
          ${shift.notes ? `
            <div class="divider"></div>
            <div><span class="bold">Observaciones:</span> ${shift.notes}</div>
          ` : ''}
          
          <div class="divider"></div>
          <div class="text-center bold" style="margin-top: 15px;">POS RESTO & BAR</div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden transition-all shadow-sm">
      {/* ─── Accordion Header Trigger ─── */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-zinc-850 transition-colors select-none"
      >
        {/* Left: Badge ID + Date + Time Span */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-inner">
            #{shift.id}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-zinc-100">{dateFormatted}</span>
              <span className="px-2 py-0.2 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400 font-medium">
                {timeSpan}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5 flex items-center gap-1.5 font-sans">
              <User className="w-3 h-3 text-zinc-500 shrink-0" />
              <span>{shift.openerName || 'Admin'} ➔ {shift.closerName || 'Admin'}</span>
            </p>
          </div>
        </div>

        {/* Right: Revenue + Difference Badge + Expand Chevron */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800/80">
          <div className="text-left sm:text-right">
            <div className="text-[10px] font-mono uppercase text-zinc-500">Facturado</div>
            <div className="text-sm font-black font-mono text-zinc-100 num-tabular">
              ${Number(shift.totalSales || 0).toLocaleString('es-AR')}
            </div>
          </div>

          {/* Arqueo difference badge */}
          <div className="shrink-0">
            {isExact ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Exacto</span>
              </span>
            ) : isNegative ? (
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1" title="Faltante de efectivo">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>-${Math.abs(difference).toLocaleString('es-AR')} Faltante</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold flex items-center gap-1" title="Sobrante de efectivo">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+${difference.toLocaleString('es-AR')} Sobrante</span>
              </span>
            )}
          </div>

          {/* Chevron indicator */}
          <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center transition-transform shrink-0">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* ─── Accordion Expanded Content (Piano Breakdown) ─── */}
      {isExpanded && (
        <div className="border-t border-zinc-800 bg-zinc-950/60 p-4 sm:p-5 space-y-5 animate-in fade-in duration-200">
          {/* Top Actions: CSV Download & Thermal Print */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                Desglose Financiero & Libro Diario del Turno
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintAudit}
                className="btn-touch px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-200 border border-zinc-750 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Imprimir ticket térmico de cierre"
              >
                <Printer className="w-3.5 h-3.5 text-zinc-400" />
                <span>Imprimir Cierre</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-touch px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Descargar libro diario en CSV/Excel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* 1. Financial Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Fondo Inicial */}
            <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-0.5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Fondo Inicial</div>
              <div className="text-sm font-bold font-mono text-zinc-200 num-tabular">
                ${Number(shift.initialFund || 0).toLocaleString('es-AR')}
              </div>
            </div>

            {/* Efectivo Ventas */}
            <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-0.5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                <Banknote className="w-3 h-3 text-emerald-400" />
                <span>Ventas Efectivo</span>
              </div>
              <div className="text-sm font-bold font-mono text-emerald-400 num-tabular">
                ${Number(shift.cashSales || 0).toLocaleString('es-AR')}
              </div>
            </div>

            {/* Tarjetas Débito/Crédito */}
            <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-0.5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-blue-400" />
                <span>Tarjetas</span>
              </div>
              <div className="text-sm font-bold font-mono text-blue-400 num-tabular">
                ${Number(shift.cardSales || 0).toLocaleString('es-AR')}
              </div>
            </div>

            {/* QR / Transferencias */}
            <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-0.5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                <QrCode className="w-3 h-3 text-purple-400" />
                <span>QR / Transf.</span>
              </div>
              <div className="text-sm font-bold font-mono text-purple-400 num-tabular">
                ${Number(shift.qrSales || 0).toLocaleString('es-AR')}
              </div>
            </div>
          </div>

          {/* Arqueo Comparison Banner */}
          <div className="p-3.5 bg-zinc-900/90 border border-zinc-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="text-zinc-400">
                <span className="font-semibold text-zinc-300">Efectivo Esperado: </span>
                <span className="font-mono font-bold text-zinc-100">${Number(shift.expectedCash || 0).toLocaleString('es-AR')}</span>
                <span className="text-zinc-500 text-[11px] ml-2">(Fondo + Ventas Efvo - Gastos)</span>
              </div>
              <div className="text-zinc-400">
                <span className="font-semibold text-zinc-300">Efectivo Contado: </span>
                <span className="font-mono font-bold text-zinc-100">${Number(shift.closingFund || 0).toLocaleString('es-AR')}</span>
              </div>
            </div>

            {shift.notes && (
              <div className="text-xs text-zinc-400 bg-zinc-950/80 px-3 py-2 rounded-lg border border-zinc-800 max-w-sm">
                <span className="text-zinc-500 font-bold text-[10px] uppercase block font-mono">Nota de Cierre:</span>
                <span className="text-zinc-300 italic">{shift.notes}</span>
              </div>
            )}
          </div>

          {/* 2. Unified Libro Diario Table */}
          <div className="space-y-3 pt-2">
            {/* Filter Tabs for this shift */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-bold text-zinc-200">
                  Movimientos del Libro Diario ({unifiedLedger.length})
                </h4>
              </div>

              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setLedgerFilter('ALL')}
                  className={`btn-touch px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    ledgerFilter === 'ALL' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Todos ({unifiedLedger.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLedgerFilter('SALES')}
                  className={`btn-touch px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    ledgerFilter === 'SALES' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Ventas ({payments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLedgerFilter('EXPENSE')}
                  className={`btn-touch px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    ledgerFilter === 'EXPENSE' ? 'bg-zinc-800 text-rose-400' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Gastos ({manualMovements.filter((m) => m.type === 'EXPENSE').length})
                </button>
                <button
                  type="button"
                  onClick={() => setLedgerFilter('INCOME')}
                  className={`btn-touch px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    ledgerFilter === 'INCOME' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Ingresos ({manualMovements.filter((m) => m.type === 'INCOME').length})
                </button>
              </div>
            </div>

            {/* Movements List / Table */}
            {isLoadingPayments || isLoadingMovements ? (
              <div className="py-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span>Cargando movimientos del turno...</span>
              </div>
            ) : filteredLedger.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-500 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
                No hay movimientos registrados en este turno con el filtro seleccionado.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {filteredLedger.map((item) => {
                  const isExpense = item.type === 'EXPENSE';
                  const isIncome = item.type === 'INCOME';

                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs hover:bg-zinc-850 transition-colors"
                    >
                      {/* Left: Icon + Title + Description */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isExpense
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : item.category === 'SALE'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {isExpense ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-200 truncate">{item.title}</div>
                          <div className="text-[10px] text-zinc-500 truncate">{item.description}</div>
                        </div>
                      </div>

                      {/* Right: Timestamp + Amount */}
                      <div className="text-right shrink-0">
                        <div
                          className={`font-mono font-bold text-xs num-tabular ${
                            isExpense ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {isExpense ? '-' : '+'}${item.amount.toLocaleString('es-AR')}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {item.time ? new Date(item.time).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
