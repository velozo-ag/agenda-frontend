import apiClient from '../api/axiosClient';

export const bookingService = {
  getSalonInfo: (slug) => apiClient.get(`/booking/info`),
  getCategories: (slug) => apiClient.get(`/booking/categories`),
  getServices: (slug) => apiClient.get(`/booking/services`),
  getBarbers: (slug) => apiClient.get(`/booking/barbers`),
  getAvailableSlots: (slug, params) => apiClient.get(`/booking/availability/slots`, { params }),
  createAppointment: (slug, data) => apiClient.post(`/booking/appointments`, data),
  getAppointmentStatus: (token) => apiClient.get(`/booking/appointments/${token}`),
  cancelAppointment: (token, reason) => apiClient.post(`/booking/appointments/${token}/cancel`, { reason }),
  rescheduleAppointment: (token, newStartTime) => apiClient.post(`/booking/appointments/${token}/reschedule`, { newStartTime }),
  joinWaitlist: (slug, data) => apiClient.post(`/booking/waitlist`, data),
  uploadDeposit: (token, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/booking/appointments/${token}/deposit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

