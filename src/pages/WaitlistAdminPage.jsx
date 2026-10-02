import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { WaitlistView } from '../components/admin/WaitlistView';

export function WaitlistAdminPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 p-3 sm:p-6 gap-4">
      {/* ─── Top Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md p-4 rounded-2xl shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/agenda')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all text-xs font-bold cursor-pointer active:scale-95 shrink-0"
            title="Volver a la Agenda"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Agenda</span>
          </button>
          <div className="w-px h-6 bg-zinc-800 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h1 className="text-lg sm:text-xl font-black text-zinc-100 tracking-tight">Lista de Espera</h1>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Clientes aguardando turnos liberados. Podés asignarles un turno directamente o contactarlos por WhatsApp.
            </p>
          </div>
        </div>
      </div>
      
      {/* ─── Main Content ─── */}
      <div className="flex-1 overflow-hidden">
        <WaitlistView />
      </div>
    </div>
  );
}
