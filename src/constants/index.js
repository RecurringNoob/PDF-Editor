import { 
  MousePointer, Type, Pen, Highlighter, Square, 
  Circle, ArrowRight 
} from 'lucide-react';

export const TOOLS = [
  { id: 'select', icon: MousePointer, label: 'Select', cursor: 'default' },
  { id: 'text', icon: Type, label: 'Text', cursor: 'text' },
  { id: 'draw', icon: Pen, label: 'Draw', cursor: 'crosshair' },
  { id: 'highlight', icon: Highlighter, label: 'Highlight', cursor: 'crosshair' },
  { id: 'rectangle', icon: Square, label: 'Rectangle', cursor: 'crosshair' },
  { id: 'circle', icon: Circle, label: 'Circle', cursor: 'crosshair' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow', cursor: 'crosshair' },
];

export const DEFAULT_COLORS = [
  '#000000', // Black
  '#ef4444', // Red
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#eab308', // Yellow
];

export const SCALE_LIMITS = {
  MIN: 0.5,
  MAX: 3.0,
  STEP: 0.1,
};

export const STROKE_WIDTH_LIMITS = {
  MIN: 1,
  MAX: 20,
  DEFAULT: 3,
};

export const FONT_SIZE_LIMITS = {
  MIN: 8,
  MAX: 48,
  DEFAULT: 16,
};

export const OPACITY_LIMITS = {
  MIN: 10,
  MAX: 100,
  DEFAULT: 100,
};

export const PDF_JS_CONFIG = {
  SCRIPT_URL: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  WORKER_URL: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
};

export const JSPDF_CONFIG = {
  SCRIPT_URL: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
};

export const HIT_DETECTION_TOLERANCE = 10;

export const ARROW_HEAD_LENGTH = 15;

export const HIGHLIGHT_HEIGHT_MULTIPLIER = 4;