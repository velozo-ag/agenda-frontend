import React, { useState } from 'react';
import { useJoinWaitlist } from '../../hooks/useBooking';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function WaitlistForm({ slug, date, serviceId, barberId, onClose }) {
  const [formData, setFormData] = useState({ clientName: '', clientEmail: '', clientPhone: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { mutate: joinWaitlist, isPending } = useJoinWaitlist(slug);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientEmail) return;

    joinWaitlist({
      serviceId,
      barberId,
      preferredDate: date,
      ...formData
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          if (onClose) onClose();
        }, 3000);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center animate-in fade-in zoom-in-95">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-bold text-xl mb-2 text-zinc-100">¡Estás en la lista!</h3>
        <p className="text-zinc-400">Te avisaremos por email o teléfono si se libera un turno en la fecha que elegiste.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 animate-in slide-in-from-bottom-4">
      <h3 className="font-bold text-xl mb-2">Anotarme a la Lista de Espera</h3>
      <p className="text-sm text-zinc-400 mb-6">Dejanos tus datos y te avisaremos si alguien cancela y se libera un turno.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Nombre Completo *</label>
          <input 
            type="text" 
            required 
            value={formData.clientName}
            onChange={e => setFormData({...formData, clientName: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 h-12 text-zinc-100 focus:outline-none focus:border-amber-500/50" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Email *</label>
          <input 
            type="email" 
            required 
            value={formData.clientEmail}
            onChange={e => setFormData({...formData, clientEmail: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 h-12 text-zinc-100 focus:outline-none focus:border-amber-500/50" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Teléfono (WhatsApp)</label>
          <input 
            type="tel" 
            value={formData.clientPhone}
            onChange={e => setFormData({...formData, clientPhone: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 h-12 text-zinc-100 focus:outline-none focus:border-amber-500/50" 
            placeholder="Ej: 1122334455"
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isPending || !formData.clientName || !formData.clientEmail}
            className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Anotarme'}
          </button>
        </div>
      </form>
    </div>
  );
}
