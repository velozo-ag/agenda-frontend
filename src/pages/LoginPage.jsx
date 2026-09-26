import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenantBranding, applyTenantTheme } from '../hooks/useTenantBranding';
import { getImageUrl } from '../utils/imageUrl';
import { Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { data: branding, isLoading } = useTenantBranding();

  const storeName = branding?.storeName || branding?.name || 'Roosty Agenda';
  const logoUrl = branding?.logoUrl;
  const primaryColor = branding?.primaryColor || '#f59e0b';
  const [logoFailed, setLogoFailed] = useState(false);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (branding) {
      applyTenantTheme(branding, 'Ingreso Staff');
    }
  }, [branding]);

  useEffect(() => {
    if (searchParams.get('error') === 'tenant_inactive') {
      setError('El servicio de este local se encuentra actualmente pausado o suspendido. Contacte a soporte o administración.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor complete todos los campos');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const loggedUser = await login(username.trim(), password);
      const isSuperAdmin = loggedUser?.role === 'SUPER_ADMIN' || loggedUser?.role === 'SUPERADMIN' || loggedUser?.username === 'superadmin';
      if (isSuperAdmin) {
        navigate('/superadmin');
      } else {
        navigate('/agenda');
      }
    } catch (err) {
      setError(err.message || 'Credenciales inválidas. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sleek initial loader preventing any flash of unbranded / default content
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 selection:bg-orange-500 selection:text-white">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shadow-lg">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
          <span className="text-xs font-mono text-zinc-500">Cargando sistema...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 selection:bg-orange-500 selection:text-white animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-xl relative z-10 space-y-6">
        {/* Header / Brand */}
        <div className="text-center space-y-2">
          {logoUrl && !logoFailed ? (
            <div className="flex items-center justify-center mb-2">
              <img
                src={getImageUrl(logoUrl)}
                alt={storeName}
                className="h-16 w-auto max-w-[200px] object-contain"
                onError={() => setLogoFailed(true)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center mb-3">
              <img
                src="/icon-R.png"
                alt="Roosty Logo"
                className="w-14 h-14 object-contain filter drop-shadow-md"
              />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            {storeName}
          </h1>
          <p className="text-sm text-zinc-400">
            Ingresá tus credenciales para acceder al sistema
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 text-sm font-medium transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 text-sm font-medium transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Fat-Finger Touch Friendly Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: primaryColor }}
            className="w-full mt-2 py-3.5 px-4 active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info & Roosty endorsement */}
        <div className="text-center pt-3 border-t border-zinc-800/60 space-y-3">
          <p className="text-xs text-zinc-500">
            Usuario demo: <span className="text-zinc-300 font-mono">admin</span> | Clave: <span className="text-zinc-300 font-mono">admin123</span>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
            <span>Potenciado por</span>
            <img
              src="/roosty2.png"
              alt="roosty."
              className="h-3.5 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity inline-block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
