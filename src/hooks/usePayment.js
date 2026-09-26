import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cashService } from '../services/cashService';
import { paymentService } from '../services/paymentService';

export const useCashMovements = (isOpen = true) => {
  return useQuery({
    queryKey: ['shifts', 'movements'],
    queryFn: () => cashService.getCurrentMovements(),
    enabled: Boolean(isOpen),
    staleTime: 1000 * 15,
  });
};

export const useCreateCashMovement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => cashService.createMovement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

export const usePayments = (appointmentId) => {
  return useQuery({
    queryKey: ['payments', 'appointment', appointmentId],
    queryFn: () => paymentService.getPayments(appointmentId),
    enabled: Boolean(appointmentId),
  });
};

export const useRegisterPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => paymentService.registerPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};
