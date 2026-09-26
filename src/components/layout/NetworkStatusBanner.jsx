import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setErrorMessage('');
    };

    const handleOffline = () => {
      setIsOffline(true);
      setErrorMessage('Sin conexión a Internet en este dispositivo');
    };

    const handlePosNetworkError = (e) => {
      setIsOffline(true);
      setErrorMessage(e.detail?.message || 'Sin conexión con el servidor POS');
    };

    const handlePosNetworkOnline = () => {
      setIsOffline(false);
      setErrorMessage('');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('pos:network-error', handlePosNetworkError);
    window.addEventListener('pos:network-online', handlePosNetworkOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('pos:network-error', handlePosNetworkError);
      window.removeEventListener('pos:network-online', handlePosNetworkOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-rose-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg sticky top-0 z-[100] animate-in slide-in-from-top duration-200 select-none">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 animate-pulse flex-shrink-0" />
        <span>⚠ {errorMessage || 'Sin conexión con el servidor — Reintentando sincronización automáticamente...'}</span>
      </div>
      <div className="flex items-center gap-1 text-[11px] opacity-90">
        <RefreshCw className="w-3 h-3 animate-spin" />
        <span className="hidden sm:inline font-mono">Reconectando...</span>
      </div>
    </div>
  );
}
