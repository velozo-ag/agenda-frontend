import axiosClient from '../api/axiosClient';

export const superAdminService = {
  provisionTenant: async (data) => {
    return await axiosClient.post('/superadmin/tenants', data);
  },

  getAllTenants: async () => {
    const data = await axiosClient.get('/superadmin/tenants');
    return data ?? [];
  },

  importMenu: async (tenantId, catalog) => {
    return await axiosClient.post(`/superadmin/tenants/${tenantId}/import-menu`, catalog);
  },

  toggleTenantActive: async (tenantId) => {
    return await axiosClient.patch(`/superadmin/tenants/${tenantId}/toggle-active`);
  },

  updateTenantPlan: async (tenantId, planData) => {
    return await axiosClient.patch(`/superadmin/tenants/${tenantId}/plan`, planData);
  },

  // 12.1 — Edición y gestión de tenants
  updateTenantDetails: async (tenantId, data) => {
    return await axiosClient.put(`/superadmin/tenants/${tenantId}`, data);
  },

  resetAdminPassword: async (tenantId, newPassword) => {
    return await axiosClient.patch(`/superadmin/tenants/${tenantId}/reset-admin-password`, { newPassword });
  },

  deleteTenant: async (tenantId, confirmSlug) => {
    return await axiosClient.delete(`/superadmin/tenants/${tenantId}`, { params: { confirm: confirmSlug } });
  },

  // 12.2 — Demos
  getAllDemos: async () => {
    return await axiosClient.get('/superadmin/demos');
  },

  extendDemo: async (tenantId, extraDays) => {
    return await axiosClient.patch(`/superadmin/demos/${tenantId}/extend`, { extraDays });
  },

  convertDemo: async (tenantId, planType) => {
    return await axiosClient.post(`/superadmin/demos/${tenantId}/convert`, { planType });
  },

  resendDemoEmail: async (tenantId, customEmail = null) => {
    return await axiosClient.post(
      `/superadmin/demos/${tenantId}/resend-email`,
      customEmail ? { email: customEmail } : {}
    );
  },

  // 12.3 — Stats
  getGlobalStats: async () => {
    return await axiosClient.get('/superadmin/stats/global');
  },

  // 12.4 — Operaciones
  getOpenShifts: async () => {
    return await axiosClient.get('/superadmin/shifts/open');
  },

  cloneCatalog: async (sourceTenantId, targetTenantId) => {
    return await axiosClient.post(`/superadmin/tenants/${sourceTenantId}/clone-catalog-to/${targetTenantId}`);
  },

  // 12.5 — Auditoría
  getAuditLog: async (params = {}) => {
    return await axiosClient.get('/superadmin/audit', { params });
  },
};

// Named exports for flexibility
export const updateTenantDetails = (tenantId, data) => superAdminService.updateTenantDetails(tenantId, data);
export const resetAdminPassword = (tenantId, newPassword) => superAdminService.resetAdminPassword(tenantId, newPassword);
export const deleteTenant = (tenantId, confirmSlug) => superAdminService.deleteTenant(tenantId, confirmSlug);
export const getAllDemos = () => superAdminService.getAllDemos();
export const extendDemo = (tenantId, extraDays) => superAdminService.extendDemo(tenantId, extraDays);
export const convertDemo = (tenantId, planType) => superAdminService.convertDemo(tenantId, planType);
export const resendDemoEmail = (tenantId, customEmail) => superAdminService.resendDemoEmail(tenantId, customEmail);
export const getGlobalStats = () => superAdminService.getGlobalStats();
export const getOpenShifts = () => superAdminService.getOpenShifts();
export const cloneCatalog = (sourceTenantId, targetTenantId) => superAdminService.cloneCatalog(sourceTenantId, targetTenantId);
export const getAuditLog = (params = {}) => superAdminService.getAuditLog(params);

export default superAdminService;
