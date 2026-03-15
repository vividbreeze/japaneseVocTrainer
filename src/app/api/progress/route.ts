import { NextResponse } from "next/server";
import { db } from "@db/client";
import { progress, vocabEntries } from "@db/schema";
import { eq, and, lte } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get("topicId");
  const dueOnly = searchParams.get("due") === "true";

  try {
    const now = Date.now();

    // Join progress with vocab to filter by topic
    if (topicId) {
      const vocabRows = await db
        .select({ id: vocabEntries.id })
        .from(vocabEntries)
        .where(eq(vocabEntries.topicId, topicId));
      const vocabIds = vocabRows.map((v) => v.id);

      if (vocabIds.length === 0) return NextResponse.json([]);

      const allProgress = await db.select().from(progress);
      let filtered = allProgress.filter((p) => vocabIds.includes(p.vocabId));

      if (dueOnly) {
        filtered = filtered.filter((p) => p.dueDate <= now);
      }

      return NextResponse.json(filtered);
    }

    let query = db.select().from(progress).$dynamic();
    if (dueOnly) {
      query = query.where(lte(progress.dueDate, now));
    }

    const rows = await query;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/progress error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get("topicId");

  try {
    if (topicId) {
      const vocabRows = await db
        .select({ id: vocabEntries.id })
        .from(vocabEntries)
        .where(eq(vocabEntries.topicId, topicId));
      const vocabIds = vocabRows.map((v) => v.id);

      for (const id of vocabIds) {
        await db.delete(progress).where(eq(progress.vocabId, id));
      }
      return NextResponse.json({ deleted: vocabIds.length });
    }

    // Reset all
    await db.delete(progress);
    return NextResponse.json({ deleted: "all" });
  } catch (error) {
    console.error("DELETE /api/progress error:", error);
    return NextResponse.json({ error: "Failed to reset progress" }, { status: 500 });
  }
}
