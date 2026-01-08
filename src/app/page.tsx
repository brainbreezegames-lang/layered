"use client";

import { useState, useEffect } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { Category } from "@/types";

const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All News" },
  { id: "world", label: "World" },
  { id: "culture", label: "Culture" },
  { id: "science", label: "Science" },
  { id: "sports", label: "Sports" },
  { id: "fun", label: "Fun" },
];

interface ArticlePreview {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  heroImage: string | null;
  heroAlt: string | null;
  publishedAt: string;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
}

interface ApiResponse {
  articles: ArticlePreview[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<ArticlePreview[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          ...(activeCategory !== "all" && { category: activeCategory }),
        });
        const res = await fetch(`/api/articles?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: ApiResponse = await res.json();

        setArticles(data.articles);
        setTotalPages(data.pagination.totalPages);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [activeCategory, currentPage]);

  const displayArticles = articles;
  const displayTotalPages = totalPages;

  const handleCategoryChange = (category: Category | "all") => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Step 1: Fetch articles (fast - just RSS)
      setRefreshStatus("Fetching news articles...");
      const fetchRes = await fetch("/api/fetch-articles", { method: "POST" });
      const fetchData = await fetchRes.json();

      if (!fetchData.success) {
        setRefreshStatus(fetchData.message || "Fetch failed");
        return;
      }

      if (fetchData.processed === 0) {
        setRefreshStatus(fetchData.message || "No new articles found");
        return;
      }

      // Step 2: Process with AI (slow)
      setRefreshStatus(`Fetched ${fetchData.processed} articles. Generating AI content... (2-3 min)`);
      const processRes = await fetch("/api/process-articles", { method: "POST" });
      const processData = await processRes.json();

      if (processData.success && processData.processed > 0) {
        setRefreshStatus(`Done! Added ${processData.processed} articles with AI content.`);
        setTimeout(() => {
          setCurrentPage(1);
          setActiveCategory("all");
          window.location.reload();
        }, 2000);
      } else {
        setRefreshStatus(processData.message || "AI processing completed");
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error("Refresh error:", error);
      setRefreshStatus("Refresh failed - please try again");
    } finally {
      setRefreshing(false);
      setTimeout(() => setRefreshStatus(null), 5000);
    }
  };

  // Transform API articles to match ArticleCard props
  const transformedArticles = displayArticles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle || "",
    category: article.category as Category,
    heroImage: article.heroImage,
    heroAlt: article.heroAlt || article.title,
    wordCount: article.wordCounts,
    readTime: article.readTimes,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Editorial Header */}
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center justify-between mb-3">
            <p className="editorial-subhead">Daily</p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="group flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors disabled:opacity-50"
              title="Fetch new articles"
            >
              <svg
                className={`w-4 h-4 ${refreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">
                {refreshing ? "Generating..." : "Fetch New"}
              </span>
            </button>
          </div>
          <h1 className="editorial-headline text-4xl md:text-5xl lg:text-6xl text-[var(--color-text)]">
            Today&apos;s News
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <p className="text-[var(--color-text-soft)] text-lg md:text-xl max-w-2xl leading-relaxed">
              Practice English with real-world stories adapted to your level.
            </p>
          </div>
          {refreshStatus && (
            <p className={`mt-3 text-sm animate-fade-in ${refreshing ? "text-[var(--color-text-muted)]" : "text-[var(--color-forest)]"}`}>
              {refreshStatus}
            </p>
          )}
        </div>
      </header>

      {/* Category Filter - Editorial tabs */}
      <nav className="sticky top-14 md:top-16 z-40 bg-[var(--color-cream)] border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto py-0 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`nav-tab whitespace-nowrap ${
                  activeCategory === cat.id ? "active" : ""
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Article Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-[var(--color-warm)] rounded-md mb-4" />
                <div className="h-5 bg-[var(--color-warm)] rounded w-2/3 mb-2" />
                <div className="h-4 bg-[var(--color-warm)] rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Section header */}
            <div className="mb-8 border-b border-[var(--color-border)] pb-4">
              <p className="editorial-subhead mb-1">
                {activeCategory === "all" ? "Latest" : categories.find(c => c.id === activeCategory)?.label}
              </p>
              <h2 className="font-display text-2xl text-[var(--color-text)]">
                Articles
              </h2>
            </div>

            {transformedArticles.length === 0 ? (
              <div className="text-center py-20">
                <p className="editorial-subhead mb-2">No articles found</p>
                <p className="text-[var(--color-text-muted)]">
                  Check back soon for new content in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {transformedArticles.map((article, index) => (
                  <div
                    key={article.id}
                    className="animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "forwards" }}
                  >
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {displayTotalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: displayTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-[var(--color-text)] text-white"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-warm)]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(displayTotalPages, p + 1))}
                  disabled={currentPage === displayTotalPages}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}
