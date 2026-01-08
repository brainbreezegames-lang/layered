import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/pipeline/fetch-news";
import { processArticle } from "@/lib/pipeline/process-article";
import { db } from "@/lib/db";

export const maxDuration = 300;

export async function POST() {
  console.log("Force processing new article...");

  try {
    // Fetch all news
    const allNews = await fetchAllNews();
    console.log(`Found ${allNews.length} articles from RSS`);

    // Check database
    const existingArticles = await db.article.findMany({
      select: { sourceUrl: true, title: true },
    });
    console.log(`Database has ${existingArticles.length} articles`);

    const existingUrls = new Set(existingArticles.map(a => a.sourceUrl));

    // Find first article that doesn't exist
    const newArticle = allNews.find(item => !existingUrls.has(item.link));

    if (!newArticle) {
      return NextResponse.json({
        success: false,
        message: "No new articles found - all RSS articles already in database",
        rssCount: allNews.length,
        dbCount: existingArticles.length,
      });
    }

    console.log(`Processing new article: ${newArticle.title}`);
    const result = await processArticle(newArticle);

    if (result) {
      return NextResponse.json({
        success: true,
        article: {
          title: result.title,
          slug: result.slug,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Article was skipped (too short or extraction failed)",
      });
    }
  } catch (error) {
    console.error("Force processing failed:", error);
    return NextResponse.json(
      {
        error: "Failed to process",
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
