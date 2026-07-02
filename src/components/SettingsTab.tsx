/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Settings, ShieldAlert, RotateCcw, Calendar, Check, Volume2, Info, Moon } from "lucide-react";
import { AppSettings } from "../types";

interface SettingsTabProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClearAllData: () => Promise<void>;
}

export default function SettingsTab({
  settings,
  onUpdateSettings,
  onClearAllData,
}: SettingsTabProps) {
  const [startDate, setStartDate] = useState(settings.startDate);
  const [units, setUnits] = useState(settings.units);
  const [timerDuration, setTimerDuration] = useState(settings.timerDuration.toString());
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(timerDuration, 10);
    if (!isNaN(duration) && duration > 0) {
      onUpdateSettings({
        ...settings,
        startDate,
        units,
        timerDuration: duration,
        soundEnabled,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleResetApp = async () => {
    const confirmed = window.confirm(
      "CRITICAL DANGER:\nAre you sure you want to restore the 12-Week Plan Defaults?\n\nThis will completely wipe your weight logs, best-set progressions, uploaded PDF meal plans, and all check-ins. This action CANNOT be undone."
    );
    if (confirmed) {
      await onClearAllData();
      window.location.reload();
    }
  };

  return (
    <div id="settings-customization" className="max-w-md mx-auto px-4 pb-28 pt-4">
      <div className="mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
          PREFERENCES
        </span>
        <h1 className="text-4xl font-black tracking-tighter text-white mt-1 uppercase">
          Settings & Options
        </h1>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          Configure start date rules, preferred units, and rest timers. No account is required; all configuration remains local to this device.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="apple-card p-6 mb-6 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-white" />
          General Configuration
        </h3>

        {/* Start Date Picker */}
        <div>
          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
            Plan Launch Start Date
          </label>
          <div className="relative">
            <input
              id="settings-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full text-sm py-2.5 px-3 rounded-xl text-white font-mono"
            />
          </div>
          <span className="text-[9px] text-zinc-500 mt-1.5 block leading-normal font-mono uppercase font-bold tracking-wide">
            App uses this date to determine what week/day of the plan is active today.
          </span>
        </div>

        {/* Units Toggle */}
        <div>
          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
            Preferred Units System
          </label>
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 border border-white/10 rounded-xl">
            <button
              id="settings-btn-units-imperial"
              type="button"
              onClick={() => setUnits("imperial")}
              className={`text-xs py-1.5 rounded-lg font-bold transition-all uppercase tracking-wider ${
                units === "imperial" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Imperial
            </button>
            <button
              id="settings-btn-units-metric"
              type="button"
              onClick={() => setUnits("metric")}
              className={`text-xs py-1.5 rounded-lg font-bold transition-all uppercase tracking-wider ${
                units === "metric" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Metric
            </button>
          </div>
        </div>

        {/* Timer Default Duration */}
        <div>
          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
            Default Rest Timer Target (Seconds)
          </label>
          <input
            id="settings-timer-duration"
            type="number"
            value={timerDuration}
            onChange={(e) => setTimerDuration(e.target.value)}
            required
            className="w-full text-sm py-2.5 px-3 text-white rounded-xl"
          />
        </div>

        {/* Audio feedback toggle */}
        <div className="flex items-center justify-between py-2 px-1">
          <div>
            <span className="text-xs font-bold text-white block uppercase tracking-wider">Rest Beep Notification</span>
            <span className="text-[9px] text-zinc-500 block leading-normal mt-0.5">Play high-frequency alarm tones on rest completion.</span>
          </div>
          <button
            id="settings-btn-sound"
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              soundEnabled ? "bg-white" : "bg-white/10"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-black transition-transform transform ${
              soundEnabled ? "translate-x-6" : "translate-x-0"
            }`} />
          </button>
        </div>

        {/* Save button */}
        <button
          id="settings-submit-btn"
          type="submit"
          className="w-full bg-white text-black font-extrabold text-xs py-3.5 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
        >
          <Check className="w-4 h-4" />
          {isSaved ? "Saved Preferences!" : "Commit Overrides"}
        </button>
      </form>

      {/* Disclaimers & Legal information */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-[10px] text-zinc-400 leading-relaxed">
        <div className="flex gap-2 items-start text-zinc-200 font-bold mb-1.5 uppercase font-mono tracking-wider">
          <Info className="w-3.5 h-3.5 text-white" />
          General Physical Safeguard
        </div>
        This application acts as a personal tracking ledger and does not represent professional medical advice or physical therapy prescription. Users should always consult qualified health professionals before undertaking intense compound weight lifting or caloric modifications. Manual overrides can be made at any point to customize set loads.
      </div>

      {/* Restrictive System Reset Card */}
      <div className="bg-white/5 border border-red-950 rounded-2xl p-5">
        <h4 className="text-xs font-mono font-bold uppercase text-red-500 flex items-center gap-1.5 mb-2 tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          Danger Zone Actions
        </h4>
        <p className="text-[10px] text-zinc-400 leading-relaxed mb-4">
          Resetting the application will permanently erase your offline IndexedDB PDF meal plans, all best-set load logs, morning weigh-ins, and weekly progress check-ins.
        </p>
        <button
          id="settings-btn-hard-reset"
          onClick={handleResetApp}
          className="w-full bg-red-950/20 text-red-200 border border-red-900 hover:bg-red-900/40 text-xs font-extrabold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Wipe Database & Reset
        </button>
      </div>
    </div>
  );
}
