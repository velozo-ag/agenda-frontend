import React, { useState, useEffect } from 'react';
import { X, User, Scissors } from 'lucide-react';
import { useBarbers } from '../../hooks/useBarbers';
import { ImageUploader } from '../ui/ImageUploader';

const COLOR_PRESETS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#a855f7', // purple
  '#eab308', // yellow
];

export default function BarberFormModal({ isOpen, onClose, barberToEdit }) {
  const { createBarber, updateBarber } = useBarbers();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    bio: '',
    color: '#6366f1',
    commissionPct: 0,
    avatarUrl: '',
  });

  useEffect(() => {
    if (barberToEdit) {
      setFormData({
        fullName: barberToEdit.fullName || '',
        email: barberToEdit.email || '',
        password: '',
        bio: barberToEdit.bio || '',
        color: barberToEdit.color || '#6366f1',
        commissionPct: barberToEdit.commissionPct || 0,
        avatarUrl: barberToEdit.avatarUrl || '',
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        password: '',
        bio: '',
        color: '#6366f1',
        commissionPct: 0,
        avatarUrl: '',
      });
    }
  }, [barberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      fullName: formData.fullName,
      email: formData.email,
      bio: formData.bio,
      color: formData.color,
      commissionPct: parseFloat(formData.commissionPct),
      avatarUrl: formData.avatarUrl,
    };
    if (formData.password) data.password = formData.password;

    if (barberToEdit) {
      updateBarber.mutate({ id: barberToEdit.id, data }, { onSuccess: () => onClose() });
    } else {
      createBarber.mutate(data, { onSuccess: () => onClose() });
    }
  };

  const isPending = createBarber.isPending || updateBarber.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="text-sm font-bold text-white">
              {barberToEdit ? 'Editar Barbero' : 'Nuevo Barbero'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">

          {/* Avatar */}
          <ImageUploader
            label="Foto del Barbero"
            description="Foto de perfil visible en el portal de reservas (cuadrada o circular). JPG, PNG o WEBP."
            value={formData.avatarUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, avatarUrl: url }))}
            previewAspect="square"
          />

          {/* Nombre */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 font-mono mb-1.5">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ej: Carlos RodrÃ­guez"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 font-mono mb-1.5">
              Usuario de acceso *
            </label>
            <input
              type="text"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="ej. agustin, o correo"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>

          {/* ContraseÃ±a */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 font-mono mb-1.5">
              {barberToEdit ? 'Cambiar ContraseÃ±a (opcional)' : 'ContraseÃ±a Inicial *'}
            </label>
            <input
              type="password"
              name="password"
              required={!barberToEdit}
              value={formData.password}
              onChange={handleChange}
              placeholder={barberToEdit ? 'DejÃ¡ vacÃ­o para no cambiarla' : 'ContraseÃ±a inicial'}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>

          {/* Color + ComisiÃ³n */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 font-mono mb-1.5">
                Color en Agenda
              </label>
              {/* Color presets */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, color: c }))}
                    className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                      formData.color === c ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full h-9 bg-zinc-950 border border-zinc-800 rounded-xl p-1 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 font-mono mb-1.5">
                ComisiÃ³n (%)
              </label>
              <input
                type="number"
                name="commissionPct"
                min="0"
                max="100"
                step="0.5"
                value={formData.commissionPct}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
              <p className="text-[10px] text-zinc-600 font-mono mt-1">% sobre sus citas</p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 font-mono mb-1.5">
              BiografÃ­a (visible en el portal de reservas)
            </label>
            <textarea
              name="bio"
              rows={2}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Ej: Especialista en cortes fade y barbas..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && (
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {barberToEdit ? 'Guardar Cambios' : 'Crear Barbero'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
