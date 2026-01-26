import { HIT_DETECTION_TOLERANCE, ARROW_HEAD_LENGTH } from '../constants';

/**
 * Get canvas coordinates from mouse event
 */
export const getCanvasCoordinates = (e, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
};

/**
 * Check if a point is within an annotation's bounds
 */
export const isPointInAnnotation = (x, y, annotation) => {
  const tolerance = HIT_DETECTION_TOLERANCE;
  
  switch (annotation.type) {
    case 'rectangle':
    case 'highlight':
    case 'image':
      return (
        x >= annotation.x && 
        x <= annotation.x + annotation.width && 
        y >= annotation.y && 
        y <= annotation.y + annotation.height
      );
    
    case 'circle': {
      const dist = Math.sqrt(
        Math.pow(x - annotation.x, 2) + Math.pow(y - annotation.y, 2)
      );
      return dist <= annotation.radius + (annotation.strokeWidth / 2);
    }

    case 'text': {
      const estWidth = annotation.text.length * (annotation.fontSize * 0.6);
      const estHeight = annotation.fontSize;
      return (
        x >= annotation.x && 
        x <= annotation.x + estWidth && 
        y >= annotation.y - estHeight && 
        y <= annotation.y
      );
    }

    case 'draw':
    case 'arrow':
      return isPointNearPath(x, y, annotation.path, tolerance);

    default: 
      return false;
  }
};

/**
 * Check if a point is near any segment of a path
 */
const isPointNearPath = (x, y, path, tolerance) => {
  if (!path || path.length < 2) return false;

  // Bounding box check first for optimization
  const xs = path.map(p => p.x);
  const ys = path.map(p => p.y);
  const minX = Math.min(...xs) - tolerance;
  const maxX = Math.max(...xs) + tolerance;
  const minY = Math.min(...ys) - tolerance;
  const maxY = Math.max(...ys) + tolerance;
  
  if (x < minX || x > maxX || y < minY || y > maxY) return false;
  
  // Detailed segment check
  return path.some((point, i) => {
    if (i === 0) return false;
    const prev = path[i - 1];
    return distanceToSegment(x, y, prev.x, prev.y, point.x, point.y) < tolerance;
  });
};

/**
 * Calculate distance from point to line segment
 */
const distanceToSegment = (px, py, x1, y1, x2, y2) => {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;
  
  let xx, yy;
  if (param < 0) { 
    xx = x1; 
    yy = y1; 
  } else if (param > 1) { 
    xx = x2; 
    yy = y2; 
  } else { 
    xx = x1 + param * C; 
    yy = y1 + param * D; 
  }
  
  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Draw an arrow on canvas
 */
export const drawArrow = (ctx, fromX, fromY, toX, toY) => {
  const headLength = ARROW_HEAD_LENGTH;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6), 
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6), 
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
};

/**
 * Calculate distance between two points
 */
export const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};