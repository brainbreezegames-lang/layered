"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";

interface Section {
  id: string;
  slug: string;
  title: string;
  sectionType: string;
  orderIndex: number;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
}

interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  heroImage: string | null;
  description: string | null;
  sections: Section[];
}

const sectionIcons: Record<string, string> = {
  "get-in": "✈️",
  "get-around": "🚇",
  see: "👀",
  eat: "🍽️",
  sleep: "🏨",
  tips: "💡",
  buy: "🛍️",
  drink: "🍺",
  do: "🎯",
};

const levels = ["A1", "A2", "B1", "B2", "C1"];

export default function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("B1");

  useEffect(() => {
    const saved = localStorage.getItem("selectedLevel");
    if (saved) setLevel(saved);
  }, []);

  useEffect(() => {
    async function fetchDestination() {
      try {
        const res = await fetch("/api/destinations/" + slug);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setDestination(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDestination();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-forest border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium mb-2">
            Destination Not Found
          </h1>
          <Link href="/travel" className="text-forest hover:underline">
            Back to Travel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
        {destination.heroImage ? (
          <Image
            src={destination.heroImage}
            alt={destination.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest/40 via-forest/20 to-mint-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl">
            <Link
              href="/travel"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-3 transition-colors"
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
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight">
              {destination.name}
            </h1>
            <p className="mt-2 text-white/80 text-lg md:text-xl">
              {destination.country}
            </p>
            {destination.description && (
              <p className="mt-3 text-white/70 text-sm md:text-base max-w-2xl">
                {destination.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl md:text-2xl font-medium text-gray-900">
            Sections
          </h2>
          <div className="flex gap-1">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLevel(l);
                  localStorage.setItem("selectedLevel", l);
                }}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  level === l
                    ? "bg-forest text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {destination.sections.length === 0 ? (
          <p className="text-center text-muted py-12">
            No sections available yet.
          </p>
        ) : (
          <div className="space-y-3">
            {destination.sections.map((section) => (
              <Link
                key={section.id}
                href={"/travel/" + destination.slug + "/" + section.slug}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-forest/30 hover:shadow-md transition-all group"
              >
                <span className="text-2xl">
                  {sectionIcons[section.sectionType] || "📍"}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-forest transition-colors">
                    {section.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                    <span>
                      {section.wordCounts?.[level] ||
                        section.wordCounts?.B1 ||
                        "—"}{" "}
                      words
                    </span>
                    <span>
                      {section.readTimes?.[level] ||
                        section.readTimes?.B1 ||
                        "—"}{" "}
                      min
                    </span>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-forest transition-colors"
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
