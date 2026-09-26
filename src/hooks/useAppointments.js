import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';
import toast from 'react-hot-toast';

export function useAppointments(params) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentService.getAppointments(params),
    staleTime: 15_000,
  });
}

export function useAppointment(id) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentService.getAppointmentById(id),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export function useAvailableSlots(params) {
  return useQuery({
    queryKey: ['available-slots', params],
    queryFn: () => appointmentService.getAvailableSlots(params),
    enabled: !!params.serviceId && !!params.date,
    staleTime: 30_000,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Turno creado correctamente');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al crear el turno');
    }
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => appointmentService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Turno actualizado correctamente');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar el turno');
    }
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => appointmentService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Estado actualizado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al cambiar estado');
    }
  });
}

export function useMarkNoShow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => appointmentService.markNoShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Marcado como No-Show');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al marcar No-Show');
    }
  });
}

export function useUndoNoShow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => appointmentService.undoNoShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('No-Show revertido');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al deshacer No-Show');
    }
  });
}

export function useConfirmDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => appointmentService.confirmDeposit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Seña aprobada');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al aprobar seña');
    }
  });
}

export function useRejectDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => appointmentService.rejectDeposit(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Seña rechazada');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al rechazar seña');
    }
  });
}
