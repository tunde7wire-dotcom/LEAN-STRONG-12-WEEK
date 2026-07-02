/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from "react";
import { Upload, FileText, Trash2, Eye, ShieldCheck, CheckCircle, Info } from "lucide-react";
import { StoredPDF, WeekPlan } from "../types";
import { getPDF, savePDF, deletePDF, loadFromLocalStorage, saveToLocalStorage } from "../utils/db";
import PDFViewer from "./PDFViewer";

interface MealsTabProps {
  selectedWeekNum: number;
  weekPlan: WeekPlan;
}

export default function MealsTab({ selectedWeekNum, weekPlan }: MealsTabProps) {
  const [storedPdf, setStoredPdf] = useState<StoredPDF | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isFullscreenPdf, setIsFullscreenPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDF for the selected week from IndexedDB
  useEffect(() => {
    let active = true;
    const fetchPDF = async () => {
      try {
        const pdf = await getPDF(selectedWeekNum);
        if (active) {
          setStoredPdf(pdf);
          setUploadError(null);
        }
      } catch (err) {
        console.error("Failed to load PDF:", err);
      }
    };
    fetchPDF();

    return () => {
      active = false;
    };
  }, [selectedWeekNum]);

  // Handle PDF file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Only standard PDF documents (.pdf) are supported.");
      return;
    }

    // Check size limit: Let's limit to 15MB to be safe for IndexedDB performance
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("File size exceeds 15MB limit.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const saved = await savePDF(selectedWeekNum, file, file.name);
      setStoredPdf(saved);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Failed to store the PDF in browser offline database.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle PDF delete
  const handleDeletePdf = async () => {
    if (window.confirm("Are you sure you want to delete this week's PDF meal plan? This action is irreversible offline.")) {
      try {
        await deletePDF(selectedWeekNum);
        setStoredPdf(null);
      } catch (err) {
        console.error("Delete error:", err);
        setUploadError("Failed to remove PDF from database.");
      }
    }
  };

  return (
    <div id="meals-pdf-system" className="max-w-md mx-auto px-4 pb-28 pt-4">
      <div className="mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
          NUTRITION REVOLUTION
        </span>
        <h1 className="text-4xl font-black tracking-tighter text-white mt-1 uppercase">
          Week {String(selectedWeekNum).padStart(2, "0")} Meals
        </h1>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          Store weekly custom macro blueprints, recipes, or grocery lists natively in your browser. This information remains 100% private and accessible offline during workouts.
        </p>
      </div>

      {/* PDF Upload Area / Previewer Section */}
      <div className="apple-card p-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-white" />
          Week {selectedWeekNum} PDF Meal Plan
        </h3>

        {storedPdf ? (
          <div>
            <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-6 h-6 text-white flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{storedPdf.fileName}</p>
                  <p className="text-[9px] font-mono text-zinc-500 mt-0.5 font-bold">
                    SAVED: {new Date(storedPdf.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                id="meals-btn-delete-pdf"
                onClick={handleDeletePdf}
                className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Inline PDF Viewer */}
            <div className="mb-4">
              <PDFViewer 
                dataUrl={storedPdf.dataUrl} 
                fileName={storedPdf.fileName} 
                isFullscreen={isFullscreenPdf}
                onOpenFullscreen={() => setIsFullscreenPdf(true)}
                onClose={() => setIsFullscreenPdf(false)}
              />
            </div>

            {/* Open PDF Link */}
            {!isFullscreenPdf && (
              <button
                id="meals-btn-open-pdf"
                onClick={() => setIsFullscreenPdf(true)}
                className="w-full flex items-center justify-center gap-2 border border-white/10 text-white font-bold text-xs py-3 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all uppercase tracking-wider font-mono"
              >
                <Eye className="w-3.5 h-3.5" />
                Open PDF Plan
              </button>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-white/10 hover:border-white/25 rounded-xl p-8 text-center bg-white/5 transition-colors">
            <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wide">No meal plan PDF uploaded</h4>
            <p className="text-[10px] text-zinc-500 mt-1.5 max-w-[240px] mx-auto leading-relaxed">
              Select or drop your custom PDF plan for Week {selectedWeekNum} to load it here.
            </p>

            <button
              id="meals-btn-trigger-upload"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mt-4 bg-white text-black text-xs font-extrabold py-2 px-4 rounded hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider font-mono"
            >
              {isUploading ? "Uploading..." : "Choose PDF Document"}
            </button>
            
            <input
              id="meals-hidden-file-input"
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {uploadError && (
          <div className="mt-3 p-3 bg-red-950/20 border border-red-900/40 rounded-xl flex items-start gap-2 text-xs text-red-200">
            <Info className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
