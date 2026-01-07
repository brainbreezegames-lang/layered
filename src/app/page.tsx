"use client";

import { useState, useEffect } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { mockArticles } from "@/lib/data/mock-articles";
import { Category } from "@/types";

const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
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
  const [useMock, setUseMock] = useState(false);

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

        if (data.articles.length === 0 && currentPage === 1) {
          setUseMock(true);
        } else {
          setArticles(data.articles);
          setTotalPages(data.pagination.totalPages);
          setUseMock(false);
        }
      } catch {
        setUseMock(true);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [activeCategory, currentPage]);

  // Mock data fallback
  const mockFiltered =
    activeCategory === "all"
      ? mockArticles
      : mockArticles.filter((a) => a.category === activeCategory);
  const mockTotalPages = Math.ceil(mockFiltered.length / 6);
  const mockPaginated = mockFiltered.slice(
    (currentPage - 1) * 6,
    currentPage * 6
  );

  const displayArticles = useMock ? mockPaginated : articles;
  const displayTotalPages = useMock ? mockTotalPages : totalPages;

  const handleCategoryChange = (category: Category | "all") => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Transform API articles to match ArticleCard props
  const transformedArticles = displayArticles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle || "",
    category: article.category as Category,
    heroImage: article.heroImage || "/placeholder.jpg",
    heroAlt: article.heroAlt || article.title,
    wordCount: "wordCounts" in article
      ? (article.wordCounts as Record<string, number>)
      : (article.wordCount as Record<string, number>),
    readTime: "readTimes" in article
      ? (article.readTimes as Record<string, number>)
      : (article.readTime as Record<string, number>),
  }));

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="pt-8 pb-6 md:pt-12 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-medium text-center text-gray-900">
            Today&apos;s News
          </h1>
          <p className="text-center text-muted mt-2 md:mt-3 text-sm md:text-base">
            Practice English with real-world stories adapted to your level
          </p>
        </div>
      </section>

      {/* Category Filter - Horizontal scroll on mobile */}
      <nav className="sticky top-14 md:top-16 z-40 bg-cream border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-forest text-white"
                    : "bg-cream-warm text-muted hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Article Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="article-card animate-pulse">
                <div className="aspect-[16/10] bg-cream-warm" />
                <div className="p-4">
                  <div className="h-5 bg-cream-warm rounded w-3/4 mb-2" />
                  <div className="h-5 bg-cream-warm rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {transformedArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {transformedArticles.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-warm flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-muted">No articles found in this category.</p>
              </div>
            )}

            {/* Pagination */}
            {displayTotalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full text-muted hover:text-forest hover:bg-cream-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: displayTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-forest text-white"
                          : "text-muted hover:bg-cream-warm"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(displayTotalPages, p + 1))}
                  disabled={currentPage === displayTotalPages}
                  className="p-2 rounded-full text-muted hover:text-forest hover:bg-cream-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
