import axiosClient from '../api/axiosClient';

export const tenantService = {
  getPublicBranding: async (slug) => {
    const params = slug ? { tenant: slug } : {};
    return await axiosClient.get('/tenant/public', { params });
  },

  getMyTenant: async () => {
    return await axiosClient.get('/tenant/me');
  },

  updateBranding: async (data) => {
    return await axiosClient.put('/tenant/branding', data);
  },

  getOnboardingStatus: async () => {
    return await axiosClient.get('/tenant/onboarding-status');
  },

  updateBookingSettings: async (data) => {
    return await axiosClient.put('/tenant/booking-settings', data);
  },

  completeOnboarding: async () => {
    return await axiosClient.put('/tenant/complete-onboarding');
  },
};

export default tenantService;
