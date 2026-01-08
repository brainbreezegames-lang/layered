"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLevel } from "@/components/LevelContext";

interface Story {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  themes: string[];
  heroImage: string | null;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
}

const categories = [
  { id: "all", label: "All Stories" },
  { id: "mystery", label: "Mystery" },
  { id: "love", label: "Love" },
  { id: "humor", label: "Humor" },
  { id: "moral", label: "Moral Tales" },
  { id: "adventure", label: "Adventure" },
];

export default function StoriesPage() {
  const { level } = useLevel();
  const [activeCategory, setActiveCategory] = useState("all");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "all") params.set("category", activeCategory);
        const res = await fetch("/api/stories?" + params.toString());
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setStories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Editorial Header */}
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="editorial-subhead mb-3">Fiction</p>
          <h1 className="editorial-headline text-4xl md:text-5xl lg:text-6xl text-[var(--color-text)]">
            Short Stories
          </h1>
          <p className="mt-4 text-[var(--color-text-soft)] text-lg md:text-xl max-w-2xl leading-relaxed">
            Classic tales and original fiction, adapted to your reading level.
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

      {/* Stories Grid */}
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
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <p className="editorial-subhead mb-2">No stories found</p>
            <p className="text-[var(--color-text-muted)]">
              Check back soon for new stories in this category.
            </p>
          </div>
        ) : (
          <>
            {/* Featured story - first one */}
            {stories.length > 0 && activeCategory === "all" && (
              <Link
                href={"/stories/" + stories[0].slug}
                className="block mb-12 md:mb-16 group"
              >
                <div className="md:grid md:grid-cols-2 md:gap-8 lg:gap-12 items-center">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-6 md:mb-0">
                    {stories[0].heroImage ? (
                      <Image
                        src={stories[0].heroImage}
                        alt={stories[0].title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-warm)] to-[var(--color-cream-dark)] flex items-center justify-center">
                        <span className="text-5xl opacity-30">📖</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="category-tag mb-3">
                      {stories[0].category.replace("-", " ")}
                    </p>
                    <h2 className="editorial-headline text-3xl md:text-4xl text-[var(--color-text)] group-hover:text-[var(--color-forest)] transition-colors leading-tight mb-3">
                      {stories[0].title}
                    </h2>
                    <p className="text-[var(--color-text-muted)] mb-4">
                      by {stories[0].author}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                      <span>
                        {stories[0].wordCounts?.[level] || stories[0].wordCounts?.B1 || "—"} words
                      </span>
                      <span>
                        {stories[0].readTimes?.[level] || stories[0].readTimes?.B1 || "—"} min read
                      </span>
                    </div>
                    {stories[0].themes && stories[0].themes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {stories[0].themes.slice(0, 3).map((theme) => (
                          <span key={theme} className="level-tag">
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* Section header */}
            <div className="mb-8 border-b border-[var(--color-border)] pb-4">
              <p className="editorial-subhead mb-1">
                {activeCategory === "all" ? "More Stories" : categories.find(c => c.id === activeCategory)?.label}
              </p>
              <h2 className="font-display text-2xl text-[var(--color-text)]">
                {activeCategory === "all" ? "Collection" : "Stories"}
              </h2>
            </div>

            {/* Stories grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {(activeCategory === "all" ? stories.slice(1) : stories).map((story, index) => (
                <Link
                  key={story.id}
                  href={"/stories/" + story.slug}
                  className="group animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: index * 0.08 + "s",
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-4">
                    {story.heroImage ? (
                      <Image
                        src={story.heroImage}
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-warm)] to-[var(--color-cream-dark)] flex items-center justify-center">
                        <span className="text-4xl opacity-30">📖</span>
                      </div>
                    )}
                  </div>
                  <p className="category-tag mb-2">
                    {story.category.replace("-", " ")}
                  </p>
                  <h3 className="font-display text-xl md:text-2xl text-[var(--color-text)] group-hover:text-[var(--color-forest)] transition-colors leading-tight line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] mt-1 text-sm">
                    by {story.author}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-text-muted)]">
                    <span>
                      {story.wordCounts?.[level] || story.wordCounts?.B1 || "—"} words
                    </span>
                    <span>
                      {story.readTimes?.[level] || story.readTimes?.B1 || "—"} min
                    </span>
                  </div>
                  {story.themes && story.themes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {story.themes.slice(0, 3).map((theme) => (
                        <span key={theme} className="level-tag text-xs">
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
