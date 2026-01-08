"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TravelPhrase {
  id: string;
  slug: string;
  title: string;
  category: string;
  icon: string | null;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
}

const categories = [
  { id: "all", label: "All" },
  { id: "airport", label: "Airport" },
  { id: "hotel", label: "Hotel" },
  { id: "restaurant", label: "Restaurant" },
  { id: "transport", label: "Transport" },
  { id: "emergency", label: "Emergency" },
  { id: "shopping", label: "Shopping" },
];

const categoryIcons: Record<string, string> = {
  airport: "✈️",
  hotel: "🏨",
  restaurant: "🍽️",
  transport: "🚇",
  emergency: "🚨",
  shopping: "🛍️",
};

export default function TravelPhrasesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [phrases, setPhrases] = useState<TravelPhrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("B1");

  useEffect(() => {
    const saved = localStorage.getItem("selectedLevel");
    if (saved) setLevel(saved);
  }, []);

  useEffect(() => {
    async function fetchPhrases() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "all") params.set("category", activeCategory);
        const res = await fetch("/api/travel-phrases?" + params.toString());
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPhrases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setPhrases([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPhrases();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-8 pb-6 md:pt-12 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/travel"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest transition-colors mb-4"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Travel
          </Link>
          <h1 className="font-display text-3xl md:text-5xl font-medium text-center text-gray-900">
            Travel Phrases
          </h1>
          <p className="text-center text-muted mt-2 md:mt-3 text-sm md:text-base">
            Essential phrases for any traveler
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

      {/* Phrases Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-12 w-12 bg-cream-warm rounded-full mb-4" />
                <div className="h-5 bg-cream-warm rounded w-3/4 mb-2" />
                <div className="h-4 bg-cream-warm rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : phrases.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-mint-light flex items-center justify-center">
              <span className="text-4xl">💬</span>
            </div>
            <h2 className="font-display text-2xl font-medium text-gray-900 mb-3">
              No Phrases Found
            </h2>
            <p className="text-muted max-w-md mx-auto">
              No travel phrases available in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {phrases.map((phrase, index) => (
              <Link
                key={phrase.id}
                href={"/travel/phrases/" + phrase.slug}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-forest/20 transition-all group animate-fade-in-up opacity-0"
                style={{
                  animationDelay: index * 0.1 + "s",
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">
                    {phrase.icon || categoryIcons[phrase.category] || "💬"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-medium text-gray-900 group-hover:text-forest transition-colors">
                      {phrase.title}
                    </h3>
                    <p className="text-sm text-muted mt-1 capitalize">
                      {phrase.category}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                      <span>
                        {phrase.wordCounts?.[level] ||
                          phrase.wordCounts?.B1 ||
                          "—"}{" "}
                        words
                      </span>
                      <span>
                        {phrase.readTimes?.[level] ||
                          phrase.readTimes?.B1 ||
                          "—"}{" "}
                        min
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-forest transition-colors shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
