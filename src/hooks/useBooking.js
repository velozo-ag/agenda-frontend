import { useQuery, useMutation } from '@tanstack/react-query';
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

