import React from 'react';
import { AlertTriangle, AlertCircle, HelpCircle, X, Check } from 'lucide-react';

import { create } from "zustand";
export const useConfirmation = create((set) => ({
  isOpen: false,
  config: null,
  confirm: (config) => set({ isOpen: true, config }),
  close: () => set({ isOpen: false, config: null })
}));

export function ConfirmationModal() {
  const { isOpen, config, close: closeConfirmation } = useConfirmation();
  const confirmationState = { isOpen, ...config };

  const stateRef = React.useRef({ confirmationState, closeConfirmation });
  React.useEffect(() => {
    stateRef.current = { confirmationState, closeConfirmation };
  });

  React.useEffect(() => {
    if (!confirmationState.isOpen) return;

    const handleKey = (e) => {
      const { confirmationState: state, closeConfirmation: close } = stateRef.current;
      if (!state.isOpen) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (state.onConfirm) {
          state.onConfirm();
        }
        close();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    };

    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [confirmationState.isOpen]);

  if (!confirmationState.isOpen) return null;

  const {
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'warning' // 'danger' | 'warning' | 'default'
  } = confirmationState;

  const handleConfirm = () => {
    if (confirmationState.onConfirm) confirmationState.onConfirm();
    closeConfirmation();
  };

  const variantStyles = {
    danger: {
      icon: AlertCircle,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/10 border-rose-500/20',
      btnConfirm: 'bg-rose-500 hover:bg-rose-600 text-white font-semibold'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      btnConfirm: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold'
    },
    default: {
      icon: HelpCircle,
      iconColor: 'text-zinc-300',
      iconBg: 'bg-zinc-800 border-zinc-700',
      btnConfirm: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold'
    }
  };

  const style = variantStyles[variant] || variantStyles.warning;
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-100">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl relative">
        <button
          onClick={closeConfirmation}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${style.iconBg}`}>
            <Icon className={`w-5 h-5 ${style.iconColor}`} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-100 leading-snug">{title}</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={closeConfirmation}
            className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-medium text-xs hover:bg-zinc-700 transition-colors"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`flex-1 py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 ${style.btnConfirm}`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
