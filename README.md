# 🌌 Aether — Firefox Productivity Startpage

A fast, responsive, and customizable browser start page engineered for **Firefox**, built with **Next.js 16**, **Tailwind CSS**, **Prisma ORM**, and **SQLite/PostgreSQL**.

Designed for deep focus, daily task tracking, quick web navigation, and zero-distraction writing.

---

## ✨ Features

- ⚡ **Instantaneous (0ms Perceived Latency)**: LocalStorage optimistic cache ensures new tabs open immediately without waiting on remote queries.
- 📝 **Live Memo & Notepad**:
  - Multi-tab memos (*Daily Focus*, *Scratchpad*, *Goals*).
  - Interactive checklists: Auto-parses `- [ ] task` into click-to-complete items with micro-confetti feedback.
  - Live auto-save and sync status indicators.
- 🧘 **Monolithic Zen Mode**:
  - Triggered with **`Z`** or one click.
  - Switchable between **Void Black** (`#000000` pitch OLED) and **Paper White** (`#FAFAFA` warm ivory).
  - Distraction-free typewriter canvas.
- 🚀 **Speed Dial / Bookmarks**:
  - Hotkeys: Press **`1`** through **`9`** to immediately open favorite pinned sites.
  - High-resolution Google favicon resolution.
- 🔍 **Universal Search Bar with Bangs**:
  - Bang prefix triggers: `!g` (Google), `!d` (DuckDuckGo), `!p` (Perplexity AI), `!yt` (YouTube), `!gh` (GitHub), and `!w` (Wikipedia).
  - Direct URL detection.
  - Quick focus via **`/`** or **`Ctrl+K`**.
- 🎨 **Atmospheric Customization**:
  - 5 Themes: *Aurora Midnight*, *Obsidian Void*, *Cyber Neon*, *Minimal Matte*, and *Nordic Daylight*.
  - Configurable widgets (Clock, Greeting, Speed Dial, 12h/24h time).
  - Custom wallpaper URL support.
- 🗄️ **Full Backend & Database**:
  - Prisma ORM with SQLite (local development) and instant compatibility with PostgreSQL / Neon / Turso for cloud hosting.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database / ORM**: [Prisma ORM](https://www.prisma.io/) + SQLite / PostgreSQL
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with LocalStorage persistence
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Micro-animations**: [Lucide React](https://lucide.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Ajitesh385/firefox-homepage.git
cd firefox-homepage
npm install
```

### 2. Set Up Database
```bash
npx prisma db push
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in Firefox!

---

## 🦊 Set as Firefox Start Page

1. Open Firefox and go to **Settings** &rarr; **Home** (or paste `about:preferences#home` into the URL bar).
2. Under **Homepage and new windows**, choose **Custom URLs...** and enter `http://localhost:3000` (or your Vercel URL).
3. Under **New tabs**, select **Homepage and new windows**.

---

## ☁️ Deploy to Vercel

1. Push your repository to GitHub.
2. Import the repo on [Vercel](https://vercel.com).
3. Add environment variable `DATABASE_URL` (using Neon, Vercel Postgres, or Supabase).
4. Click **Deploy**!
