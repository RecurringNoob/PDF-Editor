import React from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { DEFAULT_COLORS } from '../../constants';
import ColorPicker from '../ui/ColorPicker';
import Slider from '../ui/Slider';
import PageNavigator from '../ui/PageNavigator';

const PropertiesPanel = ({
  // Display state
  showProperties,
  onToggleProperties,
  
  // Selection state
  hasSelection,
  onDeleteSelection,
  
  // Page navigation
  currentPage,
  totalPages,
  onPageChange,
  
  // Style properties
  selectedColor,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  fontSize,
  onFontSizeChange,
  opacity,
  onOpacityChange,
}) => {
  return (
    <aside className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col shrink-0 z-10">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="font-semibold">Properties</h2>
        <button onClick={onToggleProperties} aria-label="Toggle properties">
          <Settings className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
        </button>
      </div>

      {showProperties && (
        <div className="p-4 space-y-6 overflow-y-auto">
          
          {/* Selection Actions */}
          {hasSelection && (
            <div className="p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-blue-200">Selection Active</span>
                <button 
                  onClick={onDeleteSelection} 
                  className="text-red-400 hover:text-red-300 transition-colors"
                  aria-label="Delete selected annotation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400">Press 'Delete' to remove</p>
            </div>
          )}

          {/* Page Navigation */}
          {totalPages > 0 && (
            <PageNavigator
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}

          {/* Color Picker */}
          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={onColorChange}
            presetColors={DEFAULT_COLORS}
          />

          {/* Style Sliders */}
          <div className="space-y-4">
            <Slider
              label="Stroke Width"
              value={strokeWidth}
              onChange={onStrokeWidthChange}
              min={1}
              max={20}
              unit="px"
            />

            <Slider
              label="Font Size"
              value={fontSize}
              onChange={onFontSizeChange}
              min={8}
              max={48}
              unit="px"
            />

            <Slider
              label="Opacity"
              value={opacity}
              onChange={onOpacityChange}
              min={10}
              max={100}
              unit="%"
            />
          </div>

        </div>
      )}
    </aside>
  );
};

export default PropertiesPanel;