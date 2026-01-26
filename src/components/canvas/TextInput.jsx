import React, { useRef, useEffect } from 'react';

const TextInput = ({ x, y, text, color, fontSize, onChange, onSubmit }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    } else if (e.key === 'Escape') {
      onSubmit();
    }
  };

  return (
    <div 
      className="absolute z-50"
      style={{ left: x, top: y }}
    >
      <input
        ref={inputRef}
        type="text"
        className="bg-transparent border-b-2 border-blue-500 text-black outline-none min-w-[100px] px-1"
        style={{ 
          fontSize: `${fontSize}px`, 
          color: color,
          fontFamily: 'Arial'
        }}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSubmit}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TextInput;