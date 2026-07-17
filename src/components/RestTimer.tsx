/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, Minimize2, Maximize2 } from "lucide-react";

interface RestTimerProps {
  durationSeconds: number;
  remainingSeconds: number;
  onClose?: () => void;
  soundEnabled: boolean;
  onSoundToggle?: (enabled: boolean) => void;
  // Dynamic persistent states
  endTime: number | null;
  onTimerStart: (duration: number) => void;
  onTimerPause: (remainingSeconds: number) => void;
  onTimerReset: () => void;
}

export default function RestTimer({
  durationSeconds,
  remainingSeconds,
  onClose,
  soundEnabled,
  onSoundToggle,
  endTime,
  onTimerStart,
  onTimerPause,
  onTimerReset,
}: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isPaused, setIsPaused] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound generator using Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioCtx = new AudioContext();
      // Double beep
      const triggerBeep = (delay: number, freq: number) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        }, delay);
      };

      triggerBeep(0, 880);
      triggerBeep(300, 880);
    } catch (e) {
      console.warn("Audio Context blocked or not supported:", e);
    }
  };

  // Sync state with endTime prop
  
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (endTime !== null) {
      setIsPaused(false);
      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((endTime - now) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          playBeep();
          onTimerReset(); // This sets endTime to null
        }
      };
      
      updateTimer();
      timerRef.current = setInterval(updateTimer, 200);
    } else {
      setIsPaused(true);
      setTimeLeft(remainingSeconds);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [endTime, remainingSeconds]);


  const handleStart = () => {
    onTimerStart(timeLeft > 0 ? timeLeft : durationSeconds);
  };

  const handlePause = () => {
    onTimerPause(timeLeft);
  };

  const handleReset = () => {
    onTimerReset();
  };

  const percentLeft = (timeLeft / durationSeconds) * 100;

  if (isMinimized) {
    return (
      <div 
        id="rest-timer-minimized"
        className="fixed bottom-24 right-4 z-50 flex items-center gap-3 timer-blur text-white px-4 py-2.5 rounded-full shadow-2xl cursor-pointer"
        onClick={() => setIsMinimized(false)}
      >
        <div className="relative w-7 h-7 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="14" cy="14" r="12" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" fill="transparent" />
            <circle 
              cx="14" 
              cy="14" 
              r="12" 
              stroke="#ffffff" 
              strokeWidth="2.5" 
              fill="transparent" 
              strokeDasharray={75.4}
              strokeDashoffset={75.4 - (75.4 * percentLeft) / 100}
            />
          </svg>
          <span className="text-[9px] font-mono font-black">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-1.5 pr-1">
          <span className="text-xs font-black uppercase tracking-wider">REST</span>
          <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
        </div>
      </div>
    );
  }

  return (
    <div 
      id="rest-timer-container"
      className="fixed bottom-24 right-4 left-4 sm:left-auto sm:w-80 z-50 timer-blur text-white p-5 rounded-2xl shadow-2xl transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-300">
            {isPaused ? (timeLeft < durationSeconds ? "PAUSED" : "REST TIMER READY") : "RESTING"}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          {onSoundToggle && (
            <button
              id="timer-toggle-sound"
              onClick={() => onSoundToggle(!soundEnabled)}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition-colors"
              title={soundEnabled ? "Mute beep" : "Unmute beep"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}
          <button
            id="timer-minimize"
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            title="Minimize to side"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              id="timer-close"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Dynamic circular countdown */}
        <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
            <circle 
              cx="32" 
              cy="32" 
              r="28" 
              stroke="#ffffff" 
              strokeWidth="4" 
              fill="transparent" 
              strokeDasharray={175.9}
              strokeDashoffset={175.9 - (175.9 * percentLeft) / 100}
              className="transition-all duration-200"
            />
          </svg>
          <span className="text-lg font-mono font-black text-white">{timeLeft}s</span>
        </div>

        {/* Action Controls */}
        <div className="flex-1">
          <div className="text-xs font-bold mb-3 text-zinc-300 uppercase tracking-wide leading-tight">
            {isPaused ? (timeLeft < durationSeconds ? "PAUSED" : "REHYDRATING & RECOVERY") : "FOCUS. NEXT SET IS CALLING."}
          </div>
          <div className="flex gap-2">
            {isPaused ? (
              <button
                id="timer-btn-start"
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white text-black font-extrabold text-[11px] py-2.5 px-3 rounded hover:bg-neutral-200 transition-colors uppercase tracking-wider"
              >
                <Play className="w-3.5 h-3.5 fill-black text-black" />
                {timeLeft < durationSeconds ? "Resume" : "Start"}
              </button>
            ) : (
              <button
                id="timer-btn-pause"
                onClick={handlePause}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 text-white border border-white/10 font-extrabold text-[11px] py-2.5 px-3 rounded hover:bg-white/20 transition-colors uppercase tracking-wider"
              >
                <Pause className="w-3.5 h-3.5 fill-white text-white" />
                Pause
              </button>
            )}
            <button
              id="timer-btn-reset"
              onClick={handleReset}
              className="p-2.5 bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white rounded border border-white/10 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
