import React from 'react';
import { WaitlistView } from '../components/admin/WaitlistView';

export function WaitlistAdminPage() {
  return (
    <div className="flex flex-col h-full bg-zinc-950 p-4 gap-4">
      <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-xl shrink-0">
        <h1 className="text-xl font-bold text-zinc-100">Administración de Lista de Espera</h1>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <WaitlistView />
      </div>
    </div>
  );
}
