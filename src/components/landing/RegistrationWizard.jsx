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
  'w-full h-12 rounded-xl bg-white/[0.02] border text-sm text-white placeholder:text-zinc-600 transition-all outline-none focus:ring-4 font-normal tracking-tight';
const INPUT_OK = 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20';
const INPUT_ERR = 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20';

function Field({ id, label, icon: Icon, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        {children}
      </div>
      {error ? (
        <p className="text-red-400 text-xs mt-1.5 font-medium">{error}</p>
      ) : (
        hint && <p className="text-zinc-500 text-[11px] mt-1.5">{hint}</p>
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

  // Entrada escalonada + bloqueo de scroll + ESC.
  // Se bloquea <html> ademas de <body>: index.css/index.html fijan overflow-x: clip en <html>,
  // lo que impide que el overflow del <body> se propague al viewport (el scroll seguia activo).
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 40);
    const html = document.documentElement;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;
    document.body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const focusTimer = setTimeout(() => nameInputRef.current?.focus(), 450);
    return () => {
      clearTimeout(t);
      clearTimeout(focusTimer);
      document.body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
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
    <div className="fixed inset-0 z-[200] bg-zinc-950/80 backdrop-blur-2xl overflow-hidden lp-root font-sans" role="dialog" aria-modal="true">
      <div className="h-full w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* ───────── LADO IZQUIERDO: PREVIEW INTERACTIVO (solo desktop) ───────── */}
        <div
          className={`hidden lg:flex w-1/2 h-full bg-zinc-950 text-white p-8 xl:p-12 flex-col justify-between relative overflow-hidden border-r border-white/5 shrink-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 text-[10px] uppercase tracking-[0.15em] font-bold text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Preview en vivo</span>
            </span>
          </div>

          {/* Telefono centralizado */}
          <div className="relative my-auto flex flex-col items-center justify-center z-10 pointer-events-none">
            <BookingPortalPhoneDemo
              forcedStep={step === 1 ? 0 : step === 2 ? 1 : 2}
              businessName={displayName}
              slug={displaySlug}
              isStatic={true}
              preset={preset}
            />
          </div>

          <div className="relative text-xs text-zinc-500 flex items-center justify-between pt-2 border-t border-zinc-800/60 z-10">
            <span className="text-[11px]">Plan Cero · gratis para siempre</span>
            <span className="lp-mono text-[9px] text-zinc-400">{LANDING_CONFIG.rootDomain}</span>
          </div>
        </div>

        {/* ───────── LADO DERECHO: FORMULARIO ───────── */}
        {/* En desktop compactamos paddings/espaciados para que entre sin scroll; el overflow queda como red de seguridad (sin barra visible) para pantallas muy bajas. */}
        <div
          className={`w-full lg:w-1/2 min-h-full lg:h-full bg-zinc-900/40 p-6 sm:p-8 lg:px-10 lg:py-6 xl:px-16 xl:py-8 flex flex-col justify-between shrink-0 lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            ready ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
          }`}
        >
          <div>
            {/* Top bar movil + cerrar */}
            <div className="flex items-center justify-between mb-6 lg:mb-4">
              <img src="/roosty2.png" alt="Roosty" className="h-6 w-auto lg:hidden invert opacity-90" />
              <span className="hidden lg:block" />
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">
              <span>
                {step === 1 && 'Paso 01 / 02 — Setup Inicial'}
                {step === 2 && 'Paso 02 / 02 — Configuración'}
                {step === 3 && 'Deployment Completo'}
              </span>
              <span className="text-white">{progress}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Cuerpo */}
          <div className="my-auto max-w-md w-full mx-auto py-2">
            {/* PASO 1 */}
            {step === 1 && (
              <form onSubmit={handleStep1} className="space-y-5" noValidate>
                <div {...stagger(80)}>
                  <h1 className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tighter leading-tight">
                    Cuenta admin.
                  </h1>
                  <p className="text-zinc-400 text-sm mt-2 tracking-tight">
                    Credenciales de acceso para tu panel de control.
                  </p>
                </div>

                <div className="space-y-4 pt-1">
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
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </Field>
                  </div>
                </div>

                <div {...stagger(420)} className="pt-2">
                  <button
                    type="submit"
                    className="group bg-white hover:bg-zinc-100 text-zinc-950 w-full h-12 inline-flex items-center justify-between px-5 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
                  >
                    <span className="tracking-tight">Siguiente paso</span>
                    <span className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <form onSubmit={handleStep2} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500" noValidate>
                <div>
                  <h1 className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tighter leading-tight">
                    Datos del negocio.
                  </h1>
                  <p className="text-zinc-400 text-sm mt-2 tracking-tight">
                    Configuración visible para tus clientes.
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
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">
                    Tu rubro
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {INDUSTRIES.map((ind) => {
                      const Icon = ind.icon;
                      const selected = form.industry === ind.id;
                      return (
                        <button
                          key={ind.id}
                          type="button"
                          onClick={() => setField('industry', ind.id)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                            selected
                              ? 'bg-indigo-500/10 border-indigo-500/50 ring-2 ring-indigo-500/20'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              selected ? 'bg-indigo-500 text-white' : 'bg-white/5 text-zinc-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className={`font-semibold text-xs tracking-tight truncate ${selected ? 'text-white' : 'text-zinc-300'}`}>
                              {ind.label}
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate leading-none mt-1">{ind.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field
                  id="slug"
                  label="Link de reservas"
                  error={fieldErrors.slug}
                  hint="URL pública de tu portal."
                >
                  <input
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleSlug}
                    placeholder={preset.slug}
                    autoComplete="off"
                    className={`${INPUT_BASE} pl-4 pr-[148px] font-mono text-indigo-400 font-bold ${
                      fieldErrors.slug ? INPUT_ERR : INPUT_OK
                    }`}
                  />
                  <span className="absolute inset-y-0 right-4 flex items-center text-[11px] font-mono text-zinc-500 pointer-events-none">
                    .{LANDING_CONFIG.rootDomain}
                  </span>
                </Field>

                {globalError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 space-y-2">
                    <p className="font-medium leading-relaxed">{globalError}</p>
                    <a
                      href={WHATSAPP_SALES_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-red-300 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Escribinos por WhatsApp
                    </a>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setGlobalError('');
                    }}
                    className="px-4 h-12 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] active:scale-[0.98] text-zinc-300 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer tracking-tight"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group bg-white hover:bg-zinc-100 text-zinc-950 flex-1 h-12 inline-flex items-center justify-between px-5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2 mx-auto">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="tracking-tight">Desplegando...</span>
                      </span>
                    ) : (
                      <>
                        <span className="tracking-tight">Finalizar setup</span>
                        <span className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                          <ArrowRight className="w-4 h-4 text-white" />
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
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h1 className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tighter mb-2">
                  Sistema online.
                </h1>
                <p className="text-zinc-400 text-sm max-w-sm mb-8 tracking-tight">
                  Tu portal está provisionado y activo.
                </p>

                <div className="w-full p-2 rounded-[1.5rem] bg-white/[0.02] border border-white/5 mb-6 text-left">
                  <div className="rounded-xl bg-zinc-950 border border-white/5 divide-y divide-white/5">
                    <div className="p-5 flex items-start gap-4">
                      <div className="flex-1">
                        <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-2">
                          Endpoint público
                        </span>
                        <span className="font-mono text-sm font-bold text-indigo-400 break-all select-all block mb-4">
                          {success.slug}.{LANDING_CONFIG.rootDomain}
                        </span>
                        <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-2">
                          Admin login
                        </span>
                        <span className="font-mono text-sm font-medium text-white break-all select-all">
                          {form.email.trim().toLowerCase()}
                        </span>
                      </div>
                      <div className="shrink-0">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://${success.slug}.${LANDING_CONFIG.rootDomain}/book`}
                          alt="QR Code"
                          className="w-[80px] h-[80px] rounded-lg border border-white/10 object-cover invert-[0.9]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={loginUrl}
                  className="group w-full h-12 inline-flex items-center justify-between px-5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-sm font-semibold active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-zinc-950 transition-colors" />
                    <span className="tracking-tight">Abrir dashboard</span>
                  </span>
                  {autoRedirect ? (
                    <span className="flex items-center gap-2 text-zinc-500 font-normal text-xs">
                      <span>Iniciando en</span>
                      <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded">
                        {countdown}s
                      </span>
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-zinc-950" />
                  )}
                </a>

                {autoRedirect && (
                  <button
                    type="button"
                    onClick={() => setAutoRedirect(false)}
                    className="mt-4 text-[11px] font-medium text-zinc-500 hover:text-white transition-colors cursor-pointer uppercase tracking-widest"
                  >
                    Abortar auto-login
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 mt-4">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px] uppercase tracking-widest">Conexión Segura</span>
            </div>
            <img src="/roosty2.png" alt="Roosty" className="h-4 w-auto opacity-50 invert" />
          </div>
        </div>
      </div>
    </div>
  );
}
