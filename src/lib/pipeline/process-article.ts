import { db } from "@/lib/db";
import { getFullArticle, NewsItem } from "./fetch-news";
import { generateAllLevels, generateAllExercises } from "./ai-generate";
import { Level } from "@/types";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function processArticle(newsItem: NewsItem) {
  console.log(`Processing: ${newsItem.title}`);

  // Check if already exists
  const existing = await db.article.findUnique({
    where: { sourceUrl: newsItem.link },
  });
  if (existing) {
    console.log("Article already exists, skipping");
    return null;
  }

  // Get full article text
  const fullArticle = await getFullArticle(newsItem.link);
  if (!fullArticle || fullArticle.textContent.length < 300) {
    console.log("Article too short or failed to extract, skipping");
    return null;
  }

  // Generate 5 level versions
  console.log("Generating level versions...");
  const levelVersions = await generateAllLevels(fullArticle.textContent);

  // Generate exercises for each level
  console.log("Generating exercises...");
  const exercises = await generateAllExercises(levelVersions);

  // Calculate word counts and read times
  const wordCounts: Record<Level, number> = {} as Record<Level, number>;
  const readTimes: Record<Level, number> = {} as Record<Level, number>;

  for (const [level, text] of Object.entries(levelVersions)) {
    const words = text.split(/\s+/).length;
    wordCounts[level as Level] = words;
    readTimes[level as Level] = Math.ceil(words / 200);
  }

  // Save to database
  const article = await db.article.create({
    data: {
      slug: generateSlug(newsItem.title),
      title: newsItem.title,
      subtitle: newsItem.description,
      category: newsItem.category,
      source: newsItem.source,
      sourceUrl: newsItem.link,
      heroImage: fullArticle.image,
      heroAlt: newsItem.title,
      content: levelVersions as Record<string, string>,
      exercises: exercises as Record<string, object>,
      wordCounts: wordCounts as Record<string, number>,
      readTimes: readTimes as Record<string, number>,
      publishedAt: new Date(newsItem.publishedAt),
    },
  });

  console.log(`✓ Saved: ${article.slug}`);
  return article;
}
