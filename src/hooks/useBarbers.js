import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barberService } from '../services/barberService';
import toast from 'react-hot-toast';

export const useBarbers = () => {
  const queryClient = useQueryClient();

  const barbersQuery = useQuery({
    queryKey: ['barbers'],
    queryFn: barberService.getBarbers
  });

  const createBarber = useMutation({
    mutationFn: barberService.createBarber,
    onSuccess: () => {
      queryClient.invalidateQueries(['barbers']);
      toast.success('Barbero creado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al crear barbero');
    }
  });

  const updateBarber = useMutation({
    mutationFn: ({ id, data }) => barberService.updateBarber(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['barbers']);
      toast.success('Barbero actualizado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar');
    }
  });

  const toggleBarber = useMutation({
    mutationFn: barberService.toggleBarber,
    onSuccess: () => {
      queryClient.invalidateQueries(['barbers']);
      toast.success('Estado cambiado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al cambiar estado');
    }
  });

  const setBarberServices = useMutation({
    mutationFn: ({ id, serviceIds }) => barberService.setBarberServices(id, serviceIds),
    onSuccess: () => {
      queryClient.invalidateQueries(['barbers']);
      toast.success('Servicios asignados');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al asignar servicios');
    }
  });

  const rawBarbers = barbersQuery.data || [];
  const barbers = rawBarbers.filter(b => {
    const role = (b.role || '').toUpperCase();
    const username = (b.username || '').toLowerCase();
    const fullName = (b.fullName || '').toLowerCase();
    return role !== 'SUPER_ADMIN' && role !== 'SUPERADMIN' 
      && !username.includes('superadmin') 
      && !fullName.includes('superadministrador') 
      && !fullName.includes('super admin');
  });

  return {
    barbers,
    isLoading: barbersQuery.isLoading,
    createBarber,
    updateBarber,
    toggleBarber,
    setBarberServices
  };
};
