import { NextResponse } from "next/server";
import { db } from "@db/client";
import { vocabEntries } from "@db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get("topic");
  const type = searchParams.get("type");

  try {
    let query = db.select().from(vocabEntries).$dynamic();

    if (topicId) {
      query = query.where(eq(vocabEntries.topicId, topicId));
    }

    const rows = await query;

    // Filter by type if requested
    const filtered = type ? rows.filter((r) => r.type === type) : rows;

    // Parse tags JSON
    const result = filtered.map((r) => ({
      ...r,
      tags: JSON.parse(r.tags ?? "[]") as string[],
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/vocab error:", error);
    return NextResponse.json({ error: "Failed to fetch vocabulary" }, { status: 500 });
  }
}
