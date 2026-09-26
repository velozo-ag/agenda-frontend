import api from '../api/axiosClient';

export const salonServiceService = {
  // Categorias
  getCategories: async (includeInactive = false) => {
    const res = await api.get(`/services/categories?includeInactive=${includeInactive}`);
    return res?.data ?? res ?? [];
  },

  createCategory: async (data) => {
    const res = await api.post('/services/categories', data);
    return res?.data ?? res ?? [];
  },

  updateCategory: async (id, data) => {
    const res = await api.put(`/services/categories/${id}`, data);
    return res?.data ?? res ?? [];
  },

  deleteCategory: async (id) => {
    await api.delete(`/services/categories/${id}`);
  },

  // Servicios
  getServices: async (includeInactive = false) => {
    const res = await api.get(`/services?includeInactive=${includeInactive}`);
    return res?.data ?? res ?? [];
  },

  createService: async (data) => {
    const res = await api.post('/services', data);
    return res?.data ?? res ?? [];
  },

  updateService: async (id, data) => {
    const res = await api.put(`/services/${id}`, data);
    return res?.data ?? res ?? [];
  },

  toggleService: async (id) => {
    const res = await api.patch(`/services/${id}/toggle`);
    return res?.data ?? res ?? [];
  }
};
