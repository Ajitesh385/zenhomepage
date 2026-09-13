import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  isPinned?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UserSettingsItem {
  theme: "midnight" | "obsidian" | "aurora" | "dusk" | "light";
  zenPreference: "black" | "white";
  searchEngine: "google" | "duckduckgo" | "perplexity" | "youtube" | "github" | "wikipedia";
  wallpaper: "aurora" | "mesh" | "minimal" | "cyber" | "custom";
  customBgUrl: string;
  showClock: boolean;
  showShortcuts: boolean;
  clockFormat: "12h" | "24h";
  clockStyle: "minimal" | "glow" | "cyber" | "serif" | "clean";
  showSeconds: boolean;
  birthDate: string;
  noteFont: "sans" | "mono" | "serif";
  noteFontSize: "sm" | "base" | "lg" | "xl";
  noteColor: "default" | "amber" | "emerald" | "sky" | "purple" | "rose";
  calendarView: "days" | "year" | "weeks";
}

export interface ShortcutItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  orderIndex: number;
}

interface AppState {
  notes: NoteItem[];
  activeNoteId: string;
  shortcuts: ShortcutItem[];
  settings: UserSettingsItem;
  isZenMode: boolean;
  zenTheme: "black" | "white";
  syncStatus: "saved" | "syncing" | "offline" | "error";
  isSettingsOpen: boolean;
  isFullscreenClock: boolean;

  // Actions
  setIsSettingsOpen: (open: boolean) => void;
  setIsFullscreenClock: (fullscreen: boolean) => void;
  toggleFullscreenClock: () => void;
  toggleZenMode: (force?: boolean) => void;
  toggleZenTheme: () => void;
  setZenTheme: (theme: "black" | "white") => void;
  setActiveNoteId: (id: string) => void;

  // Note CRUD
  updateNoteContent: (id: string, content: string) => void;
  updateNoteTitle: (id: string, title: string) => void;
  createNote: (title?: string) => Promise<string>;
  deleteNote: (id: string) => Promise<void>;
  togglePinNote: (id: string) => Promise<void>;

  // Shortcut CRUD
  addShortcut: (shortcut: { title: string; url: string; icon?: string }) => Promise<void>;
  deleteShortcut: (id: string) => Promise<void>;

  // Settings
  updateSettings: (newSettings: Partial<UserSettingsItem>) => Promise<void>;

  // Syncing
  fetchInitialData: () => Promise<void>;
}

// Debounce map for note updates
const debounceTimers: Record<string, NodeJS.Timeout> = {};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      notes: [
        {
          id: "welcome-note",
          title: "Daily Focus & Tasks",
          content: `### Welcome to your Firefox Homepage ✨\n\n- [ ] Plan today's primary focus\n- [ ] Review pending pull requests\n- [ ] Take a 10-minute mindfulness break\n\n> Press 'Z' or click the Zen button to enter distraction-free pure Black/White mode.\n> Double-click the clock to enter immersive fullscreen clock mode!`,
          isPinned: true,
          updatedAt: new Date().toISOString(),
        },
      ],
      activeNoteId: "welcome-note",
      shortcuts: [
        { id: "1", title: "GitHub", url: "https://github.com", icon: "github", orderIndex: 0 },
        { id: "2", title: "YouTube", url: "https://youtube.com", icon: "youtube", orderIndex: 1 },
      ],
      settings: {
        theme: "midnight",
        zenPreference: "black",
        searchEngine: "google",
        wallpaper: "aurora",
        customBgUrl: "",
        showClock: true,
        showShortcuts: false,
        clockFormat: "24h",
        clockStyle: "minimal",
        showSeconds: false,
        birthDate: "2003-11-15T17:05:00",
        noteFont: "sans",
        noteFontSize: "base",
        noteColor: "default",
        calendarView: "days",
      },
      isZenMode: false,
      zenTheme: "black",
      syncStatus: "saved",
      isSettingsOpen: false,
      isFullscreenClock: false,

      setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),

      setIsFullscreenClock: (fullscreen) => set({ isFullscreenClock: fullscreen }),

      toggleFullscreenClock: () =>
        set((state) => ({ isFullscreenClock: !state.isFullscreenClock })),

      toggleZenMode: (force) =>
        set((state) => ({
          isZenMode: force !== undefined ? force : !state.isZenMode,
        })),

      toggleZenTheme: () =>
        set((state) => ({
          zenTheme: state.zenTheme === "black" ? "white" : "black",
        })),

      setZenTheme: (theme) => set({ zenTheme: theme }),

      setActiveNoteId: (id) => set({ activeNoteId: id }),

      updateNoteContent: (id, content) => {
        set((state) => ({
          syncStatus: "syncing",
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n
          ),
        }));

        if (debounceTimers[id]) clearTimeout(debounceTimers[id]);
        debounceTimers[id] = setTimeout(async () => {
          try {
            const note = get().notes.find((n) => n.id === id);
            if (!note) return;

            const res = await fetch("/api/notes", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, content: note.content, title: note.title }),
            });
            if (res.ok) {
              set({ syncStatus: "saved" });
            } else {
              set({ syncStatus: "offline" });
            }
          } catch {
            set({ syncStatus: "offline" });
          }
        }, 800);
      },

      updateNoteTitle: (id, title) => {
        set((state) => ({
          syncStatus: "syncing",
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, title, updatedAt: new Date().toISOString() } : n
          ),
        }));

        if (debounceTimers[`title-${id}`]) clearTimeout(debounceTimers[`title-${id}`]);
        debounceTimers[`title-${id}`] = setTimeout(async () => {
          try {
            const note = get().notes.find((n) => n.id === id);
            if (!note) return;

            const res = await fetch("/api/notes", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, title: note.title }),
            });
            if (res.ok) set({ syncStatus: "saved" });
          } catch {
            set({ syncStatus: "offline" });
          }
        }, 800);
      },

      createNote: async (title = "New Memo") => {
        const tempId = "note-" + Date.now();
        const newNote: NoteItem = {
          id: tempId,
          title,
          content: "",
          isPinned: false,
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: tempId,
          syncStatus: "syncing",
        }));

        try {
          const res = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content: "" }),
          });
          if (res.ok) {
            const saved = await res.json();
            set((state) => ({
              notes: state.notes.map((n) => (n.id === tempId ? saved : n)),
              activeNoteId: state.activeNoteId === tempId ? saved.id : state.activeNoteId,
              syncStatus: "saved",
            }));
            return saved.id;
          }
        } catch {
          set({ syncStatus: "offline" });
        }
        return tempId;
      },

      deleteNote: async (id) => {
        const remaining = get().notes.filter((n) => n.id !== id);
        const newActive = remaining.length > 0 ? remaining[0].id : "";

        set({
          notes: remaining,
          activeNoteId: newActive,
          syncStatus: "syncing",
        });

        try {
          const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
          if (res.ok) set({ syncStatus: "saved" });
        } catch {
          set({ syncStatus: "offline" });
        }
      },

      togglePinNote: async (id) => {
        const note = get().notes.find((n) => n.id === id);
        if (!note) return;
        const updatedPin = !note.isPinned;

        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, isPinned: updatedPin } : n)),
        }));

        try {
          await fetch("/api/notes", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, isPinned: updatedPin }),
          });
        } catch (e) {
          console.warn("Offline or sync failed", e);
        }
      },

      addShortcut: async ({ title, url, icon = "globe" }) => {
        const tempId = "sc-" + Date.now();
        const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
        const newShortcut: ShortcutItem = {
          id: tempId,
          title,
          url: formattedUrl,
          icon,
          orderIndex: get().shortcuts.length,
        };

        set((state) => ({
          shortcuts: [...state.shortcuts, newShortcut],
          syncStatus: "syncing",
        }));

        try {
          const res = await fetch("/api/shortcuts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, url: formattedUrl, icon }),
          });
          if (res.ok) {
            const saved = await res.json();
            set((state) => ({
              shortcuts: state.shortcuts.map((s) => (s.id === tempId ? saved : s)),
              syncStatus: "saved",
            }));
          }
        } catch {
          set({ syncStatus: "offline" });
        }
      },

      deleteShortcut: async (id) => {
        set((state) => ({
          shortcuts: state.shortcuts.filter((s) => s.id !== id),
          syncStatus: "syncing",
        }));

        try {
          await fetch(`/api/shortcuts?id=${id}`, { method: "DELETE" });
          set({ syncStatus: "saved" });
        } catch {
          set({ syncStatus: "offline" });
        }
      },

      updateSettings: async (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
          ...(newSettings.zenPreference ? { zenTheme: newSettings.zenPreference } : {}),
        }));

        try {
          await fetch("/api/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSettings),
          });
        } catch {
          // offline
        }
      },

      fetchInitialData: async () => {
        try {
          const [notesRes, setRes] = await Promise.all([
            fetch("/api/notes"),
            fetch("/api/settings"),
          ]);

          if (notesRes.ok) {
            const notesData = await notesRes.json();
            if (Array.isArray(notesData) && notesData.length > 0) {
              set((state) => ({
                notes: notesData,
                activeNoteId: notesData.some((n: NoteItem) => n.id === state.activeNoteId)
                  ? state.activeNoteId
                  : notesData[0].id,
              }));
            }
          }

          if (setRes.ok) {
            const settingsData = await setRes.json();
            if (settingsData) {
              set((state) => ({
                settings: { ...state.settings, ...settingsData },
                zenTheme: settingsData.zenPreference || state.zenTheme,
              }));
            }
          }

          set({ syncStatus: "saved" });
        } catch {
          set({ syncStatus: "offline" });
        }
      },
    }),
    {
      name: "firefox-homescreen-storage",
      partialize: (state) => ({
        notes: state.notes,
        activeNoteId: state.activeNoteId,
        settings: state.settings,
        zenTheme: state.zenTheme,
      }),
    }
  )
);
