import React, { useState } from 'react';
import { Participant, AppMode } from './types';
import { NAV_ITEMS } from './constants';
import Header from './components/Header';
import DataInput from './components/DataInput';
import Lottery from './components/Lottery';
import Grouping from './components/Grouping';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.INPUT);

  const renderContent = () => {
    switch (activeMode) {
      case AppMode.INPUT:
        return <DataInput participants={participants} setParticipants={setParticipants} />;
      case AppMode.LOTTERY:
        return <Lottery participants={participants} />;
      case AppMode.GROUPING:
        return <Grouping participants={participants} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {NAV_ITEMS.map((item) => {
              const isActive = activeMode === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMode(item.id)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${isActive 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }
                  `}
                >
                  <Icon className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}
                  `} />
                  {item.label}
                  {item.id === AppMode.INPUT && participants.length > 0 && (
                    <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
                      {participants.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} TeamSync HR. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;