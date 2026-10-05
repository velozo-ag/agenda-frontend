import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Store,
  Scissors,
  Sparkles,
  Hand,
  Users,
  Globe,
  Plus,
  X,
  ExternalLink,
  CalendarCheck,
  MessageCircle,
} from 'lucide-react';
import { axiosClient } from '../../api/axiosClient';
import { buildTenantLoginUrl, buildTenantAutoLoginUrl, LANDING_CONFIG, WHATSAPP_SALES_LINK } from './landingConfig';

import { BookingPortalPhoneDemo } from './BookingPortalPhoneDemo';

const INDUSTRY_DATA = {
  BARBERIA: {
    tag: 'Barbería clásica',
    defaultName: 'BARBERÍA EL BARÓN',
    slug: 'elbaron',
    items: [
      { name: 'Corte Fade', desc: '30 min', price: '$ 9.000', hint: 'Degradé a máquina y navaja' },
      { name: 'Corte + Barba', desc: '45 min', price: '$ 13.500', hint: 'Corte, perfilado y toalla' },
    ],
    cart: 'Corte Fade • Lucho',
    cartPrice: '$ 9.000',
  },
  PELUQUERIA: {
    tag: 'Peluquería & Color',
    defaultName: 'ESTUDIO LUNA',
    slug: 'estudioluna',
    items: [
      { name: 'Corte + Brushing', desc: '60 min', price: '$ 12.000' },
      { name: 'Color Raíz', desc: '90 min', price: '$ 18.500', hint: 'Tintura profesional' },
    ],
    cart: 'Corte + Brushing • Ana',
    cartPrice: '$ 12.000',
  },
  UNISEX: {
    tag: 'Salón unisex',
    defaultName: 'URBAN SALON',
    slug: 'urbansalon',
    items: [
      { name: 'Corte Unisex', desc: '40 min', price: '$ 10.500' },
      { name: 'Barba & Perfilado', desc: '30 min', price: '$ 6.500' },
    ],
    cart: 'Corte Unisex • Dani',
    cartPrice: '$ 10.500',
  },
  ESTETICA: {
    tag: 'Estética & Uñas',
    defaultName: 'NAILS & CO',
    slug: 'nailsco',
    items: [
      { name: 'Semipermanente', desc: '60 min', price: '$ 11.000' },
      { name: 'Uñas Esculpidas', desc: '120 min', price: '$ 16.000', hint: 'Set completo a elección' },
    ],
    cart: 'Semipermanente • Sol',
    cartPrice: '$ 11.000',
  },
};

const INDUSTRIES = [
  { id: 'BARBERIA', label: 'Barbería', icon: Scissors, desc: 'Cortes, barba y fade' },
  { id: 'PELUQUERIA', label: 'Peluquería', icon: Sparkles, desc: 'Color, brushing y corte' },
  { id: 'UNISEX', label: 'Salón unisex', icon: Users, desc: 'Varios servicios y equipo' },
  { id: 'ESTETICA', label: 'Estética & Uñas', icon: Hand, desc: 'Manos, pies y belleza' },
];

// Campos del backend -> campos del formulario
const BACKEND_FIELD_MAP = {
  adminName: 'ownerName',
  adminEmail: 'email',
  adminPassword: 'password',
  adminPhone: 'whatsapp',
  businessName: 'businessName',
  desiredSlug: 'slug',
};
const STEP1_FIELDS = ['ownerName', 'email', 'whatsapp', 'password'];

const slugify = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);

const INPUT_BASE =
  'w-full h-11 rounded-xl bg-white border text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none focus:ring-4';
const INPUT_OK = 'border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500/10';
const INPUT_ERR = 'border-red-400 focus:border-red-500 focus:ring-red-500/10';

function Field({ id, label, icon: Icon, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        {children}
      </div>
      {error ? (
        <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
      ) : (
        hint && <p className="text-zinc-400 text-[11px] mt-1">{hint}</p>
      )}
    </div>
  );
}

export function RegistrationWizard({ onClose }) {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [success, setSuccess] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  const businessInputRef = useRef(null);
  const nameInputRef = useRef(null);

  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    whatsapp: '',
    password: '',
    businessName: '',
    industry: 'BARBERIA',
    slug: '',
  });

  // Entrada escalonada + bloqueo de scroll + ESC
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 40);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    setTimeout(() => nameInputRef.current?.focus(), 450);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  }, []);

  const handleChange = (e) => setField(e.target.name, e.target.value);

  const handleBusinessName = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      businessName: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
    setFieldErrors((prev) => ({ ...prev, businessName: '', ...(slugTouched ? {} : { slug: '' }) }));
  };

  const handleSlug = (e) => {
    setSlugTouched(true);
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 30);
    setField('slug', value);
  };

  const handleStep1 = (e) => {
    e?.preventDefault();
    const errors = {};
    if (form.ownerName.trim().length < 2) errors.ownerName = 'Ingresá tu nombre completo';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Ingresá un email válido';
    if (form.whatsapp.trim().length < 7) errors.whatsapp = 'Ingresá tu WhatsApp con código de área';
    if (form.password.length < 6) errors.password = 'Mínimo 6 caracteres';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setGlobalError('');
    setStep(2);
    setTimeout(() => businessInputRef.current?.focus(), 250);
  };

  const handleStep2 = async (e) => {
    e?.preventDefault();
    const errors = {};
    const cleanSlug = slugify(form.slug || form.businessName);
    if (form.businessName.trim().length < 2) errors.businessName = 'Ingresá el nombre de tu local';
    if (cleanSlug.length < 3) errors.slug = 'Tu link debe tener al menos 3 caracteres';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setGlobalError('');
    setFieldErrors({});

    try {
      // axiosClient ya apunta a /api/v1 y desenvuelve la respuesta
      const data = await axiosClient.post('/registration/register-tenant', {
        businessName: form.businessName.trim(),
        desiredSlug: cleanSlug,
        adminName: form.ownerName.trim(),
        adminEmail: form.email.trim().toLowerCase(),
        adminPassword: form.password,
        adminPhone: form.whatsapp.trim(),
      });
      setSuccess({ slug: data?.slug || cleanSlug, token: data?.token });
      setStep(3);
    } catch (err) {
      if (err.fieldErrors && typeof err.fieldErrors === 'object') {
        const mapped = {};
        Object.entries(err.fieldErrors).forEach(([k, v]) => {
          mapped[BACKEND_FIELD_MAP[k] || k] = v;
        });
        setFieldErrors(mapped);
        if (STEP1_FIELDS.some((f) => mapped[f])) setStep(1);
      }
      const msg = err.message || 'No pudimos crear tu cuenta. Intentá de nuevo.';
      const lower = msg.toLowerCase();
      if (lower.includes('email') || lower.includes('correo')) {
        setFieldErrors((prev) => ({ ...prev, email: msg }));
        setStep(1);
      } else if (lower.includes('dominio') || lower.includes('slug')) {
        setFieldErrors((prev) => ({ ...prev, slug: msg }));
      } else {
        setGlobalError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginUrl = (success && success.token) ? buildTenantAutoLoginUrl(success.slug, success.token) : (success ? buildTenantLoginUrl(success.slug) : '#');

  // Cuenta regresiva y auto-redireccion
  useEffect(() => {
    if (step !== 3 || !success || !autoRedirect) return undefined;
    if (countdown <= 0) {
      window.location.href = loginUrl;
      return undefined;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, success, autoRedirect, countdown, loginUrl]);

  const preset = INDUSTRY_DATA[form.industry] || INDUSTRY_DATA.BARBERIA;
  const displayName = form.businessName.trim() || preset.defaultName;
  const displaySlug = form.slug || slugify(form.businessName) || preset.slug;
  const progress = step === 1 ? 50 : step === 2 ? 90 : 100;

  const stagger = (delay) => ({
    style: { transitionDelay: `${delay}ms` },
    className: `transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      ready ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`,
  });

  return (
    <div className="fixed inset-0 z-[200] bg-[#faf9f8] overflow-hidden lp-root" role="dialog" aria-modal="true">
      <div className="h-full w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* ───────── LADO IZQUIERDO: PREVIEW INTERACTIVO (solo desktop) ───────── */}
        <div
          className={`hidden lg:flex w-1/2 h-full bg-[#0e0e11] text-zinc-100 p-8 xl:p-10 flex-col justify-between relative overflow-hidden border-r border-zinc-800/80 shrink-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            ready ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
          }`}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute inset-0 lp-dots-dark opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none" />

          <div className="relative flex items-center justify-between z-10">
            <button type="button" onClick={onClose} className="flex items-center gap-2 group cursor-pointer" aria-label="Volver">
              <img
                src="/roosty2.png"
                alt="Roosty"
                className="h-7 w-auto object-contain invert opacity-90 transition-opacity group-hover:opacity-70"
              />
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] lp-mono text-zinc-400">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Vista previa de tu portal</span>
            </span>
          </div>

          {/* Telefono Centralizado */}
          <div className="relative my-auto flex flex-col items-center justify-center -mt-4 z-10 pointer-events-none">
            <BookingPortalPhoneDemo
              forcedStep={step === 1 ? 0 : step === 2 ? 1 : 2}
              businessName={displayName}
              slug={displaySlug}
              isStatic={true}
              preset={preset}
            />

            <div className="w-[285px] sm:w-[310px] mt-4 p-3 rounded-2xl bg-zinc-900/95 border border-zinc-800 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div className="truncate text-left">
                  <div className="text-[11px] font-semibold text-white truncate leading-tight mb-0.5">Reservas 24/7 automáticas</div>
                  <div className="text-[9px] text-zinc-400 truncate">Caen directo en tu agenda online</div>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                100% Tuyo
              </span>
            </div>
          </div>

          <div className="relative text-xs text-zinc-500 flex items-center justify-between pt-2 border-t border-zinc-800/60 z-10">
            <span className="text-[11px]">Plan Cero · gratis para siempre</span>
            <span className="lp-mono text-[9px] text-zinc-400">{LANDING_CONFIG.rootDomain}</span>
          </div>
        </div>

        {/* ───────── LADO DERECHO: FORMULARIO ───────── */}
        <div
          className={`w-full lg:w-1/2 min-h-full lg:h-full bg-[#faf9f8] p-6 sm:p-8 xl:p-12 flex flex-col justify-between shrink-0 lg:overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            ready ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
          }`}
        >
          <div>
            {/* Top bar movil + cerrar */}
            <div className="flex items-center justify-between mb-5">
              <img src="/roosty2.png" alt="Roosty" className="h-6 w-auto lg:hidden" />
              <span className="hidden lg:block" />
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:border-zinc-300 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 mb-2">
              <span className="lp-mono uppercase tracking-wider text-zinc-700">
                {step === 1 && 'Paso 01 / 02 — Tus datos'}
                {step === 2 && 'Paso 02 / 02 — Tu local'}
                {step === 3 && '¡Tu cuenta está lista!'}
              </span>
              <span className="lp-mono lp-tabular text-zinc-900 font-bold">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Cuerpo */}
          <div className="my-auto max-w-md w-full mx-auto py-4">
            {/* PASO 1 */}
            {step === 1 && (
              <form onSubmit={handleStep1} className="space-y-4" noValidate>
                <div {...stagger(80)}>
                  <h1 className="lp-serif text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight leading-tight">
                    Comencemos por vos.
                  </h1>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                    Creá tu usuario administrador para gestionar tu agenda.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div {...stagger(160)}>
                    <Field id="ownerName" label="Tu nombre completo" icon={User} error={fieldErrors.ownerName}>
                      <input
                        ref={nameInputRef}
                        id="ownerName"
                        name="ownerName"
                        autoComplete="name"
                        value={form.ownerName}
                        onChange={handleChange}
                        placeholder="Ej. Tomás Rodríguez"
                        className={`${INPUT_BASE} pl-10 pr-3.5 ${fieldErrors.ownerName ? INPUT_ERR : INPUT_OK}`}
                      />
                    </Field>
                  </div>

                  <div {...stagger(220)}>
                    <Field
                      id="email"
                      label="Email (será tu usuario de acceso)"
                      icon={Mail}
                      error={fieldErrors.email}
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        className={`${INPUT_BASE} pl-10 pr-3.5 ${fieldErrors.email ? INPUT_ERR : INPUT_OK}`}
                      />
                    </Field>
                  </div>

                  <div {...stagger(280)}>
                    <Field id="whatsapp" label="WhatsApp" icon={Phone} error={fieldErrors.whatsapp}>
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        autoComplete="tel"
                        value={form.whatsapp}
                        onChange={handleChange}
                        placeholder="Ej. 3482 626653"
                        className={`${INPUT_BASE} pl-10 pr-3.5 ${fieldErrors.whatsapp ? INPUT_ERR : INPUT_OK}`}
                      />
                    </Field>
                  </div>

                  <div {...stagger(340)}>
                    <Field id="password" label="Contraseña" icon={Lock} error={fieldErrors.password}>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        className={`${INPUT_BASE} pl-10 pr-11 ${fieldErrors.password ? INPUT_ERR : INPUT_OK}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </Field>
                  </div>
                </div>

                <div {...stagger(420)}>
                  <button
                    type="submit"
                    className="group lp-btn-indigo w-full h-12 inline-flex items-center justify-center gap-2.5 px-5 rounded-xl text-sm font-semibold cursor-pointer"
                  >
                    <span>Continuar</span>
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <form onSubmit={handleStep2} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500" noValidate>
                <div>
                  <h1 className="lp-serif text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight leading-tight">
                    Ahora, tu local.
                  </h1>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                    Mirá cómo va quedando tu portal en la vista previa.
                  </p>
                </div>

                <Field id="businessName" label="Nombre de tu local" icon={Store} error={fieldErrors.businessName}>
                  <input
                    ref={businessInputRef}
                    id="businessName"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleBusinessName}
                    placeholder={`Ej. ${preset.defaultName.charAt(0)}${preset.defaultName.slice(1).toLowerCase()}`}
                    className={`${INPUT_BASE} pl-10 pr-3.5 ${fieldErrors.businessName ? INPUT_ERR : INPUT_OK}`}
                  />
                </Field>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Tu rubro
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {INDUSTRIES.map((ind) => {
                      const Icon = ind.icon;
                      const selected = form.industry === ind.id;
                      return (
                        <button
                          key={ind.id}
                          type="button"
                          onClick={() => setField('industry', ind.id)}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                            selected
                              ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500/15'
                              : 'bg-white border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              selected ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className={`font-semibold text-xs truncate ${selected ? 'text-zinc-950' : 'text-zinc-800'}`}>
                              {ind.label}
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate leading-none mt-0.5">{ind.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field
                  id="slug"
                  label="Tu link personalizado"
                  error={fieldErrors.slug}
                  hint="Es la dirección que van a usar tus clientes para reservar."
                >
                  <input
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleSlug}
                    placeholder={preset.slug}
                    autoComplete="off"
                    className={`${INPUT_BASE} pl-3.5 pr-[148px] lp-mono text-indigo-700 font-semibold ${
                      fieldErrors.slug ? INPUT_ERR : INPUT_OK
                    }`}
                  />
                  <span className="absolute inset-y-0 right-3.5 flex items-center text-[11px] lp-mono text-zinc-400 pointer-events-none">
                    .{LANDING_CONFIG.rootDomain}
                  </span>
                </Field>

                {globalError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/90 text-xs text-red-800 space-y-2">
                    <p className="font-medium leading-relaxed">{globalError}</p>
                    <a
                      href={WHATSAPP_SALES_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Escribinos por WhatsApp
                    </a>
                  </div>
                )}

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setGlobalError('');
                    }}
                    className="px-4 h-12 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] text-zinc-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Atrás</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group lp-btn-indigo flex-1 h-12 inline-flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creando tu barbería...</span>
                      </>
                    ) : (
                      <>
                        <span>Crear mi cuenta gratis</span>
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* PASO 3: EXITO */}
            {step === 3 && success && (
              <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h1 className="lp-serif text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight mb-1.5">
                  ¡Tu barbería está lista!
                </h1>
                <p className="text-zinc-600 text-sm max-w-sm mb-5">
                  Creamos tu cuenta en el <strong className="text-zinc-900">Plan Cero</strong>. Entrá, cargá tus
                  servicios y horarios y compartí tu link.
                </p>

                <div className="w-full lp-bezel-light rounded-2xl p-1.5 mb-4 text-left">
                  <div className="rounded-xl bg-white border border-zinc-200/80 divide-y divide-zinc-100">
                    <div className="p-3.5 flex items-start gap-4">
                      <div className="flex-1">
                        <span className="lp-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                          Tu link de reservas
                        </span>
                        <span className="lp-mono text-sm font-semibold text-indigo-700 break-all select-all block mb-3">
                          {success.slug}.{LANDING_CONFIG.rootDomain}
                        </span>
                        <span className="lp-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                          Usuario de acceso
                        </span>
                        <span className="lp-mono text-sm font-semibold text-zinc-900 break-all select-all">
                          {form.email.trim().toLowerCase()}
                        </span>
                      </div>
                      <div className="shrink-0 flex flex-col items-center gap-1.5">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://${success.slug}.${LANDING_CONFIG.rootDomain}/book`}
                          alt="QR Code"
                          className="w-[72px] h-[72px] rounded-lg border border-zinc-200 object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-2.5 flex items-center justify-between gap-3 bg-zinc-50/50 rounded-b-xl">
                      <span className="lp-mono text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Plan Cero
                      </span>
                      <a
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://${success.slug}.${LANDING_CONFIG.rootDomain}/book`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors lp-mono uppercase tracking-widest flex items-center gap-1"
                      >
                        Descargar QR
                      </a>
                    </div>
                  </div>
                </div>

                <a
                  href={loginUrl}
                  className="group w-full h-12 inline-flex items-center justify-between px-5 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white text-sm font-semibold shadow-md active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span>Ir a mi panel ahora</span>
                  </span>
                  {autoRedirect ? (
                    <span className="flex items-center gap-1.5 text-zinc-400 font-normal text-[11px]">
                      <span>Auto-apertura en</span>
                      <span className="lp-mono lp-tabular text-xs font-bold text-indigo-300 bg-white/10 px-2 py-0.5 rounded">
                        {countdown}s
                      </span>
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-zinc-400" />
                  )}
                </a>

                {autoRedirect && (
                  <button
                    type="button"
                    onClick={() => setAutoRedirect(false)}
                    className="mt-3 text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                  >
                    Cancelar redirección automática
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px]">Tus datos viajan cifrados</span>
            </div>
            <img src="/roosty2.png" alt="Roosty" className="h-4 w-auto opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}
