import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function AutoLoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const processAutoLogin = async () => {
      try {
        // Limpiar inmediatamente el token de la URL para que no quede en el historial del browser
        if (typeof window !== 'undefined' && window.history) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        await loginWithToken(token);
        navigate('/agenda', { replace: true });
      } catch (err) {
        console.error('Error durante auto-login:', err);
        setErrorMsg('No se pudo verificar el acceso automático. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    processAutoLogin();
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 p-4 select-none">
      <div className="flex flex-col items-center gap-5 max-w-sm w-full text-center">
        {/* Roosty Logo with subtle spinner */}
        <div className="relative">
          <img
            src="/icon-R.png"
            alt="Roosty"
            className="w-16 h-16 object-contain filter drop-shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 bg-zinc-900 rounded-full p-1 border border-zinc-800 shadow-md">
            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Iniciando sesión en tu demo</h2>
          <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
            {errorMsg || 'Aprovisionando la agenda con los datos de tu local...'}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <span>Potenciado por</span>
          <img
            src="/roosty2.png"
            alt="roosty."
            className="h-3.5 w-auto brightness-0 invert opacity-50"
          />
        </div>
      </div>
    </div>
  );
}

export default AutoLoginPage;
