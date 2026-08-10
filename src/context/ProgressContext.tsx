import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { roadmapData } from '../data/roadmap';
import type { Level, Task } from '../data/roadmap';
import { startOfToday } from 'date-fns';
import { useCelebration } from './CelebrationContext';

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

export const getBadgeNameForLevel = (levelId: number) => {
  const badgeNames: Record<number, string> = {
    0: 'Foundation Builder',
    1: 'Motion Alchemist',
    2: 'CSS Wizard',
    3: 'Three.js Explorer',
    4: 'React 3D Creator',
    5: 'Effect Director',
    6: 'Shader Sorcerer',
    7: '3D Artist',
    8: 'Clone Architect',
    9: 'Creative Dev Master'
  };
  return badgeNames[levelId] || 'Creative Explorer';
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { celebrateTask, celebrateLevel } = useCelebration();
  
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

  const [lastActive, setLastActive] = useState<string>(() => {
    return localStorage.getItem('creative-last-active') || '';
  });

  const streak = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed && t.completedAt);
    if (completedTasks.length === 0) return 0;

    const uniqueDays = [...new Set(completedTasks.map(t => {
      const date = new Date(t.completedAt as string);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }))].sort((a, b) => b - a);

    if (uniqueDays.length === 0) return 0;

    const todayDate = new Date();
    const today = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()).getTime();
    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (uniqueDays[0] < today - ONE_DAY) {
      return 0; // Streak broken if no tasks completed today or yesterday
    }

    let currentStreak = 0;
    let expectedDay = uniqueDays[0];

    for (const day of uniqueDays) {
      if (day === expectedDay) {
        currentStreak++;
        expectedDay -= ONE_DAY;
      } else {
        break;
      }
    }

    return currentStreak;
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('creative-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('creative-last-active', lastActive);
  }, [lastActive]);

  // Update last active on mount
  useEffect(() => {
    const today = startOfToday().toISOString();
    if (!lastActive) {
      setLastActive(today);
    } else if (lastActive !== today) {
      setLastActive(today);
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
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const isCompleting = !task.completed;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          completed: isCompleting,
          completedAt: isCompleting ? new Date().toISOString() : undefined,
        };
      }
      return t;
    }));

    if (isCompleting && task.roadmapLevelId !== undefined) {
      const newTasks = tasks.map(t => t.id === taskId ? { ...t, completed: true } : t);
      const levelTasks = newTasks.filter(t => t.roadmapLevelId === task.roadmapLevelId);
      const remaining = levelTasks.filter(t => !t.completed).length;

      celebrateTask(task.title, remaining);

      if (remaining === 0) {
        const level = roadmapData.find(l => l.id === task.roadmapLevelId);
        if (level) {
          setTimeout(() => {
            celebrateLevel(level.title, getBadgeNameForLevel(level.id));
          }, 1500); // Wait for task toast to be processed
        }
      }
    }
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
