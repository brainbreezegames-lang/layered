import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/pipeline/fetch-news";
import { processArticle } from "@/lib/pipeline/process-article";
import { db } from "@/lib/db";

export const maxDuration = 300;

export async function POST() {
  try {
    console.log("Generating one article...");

    // Fetch news
    const allNews = await fetchAllNews();
    console.log(`Found ${allNews.length} articles from RSS`);

    if (allNews.length === 0) {
      return NextResponse.json({ error: "No articles found from RSS feeds" });
    }

    // Check database for existing
    const existingArticles = await db.article.findMany();
    const existingUrls = new Set(existingArticles.map(a => a.sourceUrl));

    // Find first new article
    const newArticle = allNews.find(item => !existingUrls.has(item.link));

    if (!newArticle) {
      return NextResponse.json({
        success: false,
        message: "All RSS articles already in database",
        rssCount: allNews.length,
        dbCount: existingArticles.length,
      });
    }

    console.log(`Processing: ${newArticle.title}`);

    // Process it
    const result = await processArticle(newArticle);

    if (result) {
      return NextResponse.json({
        success: true,
        article: {
          id: result.id,
          title: result.title,
          slug: result.slug,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Article skipped (too short or extraction failed)",
      });
    }
  } catch (error) {
    console.error("Generation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
