import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { shuffleArray, chunkArray } from '../utils/helpers';
import { COLORS } from '../constants';
import { Sparkles, Users, Download, Wand2 } from 'lucide-react';
import { generateTeamNames } from '../services/geminiService';
import { motion } from 'framer-motion';

interface GroupingProps {
  participants: Participant[];
}

const Grouping: React.FC<GroupingProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(5);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isNamingLoading, setIsNamingLoading] = useState(false);

  const handleGenerate = () => {
    if (participants.length === 0) return;
    
    // Logic: Shuffle then chunk
    const shuffled = shuffleArray<Participant>(participants);
    const chunks = chunkArray<Participant>(shuffled, groupSize);
    
    // Smart merge: Avoid small leftover groups
    // If the last group has <= half of the desired group size, merge its members into previous groups
    // Example: Size 5. Remainder 2 (2 <= 2.5). Merge.
    // Example: Size 2. Remainder 1 (1 <= 1). Merge.
    if (chunks.length > 1) {
      const lastChunk = chunks[chunks.length - 1];
      if (lastChunk.length <= groupSize / 2) {
        // Remove the last small group
        chunks.pop();
        
        // Distribute its members round-robin style to the remaining groups
        let targetIndex = 0;
        lastChunk.forEach(member => {
           chunks[targetIndex].push(member);
           targetIndex = (targetIndex + 1) % chunks.length;
        });
      }
    }
    
    const newGroups: Group[] = chunks.map((members, idx) => ({
      id: `group-${idx}`,
      name: `Group ${idx + 1}`,
      members
    }));

    setGroups(newGroups);
    setIsGenerated(true);
  };

  const handleAiNaming = async () => {
    setIsNamingLoading(true);
    try {
      const namesMap = await generateTeamNames(groups);
      
      const namedGroups = groups.map(g => ({
        ...g,
        name: namesMap[g.id] || g.name
      }));
      
      setGroups(namedGroups);
    } catch (e) {
      alert("Failed to generate names. Please ensure API Key is valid.");
    } finally {
      setIsNamingLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Group Name,Member Name\n"
      + groups.map(g => g.members.map(m => `"${g.name}","${m.name}"`).join("\n")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "groups_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (participants.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900">No participants found</h3>
        <p className="text-slate-500">Please go to the Data Source tab to add people.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
          <div className="space-y-4 flex-1">
             <h2 className="text-2xl font-bold text-slate-800">Automatic Grouping</h2>
             <div className="flex items-center gap-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">
                   People per Group
                 </label>
                 <input
                   type="number"
                   min="1"
                   max={participants.length}
                   value={groupSize}
                   onChange={(e) => setGroupSize(Number(e.target.value))}
                   className="block w-32 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                 />
               </div>
               <div className="text-sm text-slate-500 self-end mb-2">
                 Total: {participants.length} people • Approx. {Math.ceil(participants.length / groupSize)} groups
               </div>
             </div>
          </div>
          
          <div className="flex gap-3">
             <button
              onClick={handleGenerate}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Generate Groups
            </button>
            {isGenerated && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {isGenerated && (
        <div className="space-y-4">
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-700">Results</h3>
            <button
              onClick={handleAiNaming}
              disabled={isNamingLoading}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 ${isNamingLoading ? 'animate-spin' : ''}`} />
              {isNamingLoading ? 'Dreaming up names...' : 'AI Team Names'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groups.map((group, idx) => {
               const colorClass = COLORS[idx % COLORS.length];
               return (
                 <motion.div
                    key={group.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-xl border shadow-sm overflow-hidden bg-white flex flex-col`}
                 >
                    <div className={`px-4 py-3 font-bold border-b text-sm flex justify-between items-center ${colorClass}`}>
                      <span>{group.name}</span>
                      <span className="bg-white/50 px-2 py-0.5 rounded text-xs">
                        {group.members.length}
                      </span>
                    </div>
                    <div className="p-4 flex-1">
                      <ul className="space-y-2">
                        {group.members.map(member => (
                          <li key={member.id} className="text-sm text-slate-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {member.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                 </motion.div>
               );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Grouping;