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

// Normalize title for comparison (remove punctuation, lowercase, remove common words)
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\b(the|a|an|in|on|at|to|for|of|and|or|is|are|was|were|has|have|had|says|said)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check if two titles are about the same story
function isSimilarTitle(title1: string, title2: string): boolean {
  const norm1 = normalizeTitle(title1);
  const norm2 = normalizeTitle(title2);

  // Check if one contains most of the other's key words
  const words1 = new Set(norm1.split(' ').filter(w => w.length > 3));
  const words2 = new Set(norm2.split(' ').filter(w => w.length > 3));

  if (words1.size === 0 || words2.size === 0) return false;

  let matches = 0;
  for (const word of words1) {
    if (words2.has(word)) matches++;
  }

  // If 60%+ of key words match, consider it similar
  const similarity = matches / Math.min(words1.size, words2.size);
  return similarity >= 0.6;
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
    const existingArticles = await db.article.findMany({
      select: { sourceUrl: true, title: true }
    });
    const existingUrls = new Set(existingArticles.map((a) => a.sourceUrl));
    const existingTitles = existingArticles.map((a) => a.title);
    console.log(`Database has ${existingArticles.length} existing articles`);

    // 3. Filter to only new articles (check URL and title similarity)
    const newArticles = allNews.filter((item) => {
      // Skip if URL already exists
      if (existingUrls.has(item.link)) return false;

      // Skip if title is too similar to existing article
      for (const existingTitle of existingTitles) {
        if (isSimilarTitle(item.title, existingTitle)) {
          console.log(`Skipping duplicate: "${item.title}" similar to "${existingTitle}"`);
          return false;
        }
      }
      return true;
    });
    console.log(`Found ${newArticles.length} new unique articles to fetch`);

    if (newArticles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All RSS articles already in database",
        processed: 0,
        results: [],
      });
    }

    // 4. Select articles with category variety (pick from each category)
    const byCategory: Record<string, typeof newArticles> = {};
    for (const article of newArticles) {
      if (!byCategory[article.category]) byCategory[article.category] = [];
      byCategory[article.category].push(article);
    }

    // Take 1-2 from each category to get variety
    const selected: typeof newArticles = [];
    const categories = Object.keys(byCategory);
    let round = 0;
    while (selected.length < 6 && round < 3) {
      for (const cat of categories) {
        if (byCategory[cat][round] && selected.length < 6) {
          selected.push(byCategory[cat][round]);
        }
      }
      round++;
    }

    console.log(`Selected ${selected.length} articles with category variety`);

    // 5. Fetch and save articles (raw, no AI)
    let successCount = 0;

    for (const newsItem of selected) {
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

        // Get image - prefer source image if available
        const heroImage = await getArticleImage(newsItem.title, newsItem.category, fullArticle.image);

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
