import React, { useState, useEffect } from 'react';
import {
  Palette,
  Store,
  Image as ImageIcon,
  MapPin,
  Phone,
  Clock,
  Save,
  Check,
  Eye,
  Loader2,
  Type,
  QrCode,
  Copy,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { useMyTenant, useUpdateBranding, applyTenantTheme } from '../../hooks/useTenantBranding';
import { ImageUploader } from '../ui/ImageUploader';
import { Switch } from '../ui/Switch';
import { getImageUrl } from '../../utils/imageUrl';

function InstagramIcon({ className = "w-3 h-3" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const PRESET_COLORS = [
  { name: 'Carmesí / Rojo', hex: '#e52b38' },
  { name: 'Ámbar Clásico', hex: '#f59e0b' },
  { name: 'Esmeralda', hex: '#10b981' },
  { name: 'Rubí / Rose', hex: '#f43f5e' },
  { name: 'Cian Neón', hex: '#06b6d4' },
  { name: 'Naranja Fuego', hex: '#f97316' },
  { name: 'Índigo Real', hex: '#6366f1' },
];

const PRESET_BACKGROUNDS = [
  { name: 'Cálido Vintage / Cuero', hex: '#140e0c' },
  { name: 'Carbón / Pitch Black', hex: '#09090b' },
  { name: 'Azul Noche / Midnight', hex: '#0a0f1d' },
  { name: 'Verde Botánico / Forest', hex: '#0a140f' },
  { name: 'Espresso Profundo', hex: '#181412' },
];

const PRESET_FONTS = [
  { id: 'Merriweather', name: 'Merriweather', category: 'Serif Clásico & Elegante', sample: 'Corte Clásico & Barba' },
  { id: 'Montserrat', name: 'Montserrat', category: 'Sans Geométrica Moderna', sample: 'Corte Fade & Perfilado' },
  { id: 'Roboto', name: 'Roboto', category: 'Sans Limpia & Contemporánea', sample: 'Barbería de Especialidad' },
  { id: 'Playfair Display', name: 'Playfair Display', category: 'Serif Elegante & Premium', sample: 'Estilismo de Autor' },
  { id: 'Inter', name: 'Inter', category: 'Sans Digital Estándar', sample: 'Portal de Reservas' },
];

export function TenantBrandingSettingsView() {
  const { data: tenantData, isLoading } = useMyTenant();
  const updateBrandingMutation = useUpdateBranding();

  const [formData, setFormData] = useState({
    storeName: '',
    logoUrl: '',
    heroUrl: '',
    backgroundImageUrl: '',
    heroTitle: '',
    heroSubtitle: '',
    primaryColor: '#6366f1',
    backgroundColor: '#09090b',
    fontFamily: 'Montserrat',
    address: '',
    phone: '',
    contactEmail: '',
    whatsappPhone: '',
    openingHours: 'Lun-Sáb 09:00-20:00',
    instagramUrl: '',
  });

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    if (tenantData) {
      applyTenantTheme(tenantData);
      setFormData({
        storeName: tenantData.storeName || tenantData.name || '',
        logoUrl: tenantData.logoUrl || '',
        heroUrl: tenantData.heroUrl || '',
        backgroundImageUrl: tenantData.backgroundImageUrl || '',
        heroTitle: tenantData.heroTitle || '',
        heroSubtitle: tenantData.heroSubtitle || '',
        primaryColor: tenantData.primaryColor || '#6366f1',
        backgroundColor: tenantData.backgroundColor || '#09090b',
        fontFamily: tenantData.fontFamily || 'Montserrat',
        address: tenantData.address || '',
        phone: tenantData.phone || '',
        contactEmail: tenantData.contactEmail || '',
        whatsappPhone: tenantData.whatsappPhone || '',
        openingHours: tenantData.openingHours || 'Lun-Sáb 09:00-20:00',
        instagramUrl: tenantData.instagramUrl || '',
      });
    }
  }, [tenantData]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const nextState = { ...prev, [field]: value };
      if (field === 'primaryColor') {
        applyTenantTheme(nextState);
      }
      return nextState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBrandingMutation.mutate(formData, {
      onSuccess: () => {
        showToast('Identidad de marca guardada exitosamente');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400 text-xs">
        <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
        <span>Cargando identidad visual del local...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-zinc-900 border border-zinc-700 text-zinc-100 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-400" />
          <span>Identidad Visual & Portal de Reservas</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Personalizá el logo, portada, wallpaper de fondo, tipografía, color de acentuación global y datos de contacto de tu salón.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Fields with Clean Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Marca & Textos */}
            <div className="space-y-3 pb-6 border-b border-zinc-850">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Textos de Portada</span>
              </h3>

              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400 font-mono">
                    Nombre Comercial de la Barbería
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => handleChange('storeName', e.target.value)}
                    placeholder="Ej: Roosty Barbería"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400 font-mono">
                    Título Destacado del Portal
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => handleChange('heroTitle', e.target.value)}
                    placeholder="Ej: Cortes de Autor & Barbería Clásica"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400 font-mono">
                    Subtítulo / Bajada del Portal
                  </label>
                  <textarea
                    rows={2}
                    value={formData.heroSubtitle}
                    onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                    placeholder="Ej: Reservá tu turno online en segundos con tu profesional de confianza"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 resize-none font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Tipografía del Menú Digital */}
            <div className="space-y-3 pb-6 border-b border-zinc-850">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>Tipografía del Portal de Reservas</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {PRESET_FONTS.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => handleChange('fontFamily', font.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      formData.fontFamily === font.id
                        ? 'border-zinc-200 bg-zinc-800 text-white shadow-md'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono">{font.name}</span>
                      {formData.fontFamily === font.id && (
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: formData.primaryColor }}
                        />
                      )}
                    </div>
                    <span 
                      className="text-sm font-bold text-zinc-100 mt-2 truncate"
                      style={{ fontFamily: font.id }}
                    >
                      {font.sample}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      {font.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Color Primario (Global) & Fondo */}
            <div className="space-y-6 pb-6 border-b border-zinc-850">
              {/* Color Primario / Acentuación Global */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Color de Acentuación Global (Toda la App)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-indigo-400/90 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    Toda la interfaz
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => handleChange('primaryColor', color.hex)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          formData.primaryColor.toLowerCase() === color.hex.toLowerCase()
                            ? 'border-zinc-300 bg-zinc-800 text-zinc-100 shadow-sm'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="w-20 bg-transparent text-xs font-mono text-zinc-200 uppercase focus:outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Hex personalizado de acento
                    </span>
                  </div>
                </div>
              </div>

              {/* Color de Fondo de el portal (Solo Menú QR) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Color de Fondo del Portal de Reservas</span>
                </h3>

                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {PRESET_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.hex}
                        type="button"
                        onClick={() => handleChange('backgroundColor', bg.hex)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          formData.backgroundColor.toLowerCase() === bg.hex.toLowerCase()
                            ? 'border-zinc-300 bg-zinc-800 text-zinc-100 shadow-sm'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                          style={{ backgroundColor: bg.hex }}
                        />
                        <span>{bg.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
                      <input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.backgroundColor}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="w-20 bg-transparent text-xs font-mono text-zinc-200 uppercase focus:outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Hex personalizado para el fondo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Imágenes, Portadas & Fondos */}
            <div className="space-y-3 pb-6 border-b border-zinc-850">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Logo, Portada & Wallpaper de Fondo</span>
              </h3>

              <div className="space-y-4 pt-1">
                <ImageUploader
                  label="Logo Cuadrado del Local"
                  description="Aparece en el encabezado y en la portada (JPG, PNG o WEBP). Si no se sube, se utiliza el isotipo oficial de Roosty por defecto."
                  value={formData.logoUrl}
                  onChange={(url) => handleChange('logoUrl', url)}
                  previewAspect="square"
                />

                <ImageUploader
                  label="Imagen de Portada (Banner Superior Panorámico)"
                  description="Banner amplio superior para la Portal de Reservas (Relación 21:9 o 16:9)"
                  value={formData.heroUrl}
                  onChange={(url) => handleChange('heroUrl', url)}
                  previewAspect="banner"
                />

                <ImageUploader
                  label="Wallpaper de Fondo del Salón (Estilo Barber / Laterales y Salón)"
                  description="Imagen personalizada que se muestra de fondo en el panel de administración, agenda y enmarca los laterales de la pantalla."
                  value={formData.backgroundImageUrl}
                  onChange={(url) => handleChange('backgroundImageUrl', url)}
                  previewAspect="banner"
                />
              </div>
            </div>

            {/* Section 5: Datos de Contacto & Horarios */}
            <div className="space-y-3 pb-6 border-b border-zinc-850">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Contacto & Horarios de Atención</span>
              </h3>

              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-400 font-mono">
                    Dirección Física (Enlaza directo con Google Maps)
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Ej: Avenida Armenia 4032, CABA"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-400 font-mono">
                      Email de Contacto / Notificaciones
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange('contactEmail', e.target.value)}
                      placeholder="contacto@local.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-400 font-mono">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+54 3482 123456"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-400 font-mono">
                      Horarios de Atención (Barra Superior)
                    </label>
                    <input
                      type="text"
                      value={formData.openingHours}
                      onChange={(e) => handleChange('openingHours', e.target.value)}
                      placeholder="Jue-Dom 19:00-02:00"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-400 font-mono">
                      WhatsApp para Pedidos Web
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappPhone}
                      onChange={(e) => handleChange('whatsappPhone', e.target.value)}
                      placeholder="Ej: 5493482123456"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-400 font-mono">
                      Enlace de Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagramUrl}
                      onChange={(e) => handleChange('instagramUrl', e.target.value)}
                      placeholder="https://instagram.com/tubarberia"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={updateBrandingMutation.isPending}
                className="btn-touch px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 font-mono"
              >
                {updateBrandingMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Guardar Identidad de Marca</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Sticky Preview */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Vista Previa en Tiempo Real</span>
            </div>

            <div 
              className="border border-zinc-800 rounded-xl overflow-hidden shadow-2xl sticky top-24 transition-colors relative"
              style={{ 
                backgroundColor: formData.backgroundColor,
                fontFamily: formData.fontFamily,
                backgroundImage: formData.backgroundImageUrl ? `url(${formData.backgroundImageUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
              }}
            >
              {/* Optional Steam-style vignette overlay in preview */}
              {formData.backgroundImageUrl && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at center, ${formData.backgroundColor}cc 0%, ${formData.backgroundColor}f2 70%, ${formData.backgroundColor} 100%)`,
                  }}
                />
              )}

              <div className="relative z-10">
                {/* Top Utility Marquee Preview */}
                <div 
                  className="px-3 py-1 border-b border-white/5 flex items-center gap-3 overflow-hidden text-[9px] font-mono text-zinc-400"
                  style={{ backgroundColor: `${formData.backgroundColor}fa` }}
                >
                  {formData.phone && (
                    <span className="flex items-center gap-1 shrink-0 text-zinc-300">
                      <Phone className="w-2.5 h-2.5" style={{ color: formData.primaryColor }} />
                      <span>{formData.phone}</span>
                    </span>
                  )}
                  {formData.address && (
                    <span className="flex items-center gap-1 shrink-0 text-zinc-300">
                      <MapPin className="w-2.5 h-2.5" style={{ color: formData.primaryColor }} />
                      <span>{formData.address}</span>
                    </span>
                  )}
                  {formData.openingHours && (
                    <span className="flex items-center gap-1 shrink-0 text-zinc-300">
                      <Clock className="w-2.5 h-2.5" style={{ color: formData.primaryColor }} />
                      <span>{formData.openingHours}</span>
                    </span>
                  )}
                </div>

                {/* Header Preview */}
                <div 
                  className="border-b border-white/5 px-4 py-2.5 flex items-center justify-between"
                  style={{ backgroundColor: `${formData.backgroundColor}e6` }}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    {formData.logoUrl ? (
                      <img
                        src={getImageUrl(formData.logoUrl)}
                        alt="Logo"
                        className="h-6 w-auto max-w-[80px] object-contain shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-lg p-0.5 border border-white/10 bg-black/40 flex items-center justify-center shrink-0">
                        <img
                          src="/icon-R.png"
                          alt="Logo"
                          className="w-full h-full object-contain filter drop-shadow-xs"
                        />
                      </div>
                    )}
                    <span 
                      className="text-xs font-black tracking-tight text-white truncate max-w-[160px]"
                      style={{ fontFamily: formData.fontFamily }}
                    >
                      {formData.storeName || 'Nombre de tu Barbería'}
                    </span>
                  </div>

                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    <Phone className="w-3 h-3" />
                  </div>
                </div>

                {/* Banner Preview (Clean Wide Stretch with Bottom Fade) */}
                <div 
                  className="relative aspect-[2.1/1] max-h-36 overflow-hidden"
                  style={{ backgroundColor: formData.backgroundColor }}
                >
                  {formData.heroUrl ? (
                    <>
                      <img
                        src={getImageUrl(formData.heroUrl)}
                        alt="Cover"
                        className="w-full h-full object-cover object-center"
                      />
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(to top, ${formData.backgroundColor} 0%, ${formData.backgroundColor}99 30%, transparent 100%)`,
                        }}
                      />
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `radial-gradient(circle at center, ${formData.primaryColor}30, ${formData.backgroundColor} 80%)`,
                      }}
                    >
                      <span className="text-[10px] font-mono text-zinc-500">Banner Alargado</span>
                    </div>
                  )}
                </div>

                {/* Sample Stacked Items in Preview */}
                <div className="p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[11px] font-bold text-white uppercase tracking-wider pb-0.5 border-b-2"
                      style={{ 
                        borderColor: formData.primaryColor,
                        fontFamily: formData.fontFamily,
                      }}
                    >
                      Nuestros Servicios
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">2 items</span>
                  </div>

                  <div className="divide-y divide-white/5 space-y-1">
                    <div className="p-2 rounded-xl flex items-center justify-between text-xs hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 shrink-0" />
                        <span 
                          className="text-white font-bold truncate"
                          style={{ fontFamily: formData.fontFamily }}
                        >
                          Corte Degradé / Fade
                        </span>
                      </div>
                      <span 
                        className="font-mono font-bold"
                        style={{ color: formData.primaryColor }}
                      >
                        $ 8.000
                      </span>
                    </div>

                    <div className="p-2 rounded-xl flex items-center justify-between text-xs hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 shrink-0" />
                        <span 
                          className="text-white font-bold truncate"
                          style={{ fontFamily: formData.fontFamily }}
                        >
                          Perfilado de Barba & Toalla
                        </span>
                      </div>
                      <span 
                        className="font-mono font-bold"
                        style={{ color: formData.primaryColor }}
                      >
                        $ 6.000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live QR Code Card for Table / Mirror Stickers */}
            {(() => {
              const publicUrl = tenantData?.slug
                ? `https://${tenantData.slug}.agenda.roosty.site`
                : window.location.origin;

              return (
                <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-3 shadow-xl select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-100">Código QR de Reservas Online</h4>
                      <span className="text-[10px] text-zinc-400 font-mono truncate block">
                        {publicUrl}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-850">
                    <div className="bg-white p-1.5 rounded-xl shrink-0 shadow-md">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&format=svg&data=${encodeURIComponent(publicUrl)}`}
                        alt="Código QR de Reservas"
                        className="w-20 h-20"
                      />
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Tus clientes escanean este código con la cámara de su celular para reservar turnos directamente sin instalar apps.
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(publicUrl);
                            showToast('¡Link de Reservas copiado al portapapeles!');
                          }}
                          className="btn-touch px-3 py-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                          <span>Copiar Link</span>
                        </button>

                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-touch px-3 py-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Abrir Portal</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </form>
    </div>
  );
}

