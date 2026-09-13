"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Sparkles, Sliders, Moon, Cloud, CloudOff, RefreshCw } from "lucide-react";

export default function Header() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("Welcome");

  const {
    settings,
    toggleZenMode,
    setIsSettingsOpen,
    syncStatus,
  } = useAppStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();

      // Greeting
      if (hour >= 5 && hour < 12) setGreeting("Good morning");
      else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
      else if (hour >= 17 && hour < 22) setGreeting("Good evening");
      else setGreeting("Deep work hours");

      // Time
      const timeStr = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: settings.clockFormat === "12h",
      });
      setTime(timeStr);

      // Date
      const dateStr = now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      setDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.clockFormat]);

  return (
    <header className="w-full flex items-center justify-between py-6 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Left: Dynamic Clock & Date */}
      {settings.showClock && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-white/90 drop-shadow-sm font-mono">
              {time || "--:--"}
            </h1>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Active
            </span>
          </div>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            {greeting} &middot; <span className="text-neutral-300">{date}</span>
          </p>
        </div>
      )}

      {!settings.showClock && <div />}

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-3">
        {/* Sync Status Badge */}
        <div
          title={`Database status: ${syncStatus}`}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass-pill text-neutral-300 transition-all"
        >
          {syncStatus === "syncing" && (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span className="text-sky-300">Syncing...</span>
            </>
          )}
          {syncStatus === "saved" && (
            <>
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-neutral-300">DB Synced</span>
            </>
          )}
          {syncStatus === "offline" && (
            <>
              <CloudOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300">Offline Cache</span>
            </>
          )}
        </div>

        {/* Zen Mode Button */}
        <button
          onClick={() => toggleZenMode(true)}
          title="Enter Zen Mode (Press 'Z')"
          className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/90 glass-pill hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-black/20"
        >
          <div className="relative flex items-center justify-center w-2 h-2 rounded-full bg-cyan-400">
            <div className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400/40 animate-ping" />
          </div>
          <Moon className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform duration-300" />
          <span>Zen Mode</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-white/5 rounded border border-white/10 ml-1">
            Z
          </kbd>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Customize Homescreen"
          aria-label="Settings"
          className="p-2.5 rounded-xl glass-pill text-neutral-300 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
