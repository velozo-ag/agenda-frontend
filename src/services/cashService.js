import { axiosClient } from '../api/axiosClient';

export const cashService = {
  getCurrentShift: async () => {
    return await axiosClient.get('/shifts/current');
  },

  getShiftById: async (id) => {
    return await axiosClient.get(`/shifts/${id}`);
  },

  openShift: async (data) => {
    const payload = {
      initialFund: data.initialFund ?? data.openingAmount ?? 0,
      notes: data.notes ?? '',
    };
    return await axiosClient.post('/shifts/open', payload);
  },

  closeShift: async (data) => {
    const payload = {
      closingFund: data.closingFund ?? data.countedCash ?? 0,
      notes: data.notes ?? data.cashierNotes ?? '',
    };
    return await axiosClient.post('/shifts/close', payload);
  },

  getShiftHistory: async (page = 0, size = 20) => {
    return await axiosClient.get('/shifts/history', {
      params: { page, size },
    });
  },

  getCurrentMovements: async () => {
    return await axiosClient.get('/shifts/movements');
  },

  getShiftMovements: async (shiftId) => {
    return await axiosClient.get(`/shifts/${shiftId}/movements`);
  },

  createMovement: async (data) => {
    return await axiosClient.post('/shifts/movements', data);
  },
};
