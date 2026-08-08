import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Zap } from 'lucide-react';

const BADGE_TYPES = [
  { id: 'first_blood', name: 'First Blood', desc: 'Complete your first task', icon: Zap, color: 'text-yellow fill-yellow/20 bg-yellow' },
  { id: 'streak_3', name: 'Hot Streak', desc: 'Reach a 3-day streak', icon: Star, color: 'text-coral fill-coral/20 bg-coral' },
  { id: 'level_1', name: 'Foundation', desc: 'Complete Level 1', icon: Shield, color: 'text-periwinkle fill-periwinkle/20 bg-periwinkle' },
  { id: 'master', name: 'Master', desc: 'Complete the roadmap', icon: Trophy, color: 'text-lime fill-lime/20 bg-lime' }
];

export const BadgeCollection = () => {
  const { streak, roadmap, tasks } = useProgress();
  
  // Simple unlock logic for prototype
  const completedTasks = tasks.filter(t => t.completed).length;
  const unlockedBadges = [
    completedTasks > 0 ? 'first_blood' : null,
    streak >= 3 ? 'streak_3' : null,
    roadmap[0].status === 'completed' ? 'level_1' : null,
  ].filter(Boolean);

  return (
    <div className="editorial-card bg-paper w-full">
      <h3 className="font-display font-bold text-2xl mb-6">Your Badges</h3>
      <div className="grid grid-cols-4 gap-4">
        {BADGE_TYPES.map((badge, i) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const Icon = badge.icon;
          
          return (
            <div key={badge.id} className="group relative flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-16 h-16 rounded-full border-3 border-ink flex items-center justify-center transition-all ${
                  isUnlocked ? `${badge.color} shadow-[2px_2px_0_#211C1B]` : 'bg-cream text-ink/20 opacity-50 grayscale'
                }`}
              >
                <Icon size={28} className={isUnlocked ? 'text-ink' : ''} />
              </motion.div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 w-max text-center">
                <div className="bg-ink text-cream px-3 py-2 rounded-lg shadow-editorial-sm border-2 border-transparent">
                  <p className="font-display font-bold text-sm text-yellow">{badge.name}</p>
                  <p className="text-xs">{badge.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
