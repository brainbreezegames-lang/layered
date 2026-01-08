import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVocabulary } from "@/lib/pipeline/ai-generate";
import { Level } from "@/types";

export const maxDuration = 300; // 5 minutes max

// Support both GET and POST
export async function GET() {
  return backfillVocabulary();
}

export async function POST() {
  return backfillVocabulary();
}

async function backfillVocabulary() {
  console.log("Backfilling vocabulary for existing articles...");

  try {
    // Get all articles
    const allArticles = await db.article.findMany({
      select: {
        id: true,
        slug: true,
        content: true,
        vocabulary: true,
      },
    });

    // Filter to articles without vocabulary (null, undefined, or empty array)
    const articles = allArticles.filter(a =>
      !a.vocabulary || (Array.isArray(a.vocabulary) && a.vocabulary.length === 0)
    ).slice(0, 5); // Process 5 at a time

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
