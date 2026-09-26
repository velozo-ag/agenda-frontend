import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 segundos de datos frescos
      gcTime: 1000 * 60 * 5, // 5 minutos en memoria
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});
