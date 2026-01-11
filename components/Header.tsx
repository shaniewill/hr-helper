import React from 'react';
import { Briefcase } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">TeamSync HR</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Professional Event Tools</p>
          </div>
        </div>
        <div className="text-sm text-slate-500 hidden sm:block">
          Secure • Client-side Processing
        </div>
      </div>
    </header>
  );
};

export default Header;