import React from 'react';
import { Undo, Redo } from 'lucide-react';
import { TOOLS } from '../../constants';

const Toolbar = ({ 
  currentTool, 
  onToolChange, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo 
}) => {
  return (
    <aside className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-4 shrink-0 z-10">
      {TOOLS.map((tool) => (
        <div key={tool.id} className="relative group">
          <button
            onClick={() => onToolChange(tool.id)}
            className={`p-3 rounded-xl transition-all duration-200 ${
              currentTool === tool.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            aria-label={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
          
          {/* Tooltip */}
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {tool.label}
          </div>
        </div>
      ))}
      
      <div className="h-px w-8 bg-gray-700 my-2" />
      
      <button 
        onClick={onUndo} 
        disabled={!canUndo}
        className="p-3 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Undo"
      >
        <Undo className="w-5 h-5" />
      </button>
      
      <button 
        onClick={onRedo}
        disabled={!canRedo}
        className="p-3 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Redo"
      >
        <Redo className="w-5 h-5" />
      </button>
    </aside>
  );
};

export default Toolbar;