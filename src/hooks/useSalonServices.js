import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salonServiceService } from '../services/salonServiceService';
import toast from 'react-hot-toast';

export const useSalonServices = (includeInactive = false) => {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['serviceCategories', includeInactive],
    queryFn: () => salonServiceService.getCategories(includeInactive)
  });

  const servicesQuery = useQuery({
    queryKey: ['services', includeInactive],
    queryFn: () => salonServiceService.getServices(includeInactive)
  });

  const createCategory = useMutation({
    mutationFn: salonServiceService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceCategories']);
      toast.success('Categoría creada');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al crear categoría');
    }
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }) => salonServiceService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceCategories']);
      toast.success('Categoría actualizada');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar');
    }
  });

  const deleteCategory = useMutation({
    mutationFn: salonServiceService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceCategories']);
      toast.success('Categoría eliminada');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    }
  });

  const createService = useMutation({
    mutationFn: salonServiceService.createService,
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceCategories']);
      queryClient.invalidateQueries(['services']);
      toast.success('Servicio creado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al crear servicio');
    }
  });

  const updateService = useMutation({
    mutationFn: ({ id, data }) => salonServiceService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceCategories']);
      queryClient.invalidateQueries(['services']);
      toast.success('Servicio actualizado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar');
    }
  });

  const toggleService = useMutation({
    mutationFn: salonServiceService.toggleService,
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceCategories']);
      queryClient.invalidateQueries(['services']);
      toast.success('Estado cambiado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al cambiar estado');
    }
  });

  return {
    categories: categoriesQuery.data || [],
    services: servicesQuery.data || [],
    isLoading: categoriesQuery.isLoading || servicesQuery.isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    createService,
    updateService,
    toggleService
  };
};
