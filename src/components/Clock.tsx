"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Maximize2, Minimize2, Sparkles } from "lucide-react";

export default function Clock() {
  const {
    settings,
    isFullscreenClock,
    toggleFullscreenClock,
    setIsFullscreenClock,
  } = useAppStore();

  const [timeParts, setTimeParts] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    period: "",
  });
  const [dateString, setDateString] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour24 = now.getHours();

      // Greeting
      if (hour24 >= 5 && hour24 < 12) setGreeting("Good morning");
      else if (hour24 >= 12 && hour24 < 17) setGreeting("Good afternoon");
      else if (hour24 >= 17 && hour24 < 22) setGreeting("Good evening");
      else setGreeting("Deep night focus");

      // 24h format as requested
      const is12h = settings.clockFormat === "12h";
      const displayHours = is12h
        ? hour24 % 12 || 12
        : hour24;

      setTimeParts({
        hours: String(displayHours).padStart(2, "0"),
        minutes: String(now.getMinutes()).padStart(2, "0"),
        seconds: String(now.getSeconds()).padStart(2, "0"),
        period: is12h ? (hour24 >= 12 ? "PM" : "AM") : "",
      });

      setDateString(
        now.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.clockFormat]);

  // Fullscreen escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreenClock) {
        setIsFullscreenClock(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenClock, setIsFullscreenClock]);

  // Style variations
  const getClockStyleClasses = () => {
    switch (settings.clockStyle) {
      case "glow":
        return "font-mono font-light text-cyan-300 drop-shadow-[0_0_25px_rgba(56,189,248,0.45)]";
      case "cyber":
        return "font-mono font-bold tracking-widest text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]";
      case "serif":
        return "font-serif font-normal tracking-tight text-white/95";
      case "clean":
        return "font-sans font-semibold tracking-tight text-white/95";
      case "minimal":
      default:
        return "font-mono font-extralight tracking-tight text-white/90";
    }
  };

  return (
    <>
      {/* Centerpiece Homepage Clock */}
      <div className="w-full max-w-4xl mx-auto my-4 px-4 text-center select-none">
        <div
          onDoubleClick={toggleFullscreenClock}
          title="Double-click to enter Fullscreen Clock mode"
          className="group inline-flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl glass-panel border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
          {/* Subtle top indicator */}
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-widest">{greeting}</span>
            <span className="text-neutral-600">&middot;</span>
            <span className="text-[11px] text-neutral-500 group-hover:text-sky-300 transition-colors">
              Double-click for Fullscreen
            </span>
          </div>

          {/* Time Display */}
          <div className="flex items-baseline justify-center">
            <span
              className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl transition-all duration-300 leading-none ${getClockStyleClasses()}`}
            >
              {timeParts.hours}
              <span className="animate-pulse opacity-75 inline-block mx-1">:</span>
              {timeParts.minutes}
            </span>

            {settings.showSeconds && (
              <span className="text-2xl sm:text-3xl md:text-4xl font-mono text-neutral-400 ml-2 font-light">
                :{timeParts.seconds}
              </span>
            )}

            {timeParts.period && (
              <span className="text-sm sm:text-base font-mono font-medium text-neutral-400 ml-2">
                {timeParts.period}
              </span>
            )}
          </div>

          {/* Date string */}
          <div className="mt-3 text-sm md:text-base text-neutral-300 font-medium tracking-wide">
            {dateString}
          </div>

          {/* Double click hover prompt */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Fullscreen Immersion Mode */}
      {isFullscreenClock && (
        <div
          onDoubleClick={toggleFullscreenClock}
          className="fixed inset-0 z-50 bg-[#05070e] flex flex-col items-center justify-center p-6 select-none cursor-pointer animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Ambient orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl animate-pulse-subtle" />
            <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-subtle" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4 text-sm font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="uppercase tracking-widest">{greeting}</span>
            </div>

            <div className="flex items-baseline justify-center">
              <span
                className={`text-8xl sm:text-9xl md:text-[14rem] leading-none ${getClockStyleClasses()}`}
              >
                {timeParts.hours}
                <span className="animate-pulse opacity-75 inline-block mx-2">:</span>
                {timeParts.minutes}
              </span>

              {settings.showSeconds && (
                <span className="text-4xl sm:text-5xl md:text-7xl font-mono text-neutral-400 ml-4 font-light">
                  :{timeParts.seconds}
                </span>
              )}

              {timeParts.period && (
                <span className="text-xl md:text-3xl font-mono font-medium text-neutral-400 ml-4">
                  {timeParts.period}
                </span>
              )}
            </div>

            <div className="mt-6 text-lg sm:text-2xl text-neutral-300 font-medium tracking-wide">
              {dateString}
            </div>

            <div className="mt-12 flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs text-neutral-400 border border-white/10">
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Double-click anywhere or press Esc to exit</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
