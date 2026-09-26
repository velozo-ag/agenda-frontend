import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { waitlistService } from '../services/waitlistService';

export function useWaitlist(params) {
  return useQuery({
    queryKey: ['waitlist', params],
    queryFn: () => waitlistService.getWaitlist(params),
  });
}

export function useRemoveFromWaitlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: waitlistService.removeFromWaitlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
}
