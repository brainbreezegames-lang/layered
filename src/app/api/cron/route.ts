import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/pipeline/fetch-news";
import { processArticle } from "@/lib/pipeline/process-article";

export const maxDuration = 300; // 5 minutes max for Vercel

export async function GET(request: NextRequest) {
  // Verify cron secret (set in Vercel)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Starting daily pipeline...");
  console.log(new Date().toISOString());

  try {
    // Fetch all news
    const allNews = await fetchAllNews();
    console.log(`Found ${allNews.length} articles`);

    // Process max 5 articles per run (to stay within time limits)
    const toProcess = allNews.slice(0, 5);
    let processed = 0;

    for (const newsItem of toProcess) {
      try {
        const result = await processArticle(newsItem);
        if (result) processed++;
      } catch (error) {
        console.error(`Failed to process ${newsItem.title}:`, error);
      }
    }

    console.log(`Pipeline complete! Processed ${processed} articles.`);

    return NextResponse.json({
      success: true,
      processed,
      total: allNews.length,
    });
  } catch (error) {
    console.error("Pipeline failed:", error);
    return NextResponse.json(
      { error: "Pipeline failed", details: String(error) },
      { status: 500 }
    );
  }
}
