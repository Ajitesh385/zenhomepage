"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Search, Globe, ExternalLink, ChevronDown } from "lucide-react";

interface EngineConfig {
  id: "google" | "duckduckgo" | "perplexity" | "youtube" | "github" | "wikipedia";
  name: string;
  url: string;
  prefix: string;
  iconColor: string;
}

const SEARCH_ENGINES: EngineConfig[] = [
  {
    id: "google",
    name: "Google",
    url: "https://www.google.com/search?q=",
    prefix: "!g",
    iconColor: "text-blue-400",
  },
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
    prefix: "!d",
    iconColor: "text-orange-400",
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    url: "https://www.perplexity.ai/search?q=",
    prefix: "!p",
    iconColor: "text-teal-400",
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com/results?search_query=",
    prefix: "!yt",
    iconColor: "text-red-400",
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/search?q=",
    prefix: "!gh",
    iconColor: "text-purple-400",
  },
  {
    id: "wikipedia",
    name: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Special:Search?search=",
    prefix: "!w",
    iconColor: "text-neutral-300",
  },
];

export default function SearchBar() {
  const { settings, updateSettings } = useAppStore();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentEngine =
    SEARCH_ENGINES.find((e) => e.id === settings.searchEngine) || SEARCH_ENGINES[0];

  // Hotkey listener: '/' or 'Ctrl+K' focuses the search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is already typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "/" || (e.key === "k" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Check for URL directly (e.g. localhost:3000, github.com, https://...)
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.includes("localhost") ||
      (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed) && !trimmed.includes(" "))
    ) {
      const url = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      window.location.href = url;
      return;
    }

    // Check for bang prefixes (e.g. !yt lo-fi beats)
    for (const engine of SEARCH_ENGINES) {
      if (trimmed.startsWith(engine.prefix + " ")) {
        const queryWithoutPrefix = trimmed.slice(engine.prefix.length + 1).trim();
        window.location.href = `${engine.url}${encodeURIComponent(queryWithoutPrefix)}`;
        return;
      }
    }

    // Default search engine execution
    window.location.href = `${currentEngine.url}${encodeURIComponent(trimmed)}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4 px-4 relative z-20">
      <form
        onSubmit={handleSearch}
        className={`relative flex items-center w-full rounded-2xl glass-panel px-4 py-3 transition-all duration-300 ${
          isFocused
            ? "ring-2 ring-sky-400/40 shadow-2xl shadow-sky-950/40 border-sky-400/30 scale-[1.01]"
            : "hover:border-white/20"
        }`}
      >
        {/* Engine Dropdown Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors mr-2 cursor-pointer"
          >
            <span className={currentEngine.iconColor}>{currentEngine.name}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl glass-panel p-1.5 shadow-2xl border border-white/15 backdrop-blur-2xl z-50">
              <div className="text-[10px] uppercase font-semibold text-neutral-400 px-2 py-1 tracking-wider">
                Select Engine
              </div>
              {SEARCH_ENGINES.map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => {
                    updateSettings({ searchEngine: engine.id });
                    setIsMenuOpen(false);
                    inputRef.current?.focus();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                    settings.searchEngine === engine.id
                      ? "bg-white/15 text-white font-medium"
                      : "text-neutral-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={engine.iconColor}>{engine.name}</span>
                  <span className="font-mono text-[10px] text-neutral-400">{engine.prefix}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <Search className="w-4 h-4 text-neutral-400 mr-2.5 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={`Search ${currentEngine.name} or type URL... (press '/' to focus)`}
          className="w-full bg-transparent text-sm md:text-base text-white placeholder-neutral-500 focus:outline-none font-sans"
        />

        {/* Right side helper / submit */}
        {query ? (
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 transition-colors ml-2 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1 ml-2 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-white/5 rounded border border-white/10">
              /
            </kbd>
          </div>
        )}
      </form>
    </div>
  );
}
