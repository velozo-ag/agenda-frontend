import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useOnboardingStatus, useCompleteOnboarding } from '../hooks/useTenantBranding';

const OnboardingContext = createContext({
  isTourOpen: false,
  tourStep: 0,
  startTour: () => {},
  nextTourStep: () => {},
  prevTourStep: () => {},
  closeTour: () => {},
  completeTour: () => {},
  onboardingStatus: null,
  isStatusLoading: false,
  isWidgetMinimized: false,
  setIsWidgetMinimized: () => {},
});

import { useAuth } from './AuthContext';

export function OnboardingProvider({ children }) {
  const { user } = useAuth();
  const { data: onboardingStatus, isLoading: isStatusLoading, refetch } = useOnboardingStatus();
  const completeMutation = useCompleteOnboarding();

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isWidgetMinimized, setIsWidgetMinimized] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const startTour = () => {
    setTourStep(0);
    setIsTourOpen(true);
  };

  // Reset auto-open lock when user changes (e.g. login/logout)
  useEffect(() => {
    if (user) {
      setHasAutoOpened(false);
      refetch(); // Ensure we have the latest status on fresh login
    } else {
      setIsTourOpen(false);
    }
  }, [user, refetch]);

  useEffect(() => {
    // Only auto-open if we have user, status is loaded, and hasn't opened yet
    if (user && !isStatusLoading && onboardingStatus && !hasAutoOpened) {
      if (!onboardingStatus.fullyConfigured || !onboardingStatus.hasServices) {
        setIsTourOpen(true);
      }
      setHasAutoOpened(true);
    }
  }, [user, isStatusLoading, onboardingStatus, hasAutoOpened]);

  const nextTourStep = () => {
    setTourStep((prev) => Math.min(prev + 1, 4));
  };

  const prevTourStep = () => {
    setTourStep((prev) => Math.max(prev - 1, 0));
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  const completeTour = async () => {
    try {
      await completeMutation.mutateAsync();
    } catch {
      // Ignore network errors on complete
    } finally {
      setIsTourOpen(false);
    }
  };

  const value = useMemo(
    () => ({
      isTourOpen,
      tourStep,
      startTour,
      nextTourStep,
      prevTourStep,
      closeTour,
      completeTour,
      onboardingStatus,
      isStatusLoading,
      isWidgetMinimized,
      setIsWidgetMinimized,
    }),
    [isTourOpen, tourStep, onboardingStatus, isStatusLoading, isWidgetMinimized]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding debe usarse dentro de un OnboardingProvider');
  }
  return context;
}
