import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '../services/clientService';
import toast from 'react-hot-toast';

export function useClients(params) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientService.getClients(params),
    staleTime: 30_000,
  });
}

export function useClient(id) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClientById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useClientHistory(id, params) {
  return useQuery({
    queryKey: ['client-history', id, params],
    queryFn: () => clientService.getClientHistory(id, params),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente creado correctamente');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al crear cliente');
    }
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => clientService.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
      toast.success('Cliente actualizado correctamente');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar cliente');
    }
  });
}

export function useSetRequireDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, requireDepositOverride }) => clientService.setRequireDeposit(id, requireDepositOverride),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
      toast.success('Estado de seña actualizado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar seña');
    }
  });
}

export function useResetNoShowCount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => clientService.resetNoShowCount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      toast.success('Historial de no-shows reiniciado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al reiniciar no-shows');
    }
  });
}
