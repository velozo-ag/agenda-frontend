import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminService } from '../services/superAdminService';

export const useSuperAdminTenants = () => {
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('pos_token'));

  return useQuery({
    queryKey: ['superadmin', 'tenants'],
    queryFn: () => superAdminService.getAllTenants(),
    enabled: hasToken,
  });
};

export const useProvisionTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => superAdminService.provisionTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'tenants'] });
    },
  });
};

export const useSuperAdminImportMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, catalog }) => superAdminService.importMenu(tenantId, catalog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'tenants'] });
    },
  });
};

export const useToggleTenantActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId) => superAdminService.toggleTenantActive(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'tenants'] });
    },
  });
};

export const useUpdateTenantPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, planData }) => superAdminService.updateTenantPlan(tenantId, planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'tenants'] });
    },
  });
};

// Mutaciones — Tenants
export const useUpdateTenantDetails = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, data }) => superAdminService.updateTenantDetails(tenantId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['superadmin', 'tenants'] }),
  });
};

export const useResetAdminPassword = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, newPassword }) => superAdminService.resetAdminPassword(tenantId, newPassword),
  });
};

export const useDeleteTenant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, confirmSlug }) => superAdminService.deleteTenant(tenantId, confirmSlug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['superadmin', 'tenants'] }),
  });
};

// Demos
export const useSuperAdminDemos = () => {
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('pos_token'));
  return useQuery({
    queryKey: ['superadmin', 'demos'],
    queryFn: () => superAdminService.getAllDemos(),
    enabled: hasToken,
  });
};

export const useSuperAdminExtendDemo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, extraDays }) => superAdminService.extendDemo(tenantId, extraDays),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['superadmin', 'demos'] }),
  });
};

export const useSuperAdminConvertDemo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, planType }) => superAdminService.convertDemo(tenantId, planType),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['superadmin', 'demos'] });
      qc.invalidateQueries({ queryKey: ['superadmin', 'tenants'] });
    },
  });
};

export const useSuperAdminResendDemoEmail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, customEmail }) => superAdminService.resendDemoEmail(tenantId, customEmail),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['superadmin', 'demos'] });
      qc.invalidateQueries({ queryKey: ['superadmin', 'tenants'] });
    },
  });
};

// Stats globales
export const useSuperAdminGlobalStats = () => {
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('pos_token'));
  return useQuery({
    queryKey: ['superadmin', 'stats', 'global'],
    queryFn: () => superAdminService.getGlobalStats(),
    enabled: hasToken,
  });
};

// Turnos abiertos
export const useSuperAdminOpenShifts = () => {
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('pos_token'));
  return useQuery({
    queryKey: ['superadmin', 'shifts', 'open'],
    queryFn: () => superAdminService.getOpenShifts(),
    enabled: hasToken,
    refetchInterval: 60000, // refresca cada 60 segundos
  });
};

// Clonar carta
export const useCloneCatalog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceTenantId, targetTenantId }) =>
      superAdminService.cloneCatalog(sourceTenantId, targetTenantId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['superadmin', 'tenants'] }),
  });
};

// Auditoría
export const useSuperAdminAuditLog = (filters = {}) => {
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('pos_token'));
  return useQuery({
    queryKey: ['superadmin', 'audit', filters],
    queryFn: () => superAdminService.getAuditLog(filters),
    enabled: hasToken,
  });
};

