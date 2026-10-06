import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Image as ImageIcon,
  Landmark,
  Settings,
  Check,
  Scissors,
  Clock,
  CheckCircle2,
  Loader2,
  Copy
} from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import { useMyTenant, useUpdateBranding } from '../../hooks/useTenantBranding';
import { useAuth } from '../../context/AuthContext';
import { salonServiceService } from '../../services/salonServiceService';
import { scheduleService } from '../../services/scheduleService';
import { useBarbers } from '../../hooks/useBarbers';
import { WheelTimePicker } from '../common/WheelTimePicker';
import toast from 'react-hot-toast';

const COLOR_PALETTE = [
  { hex: '#a855f7', name: 'Violeta' },
  { hex: '#f43f5e', name: 'Rosa' },
  { hex: '#f59e0b', name: 'Ámbar' },
  { hex: '#10b981', name: 'Esmeralda' },
  { hex: '#3b82f6', name: 'Azul' },
  { hex: '#71717a', name: 'Plata' },
];

export function OnboardingTour() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: tenant } = useMyTenant();
  const updateBranding = useUpdateBranding();
  const { barbers } = useBarbers();
  
  const { 
    isTourOpen, 
    closeTour, 
    completeTour,
    onboardingStatus
  } = useOnboarding();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Branding
  const [storeName, setStoreName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#a855f7');

  // Step 2: Service
  const [catName, setCatName] = useState('Cortes');
  const [svcName, setSvcName] = useState('Corte Clásico');
  const [svcPrice, setSvcPrice] = useState('');
  const [svcDuration, setSvcDuration] = useState('30');

  // Step 3: Schedule
  const [scheduleDays, setScheduleDays] = useState([1, 2, 3, 4, 5, 6]); // Lun to Sab
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('20:00');

  useEffect(() => {
    if (tenant) {
      if (!storeName) setStoreName(tenant.storeName || tenant.name || '');
      if (tenant.primaryColor) setPrimaryColor(tenant.primaryColor);
    }
  }, [tenant]);

  // Preview the color dynamically globally
  useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty('--primary-color', primaryColor);
    }
  }, [primaryColor]);

  if (!isTourOpen) return null;

  const handleNext = async () => {
    setIsLoading(true);
    try {
      if (step === 0) {
        // Guardar Paso 1
        const brandPayload = {};
        if (storeName !== tenant?.storeName) brandPayload.storeName = storeName;
        if (primaryColor !== tenant?.primaryColor) brandPayload.primaryColor = primaryColor;
        
        if (Object.keys(brandPayload).length > 0) {
          await updateBranding.mutateAsync(brandPayload);
        }
        setStep(1);
      } else if (step === 1) {
        // Guardar Paso 2 (Servicio)
        if (svcName && svcPrice && !onboardingStatus?.hasServices) {
          const cat = await salonServiceService.createCategory({ name: catName, displayOrder: 0 });
          await salonServiceService.createService({
            categoryId: cat.id,
            name: svcName,
            price: Number(svcPrice),
            durationMinutes: Number(svcDuration),
            bufferMinutes: 0,
            depositAmount: 0,
            available: true,
            displayOrder: 0
          });
        }
        setStep(2);
      } else if (step === 2) {
        // Guardar Paso 3 (Horarios)
        const defaultBarber = barbers?.[0];
        if (defaultBarber) {
          const schedulesPayload = [1, 2, 3, 4, 5, 6, 7].map(day => ({
            dayOfWeek: day,
            startTime: startTime,
            endTime: endTime,
            isActive: scheduleDays.includes(day)
          }));
          await scheduleService.setSchedule(defaultBarber.id, { schedules: schedulesPayload });
        }
        setStep(3);
      } else if (step === 3) {
        // Temporal exit for now until we build step 4
        await completeTour();
        navigate('/agenda');
      } else {
        setStep(step + 1);
      }
    } catch (error) {
      toast.error('Ocurrió un error. Intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepsData = [
    { id: 'branding', title: 'Identidad' },
    { id: 'service', title: 'Tu Motor' },
    { id: 'schedule', title: 'Horarios' },
    { id: 'done', title: 'Lanzamiento' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-50 dark:bg-[#09090b] sm:p-6 animate-in fade-in duration-300">
      
      {/* Ambient Aura Background */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 ease-out"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 0%, var(--primary-color) 0%, transparent 60%)', 
        }} 
        // We use a CSS class to manage opacity between light/dark mode since inline styles can't easily use tailwind dark: modifiers for opacity if they aren't part of the class, wait, we can just use tailwind classes for opacity!
        // Actually, since the background image is inline, the opacity can be a tailwind class:
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, var(--primary-color) 0%, transparent 60%)' }} />

      {/* Main Card Container */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white/90 dark:bg-[#0f0f11]/90 backdrop-blur-2xl sm:rounded-[2rem] border-0 sm:border border-zinc-200 dark:border-white/[0.08] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-700 shadow-2xl shadow-zinc-200/50 dark:shadow-black">
        
        {/* Header - Editorial & Sleek */}
        <header className="relative z-10 px-6 sm:px-8 py-6 flex items-center justify-between shrink-0">
          <div className="text-zinc-400 dark:text-white/40 font-mono text-xs tracking-widest font-medium w-24">
            0{step + 1} / 04
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-3">
            <img 
              src="/roosty2.png" 
              alt="Roosty" 
              className="h-5 sm:h-6 object-contain opacity-90 dark:opacity-100 dark:invert" 
              onError={(e) => {
                e.target.style.display = 'none'; // Fallback if image path is broken
              }}
            />
            <span className="text-zinc-300 dark:text-white/20">|</span>
            <span className="text-zinc-900 dark:text-white/90 text-[10px] sm:text-xs font-bold tracking-[0.1em] uppercase max-w-[120px] sm:max-w-[200px] truncate">
              {storeName || 'TU LOCAL'}
            </span>
          </div>

          <div className="w-24" /> {/* Spacer to balance flex-between */}
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 overflow-y-auto hide-scrollbar px-6 sm:px-12 py-6 sm:py-8 flex flex-col">
          
          {/* STEP 1: BRANDING */}
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-lg mx-auto my-auto">
              
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
                  Bienvenido a Roosty Agenda
                </h1>
                <p className="text-zinc-500 dark:text-white/50 text-base sm:text-lg font-light">
                  Vamos a darle vida a tu portal de reservas.
                </p>
              </div>

              <div className="space-y-8">
                {/* Input Nombre */}
                <div>
                  <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-3 text-center sm:text-left">
                    ¿Cómo se llama tu local?
                  </label>
                  <input 
                    type="text" 
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-6 py-4 text-xl font-medium text-zinc-900 dark:text-white text-center sm:text-left outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20 shadow-sm dark:shadow-none"
                    placeholder="Ej: Studio 54"
                  />
                </div>

                {/* Selector de Color */}
                <div>
                  <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-4 text-center sm:text-left">
                    Color de tu marca
                  </label>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    {COLOR_PALETTE.map(color => (
                      <button
                        key={color.hex}
                        onClick={() => setPrimaryColor(color.hex)}
                        className={`relative w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                          primaryColor === color.hex 
                            ? 'ring-2 ring-offset-4 ring-[var(--primary-color)] ring-offset-zinc-50 dark:ring-offset-[#0f0f11]' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {primaryColor === color.hex && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Educational Info Block (Mobile-Friendly) */}
                <div className="mt-8 bg-zinc-100/50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-5 sm:p-6 backdrop-blur-md">
                  <h4 className="text-zinc-800 dark:text-white/90 font-medium text-sm mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-zinc-500 dark:text-white/50" />
                    ¿Qué sigue después?
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-200/50 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4 text-zinc-600 dark:text-white/60" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-800 dark:text-white/80">Logo y Portada</p>
                        <p className="text-xs text-zinc-500 dark:text-white/40 mt-0.5">Para que tus clientes te reconozcan visualmente.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-200/50 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <Landmark className="w-4 h-4 text-zinc-600 dark:text-white/60" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-800 dark:text-white/80">Alias / CBU</p>
                        <p className="text-xs text-zinc-500 dark:text-white/40 mt-0.5">Para poder cobrar señas obligatorias en tus turnos.</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-white/30 mt-5 leading-relaxed bg-white dark:bg-white/5 p-3 rounded-lg border border-zinc-200 dark:border-transparent">
                    Para que arranques rápido, configuraremos esto más adelante desde tu panel de Configuración.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SERVICE */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-lg mx-auto my-auto mt-4 sm:mt-8">
              
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
                  Tu primer servicio
                </h1>
                <p className="text-zinc-500 dark:text-white/50 text-base sm:text-lg font-light">
                  Agreguemos el servicio más popular de tu local para arrancar.
                </p>
              </div>

              {onboardingStatus?.hasServices ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Servicios Activos</h3>
                  <p className="text-zinc-500 dark:text-white/50 mt-2">Ya detectamos que configuraste servicios en tu catálogo.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-2">Categoría</label>
                      <input 
                        type="text" 
                        value={catName}
                        onChange={e => setCatName(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-lg font-medium text-zinc-900 dark:text-white outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20 shadow-sm dark:shadow-none"
                        placeholder="Ej: Cortes"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-2">Nombre del Servicio</label>
                      <input 
                        type="text" 
                        value={svcName}
                        onChange={e => setSvcName(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-lg font-medium text-zinc-900 dark:text-white outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20 shadow-sm dark:shadow-none"
                        placeholder="Ej: Corte Clásico"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-2">Precio ($)</label>
                      <input 
                        type="number" 
                        value={svcPrice}
                        onChange={e => setSvcPrice(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-lg font-medium text-zinc-900 dark:text-white outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20 shadow-sm dark:shadow-none num-tabular"
                        placeholder="Ej: 8000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-2">Duración Estimada</label>
                      <select 
                        value={svcDuration}
                        onChange={e => setSvcDuration(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-lg font-medium text-zinc-900 dark:text-white outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] focus:bg-white dark:focus:bg-white/10 transition-all appearance-none shadow-sm dark:shadow-none"
                      >
                        <option value="15" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">15 Minutos</option>
                        <option value="30" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">30 Minutos</option>
                        <option value="45" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">45 Minutos</option>
                        <option value="60" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">60 Minutos</option>
                        <option value="90" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">90 Minutos</option>
                        <option value="120" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">120 Minutos</option>
                      </select>
                    </div>
                  </div>

                  {/* Live Preview Card */}
                  <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/10">
                    <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-white/30 mb-5 text-center">
                      Previsualización para el cliente
                    </span>
                    
                    <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary-color)]">
                          {catName || 'Categoría'}
                        </span>
                        <h4 className="text-zinc-900 dark:text-white font-bold text-xl mt-0.5">
                          {svcName || 'Nombre del Servicio'}
                        </h4>
                        <p className="text-zinc-500 dark:text-white/50 text-sm mt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {svcDuration} min
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-zinc-900 dark:text-white font-bold text-xl">
                          ${svcPrice || '0'}
                        </p>
                        <button className="mt-2 px-5 py-2 bg-[var(--primary-color)] text-white text-xs font-bold rounded-xl opacity-50 pointer-events-none">
                          Reservar
                        </button>
                      </div>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SCHEDULES */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-lg mx-auto my-auto mt-4 sm:mt-8">
              
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
                  Tus horarios base
                </h1>
                <p className="text-zinc-500 dark:text-white/50 text-base sm:text-lg font-light">
                  El sistema calculará tus espacios libres automáticamente.
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-4 text-center">
                    Días laborales
                  </label>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {[
                      { id: 1, label: 'L' },
                      { id: 2, label: 'M' },
                      { id: 3, label: 'X' },
                      { id: 4, label: 'J' },
                      { id: 5, label: 'V' },
                      { id: 6, label: 'S' },
                      { id: 7, label: 'D' },
                    ].map(day => (
                      <button
                        key={day.id}
                        onClick={() => {
                          if (scheduleDays.includes(day.id)) {
                            setScheduleDays(scheduleDays.filter(d => d !== day.id));
                          } else {
                            setScheduleDays([...scheduleDays, day.id]);
                          }
                        }}
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full text-sm font-bold transition-all flex items-center justify-center ${
                          scheduleDays.includes(day.id) 
                            ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/30' 
                            : 'bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-white/40 hover:bg-zinc-200 dark:hover:bg-white/10'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-3 text-center sm:text-left">
                      Apertura
                    </label>
                    <WheelTimePicker value24h={startTime} onChange24h={setStartTime} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-3 text-center sm:text-left">
                      Cierre
                    </label>
                    <WheelTimePicker value24h={endTime} onChange24h={setEndTime} />
                  </div>
                </div>
              </div>
              
            </div>
          )}

          {/* STEP 4: LAUNCH */}
          {step === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-lg mx-auto my-auto mt-4 sm:mt-8 text-center pb-20 sm:pb-8">
              
              <div className="w-20 h-20 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[var(--primary-color)]/10 dark:shadow-[var(--primary-color)]/20">
                <CheckCircle2 className="w-10 h-10 text-[var(--primary-color)]" />
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
                Ya estás en línea
              </h1>
              <p className="text-zinc-500 dark:text-white/50 text-sm sm:text-base font-light mb-8 max-w-md mx-auto px-4">
                Tu plataforma está configurada. Descargá tu código QR, compartí tu link y empezá a recibir reservas 24/7.
              </p>

              {/* QR Code and Link Area */}
              <div className="bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 mb-6">
                
                {/* QR Display */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-zinc-200 mb-3">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://${tenant?.slug || 'demo'}.agenda.roosty.site`} 
                      alt="Código QR"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://${tenant?.slug || 'demo'}.agenda.roosty.site`;
                        const res = await fetch(url);
                        const blob = await res.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = `QR-${tenant?.slug || 'local'}.png`;
                        a.click();
                        URL.revokeObjectURL(blobUrl);
                        toast.success('¡QR descargado!');
                      } catch (e) {
                        toast.error('Error al descargar el QR');
                      }
                    }}
                    className="text-xs font-bold text-[var(--primary-color)] hover:opacity-80 transition-opacity bg-[var(--primary-color)]/10 px-4 py-2 rounded-lg"
                  >
                    Descargar QR
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-black/20 rounded-xl p-3 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none">
                  <span className="text-zinc-900 dark:text-white font-medium text-sm truncate mr-4">
                    {tenant?.slug || 'tu-local'}.agenda.roosty.site
                  </span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://${tenant?.slug || 'tu-local'}.agenda.roosty.site`);
                      toast.success('¡Link copiado!');
                    }}
                    className="w-10 h-10 shrink-0 rounded-lg bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-zinc-600 dark:text-white/60 hover:bg-[var(--primary-color)] hover:text-white dark:hover:bg-[var(--primary-color)] dark:hover:text-white transition-colors"
                    title="Copiar Link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Informative Tips */}
              <div className="space-y-2 text-left bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-transparent rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <Scissors className="w-4 h-4 text-zinc-400 dark:text-white/40 mt-0.5 shrink-0" />
                  <p className="text-xs text-zinc-600 dark:text-white/60 leading-relaxed">
                    <strong>Servicios:</strong> Para agregar más opciones a tu catálogo, andá a la sección <span className="font-semibold text-zinc-900 dark:text-white">Servicios</span>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Settings className="w-4 h-4 text-zinc-400 dark:text-white/40 mt-0.5 shrink-0" />
                  <p className="text-xs text-zinc-600 dark:text-white/60 leading-relaxed">
                    <strong>Ajustes:</strong> Modificá tus horarios, francos y datos de pago desde <span className="font-semibold text-zinc-900 dark:text-white">Configuración</span>.
                  </p>
                </div>
              </div>

            </div>
          )}
        </main>

        {/* Footer Navigation - Spline Style */}
        <footer className="relative z-10 w-full px-6 sm:px-12 py-6 shrink-0">
          {step === 3 ? (
            <div className="flex justify-center w-full">
              <button 
                onClick={handleNext}
                disabled={isLoading}
                className="w-full max-w-sm py-4 bg-zinc-900 text-white dark:bg-white dark:text-[#09090b] text-base font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {!isLoading && 'Ir a mi Agenda'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              {/* Back Button */}
              <button 
                onClick={() => step > 0 ? setStep(step - 1) : closeTour()}
                disabled={isLoading}
                className="text-zinc-500 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-medium flex items-center gap-1 py-2"
              >
                {step === 0 ? 'Omitir' : <><ChevronLeft className="w-4 h-4" /> Atrás</>}
              </button>
              
              {/* Dot Pagination */}
              <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                {stepsData.map((s, i) => (
                  <div 
                    key={s.id} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === step 
                        ? 'w-8 bg-[var(--primary-color)]' 
                        : 'w-1.5 bg-zinc-300 dark:bg-white/10'
                    }`} 
                  />
                ))}
              </div>

              {/* Next Button */}
              <button 
                onClick={handleNext}
                disabled={isLoading || (step === 0 && !storeName)}
                className="px-6 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-[#09090b] font-bold rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 shadow-lg"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!isLoading && 'Siguiente'}
              </button>
            </div>
          )}
        </footer>
      </div>

      {/* Global override to ensure body doesn't scroll and hides scrollbars inside */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
