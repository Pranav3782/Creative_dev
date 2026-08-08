import React, { useState } from 'react';
import type { Level } from '../../data/roadmap';
import { useProgress } from '../../context/ProgressContext';
import { X, Check, FileText, Code, Bookmark, Share2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  url: string;
}

export const LevelDetailPanel = ({ level, onClose }: { level: Level, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'project' | 'notes' | 'resources'>('tasks');
  const { toggleTask } = useProgress();

  const completedTasksCount = level.tasks.filter(t => t.completed).length;
  const progress = Math.round((completedTasksCount / level.tasks.length) * 100);

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem(`creative-resources-${level.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', url: '' });
  const [resourceError, setResourceError] = useState('');

  const saveResource = () => {
    if (!newResource.title.trim() || !newResource.url.trim()) {
      setResourceError('Title and URL are required.');
      return;
    }
    try {
      new URL(newResource.url);
    } catch {
      setResourceError('Please enter a valid URL (e.g. https://example.com).');
      return;
    }
    const updated = [...resources, { ...newResource, id: Date.now().toString() }];
    setResources(updated);
    localStorage.setItem(`creative-resources-${level.id}`, JSON.stringify(updated));
    setNewResource({ title: '', url: '' });
    setShowResourceForm(false);
    setResourceError('');
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 50, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="bg-paper border-t-3 md:border-3 border-ink rounded-t-3xl md:rounded-3xl w-full max-w-3xl max-h-[85vh] md:max-h-[90vh] overflow-hidden flex flex-col shadow-editorial"
        >
          {/* Header */}
          <div className="bg-cream border-b-3 border-ink p-6 md:p-8 flex items-start justify-between relative">
            <div>
              <span className="inline-block px-3 py-1 bg-yellow border-2 border-ink rounded-full text-xs font-bold mb-3 shadow-[2px_2px_0_#211C1B]">
                Level {level.id}
              </span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-ink leading-tight mb-2">
                {level.title}
              </h2>
              <p className="text-text-muted font-medium max-w-xl">{level.description}</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center bg-paper hover:bg-coral hover:text-paper transition-colors absolute top-6 right-6"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-ink/10 border-b-3 border-ink relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-lime border-r-3 border-ink"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b-3 border-ink bg-cream overflow-x-auto">
            <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={<Check size={16} />} label="Missions" />
            <TabButton active={activeTab === 'project'} onClick={() => setActiveTab('project')} icon={<Code size={16} />} label="Project" />
            <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<FileText size={16} />} label="Notes" />
            <TabButton active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon={<Bookmark size={16} />} label="Resources" />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-paper">
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-2xl mb-6">Level Missions</h3>
                {level.tasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`group flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      task.completed ? 'bg-lime/10 border-lime' : 'bg-cream border-ink hover:bg-white hover:-translate-y-1 hover:shadow-editorial-sm'
                    }`}
                  >
                    <div className="pt-1">
                      <input type="checkbox" className="editorial-checkbox" checked={task.completed} onChange={() => {}} onClick={e => e.stopPropagation()} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg leading-tight transition-colors ${task.completed ? 'line-through text-ink/50' : 'text-ink'}`}>
                        {task.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'project' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-2xl mb-2">Capstone Project</h3>
                <div className="editorial-card bg-periwinkle/20 border-periwinkle text-ink p-6">
                  <h4 className="font-bold text-xl mb-2">{level.project}</h4>
                  <p className="text-ink/80 mb-6">
                    Synthesize everything you've learned in this level by building this capstone project from scratch. Do not just copy a tutorial—apply the concepts to your own design.
                  </p>
                  <button className="editorial-btn-primary flex items-center gap-2">
                    <Share2 size={16} />
                    <span>Submit Project</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4 h-full flex flex-col">
                <h3 className="font-display font-bold text-2xl mb-2">Personal Notes</h3>
                <textarea 
                  className="w-full flex-1 min-h-[200px] p-4 bg-cream border-3 border-ink rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-coral/20 font-medium"
                  placeholder="What did you learn? What was difficult? Write your thoughts here..."
                  defaultValue={localStorage.getItem(`notes-level-${level.id}`) || ''}
                  onChange={(e) => localStorage.setItem(`notes-level-${level.id}`, e.target.value)}
                />
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-2xl">Saved Resources</h3>
                  {!showResourceForm && (
                    <button 
                      onClick={() => setShowResourceForm(true)}
                      className="editorial-btn-secondary text-sm px-4 py-2"
                    >
                      Add Link
                    </button>
                  )}
                </div>
                
                {showResourceForm && (
                  <div className="bg-cream border-3 border-ink rounded-xl p-6 shadow-[4px_4px_0_#211C1B]">
                    <h4 className="font-bold text-lg mb-4">Add Resource</h4>
                    {resourceError && (
                      <p className="text-coral font-bold text-sm mb-3">{resourceError}</p>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-ink/70 mb-1">Resource Title</label>
                        <input 
                          type="text" 
                          className="w-full bg-paper border-2 border-ink p-3 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-yellow/50"
                          placeholder="e.g. JavaScript Animation Docs"
                          value={newResource.title}
                          onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-ink/70 mb-1">URL</label>
                        <input 
                          type="url" 
                          className="w-full bg-paper border-2 border-ink p-3 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-yellow/50"
                          placeholder="https://..."
                          value={newResource.url}
                          onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <button 
                          onClick={() => {
                            setShowResourceForm(false);
                            setResourceError('');
                          }} 
                          className="px-4 py-2 font-bold text-ink/60 hover:text-ink transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={saveResource} 
                          className="editorial-btn-primary px-6 py-2"
                        >
                          Save Link
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {resources.length === 0 && !showResourceForm ? (
                  <div className="text-center py-12 border-3 border-dashed border-ink/20 rounded-xl bg-cream/50">
                    <Bookmark size={32} className="mx-auto text-ink/30 mb-3" />
                    <p className="font-bold text-ink/60">No resources saved yet.</p>
                    <p className="text-sm text-ink/40">Save tutorials, docs, or inspiration links here.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {resources.map(res => (
                      <a 
                        key={res.id} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 bg-paper border-2 border-ink rounded-xl hover:-translate-y-1 hover:shadow-editorial-sm transition-all"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 shrink-0 bg-periwinkle/30 border-2 border-periwinkle rounded-lg flex items-center justify-center text-ink group-hover:bg-periwinkle transition-colors">
                            <Bookmark size={18} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-lg truncate group-hover:text-periwinkle transition-colors">{res.title}</h4>
                            <p className="text-xs text-text-muted truncate">{res.url}</p>
                          </div>
                        </div>
                        <ExternalLink size={20} className="text-ink/30 group-hover:text-ink shrink-0 ml-4 transition-colors" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 border-r-3 border-ink last:border-r-0 font-bold transition-colors
    ${active ? 'bg-paper text-ink border-b-0' : 'bg-cream text-text-muted hover:bg-paper/50 border-b-3'}
  `}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);
