import { useState, useEffect, useRef, useCallback } from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { MetricsBar } from '../components/landing/MetricsBar';
import { StepsSection } from '../components/landing/StepsSection';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { CommissionsSection } from '../components/landing/CommissionsSection';
import { PortalSection } from '../components/landing/PortalSection';
import { PricingSection } from '../components/landing/PricingSection';
import { FAQSection } from '../components/landing/FAQSection';
import { FooterCTA } from '../components/landing/FooterCTA';
import { RegistrationWizard } from '../components/landing/RegistrationWizard';

/**
 * Landing de Roosty Agenda (agenda.roosty.com.ar).
 * Misma arquitectura que la landing de Roosty POS, con acento Indigo:
 * Nav flotante > Hero + mockup > Metricas > Pasos > Features > Equipo/Comisiones (oscuro)
 * > Portal publico > Precios > FAQ > Footer CTA. El wizard abre en pantalla completa
 * con transicion de "cortina" (lamina crema que sube y baja).
 */
export function LandingPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  // 'idle' | 'covering' | 'loading' | 'lifting'
  const [curtain, setCurtain] = useState('idle');
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'smooth';
    document.title = 'Roosty Agenda | Software de turnos para Barberías y Salones';
    return () => {
      html.style.scrollBehavior = prev;
      clearTimers();
    };
  }, []);

  const openWizard = useCallback(() => {
    if (wizardOpen || curtain !== 'idle') return;
    clearTimers();
    setCurtain('covering');
    timers.current.push(setTimeout(() => setWizardOpen(true), 300));
    timers.current.push(setTimeout(() => setCurtain('loading'), 320));
    timers.current.push(setTimeout(() => setCurtain('lifting'), 720));
    timers.current.push(setTimeout(() => setCurtain('idle'), 1050));
  }, [wizardOpen, curtain]);

  const closeWizard = useCallback(() => {
    if (!wizardOpen || curtain !== 'idle') return;
    clearTimers();
    setCurtain('covering');
    timers.current.push(setTimeout(() => setWizardOpen(false), 300));
    timers.current.push(setTimeout(() => setCurtain('loading_close'), 320));
    timers.current.push(setTimeout(() => setCurtain('lifting'), 720));
    timers.current.push(setTimeout(() => setCurtain('idle'), 1050));
  }, [wizardOpen, curtain]);

  return (
    <div className="lp-root min-h-screen bg-white text-zinc-900 selection:bg-indigo-500/20 selection:text-indigo-700">
      <LandingNavbar onOpenWizard={openWizard} />

      <main>
        <HeroSection onOpenWizard={openWizard} />
        <MetricsBar />
        <StepsSection onOpenWizard={openWizard} />
        <FeaturesGrid />
        <CommissionsSection />
        <PortalSection onOpenWizard={openWizard} />
        <PricingSection onOpenWizard={openWizard} />
        <FAQSection />
      </main>

      <FooterCTA onOpenWizard={openWizard} />

      {wizardOpen && <RegistrationWizard onClose={closeWizard} />}

      {/* Lamina de transicion */}
      {curtain !== 'idle' && (
        <div
          className={`fixed inset-0 z-[300] bg-[#faf9f8] text-zinc-900 flex flex-col items-center justify-center p-6 border-t border-zinc-300/80 shadow-2xl pointer-events-auto ${
            curtain === 'covering' ? 'lp-curtain-up' : ''
          } ${curtain === 'lifting' ? 'lp-curtain-lift' : ''}`}
        >
          <div
            className={`flex flex-col items-center max-w-xs w-full text-center transition-all duration-300 ${
              curtain === 'loading' || curtain === 'loading_close' || curtain === 'lifting' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <img src="/roosty2.png" alt="Roosty" className="h-9 w-auto mb-5" />
            <div className="w-48 h-1.5 bg-zinc-200 rounded-full overflow-hidden mb-3.5">
              <div className="h-full bg-indigo-600 rounded-full w-full animate-pulse" />
            </div>
            <p className="lp-mono text-[11px] tracking-widest text-zinc-500 uppercase font-semibold">
              {curtain === 'loading_close' ? 'Volviendo...' : 'Preparando tu agenda...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
