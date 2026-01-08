import { db } from "@/lib/db";
import { generateLevelHeadlines } from "@/lib/pipeline/ai-generate";
import { NextResponse } from "next/server";
import { Level } from "@/types";

export async function POST() {
  try {
    console.log("Starting headline backfill...");

    // Get all articles that don't have level-specific titles yet
    const articles = await db.article.findMany();
    console.log(`Found ${articles.length} articles to process`);

    let updated = 0;
    let failed = 0;

    for (const article of articles) {
      try {
        // Skip if already has level-specific titles
        if (article.titles) {
          console.log(`- Skipped (already has titles): ${article.slug}`);
          continue;
        }

        console.log(`Processing: ${article.title}`);

        // Generate level-specific headlines
        const headlines = await generateLevelHeadlines(
          article.title,
          article.subtitle || "",
          article.content as Record<Level, string>
        );

        // Update article with new headlines
        await db.article.update({
          where: { id: article.id },
          data: {
            titles: headlines.titles as Record<string, string>,
            subtitles: headlines.subtitles as Record<string, string>,
          },
        });

        console.log(`✓ Updated: ${article.slug}`);
        updated++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`✗ Failed: ${article.slug}`, error);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      total: articles.length,
      updated,
      failed,
    });
  } catch (error) {
    console.error("Backfill error:", error);
    return NextResponse.json(
      { error: "Failed to backfill headlines" },
      { status: 500 }
    );
  }
}
