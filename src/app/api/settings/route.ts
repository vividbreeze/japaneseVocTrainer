import { NextResponse } from "next/server";
import { db } from "@db/client";
import { settings } from "@db/schema";
import { eq } from "drizzle-orm";
import type { DisplayScript, InputMode, CardType, UserSettings } from "@/types/settings";
import type { TopicId } from "@/types/vocab";

export async function GET() {
  try {
    const rows = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);

    if (rows.length === 0) {
      // Auto-create defaults if missing
      const now = Date.now();
      await db.insert(settings).values({
        id: 1,
        displayScript: "hiragana",
        inputMode: "romaji",
        showRomaji: true,
        showEnglish: true,
        showPartOfSpeech: false,
        cardType: "word",
        sessionSize: 20,
        topicsEnabled: "[]",
        updatedAt: now,
      });
      return NextResponse.json({
        id: 1,
        displayScript: "hiragana",
        inputMode: "romaji",
        showRomaji: true,
        showEnglish: true,
        showPartOfSpeech: false,
        cardType: "word",
        sessionSize: 20,
        topicsEnabled: [],
        updatedAt: now,
      } satisfies UserSettings);
    }

    const row = rows[0];
    return NextResponse.json({
      ...row,
      showPartOfSpeech: row.showPartOfSpeech ?? false,
      sessionSize: row.sessionSize ?? 20,
      topicsEnabled: JSON.parse(row.topicsEnabled ?? "[]") as TopicId[],
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json() as Partial<{
      displayScript: DisplayScript;
      inputMode: InputMode;
      showRomaji: boolean;
      showEnglish: boolean;
      showPartOfSpeech: boolean;
      cardType: CardType;
      sessionSize: number;
      topicsEnabled: TopicId[];
    }>;

    const updates: Record<string, unknown> = { updatedAt: Date.now() };

    if (body.displayScript !== undefined) updates.displayScript = body.displayScript;
    if (body.inputMode !== undefined) updates.inputMode = body.inputMode;
    if (body.showRomaji !== undefined) updates.showRomaji = body.showRomaji;
    if (body.showEnglish !== undefined) updates.showEnglish = body.showEnglish;
    if (body.showPartOfSpeech !== undefined) updates.showPartOfSpeech = body.showPartOfSpeech;
    if (body.cardType !== undefined) updates.cardType = body.cardType;
    if (body.sessionSize !== undefined) updates.sessionSize = body.sessionSize;
    if (body.topicsEnabled !== undefined) updates.topicsEnabled = JSON.stringify(body.topicsEnabled);

    await db.update(settings).set(updates).where(eq(settings.id, 1));

    const rows = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
    const row = rows[0];
    return NextResponse.json({
      ...row,
      showPartOfSpeech: row.showPartOfSpeech ?? false,
      sessionSize: row.sessionSize ?? 20,
      topicsEnabled: JSON.parse(row.topicsEnabled ?? "[]") as TopicId[],
    });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
