"use client";

import React, { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { Moon, Sun, X, Check, ArrowLeft } from "lucide-react";

export default function ZenMode() {
  const {
    isZenMode,
    toggleZenMode,
    zenTheme,
    toggleZenTheme,
    notes,
    activeNoteId,
    updateNoteContent,
    syncStatus,
  } = useAppStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Global hotkeys for Zen mode: 'Z' or 'Escape' to exit, 'Shift+Tab' or 'T' to toggle Black/White
  useEffect(() => {
    if (!isZenMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        toggleZenMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZenMode, toggleZenMode]);

  // Focus textarea when entering Zen mode
  useEffect(() => {
    if (isZenMode) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  }, [isZenMode]);

  if (!isZenMode) return null;

  const isBlack = zenTheme === "black";
  const wordCount = activeNote?.content.trim()
    ? activeNote.content.trim().split(/\s+/).length
    : 0;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 select-text ${
        isBlack
          ? "bg-black text-[#ededed] selection:bg-neutral-800"
          : "bg-[#fafafa] text-[#111111] selection:bg-neutral-200"
      }`}
    >
      {/* Zen Top Header */}
      <header
        className={`w-full max-w-4xl mx-auto flex items-center justify-between px-6 py-6 transition-opacity duration-300 ${
          isBlack ? "border-b border-white/5" : "border-b border-black/5"
        }`}
      >
        {/* Left: Zen Brand & Note Title */}
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isBlack ? "bg-white/80" : "bg-black/80"
            }`}
          />
          <span
            className={`text-xs uppercase tracking-widest font-mono font-medium ${
              isBlack ? "text-neutral-400" : "text-neutral-500"
            }`}
          >
            Zen Sanctuary
          </span>
          <span className={isBlack ? "text-neutral-700" : "text-neutral-300"}>&middot;</span>
          <span
            className={`text-sm font-medium ${
              isBlack ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            {activeNote?.title || "Focus Note"}
          </span>
        </div>

        {/* Right: Black / White Switcher & Exit Button */}
        <div className="flex items-center gap-3">
          {/* Black vs White Switcher */}
          <button
            onClick={toggleZenTheme}
            title={`Switch to ${isBlack ? "Paper White" : "Void Black"} mode`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              isBlack
                ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
                : "bg-white border-neutral-200 text-neutral-700 hover:text-black hover:border-neutral-300 shadow-sm"
            }`}
          >
            {isBlack ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>White</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Black</span>
              </>
            )}
          </button>

          {/* Exit Zen Button */}
          <button
            onClick={() => toggleZenMode(false)}
            title="Exit Zen Mode (Esc)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              isBlack
                ? "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800"
                : "bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-200"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit</span>
            <kbd
              className={`px-1 py-0.2 rounded text-[10px] font-mono border ${
                isBlack ? "border-neutral-800 text-neutral-500" : "border-neutral-300 text-neutral-400"
              }`}
            >
              Esc
            </kbd>
          </button>
        </div>
      </header>

      {/* Main Typewriter Writing Canvas */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10 flex flex-col">
        <textarea
          ref={textareaRef}
          value={activeNote?.content || ""}
          onChange={(e) => {
            if (activeNote) updateNoteContent(activeNote.id, e.target.value);
          }}
          placeholder="Clear your mind. Just write..."
          className={`w-full flex-1 bg-transparent text-lg md:text-xl leading-relaxed focus:outline-none resize-none font-sans tracking-wide ${
            isBlack
              ? "text-neutral-100 placeholder-neutral-700"
              : "text-neutral-900 placeholder-neutral-400"
          }`}
          spellCheck={false}
        />
      </main>

      {/* Bottom Minimalist Footer */}
      <footer
        className={`w-full max-w-3xl mx-auto flex items-center justify-between px-6 py-4 text-xs font-mono transition-opacity ${
          isBlack ? "text-neutral-600" : "text-neutral-400"
        }`}
      >
        <div>
          {wordCount} words &middot; {activeNote?.content.length || 0} characters
        </div>

        <div className="flex items-center gap-2">
          <span>{syncStatus === "syncing" ? "Syncing..." : "Saved"}</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              syncStatus === "syncing"
                ? "bg-sky-400 animate-ping"
                : isBlack
                ? "bg-neutral-600"
                : "bg-neutral-400"
            }`}
          />
        </div>
      </footer>
    </div>
  );
}
