import React, { useState, useEffect } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { Flame, Calendar as CalendarIcon, Map, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { startOfWeek, subDays, addDays, isSameDay, format } from 'date-fns';

export const Navbar = ({ currentView, onViewChange }: { currentView: string, onViewChange: (view: string) => void }) => {
  const { streak, tasks } = useProgress();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStreakOpen, setIsStreakOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClose = () => setIsStreakOpen(false);
    if (isStreakOpen) {
      window.addEventListener('click', handleClose);
    }
    return () => window.removeEventListener('click', handleClose);
  }, [isStreakOpen]);

  const completedTasksList = tasks.filter(t => t.completed && t.completedAt);
  const uniqueDays = [...new Set(completedTasksList.map(t => {
    const date = new Date(t.completedAt as string);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }))];
  const activeDaysCount = uniqueDays.length;

  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const prevWeekStart = subDays(currentWeekStart, 7);
  const daysToRender = Array.from({ length: 14 }).map((_, i) => addDays(prevWeekStart, i));

  return (
    <>
      <nav className="w-full bg-cream border-b-3 border-ink px-3 sm:px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-1.5 md:gap-2 cursor-pointer shrink-0" onClick={() => handleNavClick('roadmap')}>
          <div className="w-7 h-7 md:w-8 md:h-8 bg-coral rounded-full border-2 border-ink flex items-center justify-center shrink-0">
            <span className="text-paper font-display font-bold text-xs md:text-sm">C</span>
          </div>
          <span className="font-display font-black text-[16px] sm:text-xl md:text-2xl tracking-tighter text-ink uppercase">
            creative.dev
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink icon={<Map size={18} />} label="Roadmap" active={currentView === 'roadmap'} onClick={() => handleNavClick('roadmap')} />
          <NavLink icon={<CalendarIcon size={18} />} label="Calendar" active={currentView === 'calendar'} onClick={() => handleNavClick('calendar')} />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0 relative">
          
          <button 
            className="flex items-center gap-1 md:gap-2 bg-paper border-2 border-ink rounded-full px-2 py-1 md:px-4 md:py-1.5 shadow-editorial-sm shrink-0 hover:bg-cream transition-colors relative"
            onClick={(e) => {
              e.stopPropagation();
              setIsStreakOpen(!isStreakOpen);
            }}
          >
            <Flame size={14} className="text-coral fill-coral/20 md:w-4 md:h-4" />
            <span className="font-bold text-xs md:text-sm">{streak} Day<span className="hidden md:inline"> Streak</span></span>
          </button>

          {/* Streak Popover */}
          <AnimatePresence>
            {isStreakOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full mt-3 right-0 sm:-right-4 w-60 sm:w-64 bg-paper border-3 border-ink rounded-xl shadow-editorial p-4 z-[100]"
                onClick={e => e.stopPropagation()}
              >
                <h4 className="font-display font-black text-lg text-ink flex items-center gap-2">
                  <Flame size={18} className="text-coral fill-coral/20" /> 
                  {streak} Day Streak
                </h4>
                <p className="text-xs font-bold text-text-muted mb-4">{streak > 0 ? `${streak} consecutive days of building` : 'Complete a task today to start your streak!'}</p>
                
                <div className="grid grid-cols-7 gap-y-3 text-center mb-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={`header-${i}`} className="text-xs font-bold text-ink">{d}</div>
                  ))}
                  {daysToRender.map((date, i) => {
                    const isFuture = date > today;
                    const dayTasks = completedTasksList.filter(t => t.completedAt && isSameDay(new Date(t.completedAt), date));
                    const isActive = dayTasks.length > 0;
                    
                    return (
                      <div key={`day-${i}`} className="flex justify-center group relative cursor-help">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 transition-transform hover:scale-125 ${
                          isActive ? 'bg-lime border-ink' : 
                          isFuture ? 'bg-transparent border-transparent' : 'bg-cream border-ink/20'
                        }`} />
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 w-max text-center">
                          <div className="bg-ink text-cream px-2 py-1 rounded shadow-editorial-sm text-[10px]">
                            <p className="font-bold text-yellow">{format(date, 'MMM d')}</p>
                            <p>{isActive ? `${dayTasks.length} tasks` : 'No tasks'}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="mt-4 pt-3 border-t-2 border-ink/10 flex justify-between items-center text-xs font-bold text-text-muted">
                  <span>Total Active Days</span>
                  <span className="text-ink">{activeDaysCount}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-periwinkle border-2 border-ink rounded-full shadow-editorial-sm overflow-hidden shrink-0">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          
          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden w-7 h-7 sm:w-8 sm:h-8 bg-paper border-2 border-ink rounded-full flex items-center justify-center shadow-editorial-sm shrink-0"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={16} className="text-ink" />
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
                  icon={<CalendarIcon size={24} />} 
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
