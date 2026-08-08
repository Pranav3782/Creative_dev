
import { useProgress } from '../../context/ProgressContext';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export const DailyChecklist = () => {
  const { roadmap, tasks, toggleTask } = useProgress();
  
  // 1. Get active roadmap level tasks
  const activeLevel = roadmap.find(l => l.status === 'active') || roadmap[0];
  const roadmapTasks = activeLevel.tasks;
  
  // 2. Get today's calendar tasks
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const calendarTasks = tasks.filter(t => t.date === todayStr);
  
  // 3. Combine and remove duplicates (if a task is somehow both)
  const allTodayTasks = [...roadmapTasks];
  calendarTasks.forEach(ct => {
    if (!allTodayTasks.find(rt => rt.id === ct.id)) {
      allTodayTasks.push(ct);
    }
  });

  const completedTasksCount = allTodayTasks.filter(t => t.completed).length;
  const totalTasks = allTodayTasks.length;
  const isAllCompleted = totalTasks > 0 && completedTasksCount === totalTasks;

  return (
    <div className="editorial-card bg-paper w-full max-w-xl">
      <div className="flex items-end justify-between mb-6 border-b-3 border-ink pb-4">
        <div>
          <h2 className="font-display font-black text-3xl">Today's Missions</h2>
          <p className="font-bold text-text-muted mt-1">Level: {activeLevel.title} & Schedule</p>
        </div>
        <div className="text-right">
          <span className="font-display font-bold text-2xl text-coral">
            {completedTasksCount} <span className="text-lg text-ink/50">/ {totalTasks}</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {totalTasks === 0 ? (
           <p className="text-center font-bold text-ink/40 py-4">No missions scheduled for today.</p>
        ) : (
          allTodayTasks.map((task, index) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              task.completed ? 'bg-lime/10 border-lime' : 'bg-cream border-ink hover:bg-white hover:-translate-y-1 hover:shadow-editorial-sm'
            }`}
            onClick={() => toggleTask(task.id)}
          >
            <div className="pt-1">
              <input 
                type="checkbox" 
                className="editorial-checkbox" 
                checked={task.completed} 
                onChange={() => {}} 
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex-1">
              <h4 className={`font-bold text-lg leading-tight mb-1 transition-colors ${task.completed ? 'line-through text-ink/50' : 'text-ink'}`}>
                {task.title}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-md border-2 ${
                  task.effort === 'short' ? 'bg-periwinkle/30 border-periwinkle/50' : 
                  task.effort === 'medium' ? 'bg-yellow/30 border-yellow/50' : 
                  'bg-coral/30 border-coral/50'
                }`}>
                  {task.effort?.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isAllCompleted && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="bg-lime border-3 border-ink rounded-xl p-4 flex items-center justify-between shadow-editorial-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-paper rounded-full border-2 border-ink flex items-center justify-center">
                <Check size={24} className="text-ink" />
              </div>
              <p className="font-bold text-ink">All missions completed for today!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
