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
import { filterVocabularyForLevel } from "@/lib/vocabulary-filter";

interface DbArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  titles?: Record<Level, string> | null;
  subtitles?: Record<Level, string> | null;
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
    heroImage: a.heroImage,
    heroAlt: a.heroAlt || a.title,
    wordCount: "wordCounts" in a ? a.wordCounts : a.wordCount,
    readTime: "readTimes" in a ? a.readTimes : a.readTime,
  }));

  // Check if article has been AI-processed (has A1 level content)
  const isProcessed = displayArticle.content && "A1" in displayArticle.content;

  const wordCountData = "wordCounts" in displayArticle ? displayArticle.wordCounts : (displayArticle as any).wordCount;
  const readTimeData = "readTimes" in displayArticle ? displayArticle.readTimes : (displayArticle as any).readTime;

  const wordCount = isProcessed
    ? (wordCountData?.[level] || 0)
    : ((wordCountData as any)?.raw || 0);
  const readTime = isProcessed
    ? (readTimeData?.[level] || 0)
    : ((readTimeData as any)?.raw || 0);

  // Use level content if processed, otherwise fall back to raw content
  const content = isProcessed
    ? displayArticle.content[level]
    : (displayArticle.content as any)?.raw || "";

  const exercises = isProcessed ? displayArticle.exercises?.[level] : null;
  // Handle both array and {words: [...]} formats
  const rawVocab = displayArticle.vocabulary || [];
  const vocabulary = Array.isArray(rawVocab) ? rawVocab : (rawVocab as any).words || [];

  // Use level-specific title and subtitle if available, otherwise fall back to original
  const displayTitle = displayArticle.titles?.[level] || displayArticle.title;
  const rawSubtitle = displayArticle.subtitles?.[level] || displayArticle.subtitle || "";
  // Truncate subtitle to 120 chars
  const displaySubtitle = rawSubtitle.length > 120
    ? rawSubtitle.slice(0, 120).replace(/\s+\S*$/, "") + "..."
    : rawSubtitle;

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
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-stone-200">
        {displayArticle.heroImage ? (
          <Image
            src={displayArticle.heroImage}
            alt={displayArticle.heroAlt || displayArticle.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
            <span className="font-display text-8xl text-stone-400">{displayArticle.title.charAt(0)}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Title overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <p className="editorial-subhead text-white/70 mb-2 md:mb-3">
              {displayArticle.category}
            </p>
            <h1 className="editorial-headline text-2xl md:text-4xl lg:text-5xl text-white leading-tight">
              {displayTitle}
            </h1>
            {displaySubtitle && (
              <p className="mt-3 md:mt-4 text-white/80 text-base md:text-xl max-w-2xl leading-relaxed">
                {displaySubtitle}
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
              vocabulary={filterVocabularyForLevel(vocabulary, level)}
            />

            {/* Show processing banner if not processed */}
            {!isProcessed && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Adapting article to your level...</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Our AI is creating 5 difficulty levels and generating exercises. This usually takes 1-2 minutes.
                    </p>
                    <p className="text-blue-500 text-xs mt-2">
                      You&apos;re viewing the original article text below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Exercises - only show if article is processed */}
            {exercises && <ExerciseSection exercises={exercises} />}

            {/* Related articles */}
            <RelatedArticles articles={transformedRelated} />
          </div>
        </div>
      </div>
    </article>
  );
}
