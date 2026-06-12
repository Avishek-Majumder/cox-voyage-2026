import React, { useState, useEffect } from 'react';
import { Menu, X, Compass, List, Shield, Sun, Moon, Sparkles, MapPin, Cloudy, ClipboardList, RefreshCw, Calculator, Users, Clock, Ticket, Image, Wallet, Users2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SectionLink {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionLink[] = [
  { id: 'todays-action', label: 'Overview', icon: Sparkles },
  { id: 'tickets-booking', label: 'Bookings', icon: Ticket },
  { id: 'booked-hotel', label: 'Hotels', icon: List },
  { id: 'trip-wallet', label: 'Wallet', icon: Wallet },
  { id: 'trip-gallery', label: 'Gallery', icon: Image },
  { id: 'cost-split', label: 'Cost Split', icon: Users },
  { id: 'group-selector', label: 'Squad & Seats', icon: Users2 },
  { id: 'route-map', label: 'Route Map', icon: MapPin },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'checklist', label: 'Checklist', icon: ClipboardList },
  { id: 'weather', label: 'Live Weather', icon: Cloudy },
];

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('todays-action');

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sticky ribbon navigation bar */}
      <div className="hidden lg:block sticky top-0 z-40 bg-white/95 dark:bg-[#07111F]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 shadow-xxs transition-all duration-200" id="desktop-sec-nav">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-sky-500" />
            <span>Voyage Index</span>
          </div>
          <div className="flex items-center gap-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleScrollTo(section.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? 'bg-sky-550 border-[#006CE4] text-white'
                      : 'bg-transparent border-transparent text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-[#1A263F] hover:text-[#006CE4]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) and Menu Bottom Sheet */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40" id="mobile-fab-container">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#006CE4] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#0051BE] active:scale-95 transition-all font-black text-xs uppercase tracking-wide cursor-pointer focus:ring-2 focus:ring-[#006CE4] focus:ring-offset-2"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-section-menu"
        >
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>Menu</span>
        </button>
      </div>

      {/* Interactive AnimatePresence Mobile Sheet Overlays */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-45 backdrop-blur-xxs"
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              id="mobile-section-menu"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 max-h-[85dvh] bg-white dark:bg-[#0F1B2D] border-t border-slate-200 dark:border-slate-800 rounded-t-3xl z-50 p-6 shadow-2xl flex flex-col overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              {/* Grab handle for touch affordance */}
              <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4 flex-shrink-0" />

              {/* Title Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex-shrink-0">
                <div className="flex items-center gap-2 text-[#006CE4]">
                  <Compass className="w-5 h-5 animate-pulse" />
                  <span className="font-extrabold text-sm uppercase tracking-wide text-slate-900 dark:text-white">Route Navigation</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full bg-slate-100 dark:bg-[#1A263F] text-slate-500 dark:text-slate-300 cursor-pointer"
                  aria-label="Close navigation sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid or list of navigation anchors */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleScrollTo(section.id)}
                      className={`w-full p-3.5 rounded-2xl text-left text-sm font-black transition-all flex items-center justify-between cursor-pointer border ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-950/20 border-sky-400 text-[#006CE4] dark:text-sky-300'
                          : 'bg-transparent border-transparent text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-[#1A263F]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition ${isActive ? 'bg-[#006CE4] text-white' : 'bg-slate-100 dark:bg-[#1A263F] text-slate-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{section.label}</span>
                      </div>
                      {isActive && <div className="w-2 h-2 rounded-full bg-[#006CE4]" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
