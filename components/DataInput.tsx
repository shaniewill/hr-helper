import React, { useState, useRef, useMemo } from 'react';
import { Upload, Trash2, UserPlus, FileText, AlertCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { Participant } from '../types';
import { parseNames, generateId } from '../utils/helpers';
import { SAMPLE_NAMES } from '../constants';

interface DataInputProps {
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
}

const DataInput: React.FC<DataInputProps> = ({ participants, setParticipants }) => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect duplicates
  const { duplicateIds, hasDuplicates } = useMemo(() => {
    const nameCounts = new Map<string, number>();
    const ids = new Set<string>();
    
    // Count occurrences (case-insensitive)
    participants.forEach(p => {
      const normalized = p.name.trim().toLowerCase();
      nameCounts.set(normalized, (nameCounts.get(normalized) || 0) + 1);
    });

    // Identify IDs belonging to duplicated names
    participants.forEach(p => {
      const normalized = p.name.trim().toLowerCase();
      if ((nameCounts.get(normalized) || 0) > 1) {
        ids.add(p.id);
      }
    });

    return { duplicateIds: ids, hasDuplicates: ids.size > 0 };
  }, [participants]);

  const handleManualAdd = () => {
    if (!inputText.trim()) return;
    const newParticipants = parseNames(inputText);
    setParticipants([...participants, ...newParticipants]);
    setInputText('');
    setError(null);
  };

  const handleLoadSample = () => {
    const newParticipants = parseNames(SAMPLE_NAMES.join('\n'));
    setParticipants([...participants, ...newParticipants]);
    setError(null);
  };

  const handleRemoveDuplicates = () => {
    const seen = new Set<string>();
    const uniqueParticipants = participants.filter(p => {
      const normalized = p.name.trim().toLowerCase();
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
    
    setParticipants(uniqueParticipants);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        // Simple CSV assumption: First column or just list of names
        // We'll treat it as text and split by newlines
        const newParticipants = parseNames(text);
        setParticipants([...participants, ...newParticipants]);
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const handleClear = () => {
    setParticipants([]);
  };

  const handleRemove = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Manage Participants</h2>
        <p className="text-slate-500">Import names to get started with the lottery or grouping.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
               <UserPlus className="w-5 h-5 text-indigo-600" />
               <h3 className="font-semibold text-slate-800">Add Names</h3>
            </div>
            <button 
              onClick={handleLoadSample}
              className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Load Sample
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Paste Names (One per line)</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm"
                placeholder="Alice Smith&#10;Bob Jones&#10;Charlie..."
              />
            </div>
            <button
              onClick={handleManualAdd}
              disabled={!inputText.trim()}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to List
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or import</span>
            </div>
          </div>

          <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 mb-1">Upload CSV / Text File</label>
             <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors text-slate-600 text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </label>
             </div>
             <p className="text-xs text-slate-400">Supported formats: .csv, .txt</p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* List Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800">Current List</h3>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {participants.length}
              </span>
            </div>
            
            <div className="flex gap-2">
              {hasDuplicates && (
                <button
                  onClick={handleRemoveDuplicates}
                  className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded transition-colors"
                  title="Remove duplicate names"
                >
                  <AlertTriangle className="w-3 h-3" />
                  Fix Dups
                </button>
              )}
              {participants.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mt-2 space-y-1 pr-1">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <UserPlus className="w-12 h-12 mb-3 opacity-20" />
                <p>No participants yet.</p>
                <p className="text-sm">Add names to view them here.</p>
              </div>
            ) : (
              participants.map((p, idx) => {
                const isDup = duplicateIds.has(p.id);
                return (
                  <div 
                    key={p.id} 
                    className={`group flex items-center justify-between p-2 rounded-lg border transition-all ${
                      isDup 
                        ? 'bg-orange-50 border-orange-200 hover:border-orange-300' 
                        : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono w-6 ${isDup ? 'text-orange-400' : 'text-slate-400'}`}>
                        {idx + 1}
                      </span>
                      <span className={`font-medium ${isDup ? 'text-orange-900' : 'text-slate-700'}`}>
                        {p.name}
                      </span>
                      {isDup && (
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${
                        isDup 
                          ? 'text-orange-400 hover:text-red-600 hover:bg-orange-100' 
                          : 'text-slate-400 hover:text-red-500'
                      }`}
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInput;