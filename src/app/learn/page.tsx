"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Book {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  coverImage: string | null;
}

const categories = [
  { id: "all", label: "All" },
  { id: "computing", label: "Computing" },
  { id: "science", label: "Science" },
  { id: "history", label: "History" },
  { id: "languages", label: "Languages" },
  { id: "life", label: "Life Skills" },
];

const categoryColors: Record<string, string> = {
  computing: "bg-blue-100 text-blue-800",
  science: "bg-emerald-100 text-emerald-800",
  history: "bg-amber-100 text-amber-800",
  languages: "bg-purple-100 text-purple-800",
  life: "bg-rose-100 text-rose-800",
};

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "all") params.set("category", activeCategory);
        const res = await fetch(`/api/books?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-8 pb-6 md:pt-12 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-medium text-center text-gray-900">
            Learn English
          </h1>
          <p className="text-center text-muted mt-2 md:mt-3 text-sm md:text-base">
            Educational content from textbooks, adapted to your level
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

      {/* Book Grid */}
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
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-mint-light flex items-center justify-center">
              <svg className="w-10 h-10 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-medium text-gray-900 mb-3">
              No Books Found
            </h2>
            <p className="text-muted max-w-md mx-auto">
              No books available in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {books.map((book, index) => (
              <Link
                key={book.id}
                href={`/learn/${book.slug}`}
                className="article-card group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={book.coverImage || "/placeholder.jpg"}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[book.category] || "bg-gray-100 text-gray-800"}`}>
                    {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-medium text-gray-900 group-hover:text-forest transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  {book.description && (
                    <p className="mt-2 text-sm text-muted line-clamp-2">
                      {book.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
