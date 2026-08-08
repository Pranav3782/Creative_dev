import type { Level } from '../../data/roadmap';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

export const RoadmapNode = ({ level, onClick }: { level: Level, onClick?: () => void }) => {
  const Icon = (LucideIcons as any)[level.icon] || LucideIcons.Circle;
  
  const completedTasks = level.tasks.filter(t => t.completed).length;
  const progress = Math.round((completedTasks / level.tasks.length) * 100);

  const isCompleted = level.status === 'completed';
  const isActive = level.status === 'active';
  const isLocked = level.status === 'locked';

  // Node styles based on status
  let nodeStyle = "node-locked";
  let iconBg = "bg-ink/10";
  let iconColor = "text-ink/40";
  
  if (isCompleted) {
    nodeStyle = "node-completed hover:shadow-editorial-sm hover:-translate-y-[2px] transition-all cursor-pointer";
    iconBg = "bg-lime border-ink border-2";
    iconColor = "text-ink";
  } else if (isActive) {
    nodeStyle = "node-active cursor-pointer";
    iconBg = "bg-coral border-ink border-2";
    iconColor = "text-paper";
  }

  return (
    <motion.div 
      onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative editorial-card p-6 w-full max-w-sm ${nodeStyle}`}
    >
      {/* Node Connector (visual line pointing to the central path) */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-12 md:-left-auto md:-right-12 md:left-auto w-12 border-t-[4px] border-ink/20 border-dashed hidden md:block" />
      <div className="absolute top-1/2 -translate-y-1/2 -left-12 w-12 border-t-[4px] border-ink/20 border-dashed block md:hidden" />

      {/* Decorative badge for level number */}
      <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-full border-3 border-ink flex items-center justify-center font-display font-black text-lg shadow-[2px_2px_0_#211C1B] ${isActive ? 'bg-yellow text-ink' : isCompleted ? 'bg-lime text-ink' : 'bg-cream text-ink/40 border-ink/40 shadow-none'}`}>
        {level.id}
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${iconBg} transition-colors`}>
          <Icon size={28} className={iconColor} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className={`font-display font-black text-xl leading-tight ${isLocked ? 'text-ink/50' : 'text-ink'}`}>
            {level.title}
          </h3>
          <p className={`text-xs font-bold mt-1 ${isLocked ? 'text-ink/30' : 'text-text-muted'}`}>
            {level.duration}
          </p>
        </div>
      </div>

      <p className={`text-sm mb-6 ${isLocked ? 'text-ink/40' : 'text-ink'}`}>
        {level.description}
      </p>

      {/* Progress indicator */}
      {!isLocked && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-ink">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-ink/10 rounded-full overflow-hidden border border-ink/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full ${isCompleted ? 'bg-lime' : 'bg-coral'}`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
