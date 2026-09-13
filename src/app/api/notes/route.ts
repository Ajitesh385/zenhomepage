import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let notes = await prisma.note.findMany({
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    });

    // Seed an initial note if completely empty
    if (notes.length === 0) {
      const defaultNote = await prisma.note.create({
        data: {
          title: "Daily Focus & Tasks",
          content: `### Welcome to your Firefox Homepage ✨

- [ ] Plan today's primary focus
- [ ] Review pending pull requests
- [ ] Take a 10-minute mindfulness break

Tip: Press 'Z' or click the Zen button to enter distraction-free pure Black/White mode.`,
          isPinned: true,
        },
      });
      notes = [defaultNote];
    }

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title = "New Note", content = "" } = body;

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, content, isPinned } = body;

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(isPinned !== undefined && { isPinned }),
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
