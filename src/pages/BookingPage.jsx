import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { 
  Scissors, 
  User, 
  Calendar as CalendarIcon, 
  Check, 
  ChevronLeft, 
  Loader2, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Phone, 
  Mail, 
  FileText, 
  MapPin, 
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Star,
  Layers,
  Tag,
  Zap,
  UserPlus
} from 'lucide-react';
import {
  usePublicServices,
  usePublicCategories,
  usePublicBarbers,
  usePublicAvailableSlots,
  useAvailableDaysForService,
  useCreatePublicAppointment,
  useSalonInfo,
} from '../hooks/useBooking';
import { WaitlistForm } from '../components/booking/WaitlistForm';
import { getTenantSlug } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { applyTenantTheme } from '../hooks/useTenantBranding';
import { getImageUrl } from '../utils/imageUrl';

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1600&auto=format&fit=crop';

function getCategoryIcon(name = '') {
  const n = name.toLowerCase();
  if (n.includes('corte') || n.includes('pelo') || n.includes('cabello')) return <Scissors className="w-4 h-4" />;
  if (n.includes('barba') || n.includes('beard')) return <Zap className="w-4 h-4" />;
  if (n.includes('color') || n.includes('tinte') || n.includes('mechas')) return <Sparkles className="w-4 h-4" />;
  if (n.includes('tratamiento') || n.includes('keratina') || n.includes('spa')) return <Star className="w-4 h-4" />;
  if (n.includes('pack') || n.includes('combo') || n.includes('full')) return <Layers className="w-4 h-4" />;
  return <Tag className="w-4 h-4" />;
}

export function BookingPage() {
  const { slug: routeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const slug = routeSlug || searchParams.get('slug') || searchParams.get('tenant') || getTenantSlug() || 'admin';

  const { data: salonInfoData, isLoading: isSalonLoading, isError: isSalonError } = useSalonInfo(slug);
  const { data: servicesData, isLoading: isServicesLoading } = usePublicServices(slug);
  const { data: categoriesData } = usePublicCategories(slug);
  const { data: barbersData, isLoading: isBarbersLoading } = usePublicBarbers(slug);

  const salon = salonInfoData?.data || {};
  const services = servicesData?.data || [];
  const categories = categoriesData?.data || [];
  const barbers = barbersData?.data || [];

  useEffect(() => {
    if (salon && Object.keys(salon).length > 0) {
      applyTenantTheme(salon);
    }
  }, [salon]);

  const isSingleBarber = barbers.length === 1 || salon?.planType === 'SOLO_BARBER' || salon?.hasMultiBarber === false;

  const urlServiceId = searchParams.get('serviceId');
  const urlBarberId = searchParams.get('barberId');
  const urlDate = searchParams.get('date');

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [selectedBarberId, setSelectedBarberId] = useState(() => urlBarberId ? (urlBarberId === 'any' ? 'any' : Number(urlBarberId)) : null);
  const [selectedServiceId, setSelectedServiceId] = useState(() => urlServiceId ? Number(urlServiceId) : null);
  
  const getLocalISODate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [selectedDate, setSelectedDate] = useState(() => urlDate || getLocalISODate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

  const hasInitializedFromUrl = useRef(false);

  useEffect(() => {
    if (hasInitializedFromUrl.current) return;
    if (isServicesLoading || isBarbersLoading || isSalonLoading) return;

    if (urlServiceId) {
      if (urlBarberId) {
         setStep(2);
      } else {
         if (isSingleBarber) {
             setStep(2);
         } else {
             setStep(1);
         }
      }
      hasInitializedFromUrl.current = true;
    }
  }, [isServicesLoading, isBarbersLoading, isSalonLoading, urlServiceId, urlBarberId, isSingleBarber]);

  const [clientData, setClientData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: '',
  });

  const groupedServices = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => map.set(c.id, { ...c, services: [] }));
    const uncategorized = { id: 'uncategorized', name: 'Otros Servicios', services: [] };
    services.forEach((s) => {
      if (s.categoryId && map.has(s.categoryId)) {
        map.get(s.categoryId).services.push(s);
      } else {
        uncategorized.services.push(s);
      }
    });
    const result = Array.from(map.values()).filter((c) => c.services.length > 0);
    if (uncategorized.services.length > 0) result.push(uncategorized);
    return result;
  }, [services, categories]);

  const filteredGroupedServices = useMemo(() => {
    if (selectedCategoryTab === 'all') return groupedServices;
    return groupedServices.filter((g) => String(g.id) === String(selectedCategoryTab));
  }, [groupedServices, selectedCategoryTab]);

  useEffect(() => {
    if (barbers.length === 1 && !selectedBarberId) {
      setSelectedBarberId(barbers[0].id);
    }
  }, [barbers, selectedBarberId]);

  const { data: slotsData, isLoading: isSlotsLoading } = usePublicAvailableSlots(slug, {
    serviceId: selectedServiceId,
    barberId: selectedBarberId === 'any' ? null : selectedBarberId,
    date: selectedDate,
  });

  const slots = slotsData?.data || [];

  const { daysWithSlots, isCheckingDays } = useAvailableDaysForService(slug, {
    serviceId: selectedServiceId,
    barberId: selectedBarberId,
    daysAhead: 14,
  });

  const { mutate: createAppointment, isPending } = useCreatePublicAppointment(slug);

  const availableDays = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const iso = getLocalISODate(d);
      const dayName = i === 0 ? 'Hoy' : i === 1 ? 'Mañ' : d.toLocaleDateString('es-AR', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('es-AR', { month: 'short' });
      days.push({ iso, dayName, dayNumber, monthName });
    }
    return days;
  }, []);

  const { morningSlots, afternoonSlots } = useMemo(() => {
    const morning = [];
    const afternoon = [];
    slots.forEach((s) => {
      const hour = new Date(s).getHours();
      if (hour < 13) morning.push(s); else afternoon.push(s);
    });
    return { morningSlots: morning, afternoonSlots: afternoon };
  }, [slots]);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

  const activeWorkingDays = useMemo(() => {
    if (selectedBarber && Array.isArray(selectedBarber.workingDays) && selectedBarber.workingDays.length > 0) {
      return new Set(selectedBarber.workingDays);
    }
    const allWorkingDays = barbers.flatMap((b) => b.workingDays || []);
    if (allWorkingDays.length > 0) {
      return new Set(allWorkingDays);
    }
    return new Set([1, 2, 3, 4, 5, 6]);
  }, [selectedBarber, barbers]);

  const displayedDays = useMemo(() => {
    return availableDays.filter((d) => {
      const [year, month, day] = d.iso.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      const jsDay = dateObj.getDay();
      const isoDayOfWeek = jsDay === 0 ? 7 : jsDay;
      return activeWorkingDays.has(isoDayOfWeek);
    });
  }, [availableDays, activeWorkingDays]);

  useEffect(() => {
    if (displayedDays.length > 0) {
      const isCurrentSelectedValid = displayedDays.some((d) => d.iso === selectedDate);
      if (!isCurrentSelectedValid) {
        setSelectedDate(displayedDays[0].iso);
      }
    }
  }, [displayedDays, selectedDate]);

  const rawCover = salon.heroUrl || salon.backgroundImageUrl;
  const coverImageUrl = (rawCover ? getImageUrl(rawCover) : null) || DEFAULT_COVER_IMAGE;

  const handlePrev = () => {
    setDirection('backward');
    if (step === 2 && isSingleBarber) { setStep(0); return; }
    setStep((s) => Math.max(0, s - 1));
  };

  const handleStartBooking = () => {
    setDirection('forward');
    if (isSingleBarber) {
      if (barbers.length === 1) setSelectedBarberId(barbers[0].id);
      setStep(2);
    } else {
      setStep(1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientData.clientName || !clientData.clientEmail || !selectedServiceId || !selectedSlot) return;
    createAppointment(
      {
        serviceId: selectedServiceId,
        barberId: selectedBarberId === 'any' ? null : selectedBarberId,
        startTime: selectedSlot,
        clientName: clientData.clientName.trim(),
        clientPhone: clientData.clientPhone.trim(),
        clientEmail: clientData.clientEmail.trim(),
        notes: clientData.notes.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          navigate('/book/confirmation', {
            state: { appointment: { ...res.data, tenantSlug: slug } },
          });
        },
      }
    );
  };

  if (isSalonError) {
    // If tenant doesn't exist (e.g. unknown subdomain), redirect to landing page
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname.includes('localhost') || 
                      window.location.hostname.includes('127.0.0.1') || 
                      window.location.hostname.startsWith('192.168.') ||
                      window.location.hostname.startsWith('10.');
      if (isLocal) {
        const port = window.location.port ? `:${window.location.port}` : '';
        // If they are on an IP or localhost, just remove any subdomains
        let baseHost = window.location.hostname;
        if (baseHost.includes('.localhost')) baseHost = 'localhost';
        window.location.href = `${window.location.protocol}//${baseHost}${port}`;
      } else {
        window.location.href = 'https://agenda.roosty.com.ar';
      }
      return null;
    }
  }

  if (isSalonLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-color,#6366f1)]" />
        <span className="text-sm font-medium">Cargando...</span>
      </div>
    );
  }

  const totalSteps = isSingleBarber ? 3 : 4;
  const currentStepDisplay = isSingleBarber ? step - 1 : step;

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col font-sans selection:bg-[rgba(var(--primary-rgb,99,102,241),0.3)] relative overflow-x-hidden">
      {/* BACKGROUND BANNER FIXED */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={salon.storeName || salon.name || 'Portada'}
            className="w-full h-full object-cover object-center opacity-40"
          />
        ) : null}
        <div className="absolute inset-0 bg-zinc-950/40" />
      </div>

      {/* APP WRAPPER WITH GLASSMORPHISM */}
      <div className="relative z-10 flex-1 flex flex-col w-full bg-zinc-950/40 backdrop-blur-sm">
        {/* Staff Preview Floating Bar */}
        {isAuthenticated && (
          <div className="bg-[rgba(var(--primary-rgb,99,102,241),0.1)] border-b border-[var(--primary-color,#6366f1)]/20 px-4 py-2.5 text-xs flex items-center justify-between text-indigo-300 z-50 sticky top-0 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="font-medium text-[11px] sm:text-xs">
                Vista Previa · Sesión activa: <strong className="text-white">{user?.fullName || user?.username}</strong>
              </span>
            </div>
            <button
              onClick={() => navigate(user?.role === 'SUPER_ADMIN' ? '/superadmin' : '/agenda')}
              className="px-3 py-1 rounded-lg bg-[var(--primary-color,#6366f1)] hover:bg-indigo-400 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm text-xs shrink-0"
            >
              <span>Volver al Panel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* STICKY HEADER */}
        {step > 0 && (
          <header className="sticky top-0 z-40 bg-zinc-950/60 backdrop-blur-md border-b border-white/10">
            <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Atrás</span>
              </button>

              <div className="text-center flex flex-col items-center">
                <div className="flex items-center justify-center gap-1.5">
                  {salon.logoUrl && <img src={getImageUrl(salon.logoUrl)} alt="" className="h-5 w-auto object-contain" />}
                  <h1 className="font-black text-sm sm:text-base tracking-tight text-zinc-100 truncate max-w-[150px] sm:max-w-xs">
                    {salon.storeName || salon.name || 'Roosty Agenda'}
                  </h1>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Paso {currentStepDisplay} de {totalSteps}
                </p>
              </div>
              <div className="w-10" />
            </div>
            <div className="w-full h-[2px] bg-zinc-900">
              <div
                className="h-full transition-all duration-300 bg-[var(--primary-color,#6366f1)] shadow-[0_0_8px_var(--primary-color,#6366f1)]"
                style={{ width: `${(currentStepDisplay / totalSteps) * 100}%` }}
              />
            </div>
          </header>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-xl mx-auto w-full p-4 sm:p-6 flex flex-col relative z-10 pb-32 sm:pb-28">
          
          {/* PASO 0 */}
          {step === 0 && (
            <div className={`flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-10 animate-in ${direction === 'forward' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'} fade-in duration-300`}>
              <div className="mb-5 flex justify-center">
                {salon.logoUrl ? (
                  <img src={getImageUrl(salon.logoUrl)} alt="Logo" className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-2xl" />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-zinc-900/50 backdrop-blur-md border border-white/10 p-1 flex items-center justify-center shadow-2xl overflow-hidden">
                    <div className="w-full h-full rounded-lg bg-[rgba(var(--primary-rgb,99,102,241),0.1)] flex items-center justify-center text-[var(--primary-color,#818cf8)]">
                      <Scissors className="w-10 h-10" />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2 mb-6 px-4">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {salon.heroTitle || salon.storeName || salon.name || 'Barbería & Salón'}
                </h1>
                <p className="text-sm text-zinc-300 max-w-sm mx-auto leading-relaxed">
                  {salon.heroSubtitle || 'Reservá tu turno online en simples pasos. Rápido, fácil y sin esperas.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-md px-2">
                {salon.address && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-zinc-900/50 backdrop-blur-md border border-white/10 text-zinc-200">
                    <MapPin className="w-3.5 h-3.5 text-[var(--primary-color,#818cf8)] shrink-0" />
                    <span className="truncate max-w-[220px]">{salon.address}</span>
                  </div>
                )}
                {salon.openingHours && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-zinc-900/50 backdrop-blur-md border border-white/10 text-zinc-200">
                    <Clock className="w-3.5 h-3.5 text-[var(--primary-color,#818cf8)] shrink-0" />
                    <span>{salon.openingHours}</span>
                  </div>
                )}
              </div>
              <div className="w-full max-w-sm flex flex-col gap-3 px-4">
                <button onClick={handleStartBooking} className="w-full h-14 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-base rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-white/10 active:scale-[0.99] group">
                  <span>Reservar Turno</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 1 */}
          {step === 1 && !isSingleBarber && (
            <div className={`space-y-5 animate-in ${direction === 'forward' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'} fade-in duration-300`}>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Seleccioná un Profesional</h2>
                <p className="text-sm text-zinc-400 mt-1">Elegí a tu barbero de confianza o dejanos elegir.</p>
              </div>
              {isBarbersLoading ? (
                <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--primary-color,#6366f1)]" /></div>
              ) : (
                <div className="space-y-4">
                  <button onClick={() => setSelectedBarberId('any')} className={`w-full h-16 px-4 rounded-xl flex items-center justify-between transition-all cursor-pointer backdrop-blur-md border active:scale-[0.99] ${selectedBarberId === 'any' ? 'bg-zinc-800/40 border-[var(--primary-color,#6366f1)] ring-1 ring-[var(--primary-color,#6366f1)]' : 'bg-zinc-900/50 border-white/10 hover:bg-zinc-800/60'}`}>
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-[var(--primary-color,#6366f1)]" />
                      <span className={`font-bold text-sm ${selectedBarberId === 'any' ? 'text-[var(--primary-color,#818cf8)]' : 'text-white'}`}>Cualquier barbero disponible</span>
                    </div>
                    {selectedBarberId === 'any' ? (
                      <Check className="w-5 h-5 text-[var(--primary-color,#6366f1)]" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {barbers.map((b) => {
                      const isSelected = selectedBarberId === b.id;
                      const avatarSrc = b.avatarUrl ? getImageUrl(b.avatarUrl) : `https://ui-avatars.com/api/?name=${encodeURIComponent(b.fullName)}&background=18181b&color=6366f1&bold=true&size=256`;
                      return (
                        <button key={b.id} onClick={() => setSelectedBarberId(b.id)} className={`relative rounded-xl overflow-hidden flex flex-col transition-all bg-zinc-900/50 backdrop-blur-md border h-40 cursor-pointer active:scale-[0.98] ${isSelected ? 'border-[var(--primary-color,#6366f1)] ring-1 ring-[var(--primary-color,#6366f1)]' : 'border-white/10'}`}>
                          <img src={avatarSrc} alt={b.fullName} className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--primary-color,#6366f1)] flex items-center justify-center shadow-md">
                              <Check className="w-4 h-4 text-white stroke-[3]" />
                            </div>
                          )}
                          <div className="relative z-10 mt-auto p-3 text-left w-full">
                            <div className={`font-bold text-sm ${isSelected ? 'text-[var(--primary-color,#818cf8)]' : 'text-white'}`}>{b.fullName}</div>
                            {b.bio && <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{b.bio}</div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div className={`space-y-5 animate-in ${direction === 'forward' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'} fade-in duration-300`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">¿Qué servicio buscás?</h2>
                </div>
                {!isSingleBarber && selectedBarber && (
                  <div onClick={() => { setDirection('backward'); setStep(1); }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-white/10 backdrop-blur-sm text-xs text-zinc-300 hover:border-[var(--primary-color,#6366f1)]/50 cursor-pointer transition-colors">
                    <span className="text-zinc-500">Con:</span>
                    <span className="font-semibold text-[var(--primary-color,#818cf8)]">{selectedBarber.fullName}</span>
                    <span className="text-[10px] text-zinc-500 underline ml-1">Cambiar</span>
                  </div>
                )}
              </div>

              {categories.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
                  <button onClick={() => setSelectedCategoryTab('all')} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg shrink-0 text-xs font-bold transition-all cursor-pointer ${selectedCategoryTab === 'all' ? 'bg-[var(--primary-color,#6366f1)] text-white' : 'bg-zinc-900/50 border border-white/10 text-zinc-400 hover:text-zinc-200'}`}>
                    <Layers className="w-3.5 h-3.5" /> Todos
                  </button>
                  {categories.map((c) => {
                    const isActive = String(selectedCategoryTab) === String(c.id);
                    return (
                      <button key={c.id} onClick={() => setSelectedCategoryTab(String(c.id))} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg shrink-0 text-xs font-bold transition-all cursor-pointer ${isActive ? 'bg-[var(--primary-color,#6366f1)] text-white' : 'bg-zinc-900/50 border border-white/10 text-zinc-400 hover:text-zinc-200'}`}>
                        {getCategoryIcon(c.name)} <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {isServicesLoading ? (
                <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--primary-color,#6366f1)]" /></div>
              ) : services.length === 0 ? (
                <div className="p-8 text-center bg-zinc-900/50 border border-white/10 rounded-xl text-zinc-400 text-sm backdrop-blur-md">
                  No hay servicios activos disponibles en este momento.
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 overflow-hidden bg-zinc-900/50 backdrop-blur-md divide-y divide-zinc-800/60">
                  {filteredGroupedServices.flatMap((category) =>
                    category.services.map((s) => {
                      const isSelected = selectedServiceId === s.id;
                      return (
                        <button key={s.id} onClick={() => setSelectedServiceId(s.id)} className={`w-full px-4 py-4 text-left flex items-center justify-between gap-4 transition-all cursor-pointer ${isSelected ? 'bg-zinc-800/20' : 'hover:bg-zinc-800/40'}`}>
                          <div className="flex-1 min-w-0">
                            <div className={`font-bold text-sm transition-colors ${isSelected ? 'text-[var(--primary-color,#818cf8)]' : 'text-zinc-100'}`}>{s.name}</div>
                            <div className="flex items-center gap-1 mt-1 text-zinc-400">
                              <Clock className="w-3 h-3 opacity-70" />
                              <span className="text-xs font-mono num-tabular">{s.durationMinutes} min</span>
                            </div>
                            {s.depositAmount > 0 && (
                              <div className="text-sm text-zinc-400 mt-1.5">Requiere seña de ${Number(s.depositAmount).toLocaleString('es-AR')}</div>
                            )}
                          </div>
                          <div className="text-right shrink-0 flex flex-col items-end gap-2">
                            <div className="text-lg font-black font-mono num-tabular text-[var(--primary-color,#818cf8)]">${Number(s.price || 0).toLocaleString('es-AR')}</div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-[var(--primary-color,#6366f1)] bg-[var(--primary-color,#6366f1)]' : 'border-zinc-600'}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-zinc-950" />}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <div className={`space-y-6 animate-in ${direction === 'forward' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'} fade-in duration-300`}>
              {salon?.limitReached ? (
                <div className="bg-zinc-900 border border-red-500/30 rounded-2xl p-6 text-center space-y-4 backdrop-blur-sm">
                  <CalendarIcon className="w-12 h-12 text-red-500 mx-auto" />
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">La agenda de este mes está llena</h2>
                    <p className="text-sm text-zinc-400 mt-2">No se pueden tomar más turnos temporalmente. Anotate en la lista de espera para que te avisemos apenas se libere un lugar.</p>
                  </div>
                  {salon?.hasWaitlist !== false && (
                    <div className="text-left mt-6">
                      <WaitlistForm 
                        slug={slug} 
                        serviceId={selectedServiceId} 
                        barberId={selectedBarberId} 
                        date={getLocalISODate()} 
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Seleccioná el día y la hora</h2>
                    <p className="text-sm text-zinc-400 mt-1">
                      <strong className="text-white">{selectedService?.name}</strong> • {selectedBarber ? selectedBarber.fullName : 'Cualquier barbero'}
                    </p>
                  </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  Día del Turno {isCheckingDays && <span className="animate-pulse">•••</span>}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
                  {displayedDays.map((d) => {
                    const isSelected = selectedDate === d.iso;
                    const hasSlots = daysWithSlots.has(d.iso);
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => {
                          setSelectedDate(d.iso);
                          setSelectedSlot(null);
                          setShowWaitlist(false);
                        }}
                        className={`w-[60px] py-3 rounded-xl border flex flex-col items-center justify-center shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--primary-color,#6366f1)] text-white border-[var(--primary-color,#6366f1)] shadow-lg'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-indigo-100' : 'text-zinc-500'}`}>
                          {d.dayName}
                        </span>
                        <span className="text-xl font-black font-mono num-tabular mt-1">{d.dayNumber}</span>
                        {!isCheckingDays && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                              hasSlots
                                ? (isSelected ? 'bg-white' : 'bg-emerald-400')
                                : 'bg-zinc-700'
                            }`}
                            title={hasSlots ? 'Turnos disponibles' : 'Completo'}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Horarios Disponibles</span>
                  {slots.length > 0 && <span className="text-zinc-400 lowercase normal-case">{slots.length} libres</span>}
                </div>
                {isSlotsLoading ? (
                  <div className="p-10 flex flex-col items-center justify-center gap-2 bg-zinc-900/50 border border-white/10 rounded-xl backdrop-blur-sm">
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-color,#6366f1)]" />
                  </div>
                ) : slots.length === 0 ? (
                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 text-center space-y-4 backdrop-blur-sm">
                    <Clock className="w-8 h-8 text-zinc-600 mx-auto" />
                    <div>
                      <h3 className="font-bold text-sm text-zinc-200">No hay turnos disponibles para esta fecha</h3>
                      <p className="text-xs text-zinc-400 mt-1">Elegí otro día en el calendario o anotate en la lista de espera.</p>
                    </div>

                    {salon?.hasWaitlist !== false && !showWaitlist && (
                      <button
                        type="button"
                        onClick={() => setShowWaitlist(true)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Anotarme a la Lista de Espera</span>
                      </button>
                    )}

                    {showWaitlist && (
                      <div className="text-left mt-3">
                        <WaitlistForm
                          slug={slug}
                          date={selectedDate}
                          serviceId={selectedService?.id}
                          barberId={selectedBarber?.id}
                          onClose={() => setShowWaitlist(false)}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {morningSlots.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-zinc-500 mb-2.5 uppercase tracking-widest">Mañana</div>
                        <div className="grid grid-cols-3 gap-3">
                          {morningSlots.map((s) => {
                            const timeStr = new Date(s).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                            const isSelected = selectedSlot === s;
                            return (
                              <button key={s} onClick={() => setSelectedSlot(s)} className={`py-3 rounded-lg font-mono num-tabular text-sm border transition-all cursor-pointer active:scale-[0.97] ${isSelected ? 'bg-[var(--primary-color,#6366f1)] text-white font-bold border-[var(--primary-color,#6366f1)] shadow-md' : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'}`}>
                                {timeStr}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {afternoonSlots.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-zinc-500 mb-2.5 uppercase tracking-widest">Tarde / Noche</div>
                        <div className="grid grid-cols-3 gap-3">
                          {afternoonSlots.map((s) => {
                            const timeStr = new Date(s).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                            const isSelected = selectedSlot === s;
                            return (
                              <button key={s} onClick={() => setSelectedSlot(s)} className={`py-3 rounded-lg font-mono num-tabular text-sm border transition-all cursor-pointer active:scale-[0.97] ${isSelected ? 'bg-[var(--primary-color,#6366f1)] text-white font-bold border-[var(--primary-color,#6366f1)] shadow-md' : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'}`}>
                                {timeStr}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              </>
              )}
            </div>
          )}

          {/* PASO 4 */}
          {step === 4 && (
            <form id="booking-form" onSubmit={handleSubmit} className={`space-y-5 animate-in ${direction === 'forward' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'} fade-in duration-300`}>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Completá tus datos</h2>
                <p className="text-sm text-zinc-400 mt-1">Revisá el resumen y dejanos tus datos para confirmar.</p>
              </div>

              {/* Master Ticket */}
              <div className="bg-zinc-900 rounded-xl p-5 shadow-xl border border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Servicio</div>
                    <div className="font-bold text-white text-base">{selectedService?.name}</div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Total</div>
                    <div className="text-xl font-black font-mono num-tabular text-[var(--primary-color,#818cf8)]">
                      ${Number(selectedService?.price || 0).toLocaleString('es-AR')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-zinc-300">
                  <User className="w-4 h-4 text-zinc-500" />
                  {selectedBarber?.fullName || 'Cualquiera'}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <CalendarIcon className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono num-tabular">
                    {selectedSlot && new Date(selectedSlot).toLocaleString('es-AR', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })} hs
                  </span>
                </div>

                {selectedService?.depositAmount && Number(selectedService.depositAmount) > 0 && (
                  <>
                    <hr className="my-4 border-t border-dashed border-zinc-800" />
                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--primary-color,#818cf8)]">
                      <ShieldCheck className="w-4 h-4" />
                      Requiere seña de ${Number(selectedService.depositAmount).toLocaleString('es-AR')}
                    </div>
                  </>
                )}
              </div>

              {/* Form Inputs */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold tracking-wider text-zinc-500 uppercase mb-2">Nombre completo <span className="text-[var(--primary-color,#6366f1)]">*</span></label>
                  <input type="text" required placeholder="Tu nombre y apellido" value={clientData.clientName} onChange={(e) => setClientData({ ...clientData, clientName: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-[var(--primary-color,#6366f1)] focus:border-[var(--primary-color,#6366f1)] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wider text-zinc-500 uppercase mb-2">WhatsApp <span className="text-[var(--primary-color,#6366f1)]">*</span></label>
                  <input type="tel" required placeholder="Ej: 11 2345 6789" value={clientData.clientPhone} onChange={(e) => setClientData({ ...clientData, clientPhone: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-[var(--primary-color,#6366f1)] focus:border-[var(--primary-color,#6366f1)] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wider text-zinc-500 uppercase mb-2">Email <span className="text-[var(--primary-color,#6366f1)]">*</span></label>
                  <input type="email" required placeholder="nombre@ejemplo.com" value={clientData.clientEmail} onChange={(e) => setClientData({ ...clientData, clientEmail: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-[var(--primary-color,#6366f1)] focus:border-[var(--primary-color,#6366f1)] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wider text-zinc-500 uppercase mb-2">Aclaraciones</label>
                  <textarea rows={2} placeholder="Opcional..." value={clientData.notes} onChange={(e) => setClientData({ ...clientData, notes: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-[var(--primary-color,#6366f1)] focus:border-[var(--primary-color,#6366f1)] transition-all resize-none" />
                </div>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* FIXED BOTTOM BAR (Now outside the main flow, truly fixed to the viewport) */}
      {step >= 1 && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-zinc-950 border-t border-white/5 p-4 pb-6 sm:pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="max-w-xl mx-auto flex items-center gap-4">
            <div className="min-w-0 flex-1">
              {step === 1 && (
                <div className="text-xs text-zinc-500 font-medium truncate">
                  {selectedBarberId === 'any' ? <span>Cualquier profesional</span> : selectedBarber ? <span>Con <strong className="text-zinc-200">{selectedBarber.fullName}</strong></span> : <span>Elegí profesional</span>}
                </div>
              )}
              {step === 2 && (
                <div className="min-w-0">
                  <div className="text-[10px] text-zinc-500 truncate mb-0.5">
                    {selectedBarberId === 'any' ? 'Cualquier profesional' : selectedBarber ? `Con ${selectedBarber.fullName}` : ''}
                  </div>
                  <div className="text-xs font-medium truncate text-zinc-300">
                    {selectedServiceId ? <span className="text-zinc-100">{selectedService?.name}</span> : <span>Elegí un servicio</span>}
                  </div>
                </div>
              )}
              {step >= 3 && (
                <div className="min-w-0">
                  <div className="text-[10px] text-zinc-400 truncate mb-0.5">
                    {selectedService?.name} {selectedBarberId && selectedBarberId !== 'any' ? `• ${selectedBarber?.fullName}` : ''}
                    {step === 4 && selectedSlot && ` • ${new Date(selectedSlot).toLocaleString('es-AR', { hour: '2-digit', minute: '2-digit' })}hs`}
                  </div>
                  <div className="text-base font-black font-mono num-tabular text-[var(--primary-color,#818cf8)]">
                    ${Number(selectedService?.price || 0).toLocaleString('es-AR')}
                  </div>
                </div>
              )}
            </div>

            {step === 1 && (
              <button onClick={() => { setDirection('forward'); setStep(2); }} disabled={!selectedBarberId} className="px-6 py-3 rounded-lg bg-[var(--primary-color,#6366f1)] hover:bg-[rgba(var(--primary-rgb,99,102,241),0.8)] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shrink-0 flex items-center gap-1.5">
                <span>Continuar</span> <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {step === 2 && (
              <button onClick={() => { setDirection('forward'); setStep(3); }} disabled={!selectedServiceId} className="px-6 py-3 rounded-lg bg-[var(--primary-color,#6366f1)] hover:bg-[rgba(var(--primary-rgb,99,102,241),0.8)] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shrink-0 flex items-center gap-1.5">
                <span>Continuar</span> <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {step === 3 && (
              <button onClick={() => { setDirection('forward'); setStep(4); }} disabled={!selectedSlot} className="px-6 py-3 rounded-lg bg-[var(--primary-color,#6366f1)] hover:bg-[rgba(var(--primary-rgb,99,102,241),0.8)] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shrink-0 flex items-center gap-1.5">
                <span>Continuar</span> <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {step === 4 && (
              <button form="booking-form" type="submit" disabled={isPending || !clientData.clientName || !clientData.clientEmail || !clientData.clientPhone} className="flex-1 py-3 rounded-lg bg-[var(--primary-color,#6366f1)] hover:bg-[rgba(var(--primary-rgb,99,102,241),0.8)] disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
                <span>Confirmar Turno</span> <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingPage;
