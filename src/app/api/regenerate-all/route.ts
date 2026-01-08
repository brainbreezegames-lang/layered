import { db } from "@/lib/db";
import { generateLevelHeadlines, generateVocabulary } from "@/lib/pipeline/ai-generate";
import { NextResponse } from "next/server";
import { Level } from "@/types";

export async function POST() {
  try {
    console.log("FORCE regenerating ALL articles...");

    const articles = await db.article.findMany();
    console.log(`Found ${articles.length} articles`);

    let updated = 0;
    let failed = 0;

    for (const article of articles) {
      try {
        console.log(`\nProcessing: ${article.title}`);

        // Generate headlines and vocabulary in parallel
        const [headlines, vocabulary] = await Promise.all([
          generateLevelHeadlines(
            article.title,
            article.subtitle || "",
            article.content as Record<Level, string>
          ),
          generateVocabulary(article.content as Record<Level, string>)
        ]);

        console.log(`- Generated ${vocabulary.length} vocabulary words`);
        console.log(`- Generated headlines for all levels`);

        // Update article
        await db.article.update({
          where: { id: article.id },
          data: {
            titles: headlines.titles as Record<string, string>,
            subtitles: headlines.subtitles as Record<string, string>,
            vocabulary: vocabulary,
          },
        });

        console.log(`✓ Updated: ${article.slug}`);
        updated++;

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 4000));
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
    console.error("Regeneration error:", error);
    return NextResponse.json(
      { error: "Failed to regenerate", details: String(error) },
      { status: 500 }
    );
  }
}
