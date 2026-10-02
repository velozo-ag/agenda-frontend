import { useQuery, useQueries, useMutation } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';

export function useSalonInfo(slug) {
  return useQuery({
    queryKey: ['booking-salon-info', slug],
    queryFn: () => bookingService.getSalonInfo(slug),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}

export function usePublicCategories(slug) {
  return useQuery({
    queryKey: ['booking-categories', slug],
    queryFn: () => bookingService.getCategories(slug),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}

export function usePublicServices(slug) {
  return useQuery({
    queryKey: ['booking-services', slug],
    queryFn: () => bookingService.getServices(slug),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}

export function usePublicBarbers(slug) {
  return useQuery({
    queryKey: ['booking-barbers', slug],
    queryFn: () => bookingService.getBarbers(slug),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}

export function usePublicAvailableSlots(slug, params) {
  return useQuery({
    queryKey: ['booking-available-slots', slug, params],
    queryFn: () => bookingService.getAvailableSlots(slug, params),
    enabled: !!slug && !!params.serviceId && !!params.date,
    staleTime: 30_000,
  });
}

export function useCreatePublicAppointment(slug) {
  return useMutation({
    mutationFn: (data) => bookingService.createAppointment(slug, data),
  });
}

export function useAppointmentStatus(token) {
  return useQuery({
    queryKey: ['appointment-status', token],
    queryFn: () => bookingService.getAppointmentStatus(token),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useCancelAppointment(token) {
  return useMutation({
    mutationFn: (reason) => bookingService.cancelAppointment(token, reason),
  });
}

export function useRescheduleAppointment(token) {
  return useMutation({
    mutationFn: (newStartTime) => bookingService.rescheduleAppointment(token, newStartTime),
  });
}

export function useJoinWaitlist(slug) {
  return useMutation({
    mutationFn: (data) => bookingService.joinWaitlist(slug, data),
  });
}

export function useUploadDeposit(token) {
  return useMutation({
    mutationFn: (file) => bookingService.uploadDeposit(token, file),
  });
}

/**
 * Consulta en paralelo los próximos `daysAhead` días para un servicio/barbero
 * y devuelve:
 *   - daysWithSlots: Set<string> de ISO dates que tienen al menos 1 slot
 *   - isCheckingDays: true mientras alguna query sigue cargando
 */
export function useAvailableDaysForService(slug, { serviceId, barberId, daysAhead = 14 } = {}) {
  const enabled = !!slug && !!serviceId;

  // Generar los próximos N días como ISO strings
  const dates = [];
  if (enabled) {
    const now = new Date();
    for (let i = 0; i < daysAhead; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
  }

  const results = useQueries({
    queries: dates.map((date) => ({
      queryKey: ['booking-available-slots', slug, { serviceId, barberId: barberId === 'any' ? null : barberId, date }],
      queryFn: () => bookingService.getAvailableSlots(slug, {
        serviceId,
        barberId: barberId === 'any' ? null : barberId,
        date,
      }),
      enabled,
      staleTime: 60_000,
      retry: 0,
    })),
  });

  const daysWithSlots = new Set();
  let isCheckingDays = false;

  results.forEach((result, idx) => {
    if (result.isLoading) isCheckingDays = true;
    const slots = result.data?.data;
    if (Array.isArray(slots) && slots.length > 0) {
      daysWithSlots.add(dates[idx]);
    }
  });

  return { daysWithSlots, isCheckingDays };
}
