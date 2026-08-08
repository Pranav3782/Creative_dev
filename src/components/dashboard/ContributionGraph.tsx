import React from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { useProgress } from '../../context/ProgressContext';

export const ContributionGraph = () => {
  const { tasks } = useProgress();
  
  const today = new Date();
  
  // Calculate stats from actual tasks
  const completedTasksList = tasks.filter(t => t.completed && t.completedAt);
  
  // Determine how many days back we want to show. 
  // Let's stick to 14 weeks * 7 days = 98 days to fit the UI.
  const daysToShow = 98;
  
  return (
    <div className="editorial-card bg-paper w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-2xl">Activity Log</h3>
          <p className="text-text-muted text-sm font-bold">
            {completedTasksList.length} total contributions
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-start overflow-x-auto pb-4">
        {Array.from({ length: 14 }).map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-2">
            {Array.from({ length: 7 }).map((_, rowIndex) => {
              const itemIndex = daysToShow - (colIndex * 7 + rowIndex) - 1;
              if (itemIndex < 0) return null;
              
              const dayDate = subDays(today, itemIndex);
              const isTodayDay = isSameDay(dayDate, today);
              
              // Find tasks completed on this day
              const dayCompletedTasks = completedTasksList.filter(t => 
                t.completedAt && isSameDay(new Date(t.completedAt), dayDate)
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
                  className="group relative hover:z-50"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: itemIndex * 0.005 }}
                    className={`w-4 h-4 rounded-sm border ${bgColor} ${isTodayDay ? 'ring-2 ring-coral ring-offset-2 ring-offset-paper' : ''} hover:scale-125 transition-transform cursor-pointer`}
                  />
                  {/* Tooltip */}
                  <div className={`absolute ${rowIndex < 2 ? 'top-full mt-2' : 'bottom-full mb-2'} left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 w-max max-w-[200px]`}>
                    <div className="bg-ink text-cream text-xs px-3 py-2 rounded-lg shadow-editorial-sm border-2 border-transparent">
                      <p className="font-bold text-yellow mb-1">{format(dayDate, 'MMM d, yyyy')}</p>
                      <p className="font-bold mb-1">{intensityCount} tasks completed</p>
                      {intensityCount > 0 && (
                        <ul className="text-[10px] text-cream/70 list-disc pl-3">
                          {dayCompletedTasks.slice(0, 3).map(t => (
                            <li key={t.id} className="truncate">{t.title}</li>
                          ))}
                          {intensityCount > 3 && <li>+ {intensityCount - 3} more</li>}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-4 text-xs font-bold text-text-muted">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm border bg-cream border-ink/10" />
        <div className="w-3 h-3 rounded-sm border bg-lime/30 border-lime/50" />
        <div className="w-3 h-3 rounded-sm border bg-lime/60 border-lime/80" />
        <div className="w-3 h-3 rounded-sm border bg-lime border-ink" />
        <div className="w-3 h-3 rounded-sm border bg-ink border-ink" />
        <span>More</span>
      </div>
    </div>
  );
};
