import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/layout/Header';
import Toolbar from './components/layout/Toolbar';
import PropertiesPanel from './components/layout/PropertiesPanel';
import Canvas from './components/canvas/Canvas';
import { usePDF } from './hooks/usePDF';
import { useAnnotations } from './hooks/useAnnotations';
import { useHistory } from './hooks/useHistory';
import { useCanvasInteraction } from './hooks/useCanvasInteraction';
import { mergeCanvasLayers, downloadAsImage, downloadAsPDF } from './utils/pdf';
import { 
  DEFAULT_COLORS, 
  STROKE_WIDTH_LIMITS, 
  FONT_SIZE_LIMITS, 
  OPACITY_LIMITS 
} from './constants';

const App = () => {
  // PDF Management
  const {
    pdfDoc,
    currentPage,
    totalPages,
    scale,
    isLoading,
    isReady,
    loadFile,
    renderPage,
    nextPage,
    previousPage,
    zoomIn,
    zoomOut,
  } = usePDF();

  // Annotation Management
  const {
    annotations,
    selectedId,
    addAnnotation,
    deleteSelected,
    selectAnnotation,
    deselectAnnotation,
    getCurrentPageAnnotations,
    createFromDrawing,
    createTextAnnotation,
    setAnnotations,
  } = useAnnotations(currentPage);

  // History Management
  const {
    canUndo,
    canRedo,
    saveState,
    undo,
    redo,
  } = useHistory();

  // Canvas Interaction
  const {
    registerCanvases,
    findAnnotationAtPoint,
    getCanvases,
  } = useCanvasInteraction(annotations, currentPage);

  // UI State
  const [currentTool, setCurrentTool] = useState('select');
  const [showProperties, setShowProperties] = useState(true);

  // Style State
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[1]);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH_LIMITS.DEFAULT);
  const [fontSize, setFontSize] = useState(FONT_SIZE_LIMITS.DEFAULT);
  const [opacity, setOpacity] = useState(OPACITY_LIMITS.DEFAULT);

  // Current style object for annotations
  const currentStyle = {
    color: selectedColor,
    strokeWidth,
    fontSize,
    opacity,
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        handleDeleteSelected();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, canUndo, canRedo]);

  // Handlers
  const handleFileUpload = useCallback((file) => {
    loadFile(file);
    setAnnotations([]);
    deselectAnnotation();
  }, [loadFile, setAnnotations, deselectAnnotation]);

  const handleToolChange = useCallback((tool) => {
    setCurrentTool(tool);
    if (tool !== 'select') {
      deselectAnnotation();
    }
  }, [deselectAnnotation]);

  const handleAnnotationSelect = useCallback((coords) => {
    const annotation = findAnnotationAtPoint(coords.x, coords.y);
    if (annotation) {
      selectAnnotation(annotation.id);
    } else {
      deselectAnnotation();
    }
  }, [findAnnotationAtPoint, selectAnnotation, deselectAnnotation]);

  const handleAnnotationCreate = useCallback((tool, startPos, endPos, path, style) => {
    saveState(annotations);
    
    if (tool === 'text' && style.text) {
      createTextAnnotation(startPos.x, startPos.y, style.text, style);
    } else if (endPos) {
      createFromDrawing(tool, startPos, endPos, path, style);
    }
  }, [annotations, saveState, createFromDrawing, createTextAnnotation]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedId) {
      saveState(annotations);
      deleteSelected();
    }
  }, [selectedId, annotations, saveState, deleteSelected]);

  const handleUndo = useCallback(() => {
    const previousState = undo(annotations);
    if (previousState) {
      setAnnotations(previousState);
      deselectAnnotation();
    }
  }, [annotations, undo, setAnnotations, deselectAnnotation]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      saveState(annotations);
      setAnnotations(nextState);
      deselectAnnotation();
    }
  }, [annotations, redo, saveState, setAnnotations, deselectAnnotation]);

  const handleDownloadImage = useCallback(() => {
    const { pdf, overlay } = getCanvases();
    if (!pdf || !overlay) return;

    const merged = mergeCanvasLayers(pdf, overlay);
    downloadAsImage(merged, `page-${currentPage}.png`);
  }, [currentPage, getCanvases]);

  const handleDownloadPDF = useCallback(() => {
    const { pdf, overlay } = getCanvases();
    if (!pdf || !overlay) return;

    const merged = mergeCanvasLayers(pdf, overlay);
    downloadAsPDF(merged, `edited-page-${currentPage}.pdf`);
  }, [currentPage, getCanvases]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden font-sans">
      <Header
        scale={scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onDownloadImage={handleDownloadImage}
        onDownloadPDF={handleDownloadPDF}
        disabled={!pdfDoc}
      />

      <div className="flex flex-1 overflow-hidden">
        <Toolbar
          currentTool={currentTool}
          onToolChange={handleToolChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
        />

        <Canvas
          pdfDoc={pdfDoc}
          isLoading={isLoading}
          onFileUpload={handleFileUpload}
          onRenderPage={renderPage}
          currentTool={currentTool}
          annotations={getCurrentPageAnnotations()}
          selectedAnnotationId={selectedId}
          onAnnotationSelect={handleAnnotationSelect}
          onAnnotationCreate={handleAnnotationCreate}
          currentStyle={currentStyle}
          onCanvasReady={registerCanvases}
        />

        <PropertiesPanel
          showProperties={showProperties}
          onToggleProperties={() => setShowProperties(!showProperties)}
          hasSelection={!!selectedId}
          onDeleteSelection={handleDeleteSelected}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page < currentPage) previousPage();
            else if (page > currentPage) nextPage();
          }}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          opacity={opacity}
          onOpacityChange={setOpacity}
        />
      </div>
    </div>
  );
};

export default App;