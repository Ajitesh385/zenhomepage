"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import Header from "@/components/Header";
import Clock from "@/components/Clock";
import LifeCalendar from "@/components/LifeCalendar";
import Notepad from "@/components/Notepad";
import ZenMode from "@/components/ZenMode";
import SettingsModal from "@/components/SettingsModal";

export default function Home() {
  const { settings, toggleZenMode, fetchInitialData } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchInitialData();
  }, [fetchInitialData]);

  // Global hotkey 'Z' to toggle Zen mode
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        toggleZenMode();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [toggleZenMode]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400/20 border-t-sky-400 animate-spin" />
      </div>
    );
  }

  const getThemeBackgroundClass = () => {
    switch (settings.theme) {
      case "obsidian":
        return "bg-mesh-obsidian";
      case "aurora":
        return "bg-mesh-cyber";
      case "dusk":
        return "bg-mesh-minimal";
      case "light":
        return "bg-mesh-light theme-light";
      case "midnight":
      default:
        return "bg-mesh-aurora";
    }
  };

  return (
    <main
      className={`min-h-screen flex flex-col justify-between relative transition-colors duration-500 overflow-x-hidden ${getThemeBackgroundClass()}`}
      style={
        settings.customBgUrl
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(5,7,15,0.75), rgba(5,7,15,0.9)), url(${settings.customBgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : undefined
      }
    >
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-subtle" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col flex-1 pb-10">
        <Header />

        {/* Centerpiece 1: The Grand Clock (Double-click for Fullscreen) */}
        <Clock />

        {/* Centerpiece 2: Life in Rectangles & Birthday Countdown */}
        <LifeCalendar />

        {/* Centerpiece 3: Fully Customizable Notepad */}
        <Notepad />
      </div>

      {/* Fullscreen Zen Mode Overlay */}
      <ZenMode />

      {/* Settings Modal */}
      <SettingsModal />
    </main>
  );
}
