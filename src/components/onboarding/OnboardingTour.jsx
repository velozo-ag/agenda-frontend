import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Image as ImageIcon,
  Landmark,
  Settings,
  Check,
  Scissors,
  CheckCircle2,
  Loader2,
  Copy,
  Clock,
  Palette,
  Link2,
  Download
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
  const [contactPhone, setContactPhone] = useState('');

  // Step 2: Service
  const [catName, setCatName] = useState('Cortes');
  const [svcName, setSvcName] = useState('Corte Clásico');
  const [svcPrice, setSvcPrice] = useState('');
  const [svcDuration, setSvcDuration] = useState('30');

  // Step 3: Schedule
  const [scheduleDays, setScheduleDays] = useState([1, 2, 3, 4, 5, 6]); 
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [useSplitShift, setUseSplitShift] = useState(false);
  const [startTime2, setStartTime2] = useState('15:00');
  const [endTime2, setEndTime2] = useState('20:00');

  useEffect(() => {
    if (tenant) {
      if (!storeName) setStoreName(tenant.storeName || tenant.name || '');
      if (tenant.primaryColor) setPrimaryColor(tenant.primaryColor);
      if (tenant.whatsappNumber) setContactPhone(tenant.whatsappNumber);
    }
  }, [tenant]);

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
        const brandPayload = {};
        if (storeName !== tenant?.storeName) brandPayload.storeName = storeName;
        if (primaryColor !== tenant?.primaryColor) brandPayload.primaryColor = primaryColor;
        if (contactPhone !== tenant?.whatsappNumber) brandPayload.whatsappNumber = contactPhone;
        
        if (Object.keys(brandPayload).length > 0) {
          await updateBranding.mutateAsync(brandPayload);
        }
        setStep(1);
      } else if (step === 1) {
        if (!onboardingStatus?.hasServices) {
          if (!catName || !svcName || !svcPrice) {
            toast.error('Completá los datos del servicio para continuar.');
            setIsLoading(false);
            return;
          }
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
        const defaultBarber = barbers?.[0];
        if (defaultBarber) {
          const schedulesPayload = [1, 2, 3, 4, 5, 6, 7].map(day => ({
            dayOfWeek: day,
            startTime: startTime,
            endTime: endTime,
            startTime2: useSplitShift ? startTime2 : null,
            endTime2: useSplitShift ? endTime2 : null,
            isActive: scheduleDays.includes(day)
          }));
          await scheduleService.setSchedule(defaultBarber.id, { schedules: schedulesPayload });
        }
        setStep(3);
      } else if (step === 3) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-50/70 dark:bg-[#09090b]/70 sm:bg-black/30 sm:backdrop-blur-sm sm:p-6 animate-in fade-in duration-500">
      
      <style dangerouslySetInnerHTML={{__html: `
        :root { transition: --primary-color 0.8s ease-in-out; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="relative w-full h-full sm:h-[80vh] sm:max-h-[750px] sm:w-[90vw] sm:max-w-[1000px] bg-white/70 dark:bg-[#0c0c0e]/80 sm:backdrop-blur-3xl sm:rounded-[2rem] border-0 sm:border border-zinc-200/50 dark:border-white/[0.08] flex flex-col overflow-hidden shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 transition-all duration-500">
        
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.10] z-0 transition-colors duration-1000"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, var(--primary-color) 0%, transparent 60%)' }} 
        />

        {/* Header */}
        <header className="relative z-10 px-6 py-6 sm:px-8 sm:py-8 flex items-center justify-between shrink-0">
          <div className="text-zinc-400 dark:text-white/40 font-mono text-[11px] tracking-[0.2em] font-medium w-24">
            0{step + 1} / 04
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-3">
            <img 
              src="/roosty2.png" 
              alt="Roosty" 
              className="h-4 sm:h-5 object-contain opacity-70 dark:opacity-90 dark:invert transition-all" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-zinc-300 dark:text-white/10">|</span>
            <span className="text-zinc-900 dark:text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase truncate max-w-[150px]">
              {storeName || 'QUICK SETUP'}
            </span>
          </div>

          <div className="w-24" />
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex-1 overflow-y-auto hide-scrollbar px-6 sm:px-12 pb-8 flex flex-col">
          
          {/* STEP 1: BRANDING */}
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-2xl mx-auto min-h-full flex flex-col">
              
              <div className="text-center shrink-0 mt-20 sm:mt-6 mb-2 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  Identidad de tu local
                </h1>
                <p className="text-zinc-500 dark:text-white/40 text-sm sm:text-base font-light">
                  Vamos a personalizar tu plataforma.
                </p>
              </div>

              <div className="my-auto w-full flex flex-col gap-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-2">Nombre del Local</label>
                    <input 
                      type="text" 
                      value={storeName}
                      onChange={e => setStoreName(e.target.value)}
                      className="w-full bg-zinc-100/50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-base font-medium text-zinc-900 dark:text-white outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] focus:bg-white dark:focus:bg-white/[0.05] transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20 shadow-sm"
                      placeholder="Ej: Studio 54 Barber"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-2">Color de Marca</label>
                    <div className="flex flex-wrap gap-2.5">
                      {COLOR_PALETTE.map(color => (
                        <button
                          key={color.hex}
                          onClick={() => setPrimaryColor(color.hex)}
                          className={`relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                            primaryColor === color.hex 
                              ? 'ring-2 ring-offset-4 ring-[var(--primary-color)] ring-offset-zinc-50 dark:ring-offset-[#0c0c0e] scale-110' 
                              : 'opacity-50 hover:opacity-100 shadow-sm'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {primaryColor === color.hex && <Check className="w-4 h-4 text-white drop-shadow-md animate-in zoom-in" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full pt-6 border-t border-zinc-200 dark:border-white/5">
                  <h3 className="text-xs font-bold text-zinc-400 dark:text-white/30 mb-5 text-center sm:text-left uppercase tracking-[0.15em]">
                    ¿Qué podrás configurar después?
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-4 bg-white/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-zinc-200 dark:border-white/5 items-center shadow-sm">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)]">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">Alias para transferencias</h4>
                        <p className="text-xs text-zinc-500 dark:text-white/50 mt-0.5 leading-tight">
                          CBU/Alias para recibir señas.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 bg-white/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-zinc-200 dark:border-white/5 items-center shadow-sm">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)]">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">Logo y background</h4>
                        <p className="text-xs text-zinc-500 dark:text-white/50 mt-0.5 leading-tight">
                          Imágenes para el panel al público.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: SERVICE */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-4xl mx-auto min-h-full flex flex-col">
              
              <div className="text-center shrink-0 mt-20 sm:mt-6 mb-2 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  Tu primer servicio
                </h1>
                <p className="text-zinc-500 dark:text-white/40 text-sm sm:text-base font-light">
                  Agregá el servicio más popular para arrancar.
                </p>
              </div>

              <div className="my-auto w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 items-start w-full">
                  
                  {/* Left: Form */}
                  <div className="flex flex-col text-left">
                    {onboardingStatus?.hasServices ? (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl p-6 text-center">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Servicios Activos</h3>
                        <p className="text-zinc-500 dark:text-white/50 text-sm mt-1">Ya tenés servicios configurados.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-2">Categoría</label>
                            <input 
                              type="text" 
                              value={catName}
                              onChange={e => setCatName(e.target.value)}
                              className="w-full bg-zinc-100/50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 text-base font-medium text-zinc-900 dark:text-white outline-none focus:border-[var(--primary-color)] transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20 shadow-sm"
                              placeholder="Cortes"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-2">Nombre</label>
                            <input 
                              type="text" 
                              value={svcName}
                              onChange={e => setSvcName(e.target.value)}
                              className="w-full bg-zinc-100/50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 text-base font-medium text-zinc-900 dark:text-white outline-none focus:border-[var(--primary-color)] transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20 shadow-sm"
                              placeholder="Corte Clásico"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-2">Precio ($)</label>
                            <input 
                              type="number" 
                              value={svcPrice}
                              onChange={e => setSvcPrice(e.target.value)}
                              className="w-full bg-zinc-100/50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 text-base font-medium text-zinc-900 dark:text-white outline-none focus:border-[var(--primary-color)] transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20 shadow-sm"
                              placeholder="Ej: 8000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-2">Duración</label>
                            <select
                              value={svcDuration}
                              onChange={e => setSvcDuration(e.target.value)}
                              className="w-full bg-zinc-100/50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 text-base font-medium text-zinc-900 dark:text-white outline-none focus:border-[var(--primary-color)] transition-all shadow-sm"
                            >
                              <option value="15">15 min</option>
                              <option value="30">30 min</option>
                              <option value="45">45 min</option>
                              <option value="60">1 hora</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Live Preview Card (Now visible on mobile too) */}
                  <div className="flex flex-col justify-center w-full">
                    <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-color)]/10 blur-3xl rounded-full" />
                      
                      <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-white/30 mb-5 sm:mb-6 text-center sm:text-left">
                        Previsualización en vivo
                      </span>
                      
                      <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm relative z-10">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary-color)]">
                            {catName || 'Categoría'}
                          </span>
                          <h4 className="text-zinc-900 dark:text-white font-bold text-base sm:text-lg mt-1">
                            {svcName || 'Nombre del Servicio'}
                          </h4>
                          <p className="text-zinc-500 dark:text-white/50 text-xs mt-1.5 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {svcDuration} min
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className="text-zinc-900 dark:text-white font-bold text-base sm:text-lg">
                            ${svcPrice || '0'}
                          </p>
                          <button className="mt-2 px-3 py-1.5 bg-[var(--primary-color)] text-white text-[11px] font-bold rounded-lg opacity-50 pointer-events-none">
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* STEP 3: SCHEDULES */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-4xl mx-auto min-h-full flex flex-col">
              
              <div className="text-center shrink-0 mt-20 sm:mt-6 mb-2 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2 sm:mb-3">
                  Tus horarios base
                </h1>
                <p className="text-zinc-500 dark:text-white/40 text-sm sm:text-base font-light">
                  Establecé qué días y en qué horarios trabajás normalmente.
                </p>
              </div>

              <div className="my-auto w-full">
                <div className="w-full bg-white/50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
                    
                    {/* Left: Days */}
                    <div className="flex flex-col items-center sm:items-start sm:border-r border-zinc-200 dark:border-white/10 sm:pr-8 h-full">
                      <label className="block text-sm font-medium text-zinc-600 dark:text-white/70 mb-5 sm:mb-6 w-full text-center sm:text-left">Días laborales</label>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 sm:gap-3">
                        {[
                          { id: 1, label: 'L' }, { id: 2, label: 'M' }, { id: 3, label: 'X' },
                          { id: 4, label: 'J' }, { id: 5, label: 'V' }, { id: 6, label: 'S' }, { id: 7, label: 'D' },
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
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full text-sm font-bold transition-all flex items-center justify-center ${
                              scheduleDays.includes(day.id) 
                                ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/30' 
                                : 'bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-transparent text-zinc-400 dark:text-white/30 hover:bg-zinc-200 dark:hover:bg-white/10'
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right: Times */}
                    <div className="flex flex-col sm:pl-4">
                      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-white/40 mb-3 font-semibold text-center sm:text-left">
                            Apertura {useSplitShift && 'Mañana'}
                          </p>
                          <WheelTimePicker value24h={startTime} onChange24h={setStartTime} />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-white/40 mb-3 font-semibold text-center sm:text-left">
                            Cierre {useSplitShift && 'Mañana'}
                          </p>
                          <WheelTimePicker value24h={endTime} onChange24h={setEndTime} />
                        </div>
                      </div>

                      <div className="flex justify-center sm:justify-start mb-4">
                        <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={useSplitShift}
                            onChange={(e) => setUseSplitShift(e.target.checked)}
                            className="rounded border-zinc-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)] w-4 h-4 cursor-pointer"
                          />
                          Horario partido (corto al mediodía)
                        </label>
                      </div>

                      {useSplitShift && (
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-zinc-200 dark:border-white/10 animate-in slide-in-from-top-4 fade-in">
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-white/40 mb-3 font-semibold text-center sm:text-left">Apertura Tarde</p>
                            <WheelTimePicker value24h={startTime2} onChange24h={setStartTime2} />
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-white/40 mb-3 font-semibold text-center sm:text-left">Cierre Tarde</p>
                            <WheelTimePicker value24h={endTime2} onChange24h={setEndTime2} />
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: LAUNCH */}
          {step === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-4xl mx-auto min-h-full flex flex-col">
              
              <div className="my-auto w-full flex flex-col items-center">
                
                {/* Centered Top Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-xl shadow-[var(--primary-color)]/20 relative">
                  <div className="absolute inset-0 rounded-full bg-[var(--primary-color)]/20 animate-ping opacity-20" />
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--primary-color)] relative z-10" />
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 items-center">
                  
                  {/* Left Col: Success message & Incentive */}
                  <div className="flex flex-col items-center text-center px-4 sm:px-6">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2 sm:mb-3">
                      ¡Todo listo!
                    </h1>
                    <p className="text-zinc-500 dark:text-white/60 text-sm sm:text-base font-light mb-6">
                      Tu plataforma ya está activa y configurada.
                    </p>

                    <div className="bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 w-full max-w-sm shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary-color)]/10 blur-2xl rounded-full" />
                      <h3 className="font-bold text-zinc-900 dark:text-white text-sm mb-2 relative z-10">
                        Próximo paso: Conseguir reservas
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-white/50 leading-relaxed relative z-10">
                        Pegá tu link en la biografía de Instagram y pasalo por WhatsApp a tus clientes. Descargá el QR e imprimilo para tu local. <strong className="font-semibold text-zinc-700 dark:text-white/80">¡Mientras más lo compartas, más rápido se llena tu agenda!</strong>
                      </p>
                    </div>
                  </div>

                  {/* Right Col: QR and Link (Shrunk) */}
                  <div className="w-full max-w-sm mx-auto bg-white/50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-[1.5rem] p-5 shadow-sm sm:bg-transparent sm:dark:bg-transparent sm:border-0 sm:shadow-none sm:p-0">
                    <div className="flex flex-col items-center gap-5">
                      <div className="bg-white p-3 sm:p-4 rounded-[1.5rem] shadow-sm border border-zinc-200">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&data=${encodeURIComponent(`https://${tenant?.slug || 'tu-local'}.agenda.roosty.site`)}`} 
                          alt="QR Code"
                          className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-xl"
                        />
                      </div>
                      
                      <div className="bg-white dark:bg-[#09090b] p-3 rounded-xl shadow-sm border border-zinc-200 dark:border-white/10 flex flex-col items-center gap-3 w-full">
                        <span className="text-zinc-900 dark:text-white font-medium text-sm sm:text-base truncate w-full text-center px-2">
                          {tenant?.slug || 'tu-local'}.agenda.roosty.site
                        </span>
                        <div className="flex gap-2 w-full">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`https://${tenant?.slug || 'tu-local'}.agenda.roosty.site`);
                              toast.success('¡Link copiado!');
                            }}
                            className="flex-1 py-2 px-2 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-white/70 font-semibold text-xs hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copiar Link</span><span className="sm:hidden">Copiar</span>
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&margin=4&data=${encodeURIComponent(`https://${tenant?.slug || 'tu-local'}.agenda.roosty.site`)}`;
                                const response = await fetch(qrUrl);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `QR-${tenant?.slug || 'agenda'}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                                toast.success('¡QR descargado!');
                              } catch (error) {
                                toast.error('Error al descargar el QR');
                              }
                            }}
                            className="flex-1 py-2 px-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Descargar QR</span><span className="sm:hidden">Descargar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              
            </div>
          )}
        </main>

        {/* Footer Navigation */}
        <footer className="relative z-10 w-full px-6 py-4 sm:px-8 sm:py-6 shrink-0 flex items-center justify-between border-t border-zinc-100 dark:border-white/[0.02]">
          
          <button 
            onClick={() => step > 0 ? setStep(step - 1) : closeTour()}
            disabled={isLoading}
            className="text-zinc-500 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-semibold flex items-center gap-1.5 w-20 sm:w-24"
          >
            {step === 0 ? 'Omitir' : <><ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Atrás</span></>}
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 absolute left-1/2 -translate-x-1/2">
            {stepsData.map((s, i) => (
              <div 
                key={s.id} 
                className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
                  i === step 
                    ? 'w-8 sm:w-10 bg-[var(--primary-color)]' 
                    : 'w-1.5 sm:w-2 bg-zinc-200 dark:bg-white/10'
                }`} 
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            disabled={
              isLoading || 
              (step === 0 && !storeName) ||
              (step === 1 && !onboardingStatus?.hasServices && (!catName || !svcName || !svcPrice))
            }
            className="w-28 sm:w-32 py-2.5 sm:py-3 bg-zinc-900 text-white dark:bg-white dark:text-[#09090b] font-bold text-sm rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg ml-auto"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (step === 3 ? 'Finalizar' : 'Siguiente')}
          </button>
          
        </footer>
      </div>
    </div>
  );
}