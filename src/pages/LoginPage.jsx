import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenantBranding, applyTenantTheme } from '../hooks/useTenantBranding';
import { getImageUrl } from '../utils/imageUrl';
import { Lock, User, AlertCircle, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { data: branding, isLoading } = useTenantBranding();

  const storeName = branding?.storeName || branding?.name || 'Roosty Agenda';
  const logoUrl = branding?.logoUrl;
  const primaryColor = branding?.primaryColor || '#f59e0b';
  const [logoFailed, setLogoFailed] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 selection:bg-white selection:text-black animate-in fade-in duration-500 relative overflow-hidden">
      
      {/* Premium Ambient Glow */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${primaryColor}40, transparent 70%)`
        }}
      />

      <div className="w-full max-w-sm relative z-10 space-y-8">
        
        {/* Header / Brand */}
        <div className="text-center space-y-4">
          {logoUrl && !logoFailed ? (
            <div className="flex items-center justify-center">
              <img
                src={getImageUrl(logoUrl)}
                alt={storeName}
                className="h-16 w-auto max-w-[200px] object-contain drop-shadow-2xl"
                onError={() => setLogoFailed(true)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-zinc-800 to-zinc-700 rounded-2xl flex items-center justify-center shadow-xl border border-zinc-700/50">
                 <img
                  src="/icon-R.png"
                  alt="Roosty Logo"
                  className="w-8 h-8 object-contain filter drop-shadow-md brightness-200"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Bienvenido a {storeName}
            </h1>
            <p className="text-sm text-zinc-400 font-medium">
              Ingresá tus credenciales para acceder
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-zinc-300 ml-1">
                Usuario
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-white transition-colors">
                  <User className="w-[18px] h-[18px]" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. admin"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent text-[15px] transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-zinc-300 ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-white transition-colors">
                  <Lock className="w-[18px] h-[18px]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent text-[15px] transition-all"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: primaryColor }}
              className="w-full mt-2 py-4 px-4 active:scale-[0.98] hover:brightness-110 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed text-[15px] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info & Roosty endorsement */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-white/5 text-[11px] font-medium text-zinc-500 backdrop-blur-sm">
            <span>Powered by</span>
            <img
              src="/roosty2.png"
              alt="roosty."
              className="h-3 w-auto brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
