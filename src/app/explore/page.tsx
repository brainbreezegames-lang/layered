"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLevel } from "@/components/LevelContext";

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
  { id: "all", label: "All Topics" },
  { id: "people", label: "People" },
  { id: "places", label: "Places" },
  { id: "science", label: "Science" },
  { id: "history", label: "History" },
  { id: "culture", label: "Culture" },
];

export default function ExplorePage() {
  const { level } = useLevel();
  const [activeCategory, setActiveCategory] = useState("all");
  const [articles, setArticles] = useState<ExploreArticle[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Editorial Header */}
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="editorial-subhead mb-3">Explore English</p>
          <h1 className="editorial-headline text-4xl md:text-5xl lg:text-6xl text-[var(--color-text)]">
            Ideas & Knowledge
          </h1>
          <p className="mt-4 text-[var(--color-text-soft)] text-lg md:text-xl max-w-2xl leading-relaxed">
            Discover fascinating topics from science to culture, adapted to your reading level.
          </p>
        </div>
      </header>

      {/* Category Filter - Editorial tabs */}
      <nav className="sticky top-14 md:top-16 z-40 bg-[var(--color-cream)] border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto py-0 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
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

      {/* Articles Grid */}
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
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="editorial-subhead mb-2">No articles found</p>
            <p className="text-[var(--color-text-muted)]">
              Check back soon for new content in this category.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article - First article gets larger treatment */}
            {articles.length > 0 && activeCategory === "all" && (
              <Link
                href={"/explore/" + articles[0].slug}
                className="block mb-12 md:mb-16 group"
              >
                <div className="md:grid md:grid-cols-2 md:gap-8 lg:gap-12 items-center">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-6 md:mb-0">
                    {articles[0].heroImage ? (
                      <Image
                        src={articles[0].heroImage}
                        alt={articles[0].title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-warm)] to-[var(--color-cream-dark)] flex items-center justify-center">
                        <span className="text-5xl opacity-30">📚</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="category-tag mb-3">{articles[0].category}</p>
                    <h2 className="editorial-headline text-3xl md:text-4xl text-[var(--color-text)] group-hover:text-[var(--color-forest)] transition-colors leading-tight mb-4">
                      {articles[0].title}
                    </h2>
                    {articles[0].excerpt && (
                      <p className="text-[var(--color-text-soft)] text-lg leading-relaxed mb-4 line-clamp-3">
                        {articles[0].excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                      <span>
                        {articles[0].wordCounts?.[level] || articles[0].wordCounts?.B1 || "—"} words
                      </span>
                      <span>
                        {articles[0].readTimes?.[level] || articles[0].readTimes?.B1 || "—"} min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Section header */}
            <div className="mb-8 border-b border-[var(--color-border)] pb-4">
              <p className="editorial-subhead mb-1">
                {activeCategory === "all" ? "More Articles" : categories.find(c => c.id === activeCategory)?.label}
              </p>
              <h2 className="font-display text-2xl text-[var(--color-text)]">
                {activeCategory === "all" ? "Latest" : "Articles"}
              </h2>
            </div>

            {/* Articles grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {(activeCategory === "all" ? articles.slice(1) : articles).map((article, index) => (
                <Link
                  key={article.id}
                  href={"/explore/" + article.slug}
                  className="group animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: index * 0.08 + "s",
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-4">
                    {article.heroImage ? (
                      <Image
                        src={article.heroImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-warm)] to-[var(--color-cream-dark)] flex items-center justify-center">
                        <span className="text-4xl opacity-30">📚</span>
                      </div>
                    )}
                  </div>
                  <p className="category-tag mb-2">{article.category}</p>
                  <h3 className="font-display text-xl md:text-2xl text-[var(--color-text)] group-hover:text-[var(--color-forest)] transition-colors leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-[var(--color-text-soft)] mt-2 text-sm line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-[var(--color-text-muted)]">
                    <span>
                      {article.wordCounts?.[level] || article.wordCounts?.B1 || "—"} words
                    </span>
                    <span>
                      {article.readTimes?.[level] || article.readTimes?.B1 || "—"} min
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
