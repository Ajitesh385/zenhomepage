"use client";

import React from "react";
import { useAppStore, UserSettingsItem } from "@/lib/store";
import {
  X,
  Palette,
  Clock,
  Check,
  Moon,
  Sun,
  Calendar,
  Type,
  Sparkles,
} from "lucide-react";

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, settings, updateSettings, setZenTheme } =
    useAppStore();

  if (!isSettingsOpen) return null;

  const themes: { id: UserSettingsItem["theme"]; name: string; desc: string; preview: string }[] = [
    {
      id: "midnight",
      name: "Aurora Midnight",
      desc: "Deep cosmic blues and teal atmospheric glows",
      preview: "bg-gradient-to-tr from-sky-900 via-indigo-950 to-slate-900",
    },
    {
      id: "obsidian",
      name: "Obsidian Void",
      desc: "True pitch slate for zero-glare OLED screens",
      preview: "bg-gradient-to-tr from-black via-neutral-950 to-neutral-900",
    },
    {
      id: "aurora",
      name: "Cyber Neon",
      desc: "Electric violet, fuchsia, and cyan gradients",
      preview: "bg-gradient-to-tr from-purple-950 via-slate-950 to-rose-950",
    },
    {
      id: "dusk",
      name: "Minimal Matte",
      desc: "Warm graphite with subtle soft ambient light",
      preview: "bg-gradient-to-tr from-neutral-900 via-neutral-950 to-stone-900",
    },
    {
      id: "light",
      name: "Nordic Daylight",
      desc: "Clean, calming daylight aesthetic",
      preview: "bg-gradient-to-tr from-indigo-100 via-white to-rose-100",
    },
  ];

  const clockStyles: { id: UserSettingsItem["clockStyle"]; name: string }[] = [
    { id: "minimal", name: "Minimal Mono" },
    { id: "glow", name: "Cyan Glow" },
    { id: "cyber", name: "Cyber Matrix" },
    { id: "serif", name: "Editorial Serif" },
    { id: "clean", name: "Modern Sans" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel p-6 md:p-8 shadow-2xl border border-white/15">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Homescreen Settings</h2>
              <p className="text-xs text-neutral-400">Customize clock, calendar, notepad & themes</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-sm">
          {/* Clock Customization */}
          <div>
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Centerpiece Clock Customization</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {clockStyles.map((cs) => (
                <button
                  key={cs.id}
                  onClick={() => updateSettings({ clockStyle: cs.id })}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left cursor-pointer transition-colors ${
                    settings.clockStyle === cs.id
                      ? "bg-sky-500/20 border-sky-400 text-white font-semibold"
                      : "bg-white/[0.02] border-white/10 text-neutral-300 hover:bg-white/5"
                  }`}
                >
                  {cs.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* 24h vs 12h */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                <span className="text-xs text-neutral-300">24-Hour Clock</span>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      clockFormat: settings.clockFormat === "24h" ? "12h" : "24h",
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    settings.clockFormat === "24h" ? "bg-sky-500" : "bg-neutral-800"
                  }`}
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      settings.clockFormat === "24h" ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Show Seconds */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                <span className="text-xs text-neutral-300">Show Seconds</span>
                <button
                  type="button"
                  onClick={() => updateSettings({ showSeconds: !settings.showSeconds })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    settings.showSeconds ? "bg-sky-500" : "bg-neutral-800"
                  }`}
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      settings.showSeconds ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Life Calendar Customization */}
          <div className="pt-2 border-t border-white/10">
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Life Calendar & Birth Details</span>
            </label>
            <p className="text-xs text-neutral-400 mb-3">
              Configure your exact birth date and time for the rectangles grid and countdown.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={settings.birthDate}
                onChange={(e) => updateSettings({ birthDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-sky-400/50"
                placeholder="2003-11-15T17:05:00"
              />
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Configured: 15th November 2003, 5:05 PM
            </span>
          </div>

          {/* Atmosphere & Themes */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
              Background Atmosphere
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {themes.map((t) => {
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => updateSettings({ theme: t.id })}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/5"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl border border-white/20 flex-shrink-0 ${t.preview} flex items-center justify-center`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{t.name}</div>
                      <div className="text-[11px] text-neutral-400 leading-tight">{t.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zen Mode Default */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Zen Mode Default
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  updateSettings({ zenPreference: "black" });
                  setZenTheme("black");
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium text-xs transition-all cursor-pointer ${
                  settings.zenPreference === "black"
                    ? "bg-black text-white border-white/40 ring-2 ring-white/20"
                    : "bg-neutral-900/60 text-neutral-400 border-white/10 hover:border-white/20"
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-300" />
                <span>Void Black (#000000)</span>
              </button>

              <button
                onClick={() => {
                  updateSettings({ zenPreference: "white" });
                  setZenTheme("white");
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium text-xs transition-all cursor-pointer ${
                  settings.zenPreference === "white"
                    ? "bg-white text-black border-neutral-300 ring-2 ring-white/20"
                    : "bg-neutral-900/60 text-neutral-400 border-white/10 hover:border-white/20"
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Paper White (#FAFAFA)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
