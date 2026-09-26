import React, { useState } from 'react';
import { Store, Receipt, DollarSign, Percent, Save, Check } from 'lucide-react';

export function GeneralSettingsView() {
  const [storeName, setStoreName] = useState('POS Bar & Taphouse');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [ticketHeader, setTicketHeader] = useState('¡Gracias por tu visita!\nCervezas Artesanales & Gastronomía');
  const [ticketFooter, setTicketFooter] = useState('Servicio de mesa no incluido • Propina voluntaria');
  const [defaultTipPercent, setDefaultTipPercent] = useState('10');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Configuración general guardada exitosamente');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-zinc-900 border border-zinc-700 text-zinc-100 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
          <Store className="w-4 h-4 text-amber-400" />
          <span>Configuración General del Negocio</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Datos de la empresa, identidad comercial, formato de comprobantes térmicos y propinas.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Datos Básicos */}
        <div className="space-y-3 pb-6 border-b border-zinc-850">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>Identidad del Local</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400 font-mono">Nombre del Comercio</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700"
                placeholder="Ej: Bar Central"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400 font-mono">Símbolo de Moneda</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-zinc-700"
                placeholder="$"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Comprobantes & Tickets */}
        <div className="space-y-3 pb-6 border-b border-zinc-850">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Receipt className="w-3.5 h-3.5 text-amber-400" />
            <span>Comprobantes y Tickets Térmicos</span>
          </h3>

          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400 font-mono">Encabezado de Ticket</label>
              <textarea
                rows={2}
                value={ticketHeader}
                onChange={(e) => setTicketHeader(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 resize-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400 font-mono">Pie de Ticket / Leyenda Legal</label>
              <textarea
                rows={2}
                value={ticketFooter}
                onChange={(e) => setTicketFooter(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 resize-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Propinas */}
        <div className="space-y-3 pb-6">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Percent className="w-3.5 h-3.5 text-amber-400" />
            <span>Propinas y Servicio</span>
          </h3>

          <div className="space-y-1 max-w-xs pt-1">
            <label className="text-[11px] font-medium text-zinc-400 font-mono">Porcentaje de Propina Sugerido</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={defaultTipPercent}
                onChange={(e) => setDefaultTipPercent(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-700 pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">%</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="btn-touch px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
}
