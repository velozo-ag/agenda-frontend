import { axiosClient } from '../api/axiosClient';

export const dashboardService = {
  getMetrics: async (fromDate, toDate) => {
    const params = { fromDate, toDate };
    const res = await axiosClient.get('/dashboard', { params });
    return res?.data ?? res ?? null;
  }
};
