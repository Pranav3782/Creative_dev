import { useState } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { CelebrationProvider } from './context/CelebrationContext';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/dashboard/Hero';
import { DailyChecklist } from './components/dashboard/DailyChecklist';
import { ContributionGraph } from './components/dashboard/ContributionGraph';
import { BadgeCollection } from './components/dashboard/BadgeCollection';
import { RoadmapPath } from './components/roadmap/RoadmapPath';
import { CalendarView } from './components/dashboard/CalendarView';

function App() {
  const [currentView, setCurrentView] = useState<'roadmap' | 'calendar'>('roadmap');

  const handleContinueLearning = () => {
    setCurrentView('roadmap');
    setTimeout(() => {
      const el = document.getElementById('roadmap-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <CelebrationProvider>
      <ProgressProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar currentView={currentView} onViewChange={(view) => setCurrentView(view as 'roadmap' | 'calendar')} />
          <Hero onContinue={handleContinueLearning} />
          
          <main id="roadmap-section" className="flex-1 w-full max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
            {/* Main Layout Grid */}
            <div className="w-full flex flex-col lg:flex-row gap-12 items-start justify-center">
              
              {/* Left Column - Daily Focus & Gamification */}
              <div className="w-full lg:w-1/3 flex flex-col gap-8 lg:sticky lg:top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-12 custom-scrollbar">
                <DailyChecklist />
                <ContributionGraph />
                <BadgeCollection />
              </div>

              {/* Right Column - The Roadmap or Calendar */}
              <div className="w-full lg:w-2/3">
                {currentView === 'roadmap' ? (
                  <>
                    <div className="mb-12 text-center md:text-left">
                      <h2 className="font-display font-black text-4xl text-ink">The Path to Mastery</h2>
                      <p className="text-text-muted mt-2 font-medium">Follow the roadmap. Each step builds on the last.</p>
                    </div>
                    <RoadmapPath />
                  </>
                ) : (
                  <CalendarView />
                )}
              </div>

            </div>
          </main>

          <footer className="w-full bg-ink text-cream py-12 px-6 mt-24 border-t-4 border-yellow">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <div className="font-display font-black text-2xl tracking-tighter uppercase mb-4 md:mb-0 text-yellow">
                creative.dev
              </div>
              <p className="font-medium text-cream/70 text-sm text-center">
                "First make it work, then make it beautiful, then make it fast."
              </p>
            </div>
          </footer>
        </div>
      </ProgressProvider>
    </CelebrationProvider>
  );
}

export default App;
