import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_SHORTCUTS = [
  { title: "GitHub", url: "https://github.com", icon: "github", orderIndex: 0 },
  { title: "YouTube", url: "https://youtube.com", icon: "youtube", orderIndex: 1 },
  { title: "Reddit", url: "https://reddit.com", icon: "globe", orderIndex: 2 },
  { title: "Gmail", url: "https://mail.google.com", icon: "mail", orderIndex: 3 },
  { title: "ChatGPT", url: "https://chatgpt.com", icon: "bot", orderIndex: 4 },
  { title: "Vercel", url: "https://vercel.com", icon: "triangle", orderIndex: 5 },
];

export async function GET() {
  try {
    let shortcuts = await prisma.shortcut.findMany({
      orderBy: { orderIndex: "asc" },
    });

    if (shortcuts.length === 0) {
      for (const item of DEFAULT_SHORTCUTS) {
        await prisma.shortcut.create({ data: item });
      }
      shortcuts = await prisma.shortcut.findMany({
        orderBy: { orderIndex: "asc" },
      });
    }

    return NextResponse.json(shortcuts);
  } catch (error) {
    console.error("Error fetching shortcuts:", error);
    return NextResponse.json({ error: "Failed to fetch shortcuts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, url, icon = "globe" } = body;

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
    }

    const count = await prisma.shortcut.count();

    const shortcut = await prisma.shortcut.create({
      data: {
        title,
        url: url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`,
        icon,
        orderIndex: count,
      },
    });

    return NextResponse.json(shortcut, { status: 201 });
  } catch (error) {
    console.error("Error creating shortcut:", error);
    return NextResponse.json({ error: "Failed to create shortcut" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, url, icon, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: "Shortcut ID is required" }, { status: 400 });
    }

    const updated = await prisma.shortcut.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(url !== undefined && {
          url: url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`,
        }),
        ...(icon !== undefined && { icon }),
        ...(orderIndex !== undefined && { orderIndex }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating shortcut:", error);
    return NextResponse.json({ error: "Failed to update shortcut" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Shortcut ID is required" }, { status: 400 });
    }

    await prisma.shortcut.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting shortcut:", error);
    return NextResponse.json({ error: "Failed to delete shortcut" }, { status: 500 });
  }
}
