import { axiosClient } from '../api/axiosClient';

export const paymentService = {
  getPayments: async (appointmentId) => {
    return await axiosClient.get(`/payments/appointment/${appointmentId}`);
  },

  getByShift: async (shiftId) => {
    return await axiosClient.get(`/payments/shift/${shiftId}`);
  },
  
  registerPayment: async (data) => {
    return await axiosClient.post('/payments', data);
  },
  
  voidPayment: async (id) => {
    return await axiosClient.delete(`/payments/${id}`);
  }
};
