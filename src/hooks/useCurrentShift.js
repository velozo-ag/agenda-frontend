import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cashService } from '../services/cashService';

export const useCurrentShift = () => {
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('pos_token'));

  return useQuery({
    queryKey: ['shifts', 'current'],
    queryFn: async () => {
      const shift = await cashService.getCurrentShift();
      return shift ?? null;
    },
    enabled: hasToken,
    staleTime: 1000 * 15,
    refetchInterval: hasToken ? 30000 : false,
    refetchOnWindowFocus: false,
  });
};

export const useOpenShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cashService.openShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

export const useCloseShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cashService.closeShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

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
