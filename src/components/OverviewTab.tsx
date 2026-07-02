/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check, Calendar, Lock, Flame, ShieldAlert, Award } from "lucide-react";
import { WeekPlan, AppSettings, WeeklyCheckIn } from "../types";

interface OverviewTabProps {
  currentWeekNum: number;
  weeks: WeekPlan[];
  settings: AppSettings;
  checkins: WeeklyCheckIn[];
  onSelectWeek: (weekNum: number) => void;
}

export default function OverviewTab({
  currentWeekNum,
  weeks,
  settings,
  checkins,
  onSelectWeek,
}: OverviewTabProps) {
  
  // Define Phase names for visual layout
  const getPhaseName = (wk: number) => {
    if (wk <= 2) return "Phase 1: Foundation";
    if (wk >= 3 && wk <= 6) return "Phase 2: Accumulation";
    if (wk === 7) return "Phase 3: Active Deload";
    return "Phase 4: Peak Intensification";
  };

  const getPhaseColor = (wk: number) => {
    if (wk <= 2) return "border-neutral-800 text-neutral-400";
    if (wk >= 3 && wk <= 6) return "border-neutral-800 text-neutral-400";
    if (wk === 7) return "border-white text-white"; // Highlight deload visually
    return "border-neutral-800 text-neutral-400";
  };

  // Compute stats for each week
  const getWeekStats = (wkNum: number) => {
    // 7 days in a week
    let completedCount = 0;
    for (let d = 0; d < 7; d++) {
      if (settings.completedDays[`W${wkNum}-D${d}`]) {
        completedCount++;
      }
    }

    const checkin = checkins.find((c) => c.weekNumber === wkNum);
    const hasCheckin = checkin?.completed || false;

    return {
      completedCount,
      hasCheckin,
    };
  };

  return (
    <div id="twelve-week-overview" className="max-w-md mx-auto px-4 pb-24 pt-4">
      <div className="mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
          Roadmap
        </span>
        <h1 className="text-4xl font-black tracking-tighter text-white mt-1 uppercase">
          12-Week Lean & Strong
        </h1>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          Select any week below to view workout targets, upload PDF meal plans, or log check-ins. Week 07 is a strict deload to prevent physical adaptation blockages.
        </p>
      </div>

      {/* Grid of Weeks */}
      <div className="space-y-4">
        {weeks.map((week) => {
          const stats = getWeekStats(week.weekNumber);
          const isCurrent = week.weekNumber === currentWeekNum;
          const phaseLabel = getPhaseName(week.weekNumber);

          return (
            <div
              id={`overview-week-card-${week.weekNumber}`}
              key={week.weekNumber}
              onClick={() => onSelectWeek(week.weekNumber)}
              className={`relative apple-card p-5 cursor-pointer transition-all duration-200 ${
                isCurrent
                  ? "border-white ring-1 ring-white"
                  : "hover:border-white/20"
              }`}
            >
              {isCurrent && (
                <span className="absolute top-5 right-5 bg-white text-black font-mono font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                  Active
                </span>
              )}

              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-mono font-extrabold text-zinc-500 uppercase">
                    WEEK {String(week.weekNumber).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {week.isDeload ? "Deload & Recovery Phase" : `Volume Set Target`}
                  </h3>
                </div>
              </div>

              {/* Phase description */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`text-[10px] font-mono border px-2 py-0.5 rounded-full ${getPhaseColor(week.weekNumber)}`}>
                  {phaseLabel}
                </span>
                {week.isDeload && (
                  <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-white" /> Deload (50% Sets)
                  </span>
                )}
              </div>

              {/* Progress Tracker inside card */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">Workouts Done</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className="bg-white h-full" 
                        style={{ width: `${(stats.completedCount / 7) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-zinc-300 font-bold">{stats.completedCount}/7</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">Weekly Check-in</span>
                  <span className={`text-xs mt-1 inline-block font-bold uppercase tracking-wider ${
                    stats.hasCheckin ? "text-white" : "text-zinc-500"
                  }`}>
                    {stats.hasCheckin ? (
                      <span className="flex items-center gap-1 justify-end">
                        <Check className="w-3.5 h-3.5 text-white" /> Complete
                      </span>
                    ) : (
                      "Pending"
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
