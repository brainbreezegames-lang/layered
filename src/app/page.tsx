"use client";

import { useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { mockArticles } from "@/lib/data/mock-articles";
import { useLevel } from "@/components/LevelContext";
import { Category } from "@/types";

const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "world", label: "World" },
  { id: "culture", label: "Culture" },
  { id: "science", label: "Science" },
  { id: "sports", label: "Sports" },
  { id: "fun", label: "Fun" },
];

const ARTICLES_PER_PAGE = 6;

export default function HomePage() {
  const { level } = useLevel();
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredArticles =
    activeCategory === "all"
      ? mockArticles
      : mockArticles.filter((a) => a.category === activeCategory);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  const handleCategoryChange = (category: Category | "all") => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Empty State */}
        {paginatedArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 font-ui">No articles found in this category.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-4 mt-16">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-sm font-ui text-gray-600 hover:text-primary disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-sm font-ui text-gray-600 hover:text-primary disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}
