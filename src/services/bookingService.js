import apiClient from '../api/axiosClient';

export const bookingService = {
  getSalonInfo: (slug) => apiClient.get(`/booking/${slug}/info`),
  getCategories: (slug) => apiClient.get(`/booking/${slug}/categories`),
  getServices: (slug) => apiClient.get(`/booking/${slug}/services`),
  getBarbers: (slug) => apiClient.get(`/booking/${slug}/barbers`),
  getAvailableSlots: (slug, params) => apiClient.get(`/booking/${slug}/availability/slots`, { params }),
  createAppointment: (slug, data) => apiClient.post(`/booking/${slug}/appointments`, data),
  getAppointmentStatus: (token) => apiClient.get(`/booking/appointments/${token}`),
  cancelAppointment: (token, reason) => apiClient.post(`/booking/appointments/${token}/cancel`, { reason }),
  rescheduleAppointment: (token, newStartTime) => apiClient.post(`/booking/appointments/${token}/reschedule`, { newStartTime }),
  joinWaitlist: (slug, data) => apiClient.post(`/booking/${slug}/waitlist`, data),
};

