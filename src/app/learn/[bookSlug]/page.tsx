"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";

interface Chapter {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
}

interface Book {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  coverImage: string | null;
  chapters: Chapter[];
}

export default function BookPage({ params }: { params: Promise<{ bookSlug: string }> }) {
  const { bookSlug } = use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("B1");

  useEffect(() => {
    const saved = localStorage.getItem("selectedLevel");
    if (saved) setLevel(saved);
  }, []);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${bookSlug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [bookSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-forest border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium mb-2">Book Not Found</h1>
          <Link href="/learn" className="text-forest hover:underline">← Back to Learn</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src={book.coverImage || "/placeholder.jpg"}
          alt={book.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <Link href="/learn" className="text-white/80 hover:text-white text-sm mb-2 inline-block">
            ← Back to Learn
          </Link>
          <h1 className="font-display text-2xl md:text-4xl font-medium text-white">
            {book.title}
          </h1>
          {book.description && (
            <p className="text-white/80 mt-2 text-sm md:text-base max-w-2xl">
              {book.description}
            </p>
          )}
        </div>
      </div>

      {/* Chapters List */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-medium text-gray-900">
            Chapters ({book.chapters?.length || 0})
          </h2>
          <span className="text-sm text-muted">
            Reading at level {level}
          </span>
        </div>

        <div className="space-y-3">
          {book.chapters?.map((chapter, index) => (
            <Link
              key={chapter.id}
              href={`/learn/${book.slug}/${chapter.slug}`}
              className="block bg-white rounded-xl p-4 md:p-5 border border-gray-100 hover:border-forest/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-mint-light flex items-center justify-center font-display font-medium text-forest">
                  {chapter.orderIndex}
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-display text-lg font-medium text-gray-900 group-hover:text-forest transition-colors">
                    {chapter.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted">
                    <span>{chapter.wordCounts?.[level] || "—"} words</span>
                    <span>{chapter.readTimes?.[level] || "—"} min read</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-forest transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}

          {(!book.chapters || book.chapters.length === 0) && (
            <div className="text-center py-12 text-muted">
              No chapters available yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
