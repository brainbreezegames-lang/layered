import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVocabulary } from "@/lib/pipeline/ai-generate";
import { Level } from "@/types";

export const maxDuration = 300; // 5 minutes max

export async function POST() {
  console.log("Backfilling vocabulary for existing articles...");

  try {
    // Get all articles that don't have vocabulary
    const articles = await db.article.findMany({
      where: {
        OR: [
          { vocabulary: { equals: null } },
          { vocabulary: { equals: [] } },
        ],
      },
      select: {
        id: true,
        slug: true,
        content: true,
      },
      take: 5, // Process 5 at a time to avoid timeout
    });

    console.log(`Found ${articles.length} articles without vocabulary`);

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All articles already have vocabulary",
        processed: 0,
      });
    }

    let processed = 0;

    for (const article of articles) {
      try {
        console.log(`Processing: ${article.slug}`);

        const content = article.content as Record<Level, string>;
        const vocabulary = await generateVocabulary(content);

        await db.article.update({
          where: { id: article.id },
          data: { vocabulary },
        });

        processed++;
        console.log(`✓ Updated vocabulary for: ${article.slug}`);
      } catch (error) {
        console.error(`Failed to process ${article.slug}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      remaining: articles.length - processed,
    });
  } catch (error) {
    console.error("Backfill failed:", error);
    return NextResponse.json(
      { error: "Backfill failed", details: String(error) },
      { status: 500 }
    );
  }
}
