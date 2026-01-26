import { useState, useEffect, useCallback } from 'react';
import { loadPDFScripts, loadPDFDocument, renderPDFPage } from '../utils/pdf';

/**
 * Custom hook for managing PDF document state and operations
 */
export const usePDF = () => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Load PDF.js and jsPDF libraries on mount
  useEffect(() => {
    const initializeLibraries = async () => {
      const result = await loadPDFScripts();
      if (result.success) {
        setIsReady(true);
      } else {
        setError('Failed to load PDF libraries');
      }
    };

    initializeLibraries();
  }, []);

  /**
   * Load a PDF file
   */
  const loadFile = useCallback(async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const pdf = await loadPDFDocument(file);
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Render current page to canvas
   */
  const renderPage = useCallback(async (canvas) => {
    if (!pdfDoc || !canvas || !isReady) return null;

    try {
      return await renderPDFPage(pdfDoc, currentPage, canvas, scale);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [pdfDoc, currentPage, scale, isReady]);

  /**
   * Navigate to next page
   */
  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  /**
   * Navigate to previous page
   */
  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((pageNumber) => {
    const page = Math.max(1, Math.min(totalPages, pageNumber));
    setCurrentPage(page);
  }, [totalPages]);

  /**
   * Zoom in
   */
  const zoomIn = useCallback((step = 0.1) => {
    setScale(prev => Math.min(3, prev + step));
  }, []);

  /**
   * Zoom out
   */
  const zoomOut = useCallback((step = 0.1) => {
    setScale(prev => Math.max(0.5, prev - step));
  }, []);

  /**
   * Set specific zoom level
   */
  const setZoom = useCallback((newScale) => {
    setScale(Math.max(0.5, Math.min(3, newScale)));
  }, []);

  /**
   * Reset document state
   */
  const reset = useCallback(() => {
    setPdfDoc(null);
    setCurrentPage(1);
    setTotalPages(0);
    setScale(1.0);
    setError(null);
  }, []);

  return {
    // State
    pdfDoc,
    currentPage,
    totalPages,
    scale,
    isLoading,
    error,
    isReady,
    
    // Actions
    loadFile,
    renderPage,
    nextPage,
    previousPage,
    goToPage,
    zoomIn,
    zoomOut,
    setZoom,
    reset,
  };
};