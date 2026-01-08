"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLevel } from "@/components/LevelContext";

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
  see: "👁️",
  eat: "🍽️",
  sleep: "🏨",
  tips: "💡",
  buy: "🛍️",
  drink: "🍷",
  do: "🎯",
};

const levels = ["A1", "A2", "B1", "B2", "C1"];

export default function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { level } = useLevel();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-[var(--color-text)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl mb-3">Destination Not Found</h1>
          <Link href="/travel" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
            Back to Travel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1]">
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
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-warm)] via-[var(--color-cream-dark)] to-[var(--color-warm)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14">
          <div className="max-w-4xl">
            <Link
              href="/travel"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Travel
            </Link>
            <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
              {destination.region}
            </p>
            <h1 className="editorial-headline text-4xl md:text-5xl lg:text-6xl text-white">
              {destination.name}
            </h1>
            <p className="mt-2 text-white/80 text-lg">
              {destination.country}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Description */}
        {destination.description && (
          <p className="text-[var(--color-text-soft)] text-lg md:text-xl leading-relaxed mb-10 pb-10 border-b border-[var(--color-border)]">
            {destination.description}
          </p>
        )}

        {/* Sections */}
        <section>
          <div className="mb-6 border-b border-[var(--color-border)] pb-4">
            <p className="editorial-subhead mb-1">Guide</p>
            <h2 className="font-display text-2xl text-[var(--color-text)]">
              Sections
            </h2>
          </div>

          {destination.sections.length === 0 ? (
            <p className="text-center text-[var(--color-text-muted)] py-12">
              No sections available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {destination.sections.map((section, index) => (
                <Link
                  key={section.id}
                  href={"/travel/" + destination.slug + "/" + section.slug}
                  className="flex items-center gap-5 p-5 bg-white border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-strong)] hover:shadow-sm transition-all group"
                >
                  <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                    {sectionIcons[section.sectionType] || "📍"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-display text-lg text-[var(--color-text)] group-hover:text-[var(--color-forest)] transition-colors">
                      {section.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-text-muted)]">
                      <span>
                        {section.wordCounts?.[level] || section.wordCounts?.B1 || "—"} words
                      </span>
                      <span>
                        {section.readTimes?.[level] || section.readTimes?.B1 || "—"} min read
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Source attribution */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            Content adapted from Wikivoyage under CC BY-SA license
          </p>
        </div>
      </div>
    </div>
  );
}
