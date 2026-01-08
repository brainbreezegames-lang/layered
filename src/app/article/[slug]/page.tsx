"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLevel } from "@/components/LevelContext";
import { Sidebar } from "@/components/article/Sidebar";
import { ArticleContent } from "@/components/article/ArticleContent";
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
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="animate-pulse text-[var(--color-text-muted)]">Loading article...</div>
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
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-[var(--color-text-muted)]">Article not found</div>
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
  const vocabulary = displayArticle.vocabulary || [];

  return (
    <article className="min-h-screen bg-[var(--color-cream)] pb-24 md:pb-12">
      {/* Back button - Mobile */}
      <div className="md:hidden sticky top-14 z-30 bg-[var(--color-cream)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-forest)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </Link>
        </div>
      </div>

      {/* Hero Image - Full width with editorial overlay */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
        <Image
          src={displayArticle.heroImage || "/placeholder.jpg"}
          alt={displayArticle.heroAlt || displayArticle.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Title overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <p className="editorial-subhead text-white/70 mb-2 md:mb-3">
              {displayArticle.category}
            </p>
            <h1 className="editorial-headline text-2xl md:text-4xl lg:text-5xl text-white leading-tight">
              {displayArticle.title}
            </h1>
            {displayArticle.subtitle && (
              <p className="mt-3 md:mt-4 text-white/80 text-base md:text-xl max-w-2xl leading-relaxed">
                {displayArticle.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="md:grid md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* Sidebar - Horizontal on mobile, sticky on desktop */}
          <div className="md:col-span-4 lg:col-span-3 mb-6 md:mb-0">
            <div className="md:sticky md:top-24">
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
          </div>

          {/* Article content */}
          <div className="md:col-span-8 lg:col-span-9">
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
