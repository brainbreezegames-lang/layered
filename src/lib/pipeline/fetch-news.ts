import Parser from "rss-parser";
import { extract } from "@extractus/article-extractor";
import { NEWS_SOURCES } from "./news-sources";

const parser = new Parser();

export interface NewsItem {
  title: string;
  link: string;
  description: string;
  publishedAt: string;
  source: string;
  category: string;
}

export interface FullArticle {
  title: string;
  content: string;
  textContent: string;
  image?: string;
  author?: string;
  publishedAt?: string;
}

export async function fetchNewsFromSource(source: typeof NEWS_SOURCES[number]): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(source.url);

    return feed.items.slice(0, 5).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      description: item.contentSnippet || item.description || "",
      publishedAt: item.pubDate || new Date().toISOString(),
      source: source.name,
      category: source.category,
    }));
  } catch (error) {
    console.error(`Failed to fetch from ${source.name}:`, error);
    return [];
  }
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  const allArticles: NewsItem[] = [];

  for (const source of NEWS_SOURCES) {
    const articles = await fetchNewsFromSource(source);
    allArticles.push(...articles);
    await new Promise((r) => setTimeout(r, 500)); // Rate limit
  }

  return allArticles;
}

export async function getFullArticle(url: string): Promise<FullArticle | null> {
  try {
    const article = await extract(url);
    if (!article) return null;

    return {
      title: article.title || "",
      content: article.content || "",
      textContent: article.content?.replace(/<[^>]*>/g, "") || "",
      image: article.image,
      author: article.author,
      publishedAt: article.published,
    };
  } catch (error) {
    console.error(`Failed to extract article from ${url}:`, error);
    return null;
  }
}
