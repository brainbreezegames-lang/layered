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
          // No articles in DB, fallback to mock
          setUseMock(true);
        } else {
          setArticles(data.articles);
          setTotalPages(data.pagination.totalPages);
          setUseMock(false);
        }
      } catch {
        // Fallback to mock data on error
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
      {/* Page Title */}
      <section className="py-20 md:py-28">
        <h1 className="font-display text-5xl md:text-7xl italic text-center text-gray-900">
          Today&apos;s News
        </h1>
      </section>

      {/* Category Filter Tabs */}
      <nav className="border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex gap-8 overflow-x-auto pb-px">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`py-4 text-sm font-ui uppercase tracking-wider transition-colors whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "text-primary border-b-2 border-primary -mb-px"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Article Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
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
                <p className="text-gray-500 font-ui">No articles found in this category.</p>
              </div>
            )}

            {/* Pagination */}
            {displayTotalPages > 1 && (
              <nav className="flex items-center justify-center gap-4 mt-16">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-sm font-ui text-gray-600 hover:text-primary disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: displayTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-full text-sm font-ui transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(displayTotalPages, p + 1))}
                  disabled={currentPage === displayTotalPages}
                  className="text-sm font-ui text-gray-600 hover:text-primary disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
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
