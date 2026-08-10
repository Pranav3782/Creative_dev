import { useState, useEffect } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { useProgress } from '../../context/ProgressContext';

export const ContributionGraph = () => {
  const { tasks, roadmap } = useProgress();
  
  const today = new Date();
  
  // Calculate stats from actual tasks
  const completedTasksList = tasks.filter(t => t.completed && t.completedAt);

  // Derive level completion dates
  const completedLevels = roadmap.filter(l => l.status === 'completed').map(level => {
    const levelTasks = tasks.filter(t => t.roadmapLevelId === level.id && t.completedAt);
    if (levelTasks.length === 0) return null;
    
    const sortedTasks = [...levelTasks].sort((a, b) => 
      new Date(b.completedAt as string).getTime() - new Date(a.completedAt as string).getTime()
    );
    
    return {
      level,
      completedAt: sortedTasks[0].completedAt
    };
  }).filter(Boolean) as { level: any, completedAt: string }[];
  
  const daysToShow = 98;

  const [popup, setPopup] = useState<{
    visible: boolean;
    x: number;
    y: number;
    isBelow: boolean;
    dayDate: Date;
    intensityCount: number;
    tasks: any[];
    completedLevels: any[];
  } | null>(null);

  useEffect(() => {
    const handleClose = () => setPopup(null);
    window.addEventListener('scroll', handleClose, true);
    window.addEventListener('click', handleClose);
    return () => {
      window.removeEventListener('scroll', handleClose, true);
      window.removeEventListener('click', handleClose);
    };
  }, []);

  const handleSquareClick = (e: React.MouseEvent, dayDate: Date, intensityCount: number, dayTasks: any[], dayCompletedLevels: any[]) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceAbove = rect.top;
    
    let yPos = rect.top - 10;
    let isBelow = false;

    if (spaceAbove < 180) {
      yPos = rect.bottom + 10;
      isBelow = true;
    }

    setPopup({
      visible: true,
      x: rect.left + rect.width / 2,
      y: yPos,
      isBelow,
      dayDate,
      intensityCount,
      tasks: dayTasks,
      completedLevels: dayCompletedLevels
    });
  };
  
  return (
    <>
      <div className="editorial-card bg-paper w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-2xl">Activity Log</h3>
            <p className="text-text-muted text-sm font-bold">
              {completedTasksList.length} total contributions
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-start overflow-x-auto pb-4 custom-scrollbar">
          {Array.from({ length: 14 }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-2 shrink-0">
              {Array.from({ length: 7 }).map((_, rowIndex) => {
                const itemIndex = daysToShow - (colIndex * 7 + rowIndex) - 1;
                if (itemIndex < 0) return null;
                
                const dayDate = subDays(today, itemIndex);
                const isTodayDay = isSameDay(dayDate, today);
                
                const dayCompletedTasks = completedTasksList.filter(t => 
                  t.completedAt && isSameDay(new Date(t.completedAt), dayDate)
                );
                
                const dayCompletedLevels = completedLevels.filter(cl => 
                  isSameDay(new Date(cl.completedAt), dayDate)
                );
                
                const intensityCount = dayCompletedTasks.length;
                
                let bgColor = "bg-cream border-ink/10"; // 0
                if (intensityCount > 0 && intensityCount <= 2) bgColor = "bg-lime/30 border-lime/50";
                else if (intensityCount > 2 && intensityCount <= 4) bgColor = "bg-lime/60 border-lime/80";
                else if (intensityCount > 4 && intensityCount <= 7) bgColor = "bg-lime border-ink text-ink";
                else if (intensityCount > 7) bgColor = "bg-ink border-ink text-paper";
                
                return (
                  <div 
                    key={rowIndex} 
                    className="relative"
                    onClick={(e) => handleSquareClick(e, dayDate, intensityCount, dayCompletedTasks, dayCompletedLevels)}
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: itemIndex * 0.005 }}
                      className={`w-4 h-4 rounded-sm border ${bgColor} ${isTodayDay ? 'ring-2 ring-coral ring-offset-2 ring-offset-paper' : ''} hover:scale-125 transition-transform cursor-pointer`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-end gap-2 mt-4 text-xs font-bold text-text-muted">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm border bg-cream border-ink/10 shrink-0" />
          <div className="w-3 h-3 rounded-sm border bg-lime/30 border-lime/50 shrink-0" />
          <div className="w-3 h-3 rounded-sm border bg-lime/60 border-lime/80 shrink-0" />
          <div className="w-3 h-3 rounded-sm border bg-lime border-ink shrink-0" />
          <div className="w-3 h-3 rounded-sm border bg-ink border-ink shrink-0" />
          <span>More</span>
        </div>
      </div>

      {popup && popup.visible && (
        <div 
          className="fixed z-[100] w-max max-w-[200px] pointer-events-none transition-opacity duration-200"
          style={{ 
            left: Math.min(Math.max(popup.x, 100), window.innerWidth - 100),
            top: popup.y, 
            transform: `translate(-50%, ${popup.isBelow ? '0' : '-100%'})`
          }}
        >
          <div className="bg-ink text-cream text-xs px-3 py-2 rounded-lg shadow-editorial-sm border-2 border-transparent">
            <p className="font-bold text-yellow mb-1">{format(popup.dayDate, 'MMM d, yyyy')}</p>
            <p className="font-bold mb-2">{popup.intensityCount} tasks completed</p>
            
            {(popup.tasks.length > 0 || popup.completedLevels.length > 0) && (
              <ul className="text-[10px] text-cream/70 space-y-1">
                {popup.completedLevels.map(cl => (
                  <li key={cl.level.id} className="text-yellow truncate flex items-center gap-1 font-bold">
                    🏆 {cl.level.title}
                  </li>
                ))}
                {popup.tasks.slice(0, 3).map(t => (
                  <li key={t.id} className="truncate flex items-center gap-1">
                    <span className="text-lime">✓</span> {t.title}
                  </li>
                ))}
                {popup.intensityCount > 3 && <li className="pl-3 mt-1">+ {popup.intensityCount - 3} more</li>}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};
