import { useState, useCallback } from 'react';
import { HIGHLIGHT_HEIGHT_MULTIPLIER } from '../constants';
import { calculateDistance } from '../utils/geometry';

/**
 * Custom hook for managing annotations
 */
export const useAnnotations = (currentPage) => {
  const [annotations, setAnnotations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  /**
   * Add a new annotation
   */
  const addAnnotation = useCallback((annotationData) => {
    const newAnnotation = {
      id: Date.now() + Math.random(), // Ensure uniqueness
      page: currentPage,
      ...annotationData
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    return newAnnotation.id;
  }, [currentPage]);

  /**
   * Update an existing annotation
   */
  const updateAnnotation = useCallback((id, updates) => {
    setAnnotations(prev => 
      prev.map(ann => ann.id === id ? { ...ann, ...updates } : ann)
    );
  }, []);

  /**
   * Delete an annotation
   */
  const deleteAnnotation = useCallback((id) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  }, [selectedId]);

  /**
   * Delete selected annotation
   */
  const deleteSelected = useCallback(() => {
    if (selectedId) {
      deleteAnnotation(selectedId);
    }
  }, [selectedId, deleteAnnotation]);

  /**
   * Get annotations for current page
   */
  const getCurrentPageAnnotations = useCallback(() => {
    return annotations.filter(ann => ann.page === currentPage);
  }, [annotations, currentPage]);

  /**
   * Clear all annotations
   */
  const clearAll = useCallback(() => {
    setAnnotations([]);
    setSelectedId(null);
  }, []);

  /**
   * Clear annotations for current page
   */
  const clearCurrentPage = useCallback(() => {
    setAnnotations(prev => prev.filter(ann => ann.page !== currentPage));
    setSelectedId(null);
  }, [currentPage]);

  /**
   * Select annotation
   */
  const selectAnnotation = useCallback((id) => {
    setSelectedId(id);
  }, []);

  /**
   * Deselect annotation
   */
  const deselectAnnotation = useCallback(() => {
    setSelectedId(null);
  }, []);

  /**
   * Get selected annotation
   */
  const getSelected = useCallback(() => {
    return annotations.find(ann => ann.id === selectedId);
  }, [annotations, selectedId]);

  /**
   * Create annotation from drawing data
   */
  const createFromDrawing = useCallback((tool, startPos, endPos, currentPath, style) => {
    const baseData = {
      color: style.color,
      strokeWidth: style.strokeWidth,
      opacity: style.opacity,
      type: tool
    };

    switch (tool) {
      case 'draw':
        return addAnnotation({
          ...baseData,
          path: [...currentPath, endPos]
        });

      case 'rectangle':
        return addAnnotation({
          ...baseData,
          x: startPos.x,
          y: startPos.y,
          width: endPos.x - startPos.x,
          height: endPos.y - startPos.y
        });

      case 'circle': {
        const radius = calculateDistance(startPos.x, startPos.y, endPos.x, endPos.y);
        return addAnnotation({
          ...baseData,
          x: startPos.x,
          y: startPos.y,
          radius
        });
      }

      case 'arrow':
        return addAnnotation({
          ...baseData,
          startX: startPos.x,
          startY: startPos.y,
          endX: endPos.x,
          endY: endPos.y,
          path: [startPos, endPos] // For hit detection
        });

      case 'highlight':
        return addAnnotation({
          ...baseData,
          x: startPos.x,
          y: startPos.y,
          width: endPos.x - startPos.x,
          height: style.strokeWidth * HIGHLIGHT_HEIGHT_MULTIPLIER
        });

      default:
        return null;
    }
  }, [addAnnotation]);

  /**
   * Create text annotation
   */
  const createTextAnnotation = useCallback((x, y, text, style) => {
    if (!text.trim()) return null;
    
    return addAnnotation({
      type: 'text',
      x,
      y,
      text,
      color: style.color,
      fontSize: style.fontSize,
      opacity: style.opacity
    });
  }, [addAnnotation]);

  return {
    // State
    annotations,
    selectedId,
    
    // Actions
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    deleteSelected,
    clearAll,
    clearCurrentPage,
    selectAnnotation,
    deselectAnnotation,
    getSelected,
    getCurrentPageAnnotations,
    createFromDrawing,
    createTextAnnotation,
    
    // Raw setters (for undo/redo)
    setAnnotations,
    setSelectedId,
  };
};