import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          id: "default",
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
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const settings = await prisma.userSettings.upsert({
      where: { id: "default" },
      update: {
        ...(body.theme !== undefined && { theme: body.theme }),
        ...(body.zenPreference !== undefined && { zenPreference: body.zenPreference }),
        ...(body.searchEngine !== undefined && { searchEngine: body.searchEngine }),
        ...(body.wallpaper !== undefined && { wallpaper: body.wallpaper }),
        ...(body.customBgUrl !== undefined && { customBgUrl: body.customBgUrl }),
        ...(body.showClock !== undefined && { showClock: body.showClock }),
        ...(body.showShortcuts !== undefined && { showShortcuts: body.showShortcuts }),
        ...(body.clockFormat !== undefined && { clockFormat: body.clockFormat }),
        ...(body.clockStyle !== undefined && { clockStyle: body.clockStyle }),
        ...(body.showSeconds !== undefined && { showSeconds: body.showSeconds }),
        ...(body.birthDate !== undefined && { birthDate: body.birthDate }),
        ...(body.noteFont !== undefined && { noteFont: body.noteFont }),
        ...(body.noteFontSize !== undefined && { noteFontSize: body.noteFontSize }),
        ...(body.noteColor !== undefined && { noteColor: body.noteColor }),
        ...(body.calendarView !== undefined && { calendarView: body.calendarView }),
      },
      create: {
        id: "default",
        theme: body.theme ?? "midnight",
        zenPreference: body.zenPreference ?? "black",
        searchEngine: body.searchEngine ?? "google",
        wallpaper: body.wallpaper ?? "aurora",
        customBgUrl: body.customBgUrl ?? "",
        showClock: body.showClock ?? true,
        showShortcuts: body.showShortcuts ?? false,
        clockFormat: body.clockFormat ?? "24h",
        clockStyle: body.clockStyle ?? "minimal",
        showSeconds: body.showSeconds ?? false,
        birthDate: body.birthDate ?? "2003-11-15T17:05:00",
        noteFont: body.noteFont ?? "sans",
        noteFontSize: body.noteFontSize ?? "base",
        noteColor: body.noteColor ?? "default",
        calendarView: body.calendarView ?? "days",
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
