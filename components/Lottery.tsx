import React, { useState, useEffect, useRef } from 'react';
import { Participant, Winner } from '../types';
import { Trophy, RefreshCw, Settings2, History, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LotteryProps {
  participants: Participant[];
}

const Lottery: React.FC<LotteryProps> = ({ participants }) => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<string>("Ready?");
  const [error, setError] = useState<string | null>(null);
  
  const intervalRef = useRef<number | null>(null);

  const getEligibleParticipants = () => {
    if (allowRepeats) return participants;
    const winnerIds = new Set(winners.map(w => w.participant.id));
    return participants.filter(p => !winnerIds.has(p.id));
  };

  const handleDrawToggle = () => {
    if (isSpinning) {
      stopDraw();
    } else {
      startDraw();
    }
  };

  const startDraw = () => {
    const eligible = getEligibleParticipants();
    if (eligible.length === 0) {
      setError("No eligible participants left!");
      return;
    }
    setError(null);
    setIsSpinning(true);

    // clear any previous interval just in case
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Rapid rolling effect (50ms)
    intervalRef.current = window.setInterval(() => {
      const randomIdx = Math.floor(Math.random() * eligible.length);
      setCurrentDisplay(eligible[randomIdx].name);
    }, 50);
  };

  const stopDraw = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const eligible = getEligibleParticipants();
    if (eligible.length === 0) return; // Should not happen if started correctly

    const finalIdx = Math.floor(Math.random() * eligible.length);
    const winner = eligible[finalIdx];
    
    setCurrentDisplay(winner.name);
    setIsSpinning(false);
    
    setWinners(prev => [{
      participant: winner,
      timestamp: new Date()
    }, ...prev]);
  };

  const clearHistory = () => {
    if(confirm("Clear winner history?")) {
      setWinners([]);
      setCurrentDisplay("Ready?");
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const eligibleCount = getEligibleParticipants().length;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Draw Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden relative min-h-[450px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-white to-indigo-50/50">
            <div className="absolute top-4 left-4 text-sm font-medium text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-slate-200 backdrop-blur-sm">
              Pool Size: {eligibleCount}
            </div>

            {/* Fixed height container to prevent layout shifts */}
            <div className="h-48 flex items-center justify-center w-full max-w-2xl px-4">
              <motion.div
                key={currentDisplay} // re-renders on change to trigger animation
                initial={isSpinning ? undefined : { scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-5xl md:text-7xl font-bold tracking-tight break-words w-full leading-tight ${
                  isSpinning ? 'text-slate-400 blur-[0.5px]' : 'text-indigo-600'
                }`}
              >
                {currentDisplay}
              </motion.div>
            </div>

            {!isSpinning && winners.length > 0 && currentDisplay === winners[0].participant.name && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-[65%]"
              >
                <div className="text-xl text-yellow-500 font-bold flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Winner!
                </div>
              </motion.div>
            )}
            
            <div className="mt-8">
               <button
                onClick={handleDrawToggle}
                disabled={!isSpinning && eligibleCount === 0}
                className={`
                  relative overflow-hidden group px-12 py-4 rounded-full text-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none min-w-[200px] flex items-center justify-center gap-2
                  ${isSpinning 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  }
                `}
              >
                {isSpinning ? (
                  <>
                    <Pause className="w-6 h-6 fill-current" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span>Start</span>
                  </>
                )}
              </button>
            </div>

             {error && (
                <p className="absolute bottom-4 text-red-500 font-medium animate-pulse">{error}</p>
             )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Settings2 className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-700">Settings</span>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={allowRepeats} 
                    onChange={(e) => setAllowRepeats(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  Allow Repeat Winners
                </label>
              </div>
            </div>
            
            <button 
              onClick={() => { setWinners([]); setCurrentDisplay("Ready?"); setError(null); setIsSpinning(false); }}
              className="text-sm text-slate-500 hover:text-slate-800 underline"
            >
              Reset Session
            </button>
          </div>
        </div>

        {/* Sidebar - History */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <History className="w-5 h-5 text-indigo-500" />
              Draw History
            </div>
            <button onClick={clearHistory} className="p-1 hover:bg-slate-200 rounded text-slate-400">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <AnimatePresence>
              {winners.length === 0 ? (
                <div className="text-center text-slate-400 mt-10">
                  <p>No winners yet.</p>
                </div>
              ) : (
                winners.map((w, i) => (
                  <motion.div
                    key={`${w.participant.id}-${w.timestamp.getTime()}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-indigo-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      #{winners.length - i}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{w.participant.name}</div>
                      <div className="text-xs text-slate-400">
                        {w.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Lottery;