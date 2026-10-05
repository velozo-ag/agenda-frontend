import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Funcionalidades', href: '#funciones' },
  { name: 'Precios', href: '#precios' },
  { name: 'Preguntas Frecuentes', href: '#faq' },
];

/**
 * Navbar flotante tipo "isla" (el que te gusto), ahora con el logo oficial roosty2.png
 * y el chip AGENDA (equivalente al chip POS de la linea naranja).
 */
export function LandingNavbar({ onOpenWizard }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-[padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled ? 'pt-3' : 'pt-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className={`flex items-center justify-between h-14 pl-5 pr-2.5 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              scrolled
                ? 'bg-zinc-950/80 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.8)]'
                : 'bg-transparent border-transparent'
            }`}
          >
            {/* Brand */}
            <a href="#top" className="flex items-center gap-2.5 group" aria-label="Roosty Agenda">
              <img
                src="/roosty2.png"
                alt="Roosty"
                className="h-6 sm:h-7 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80 invert opacity-90"
              />
              <span className="font-sans text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Agenda
              </span>
            </a>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors tracking-tight"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center">
              <button
                type="button"
                onClick={onOpenWizard}
                className="group bg-white hover:bg-zinc-100 text-zinc-950 inline-flex items-center gap-2 pl-5 pr-1.5 h-10 rounded-full text-sm font-semibold cursor-pointer transition-colors"
              >
                <span className="tracking-tight">Iniciar gratis</span>
                <span className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </button>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenWizard}
                className="bg-white text-zinc-950 px-3.5 h-9 rounded-full text-xs font-semibold cursor-pointer"
              >
                Empezar
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-3xl" onClick={() => setOpen(false)} />
        <div className="relative h-full flex flex-col px-6 pt-5 pb-10">
          <div className="flex items-center justify-between h-14">
            <img src="/roosty2.png" alt="Roosty" className="h-7 w-auto invert opacity-90" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-transform cursor-pointer text-white"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-2">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : '0ms' }}
                className={`font-sans tracking-tighter text-3xl font-bold text-white py-4 border-b border-white/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenWizard();
            }}
            style={{ transitionDelay: open ? '320ms' : '0ms' }}
            className={`mt-auto bg-white text-zinc-950 h-14 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            Iniciar gratis <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
