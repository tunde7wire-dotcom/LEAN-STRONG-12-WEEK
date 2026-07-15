import React, { useEffect, useState, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import { ExerciseFormGuide } from "../utils/exerciseFormGuides";

type ExerciseFormGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  guideData: ExerciseFormGuide | ExerciseFormGuide[];
  originalExerciseName: string;
  tempoCue?: string;
  effortCue?: string;
};

export default function ExerciseFormGuideModal({
  isOpen,
  onClose,
  guideData,
  originalExerciseName,
  tempoCue,
  effortCue,
}: ExerciseFormGuideModalProps) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // If guideData is an array, we need a selector.
  const isAmbiguous = Array.isArray(guideData);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentGuide = isAmbiguous
    ? (guideData as ExerciseFormGuide[])[selectedIndex]
    : (guideData as ExerciseFormGuide);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
      setSelectedIndex(0); // Reset on close
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentGuide) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-guide-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-zinc-900 z-10">
          <h2 id="form-guide-title" className="text-sm font-bold uppercase tracking-wide text-white truncate pr-4">
            {isAmbiguous ? originalExerciseName : currentGuide.exerciseName}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close form guide"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isAmbiguous && (
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase">
                Select Variation:
              </label>
              <select
                className="w-full bg-zinc-800 border border-white/20 text-white rounded-lg p-2 text-sm"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                aria-label="Select exercise variation"
              >
                {(guideData as ExerciseFormGuide[]).map((g, idx) => (
                  <option key={g.id} value={idx}>
                    {g.exerciseName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Video Player */}
          <div className="space-y-2">
            <div className="aspect-video bg-black rounded-lg overflow-hidden border border-white/10 relative flex items-center justify-center">
              {isOffline ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-zinc-400 mb-2">Video guidance requires an internet connection.</p>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${currentGuide.videoId}?playsinline=1&rel=0`}
                  title={`${currentGuide.exerciseName} form demonstration`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              )}
            </div>
            
            <div className="flex items-start justify-between gap-4 mt-2">
              <div>
                <p className="text-xs text-zinc-400 font-mono">
                  Source:{" "}
                  <a
                    href={currentGuide.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    {currentGuide.sourceName}
                  </a>
                </p>
                {currentGuide.matchType === "movement_pattern" && (
                  <span className="inline-block mt-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    Movement Pattern
                  </span>
                )}
                {currentGuide.matchType === "variation" && (
                  <span className="inline-block mt-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    Variation
                  </span>
                )}
              </div>
              <a
                href={currentGuide.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-white/70 hover:text-white shrink-0 bg-white/5 px-2 py-1.5 rounded"
              >
                Open on YouTube <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {currentGuide.variationNotice && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <p className="text-xs text-amber-200/90 leading-relaxed">
                <strong className="font-bold uppercase tracking-wider text-[10px] block mb-1">Notice</strong>
                {currentGuide.variationNotice}
              </p>
            </div>
          )}

          {/* Existing Cues */}
          {(tempoCue || effortCue) && (
            <div className="bg-white/5 rounded-lg p-4 space-y-3 border border-white/5">
              <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1">
                Workout Cues
              </h3>
              {tempoCue && (
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono block uppercase">Tempo</span>
                  <p className="text-sm text-white/90">{tempoCue}</p>
                </div>
              )}
              {effortCue && (
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono block uppercase">Focus / Effort</span>
                  <p className="text-sm text-white/90">{effortCue}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
