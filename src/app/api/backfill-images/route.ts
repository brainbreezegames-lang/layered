import { db } from "@/lib/db";
import { getArticleImage } from "@/lib/pipeline/image-search";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("Starting image backfill...");

    // Get all articles
    const articles = await db.article.findMany();
    console.log(`Found ${articles.length} articles to process`);

    let updated = 0;
    let failed = 0;

    for (const article of articles) {
      try {
        console.log(`Processing: ${article.title}`);

        // Get new relevant image
        const newImage = await getArticleImage(article.title, article.category);

        if (newImage && newImage !== article.heroImage) {
          await db.article.update({
            where: { id: article.id },
            data: {
              heroImage: newImage,
              heroAlt: article.title,
            },
          });
          console.log(`✓ Updated: ${article.slug}`);
          updated++;
        } else {
          console.log(`- Skipped (no change): ${article.slug}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
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
      { error: "Failed to backfill images" },
      { status: 500 }
    );
  }
}
