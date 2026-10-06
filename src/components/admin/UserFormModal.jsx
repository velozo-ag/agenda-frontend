import React, { useState, useEffect } from 'react';
import { X, User, Check, Shield, KeyRound, Lock } from 'lucide-react';
import { userService } from '../../services/userService';

export function UserFormModal({ isOpen, onClose, userToEdit, onSaved }) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('BARBER');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.username || '');
      setFullName(userToEdit.fullName || '');
      setRole(userToEdit.role || 'BARBER');
      setPassword('');
      setPin(userToEdit.pin ? '' : '');
    } else {
      setUsername('');
      setFullName('');
      setRole('BARBER');
      setPassword('');
      setPin('');
    }
    setError(null);
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('El nombre de usuario es obligatorio');
      return;
    }
    if (!fullName.trim()) {
      setError('El nombre completo es obligatorio');
      return;
    }
    if (username.trim().toLowerCase() === 'superadmin') {
      setError('El nombre de usuario "superadmin" está reservado para la plataforma');
      return;
    }
    if (!userToEdit && (!password || password.length < 6)) {
      setError('La contraseña inicial debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      username: username.trim().toLowerCase(),
      fullName: fullName.trim(),
      role: role.toUpperCase(),
      password: password || undefined,
      pin: pin.trim() || undefined,
    };

    try {
      if (userToEdit) {
        await userService.update(userToEdit.id, payload);
      } else {
        await userService.create(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Configura accesos y rol en el sistema</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej: Lucas Benítez"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Usuario (Login) *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="lucas"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Rol del Sistema *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500/50 cursor-pointer transition-colors"
                required
              >
                <option value="BARBER">Barbero</option>
                <option value="ADMIN">Administrador (Total)</option>
              </select>
            </div>
          </div>

          {!userToEdit && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Contraseña Inicial *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                  required={!userToEdit}
                  minLength={6}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>PIN de Acceso (4 dígitos, opcional)</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Para desbloqueo rápido</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                maxLength={10}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ej: 1234"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Guardando...' : userToEdit ? 'Actualizar' : 'Crear Usuario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
