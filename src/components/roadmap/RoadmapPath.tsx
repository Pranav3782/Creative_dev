import React, { useRef, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { RoadmapNode } from './RoadmapNode';
import { LevelDetailPanel } from './LevelDetailPanel';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import type { Level } from '../../data/roadmap';

export const RoadmapPath = () => {
  const { roadmap } = useProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  
  // Custom scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Find the live level object to ensure tasks are always up to date
  const selectedLevel = selectedLevelId !== null ? roadmap.find(l => l.id === selectedLevelId) : null;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto py-24 relative" ref={containerRef}>
        {/* Path SVG - A simple winding dashed line for the prototype */}
        <div className="absolute top-0 bottom-0 left-12 md:left-1/2 w-4 md:-ml-2 z-0">
          <div className="w-full h-full border-l-[6px] border-ink/10 border-dashed" />
          <motion.div 
            className="absolute top-0 left-0 w-full bg-lime border-l-[6px] border-lime origin-top"
            style={{ height: "100%", scaleY, zIndex: 1 }}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-24 md:gap-32">
          {roadmap.map((level, index) => {
            // Alternate sides on desktop
            const isLeft = index % 2 === 0;
            
            return (
              <div 
                key={level.id} 
                className={`flex w-full items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
              >
                {/* Spacer for desktop layout */}
                <div className="hidden md:block md:w-1/2" />
                
                {/* Node Content Container */}
                <div className={`w-full md:w-1/2 flex items-center pl-12 md:pl-0 ${isLeft ? 'md:pr-12 md:justify-end' : 'md:pl-12 md:justify-start'}`}>
                   <RoadmapNode level={level} index={index} onClick={() => setSelectedLevelId(level.id)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedLevel && (
        <LevelDetailPanel level={selectedLevel} onClose={() => setSelectedLevelId(null)} />
      )}
    </>
  );
};
