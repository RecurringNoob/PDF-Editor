import React from 'react';
import { FileText, ZoomIn, ZoomOut, Download, Image as ImageIcon } from 'lucide-react';

const Header = ({ 
  scale, 
  onZoomIn, 
  onZoomOut, 
  onDownloadImage, 
  onDownloadPDF,
  disabled = false 
}) => {
  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-600 rounded-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">PDF Editor Pro</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="bg-gray-700 rounded-lg p-1 flex items-center space-x-1">
          <button 
            onClick={onZoomOut}
            disabled={disabled}
            className="p-1.5 hover:bg-gray-600 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
          <button 
            onClick={onZoomIn}
            disabled={disabled}
            className="p-1.5 hover:bg-gray-600 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-700" />

        <button 
          onClick={onDownloadImage}
          disabled={disabled}
          className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Save IMG</span>
        </button>
        
        <button 
          onClick={onDownloadPDF}
          disabled={disabled}
          className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-blue-900/50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>
    </header>
  );
};

export default Header;