import { useState, useCallback } from 'react';
import { isPointInAnnotation } from '../utils/geometry';

/**
 * Custom hook for managing canvas interactions
 */
export const useCanvasInteraction = (annotations, currentPage) => {
  const [canvases, setCanvases] = useState({ pdf: null, overlay: null });

  /**
   * Register canvas references
   */
  const registerCanvases = useCallback((pdfCanvas, overlayCanvas) => {
    setCanvases({ pdf: pdfCanvas, overlay: overlayCanvas });
  }, []);

  /**
   * Find annotation at given coordinates
   */
  const findAnnotationAtPoint = useCallback((x, y) => {
    // Reverse to check top-most annotations first
    const pageAnnotations = annotations
      .filter(ann => ann.page === currentPage)
      .reverse();
    
    return pageAnnotations.find(ann => isPointInAnnotation(x, y, ann));
  }, [annotations, currentPage]);

  /**
   * Get both canvas references
   */
  const getCanvases = useCallback(() => {
    return canvases;
  }, [canvases]);

  return {
    registerCanvases,
    findAnnotationAtPoint,
    getCanvases,
  };
};