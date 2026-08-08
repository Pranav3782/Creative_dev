import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = () => {
  const { streak, getOverallCompletion, roadmap } = useProgress();
  const activeLevel = roadmap.find(l => l.status === 'active') || roadmap[0];

  return (
    <div className="w-full bg-periwinkle border-b-3 border-ink p-8 md:p-12 lg:p-16 relative overflow-hidden">
      {/* Decorative Elements */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-12 -right-12 w-48 h-48 bg-yellow rounded-full border-3 border-ink opacity-80 mix-blend-multiply pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-32 w-16 h-16 bg-coral border-3 border-ink rotate-12 pointer-events-none"
      />
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-lime rounded-full border-2 border-ink pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-paper border-2 border-ink rounded-full px-4 py-1 mb-6 shadow-[2px_2px_0_#211C1B]">
            <Sparkles size={16} className="text-yellow fill-yellow" />
            <span className="font-bold text-sm tracking-wide uppercase">Day {streak || 1} • Keep Building</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black leading-[0.95] tracking-tight mb-6 text-ink drop-shadow-sm">
            Your Creative <br/> Journey Continues.
          </h1>
          
          <p className="text-lg font-medium text-ink/80 max-w-xl mb-8 leading-relaxed">
            You are currently on <span className="font-bold underline decoration-wavy decoration-coral underline-offset-4">{activeLevel.title}</span>. 
            Complete today's missions to maintain your streak and unlock the next level of your mastery.
          </p>

          <button className="editorial-btn-primary flex items-center gap-2 group">
            <span>Continue Roadmap</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Progress Visualizer */}
        <div className="editorial-card bg-paper w-full md:w-80 flex flex-col items-center text-center">
          <h3 className="font-display font-bold text-xl mb-6">Overall Progress</h3>
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" className="text-cream" />
              <motion.circle 
                cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" 
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * getOverallCompletion()) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-lime drop-shadow-sm" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="font-display font-black text-3xl">{getOverallCompletion()}%</span>
            </div>
          </div>
          <p className="text-sm font-bold text-text-muted">
            {roadmap.filter(l => l.status === 'completed').length} of {roadmap.length} levels completed
          </p>
        </div>
      </div>
    </div>
  );
};
