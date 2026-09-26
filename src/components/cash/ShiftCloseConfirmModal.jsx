import React, { useState, useEffect } from 'react';
import { 
  Vault, 
  X, 
  AlertTriangle, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  Banknote, 
  CreditCard, 
  QrCode,
  Loader2 
} from 'lucide-react';

export function ShiftCloseConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isClosing,
  shiftData,
}) {
  const [countedCash, setCountedCash] = useState('');
  const [notes, setNotes] = useState('');

  const openingAmount = Number(shiftData?.openingAmount || 0);
  const totalSales = Number(shiftData?.totalSales || 0);
  const cashSales = Number(shiftData?.salesCash || 0);
  const cardSales = Number(shiftData?.salesCard || 0);
  const qrSales = Number(shiftData?.salesQR || 0);
  const totalExpenses = Number(shiftData?.totalExpenses || 0);
  const expectedCash = Number(shiftData?.expectedCashInDrawer || (openingAmount + cashSales - totalExpenses));

  useEffect(() => {
    if (isOpen) {
      setCountedCash(expectedCash.toString());
      setNotes('');
    }
  }, [isOpen, expectedCash]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isClosing) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClosing, onClose]);

  if (!isOpen) return null;

  const enteredCashNumber = countedCash === '' ? 0 : Number(countedCash);
  const difference = enteredCashNumber - expectedCash;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (enteredCashNumber < 0 || isNaN(enteredCashNumber)) return;
    onConfirm({
      countedCash: enteredCashNumber,
      cashierNotes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Vault className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Confirmar Cierre de Caja (Z)</h3>
              <p className="text-[11px] text-zinc-400">Arqueo ciego y sellado de turno #{shiftData?.id || '1'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isClosing}
            className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Summary Strip */}
          <div className="bg-zinc-950/70 rounded-xl border border-zinc-800/80 p-3.5 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-zinc-400">
              <span>Facturación Total:</span>
              <span className="font-bold text-zinc-100">${totalSales.toLocaleString('es-AR')}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-zinc-800/60 text-[11px] text-zinc-500">
              <div>Ef: ${cashSales.toLocaleString('es-AR')}</div>
              <div>Tarj: ${cardSales.toLocaleString('es-AR')}</div>
              <div>QR: ${qrSales.toLocaleString('es-AR')}</div>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-zinc-800/60 text-zinc-400">
              <span>Efectivo Teórico en Gaveta:</span>
              <span className="font-bold text-amber-400">${expectedCash.toLocaleString('es-AR')}</span>
            </div>
          </div>

          {/* Counted Cash Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider font-mono">
              Efectivo Físico Contado ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono font-bold">$</span>
              <input
                type="number"
                required
                min="0"
                autoFocus
                value={countedCash}
                onChange={(e) => setCountedCash(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-base font-bold text-zinc-100 font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>

            {/* Difference Indicator */}
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <span className="text-zinc-500">Diferencia de Arqueo:</span>
              <span
                className={`font-mono font-bold num-tabular ${
                  difference === 0
                    ? 'text-emerald-400'
                    : difference > 0
                    ? 'text-teal-400'
                    : 'text-rose-400'
                }`}
              >
                {difference === 0 ? 'Sin diferencia ($0)' : `${difference > 0 ? '+$' : '-$'}${Math.abs(difference).toLocaleString('es-AR')}`}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider font-mono">
              Observaciones de Cierre (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Billetes deteriorados, faltante de cambio..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 resize-none"
            />
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <span>Al confirmar se sellará el turno irreversiblemente y se generará el arqueo definitivo Z.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isClosing}
              className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isClosing || countedCash === '' || Number(countedCash) < 0}
              className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isClosing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cerrando...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Confirmar y Cerrar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
