"use client";

import React, { useState, useEffect } from "react";
import { useAppStore, ShortcutItem } from "@/lib/store";
import { Plus, X, Globe, ExternalLink } from "lucide-react";

export default function SpeedDial() {
  const { shortcuts, addShortcut, deleteShortcut, settings } = useAppStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Number shortcuts listener (1-9) to launch sites directly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        const target = shortcuts[num - 1];
        if (target) {
          e.preventDefault();
          window.location.href = target.url;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  if (!settings.showShortcuts) return null;

  const handleAddShortcut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    setIsSubmitting(true);
    await addShortcut({
      title: newTitle.trim(),
      url: newUrl.trim(),
    });
    setNewTitle("");
    setNewUrl("");
    setIsSubmitting(false);
    setIsAddModalOpen(false);
  };

  const getFaviconUrl = (url: string) => {
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
    } catch {
      return "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 px-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {shortcuts.map((item, index) => {
          const favicon = getFaviconUrl(item.url);
          return (
            <div key={item.id} className="relative group">
              <a
                href={item.url}
                className="flex flex-col items-center justify-center p-3 rounded-2xl glass-panel hover:scale-[1.04] active:scale-[0.98] transition-all duration-200 text-center cursor-pointer border border-white/5 hover:border-white/20 group-hover:shadow-lg group-hover:shadow-black/30"
              >
                {/* Hotkey badge */}
                {index < 9 && (
                  <span className="absolute top-1.5 left-2 text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index + 1}
                  </span>
                )}

                {/* Favicon / Icon */}
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-2 overflow-hidden group-hover:bg-white/10 transition-colors p-1.5">
                  {favicon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={favicon}
                      alt={item.title}
                      className="w-6 h-6 object-contain rounded-md"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Globe className="w-5 h-5 text-neutral-400" />
                  )}
                </div>

                {/* Label */}
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white truncate max-w-[85px]">
                  {item.title}
                </span>
              </a>

              {/* Delete button on hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteShortcut(item.id);
                }}
                className="absolute -top-1 -right-1 p-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                title="Remove shortcut"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Add Shortcut Tile */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex flex-col items-center justify-center p-3 rounded-2xl glass-panel border border-dashed border-white/15 hover:border-white/30 text-neutral-400 hover:text-white hover:scale-[1.04] transition-all cursor-pointer min-h-[90px]"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-2">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">Add Link</span>
        </button>
      </div>

      {/* Add Shortcut Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl glass-panel p-6 shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Add Pinned Bookmark</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddShortcut} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-medium">
                  Website Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linear, Twitter, Docs"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-sky-400/50"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-medium">
                  Website URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-sky-400/50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-sky-500 hover:bg-sky-400 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Pin Shortcut"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
