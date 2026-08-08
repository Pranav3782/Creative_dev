import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, Check } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../../data/roadmap';

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { tasks } = useProgress();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <>
      <div className="w-full max-w-5xl mx-auto editorial-card bg-paper">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-8 pb-6 border-b-3 border-ink">
          <div>
            <h2 className="font-display font-black text-4xl text-ink">Schedule</h2>
            <p className="text-text-muted font-bold mt-2">Plan your roadmap missions.</p>
          </div>
          
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4 bg-cream border-2 border-ink rounded-xl p-2 shadow-editorial-sm">
            <button 
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-paper rounded-lg transition-colors border-2 border-transparent hover:border-ink"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-display font-bold text-xl min-w-[140px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button 
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-paper rounded-lg transition-colors border-2 border-transparent hover:border-ink"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar -mx-2 px-2 md:mx-0 md:px-0">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold text-text-muted text-sm uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {/* Empty cells for padding */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-32 rounded-xl bg-transparent" />
              ))}
              
              {days.map(day => {
                const today = isToday(day);
                const dateStr = format(day, 'yyyy-MM-dd');
                const dayTasks = tasks.filter(t => t.date === dateStr);
                const completedCount = dayTasks.filter(t => t.completed).length;

                return (
                  <div 
                    key={day.toISOString()} 
                    onClick={() => setSelectedDay(day)}
                    className={`h-32 rounded-xl border-3 transition-all p-2 flex flex-col group cursor-pointer ${
                      today 
                        ? 'border-coral bg-coral/5 shadow-editorial-sm' 
                        : 'border-ink/20 bg-cream hover:border-ink hover:bg-paper hover:-translate-y-1 hover:shadow-editorial-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-display font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full ${today ? 'bg-coral text-paper' : 'text-ink'}`}>
                        {format(day, 'd')}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 p-1 text-ink/40 hover:text-ink transition-opacity">
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {dayTasks.map(task => (
                        <div key={task.id} className={`border rounded p-1.5 text-xs font-bold leading-tight mb-1 truncate ${
                          task.completed ? 'bg-lime/30 border-lime/50 line-through text-ink/50' : 'bg-periwinkle/30 border-periwinkle/50'
                        }`}>
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedDay && (
          <DayCardModal day={selectedDay} onClose={() => setSelectedDay(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

const DayCardModal = ({ day, onClose }: { day: Date, onClose: () => void }) => {
  const { tasks, toggleTask, addTask, deleteTask, updateTask } = useProgress();
  const dateStr = format(day, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr);
  const completedCount = dayTasks.filter(t => t.completed).length;
  const totalCount = dayTasks.length;
  
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle, date: dateStr });
    setNewTaskTitle('');
    setIsAdding(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-paper border-3 border-ink rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-editorial"
      >
        <div className="bg-cream border-b-3 border-ink p-6 flex flex-col gap-2 relative">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center bg-paper hover:bg-coral hover:text-paper transition-colors absolute top-6 right-6"
          >
            <X size={16} />
          </button>
          
          <h2 className="font-display font-black text-2xl uppercase tracking-tight">
            {format(day, 'MMMM d')} {isToday(day) && '— TODAY'}
          </h2>
          <p className="font-bold text-text-muted flex items-center gap-2">
            <span className="text-coral text-lg">{completedCount} / {totalCount}</span> tasks completed
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {dayTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-bold text-ink/40 mb-4">No tasks planned for this day.</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="editorial-btn-secondary"
              >
                Add Task
              </button>
            </div>
          ) : (
            dayTasks.map(task => (
              <div 
                key={task.id}
                className={`group flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  task.completed ? 'bg-lime/10 border-lime' : 'bg-cream border-ink hover:-translate-y-[1px] hover:shadow-editorial-sm'
                }`}
              >
                <div onClick={() => toggleTask(task.id)} className="cursor-pointer">
                  <input type="checkbox" className="editorial-checkbox" checked={task.completed} onChange={() => {}} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <input 
                    type="text"
                    value={task.title}
                    onChange={(e) => updateTask(task.id, { title: e.target.value })}
                    className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none font-bold truncate ${
                      task.completed ? 'line-through text-ink/50' : 'text-ink'
                    }`}
                  />
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-ink/30 hover:text-coral transition-opacity p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}

          {isAdding && (
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input 
                autoFocus
                type="text" 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?" 
                className="flex-1 bg-cream border-2 border-ink rounded-lg px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-coral/20"
              />
              <button type="submit" className="editorial-btn-primary py-2 px-4 !rounded-lg">
                Save
              </button>
            </form>
          )}
          
          {!isAdding && dayTasks.length > 0 && (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-2 py-3 mt-4 border-2 border-ink/20 rounded-xl font-bold text-ink/50 hover:border-ink hover:text-ink transition-colors"
            >
              <Plus size={16} /> Add Task
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
