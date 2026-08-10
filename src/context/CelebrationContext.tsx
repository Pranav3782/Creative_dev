import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2 } from 'lucide-react';

interface TaskCelebration {
  id: string;
  taskTitle: string;
  remainingTasks: number;
}

interface LevelCelebration {
  id: string;
  levelName: string;
  badgeName: string;
}

interface CelebrationContextType {
  celebrateTask: (taskTitle: string, remainingTasks: number) => void;
  celebrateLevel: (levelName: string, badgeName: string) => void;
}

const CelebrationContext = createContext<CelebrationContextType | undefined>(undefined);

export const CelebrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [taskPopup, setTaskPopup] = useState<TaskCelebration | null>(null);
  const [levelPopup, setLevelPopup] = useState<LevelCelebration | null>(null);

  // Auto-dismiss task popup
  useEffect(() => {
    if (taskPopup) {
      const timer = setTimeout(() => setTaskPopup(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [taskPopup]);

  // Auto-dismiss level popup
  useEffect(() => {
    if (levelPopup) {
      const timer = setTimeout(() => setLevelPopup(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [levelPopup]);

  const celebrateTask = (taskTitle: string, remainingTasks: number) => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
        disableForReducedMotion: true
      });
    }

    setTaskPopup({
      id: Math.random().toString(),
      taskTitle,
      remainingTasks
    });
  };

  const celebrateLevel = (levelName: string, badgeName: string) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
          disableForReducedMotion: true
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
          disableForReducedMotion: true
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }

    setLevelPopup({
      id: Math.random().toString(),
      levelName,
      badgeName
    });
  };

  return (
    <CelebrationContext.Provider value={{ celebrateTask, celebrateLevel }}>
      {children}
      
      {/* Task Completion Popup */}
      <AnimatePresence>
        {taskPopup && !levelPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[100] w-[90%] max-w-sm"
          >
            <div className="bg-paper border-3 border-ink rounded-xl p-4 shadow-editorial-sm flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-lime border-2 border-ink flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 size={18} className="text-ink" />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-black text-lg text-ink uppercase tracking-tight">
                  {taskPopup.remainingTasks === 0 ? "🎉 All tasks complete!" : "🎉 Task Complete"}
                </h4>
                <p className="font-bold text-ink mt-1 truncate">{taskPopup.taskTitle}</p>
                {taskPopup.remainingTasks > 0 && (
                  <div className="mt-2 text-xs font-bold text-text-muted flex items-center gap-2">
                    <span className="flex gap-1">
                      {Array.from({ length: Math.min(taskPopup.remainingTasks, 5) }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-ink/20" />
                      ))}
                      {taskPopup.remainingTasks > 5 && <span className="ml-1">+{taskPopup.remainingTasks - 5}</span>}
                    </span>
                    {taskPopup.remainingTasks} task{taskPopup.remainingTasks !== 1 ? 's' : ''} remaining in this level
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Completion Celebration */}
      <AnimatePresence>
        {levelPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
            onClick={() => setLevelPopup(null)}
          >
            <motion.div 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-cream border-4 border-ink rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-editorial text-center relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-yellow border-b-4 border-ink" />
              
              <h2 className="font-display font-black text-3xl sm:text-4xl text-ink uppercase mt-4 mb-2">
                🎊 Level Complete!
              </h2>
              
              <div className="inline-block bg-paper border-2 border-ink rounded-full px-4 py-1 mb-8 shadow-[2px_2px_0_#211C1B]">
                <span className="font-bold text-sm tracking-wide uppercase">{levelPopup.levelName}</span>
              </div>

              <div className="relative w-32 h-32 mx-auto mb-6">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-ink rounded-full opacity-20"
                />
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, delay: 0.2 }}
                  className="absolute inset-0 bg-coral border-4 border-ink rounded-full shadow-[4px_4px_0_#211C1B] flex flex-col items-center justify-center text-paper"
                >
                  <Trophy size={40} className="mb-1" />
                </motion.div>
              </div>

              <h3 className="font-display font-black text-xl text-ink uppercase mb-2">New Badge Unlocked!</h3>
              <p className="font-bold text-coral text-lg mb-6">{levelPopup.badgeName}</p>

              <button 
                onClick={() => setLevelPopup(null)}
                className="editorial-btn-primary w-full"
              >
                Continue Journey
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CelebrationContext.Provider>
  );
};

export const useCelebration = () => {
  const context = useContext(CelebrationContext);
  if (context === undefined) {
    throw new Error('useCelebration must be used within a CelebrationProvider');
  }
  return context;
};
