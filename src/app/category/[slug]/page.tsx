"use client";

import { useState, useEffect, use } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { mockArticles } from "@/lib/data/mock-articles";
import { Category } from "@/types";

const categoryLabels: Record<string, string> = {
  world: "World",
  culture: "Culture",
  science: "Science",
  sports: "Sports",
  fun: "Fun",
};

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

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<ArticlePreview[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  const categoryLabel = categoryLabels[slug] || slug;

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          category: slug,
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
  }, [slug, currentPage]);

  // Mock data fallback
  const mockFiltered = mockArticles.filter((a) => a.category === slug);
  const mockTotalPages = Math.ceil(mockFiltered.length / 6);
  const mockPaginated = mockFiltered.slice(
    (currentPage - 1) * 6,
    currentPage * 6
  );

  const displayArticles = useMock ? mockPaginated : articles;
  const displayTotalPages = useMock ? mockTotalPages : totalPages;

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
      {/* Page Title */}
      <section className="py-16 md:py-24">
        <h1 className="font-display text-4xl md:text-6xl italic text-center text-gray-900">
          {categoryLabel}
        </h1>
      </section>

      {/* Article Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-cream-dark aspect-[4/3] mb-4" />
                <div className="h-3 bg-cream-dark w-1/4 mb-3" />
                <div className="h-5 bg-cream-dark mb-2" />
                <div className="h-4 bg-cream-dark w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transformedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Empty State */}
            {transformedArticles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted font-ui">No articles found in this category.</p>
              </div>
            )}

            {/* Pagination */}
            {displayTotalPages > 1 && (
              <nav className="flex items-center justify-center gap-6 mt-16">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-sm font-ui text-muted hover:text-primary disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: displayTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-sm font-ui transition-colors ${
                        currentPage === page
                          ? "text-primary"
                          : "text-muted hover:text-gray-900"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(displayTotalPages, p + 1))}
                  disabled={currentPage === displayTotalPages}
                  className="text-sm font-ui text-muted hover:text-primary disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}
