import api from '../api/axiosClient';

export const scheduleService = {
  getSchedule: async (barberId) => {
    const res = await api.get(`/schedules/barber/${barberId}`);
    return res?.data ?? res ?? [];
  },

  setSchedule: async (barberId, data) => {
    const res = await api.put(`/schedules/barber/${barberId}`, data);
    return res?.data ?? res ?? [];
  },

  getTimeOffs: async (barberId, from, to) => {
    const res = await api.get(`/schedules/barber/${barberId}/timeoffs`, {
      params: { from, to }
    });
    return res?.data ?? res ?? [];
  },

  createTimeOff: async (barberId, data) => {
    const res = await api.post(`/schedules/barber/${barberId}/timeoffs`, data);
    return res?.data ?? res ?? [];
  },

  deleteTimeOff: async (id) => {
    await api.delete(`/schedules/timeoffs/${id}`);
  }
};
