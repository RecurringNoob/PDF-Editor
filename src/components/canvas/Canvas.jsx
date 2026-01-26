import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { getCanvasCoordinates } from '../../utils/geometry';
import { renderAnnotations, drawPreview } from '../../utils/rendering';
import TextInput from './TextInput';

const Canvas = ({
  // PDF state
  pdfDoc,
  isLoading,
  onFileUpload,
  onRenderPage,
  
  // Tool state
  currentTool,
  
  // Annotation state
  annotations,
  selectedAnnotationId,
  onAnnotationSelect,
  onAnnotationCreate,
  
  // Style
  currentStyle,
  
  // Canvas interaction
  onCanvasReady,
}) => {
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState([]);
  const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, text: '' });

  // Notify parent when canvases are ready
  useEffect(() => {
    if (canvasRef.current && overlayCanvasRef.current) {
      onCanvasReady?.(canvasRef.current, overlayCanvasRef.current);
    }
  }, [onCanvasReady]);

  // Render PDF page when it changes
  useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      onRenderPage(canvasRef.current).then((dimensions) => {
        if (dimensions && overlayCanvasRef.current) {
          overlayCanvasRef.current.width = dimensions.width;
          overlayCanvasRef.current.height = dimensions.height;
        }
      });
    }
  }, [pdfDoc, onRenderPage]);

  // Render annotations when they change
  useEffect(() => {
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d');
      // Note: annotations are already filtered by parent component
      renderAnnotations(ctx, annotations, 1, selectedAnnotationId);
    }
  }, [annotations, selectedAnnotationId]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    const coords = getCanvasCoordinates(e, overlayCanvasRef.current);

    if (currentTool === 'select') {
      onAnnotationSelect?.(coords);
      return;
    }

    if (currentTool === 'text') {
      setTextInput({ show: true, x: coords.x, y: coords.y, text: '' });
      return;
    }

    setIsDrawing(true);
    setStartPos(coords);
    setCurrentPos(coords);
    
    if (currentTool === 'draw' || currentTool === 'arrow') {
      setCurrentPath([coords]);
    }
  }, [currentTool, onAnnotationSelect]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing) return;
    
    const coords = getCanvasCoordinates(e, overlayCanvasRef.current);
    setCurrentPos(coords);
    
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderAnnotations(ctx, annotations, 1, selectedAnnotationId);
    
    // Draw preview
    if (currentTool === 'draw') {
      const newPath = [...currentPath, coords];
      setCurrentPath(newPath);
      drawPreview(ctx, currentTool, startPos, coords, newPath, currentStyle);
    } else {
      drawPreview(ctx, currentTool, startPos, coords, currentPath, currentStyle);
    }
  }, [isDrawing, currentTool, startPos, currentPath, annotations, selectedAnnotationId, currentStyle]);

  const handleMouseUp = useCallback((e) => {
    if (!isDrawing) return;
    
    const coords = getCanvasCoordinates(e, overlayCanvasRef.current);
    setIsDrawing(false);
    
    onAnnotationCreate?.(currentTool, startPos, coords, currentPath, currentStyle);
    setCurrentPath([]);
  }, [isDrawing, currentTool, startPos, currentPath, currentStyle, onAnnotationCreate]);

  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Text input handlers
  const handleTextSubmit = useCallback(() => {
    if (textInput.text.trim()) {
      onAnnotationCreate?.('text', { x: textInput.x, y: textInput.y }, null, null, {
        ...currentStyle,
        text: textInput.text
      });
    }
    setTextInput({ show: false, x: 0, y: 0, text: '' });
  }, [textInput, currentStyle, onAnnotationCreate]);

  const handleTextChange = useCallback((text) => {
    setTextInput(prev => ({ ...prev, text }));
  }, []);

  // File upload handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const cursor = currentTool === 'select' ? 'default' : 'crosshair';

  return (
    <main className="flex-1 bg-gray-900 overflow-auto relative flex justify-center p-8">
      <div 
        ref={containerRef}
        className={`relative shadow-2xl transition-all duration-300 ${!pdfDoc ? 'flex items-center justify-center' : ''}`}
        style={{ 
          width: pdfDoc ? 'auto' : '100%', 
          height: pdfDoc ? 'auto' : '100%',
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!pdfDoc && !isLoading ? (
          <div 
            className="text-center p-12 border-2 border-dashed border-gray-700 rounded-2xl hover:border-gray-500 transition-colors bg-gray-800/50 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">Drop your PDF here</h3>
            <p className="text-gray-500 mb-6">or click to browse files</p>
            <button className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors">
              Select File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="relative">
            <canvas ref={canvasRef} className="block bg-white shadow-lg" />
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-0 left-0"
              style={{ zIndex: 10, cursor }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            />
            
            {textInput.show && (
              <TextInput
                x={textInput.x}
                y={textInput.y}
                text={textInput.text}
                color={currentStyle.color}
                fontSize={currentStyle.fontSize}
                onChange={handleTextChange}
                onSubmit={handleTextSubmit}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Canvas;