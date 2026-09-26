import apiClient from '../api/axiosClient';

export const appointmentService = {
  getAppointments: (params) => apiClient.get('/appointments', { params }),
  getAppointmentById: (id) => apiClient.get(`/appointments/${id}`),
  createAppointment: (data) => apiClient.post('/appointments', data),
  updateAppointment: (id, data) => apiClient.put(`/appointments/${id}`, data),
  updateStatus: (id, statusData) => apiClient.patch(`/appointments/${id}/status`, statusData),
  confirm: (id, barberId) => apiClient.patch(`/appointments/${id}/confirm`, { barberId }),
  start: (id) => apiClient.patch(`/appointments/${id}/start`),
  complete: (id) => apiClient.patch(`/appointments/${id}/complete`),
  markNoShow: (id) => apiClient.patch(`/appointments/${id}/no-show`),
  undoNoShow: (id) => apiClient.patch(`/appointments/${id}/undo-no-show`),
  cancel: (id, reason) => apiClient.patch(`/appointments/${id}/cancel`, { reason }),
  reschedule: (id, newStartTime) => apiClient.patch(`/appointments/${id}/reschedule`, { newStartTime }),
  confirmDeposit: (id) => apiClient.patch(`/appointments/${id}/confirm-deposit`),
  rejectDeposit: (id, reason) => apiClient.patch(`/appointments/${id}/reject-deposit`, { reason }),
  getAvailableSlots: (params) => apiClient.get('/availability/slots', { params }),
};
