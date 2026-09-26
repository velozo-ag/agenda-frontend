import React, { useState, useEffect, useMemo } from 'react';
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
  CalendarCheck,
  Search,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
  usePublicServices, 
  usePublicCategories, 
  usePublicBarbers, 
  usePublicAvailableSlots, 
  useCreatePublicAppointment, 
  useSalonInfo 
} from '../hooks/useBooking';
import { WaitlistForm } from '../components/booking/WaitlistForm';
import { getTenantSlug } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { applyTenantTheme } from '../hooks/useTenantBranding';
import { getImageUrl } from '../utils/imageUrl';

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1600&auto=format&fit=crop';

export function BookingPage() {
  const { slug: routeSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Slug resolution: route param > query param > axiosClient resolution > default
  const slug = routeSlug || searchParams.get('slug') || searchParams.get('tenant') || getTenantSlug() || 'admin';

  const { data: salonInfoData, isLoading: isSalonLoading } = useSalonInfo(slug);
  const { data: servicesData, isLoading: isServicesLoading } = usePublicServices(slug);
  const { data: categoriesData, isLoading: isCategoriesLoading } = usePublicCategories(slug);
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

  // Determine if single-barber shop
  const isSingleBarber = barbers.length === 1 || salon?.planType === 'SOLO_BARBER' || salon?.hasMultiBarber === false;

  // Wizard state:
  // 0: Welcome / Landing, 1: Barber (if multi), 2: Service, 3: Date & Slot, 4: Client info & confirm
  const [step, setStep] = useState(0);
  const [selectedBarberId, setSelectedBarberId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

  const [clientData, setClientData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: '',
  });

  // Group services by category
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
    if (uncategorized.services.length > 0) {
      result.push(uncategorized);
    }
    return result;
  }, [services, categories]);

  // Filtered services by active category tab
  const filteredGroupedServices = useMemo(() => {
    if (selectedCategoryTab === 'all') return groupedServices;
    return groupedServices.filter((g) => String(g.id) === String(selectedCategoryTab));
  }, [groupedServices, selectedCategoryTab]);

  // Auto-assign single barber
  useEffect(() => {
    if (barbers.length === 1 && !selectedBarberId) {
      setSelectedBarberId(barbers[0].id);
    }
  }, [barbers, selectedBarberId]);

  // Available Slots query
  const { data: slotsData, isLoading: isSlotsLoading } = usePublicAvailableSlots(slug, {
    serviceId: selectedServiceId,
    barberId: selectedBarberId === 'any' ? null : selectedBarberId,
    date: selectedDate,
  });

  const slots = slotsData?.data || [];

  const { mutate: createAppointment, isPending } = useCreatePublicAppointment(slug);

  // Quick Days Bar Generator (next 14 days)
  const availableDays = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Hoy' : i === 1 ? 'Mañ' : d.toLocaleDateString('es-AR', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('es-AR', { month: 'short' });
      days.push({ iso, dayName, dayNumber, monthName, isWeekend: d.getDay() === 0 || d.getDay() === 6 });
    }
    return days;
  }, []);

  // Split slots into Morning & Afternoon
  const { morningSlots, afternoonSlots } = useMemo(() => {
    const morning = [];
    const afternoon = [];
    slots.forEach((s) => {
      const dateObj = new Date(s);
      const hour = dateObj.getHours();
      if (hour < 13) {
        morning.push(s);
      } else {
        afternoon.push(s);
      }
    });
    return { morningSlots: morning, afternoonSlots: afternoon };
  }, [slots]);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

  // Cover image: owner configured heroUrl/backgroundImageUrl or default fallback
  const coverImageUrl = (salon.heroUrl || salon.backgroundImageUrl)
    ? getImageUrl(salon.heroUrl || salon.backgroundImageUrl)
    : DEFAULT_COVER_IMAGE;

  // Navigation handlers
  const handlePrev = () => {
    if (step === 2 && isSingleBarber) {
      setStep(0);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const handleStartBooking = () => {
    if (isSingleBarber) {
      if (barbers.length === 1) setSelectedBarberId(barbers[0].id);
      setStep(2);
    } else {
      setStep(1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientData.clientName || !clientData.clientEmail || !selectedServiceId || !selectedSlot) {
      return;
    }

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
            state: { appointment: { ...res.data, tenantSlug: slug } } 
          });
        },
      }
    );
  };

  if (isSalonLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="text-sm font-medium">Cargando salón...</span>
      </div>
    );
  }

  // Calculate human step numbers
  const totalSteps = isSingleBarber ? 3 : 4;
  const currentStepDisplay = isSingleBarber ? step - 1 : step;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 relative overflow-x-hidden">
      {/* ─── ATMOSPHERIC BACKGROUND HERO BANNER ─── */}
      <div className="absolute top-0 left-0 right-0 h-[280px] sm:h-[360px] overflow-hidden pointer-events-none z-0">
        <img
          src={coverImageUrl}
          alt={salon.storeName || salon.name || 'Portada'}
          className="w-full h-full object-cover object-center opacity-30 filter brightness-90 transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/80 to-zinc-950" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-zinc-950/90" />
      </div>

      {/* Staff Preview Floating Bar (When authenticated as admin/barber) */}
      {isAuthenticated && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 text-xs flex items-center justify-between text-amber-300 z-50 sticky top-0 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-medium text-[11px] sm:text-xs">
              Vista Previa de Clientes (Sesión activa: <strong className="text-white">{user?.fullName || user?.username}</strong>)
            </span>
          </div>
          <button
            onClick={() => navigate(user?.role === 'SUPER_ADMIN' ? '/superadmin' : '/agenda')}
            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm text-xs shrink-0"
          >
            <span>Volver al Panel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── STICKY HEADER (Steps > 0) ─── */}
      {step > 0 && (
        <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
          <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Volver"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Atrás</span>
            </button>

            <div className="text-center">
              <h1 className="font-black text-sm sm:text-base tracking-tight text-zinc-100 truncate max-w-[200px] sm:max-w-xs">
                {salon.storeName || salon.name || 'Roosty Agenda'}
              </h1>
              <p className="text-[11px] text-zinc-400">
                Paso {currentStepDisplay} de {totalSteps}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-zinc-900">
            <div
              className="h-full bg-amber-500 transition-all duration-300 shadow-sm shadow-amber-500/50"
              style={{ width: `${(currentStepDisplay / totalSteps) * 100}%` }}
            />
          </div>
        </header>
      )}

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="flex-1 max-w-xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-between relative z-10">
        
        {/* ═══════════════════════════════════════════════════════════════
            PASO 0: LANDING & PORTAL PÚBLICO (Bienvenida con Banner)
            ═══════════════════════════════════════════════════════════════ */}
        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-10 animate-in fade-in duration-300">
            {/* Salon Logo with Ambient Ring */}
            <div className="relative mb-5 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-zinc-900/90 border border-zinc-700/80 p-1 flex items-center justify-center shadow-2xl backdrop-blur-md overflow-hidden ring-4 ring-zinc-950/80">
                {salon.logoUrl ? (
                  <img
                    src={getImageUrl(salon.logoUrl)}
                    alt={salon.storeName || salon.name || 'Logo'}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Scissors className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-1 bg-emerald-500 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-zinc-950 flex items-center gap-1 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Abierto
              </div>
            </div>

            {/* Salon Brand Title & Subtitle */}
            <div className="space-y-2 mb-6 px-4">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {salon.heroTitle || salon.storeName || salon.name || 'Barbería & Salón'}
              </h1>
              <p className="text-sm text-zinc-300 max-w-sm mx-auto leading-relaxed">
                {salon.heroSubtitle || 'Reservá tu turno online en simples pasos. Rápido, fácil y sin esperas.'}
              </p>
            </div>

            {/* Badges / Information Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-md px-2">
              {salon.address && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-zinc-900/80 border border-zinc-800 text-zinc-300 backdrop-blur-xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate max-w-[220px]">{salon.address}</span>
                </div>
              )}

              {salon.openingHours && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-zinc-900/80 border border-zinc-800 text-zinc-300 backdrop-blur-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{salon.openingHours}</span>
                </div>
              )}

              {salon.whatsappPhone && (
                <a
                  href={`https://wa.me/${salon.whatsappPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}

              {salon.instagramUrl && (
                <a
                  href={salon.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              )}
            </div>

            {/* Action Buttons: Reservar Turno + Consultar Turnos */}
            <div className="w-full max-w-sm flex flex-col gap-3 px-4">
              <button
                onClick={handleStartBooking}
                className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-base rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/25 active:scale-[0.99] group"
              >
                <span>Reservar Turno</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Footer link for staff */}
            <div className="mt-10">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate(user?.role === 'SUPER_ADMIN' ? '/superadmin' : '/agenda')}
                  className="text-xs text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <span>Volver al Panel ({user?.fullName || user?.username})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  ¿Sos barbero del staff? <span className="text-amber-500/90 underline font-medium">Acceso Staff</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PASO 1: MULTI-BARBERO (Selección de Profesional)
            ═══════════════════════════════════════════════════════════════ */}
        {step === 1 && !isSingleBarber && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
                <User className="w-3.5 h-3.5" />
                <span>Paso 1: Profesional</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ¿Con quién te querés atender?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Elegí a tu barbero de confianza o seleccioná cualquiera para ver más opciones de horarios.
              </p>
            </div>

            {isBarbersLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            ) : (
              <div className="space-y-3">
                {/* Highlight Option: Any Available Barber */}
                <button
                  onClick={() => {
                    setSelectedBarberId('any');
                    setStep(2);
                  }}
                  className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer relative overflow-hidden group ${
                    selectedBarberId === 'any'
                      ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/40'
                      : 'border-zinc-800 bg-zinc-900/80 hover:bg-zinc-850 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-13 h-13 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                        Cualquier barbero disponible
                      </span>
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Más Rápido
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Mayor variedad de horarios y disponibilidad inmediata.
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedBarberId === 'any'
                      ? 'border-amber-500 bg-amber-500 text-zinc-950 font-bold'
                      : 'border-zinc-700'
                  }`}>
                    {selectedBarberId === 'any' && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>

                {/* Individual Barbers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {barbers.map((b) => {
                    const isSelected = selectedBarberId === b.id;
                    const avatarSrc = b.avatarUrl 
                      ? getImageUrl(b.avatarUrl) 
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(b.fullName)}&background=27272a&color=f59e0b&bold=true`;

                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBarberId(b.id);
                          setStep(2);
                        }}
                        className={`p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/40'
                            : 'border-zinc-800 bg-zinc-900/70 hover:bg-zinc-850 hover:border-zinc-700'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={avatarSrc}
                            alt={b.fullName}
                            className="w-13 h-13 rounded-2xl object-cover border border-zinc-700 shadow-md"
                          />
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-zinc-900" title="Disponible" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                            {b.fullName}
                          </div>
                          <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                            {b.bio || 'Especialista en estilismo y corte'}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mt-1">
                            • Disponible
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500 text-zinc-950 font-bold'
                            : 'border-zinc-700'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PASO 2: SELECCIÓN DE SERVICIO
            ═══════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header with Selected Barber Chip */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Paso {isSingleBarber ? '1' : '2'}: Servicio</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  ¿Qué servicio buscás?
                </h2>
              </div>

              {!isSingleBarber && selectedBarber && (
                <div 
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:border-amber-500/50 cursor-pointer self-start transition-colors"
                  title="Cambiar barbero"
                >
                  <span className="text-zinc-500">Con:</span>
                  <span className="font-semibold text-amber-400">{selectedBarber.fullName}</span>
                  <span className="text-[10px] text-zinc-500 underline ml-1">Cambiar</span>
                </div>
              )}
            </div>

            {/* Category Filter Pills (if multiple categories) */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setSelectedCategoryTab('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    selectedCategoryTab === 'all'
                      ? 'bg-amber-500 text-zinc-950 shadow-xs'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Todos los servicios
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryTab(String(c.id))}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      String(selectedCategoryTab) === String(c.id)
                        ? 'bg-amber-500 text-zinc-950 shadow-xs'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {/* Services List */}
            {isServicesLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            ) : services.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/60 border border-zinc-800 rounded-3xl text-zinc-400 text-sm">
                No hay servicios activos disponibles en este momento.
              </div>
            ) : (
              <div className="space-y-6">
                {filteredGroupedServices.map((category) => (
                  <div key={category.id} className="space-y-3">
                    {selectedCategoryTab === 'all' && (
                      <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {category.name}
                      </h3>
                    )}

                    <div className="space-y-2.5">
                      {category.services.map((s) => {
                        const isSelected = selectedServiceId === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSelectedServiceId(s.id);
                              setStep(3);
                            }}
                            className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                              isSelected
                                ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/40'
                                : 'border-zinc-800/90 bg-zinc-900/70 hover:bg-zinc-850 hover:border-zinc-700'
                            }`}
                          >
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="font-bold text-base text-zinc-100 group-hover:text-amber-400 transition-colors">
                                {s.name}
                              </div>
                              {s.description && (
                                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                  {s.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                                  <Clock className="w-3 h-3 text-amber-500/80" />
                                  <span>{s.durationMinutes} min</span>
                                </span>

                                {s.depositAmount && Number(s.depositAmount) > 0 && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                                    Seña: ${Number(s.depositAmount).toLocaleString('es-AR')}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right shrink-0 flex flex-col items-end justify-center">
                              <div className="text-lg sm:text-xl font-black font-mono text-white">
                                ${Number(s.price || 0).toLocaleString('es-AR')}
                              </div>
                              <div className="mt-2 text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                <span>Elegir</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PASO 3: SELECCIÓN DE FECHA Y HORARIO
            ═══════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Paso {isSingleBarber ? '2' : '3'}: Fecha y Horario</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Seleccioná el día y la hora
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Servicio: <strong className="text-white">{selectedService?.name}</strong> •{' '}
                {selectedBarber ? selectedBarber.fullName : 'Cualquier barbero'}
              </p>
            </div>

            {/* Date Picker Carousel (14 days) */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Día del Turno
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {availableDays.map((d) => {
                  const isSelected = selectedDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      onClick={() => {
                        setSelectedDate(d.iso);
                        setSelectedSlot(null);
                        setShowWaitlist(false);
                      }}
                      className={`px-3.5 py-3 rounded-2xl border flex flex-col items-center min-w-[62px] transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                          : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850'
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-zinc-950' : 'text-zinc-500'}`}>
                        {d.dayName}
                      </span>
                      <span className="text-base font-black font-mono my-0.5">{d.dayNumber}</span>
                      <span className={`text-[9px] uppercase ${isSelected ? 'text-zinc-900 font-semibold' : 'text-zinc-500'}`}>
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Time Slots */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Horarios Disponibles</span>
                {slots.length > 0 && (
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {slots.length} turnos libres
                  </span>
                )}
              </div>

              {isSlotsLoading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                  <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
                  <span className="text-xs text-zinc-400 font-medium">Consultando agenda disponible...</span>
                </div>
              ) : slots.length === 0 ? (
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 text-center space-y-4">
                  <Clock className="w-10 h-10 text-zinc-600 mx-auto" />
                  <div>
                    <h3 className="font-bold text-base text-zinc-200">No hay turnos disponibles para esta fecha</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      Podés seleccionar otro día en el calendario o sumarte a la lista de espera para recibir una alerta automática si se cancela un turno.
                    </p>
                  </div>

                  {!showWaitlist ? (
                    <button
                      onClick={() => setShowWaitlist(true)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-bold text-amber-400 transition-colors cursor-pointer"
                    >
                      Anotarme en Lista de Espera
                    </button>
                  ) : (
                    <WaitlistForm
                      slug={slug}
                      date={selectedDate}
                      serviceId={selectedServiceId}
                      barberId={selectedBarberId === 'any' ? null : selectedBarberId}
                      onClose={() => setShowWaitlist(false)}
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Morning Slots */}
                  {morningSlots.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-zinc-400 mb-2.5 flex items-center gap-1.5">
                        <span>☀️ Mañana</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {morningSlots.map((s) => {
                          const timeStr = new Date(s).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          const isSelected = selectedSlot === s;
                          return (
                            <button
                              key={s}
                              onClick={() => setSelectedSlot(s)}
                              className={`py-3 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              {timeStr} hs
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Afternoon Slots */}
                  {afternoonSlots.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-zinc-400 mb-2.5 flex items-center gap-1.5">
                        <span>🌙 Tarde / Noche</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {afternoonSlots.map((s) => {
                          const timeStr = new Date(s).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          const isSelected = selectedSlot === s;
                          return (
                            <button
                              key={s}
                              onClick={() => setSelectedSlot(s)}
                              className={`py-3 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              {timeStr} hs
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Next CTA */}
            <div className="pt-3">
              <button
                onClick={() => setStep(4)}
                disabled={!selectedSlot}
                className="w-full h-14 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 disabled:cursor-not-allowed text-zinc-950 font-black text-base rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>Continuar a Mis Datos</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PASO 4: DATOS DEL CLIENTE Y CONFIRMACIÓN
            ═══════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Paso {isSingleBarber ? '3' : '4'}: Confirmación</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Completá tus datos
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Revisá el resumen del turno y dejanos tus datos para asegurar tu reserva.
              </p>
            </div>

            {/* Booking Summary Card */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden backdrop-blur-xs">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <div>
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Servicio Seleccionado</div>
                  <div className="text-lg font-black text-white mt-0.5">{selectedService?.name}</div>
                  <div className="text-xs text-zinc-400 font-mono flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{selectedService?.durationMinutes} minutos de atención</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Total</div>
                  <div className="text-xl font-black font-mono text-amber-400 mt-0.5">
                    ${Number(selectedService?.price || 0).toLocaleString('es-AR')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Barbero / Profesional</div>
                  <div className="font-bold text-zinc-200 mt-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    <span>{selectedBarber?.fullName || 'Cualquiera disponible'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Fecha y Horario</div>
                  <div className="font-bold text-zinc-200 mt-1 font-mono flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      {selectedSlot &&
                        new Date(selectedSlot).toLocaleString('es-AR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                      hs
                    </span>
                  </div>
                </div>
              </div>

              {selectedService?.depositAmount && Number(selectedService.depositAmount) > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Requiere seña de ${Number(selectedService.depositAmount).toLocaleString('es-AR')}.</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Podrás subir el comprobante de transferencia desde la pantalla de confirmación.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre y apellido"
                  value={clientData.clientName}
                  onChange={(e) => setClientData({ ...clientData, clientName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  WhatsApp / Celular *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 11 2345 6789"
                  value={clientData.clientPhone}
                  onChange={(e) => setClientData({ ...clientData, clientPhone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Te avisaremos por WhatsApp si hay algún cambio o recordatorio para tu turno.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="nombre@ejemplo.com"
                  value={clientData.clientEmail}
                  onChange={(e) => setClientData({ ...clientData, clientEmail: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Enviaremos el enlace privado con el que podrás consultar o reprogramar tu cita.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-zinc-500" />
                  Aclaraciones o Notas (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: corte degradé, perfilado con navaja, etc."
                  value={clientData.notes}
                  onChange={(e) => setClientData({ ...clientData, notes: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500/80 resize-none transition-all"
                />
              </div>
            </div>

            {/* Confirm CTA */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={
                  isPending ||
                  !clientData.clientName ||
                  !clientData.clientEmail ||
                  !clientData.clientPhone
                }
                className="w-full h-15 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 disabled:cursor-not-allowed text-zinc-950 font-black text-base rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/25 active:scale-[0.99]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Guardando tu reserva...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Confirmar Turno</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default BookingPage;
