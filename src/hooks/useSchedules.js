import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '../services/scheduleService';
import toast from 'react-hot-toast';

export const useSchedules = (barberId) => {
  const queryClient = useQueryClient();

  const scheduleQuery = useQuery({
    queryKey: ['schedules', barberId],
    queryFn: () => scheduleService.getSchedule(barberId),
    enabled: !!barberId
  });

  const setSchedule = useMutation({
    mutationFn: (data) => scheduleService.setSchedule(barberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules', barberId]);
      toast.success('Horario guardado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al guardar horario');
    }
  });

  return {
    schedule: scheduleQuery.data,
    isLoading: scheduleQuery.isLoading,
    setSchedule
  };
};

export const useTimeOffs = (barberId, fromDate, toDate) => {
  const queryClient = useQueryClient();

  const timeOffsQuery = useQuery({
    queryKey: ['timeoffs', barberId, fromDate, toDate],
    queryFn: () => scheduleService.getTimeOffs(barberId, fromDate, toDate),
    enabled: !!barberId && !!fromDate && !!toDate
  });

  const createTimeOff = useMutation({
    mutationFn: (data) => scheduleService.createTimeOff(barberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeoffs', barberId]);
      toast.success('Ausencia registrada');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al registrar ausencia');
    }
  });

  const deleteTimeOff = useMutation({
    mutationFn: (id) => scheduleService.deleteTimeOff(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeoffs', barberId]);
      toast.success('Ausencia eliminada');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    }
  });

  return {
    timeOffs: timeOffsQuery.data,
    isLoading: timeOffsQuery.isLoading,
    createTimeOff,
    deleteTimeOff
  };
};
