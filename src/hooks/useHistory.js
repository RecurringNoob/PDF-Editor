import { useState, useCallback } from 'react';

/**
 * Custom hook for undo/redo functionality
 */
export const useHistory = (maxHistorySize = 50) => {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  /**
   * Save current state to history
   */
  const saveState = useCallback((state) => {
    setUndoStack(prev => {
      const newStack = [...prev, state];
      // Limit history size
      if (newStack.length > maxHistorySize) {
        return newStack.slice(newStack.length - maxHistorySize);
      }
      return newStack;
    });
    setRedoStack([]); // Clear redo stack when new action is performed
  }, [maxHistorySize]);

  /**
   * Undo last action
   */
  const undo = useCallback((currentState) => {
    if (undoStack.length === 0) return null;

    const previousState = undoStack[undoStack.length - 1];
    
    setRedoStack(prev => [currentState, ...prev]);
    setUndoStack(prev => prev.slice(0, -1));
    
    return previousState;
  }, [undoStack]);

  /**
   * Redo last undone action
   */
  const redo = useCallback(() => {
    if (redoStack.length === 0) return null;

    const nextState = redoStack[0];
    
    setUndoStack(prev => [...prev, nextState]);
    setRedoStack(prev => prev.slice(1));
    
    return nextState;
  }, [redoStack]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  /**
   * Check if undo is available
   */
  const canUndo = undoStack.length > 0;

  /**
   * Check if redo is available
   */
  const canRedo = redoStack.length > 0;

  return {
    // State
    canUndo,
    canRedo,
    
    // Actions
    saveState,
    undo,
    redo,
    clearHistory,
  };
};