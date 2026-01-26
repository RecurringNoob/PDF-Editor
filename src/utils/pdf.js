import { PDF_JS_CONFIG, JSPDF_CONFIG } from '../constants';

/**
 * Load external scripts required for PDF operations
 */
export const loadPDFScripts = async () => {
  const errors = [];

  try {
    // Load PDF.js
    if (!window.pdfjsLib) {
      await loadScript(PDF_JS_CONFIG.SCRIPT_URL);
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_JS_CONFIG.WORKER_URL;
    }

    // Load jsPDF
    if (!window.jspdf) {
      await loadScript(JSPDF_CONFIG.SCRIPT_URL);
    }

    return { success: true, errors: null };
  } catch (error) {
    errors.push(error.message);
    return { success: false, errors };
  }
};

/**
 * Load a script dynamically
 */
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

/**
 * Load a PDF file from File object
 */
export const loadPDFDocument = async (file) => {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('Invalid file type. Please upload a PDF file.');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = window.pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    return pdf;
  } catch (error) {
    throw new Error(`Failed to load PDF: ${error.message}`);
  }
};

/**
 * Render a PDF page to canvas
 */
export const renderPDFPage = async (pdf, pageNumber, canvas, scale) => {
  if (!pdf || !canvas) return;

  try {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    await page.render(renderContext).promise;
    
    return { width: viewport.width, height: viewport.height };
  } catch (error) {
    throw new Error(`Failed to render page: ${error.message}`);
  }
};

/**
 * Merge PDF canvas with annotations overlay
 */
export const mergeCanvasLayers = (pdfCanvas, overlayCanvas) => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = pdfCanvas.width;
  tempCanvas.height = pdfCanvas.height;
  const ctx = tempCanvas.getContext('2d');

  // Draw PDF layer
  ctx.drawImage(pdfCanvas, 0, 0);
  // Draw annotation layer
  ctx.drawImage(overlayCanvas, 0, 0);

  return tempCanvas;
};

/**
 * Download canvas as image
 */
export const downloadAsImage = (canvas, filename = 'page.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * Download canvas as PDF
 */
export const downloadAsPDF = (canvas, filename = 'document.pdf') => {
  if (!window.jspdf) {
    throw new Error('jsPDF library not loaded');
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'l' : 'p',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
};