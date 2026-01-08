"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  heroImage: string | null;
  description: string | null;
}

interface TravelPhrase {
  id: string;
  slug: string;
  title: string;
  category: string;
  icon: string | null;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
}

const regions = [
  { id: "all", label: "All Destinations" },
  { id: "europe", label: "Europe" },
  { id: "asia", label: "Asia" },
  { id: "americas", label: "Americas" },
  { id: "africa", label: "Africa" },
  { id: "oceania", label: "Oceania" },
];

export default function TravelPage() {
  const [activeRegion, setActiveRegion] = useState("all");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [phrases, setPhrases] = useState<TravelPhrase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeRegion !== "all") params.set("region", activeRegion);

        const [destRes, phraseRes] = await Promise.all([
          fetch("/api/destinations?" + params.toString()),
          fetch("/api/travel-phrases"),
        ]);

        if (destRes.ok) {
          const destData = await destRes.json();
          setDestinations(Array.isArray(destData) ? destData : []);
        }
        if (phraseRes.ok) {
          const phraseData = await phraseRes.json();
          setPhrases(Array.isArray(phraseData) ? phraseData : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeRegion]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Editorial Header */}
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="editorial-subhead mb-3">Travel English</p>
          <h1 className="editorial-headline text-4xl md:text-5xl lg:text-6xl text-[var(--color-text)]">
            Discover the World
          </h1>
          <p className="mt-4 text-[var(--color-text-soft)] text-lg md:text-xl max-w-2xl leading-relaxed">
            Explore destinations and learn the language you need for your next journey.
          </p>
        </div>
      </header>

      {/* Region Filter - Editorial tabs */}
      <nav className="sticky top-14 md:top-16 z-40 bg-[var(--color-cream)] border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto py-0 -mx-4 px-4 scrollbar-hide">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                className={`nav-tab whitespace-nowrap ${
                  activeRegion === region.id ? "active" : ""
                }`}
              >
                {region.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Travel Phrases Section */}
        {activeRegion === "all" && phrases.length > 0 && (
          <section className="mb-16">
            <div className="flex items-baseline justify-between mb-6 border-b border-[var(--color-border)] pb-4">
              <div>
                <p className="editorial-subhead mb-1">Essential</p>
                <h2 className="font-display text-2xl md:text-3xl text-[var(--color-text)]">
                  Travel Phrases
                </h2>
              </div>
              <Link
                href="/travel/phrases"
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {phrases.slice(0, 6).map((phrase) => (
                <Link
                  key={phrase.id}
                  href={"/travel/phrases/" + phrase.slug}
                  className="editorial-card text-center group hover:border-[var(--color-border-strong)]"
                >
                  <span className="text-2xl mb-3 block opacity-80 group-hover:opacity-100 transition-opacity">
                    {phrase.icon || "💬"}
                  </span>
                  <h3 className="font-display text-base text-[var(--color-text)] group-hover:text-[var(--color-forest)] transition-colors">
                    {phrase.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Destinations Grid */}
        <section>
          <div className="mb-8 border-b border-[var(--color-border)] pb-4">
            <p className="editorial-subhead mb-1">
              {activeRegion === "all" ? "Featured" : regions.find(r => r.id === activeRegion)?.label}
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-[var(--color-text)]">
              Destinations
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[var(--color-warm)] rounded-md mb-4" />
                  <div className="h-5 bg-[var(--color-warm)] rounded w-2/3 mb-2" />
                  <div className="h-4 bg-[var(--color-warm)] rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-20">
              <p className="editorial-subhead mb-2">No destinations found</p>
              <p className="text-[var(--color-text-muted)]">
                Check back soon for new travel content.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {destinations.map((dest, index) => (
                <Link
                  key={dest.id}
                  href={"/travel/" + dest.slug}
                  className="group animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: index * 0.08 + "s",
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-4">
                    {dest.heroImage ? (
                      <Image
                        src={dest.heroImage}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-warm)] to-[var(--color-cream-dark)] flex items-center justify-center">
                        <span className="text-4xl opacity-30">🌍</span>
                      </div>
                    )}
                  </div>
                  <p className="category-tag mb-1">
                    {dest.region}
                  </p>
                  <h3 className="font-display text-xl md:text-2xl text-[var(--color-text)] group-hover:text-[var(--color-forest)] transition-colors leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-[var(--color-text-muted)] mt-1">
                    {dest.country}
                  </p>
                  {dest.description && (
                    <p className="text-[var(--color-text-soft)] mt-2 text-sm line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
