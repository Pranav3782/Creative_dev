import { useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { 
  Footprints, Target, Zap, Crosshair, Flame, 
  Hammer, Wand, Wand2, Box, Layers, Sparkles, 
  Bookmark, Notebook, Crown, Sun, Moon
} from 'lucide-react';

export interface Badge {
  id: string;
  name: string;
  desc: string;
  category: 'Task Completion' | 'Streaks' | 'Roadmap / Levels' | 'Learning / Resources' | 'Special';
  icon: any;
  color: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progressText: string;
}

export const useBadges = () => {
  const { tasks, streak, roadmap } = useProgress();

  return useMemo(() => {
    const completedTasksList = tasks.filter(t => t.completed && t.completedAt);
    const completedCount = completedTasksList.length;

    // Helper to get unique active days
    const uniqueDays = [...new Set(completedTasksList.map(t => {
      const date = new Date(t.completedAt as string);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }))].sort((a, b) => b - a);

    // Max streak calculation (simplified max consecutive sequence from history)
    let maxStreak = 0;
    if (uniqueDays.length > 0) {
      let currentSeq = 1;
      maxStreak = 1;
      for (let i = 0; i < uniqueDays.length - 1; i++) {
        const diff = (uniqueDays[i] - uniqueDays[i+1]) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentSeq++;
          maxStreak = Math.max(maxStreak, currentSeq);
        } else {
          currentSeq = 1;
        }
      }
    }

    // Helper for max tasks in a single day
    const tasksPerDay: Record<number, number> = {};
    completedTasksList.forEach(t => {
      const date = new Date(t.completedAt as string);
      const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      tasksPerDay[day] = (tasksPerDay[day] || 0) + 1;
    });
    const maxTasksInOneDay = Math.max(0, ...Object.values(tasksPerDay));

    // Time-based checks
    const hasEarlyTask = completedTasksList.some(t => {
      const hr = new Date(t.completedAt as string).getHours();
      return hr < 8;
    });
    const hasNightTask = completedTasksList.some(t => {
      const hr = new Date(t.completedAt as string).getHours();
      return hr >= 22;
    });

    // Notes checking
    const levelsWithNotes = roadmap.filter(l => 
      l.tasks.some(t => t.notes && t.notes.trim().length > 0)
    ).length;

    const badges: Badge[] = [
      // TASK COMPLETION
      {
        id: 'first_step', name: 'First Step', desc: 'Complete your first task.', category: 'Task Completion',
        icon: Footprints, color: 'text-yellow fill-yellow/20 bg-yellow',
        isUnlocked: completedCount >= 1, progressText: `${Math.min(completedCount, 1)} / 1`
      },
      {
        id: 'task_hunter', name: 'Task Hunter', desc: 'Complete 10 tasks.', category: 'Task Completion',
        icon: Target, color: 'text-coral fill-coral/20 bg-coral',
        isUnlocked: completedCount >= 10, progressText: `${Math.min(completedCount, 10)} / 10`
      },
      {
        id: 'task_machine', name: 'Task Machine', desc: 'Complete 25 tasks.', category: 'Task Completion',
        icon: Zap, color: 'text-lime fill-lime/20 bg-lime',
        isUnlocked: completedCount >= 25, progressText: `${Math.min(completedCount, 25)} / 25`
      },
      {
        id: 'century_builder', name: 'Century Builder', desc: 'Complete 100 tasks.', category: 'Task Completion',
        icon: Zap, color: 'text-periwinkle fill-periwinkle/20 bg-periwinkle',
        isUnlocked: completedCount >= 100, progressText: `${Math.min(completedCount, 100)} / 100`
      },
      {
        id: 'deep_focus', name: 'Deep Focus', desc: 'Complete 5+ tasks in one day.', category: 'Task Completion',
        icon: Crosshair, color: 'text-coral fill-coral/20 bg-coral',
        isUnlocked: maxTasksInOneDay >= 5, progressText: `${Math.min(maxTasksInOneDay, 5)} / 5`
      },

      // STREAKS
      {
        id: 'getting_started', name: 'Getting Started', desc: 'Complete tasks on 3 consecutive days.', category: 'Streaks',
        icon: Flame, color: 'text-coral fill-coral/20 bg-coral',
        isUnlocked: maxStreak >= 3, progressText: `${Math.min(maxStreak, 3)} / 3 days`
      },
      {
        id: 'week_warrior', name: 'Week Warrior', desc: 'Maintain a 7-day streak.', category: 'Streaks',
        icon: Flame, color: 'text-coral fill-coral/20 bg-coral',
        isUnlocked: maxStreak >= 7, progressText: `${Math.min(maxStreak, 7)} / 7 days`
      },
      {
        id: 'two_week_builder', name: 'Two Week Builder', desc: 'Maintain a 14-day streak.', category: 'Streaks',
        icon: Flame, color: 'text-coral fill-coral/20 bg-coral',
        isUnlocked: maxStreak >= 14, progressText: `${Math.min(maxStreak, 14)} / 14 days`
      },
      {
        id: 'consistency_master', name: 'Consistency Master', desc: 'Maintain a 30-day streak.', category: 'Streaks',
        icon: Flame, color: 'text-coral fill-coral/20 bg-coral',
        isUnlocked: maxStreak >= 30, progressText: `${Math.min(maxStreak, 30)} / 30 days`
      },
      {
        id: 'legendary_streak', name: 'Legendary Streak', desc: 'Maintain a 100-day streak.', category: 'Streaks',
        icon: Crown, color: 'text-yellow fill-yellow/20 bg-yellow',
        isUnlocked: maxStreak >= 100, progressText: `${Math.min(maxStreak, 100)} / 100 days`
      },

      // ROADMAP / LEVELS
      {
        id: 'level_0', name: 'Foundation Builder', desc: 'Complete Level 0.', category: 'Roadmap / Levels',
        icon: Hammer, color: 'text-periwinkle fill-periwinkle/20 bg-periwinkle',
        isUnlocked: roadmap.find(l => l.id === 0)?.status === 'completed', progressText: roadmap.find(l => l.id === 0)?.status === 'completed' ? 'Completed' : 'Incomplete'
      },
      {
        id: 'level_1', name: 'Motion Alchemist', desc: 'Complete Level 1.', category: 'Roadmap / Levels',
        icon: Wand, color: 'text-periwinkle fill-periwinkle/20 bg-periwinkle',
        isUnlocked: roadmap.find(l => l.id === 1)?.status === 'completed', progressText: roadmap.find(l => l.id === 1)?.status === 'completed' ? 'Completed' : 'Incomplete'
      },
      {
        id: 'level_2', name: 'CSS Wizard', desc: 'Complete Level 2.', category: 'Roadmap / Levels',
        icon: Wand2, color: 'text-periwinkle fill-periwinkle/20 bg-periwinkle',
        isUnlocked: roadmap.find(l => l.id === 2)?.status === 'completed', progressText: roadmap.find(l => l.id === 2)?.status === 'completed' ? 'Completed' : 'Incomplete'
      },
      {
        id: 'level_3', name: 'Three.js Explorer', desc: 'Complete Level 3.', category: 'Roadmap / Levels',
        icon: Box, color: 'text-periwinkle fill-periwinkle/20 bg-periwinkle',
        isUnlocked: roadmap.find(l => l.id === 3)?.status === 'completed', progressText: roadmap.find(l => l.id === 3)?.status === 'completed' ? 'Completed' : 'Incomplete'
      },
      {
        id: 'level_4', name: '3D React Creator', desc: 'Complete Level 4.', category: 'Roadmap / Levels',
        icon: Layers, color: 'text-periwinkle fill-periwinkle/20 bg-periwinkle',
        isUnlocked: roadmap.find(l => l.id === 4)?.status === 'completed', progressText: roadmap.find(l => l.id === 4)?.status === 'completed' ? 'Completed' : 'Incomplete'
      },
      {
        id: 'level_5', name: 'Effect Director', desc: 'Complete Level 5.', category: 'Roadmap / Levels',
        icon: Sparkles, color: 'text-periwinkle fill-periwinkle/20 bg-periwinkle',
        isUnlocked: roadmap.find(l => l.id === 5)?.status === 'completed', progressText: roadmap.find(l => l.id === 5)?.status === 'completed' ? 'Completed' : 'Incomplete'
      },
      {
        id: 'level_6', name: 'Shader Sorcerer', desc: 'Complete Level 6.', category: 'Roadmap / Levels',
        icon: Sparkles, color: 'text-periwinkle fill-periwinkle/20 bg-periwinkle',
        isUnlocked: roadmap.find(l => l.id === 6)?.status === 'completed', progressText: roadmap.find(l => l.id === 6)?.status === 'completed' ? 'Completed' : 'Incomplete'
      },
      {
        id: 'level_9', name: 'Creative Dev Master', desc: 'Complete Level 9.', category: 'Roadmap / Levels',
        icon: Crown, color: 'text-yellow fill-yellow/20 bg-yellow',
        isUnlocked: roadmap.find(l => l.id === 9)?.status === 'completed', progressText: roadmap.find(l => l.id === 9)?.status === 'completed' ? 'Completed' : 'Incomplete'
      },

      // LEARNING / RESOURCES
      {
        id: 'resource_collector', name: 'Resource Collector', desc: 'Save 10 resources.', category: 'Learning / Resources',
        icon: Bookmark, color: 'text-lime fill-lime/20 bg-lime',
        isUnlocked: false, progressText: '0 / 10' // Future feature
      },
      {
        id: 'knowledge_seeker', name: 'Knowledge Seeker', desc: 'Save 25 resources.', category: 'Learning / Resources',
        icon: Bookmark, color: 'text-lime fill-lime/20 bg-lime',
        isUnlocked: false, progressText: '0 / 25' // Future feature
      },
      {
        id: 'notebook_keeper', name: 'Notebook Keeper', desc: 'Add notes to 5 roadmap levels.', category: 'Learning / Resources',
        icon: Notebook, color: 'text-lime fill-lime/20 bg-lime',
        isUnlocked: levelsWithNotes >= 5, progressText: `${Math.min(levelsWithNotes, 5)} / 5`
      },

      // SPECIAL
      {
        id: 'early_builder', name: 'Early Builder', desc: 'Complete a task before 8 AM.', category: 'Special',
        icon: Sun, color: 'text-yellow fill-yellow/20 bg-yellow',
        isUnlocked: hasEarlyTask, progressText: hasEarlyTask ? 'Unlocked' : 'Incomplete'
      },
      {
        id: 'night_owl', name: 'Night Owl', desc: 'Complete a task after 10 PM.', category: 'Special',
        icon: Moon, color: 'text-periwinkle fill-periwinkle/20 bg-periwinkle',
        isUnlocked: hasNightTask, progressText: hasNightTask ? 'Unlocked' : 'Incomplete'
      }
    ];

    // Attempt to calculate unlockedAt by finding the date requirement was met.
    // For simplicity, we just use the most recent task completion date as a proxy for when it was unlocked,
    // or just leave it blank if not perfectly trackable historically without an event log.
    // We'll set a generic unlockedAt based on the most recent completed task.
    const lastCompletedAt = completedTasksList.length > 0 
      ? new Date(completedTasksList[completedTasksList.length - 1].completedAt as string) 
      : new Date();

    return badges.map(b => ({
      ...b,
      unlockedAt: b.isUnlocked ? lastCompletedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : undefined
    }));
  }, [tasks, streak, roadmap]);
};
