
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadges, type Badge } from '../../hooks/useBadges';
import { X, Lock } from 'lucide-react';

export const BadgeCollection = () => {
  const allBadges = useBadges();
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Show a subset on the main card (e.g. first 8 unlocked, or a mix)
  const unlockedBadges = allBadges.filter(b => b.isUnlocked);
  const displayBadges = unlockedBadges.length >= 8 
    ? unlockedBadges.slice(0, 8) 
    : [...unlockedBadges, ...allBadges.filter(b => !b.isUnlocked)].slice(0, 8);

  const BadgeItem = ({ badge }: { badge: Badge }) => {
    const isUnlocked = badge.isUnlocked;
    const Icon = badge.icon;
    return (
      <div 
        className="group relative flex flex-col items-center cursor-pointer"
        onClick={() => setSelectedBadge(badge)}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-ink flex items-center justify-center transition-all ${
            isUnlocked ? `${badge.color} shadow-[2px_2px_0_#211C1B]` : 'bg-cream text-ink/20 opacity-50 grayscale'
          }`}
        >
          <Icon size={24} className={isUnlocked ? 'text-ink' : ''} />
        </motion.div>
      </div>
    );
  };

  return (
    <>
      <div className="editorial-card bg-paper w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-2xl">Your Badges</h3>
          <span className="text-text-muted text-sm font-bold">
            {unlockedBadges.length} / {allBadges.length}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {displayBadges.map(badge => <BadgeItem key={badge.id} badge={badge} />)}
        </div>
        <button 
          onClick={() => setIsLibraryOpen(true)}
          className="editorial-btn-secondary w-full flex items-center justify-center gap-2 py-2"
        >
          View More →
        </button>
      </div>

      {/* Full Badge Library Modal */}
      <AnimatePresence>
        {isLibraryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsLibraryOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-cream border-4 border-ink rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-editorial overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b-3 border-ink bg-paper flex items-center justify-between shrink-0">
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-ink uppercase">Badge Library</h2>
                  <p className="text-text-muted font-bold text-sm">{unlockedBadges.length} of {allBadges.length} Earned</p>
                </div>
                <button 
                  onClick={() => setIsLibraryOpen(false)}
                  className="w-10 h-10 bg-cream border-2 border-ink rounded-full flex items-center justify-center hover:bg-coral hover:text-paper transition-colors shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                <div className="mb-8">
                  <h3 className="font-display font-black text-xl mb-4 text-ink border-b-2 border-ink/10 pb-2">Earned Badges</h3>
                  {unlockedBadges.length === 0 ? (
                    <p className="text-text-muted font-bold">No badges earned yet. Keep building!</p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 sm:gap-6">
                      {unlockedBadges.map(b => <BadgeItem key={b.id} badge={b} />)}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-display font-black text-xl mb-4 text-ink border-b-2 border-ink/10 pb-2">Locked Badges</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 sm:gap-6">
                    {allBadges.filter(b => !b.isUnlocked).map(b => <BadgeItem key={b.id} badge={b} />)}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Details Popover */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/20 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-paper border-3 border-ink rounded-xl p-5 max-w-xs w-full shadow-editorial flex flex-col items-center text-center relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedBadge(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-ink/10 transition-colors"
              >
                <X size={16} className="text-ink" />
              </button>
              
              <div className={`w-16 h-16 rounded-full border-3 border-ink flex items-center justify-center mb-4 ${
                selectedBadge.isUnlocked ? `${selectedBadge.color} shadow-[2px_2px_0_#211C1B]` : 'bg-cream text-ink/30'
              }`}>
                {selectedBadge.isUnlocked ? (
                  <selectedBadge.icon size={28} className="text-ink" />
                ) : (
                  <Lock size={28} className="text-ink/30" />
                )}
              </div>
              
              <h4 className="font-display font-black text-xl uppercase text-ink flex items-center gap-2">
                {selectedBadge.isUnlocked ? '🔥' : '🔒'} {selectedBadge.name}
              </h4>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                {selectedBadge.category}
              </span>
              
              <p className="text-sm font-medium text-ink mb-4 leading-relaxed">
                {selectedBadge.desc}
              </p>

              <div className="w-full bg-cream border-2 border-ink rounded-lg p-3 text-left">
                {selectedBadge.isUnlocked ? (
                  <>
                    <div className="text-xs font-bold text-text-muted uppercase">Status</div>
                    <div className="text-sm font-bold text-lime mb-1">Unlocked</div>
                    <div className="text-xs font-bold text-text-muted uppercase">Unlocked On</div>
                    <div className="text-sm font-bold text-ink">{selectedBadge.unlockedAt}</div>
                  </>
                ) : (
                  <>
                    <div className="text-xs font-bold text-text-muted uppercase">Progress</div>
                    <div className="text-sm font-bold text-ink">{selectedBadge.progressText}</div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
