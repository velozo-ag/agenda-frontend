import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export function useDashboardMetrics(fromDate, toDate) {
  return useQuery({
    queryKey: ['dashboard', fromDate, toDate],
    queryFn: () => dashboardService.getMetrics(fromDate, toDate),
    enabled: !!fromDate && !!toDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
