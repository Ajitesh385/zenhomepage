"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import confetti from "canvas-confetti";
import {
  Plus,
  Trash2,
  Copy,
  Check,
  Maximize2,
  ListTodo,
  FileText,
  Pin,
  Sparkles,
} from "lucide-react";

export default function Notepad() {
  const {
    notes,
    activeNoteId,
    setActiveNoteId,
    updateNoteContent,
    updateNoteTitle,
    createNote,
    deleteNote,
    togglePinNote,
    toggleZenMode,
    syncStatus,
  } = useAppStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [viewMode, setViewMode] = useState<"write" | "tasks">("write");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Auto-focus textarea when active note switches
  useEffect(() => {
    if (viewMode === "write") {
      textareaRef.current?.focus();
    }
  }, [activeNoteId, viewMode]);

  if (!activeNote) {
    return (
      <div className="w-full max-w-4xl mx-auto my-6 p-8 rounded-3xl glass-panel text-center">
        <p className="text-neutral-400 mb-4">No memos available.</p>
        <button
          onClick={() => createNote("My Daily Memo")}
          className="px-4 py-2 rounded-xl bg-sky-500 text-white font-medium text-sm cursor-pointer hover:bg-sky-400 transition-colors"
        >
          Create First Note
        </button>
      </div>
    );
  }

  // Handle task checklist checkbox clicks in checklist mode
  const handleToggleTask = (lineIndex: number) => {
    const lines = activeNote.content.split("\n");
    const targetLine = lines[lineIndex];

    let completed = false;
    if (targetLine.startsWith("- [ ] ")) {
      lines[lineIndex] = targetLine.replace("- [ ] ", "- [x] ");
      completed = true;
    } else if (targetLine.startsWith("- [x] ")) {
      lines[lineIndex] = targetLine.replace("- [x] ", "- [ ] ");
    } else if (targetLine.startsWith("[ ] ")) {
      lines[lineIndex] = targetLine.replace("[ ] ", "[x] ");
      completed = true;
    } else if (targetLine.startsWith("[x] ")) {
      lines[lineIndex] = targetLine.replace("[x] ", "[ ] ");
    }

    updateNoteContent(activeNote.id, lines.join("\n"));

    if (completed) {
      // Fire delightful micro-confetti burst
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.8 },
        colors: ["#38bdf8", "#34d399", "#818cf8"],
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Word & Character count calculation
  const wordCount = activeNote.content.trim()
    ? activeNote.content.trim().split(/\s+/).length
    : 0;
  const charCount = activeNote.content.length;

  // Count total tasks and completed tasks
  const taskLines = activeNote.content.split("\n").filter((l) => /^(- \[[ x]\]|\[[ x]\])/i.test(l));
  const completedTasks = taskLines.filter((l) => /^(- \[x\]|\[x\])/i.test(l)).length;

  return (
    <div className="w-full max-w-4xl mx-auto my-4 px-4 flex-1 flex flex-col">
      <div className="flex-1 rounded-3xl glass-panel flex flex-col overflow-hidden border border-white/10 shadow-2xl relative">
        {/* Top Tab Bar: Multiple Notes Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 bg-white/[0.02] overflow-x-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {notes.map((n) => {
              const isActive = n.id === activeNote.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setActiveNoteId(n.id)}
                  className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm border border-white/15"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
                  }`}
                >
                  {n.isPinned && <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />}
                  <span className="truncate max-w-[120px]">{n.title || "Untitled"}</span>
                </button>
              );
            })}

            {/* Add New Note Button */}
            <button
              onClick={() => createNote()}
              title="Create new memo tab"
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions (Copy, Zen expand, Delete) */}
          <div className="flex items-center gap-1.5 pl-2">
            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode(viewMode === "write" ? "tasks" : "write")}
              title={viewMode === "write" ? "Switch to Checklist Mode" : "Switch to Writer Mode"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                viewMode === "tasks"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
              }`}
            >
              {viewMode === "write" ? (
                <>
                  <ListTodo className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tasks</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Write</span>
                </>
              )}
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              title="Copy memo to clipboard"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Pin note */}
            <button
              onClick={() => togglePinNote(activeNote.id)}
              title={activeNote.isPinned ? "Unpin note" : "Pin note to front"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeNote.isPinned
                  ? "text-amber-400 hover:bg-amber-400/10"
                  : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${activeNote.isPinned ? "fill-amber-400" : ""}`} />
            </button>

            {/* Expand to Zen Mode */}
            <button
              onClick={() => toggleZenMode(true)}
              title="Distraction-free Zen Mode (Z)"
              className="p-1.5 rounded-lg text-cyan-300 hover:bg-cyan-400/10 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Delete note (if more than 1 note exists) */}
            {notes.length > 1 && (
              <button
                onClick={() => {
                  if (confirm(`Delete note "${activeNote.title}"?`)) {
                    deleteNote(activeNote.id);
                  }
                }}
                title="Delete note"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Note Title Header */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={activeNote.title}
              onBlur={() => setIsEditingTitle(false)}
              onChange={(e) => updateNoteTitle(activeNote.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") setIsEditingTitle(false);
              }}
              className="text-lg font-semibold bg-white/10 text-white rounded-lg px-2 py-0.5 w-full max-w-sm focus:outline-none border border-sky-400/50"
            />
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              className="text-lg font-semibold text-white/90 hover:text-sky-300 transition-colors cursor-pointer flex items-center gap-2 group"
              title="Click to rename"
            >
              <span>{activeNote.title || "Untitled Memo"}</span>
              <span className="text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 font-normal">
                (click to edit)
              </span>
            </h2>
          )}

          {/* Quick Task completion progress badge if tasks exist */}
          {taskLines.length > 0 && (
            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>
                {completedTasks}/{taskLines.length} tasks done
              </span>
            </div>
          )}
        </div>

        {/* Note Body Area */}
        <div className="flex-1 px-6 py-2 min-h-[260px] flex flex-col">
          {viewMode === "write" ? (
            <textarea
              ref={textareaRef}
              value={activeNote.content}
              onChange={(e) => updateNoteContent(activeNote.id, e.target.value)}
              placeholder="What are your goals today? Type anything... (Use '- [ ] Task' for checkable to-dos)"
              className="w-full flex-1 bg-transparent text-sm md:text-base leading-relaxed text-neutral-200 placeholder-neutral-500 focus:outline-none resize-none font-sans"
              spellCheck={false}
            />
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 py-2">
              {activeNote.content.split("\n").map((line, idx) => {
                const isUnchecked = line.startsWith("- [ ] ") || line.startsWith("[ ] ");
                const isChecked = line.startsWith("- [x] ") || line.startsWith("[x] ");

                if (isUnchecked || isChecked) {
                  const taskText = line
                    .replace(/^(- \[[ x]\]|\[[ x]\])/i, "")
                    .trim();
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleTask(idx)}
                      className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <button
                        type="button"
                        className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          isChecked
                            ? "bg-emerald-500 border-emerald-500 text-black shadow-sm"
                            : "border-neutral-500 group-hover:border-white/70"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <span
                        className={`text-sm md:text-base select-none transition-colors ${
                          isChecked
                            ? "line-through text-neutral-500"
                            : "text-neutral-200 group-hover:text-white"
                        }`}
                      >
                        {taskText || <i>Empty task</i>}
                      </span>
                    </div>
                  );
                }

                if (line.startsWith("### ")) {
                  return (
                    <h4 key={idx} className="text-base font-semibold text-white mt-3 mb-1">
                      {line.slice(4)}
                    </h4>
                  );
                }

                if (line.startsWith("> ")) {
                  return (
                    <blockquote
                      key={idx}
                      className="border-l-2 border-sky-400 pl-3 italic text-neutral-400 text-sm my-1"
                    >
                      {line.slice(2)}
                    </blockquote>
                  );
                }

                if (!line.trim()) {
                  return <div key={idx} className="h-2" />;
                }

                return (
                  <p key={idx} className="text-sm md:text-base text-neutral-300">
                    {line}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Status Bar: Word count, Sync state, Quick Help */}
        <div className="flex items-center justify-between px-6 py-2.5 border-t border-white/10 bg-white/[0.01] text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>
              {wordCount} {wordCount === 1 ? "word" : "words"} &middot; {charCount} chars
            </span>
            <span className="hidden sm:inline text-neutral-500">&middot;</span>
            <span className="hidden sm:inline text-neutral-500">
              Tip: Use <code className="text-neutral-400 bg-white/5 px-1 rounded">- [ ]</code> for tasks
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                syncStatus === "saved"
                  ? "bg-emerald-400"
                  : syncStatus === "syncing"
                  ? "bg-sky-400 animate-pulse"
                  : "bg-amber-400"
              }`}
            />
            <span className="capitalize">{syncStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
