"use client";

import { useEffect, useState, use } from "react";
import { useLevel } from "@/components/LevelContext";
import { HeroSection } from "@/components/article/HeroSection";
import { Sidebar } from "@/components/article/Sidebar";
import { ArticleContent } from "@/components/article/ArticleContent";
import { AudioPlayer } from "@/components/article/AudioPlayer";
import { ExerciseSection } from "@/components/exercises/ExerciseSection";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { mockArticle, mockArticles } from "@/lib/data/mock-articles";
import { Level, Category, ExerciseSet } from "@/types";

interface DbArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  source: string;
  sourceUrl: string;
  heroImage: string | null;
  heroAlt: string | null;
  content: Record<Level, string>;
  exercises: Record<Level, ExerciseSet>;
  audio: Record<Level, { url: string; duration: number }> | null;
  vocabulary: Array<{ word: string; definition: string; level: Level }> | null;
  wordCounts: Record<Level, number>;
  readTimes: Record<Level, number>;
  publishedAt: string;
}

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { level } = useLevel();
  const [article, setArticle] = useState<DbArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setArticle(data);
        setUseMock(false);

        // Fetch related articles
        const relatedRes = await fetch(`/api/articles?limit=3`);
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedArticles(
            relatedData.articles.filter((a: DbArticle) => a.slug !== slug)
          );
        }
      } catch {
        setUseMock(true);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-ui">Loading article...</div>
      </div>
    );
  }

  // Use mock data if API fails or no article found
  const displayArticle = useMock ? mockArticle : article;
  const displayRelated = useMock
    ? mockArticles.filter((a) => a.id !== mockArticle.id)
    : relatedArticles;

  if (!displayArticle) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-gray-500 font-ui">Article not found</div>
      </div>
    );
  }

  // Transform related articles for the component
  const transformedRelated = displayRelated.slice(0, 3).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    subtitle: a.subtitle || "",
    category: a.category as Category,
    heroImage: a.heroImage || "/placeholder.jpg",
    heroAlt: a.heroAlt || a.title,
    wordCount: "wordCounts" in a ? a.wordCounts : a.wordCount,
    readTime: "readTimes" in a ? a.readTimes : a.readTime,
  }));

  const wordCount = "wordCounts" in displayArticle
    ? displayArticle.wordCounts[level]
    : displayArticle.wordCount[level];
  const readTime = "readTimes" in displayArticle
    ? displayArticle.readTimes[level]
    : displayArticle.readTime[level];
  const content = displayArticle.content[level];
  const exercises = displayArticle.exercises[level];
  const audio = displayArticle.audio?.[level];
  const vocabulary = displayArticle.vocabulary || [];

  return (
    <article>
      {/* Hero */}
      <HeroSection
        image={displayArticle.heroImage || "/placeholder.jpg"}
        alt={displayArticle.heroAlt || displayArticle.title}
        title={displayArticle.title}
        subtitle={displayArticle.subtitle || ""}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-3 mb-8 lg:mb-0">
            <Sidebar
              source={displayArticle.source}
              sourceUrl={displayArticle.sourceUrl}
              wordCount={wordCount}
              readTime={readTime}
              category={displayArticle.category as Category}
              tags={[]}
              articleId={displayArticle.id}
              level={level}
            />
          </div>

          {/* Article content */}
          <div className="lg:col-span-9">
            {/* Audio player */}
            {audio && (
              <AudioPlayer audioUrl={audio.url} duration={audio.duration} />
            )}

            {/* Article text */}
            <ArticleContent
              content={content}
              vocabulary={vocabulary.filter(
                (v) =>
                  ["A1", "A2", "B1", "B2", "C1"].indexOf(v.level) <=
                  ["A1", "A2", "B1", "B2", "C1"].indexOf(level)
              )}
            />

            {/* Exercises */}
            <ExerciseSection exercises={exercises} />

            {/* Related articles */}
            <RelatedArticles articles={transformedRelated} />
          </div>
        </div>
      </div>
    </article>
  );
}
