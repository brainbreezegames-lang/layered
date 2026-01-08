import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/pipeline/fetch-news";
import { processArticle } from "@/lib/pipeline/process-article";

export const maxDuration = 60; // 1 minute for manual refresh

export async function POST() {
  console.log("Manual refresh triggered...");
  console.log(new Date().toISOString());

  try {
    // Fetch all news
    const allNews = await fetchAllNews();
    console.log(`Found ${allNews.length} articles`);

    // Process max 3 articles per manual refresh (faster response)
    const toProcess = allNews.slice(0, 3);
    let processed = 0;

    for (const newsItem of toProcess) {
      try {
        const result = await processArticle(newsItem);
        if (result) processed++;
      } catch (error) {
        console.error(`Failed to process ${newsItem.title}:`, error);
      }
    }

    console.log(`Manual refresh complete! Processed ${processed} articles.`);

    return NextResponse.json({
      success: true,
      processed,
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
