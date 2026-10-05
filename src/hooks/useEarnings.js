import { useQuery } from '@tanstack/react-query';
import { earningsService } from '../services/earningsService';

export const useEarningsReport = (from, to) => {
  return useQuery({
    queryKey: ['earnings', from, to],
    queryFn: () => earningsService.getEarningsReport(from, to),
    enabled: !!from && !!to,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCommissionReport = (from, to) => {
  return useQuery({
    queryKey: ['commissions', from, to],
    queryFn: () => earningsService.getCommissionReport(from, to),
    enabled: !!from && !!to,
    staleTime: 5 * 60 * 1000,
  });
};
