import axiosClient from '../api/axiosClient';

export const earningsService = {
  getEarningsReport: async (from, to) => {
    return axiosClient.get('/earnings', {
      params: { from, to },
    });
  },

  getCommissionReport: async (from, to) => {
    return axiosClient.get('/earnings/commissions', {
      params: { from, to },
    });
  },
};
