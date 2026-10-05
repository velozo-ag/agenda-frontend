import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

export const useTenantUsage = () => {
  return useQuery({
    queryKey: ['tenantUsage'],
    queryFn: async () => {
      return await axiosClient.get('/tenant/usage');
    },
    staleTime: 5 * 60 * 1000,
  });
};
