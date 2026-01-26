import React from 'react';

const PageNavigator = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-400 uppercase">Navigation</label>
      <div className="flex items-center justify-between bg-gray-900 rounded-lg p-1">
        <button 
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className="p-2 hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          ←
        </button>
        <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
        <button 
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="p-2 hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default PageNavigator;