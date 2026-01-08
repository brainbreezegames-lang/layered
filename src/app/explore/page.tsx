"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ExploreArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  heroImage: string | null;
  excerpt: string | null;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
}

const categories = [
  { id: "all", label: "All" },
  { id: "people", label: "People" },
  { id: "places", label: "Places" },
  { id: "science", label: "Science" },
  { id: "history", label: "History" },
  { id: "culture", label: "Culture" },
];

const categoryColors: Record<string, string> = {
  people: "bg-purple-100 text-purple-800",
  places: "bg-blue-100 text-blue-800",
  science: "bg-emerald-100 text-emerald-800",
  history: "bg-amber-100 text-amber-800",
  culture: "bg-rose-100 text-rose-800",
};

const categoryIcons: Record<string, string> = {
  people: "👤",
  places: "🌍",
  science: "🔬",
  history: "📜",
  culture: "🎭",
};

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [articles, setArticles] = useState<ExploreArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("B1");

  useEffect(() => {
    const saved = localStorage.getItem("selectedLevel");
    if (saved) setLevel(saved);
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "all") params.set("category", activeCategory);
        const res = await fetch("/api/explore?" + params.toString());
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-8 pb-6 md:pt-12 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-medium text-center text-gray-900">
            Explore English
          </h1>
          <p className="text-center text-muted mt-2 md:mt-3 text-sm md:text-base">
            Discover the world through English
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <nav className="sticky top-14 md:top-16 z-40 bg-cream border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all " +
                  (activeCategory === cat.id
                    ? "bg-forest text-white"
                    : "bg-cream-warm text-muted hover:bg-gray-200")
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="article-card animate-pulse">
                <div className="aspect-[4/3] bg-cream-warm" />
                <div className="p-4">
                  <div className="h-5 bg-cream-warm rounded w-3/4 mb-2" />
                  <div className="h-4 bg-cream-warm rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-mint-light flex items-center justify-center">
              <svg
                className="w-10 h-10 text-forest"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-medium text-gray-900 mb-3">
              No Articles Found
            </h2>
            <p className="text-muted max-w-md mx-auto">
              No explore articles available in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                href={"/explore/" + article.slug}
                className="article-card group animate-fade-in-up opacity-0"
                style={{
                  animationDelay: index * 0.1 + "s",
                  animationFillMode: "forwards",
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {article.heroImage ? (
                    <Image
                      src={article.heroImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-forest/20 to-mint-light flex items-center justify-center">
                      <span className="text-5xl opacity-50">
                        {categoryIcons[article.category] || "📚"}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span
                    className={
                      "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium " +
                      (categoryColors[article.category] ||
                        "bg-gray-100 text-gray-800")
                    }
                  >
                    {article.category.charAt(0).toUpperCase() +
                      article.category.slice(1)}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-medium text-gray-900 group-hover:text-forest transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-muted mt-1 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                    <span>
                      {article.wordCounts?.[level] ||
                        article.wordCounts?.B1 ||
                        "—"}{" "}
                      words
                    </span>
                    <span>
                      {article.readTimes?.[level] ||
                        article.readTimes?.B1 ||
                        "—"}{" "}
                      min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
