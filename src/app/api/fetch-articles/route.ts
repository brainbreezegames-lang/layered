import { NextResponse } from "next/server";
import { fetchAllNews, getFullArticle } from "@/lib/pipeline/fetch-news";
import { getArticleImage } from "@/lib/pipeline/image-search";
import { db } from "@/lib/db";

// Fast endpoint - just fetches and saves raw articles (no AI)
export const maxDuration = 60;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function truncateSubtitle(text: string | undefined): string {
  if (!text) return "";
  // Clean up and truncate to ~120 chars, ending at word boundary
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 120) return cleaned;
  const truncated = cleaned.slice(0, 120);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

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
    console.log(`Found ${newArticles.length} new articles to fetch`);

    if (newArticles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All RSS articles already in database",
        processed: 0,
        results: [],
      });
    }

    // 4. Fetch and save up to 6 articles (raw, no AI)
    const toProcess = newArticles.slice(0, 6);
    let successCount = 0;

    for (const newsItem of toProcess) {
      try {
        console.log(`\n📰 Fetching: ${newsItem.title}`);

        // Get full article text
        const fullArticle = await getFullArticle(newsItem.link);
        if (!fullArticle) {
          results.push({
            title: newsItem.title,
            status: "skipped",
            message: "Failed to extract article",
          });
          continue;
        }

        if (fullArticle.textContent.length < 300) {
          results.push({
            title: newsItem.title,
            status: "skipped",
            message: "Article too short",
          });
          continue;
        }

        // Get image
        const heroImage = await getArticleImage(newsItem.title, newsItem.category);

        // Calculate word count for raw content
        const wordCount = fullArticle.textContent.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);

        // Save raw article (no AI processing yet)
        // content.raw holds the original, content.A1-C1 will be filled by process-articles
        await db.article.create({
          data: {
            slug: generateSlug(newsItem.title),
            title: newsItem.title,
            subtitle: truncateSubtitle(newsItem.description),
            category: newsItem.category,
            source: newsItem.source,
            sourceUrl: newsItem.link,
            heroImage: heroImage,
            heroAlt: newsItem.title,
            content: { raw: fullArticle.textContent },
            exercises: {},
            vocabulary: [],
            wordCounts: { raw: wordCount },
            readTimes: { raw: readTime },
            publishedAt: new Date(),
          },
        });

        results.push({
          title: newsItem.title,
          status: "success",
        });
        successCount++;
        console.log(`✅ Saved raw: ${newsItem.title}`);
      } catch (error) {
        console.error(`❌ Error fetching ${newsItem.title}:`, error);
        results.push({
          title: newsItem.title,
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fetched ${successCount} articles. Now processing with AI...`,
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
