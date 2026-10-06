import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Rocket,
  X, 
  ChevronUp, 
  Compass, 
  Store, 
  Scissors, 
  Clock 
} from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';

export function SetupChecklistWidget() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    onboardingStatus, 
    isStatusLoading, 
    isWidgetMinimized, 
    setIsWidgetMinimized,
    startTour 
  } = useOnboarding();

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN';

  // Do not display if not admin, or still loading, or fully configured
  if (!isAdmin || isStatusLoading || !onboardingStatus || onboardingStatus.fullyConfigured) {
    return null;
  }

  const {
    hasBrandingConfigured,
    hasServices,
    hasSchedules,
    hasCompletedTour,
    completedSteps = 0,
    totalSteps = 4,
  } = onboardingStatus;

  const pct = Math.round((completedSteps / totalSteps) * 100);

  const steps = [
    {
      id: 'branding',
      title: 'Identidad del local',
      desc: 'Nombre, logo y contacto',
      icon: Store,
      done: hasBrandingConfigured,
      action: () => navigate('/admin/settings'),
      actionLabel: 'Configurar',
    },
    {
      id: 'services',
      title: 'Crear servicios',
      desc: 'Cortes, barba y precios',
      icon: Scissors,
      done: hasServices,
      action: () => navigate('/admin/services'),
      actionLabel: 'Crear',
    },
    {
      id: 'schedules',
      title: 'Horarios de atención',
      desc: 'Días y turnos del staff',
      icon: Clock,
      done: hasSchedules,
      action: () => navigate('/admin/schedules'),
      actionLabel: 'Habilitar',
    },
    {
      id: 'tour',
      title: 'Recorrido interactivo',
      desc: 'Conocé toda la plataforma',
      icon: Compass,
      done: hasCompletedTour,
      action: startTour,
      actionLabel: 'Ver tour',
    },
  ];

  if (isWidgetMinimized) {
    return (
      <aside aria-label="Asistente de configuración minimizado" className="fixed bottom-16 md:bottom-4 right-4 z-40 animate-in slide-in-from-bottom-3 duration-200">
        <button
          onClick={() => setIsWidgetMinimized(false)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-zinc-100 shadow-xl border border-zinc-700 hover:border-amber-500/50 transition-all cursor-pointer group active:scale-95"
          title="Abrir checklist de configuración"
        >
          <div className="relative flex items-center justify-center">
            <Rocket className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-tight">Configurar Salón</span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {completedSteps} de {totalSteps} listos ({pct}%)
            </span>
          </div>
          <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-transform" />
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Asistente de configuración inicial" className="fixed bottom-16 md:bottom-4 right-4 z-40 w-80 sm:w-88 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200 transition-colors">
      {/* Header */}
      <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0">
            <Rocket className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              Primeros Pasos
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Dejá tu barbería lista para recibir reservas
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsWidgetMinimized(true)}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Minimizar checklist"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">Progreso de setup</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{pct}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="p-2 space-y-1">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`p-2 rounded-xl flex items-center justify-between transition-colors border ${
                step.done
                  ? 'bg-zinc-50/50 dark:bg-zinc-950/30 border-transparent opacity-75'
                  : 'bg-zinc-50 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800/80 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${step.done ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {step.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    {step.desc}
                  </div>
                </div>
              </div>

              {!step.done && (
                <button
                  onClick={step.action}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
                >
                  <span>{step.actionLabel}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
