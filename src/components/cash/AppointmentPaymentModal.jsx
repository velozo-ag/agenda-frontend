import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import { X, DollarSign, Check, Banknote, CreditCard, QrCode, Smartphone } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const METHODS = [
  { id: 'CASH', label: 'Efectivo', icon: Banknote },
  { id: 'DEBIT_CARD', label: 'Débito', icon: CreditCard },
  { id: 'CREDIT_CARD', label: 'Crédito', icon: CreditCard },
  { id: 'QR', label: 'MercadoPago / QR', icon: QrCode },
  { id: 'TRANSFER', label: 'Transferencia', icon: Smartphone }
];

export function AppointmentPaymentModal({ isOpen, onClose, appointment }) {
  const queryClient = useQueryClient();
  const [method, setMethod] = useState('CASH');
  const [cashReceived, setCashReceived] = useState('');
  
  const amount = appointment?.totalPrice || 0; // Or from appointment.service.price
  
  const paymentMutation = useMutation({
    mutationFn: (data) => paymentService.registerPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['shifts', 'current'] });
      onClose();
    },
  });

  if (!isOpen || !appointment) return null;

  const handleSave = (e) => {
    e.preventDefault();
    paymentMutation.mutate({
      appointmentId: appointment.id,
      method,
      amount,
      cashReceived: method === 'CASH' ? Number(cashReceived) : amount,
      isDeposit: false
    });
  };

  const change = method === 'CASH' && Number(cashReceived) > amount 
    ? Number(cashReceived) - amount 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-5 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-zinc-100 mb-4">Cobrar Cita</h2>

        <div className="mb-4">
          <p className="text-sm text-zinc-400">Total a cobrar:</p>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            ${amount.toLocaleString('es-AR')}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase">Método de Pago</label>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-sm font-medium transition-colors ${
                    method === m.id
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <m.icon className="w-4 h-4" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {method === 'CASH' && (
            <div className="space-y-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Efectivo Recibido</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    required
                    min={amount}
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-zinc-100 font-mono"
                    placeholder={amount.toString()}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Vuelto:</span>
                <span className="font-mono font-bold text-zinc-200">
                  ${change.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={paymentMutation.isPending}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm"
          >
            <Check className="w-4 h-4" />
            {paymentMutation.isPending ? 'Procesando...' : 'Confirmar Cobro'}
          </button>
        </form>
      </div>
    </div>
  );
}
