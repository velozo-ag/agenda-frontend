import apiClient from '../api/axiosClient';

export const clientService = {
  getClients: (params) => apiClient.get('/clients', { params }),
  getClientById: (id) => apiClient.get(`/clients/${id}`),
  getClientHistory: (id, params) => apiClient.get(`/clients/${id}/history`, { params }),
  createClient: (data) => apiClient.post('/clients', data),
  updateClient: (id, data) => apiClient.put(`/clients/${id}`, data),
  setRequireDeposit: (id, value) => apiClient.patch(`/clients/${id}/require-deposit`, { requireDepositOverride: value }),
  resetNoShowCount: (id) => apiClient.patch(`/clients/${id}/reset-noshows`),
  deactivateClient: (id) => apiClient.delete(`/clients/${id}`),
};
