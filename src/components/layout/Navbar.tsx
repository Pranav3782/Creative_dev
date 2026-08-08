import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { Flame, Calendar, Map, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ currentView, onViewChange }: { currentView: string, onViewChange: (view: string) => void }) => {
  const { streak } = useProgress();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full bg-cream border-b-3 border-ink px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('roadmap')}>
          <div className="w-8 h-8 bg-coral rounded-full border-2 border-ink flex items-center justify-center">
            <span className="text-paper font-display font-bold text-sm">C</span>
          </div>
          <span className="font-display font-black text-xl md:text-2xl tracking-tighter text-ink uppercase">
            creative.dev
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink icon={<Map size={18} />} label="Roadmap" active={currentView === 'roadmap'} onClick={() => handleNavClick('roadmap')} />
          <NavLink icon={<Calendar size={18} />} label="Calendar" active={currentView === 'calendar'} onClick={() => handleNavClick('calendar')} />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1.5 md:gap-2 bg-paper border-2 border-ink rounded-full px-3 md:px-4 py-1 md:py-1.5 shadow-editorial-sm">
            <Flame size={16} className="text-coral fill-coral/20" />
            <span className="font-bold text-xs md:text-sm">{streak} Day<span className="hidden md:inline"> Streak</span></span>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-periwinkle border-2 border-ink rounded-full shadow-editorial-sm overflow-hidden">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          
          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden w-10 h-10 bg-paper border-2 border-ink rounded-full flex items-center justify-center shadow-editorial-sm"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} className="text-ink" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm md:hidden flex justify-end"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-sm h-full bg-cream border-l-3 border-ink shadow-editorial flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b-3 border-ink flex items-center justify-between bg-paper">
                <span className="font-display font-black text-xl tracking-tighter text-ink uppercase">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 bg-cream border-2 border-ink rounded-full flex items-center justify-center hover:bg-coral hover:text-paper transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col p-6 gap-6">
                <MobileNavLink 
                  icon={<Map size={24} />} 
                  label="Roadmap" 
                  active={currentView === 'roadmap'} 
                  onClick={() => handleNavClick('roadmap')} 
                />
                <MobileNavLink 
                  icon={<Calendar size={24} />} 
                  label="Calendar" 
                  active={currentView === 'calendar'} 
                  onClick={() => handleNavClick('calendar')} 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavLink = ({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-2 font-bold text-sm transition-colors ${active ? 'text-ink' : 'text-text-muted hover:text-ink'}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const MobileNavLink = ({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-4 font-display font-bold text-2xl transition-colors w-full p-4 rounded-xl border-2 ${
      active ? 'bg-periwinkle/30 border-periwinkle text-ink' : 'bg-transparent border-transparent text-text-muted hover:text-ink'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
