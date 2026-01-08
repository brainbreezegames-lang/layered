import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/pipeline/fetch-news";
import { processArticle } from "@/lib/pipeline/process-article";

export const maxDuration = 300; // 5 minutes max

export async function POST() {
  console.log("Manual refresh triggered...");
  console.log(new Date().toISOString());

  try {
    // Fetch all news
    const allNews = await fetchAllNews();
    console.log(`Found ${allNews.length} articles`);

    // Process just 1 article per manual refresh (AI generation is slow)
    let processed = 0;

    for (const newsItem of allNews) {
      if (processed >= 1) break; // Only process 1 article
      try {
        const result = await processArticle(newsItem);
        if (result) {
          processed++;
          break; // Stop after successfully processing 1
        }
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
