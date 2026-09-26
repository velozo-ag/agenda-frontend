import { axiosClient } from '../api/axiosClient';

export const authService = {
  login: async (username, password) => {
    return await axiosClient.post('/auth/login', { username, password });
  },

  getCurrentUser: async () => {
    return await axiosClient.get('/auth/me');
  },
};
