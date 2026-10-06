import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Plus, 
  Search, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Loader2, 
  Users, 
  Power, 
  X, 
  Sparkles,
  CheckCircle2,
  Sliders,
  SlidersHorizontal,
  Building2,
  FlaskConical,
  BarChart3,
  Clock,
  Shield,
  Mail,
  Send,
  LogOut,
  Scissors,
  CreditCard,
  Calendar,
  Globe,
  DollarSign
} from 'lucide-react';
import { 
  useSuperAdminTenants, 
  useProvisionTenant, 
  useToggleTenantActive,
  useUpdateTenantPlan,
  useSuperAdminDemos,
  useSuperAdminExtendDemo,
  useSuperAdminConvertDemo,
  useSuperAdminResendDemoEmail,
  useSuperAdminGlobalStats,
  useSuperAdminOpenShifts,
  useSuperAdminAuditLog,
  useUpdateTenantDetails,
  useResetAdminPassword,
  useDeleteTenant
} from '../hooks/useSuperAdmin';
import { useAuth } from '../context/AuthContext';

export const PLAN_PRESETS = {
  CERO: {
    id: 'CERO',
    name: 'Plan Cero',
    price: '$0',
    billing: 'Gratis',
    desc: 'Hasta 40 turnos. Subdominio dedicado (ej: carlos.agenda.roosty.site). Ideal para que prueben la interfaz y se enganchen.',
    color: 'border-zinc-700 bg-zinc-800/40 text-zinc-300',
    badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    hasSubdomain: true,
    hasDeposit: false,
    hasMultiBarber: false,
    hasCommissions: false,
    hasWaitlist: false,
    hasReminders: false,
    maxBarbers: 1,
    maxAppointmentsMonth: 40,
  },
  NAVAJA: {
    id: 'NAVAJA',
    name: 'Plan Navaja',
    price: '$14.900/mes',
    billing: 'Mensual',
    desc: 'Turnos ilimitados + Subdominio propio (carlos.agenda.roosty.site) + Módulo de captura de seña. (Un solo barbero).',
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    hasSubdomain: true,
    hasDeposit: true,
    hasMultiBarber: false,
    hasCommissions: false,
    hasWaitlist: false,
    hasReminders: false,
    maxBarbers: 1,
    maxAppointmentsMonth: 0, // 0 = ilimitado
  },
  CREW: {
    id: 'CREW',
    name: 'Plan Crew',
    price: '$24.900/mes',
    billing: 'Mensual',
    desc: 'Subdominio propio + Múltiples barberos en el mismo local. El cliente entra al link y primero elige con qué barbero se quiere cortar, y el dueño tiene panel para ver cuánta plata hizo cada empleado.',
    color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    hasSubdomain: true,
    hasDeposit: true,
    hasMultiBarber: true,
    hasCommissions: true,
    hasWaitlist: true,
    hasReminders: true,
    maxBarbers: 10,
    maxAppointmentsMonth: 0, // 0 = ilimitado
  },
};

export const resolvePlan = (planType) => {
  if (!planType) return PLAN_PRESETS.CERO;
  const upper = planType.toUpperCase().trim();
  if (upper === 'CERO' || upper === 'FREE') return PLAN_PRESETS.CERO;
  if (upper === 'NAVAJA' || upper === 'STARTER' || upper === 'STARTER_TAKEAWAY' || upper === 'PRO_SOLO') return PLAN_PRESETS.NAVAJA;
  if (upper === 'CREW' || upper === 'PRO_SALON' || upper === 'BUSINESS_ENTERPRISE' || upper === 'ENTERPRISE' || upper === 'PRO') return PLAN_PRESETS.CREW;
  return PLAN_PRESETS[upper] || PLAN_PRESETS.CERO;
};

export function getTenantPublicUrl(tenant) {
  // Todos los planes tienen slug subdominio dedicado (ej: carlos.agenda.roosty.site)
  return {
    label: `${tenant.slug}.agenda.roosty.site`,
    href: `https://${tenant.slug}.agenda.roosty.site`,
    localHref: `/book?tenant=${tenant.slug}`,
    isSubdomain: true,
  };
}

function AuditLogTable({ filters }) {
  const { data, isLoading } = useSuperAdminAuditLog(filters);
  const items = data?.content || [];
  if (isLoading) return <div className="text-zinc-500 py-4 font-mono text-xs">Cargando auditoría...</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 text-left border-b border-zinc-800">
            <th className="pb-2 pr-4 font-mono text-xs">Acción</th>
            <th className="pb-2 pr-4 font-mono text-xs">Tenant</th>
            <th className="pb-2 pr-4 font-mono text-xs">Detalle</th>
            <th className="pb-2 font-mono text-xs">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.map((log) => (
            <tr key={log.id} className="border-b border-zinc-850 text-zinc-300">
              <td className="py-2 pr-4">
                <span className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs font-mono">{log.action}</span>
              </td>
              <td className="py-2 pr-4 font-mono text-xs">{log.entityName || log.entityId}</td>
              <td className="py-2 pr-4 text-zinc-400 text-xs truncate max-w-xs">{log.details || '-'}</td>
              <td className="py-2 text-zinc-500 text-xs font-mono num-tabular">{new Date(log.createdAt).toLocaleString('es-AR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p className="text-zinc-500 text-center py-8 text-xs font-mono">No hay registros de auditoría.</p>}
    </div>
  );
}

function UpdateTenantDetailsModal({ tenant, isOpen, onClose, onSave, isPending }) {
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    storeName: tenant?.storeName || '',
    slug: tenant?.slug || '',
    contactEmail: tenant?.contactEmail || '',
    contactWhatsapp: tenant?.contactWhatsapp || '',
    primaryColor: tenant?.primaryColor || '#f59e0b',
    heroTitle: tenant?.heroTitle || '',
    heroSubtitle: tenant?.heroSubtitle || '',
    address: tenant?.address || '',
    phone: tenant?.phone || '',
    instagramUrl: tenant?.instagramUrl || '',
  });

  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        storeName: tenant.storeName || '',
        slug: tenant.slug || '',
        contactEmail: tenant.contactEmail || '',
        contactWhatsapp: tenant.contactWhatsapp || '',
        primaryColor: tenant.primaryColor || '#f59e0b',
        heroTitle: tenant.heroTitle || '',
        heroSubtitle: tenant.heroSubtitle || '',
        address: tenant.address || '',
        phone: tenant.phone || '',
        instagramUrl: tenant.instagramUrl || '',
      });
    }
  }, [tenant]);

  if (!isOpen || !tenant) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (typeof v === 'string') {
        cleanData[k] = v.trim() === '' ? null : v.trim();
      } else {
        cleanData[k] = v;
      }
    });
    if (!cleanData.name) cleanData.name = tenant.name;
    if (!cleanData.slug) cleanData.slug = tenant.slug;
    onSave(cleanData);
  };

  const publicUrlInfo = getTenantPublicUrl({ ...tenant, slug: formData.slug || tenant.slug });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60 shrink-0">
          <div>
            <h2 className="text-base font-bold text-zinc-100">Editar Datos del Local</h2>
            <p className="text-xs text-zinc-400">{tenant.storeName || tenant.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1 p-2 bg-zinc-950 border-b border-zinc-800 text-xs">
          {[
            { id: 'basic', label: 'Datos Básicos' },
            { id: 'contact', label: 'Contacto' },
            { id: 'branding', label: 'Branding & Agenda' },
            { id: 'public', label: 'Info Pública' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {activeSection === 'basic' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Nombre de Razón Social / Fiscal</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  placeholder="Ej: Barbería Don Carlos SRL"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Nombre Visible / Fantasía</label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  placeholder="Ej: Barbería Don Carlos"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Identificador / Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
                  placeholder="carlos"
                />
                <p className="text-[11px] text-zinc-400 font-mono">
                  Enlace público según plan: <span className="text-amber-400">{publicUrlInfo.label}</span>
                </p>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Email de Contacto</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  placeholder="contacto@barberia.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">WhatsApp de Notificaciones / Contacto</label>
                <input
                  type="text"
                  value={formData.contactWhatsapp}
                  onChange={(e) => handleChange('contactWhatsapp', e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
                  placeholder="+5491144445555"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Teléfono General</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
                  placeholder="4444-5555"
                />
              </div>
            </div>
          )}

          {activeSection === 'branding' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Color Primario (Hex)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor || '#f59e0b'}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-8 h-8 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="flex-1 bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
                    placeholder="#f59e0b"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Título Principal (Portal de Reservas)</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  placeholder="Ej: Reservá tu turno en Don Carlos"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Subtítulo (Portal de Reservas)</label>
                <textarea
                  value={formData.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  placeholder="Ej: Elegí tu servicio y a tu profesional favorito"
                />
              </div>
            </div>
          )}

          {activeSection === 'public' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Dirección Física</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  placeholder="Ej: Av. Santa Fe 1234, Palermo"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  placeholder="https://instagram.com/doncarlosbarberia"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="btn-touch px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-touch px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SuperAdminPage() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('locales');

  const { data: rawTenants, isLoading, error } = useSuperAdminTenants();
  const tenants = Array.isArray(rawTenants) ? rawTenants : [];
  const provisionMutation = useProvisionTenant();
  const toggleActiveMutation = useToggleTenantActive();
  const updatePlanMutation = useUpdateTenantPlan();

  const { data: demos = [] } = useSuperAdminDemos();
  const { data: globalStats } = useSuperAdminGlobalStats();
  const { data: openShifts = [] } = useSuperAdminOpenShifts();
  const extendDemoMutation = useSuperAdminExtendDemo();
  const convertDemoMutation = useSuperAdminConvertDemo();
  const updateDetailsMutation = useUpdateTenantDetails();
  const resetPasswordMutation = useResetAdminPassword();
  const deleteMutation = useDeleteTenant();
  const resendEmailMutation = useSuperAdminResendDemoEmail();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [selectedTenantForPlan, setSelectedTenantForPlan] = useState(null);

  // Modals state
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editDetailsTenant, setEditDetailsTenant] = useState(null);
  const [resetPwOpen, setResetPwOpen] = useState(false);
  const [resetPwTenant, setResetPwTenant] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTenantData, setDeleteTenantData] = useState(null);
  const [extendDemoOpen, setExtendDemoOpen] = useState(false);
  const [extendDemoTenant, setExtendDemoTenant] = useState(null);
  const [convertDemoOpen, setConvertDemoOpen] = useState(false);
  const [convertDemoTenant, setConvertDemoTenant] = useState(null);
  const [resendEmailOpen, setResendEmailOpen] = useState(false);
  const [resendEmailTenant, setResendEmailTenant] = useState(null);
  const [resendTargetEmail, setResendTargetEmail] = useState('');
  const [resendStatusMsg, setResendStatusMsg] = useState(null);

  const [newPassword, setNewPassword] = useState('');
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState('');
  const [extraDays, setExtraDays] = useState(7);
  const [auditFilters, setAuditFilters] = useState({});

  // Provisioning form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('CREW');

  // Custom flags for provision
  const [customHasSubdomain, setCustomHasSubdomain] = useState(true);
  const [customHasDeposit, setCustomHasDeposit] = useState(true);
  const [customHasMultiBarber, setCustomHasMultiBarber] = useState(true);
  const [customHasCommissions, setCustomHasCommissions] = useState(true);
  const [customHasWaitlist, setCustomHasWaitlist] = useState(true);
  const [customHasReminders, setCustomHasReminders] = useState(true);
  const [customMaxBarbers, setCustomMaxBarbers] = useState(10);
  const [customMaxAppointments, setCustomMaxAppointments] = useState(0);
  const [showAdvancedFlags, setShowAdvancedFlags] = useState(false);

  const [formError, setFormError] = useState('');
  const [provisionSuccessMsg, setProvisionSuccessMsg] = useState('');

  // Edit Plan form state
  const [editPlanType, setEditPlanType] = useState('CREW');
  const [editHasSubdomain, setEditHasSubdomain] = useState(true);
  const [editHasDeposit, setEditHasDeposit] = useState(true);
  const [editHasMultiBarber, setEditHasMultiBarber] = useState(true);
  const [editHasCommissions, setEditHasCommissions] = useState(true);
  const [editHasWaitlist, setEditHasWaitlist] = useState(true);
  const [editHasReminders, setEditHasReminders] = useState(true);
  const [editHasOnlineBooking, setEditHasOnlineBooking] = useState(true);
  const [editMaxBarbers, setEditMaxBarbers] = useState(10);
  const [editMaxAppointments, setEditMaxAppointments] = useState(0);
  const [editPlanSuccess, setEditPlanSuccess] = useState('');
  const [editPlanError, setEditPlanError] = useState('');

  const handleNameChange = (val) => {
    setName(val);
    if (!slug) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    const preset = PLAN_PRESETS[planId] || PLAN_PRESETS.CREW;
    setCustomHasSubdomain(preset.hasSubdomain);
    setCustomHasDeposit(preset.hasDeposit);
    setCustomHasMultiBarber(preset.hasMultiBarber);
    setCustomHasCommissions(preset.hasCommissions);
    setCustomHasWaitlist(preset.hasWaitlist);
    setCustomHasReminders(preset.hasReminders);
    setCustomMaxBarbers(preset.maxBarbers);
    setCustomMaxAppointments(preset.maxAppointmentsMonth);
  };

  const handleOpenPlanModal = (tenant) => {
    setSelectedTenantForPlan(tenant);
    const resolved = resolvePlan(tenant.planType);
    setEditPlanType(resolved.id);
    setEditHasSubdomain(tenant.hasSubdomain ?? resolved.hasSubdomain);
    setEditHasDeposit(tenant.hasDeposit ?? resolved.hasDeposit);
    setEditHasMultiBarber(tenant.hasMultiBarber ?? resolved.hasMultiBarber);
    setEditHasCommissions(tenant.hasCommissions ?? resolved.hasCommissions);
    setEditHasWaitlist(tenant.hasWaitlist ?? resolved.hasWaitlist);
    setEditHasReminders(tenant.hasReminders ?? resolved.hasReminders);
    setEditHasOnlineBooking(tenant.hasOnlineBooking ?? true);
    setEditMaxBarbers(tenant.maxBarbers ?? resolved.maxBarbers);
    setEditMaxAppointments(tenant.maxAppointmentsMonth ?? resolved.maxAppointmentsMonth);
    setEditPlanSuccess('');
    setEditPlanError('');
  };

  const handleEditPlanSelect = (planId) => {
    setEditPlanType(planId);
    const preset = PLAN_PRESETS[planId] || PLAN_PRESETS.CREW;
    setEditHasSubdomain(preset.hasSubdomain);
    setEditHasDeposit(preset.hasDeposit);
    setEditHasMultiBarber(preset.hasMultiBarber);
    setEditHasCommissions(preset.hasCommissions);
    setEditHasWaitlist(preset.hasWaitlist);
    setEditHasReminders(preset.hasReminders);
    setEditMaxBarbers(preset.maxBarbers);
    setEditMaxAppointments(preset.maxAppointmentsMonth);
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!selectedTenantForPlan) return;
    setEditPlanError('');
    setEditPlanSuccess('');

    updatePlanMutation.mutate(
      {
        tenantId: selectedTenantForPlan.id,
        planData: {
          planType: editPlanType,
          hasSubdomain: editHasSubdomain,
          hasDeposit: editHasDeposit,
          hasMultiBarber: editHasMultiBarber,
          hasCommissions: editHasCommissions,
          hasWaitlist: editHasWaitlist,
          hasReminders: editHasReminders,
          hasOnlineBooking: editHasOnlineBooking,
          maxBarbers: Number(editMaxBarbers),
          maxAppointmentsMonth: Number(editMaxAppointments),
        },
      },
      {
        onSuccess: () => {
          setEditPlanSuccess('Plan y límites operativos actualizados con éxito.');
          setTimeout(() => {
            setSelectedTenantForPlan(null);
            setEditPlanSuccess('');
          }, 1500);
        },
        onError: (err) => {
          setEditPlanError(err.response?.data?.message || 'Error al actualizar el plan.');
        },
      }
    );
  };

  const handleProvisionSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !slug.trim() || !adminUsername.trim() || !adminPassword.trim() || !adminFullName.trim()) {
      setFormError('Por favor completá todos los campos obligatorios.');
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      adminUsername: adminUsername.trim(),
      adminPassword: adminPassword.trim(),
      adminFullName: adminFullName.trim(),
      planType: selectedPlan,
      hasSubdomain: customHasSubdomain,
      hasDeposit: customHasDeposit,
      hasOnlineBooking: true,
      hasMultiBarber: customHasMultiBarber,
      hasCommissions: customHasCommissions,
      hasWaitlist: customHasWaitlist,
      hasReminders: customHasReminders,
      maxBarbers: Number(customMaxBarbers),
      maxAppointmentsMonth: Number(customMaxAppointments),
    };

    provisionMutation.mutate(payload, {
      onSuccess: (res) => {
        setProvisionSuccessMsg(`Local "${res.name}" provisionado exitosamente con ${PLAN_PRESETS[selectedPlan]?.name || selectedPlan}.`);
        setTimeout(() => {
          setIsProvisionModalOpen(false);
          setProvisionSuccessMsg('');
          setName('');
          setSlug('');
          setAdminUsername('');
          setAdminPassword('');
          setAdminFullName('');
          setSelectedPlan('CREW');
        }, 1800);
      },
      onError: (err) => {
        setFormError(err.response?.data?.message || 'Error al provisionar el local.');
      },
    });
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col space-y-6 animate-in fade-in duration-200 select-none">
      {/* ── Top Header ──────────────────────────────────────── */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">
                Panel Maestro SaaS
              </h1>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono font-medium">
                SuperAdmin
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Gestión centralizada de planes (Cero, Navaja, Crew), subdominios, señas y locales
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              handleSelectPlan('CREW');
              setIsProvisionModalOpen(true);
            }}
            className="btn-touch px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Dar de Alta Nuevo Salón</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="btn-touch px-3.5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-rose-400 border border-zinc-700/80 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            title="Cerrar Sesión Super-Admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* ── Barra de Tabs ──────────────────────────────────── */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-2">
        {[
          { id: 'locales', label: 'Locales & Barberías', icon: Building2 },
          { id: 'demos', label: 'Pipeline Demos', icon: FlaskConical },
          { id: 'stats', label: 'Dashboard SaaS', icon: BarChart3 },
          { id: 'auditoria', label: 'Auditoría', icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Locales ─────────────────────────────────────── */}
      {activeTab === 'locales' && (
        <div className="space-y-6">
          {/* ── Metric Cards ────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-medium text-zinc-500 font-mono">Total de Locales</span>
              <div className="text-2xl font-black font-mono text-zinc-100 num-tabular">{tenants.length}</div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-medium text-emerald-500/80 font-mono">Locales Activos</span>
              <div className="text-2xl font-black font-mono text-emerald-400 num-tabular">
                {tenants.filter((t) => t.active).length}
              </div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-medium text-zinc-500 font-mono">Servicios en Red</span>
              <div className="text-2xl font-black font-mono text-zinc-100 num-tabular">
                {tenants.reduce((acc, t) => acc + (t.totalServices || 0), 0)}
              </div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-medium text-zinc-500 font-mono">Citas Totales Registradas</span>
              <div className="text-2xl font-black font-mono text-amber-400 num-tabular">
                {tenants.reduce((acc, t) => acc + (t.totalAppointments || 0), 0)}
              </div>
            </div>
          </div>

          {/* ── Search & Filter ─────────────────────────────── */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar salón por nombre o subdominio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-mono"
              />
            </div>
          </div>

          {/* ── Tenants Grid ────────────────────────────────── */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400 text-xs font-mono">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <span>Cargando red de salones y barberías...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 p-6 bg-zinc-900/40 rounded-xl border border-zinc-800 space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <h3 className="text-sm font-semibold text-zinc-200">Error al cargar locales</h3>
              <p className="text-xs text-zinc-500 font-mono">Verificá tus permisos de SUPER_ADMIN.</p>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl p-6 font-mono">
              No se encontraron salones con ese criterio de búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTenants.map((tenant) => {
                const plan = resolvePlan(tenant.planType);
                const publicUrlInfo = getTenantPublicUrl(tenant);

                const appointmentsMonthlyLimit = tenant.maxAppointmentsMonth != null && tenant.maxAppointmentsMonth > 0 
                  ? `${tenant.maxAppointmentsMonth} turnos/mes`
                  : 'Turnos Ilimitados';

                return (
                  <div
                    key={tenant.id}
                    className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                      tenant.active
                        ? 'bg-zinc-900/80 border-zinc-800 shadow-md'
                        : 'bg-zinc-950/60 border-rose-950/50 opacity-60'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${tenant.active ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                          <h3 className="text-sm font-bold text-zinc-100 truncate">
                            {tenant.storeName || tenant.name}
                          </h3>
                        </div>

                        {/* Public Link */}
                        <div className="flex items-center gap-1.5">
                          <a
                            href={publicUrlInfo.localHref}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1 truncate"
                            title={`Abrir portal de reservas: ${publicUrlInfo.label}`}
                          >
                            <span>{publicUrlInfo.label}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${
                            tenant.active
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          }`}
                        >
                          {tenant.active ? 'Activo' : 'Suspendido'}
                        </span>

                        <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-semibold ${plan.badge}`}>
                          {plan.name} • {plan.price}
                        </span>

                        <span className="px-1.5 py-0.2 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono text-purple-300">
                          🌐 {tenant.slug}.agenda.roosty.site
                        </span>

                        {tenant.hasDeposit && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-300">
                            Captura de Seña 💰
                          </span>
                        )}

                        {tenant.hasCommissions && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono text-indigo-300">
                            Panel Comisiones 📊
                          </span>
                        )}

                        {tenant.daysSinceLastActivity > 14 && (
                          <span className="bg-yellow-950/80 border border-yellow-800 text-yellow-300 text-[10px] px-2 py-0.5 rounded font-mono">
                            ⚠️ Sin actividad
                          </span>
                        )}

                        {tenant.hasOpenShift && (
                          <span className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono">
                            🟢 Caja Abierta
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Operational Limits Pills */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                        ⚡ {appointmentsMonthlyLimit}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                        ✂️ {tenant.hasMultiBarber ? `Multi-barbero (${tenant.maxBarbers || 10})` : '1 solo barbero'}
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-zinc-950 border border-zinc-850 text-center font-mono">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Servicios</span>
                        <span className="text-xs font-bold text-zinc-200 num-tabular">{tenant.totalServices || 0}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Barberos</span>
                        <span className="text-xs font-bold text-zinc-200 num-tabular">
                          {tenant.hasMultiBarber ? `${tenant.totalUsers || 1}/${tenant.maxBarbers || '∞'}` : '1'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Clientes</span>
                        <span className="text-xs font-bold text-zinc-200 num-tabular">
                          {tenant.totalClients || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Citas</span>
                        <span className="text-xs font-bold text-emerald-400 num-tabular">{tenant.totalAppointments || 0}</span>
                      </div>
                    </div>

                    {/* Revenue this month */}
                    {tenant.revenueThisMonth != null && (
                      <div className="flex justify-between items-center text-xs font-mono px-1">
                        <span className="text-zinc-400">Facturación este mes:</span>
                        <span className="text-amber-400 font-bold num-tabular">$ {Number(tenant.revenueThisMonth || 0).toLocaleString('es-AR')}</span>
                      </div>
                    )}
                    
                    {/* Last Activity */}
                    <div className="flex justify-between items-center text-xs font-mono px-1 mt-1 border-t border-zinc-850 pt-2">
                      <span className="text-zinc-400">Última cita:</span>
                      <span className={`font-bold num-tabular ${tenant.daysSinceLastActivity !== null && tenant.daysSinceLastActivity <= 7 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tenant.lastAppointmentAt 
                          ? new Date(tenant.lastAppointmentAt).toLocaleDateString('es-AR') 
                          : 'Sin actividad'}
                      </span>
                    </div>

                    {/* Direct Contact */}
                    {(tenant.contactWhatsapp || tenant.contactEmail) && (
                      <div className="flex items-center gap-2 pt-1">
                        {tenant.contactWhatsapp && (
                          <button
                            type="button"
                            onClick={() => window.open(`https://wa.me/${tenant.contactWhatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                            className="btn-touch px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-xs text-zinc-200 flex items-center gap-1 cursor-pointer"
                            title="Contactar por WhatsApp"
                          >
                            <span>📱 WhatsApp</span>
                          </button>
                        )}
                        {tenant.contactEmail && (
                          <button
                            type="button"
                            onClick={() => window.open(`mailto:${tenant.contactEmail}`, '_blank')}
                            className="btn-touch px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-xs text-zinc-200 flex items-center gap-1 cursor-pointer"
                            title="Enviar Email"
                          >
                            <span>📧 Email</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/80">
                      <button
                        type="button"
                        onClick={() => handleOpenPlanModal(tenant)}
                        className="btn-touch px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Configurar Plan y Flags Operativas"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Plan & Flags</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditDetailsTenant(tenant);
                          setEditDetailsOpen(true);
                        }}
                        className="btn-touch px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Editar datos del local"
                      >
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setResetPwTenant(tenant);
                          setNewPassword('');
                          setResetPwOpen(true);
                        }}
                        className="btn-touch px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Resetear contraseña"
                      >
                        <span>Reset PW</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleActiveMutation.mutate(tenant.id)}
                        disabled={toggleActiveMutation.isPending}
                        className={`btn-touch p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          tenant.active
                            ? 'bg-zinc-900 hover:bg-rose-950/80 border-zinc-800 hover:border-rose-800 text-zinc-400 hover:text-rose-300'
                            : 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-800 text-emerald-400'
                        }`}
                        title={tenant.active ? 'Suspender local (bloquea acceso inmediato)' : 'Reactivar local'}
                      >
                        <Power className="w-4 h-4" />
                      </button>

                      {tenant.isDemo && (
                        <button
                          type="button"
                          onClick={() => {
                            setResendEmailTenant(tenant);
                            setResendTargetEmail(tenant.contactEmail || '');
                            setResendStatusMsg(null);
                            setResendEmailOpen(true);
                          }}
                          className="btn-touch p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                          title="Reenviar email de bienvenida demo"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      )}

                      {tenant.isDemo && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTenantData(tenant);
                            setDeleteConfirmSlug('');
                            setDeleteOpen(true);
                          }}
                          className="btn-touch px-2.5 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Eliminar demo permanentemente"
                        >
                          <span>Eliminar</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab Demos ───────────────────────────────────────── */}
      {activeTab === 'demos' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-100">Pipeline de Demos de Barberías</h2>
          {demos.length === 0 && <p className="text-zinc-500 font-mono text-xs">No hay locales en período de prueba actualmente.</p>}
          <div className="grid gap-4">
            {demos.map((demo) => {
              const statusColor =
                demo.demoStatus === 'ACTIVE'
                  ? demo.daysRemainingTrial <= 2
                    ? 'bg-amber-950/30 border-amber-700/60'
                    : 'bg-emerald-950/30 border-emerald-700/60'
                  : 'bg-rose-950/30 border-rose-700/60';
              const statusLabel =
                demo.demoStatus === 'ACTIVE'
                  ? demo.daysRemainingTrial <= 2
                    ? '🟡 Por vencer'
                    : '🟢 Activo'
                  : '🔴 Expirado';
              return (
                <div key={demo.id} className={`border rounded-xl p-4.5 ${statusColor}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-zinc-200 font-mono">{statusLabel}</span>
                        <span className="text-zinc-400 text-xs font-mono">{demo.slug}.agenda.roosty.site</span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-100">{demo.storeName}</h3>
                      <p className="text-xs text-zinc-400">{demo.ownerName}</p>
                      {demo.contactWhatsapp && <p className="text-xs text-zinc-400 font-mono mt-0.5">📱 {demo.contactWhatsapp}</p>}
                      {demo.contactEmail && <p className="text-xs text-zinc-400 font-mono">📧 {demo.contactEmail}</p>}
                    </div>
                    <div className="text-right text-xs font-mono">
                      {demo.demoStatus === 'ACTIVE' && (
                        <p className="text-zinc-200 font-bold num-tabular">{demo.daysRemainingTrial}d restantes de prueba</p>
                      )}
                      <p className="text-zinc-400 num-tabular">Purga automática en {demo.daysUntilPurge}d</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3.5">
                    <button
                      type="button"
                      onClick={() => {
                        setExtendDemoTenant(demo);
                        setExtraDays(7);
                        setExtendDemoOpen(true);
                      }}
                      className="btn-touch flex-1 min-w-[100px] py-2 text-xs font-semibold rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-700/80"
                    >
                      Extender
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConvertDemoTenant(demo);
                        setConvertDemoOpen(true);
                      }}
                      className="btn-touch flex-1 min-w-[130px] py-2 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer shadow-md"
                    >
                      ✅ Convertir a Plan Formal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setResendEmailTenant(demo);
                        setResendTargetEmail(demo.contactEmail || '');
                        setResendStatusMsg(null);
                        setResendEmailOpen(true);
                      }}
                      className="btn-touch flex-1 min-w-[130px] py-2 text-xs rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Reenviar Email</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab Stats ───────────────────────────────────────── */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-100">Métricas Globales SaaS</h2>
          {globalStats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Salones', value: globalStats.totalTenants },
                { label: 'Salones Reales', value: globalStats.realTenants },
                { label: 'Demos Activos', value: globalStats.demoTenantsActive },
                { label: 'Demos Expirados', value: globalStats.demoTenantsExpired },
                { label: 'Facturación Global', value: `$ ${(globalStats.totalRevenue || 0).toLocaleString('es-AR')}` },
                { label: 'Ticket Promedio', value: `$ ${(globalStats.avgOrderValue || 0).toLocaleString('es-AR')}` },
                { label: 'Citas Realizadas', value: globalStats.totalAppointmentsCompleted },
                { label: 'Servicios en Catálogos', value: globalStats.totalServices },
                { label: 'Usuarios / Staff', value: globalStats.totalUsers },
              ].map((stat) => (
                <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
                  <p className="text-zinc-500 text-xs font-mono">{stat.label}</p>
                  <p className="text-2xl font-black font-mono text-zinc-100 num-tabular">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
          {/* Top 5 por revenue */}
          {tenants.length > 0 && (
            <div>
              <h3 className="text-zinc-300 font-semibold mb-3 text-sm">Top 5 Salones por Facturación este Mes</h3>
              <div className="space-y-2">
                {[...tenants]
                  .filter((t) => t.revenueThisMonth != null)
                  .sort((a, b) => (b.revenueThisMonth || 0) - (a.revenueThisMonth || 0))
                  .slice(0, 5)
                  .map((t) => (
                    <div key={t.id} className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs font-mono">
                      <span className="text-zinc-200 font-medium">{t.storeName || t.name}</span>
                      <span className="text-amber-400 font-bold num-tabular">$ {(t.revenueThisMonth || 0).toLocaleString('es-AR')}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {/* Sin actividad */}
          {tenants.filter((t) => t.daysSinceLastActivity > 14).length > 0 && (
            <div>
              <h3 className="text-zinc-300 font-semibold mb-3 text-sm">⚠️ Sin Actividad en Agenda hace más de 14 días</h3>
              <div className="space-y-2">
                {tenants
                  .filter((t) => t.daysSinceLastActivity > 14)
                  .map((t) => (
                    <div key={t.id} className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs font-mono">
                      <span className="text-zinc-200 font-medium">{t.storeName || t.name}</span>
                      <span className="text-amber-400 font-semibold num-tabular">{t.daysSinceLastActivity}d sin actividad</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab Turnos / Cajas ──────────────────────────────── */}
      {activeTab === 'turnos' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-100">Turnos de Caja Abiertos en Vivo</h2>
          {openShifts.length === 0 && <p className="text-zinc-500 font-mono text-xs">No hay cajas abiertas en este momento.</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-left border-b border-zinc-800 font-mono text-xs">
                  <th className="pb-2 pr-4">Salón / Barbería</th>
                  <th className="pb-2 pr-4">Responsable</th>
                  <th className="pb-2 pr-4">Abierto Hace</th>
                  <th className="pb-2 pr-4">Fondo Inicial</th>
                  <th className="pb-2 pr-4">Efectivo en Caja</th>
                  <th className="pb-2">Citas Cobradas</th>
                </tr>
              </thead>
              <tbody>
                {openShifts.map((shift) => (
                  <tr key={shift.shiftId} className="border-b border-zinc-850 text-zinc-300 font-mono text-xs">
                    <td className="py-3 pr-4 font-bold text-zinc-100">{shift.tenantName}</td>
                    <td className="py-3 pr-4 text-zinc-300 font-sans">{shift.openedByFullName}</td>
                    <td className="py-3 pr-4 text-zinc-400 num-tabular">{shift.elapsedMinutes}min</td>
                    <td className="py-3 pr-4 text-zinc-200 num-tabular">$ {(shift.initialFund || 0).toLocaleString('es-AR')}</td>
                    <td className="py-3 pr-4 text-emerald-400 font-semibold num-tabular">$ {(shift.currentCashSales || 0).toLocaleString('es-AR')}</td>
                    <td className="py-3 text-amber-400 font-bold num-tabular">{shift.currentAppointmentsCompleted || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab Auditoría ───────────────────────────────────── */}
      {activeTab === 'auditoria' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-100">Log de Auditoría de la Plataforma</h2>
          <div className="flex gap-3">
            <select
              value={auditFilters.action || ''}
              onChange={(e) => setAuditFilters((f) => ({ ...f, action: e.target.value || undefined }))}
              className="bg-zinc-900 text-zinc-300 rounded-lg px-3 py-2 text-xs border border-zinc-700 font-mono focus:outline-none focus:border-amber-400"
            >
              <option value="">Todas las acciones</option>
              {[
                'PROVISION',
                'TOGGLE_ACTIVE',
                'UPDATE_PLAN',
                'UPDATE_DETAILS',
                'RESET_PASSWORD',
                'DELETE_TENANT',
                'CONVERT_DEMO',
                'EXTEND_DEMO',
              ].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <AuditLogTable filters={auditFilters} />
        </div>
      )}

      {/* ── Provision Modal ─────────────────────────────────── */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-100">Dar de Alta Nuevo Salón / Barbería</h2>
                  <p className="text-xs text-zinc-400">Crear tenant, asignar plan comercial y credenciales de administrador</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProvisionModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProvisionSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-mono">
                  {formError}
                </div>
              )}

              {provisionSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{provisionSuccessMsg}</span>
                </div>
              )}

              {/* 1. Plan Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>1. Seleccionar Plan Comercial</span>
                  <span className="text-zinc-500 normal-case font-sans text-[11px]">Planes oficiales Roosty Agenda</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.values(PLAN_PRESETS).map((p) => {
                    const isSelected = selectedPlan === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPlan(p.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                          isSelected
                            ? `${p.color} ring-2 ring-amber-400 shadow-lg`
                            : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-100">{p.name}</span>
                            <span className="text-xs font-mono font-bold text-amber-400">{p.price}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-tight mt-2">{p.desc}</p>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/80 space-y-0.5">
                          <div>⚡ {p.maxAppointmentsMonth > 0 ? `Hasta ${p.maxAppointmentsMonth} turnos` : 'Turnos ilimitados'}</div>
                          <div>🌐 Subdominio propio (.agenda.roosty.site)</div>
                          <div>✂️ {p.hasMultiBarber ? 'Múltiples barberos' : '1 barbero'}</div>
                          <div>💰 {p.hasDeposit ? 'Captura de seña ✅' : 'Sin seña ❌'}</div>
                          <div>📊 {p.hasCommissions ? 'Panel empleados ✅' : 'Sin comisiones ❌'}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Flags Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFlags(!showAdvancedFlags)}
                  className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{showAdvancedFlags ? 'Ocultar personalización manual de límites' : 'Personalizar límites y feature flags manualmente'}</span>
                </button>

                {showAdvancedFlags && (
                  <div className="mt-2 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customHasSubdomain}
                          onChange={(e) => setCustomHasSubdomain(e.target.checked)}
                          className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                        />
                        <span>Subdominio propio ({slug || 'slug'}.agenda.roosty.site)</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customHasDeposit}
                          onChange={(e) => setCustomHasDeposit(e.target.checked)}
                          className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                        />
                        <span>Módulo de captura de seña</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customHasMultiBarber}
                          onChange={(e) => setCustomHasMultiBarber(e.target.checked)}
                          className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                        />
                        <span>Múltiples barberos (cliente elige profesional)</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customHasCommissions}
                          onChange={(e) => setCustomHasCommissions(e.target.checked)}
                          className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                        />
                        <span>Panel de dinero/comisiones por empleado</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customHasWaitlist}
                          onChange={(e) => setCustomHasWaitlist(e.target.checked)}
                          className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                        />
                        <span>Módulo Lista de Espera</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customHasReminders}
                          onChange={(e) => setCustomHasReminders(e.target.checked)}
                          className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                        />
                        <span>Recordatorios automáticos</span>
                      </label>

                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-500 font-mono">Máx Turnos por Mes (0 = ilimitado)</label>
                        <input
                          type="number"
                          value={customMaxAppointments}
                          onChange={(e) => setCustomMaxAppointments(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-mono num-tabular"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-500 font-mono">Máx Barberos Permitidos</label>
                        <input
                          type="number"
                          value={customMaxBarbers}
                          onChange={(e) => setCustomMaxBarbers(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-mono num-tabular"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Tenant Details */}
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Nombre de la Barbería / Salón *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ej: Barbería Don Carlos"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-400/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Identificador / Slug *</label>
                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-400">
                    <span>https://</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="carlos"
                      className="bg-transparent text-amber-400 font-bold focus:outline-none px-1 flex-1 font-mono"
                      required
                    />
                    <span>.agenda.roosty.site</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono mt-1">
                    Subdominio dedicado de la barbería: {' '}
                    <span className="text-amber-400 font-bold">
                      https://{slug || 'carlos'}.agenda.roosty.site
                    </span>
                  </p>
                </div>

                {/* Admin credentials */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-3">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                    Cuenta Administrador del Salón
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400">Nombre Completo *</label>
                      <input
                        type="text"
                        value={adminFullName}
                        onChange={(e) => setAdminFullName(e.target.value)}
                        placeholder="Ej: Carlos Gómez"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400">Usuario de Acceso *</label>
                      <input
                        type="text"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value.toLowerCase())}
                        placeholder="admin_carlos"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-700"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] text-zinc-400">Contraseña *</label>
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-700"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="btn-touch px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={provisionMutation.isPending}
                  className="btn-touch px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {provisionMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Provisionando...</span>
                    </>
                  ) : (
                    <span>Crear y Provisionar Salón</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Plan Modal ─────────────────────────────────── */}
      {selectedTenantForPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-100">Configurar Plan & Límites Operativos</h2>
                  <p className="text-xs text-zinc-400">{selectedTenantForPlan.name} ({selectedTenantForPlan.slug})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTenantForPlan(null)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {editPlanError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-mono">
                  {editPlanError}
                </div>
              )}

              {editPlanSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editPlanSuccess}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                  Plan Contratado
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {Object.values(PLAN_PRESETS).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleEditPlanSelect(p.id)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        editPlanType === p.id
                          ? `${p.color} ring-1 ring-amber-400 shadow-md`
                          : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-100">{p.name}</span>
                        <span className="text-[11px] font-mono text-amber-400 font-bold">{p.price}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-tight">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  Feature Flags & Configuración del Plan
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasSubdomain}
                      onChange={(e) => setEditHasSubdomain(e.target.checked)}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>Subdominio propio habilitado</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasDeposit}
                      onChange={(e) => setEditHasDeposit(e.target.checked)}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>Módulo de captura de seña</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasMultiBarber}
                      onChange={(e) => setEditHasMultiBarber(e.target.checked)}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>Múltiples barberos (cliente elige)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasCommissions}
                      onChange={(e) => setEditHasCommissions(e.target.checked)}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>Panel de comisiones por empleado</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasWaitlist}
                      onChange={(e) => setEditHasWaitlist(e.target.checked)}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>Lista de espera</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editHasReminders}
                      onChange={(e) => setEditHasReminders(e.target.checked)}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>Recordatorios automáticos</span>
                  </label>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-mono">Máx Turnos al Mes (0 = ilimitado)</label>
                    <input
                      type="number"
                      value={editMaxAppointments}
                      onChange={(e) => setEditMaxAppointments(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-mono num-tabular"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-mono">Límite Máx de Barberos</label>
                    <input
                      type="number"
                      value={editMaxBarbers}
                      onChange={(e) => setEditMaxBarbers(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-mono num-tabular"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedTenantForPlan(null)}
                  className="btn-touch px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-750 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updatePlanMutation.isPending}
                  className="btn-touch px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {updatePlanMutation.isPending ? 'Guardando...' : 'Guardar Cambios de Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Reset Password ──────────────────────────── */}
      {resetPwOpen && resetPwTenant && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100 mb-1">
              Resetear Password de Administrador
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              {resetPwTenant.storeName || resetPwTenant.name} ({resetPwTenant.slug})
            </p>
            <input
              type="password"
              placeholder="Nueva contraseña (mínimo 6 caracteres)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-800/80 text-zinc-100 rounded-lg px-3.5 py-2.5 mb-4 border border-zinc-700 font-mono text-xs focus:outline-none focus:border-amber-400"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setResetPwOpen(false)}
                className="btn-touch flex-1 py-2.5 rounded-lg bg-zinc-800 text-zinc-300 font-semibold text-xs cursor-pointer hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (newPassword.length < 6) return;
                  await resetPasswordMutation.mutateAsync({ tenantId: resetPwTenant.id, newPassword });
                  setResetPwOpen(false);
                  setNewPassword('');
                }}
                disabled={newPassword.length < 6 || resetPasswordMutation.isPending}
                className="btn-touch flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs disabled:opacity-50 cursor-pointer shadow-md transition-colors"
              >
                {resetPasswordMutation.isPending ? 'Reseteando...' : 'Resetear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Eliminar Tenant ──────────────────────────── */}
      {deleteOpen && deleteTenantData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
            <h3 className="text-base font-bold text-rose-400 mb-2">⚠️ Eliminar Demo Permanentemente</h3>
            <p className="text-zinc-400 text-xs mb-4">
              Escribí el slug <strong className="text-zinc-200 font-mono">{deleteTenantData.slug}</strong> para confirmar la eliminación permanente.
            </p>
            <input
              type="text"
              placeholder={deleteTenantData.slug}
              value={deleteConfirmSlug}
              onChange={(e) => setDeleteConfirmSlug(e.target.value)}
              className="w-full bg-zinc-800/80 text-zinc-100 rounded-lg px-3.5 py-2.5 mb-4 border border-zinc-700 font-mono text-xs focus:outline-none focus:border-rose-400"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="btn-touch flex-1 py-2.5 rounded-lg bg-zinc-800 text-zinc-300 font-semibold text-xs cursor-pointer hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteMutation.mutateAsync({ tenantId: deleteTenantData.id, confirmSlug: deleteConfirmSlug });
                  setDeleteOpen(false);
                }}
                disabled={deleteConfirmSlug !== deleteTenantData.slug || deleteMutation.isPending}
                className="btn-touch flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs disabled:opacity-50 cursor-pointer transition-colors shadow-md"
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Extender Demo ────────────────────────────── */}
      {extendDemoOpen && extendDemoTenant && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100 mb-1">
              Extender Período de Prueba
            </h3>
            <p className="text-xs text-zinc-400 mb-3">
              {extendDemoTenant.storeName || extendDemoTenant.name} ({extendDemoTenant.slug})
            </p>
            <p className="text-zinc-400 text-xs mb-3 font-mono">
              Días actuales restantes: <strong className="text-amber-400 num-tabular">{extendDemoTenant.daysRemainingTrial}</strong>
            </p>
            <div className="flex gap-2 mb-3">
              {[3, 7, 14].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setExtraDays(d)}
                  className={`btn-touch flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    extraDays === d ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750'
                  }`}
                >
                  +{d} días
                </button>
              ))}
            </div>
            <input
              type="number"
              min={1}
              max={30}
              value={extraDays}
              onChange={(e) => setExtraDays(Number(e.target.value))}
              className="w-full bg-zinc-800/80 text-zinc-100 rounded-lg px-3.5 py-2.5 mb-4 border border-zinc-700 font-mono text-xs focus:outline-none focus:border-amber-400 num-tabular"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExtendDemoOpen(false)}
                className="btn-touch flex-1 py-2.5 rounded-lg bg-zinc-800 text-zinc-300 font-semibold text-xs cursor-pointer hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  await extendDemoMutation.mutateAsync({ tenantId: extendDemoTenant.id, extraDays });
                  setExtendDemoOpen(false);
                }}
                disabled={extendDemoMutation.isPending}
                className="btn-touch flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs disabled:opacity-50 cursor-pointer shadow-md transition-colors"
              >
                {extendDemoMutation.isPending ? 'Extendiendo...' : `Agregar ${extraDays} días`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Convertir a Pago ─────────────────────────── */}
      {convertDemoOpen && convertDemoTenant && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100 mb-1">
              ✅ Convertir Demo a Plan Formal
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              {convertDemoTenant.storeName || convertDemoTenant.name} ({convertDemoTenant.slug})
            </p>
            <p className="text-zinc-400 text-xs mb-3 font-mono">Elegir el plan para este salón:</p>
            <div className="space-y-2 mb-4">
              {Object.values(PLAN_PRESETS).map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={async () => {
                    await convertDemoMutation.mutateAsync({ tenantId: convertDemoTenant.id, planType: plan.id });
                    setConvertDemoOpen(false);
                  }}
                  disabled={convertDemoMutation.isPending}
                  className="btn-touch w-full text-left p-3.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 transition-colors border border-zinc-700 disabled:opacity-50 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-xs text-zinc-100">{plan.name}</p>
                    <span className="text-xs font-mono font-bold text-amber-400">{plan.price}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-tight">{plan.desc}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setConvertDemoOpen(false)}
              className="btn-touch w-full py-2.5 rounded-lg bg-zinc-800 text-zinc-300 font-semibold text-xs cursor-pointer hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Modal Reenviar Email de Bienvenida ────────────────── */}
      {resendEmailOpen && resendEmailTenant && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">
                  Reenviar Email de Bienvenida
                </h3>
                <p className="text-xs text-zinc-400">
                  {resendEmailTenant.storeName || resendEmailTenant.name} ({resendEmailTenant.slug})
                </p>
              </div>
            </div>

            <p className="text-zinc-300 text-xs mb-4 leading-relaxed">
              Se enviará la plantilla de bienvenida con enlace de auto-login, credenciales de acceso y enlace público del salón.
            </p>

            <div className="space-y-1.5 mb-4">
              <label className="text-xs font-semibold text-zinc-300">
                Correo destinatario
              </label>
              <input
                type="email"
                placeholder="ejemplo@email.com"
                value={resendTargetEmail}
                onChange={(e) => setResendTargetEmail(e.target.value)}
                className="w-full bg-zinc-800/80 text-zinc-100 rounded-lg px-3.5 py-2.5 border border-zinc-700 text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {resendStatusMsg && (
              <div
                className={`p-3 rounded-lg mb-4 text-xs font-medium flex items-center gap-2 ${
                  resendStatusMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {resendStatusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{resendStatusMsg.text}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setResendEmailOpen(false);
                  setResendStatusMsg(null);
                }}
                className="btn-touch flex-1 py-2.5 rounded-lg bg-zinc-800 text-zinc-300 font-semibold text-xs cursor-pointer hover:bg-zinc-700 transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={async () => {
                  setResendStatusMsg(null);
                  try {
                    await resendEmailMutation.mutateAsync({
                      tenantId: resendEmailTenant.id,
                      customEmail: resendTargetEmail.trim() || undefined,
                    });
                    setResendStatusMsg({
                      type: 'success',
                      text: `¡Email reenviado exitosamente a ${resendTargetEmail.trim() || resendEmailTenant.contactEmail}!`,
                    });
                    setTimeout(() => {
                      setResendEmailOpen(false);
                      setResendStatusMsg(null);
                    }, 2500);
                  } catch (err) {
                    const msg = err.response?.data?.message || err.message || 'Error al reenviar el correo';
                    setResendStatusMsg({ type: 'error', text: msg });
                  }
                }}
                disabled={resendEmailMutation.isPending || (!resendTargetEmail.trim() && !resendEmailTenant.contactEmail)}
                className="btn-touch flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs disabled:opacity-50 cursor-pointer transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {resendEmailMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Ahora</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Editar Datos del Tenant ──────────────────── */}
      {editDetailsOpen && editDetailsTenant && (
        <UpdateTenantDetailsModal
          tenant={editDetailsTenant}
          isOpen={editDetailsOpen}
          onClose={() => setEditDetailsOpen(false)}
          onSave={async (formData) => {
            await updateDetailsMutation.mutateAsync({
              tenantId: editDetailsTenant.id,
              data: formData,
            });
            setEditDetailsOpen(false);
          }}
          isPending={updateDetailsMutation.isPending}
        />
      )}
    </div>
  );
}
export default SuperAdminPage;
