import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../services/staffService';

export const useStaff = () => {
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('pos_token'));

  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const res = await staffService.getAll();
      return res || [];
    },
    enabled: hasToken,
    staleTime: 1000 * 30,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => staffService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => staffService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useToggleStaffActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => staffService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useChangeStaffPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => staffService.changePassword(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
