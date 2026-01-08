import { db } from "@/lib/db";
import { generateVocabulary } from "@/lib/pipeline/ai-generate";
import { NextResponse } from "next/server";
import { Level } from "@/types";

export async function POST() {
  try {
    console.log("Starting vocabulary regeneration with new system...");

    // Get all articles
    const articles = await db.article.findMany();
    console.log(`Found ${articles.length} articles to process`);

    let updated = 0;
    let failed = 0;

    for (const article of articles) {
      try {
        console.log(`Processing: ${article.title}`);

        // Regenerate vocabulary with new system (60 unique words, 12 per level)
        const vocabulary = await generateVocabulary(
          article.content as Record<Level, string>
        );

        if (vocabulary && vocabulary.length > 0) {
          // Update article with new vocabulary
          await db.article.update({
            where: { id: article.id },
            data: {
              vocabulary: vocabulary,
            },
          });

          console.log(`✓ Updated: ${article.slug} (${vocabulary.length} words)`);
          updated++;
        } else {
          console.log(`✗ Failed (no vocabulary): ${article.slug}`);
          failed++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
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
      { error: "Failed to backfill vocabulary" },
      { status: 500 }
    );
  }
}
