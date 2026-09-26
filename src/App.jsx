import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './api/queryClient';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './router/AppRouter';
import { NetworkStatusBanner } from './components/layout/NetworkStatusBanner';
import { DynamicBrandingManager } from './components/common/DynamicBrandingManager';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DynamicBrandingManager />
          <NetworkStatusBanner />
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: '!bg-zinc-900 !text-zinc-100 !border !border-zinc-800 !shadow-xl',
              style: {
                borderRadius: '12px',
                padding: '16px',
                color: '#f4f4f5',
              },
              success: {
                iconTheme: { primary: '#f59e0b', secondary: '#18181b' },
              }
            }} 
          />
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
