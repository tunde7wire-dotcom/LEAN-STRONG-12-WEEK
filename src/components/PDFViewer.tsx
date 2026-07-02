import React, { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  dataUrl: string;
  fileName: string;
  isFullscreen?: boolean;
  onClose?: () => void;
}

const MIN_SCALE = 0.2;
const MAX_SCALE = 3.0;
const ZOOM_STEP = 0.1;

export default function PDFViewer({ dataUrl, fileName, isFullscreen = false, onClose }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [fitScale, setFitScale] = useState<number | null>(null);
  
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // For Pinch to Zoom
  const initialPinchDist = useRef<number | null>(null);
  const baseScale = useRef<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function onPageLoadSuccess(page: any) {
    const originalWidth = page.originalWidth;
    const originalHeight = page.originalHeight;
    setPageWidth(originalWidth);
    setPageHeight(originalHeight);
    
    // Calculate fit scale
    doFitPage(originalWidth, originalHeight);
  }

  const doFitPage = useCallback((pWidth: number = pageWidth, pHeight: number = pageHeight) => {
    if (!containerRef.current || pWidth === 0 || pHeight === 0) return;
    
    const { clientWidth, clientHeight } = containerRef.current;
    const paddingX = isFullscreen ? 32 : 16;
    const paddingY = isFullscreen ? 120 : 32; // more padding top/bottom in fullscreen for toolbars
    
    const safeWidth = Math.max(0, clientWidth - paddingX);
    const safeHeight = Math.max(0, clientHeight - paddingY);
    
    const scaleX = safeWidth / pWidth;
    const scaleY = safeHeight / pHeight;
    
    const newFitScale = Math.min(scaleX, scaleY);
    setFitScale(newFitScale);
    setScale(newFitScale);
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
        baseScale.current = scale;
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
          setScale(Math.round(newScale * 100) / 100);
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
  }, [scale]);

  const handleZoomIn = () => {
    setScale(s => Math.min(MAX_SCALE, Math.round((s + ZOOM_STEP) * 100) / 100));
  };

  const handleZoomOut = () => {
    setScale(s => Math.max(MIN_SCALE, Math.round((s - ZOOM_STEP) * 100) / 100));
  };

  const goToPrevPage = () => {
    setPageNumber(p => Math.max(1, p - 1));
  };

  const goToNextPage = () => {
    setPageNumber(p => Math.min(numPages, p + 1));
  };

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 bg-neutral-950 flex flex-col pt-safe pb-safe"
    : "relative w-full h-[60vh] sm:h-[70vh] bg-neutral-900 border border-white/10 rounded-xl overflow-hidden flex flex-col";

  return (
    <div className={containerClasses}>
      {/* Top Bar for Fullscreen */}
      {isFullscreen && (
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-white/10 shrink-0">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-sm font-bold text-white truncate">{fileName}</h2>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
              Page {pageNumber} of {numPages}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors shrink-0"
            aria-label="Close PDF viewer"
          >
            <X className="w-5 h-5" />
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
              scale={scale}
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
            disabled={scale <= MIN_SCALE}
            className="p-1.5 text-white disabled:text-zinc-700 disabled:bg-transparent hover:bg-white/10 rounded-md transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-zinc-300 px-2 min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= MAX_SCALE}
            className="p-1.5 text-white disabled:text-zinc-700 disabled:bg-transparent hover:bg-white/10 rounded-md transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => doFitPage()}
          className="p-1.5 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
          aria-label="Fit to page"
          title="Fit Page"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
