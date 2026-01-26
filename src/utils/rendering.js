import { drawArrow } from './geometry';

/**
 * Draw all annotations on a canvas context
 */
export const renderAnnotations = (ctx, annotations, currentPage, selectedId = null) => {
  if (!ctx) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  annotations
    .filter(ann => ann.page === currentPage)
    .forEach(ann => {
      renderAnnotation(ctx, ann, ann.id === selectedId);
    });
};

/**
 * Render a single annotation
 */
const renderAnnotation = (ctx, annotation, isSelected = false) => {
  ctx.save();
  
  // Apply annotation styles
  ctx.strokeStyle = annotation.color;
  ctx.fillStyle = annotation.color;
  ctx.lineWidth = annotation.strokeWidth;
  ctx.globalAlpha = annotation.opacity / 100;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Add selection highlight
  if (isSelected) {
    ctx.shadowColor = '#00bfff';
    ctx.shadowBlur = 10;
    ctx.lineWidth = annotation.strokeWidth + 2;
  }

  // Render based on type
  switch (annotation.type) {
    case 'draw':
      renderDrawPath(ctx, annotation);
      break;
    case 'rectangle':
      renderRectangle(ctx, annotation);
      break;
    case 'circle':
      renderCircle(ctx, annotation);
      break;
    case 'arrow':
      renderArrowAnnotation(ctx, annotation);
      break;
    case 'highlight':
      renderHighlight(ctx, annotation);
      break;
    case 'text':
      renderText(ctx, annotation, isSelected);
      break;
    default:
      break;
  }

  ctx.restore();
};

/**
 * Render a freehand drawing path
 */
const renderDrawPath = (ctx, annotation) => {
  if (!annotation.path || annotation.path.length < 2) return;
  
  ctx.beginPath();
  annotation.path.forEach((point, i) => {
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
};

/**
 * Render a rectangle
 */
const renderRectangle = (ctx, annotation) => {
  ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
};

/**
 * Render a circle
 */
const renderCircle = (ctx, annotation) => {
  ctx.beginPath();
  ctx.arc(annotation.x, annotation.y, annotation.radius, 0, 2 * Math.PI);
  ctx.stroke();
};

/**
 * Render an arrow
 */
const renderArrowAnnotation = (ctx, annotation) => {
  drawArrow(ctx, annotation.startX, annotation.startY, annotation.endX, annotation.endY);
};

/**
 * Render a highlight
 */
const renderHighlight = (ctx, annotation) => {
  const originalAlpha = ctx.globalAlpha;
  ctx.globalAlpha = 0.3;
  ctx.fillRect(annotation.x, annotation.y, annotation.width, annotation.height);
  ctx.globalAlpha = originalAlpha;
};

/**
 * Render text annotation
 */
const renderText = (ctx, annotation, isSelected) => {
  ctx.font = `${annotation.fontSize}px Arial`;
  ctx.fillText(annotation.text, annotation.x, annotation.y);
  
  // Add underline if selected
  if (isSelected) {
    const width = ctx.measureText(annotation.text).width;
    ctx.fillRect(annotation.x, annotation.y + 5, width, 2);
  }
};

/**
 * Draw preview of current drawing operation
 */
export const drawPreview = (ctx, tool, startPos, currentPos, currentPath, style) => {
  ctx.strokeStyle = style.color;
  ctx.fillStyle = style.color;
  ctx.lineWidth = style.strokeWidth;
  ctx.globalAlpha = style.opacity / 100;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (tool) {
    case 'draw':
      if (currentPath.length > 0) {
        ctx.beginPath();
        currentPath.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();
      }
      break;

    case 'rectangle':
      ctx.strokeRect(
        startPos.x, 
        startPos.y, 
        currentPos.x - startPos.x, 
        currentPos.y - startPos.y
      );
      break;

    case 'circle': {
      const radius = Math.sqrt(
        Math.pow(currentPos.x - startPos.x, 2) + 
        Math.pow(currentPos.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    }

    case 'arrow':
      drawArrow(ctx, startPos.x, startPos.y, currentPos.x, currentPos.y);
      break;

    case 'highlight':
      ctx.globalAlpha = 0.3;
      ctx.fillRect(
        startPos.x, 
        startPos.y, 
        currentPos.x - startPos.x, 
        style.strokeWidth * 4
      );
      break;

    default:
      break;
  }
};