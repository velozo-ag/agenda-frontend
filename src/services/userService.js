import axiosClient from '../api/axiosClient';

export const userService = {
  getAll: async () => {
    return await axiosClient.get('/users');
  },

  getById: async (id) => {
    return await axiosClient.get(`/users/${id}`);
  },

  create: async (data) => {
    return await axiosClient.post('/users', data);
  },

  update: async (id, data) => {
    return await axiosClient.put(`/users/${id}`, data);
  },

  toggleActive: async (id) => {
    return await axiosClient.patch(`/users/${id}/toggle-active`);
  },

  changePassword: async (id, data) => {
    return await axiosClient.patch(`/users/${id}/change-password`, data);
  },
};
