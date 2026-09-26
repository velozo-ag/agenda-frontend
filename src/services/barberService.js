import api from '../api/axiosClient';

export const barberService = {
  getBarbers: async () => {
    const res = await api.get('/barbers');
    return res?.data ?? res ?? [];
  },

  createBarber: async (data) => {
    const res = await api.post('/barbers', data);
    return res?.data ?? res ?? [];
  },

  updateBarber: async (id, data) => {
    const res = await api.put(`/barbers/${id}`, data);
    return res?.data ?? res ?? [];
  },

  toggleBarber: async (id) => {
    const res = await api.patch(`/barbers/${id}/toggle`);
    return res?.data ?? res ?? [];
  },

  getBarberServices: async (id) => {
    const res = await api.get(`/barbers/${id}/services`);
    return res?.data ?? res ?? [];
  },

  setBarberServices: async (id, serviceIds) => {
    const res = await api.put(`/barbers/${id}/services`, { serviceIds });
    return res?.data ?? res ?? [];
  }
};
