import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/pipeline/fetch-news";
import { processArticle } from "@/lib/pipeline/process-article";
import { db } from "@/lib/db";

export const maxDuration = 300; // 5 minutes max

const TARGET_ARTICLES = 3; // We want at least 3 new articles

export async function POST() {
  console.log("Manual refresh triggered...");
  console.log(new Date().toISOString());

  try {
    // Fetch all news from RSS feeds
    const allNews = await fetchAllNews();
    console.log(`Found ${allNews.length} articles from RSS feeds`);

    // Get existing article URLs to avoid duplicates
    const existingArticles = await db.article.findMany();
    const existingUrlSet = new Set(existingArticles.map((a) => a.sourceUrl));

    // Filter to only new articles
    const newArticles = allNews.filter((item) => !existingUrlSet.has(item.link));
    console.log(`${newArticles.length} are new (not in database)`);

    if (newArticles.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: "No new articles found in RSS feeds",
        total: allNews.length,
      });
    }

    // Process articles in batches until we get TARGET_ARTICLES successful ones
    // or run out of articles to try
    let successfulArticles = 0;
    let attemptedArticles = 0;
    const maxAttempts = Math.min(newArticles.length, 15); // Try up to 15 articles

    while (successfulArticles < TARGET_ARTICLES && attemptedArticles < maxAttempts) {
      // Take next batch of articles to try
      const batchSize = Math.min(3, maxAttempts - attemptedArticles);
      const batch = newArticles.slice(attemptedArticles, attemptedArticles + batchSize);

      if (batch.length === 0) break;

      console.log(`Attempting batch ${Math.floor(attemptedArticles / 3) + 1}: ${batch.length} articles...`);

      // Process batch in parallel
      const results = await Promise.allSettled(
        batch.map((newsItem) => processArticle(newsItem))
      );

      // Count successes in this batch
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === "fulfilled" && result.value !== null) {
          successfulArticles++;
          console.log(`✓ Success: ${batch[i].title}`);
        } else if (result.status === "rejected") {
          console.log(`✗ Failed: ${batch[i].title} - ${result.reason}`);
        } else {
          console.log(`- Skipped: ${batch[i].title} (already exists or too short)`);
        }
      }

      attemptedArticles += batch.length;

      // If we have enough, stop
      if (successfulArticles >= TARGET_ARTICLES) {
        console.log(`Reached target of ${TARGET_ARTICLES} articles`);
        break;
      }
    }

    console.log(`Refresh complete! Added ${successfulArticles} new articles (attempted ${attemptedArticles})`);

    return NextResponse.json({
      success: true,
      processed: successfulArticles,
      attempted: attemptedArticles,
      available: newArticles.length,
      total: allNews.length,
    });
  } catch (error) {
    console.error("Manual refresh failed:", error);
    return NextResponse.json(
      { error: "Refresh failed", details: String(error) },
      { status: 500 }
    );
  }
}
