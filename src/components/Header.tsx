"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { Moon, Sliders, Cloud, CloudOff, RefreshCw } from "lucide-react";

export default function Header() {
  const { toggleZenMode, setIsSettingsOpen, syncStatus } = useAppStore();

  return (
    <header className="w-full flex items-center justify-between py-4 px-4 md:px-8 max-w-4xl mx-auto select-none">
      {/* Brand logo & status */}
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
        <span className="text-xs font-mono font-semibold tracking-widest uppercase text-white/80">
          Aether
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* Sync Status Badge */}
        <div
          title={`Database status: ${syncStatus}`}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass-pill text-neutral-300 transition-all"
        >
          {syncStatus === "syncing" && (
            <>
              <RefreshCw className="w-3 h-3 animate-spin text-sky-400" />
              <span className="text-sky-300 text-[11px]">Syncing...</span>
            </>
          )}
          {syncStatus === "saved" && (
            <>
              <Cloud className="w-3 h-3 text-emerald-400" />
              <span className="text-neutral-300 text-[11px]">DB Synced</span>
            </>
          )}
          {syncStatus === "offline" && (
            <>
              <CloudOff className="w-3 h-3 text-amber-400" />
              <span className="text-amber-300 text-[11px]">Offline Cache</span>
            </>
          )}
        </div>

        {/* Zen Mode Trigger */}
        <button
          onClick={() => toggleZenMode(true)}
          title="Enter Zen Mode (Press 'Z')"
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white/90 glass-pill hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-black/20"
        >
          <Moon className="w-3.5 h-3.5 text-cyan-300 group-hover:rotate-12 transition-transform" />
          <span>Zen Mode</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono text-neutral-400 bg-white/10 rounded border border-white/15">
            Z
          </kbd>
        </button>

        {/* Settings button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Customization Settings"
          aria-label="Settings"
          className="p-2 rounded-xl glass-pill text-neutral-300 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
