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
  { id: "all", label: "All" },
  { id: "europe", label: "Europe" },
  { id: "asia", label: "Asia" },
  { id: "americas", label: "Americas" },
  { id: "africa", label: "Africa" },
  { id: "oceania", label: "Oceania" },
];

const regionColors: Record<string, string> = {
  europe: "bg-blue-100 text-blue-800",
  asia: "bg-rose-100 text-rose-800",
  americas: "bg-amber-100 text-amber-800",
  africa: "bg-orange-100 text-orange-800",
  oceania: "bg-teal-100 text-teal-800",
};

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
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-8 pb-6 md:pt-12 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-medium text-center text-gray-900">
            Travel English
          </h1>
          <p className="text-center text-muted mt-2 md:mt-3 text-sm md:text-base">
            Explore the world while learning English
          </p>
        </div>
      </section>

      {/* Region Filter */}
      <nav className="sticky top-14 md:top-16 z-40 bg-cream border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 -mx-4 px-4 scrollbar-hide">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                className={
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all " +
                  (activeRegion === region.id
                    ? "bg-forest text-white"
                    : "bg-cream-warm text-muted hover:bg-gray-200")
                }
              >
                {region.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Travel Phrases Section */}
        {activeRegion === "all" && phrases.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl md:text-2xl font-medium text-gray-900">
                Travel Phrases
              </h2>
              <Link
                href="/travel/phrases"
                className="text-sm text-forest hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {phrases.slice(0, 6).map((phrase) => (
                <Link
                  key={phrase.id}
                  href={"/travel/phrases/" + phrase.slug}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-forest/20 transition-all text-center group"
                >
                  <span className="text-3xl mb-2 block">
                    {phrase.icon || "💬"}
                  </span>
                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-forest transition-colors">
                    {phrase.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Destinations Grid */}
        <section>
          <h2 className="font-display text-xl md:text-2xl font-medium text-gray-900 mb-6">
            {activeRegion === "all" ? "Popular Destinations" : regions.find(r => r.id === activeRegion)?.label + " Destinations"}
          </h2>

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
          ) : destinations.length === 0 ? (
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
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-medium text-gray-900 mb-3">
                No Destinations Found
              </h2>
              <p className="text-muted max-w-md mx-auto">
                No travel destinations available in this region yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {destinations.map((dest, index) => (
                <Link
                  key={dest.id}
                  href={"/travel/" + dest.slug}
                  className="article-card group animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: index * 0.1 + "s",
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {dest.heroImage ? (
                      <Image
                        src={dest.heroImage}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-forest/20 to-mint-light flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-forest/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span
                      className={
                        "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium " +
                        (regionColors[dest.region] || "bg-gray-100 text-gray-800")
                      }
                    >
                      {dest.region.charAt(0).toUpperCase() + dest.region.slice(1)}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-medium text-gray-900 group-hover:text-forest transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-muted mt-1">{dest.country}</p>
                    {dest.description && (
                      <p className="text-sm text-muted mt-2 line-clamp-2">
                        {dest.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
