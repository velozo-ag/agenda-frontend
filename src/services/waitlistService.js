import apiClient from '../api/axiosClient';

export const waitlistService = {
  getWaitlist: (params) => apiClient.get('/waitlist', { params }),
  removeFromWaitlist: (id) => apiClient.delete(`/waitlist/${id}`),
};
