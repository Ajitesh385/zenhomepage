"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { Calendar, Cake, Sparkles, ChevronRight, Info } from "lucide-react";

export default function LifeCalendar() {
  const { settings, updateSettings } = useAppStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const birthDate = useMemo(() => new Date(settings.birthDate || "2003-11-15T17:05:00"), [
    settings.birthDate,
  ]);

  // Calculations
  const stats = useMemo(() => {
    const diffMs = now.getTime() - birthDate.getTime();
    const totalDaysLived = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeksLived = Math.floor(totalDaysLived / 7);

    // Exact Age calculation
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Next Birthday Countdown
    let nextBday = new Date(
      now.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
      birthDate.getHours(),
      birthDate.getMinutes()
    );
    if (now.getTime() > nextBday.getTime()) {
      nextBday = new Date(
        now.getFullYear() + 1,
        birthDate.getMonth(),
        birthDate.getDate(),
        birthDate.getHours(),
        birthDate.getMinutes()
      );
    }
    const bdayDiffMs = nextBday.getTime() - now.getTime();
    const bdayDays = Math.floor(bdayDiffMs / (1000 * 60 * 60 * 24));
    const bdayHours = Math.floor((bdayDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const bdayMinutes = Math.floor((bdayDiffMs % (1000 * 60 * 60)) / (1000 * 60));
    const turningAge = nextBday.getFullYear() - birthDate.getFullYear();

    // Current year progress
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const isLeapYear = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0;
    const totalYearDays = isLeapYear ? 366 : 365;
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const yearProgressPct = ((dayOfYear / totalYearDays) * 100).toFixed(1);

    return {
      totalDaysLived,
      totalWeeksLived,
      years,
      months,
      days,
      bdayDays,
      bdayHours,
      bdayMinutes,
      turningAge,
      dayOfYear,
      totalYearDays,
      yearProgressPct,
    };
  }, [now, birthDate]);

  // Active view
  const view = settings.calendarView || "days";

  // Generate Year Days Rectangles (365 / 366)
  const yearDays = useMemo(() => {
    const list = [];
    for (let i = 1; i <= stats.totalYearDays; i++) {
      const isPast = i < stats.dayOfYear;
      const isToday = i === stats.dayOfYear;
      list.push({ dayNumber: i, isPast, isToday });
    }
    return list;
  }, [stats.totalYearDays, stats.dayOfYear]);

  // Generate Weeks of Life Rectangles (e.g. 90 years * 52 weeks = 4680 blocks, or first 30 years)
  const lifeWeeks = useMemo(() => {
    const totalWeeksIn35Years = 35 * 52;
    const list = [];
    for (let w = 0; w < totalWeeksIn35Years; w++) {
      const isPast = w < stats.totalWeeksLived;
      const isCurrent = w === stats.totalWeeksLived;
      list.push({ week: w + 1, isPast, isCurrent });
    }
    return list;
  }, [stats.totalWeeksLived]);

  return (
    <div className="w-full max-w-4xl mx-auto my-4 px-4 select-none">
      <div className="rounded-3xl glass-panel p-5 md:p-6 border border-white/10 shadow-xl relative overflow-hidden">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Life Calendar</h3>
                <span className="text-[11px] font-mono text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {stats.totalDaysLived.toLocaleString()} days lived
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Age: {stats.years}y {stats.months}m {stats.days}d &middot; Born Nov 15, 2003
              </p>
            </div>
          </div>

          {/* Birthday Countdown (Subtle & Non-distracting) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-pill border border-white/10 text-xs text-neutral-300">
            <Cake className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
            <span>
              Next Birthday:{" "}
              <strong className="text-white font-mono">
                {stats.bdayDays}d {stats.bdayHours}h
              </strong>{" "}
              <span className="text-neutral-400 text-[11px]">(Turning {stats.turningAge})</span>
            </span>
          </div>
        </div>

        {/* Mode Selector & Summary Info */}
        <div className="flex items-center justify-between my-3 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateSettings({ calendarView: "days" })}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs font-medium ${
                view === "days"
                  ? "bg-white/15 text-white border border-white/15"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              2026 Days ({stats.dayOfYear}/{stats.totalYearDays})
            </button>
            <button
              onClick={() => updateSettings({ calendarView: "weeks" })}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs font-medium ${
                view === "weeks"
                  ? "bg-white/15 text-white border border-white/15"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Weeks of Life ({stats.totalWeeksLived} wks)
            </button>
          </div>

          <div className="text-[11px] font-mono text-neutral-400 hidden sm:block">
            {view === "days" ? `${stats.yearProgressPct}% of year complete` : "Each block = 1 week"}
          </div>
        </div>

        {/* The Grid of Rectangles */}
        {view === "days" ? (
          <div>
            {/* 365 Days Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(9px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(11px,1fr))] gap-1 py-2">
              {yearDays.map((d) => (
                <div
                  key={d.dayNumber}
                  title={`Day ${d.dayNumber} of ${stats.totalYearDays} ${
                    d.isToday ? "(Today!)" : d.isPast ? "(Lived)" : "(Upcoming)"
                  }`}
                  className={`h-2.5 sm:h-3 rounded-xs transition-all duration-150 cursor-pointer ${
                    d.isToday
                      ? "bg-sky-400 ring-2 ring-sky-300 shadow-md shadow-sky-400/50 scale-125 z-10"
                      : d.isPast
                      ? "bg-emerald-500/70 hover:bg-emerald-400"
                      : "bg-white/5 hover:bg-white/15 border border-white/5"
                  }`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-3 text-[11px] text-neutral-400 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/70 inline-block" />
                  <span>Days Lived</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-sky-400 inline-block ring-1 ring-sky-300" />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-white/5 border border-white/10 inline-block" />
                  <span>Future</span>
                </div>
              </div>

              <span className="font-mono text-neutral-500">
                {stats.totalYearDays - stats.dayOfYear} days remaining in 2026
              </span>
            </div>
          </div>
        ) : (
          <div>
            {/* Weeks of Life Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(6px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(8px,1fr))] gap-1 py-2 max-h-[140px] overflow-y-auto">
              {lifeWeeks.map((w) => (
                <div
                  key={w.week}
                  title={`Week ${w.week} (${Math.floor(w.week / 52)} years old)`}
                  className={`h-2 sm:h-2.5 rounded-xs transition-all ${
                    w.isCurrent
                      ? "bg-cyan-400 ring-2 ring-cyan-300 scale-125 z-10 animate-pulse"
                      : w.isPast
                      ? "bg-emerald-500/60 hover:bg-emerald-400"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 text-[11px] text-neutral-400 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/60 inline-block" />
                  <span>Weeks Lived ({stats.totalWeeksLived})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400 inline-block" />
                  <span>Current Week</span>
                </div>
              </div>
              <span className="font-mono text-neutral-500">Showing first 35 years</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
