import React, { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut, Maximize, Minimize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  dataUrl: string;
  fileName: string;
  isFullscreen?: boolean;
  onClose?: () => void;
  onOpenFullscreen?: () => void;
}

const MIN_SCALE = 0.2;
const MAX_SCALE = 3.0;
const ZOOM_STEP = 0.1;

export default function PDFViewer({ dataUrl, fileName, isFullscreen = false, onClose, onOpenFullscreen }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  
  const [zoomMode, setZoomMode] = useState<'fit-page' | 'manual'>('fit-page');
  const [manualScale, setManualScale] = useState<number>(1);
  const [fitScale, setFitScale] = useState<number>(1);
  
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // For Pinch to Zoom
  const initialPinchDist = useRef<number | null>(null);
  const baseScale = useRef<number>(1);

  const effectiveScale = zoomMode === 'fit-page' ? fitScale : manualScale;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setZoomMode('fit-page');
  }

  function onPageLoadSuccess(page: any) {
    const originalWidth = page.originalWidth;
    const originalHeight = page.originalHeight;
    setPageWidth(originalWidth);
    setPageHeight(originalHeight);
    
    doFitPage(originalWidth, originalHeight);
  }

  const doFitPage = useCallback((pWidth: number = pageWidth, pHeight: number = pageHeight) => {
    if (!containerRef.current || pWidth === 0 || pHeight === 0) return;
    
    const { clientWidth, clientHeight } = containerRef.current;
    const paddingX = isFullscreen ? 32 : 16;
    const paddingY = isFullscreen ? 140 : 32; // more padding top/bottom in fullscreen for toolbars
    
    const safeWidth = Math.max(0, clientWidth - paddingX);
    const safeHeight = Math.max(0, clientHeight - paddingY);
    
    const scaleX = safeWidth / pWidth;
    const scaleY = safeHeight / pHeight;
    
    const newFitScale = Math.min(scaleX, scaleY);
    setFitScale(newFitScale);
  }, [pageWidth, pageHeight, isFullscreen]);

  useEffect(() => {
    // Recalculate on resize
    const handleResize = () => {
      doFitPage();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [doFitPage]);

  // Touch handlers for Pinch Zoom
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault(); // prevent Safari zoom
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialPinchDist.current = dist;
        baseScale.current = effectiveScale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        if (initialPinchDist.current !== null) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          const delta = dist / initialPinchDist.current;
          let newScale = baseScale.current * delta;
          newScale = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));
          setManualScale(Math.round(newScale * 100) / 100);
          setZoomMode('manual');
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialPinchDist.current = null;
      }
    };

    wrapper.addEventListener("touchstart", handleTouchStart, { passive: false });
    wrapper.addEventListener("touchmove", handleTouchMove, { passive: false });
    wrapper.addEventListener("touchend", handleTouchEnd);
    wrapper.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      wrapper.removeEventListener("touchstart", handleTouchStart);
      wrapper.removeEventListener("touchmove", handleTouchMove);
      wrapper.removeEventListener("touchend", handleTouchEnd);
      wrapper.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [effectiveScale]);

  const handleZoomIn = () => {
    setManualScale(s => {
      const current = zoomMode === 'fit-page' ? fitScale : s;
      return Math.min(MAX_SCALE, Math.round((current + ZOOM_STEP) * 100) / 100);
    });
    setZoomMode('manual');
  };

  const handleZoomOut = () => {
    setManualScale(s => {
      const current = zoomMode === 'fit-page' ? fitScale : s;
      return Math.max(MIN_SCALE, Math.round((current - ZOOM_STEP) * 100) / 100);
    });
    setZoomMode('manual');
  };

  const goToPrevPage = () => {
    setPageNumber(p => Math.max(1, p - 1));
  };

  const goToNextPage = () => {
    setPageNumber(p => Math.min(numPages, p + 1));
  };
  
  const handleClose = () => {
    if (onClose) onClose();
  };

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 bg-neutral-950 flex flex-col"
    : "relative w-full h-[60vh] sm:h-[70vh] bg-neutral-900 border border-white/10 rounded-xl overflow-hidden flex flex-col";

  return (
    <div className={containerClasses}>
      {/* Top Bar for Fullscreen */}
      {isFullscreen && (
        <div 
          className="flex items-center justify-between px-4 pb-3 bg-neutral-900 border-b border-white/10 shrink-0"
          style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)' }}
        >
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-sm font-bold text-white truncate">{fileName}</h2>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
              Page {pageNumber} of {numPages}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors shrink-0"
            aria-label="Close PDF viewer"
          >
            <X className="w-4 h-4" />
            <span className="text-xs font-bold font-mono tracking-wider">CLOSE</span>
          </button>
        </div>
      )}

      {/* Main PDF Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto relative touch-pan-x touch-pan-y"
      >
        <div 
          ref={wrapperRef}
          className="min-h-full min-w-full flex items-center justify-center p-4 origin-center"
        >
          <Document
            file={dataUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center text-xs text-zinc-500 font-mono uppercase tracking-widest animate-pulse">
                Loading PDF...
              </div>
            }
            error={
              <div className="text-red-400 text-xs font-mono p-4 text-center">
                Failed to load PDF file. It might be corrupted.
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={effectiveScale}
              onLoadSuccess={onPageLoadSuccess}
              className="shadow-2xl"
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500 font-mono">
                  Rendering page...
                </div>
              }
            />
          </Document>
        </div>
      </div>

      {/* Toolbar */}
      <div className={`flex items-center justify-between px-3 py-2 shrink-0 relative z-10 ${isFullscreen ? 'bg-neutral-900 border-t border-white/10 pb-8 sm:pb-3' : 'bg-black/95 border-t border-white/10'}`}>
        {/* Pagination */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-1.5 text-white disabled:text-zinc-700 disabled:bg-transparent hover:bg-white/10 rounded-md transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-zinc-300 px-2 min-w-[3rem] text-center">
            {pageNumber} / {numPages || '-'}
          </span>
          <button
            type="button"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="p-1.5 text-white disabled:text-zinc-700 disabled:bg-transparent hover:bg-white/10 rounded-md transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={effectiveScale <= MIN_SCALE}
            className="p-1.5 text-white disabled:text-zinc-700 disabled:bg-transparent hover:bg-white/10 rounded-md transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-zinc-300 px-2 min-w-[3rem] text-center">
            {Math.round(effectiveScale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={effectiveScale >= MAX_SCALE}
            className="p-1.5 text-white disabled:text-zinc-700 disabled:bg-transparent hover:bg-white/10 rounded-md transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomMode('fit-page')}
            className="text-[10px] font-mono font-bold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors px-2 py-1"
            title="Fit Page"
          >
            FIT
          </button>
          
          <button
            type="button"
            onClick={isFullscreen ? handleClose : onOpenFullscreen}
            className="p-1.5 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
            aria-label={isFullscreen ? "Close fullscreen" : "Open fullscreen"}
            title={isFullscreen ? "Close" : "Expand"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
