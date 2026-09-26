import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useBarbers } from '../../hooks/useBarbers';

export default function BarberFormModal({ isOpen, onClose, barberToEdit }) {
  const { createBarber, updateBarber } = useBarbers();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    bio: '',
    color: '#3b82f6',
    commissionPct: 0,
    avatarUrl: ''
  });

  useEffect(() => {
    if (barberToEdit) {
      setFormData({
        fullName: barberToEdit.fullName || '',
        email: barberToEdit.email || '',
        password: '', // blank for edit
        bio: barberToEdit.bio || '',
        color: barberToEdit.color || '#3b82f6',
        commissionPct: barberToEdit.commissionPct || 0,
        avatarUrl: barberToEdit.avatarUrl || ''
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        password: '',
        bio: '',
        color: '#3b82f6',
        commissionPct: 0,
        avatarUrl: ''
      });
    }
  }, [barberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      fullName: formData.fullName,
      email: formData.email,
      bio: formData.bio,
      color: formData.color,
      commissionPct: parseFloat(formData.commissionPct),
      avatarUrl: formData.avatarUrl
    };
    
    if (formData.password) {
      data.password = formData.password;
    }

    if (barberToEdit) {
      updateBarber.mutate({ id: barberToEdit.id, data }, { onSuccess: () => onClose() });
    } else {
      createBarber.mutate(data, { onSuccess: () => onClose() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-white">
            {barberToEdit ? 'Editar Barbero' : 'Nuevo Barbero'}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nombre Completo</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email (Usuario)</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              {barberToEdit ? 'Cambiar Contraseña (opcional)' : 'Contraseña Inicial'}
            </label>
            <input
              type="password"
              name="password"
              required={!barberToEdit}
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Color del Calendario</label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full h-[46px] bg-zinc-950 border border-zinc-800 rounded-xl p-1 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Comisión (%)</label>
              <input
                type="number"
                name="commissionPct"
                min="0"
                max="100"
                step="0.1"
                value={formData.commissionPct}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Avatar URL (Opcional)</label>
            <input
              type="url"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Biografía (visible al cliente)</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createBarber.isPending || updateBarber.isPending}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
