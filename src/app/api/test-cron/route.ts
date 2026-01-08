import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/pipeline/fetch-news";
import { processArticle } from "@/lib/pipeline/process-article";

export const maxDuration = 300;

// Test endpoint - no auth required for debugging
export async function GET() {
  console.log("Test cron starting...");
  console.log(new Date().toISOString());

  try {
    // Fetch all news
    console.log("Fetching news...");
    const allNews = await fetchAllNews();
    console.log(`Found ${allNews.length} articles`);
    console.log("First 3 articles:", allNews.slice(0, 3).map(a => ({ title: a.title, link: a.link })));

    // Process just 1 article for testing
    const toProcess = allNews.slice(0, 1);
    let processed = 0;

    for (const newsItem of toProcess) {
      try {
        console.log(`Processing: ${newsItem.title}`);
        const result = await processArticle(newsItem);
        if (result) {
          processed++;
          console.log(`✓ Successfully processed: ${newsItem.title}`);
        } else {
          console.log(`⊘ Skipped (already exists or too short): ${newsItem.title}`);
        }
      } catch (error) {
        console.error(`Failed to process ${newsItem.title}:`, error);
        return NextResponse.json({
          error: `Failed to process article: ${error}`,
          details: String(error),
          stack: error instanceof Error ? error.stack : undefined,
        }, { status: 500 });
      }
    }

    console.log(`Test complete! Processed ${processed} articles.`);

    return NextResponse.json({
      success: true,
      processed,
      total: allNews.length,
      sample: allNews.slice(0, 5).map(a => ({ title: a.title, source: a.source })),
    });
  } catch (error) {
    console.error("Test cron failed:", error);
    return NextResponse.json(
      {
        error: "Test cron failed",
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
