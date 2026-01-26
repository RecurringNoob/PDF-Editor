import React from 'react';

const ColorPicker = ({ selectedColor, onColorChange, presetColors = [] }) => {
  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-gray-400 uppercase">Stroke Color</label>
      <div className="grid grid-cols-5 gap-2">
        {presetColors.map(color => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
              selectedColor === color ? 'border-white scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
        <input 
          type="color" 
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 rounded-full cursor-pointer p-0 border-0 overflow-hidden"
          aria-label="Custom color picker"
        />
      </div>
    </div>
  );
};

export default ColorPicker;