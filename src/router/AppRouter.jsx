import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EarningsPage } from '../pages/EarningsPage';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';
import ServicesAdminPage from '../pages/ServicesAdminPage';
import { SuperAdminPage } from '../pages/SuperAdminPage';
import { WaitlistAdminPage } from '../pages/WaitlistAdminPage';
import { AutoLoginPage } from '../pages/AutoLoginPage';
import { DemoExpiredPage } from '../pages/DemoExpiredPage';
import { Navbar } from '../components/layout/Navbar';
import { DemoBanner } from '../components/layout/DemoBanner';
import { useMyTenant, applyTenantTheme } from '../hooks/useTenantBranding';
import { getTenantSlug } from '../api/axiosClient';
import { getImageUrl } from '../utils/imageUrl';
import { Loader2 } from 'lucide-react';
import { AgendaPage } from '../pages/AgendaPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { ClientsPage } from '../pages/ClientsPage';
import { ClientDetailPage } from '../pages/ClientDetailPage';
import { BookingPage } from '../pages/BookingPage';
import { LandingPage } from '../pages/LandingPage';
import { BookingConfirmationPage } from '../pages/BookingConfirmationPage';
import { BookingStatusPage } from '../pages/BookingStatusPage';
import { SetupChecklistWidget } from '../components/onboarding/SetupChecklistWidget';
import { OnboardingTour } from '../components/onboarding/OnboardingTour';

function ProtectedLayoutContent() {
  const tenantSlug = getTenantSlug();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN' || user?.username === 'superadmin';
  const { data: tenant } = useMyTenant({ enabled: !isSuperAdmin });

  useEffect(() => {
    if (tenant && !isSuperAdmin) {
      applyTenantTheme(tenant);
    }
  }, [tenant, isSuperAdmin]);

  const isAdmin = user?.role === 'ADMIN' || isSuperAdmin;
  const defaultHome = isSuperAdmin ? '/superadmin' : '/agenda';

  const bgImg = getImageUrl(tenant?.backgroundImageUrl);

  return (
    <div 
      className="h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans overflow-hidden relative transition-colors duration-150"
      style={{
        backgroundImage: bgImg ? `url(${bgImg})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Modern subtle overlay */}
      {bgImg && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-white/75 dark:bg-zinc-950/75" />
      )}

      <div className="flex flex-col h-full w-full relative z-10">
        <DemoBanner />
        <Navbar />

        <main className="flex-1 overflow-y-auto pb-14 md:pb-0">
          <Routes>
            <Route path="/" element={<Navigate to={defaultHome} replace />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            
            <Route path="/earnings" element={<EarningsPage />} />
            <Route path="/dashboard" element={isAdmin ? <DashboardPage /> : <Navigate to={defaultHome} replace />} />
            
            <Route path="/admin" element={isAdmin ? <AdminSettingsPage /> : <Navigate to={defaultHome} replace />} />
            <Route path="/admin/settings" element={isAdmin ? <AdminSettingsPage /> : <Navigate to={defaultHome} replace />} />
            <Route path="/admin/services" element={isAdmin ? <ServicesAdminPage /> : <Navigate to={defaultHome} replace />} />
            <Route path="/admin/waitlist" element={isAdmin ? <WaitlistAdminPage /> : <Navigate to={defaultHome} replace />} />
            <Route path="/admin/barbers" element={isAdmin ? <Navigate to="/admin/settings?tab=users" replace /> : <Navigate to={defaultHome} replace />} />
            <Route path="/admin/schedules" element={isAdmin ? <Navigate to="/admin/settings?tab=schedules" replace /> : <Navigate to={defaultHome} replace />} />
            
            <Route path="/superadmin" element={isSuperAdmin ? <SuperAdminPage /> : <Navigate to={defaultHome} replace />} />
            <Route path="*" element={<Navigate to={defaultHome} replace />} />
          </Routes>
        </main>

        {/* Onboarding Assistant & Guided Tour */}
        <SetupChecklistWidget />
        <OnboardingTour />
      </div>
    </div>
  );
}

function ProtectedLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN' || user?.username === 'superadmin';
  const { data: tenant, isLoading: isTenantLoading } = useMyTenant({ enabled: isAuthenticated && !isSuperAdmin });

  if (isLoading || (isAuthenticated && !isSuperAdmin && isTenantLoading)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="text-sm font-medium">Verificando sesión...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (tenant?.demoStatus === 'EXPIRED') {
    return <Navigate to="/demo-expired" replace />;
  }

  return <ProtectedLayoutContent />;
}

export function AppRouter() {
  const tenantSlug = getTenantSlug();
  const { isAuthenticated, user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN' || user?.username === 'superadmin';

  return (
    <Routes>
      {/* Root Route: Always the public customer booking page (accessible whether logged in or not) */}
      <Route path="/" element={tenantSlug ? <BookingPage /> : <LandingPage />} />

      {/* Public Booking Portal (No auth needed) */}
      <Route path="/book" element={tenantSlug ? <BookingPage /> : <LandingPage />} />
      <Route path="/book/:slug" element={<BookingPage />} />
      <Route path="/agenda/:slug" element={<BookingPage />} />
      <Route path="/book/confirmation" element={<BookingConfirmationPage />} />
      <Route path="/book/status" element={<BookingStatusPage />} />

      {/* Auto-Login and Demo Expired Public Routes (Phase 11) */}
      <Route path="/auto-login" element={<AutoLoginPage />} />
      <Route path="/demo-expired" element={<DemoExpiredPage />} />

      {/* Staff Auth Route */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={isSuperAdmin ? "/superadmin" : "/agenda"} replace /> : <LoginPage />}
      />

      {/* Protected Salon System for Staff */}
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}
