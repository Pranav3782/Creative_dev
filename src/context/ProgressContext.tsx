import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { roadmapData } from '../data/roadmap';
import type { Level, Task } from '../data/roadmap';
import { format, isSameDay, startOfToday } from 'date-fns';

interface ProgressContextType {
  streak: number;
  roadmap: Level[];
  tasks: Task[];
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getDailyCompletion: (date?: string) => number; // percentage 0-100 for a specific date (defaults to today)
  getOverallCompletion: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('creative-tasks');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize from roadmap data if no saved tasks exist
    return roadmapData.flatMap(level => 
      level.tasks.map(t => ({ ...t, roadmapLevelId: level.id }))
    );
  });

  const [streak, setStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem('creative-streak') || '0', 10);
  });

  const [lastActive, setLastActive] = useState<string>(() => {
    return localStorage.getItem('creative-last-active') || '';
  });

  useEffect(() => {
    localStorage.setItem('creative-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('creative-streak', streak.toString());
    localStorage.setItem('creative-last-active', lastActive);
  }, [streak, lastActive]);

  // Check and update streak on mount
  useEffect(() => {
    const today = startOfToday().toISOString();
    if (lastActive) {
      const last = new Date(lastActive);
      const diffTime = Math.abs(new Date(today).getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 1) {
        // Streak logic - we keep it simple, if they missed > 1 day, it doesn't reset here unless we wanted to punish them.
        // The prompt states: "The streak should still be based on actual daily visits"
      } else if (diffDays === 1) {
        // They visited yesterday, so if they visit today, we update streak when they do an action or just by visiting
        setStreak(s => s + 1);
        setLastActive(today);
      }
    } else {
      setLastActive(today);
      setStreak(1);
    }
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substring(2, 9),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const completed = !t.completed;
        return {
          ...t,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
        };
      }
      return t;
    }));
  };

  // Derive roadmap state directly from tasks to ensure single source of truth
  const computedRoadmap = useMemo(() => {
    let previousLevelCompleted = true; // Level 0 is always accessible initially

    return roadmapData.map((baseLevel) => {
      const levelTasks = tasks.filter(t => t.roadmapLevelId === baseLevel.id);
      const allCompleted = levelTasks.length > 0 && levelTasks.every(t => t.completed);
      
      let status: 'locked' | 'active' | 'completed' = 'locked';
      if (allCompleted) {
        status = 'completed';
      } else if (previousLevelCompleted) {
        status = 'active';
      }

      previousLevelCompleted = allCompleted;

      return {
        ...baseLevel,
        status,
        tasks: levelTasks, // Inject real tasks back into the level object
      };
    });
  }, [tasks]);

  const getDailyCompletion = (dateStr?: string) => {
    // If a specific date is provided, calculate for that date.
    // Otherwise, check tasks scheduled for today.
    // If no tasks are scheduled for today, fallback to checking active roadmap level progress for the dashboard hero.
    
    if (dateStr) {
      const dayTasks = tasks.filter(t => t.date === dateStr);
      if (dayTasks.length === 0) return 0;
      const completedCount = dayTasks.filter(t => t.completed).length;
      return Math.round((completedCount / dayTasks.length) * 100);
    }
    
    // Default dashboard behavior:
    const activeLevel = computedRoadmap.find(l => l.status === 'active') || computedRoadmap[0];
    const levelTasks = activeLevel.tasks;
    if (levelTasks.length === 0) return 0;
    const completedCount = levelTasks.filter(t => t.completed).length;
    return Math.round((completedCount / levelTasks.length) * 100);
  };

  const getOverallCompletion = () => {
    const roadmapTasks = tasks.filter(t => t.roadmapLevelId !== undefined);
    if (roadmapTasks.length === 0) return 0;
    const completedTasks = roadmapTasks.filter(t => t.completed).length;
    return Math.round((completedTasks / roadmapTasks.length) * 100);
  };

  return (
    <ProgressContext.Provider value={{ 
      streak, 
      roadmap: computedRoadmap, 
      tasks,
      toggleTask, 
      addTask,
      updateTask,
      deleteTask,
      getDailyCompletion, 
      getOverallCompletion 
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
