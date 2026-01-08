import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/pipeline/fetch-news";
import { processArticle } from "@/lib/pipeline/process-article";
import { db } from "@/lib/db";

// Allow up to 5 minutes for processing
export const maxDuration = 300;

export async function POST() {
  const results: { title: string; status: "success" | "error" | "skipped"; message?: string }[] = [];

  try {
    console.log("Fetching articles from RSS feeds...");

    // 1. Fetch all news from RSS
    const allNews = await fetchAllNews();
    console.log(`Found ${allNews.length} articles from RSS`);

    if (allNews.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No articles found from RSS feeds",
        results: [],
      });
    }

    // 2. Get existing articles to avoid duplicates
    const existingArticles = await db.article.findMany();
    const existingUrls = new Set(existingArticles.map((a) => a.sourceUrl));
    console.log(`Database has ${existingArticles.length} existing articles`);

    // 3. Filter to only new articles
    const newArticles = allNews.filter((item) => !existingUrls.has(item.link));
    console.log(`Found ${newArticles.length} new articles to process`);

    if (newArticles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All RSS articles already in database",
        processed: 0,
        results: [],
      });
    }

    // 4. Process up to 6 articles
    const toProcess = newArticles.slice(0, 6);
    let successCount = 0;

    for (const newsItem of toProcess) {
      try {
        console.log(`\n📰 Processing: ${newsItem.title}`);
        const result = await processArticle(newsItem);

        if (result) {
          results.push({
            title: newsItem.title,
            status: "success",
          });
          successCount++;
          console.log(`✅ Success: ${newsItem.title}`);
        } else {
          results.push({
            title: newsItem.title,
            status: "skipped",
            message: "Article too short or extraction failed",
          });
          console.log(`⏭️ Skipped: ${newsItem.title}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${newsItem.title}:`, error);
        results.push({
          title: newsItem.title,
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${successCount} of ${toProcess.length} articles`,
      processed: successCount,
      results,
    });
  } catch (error) {
    console.error("Fetch articles failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        results,
      },
      { status: 500 }
    );
  }
}
