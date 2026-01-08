"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { TTSPlayer } from "@/components/audio/TTSPlayer";
import { useLevel } from "@/components/LevelContext";
import { filterVocabularyForLevel } from "@/lib/vocabulary-filter";

interface TravelPhrase {
  id: string;
  slug: string;
  title: string;
  category: string;
  icon: string | null;
  content: Record<string, string>;
  exercises: Record<string, any>;
  vocabulary: { word: string; definition: string; level: string }[] | null;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
}

const levels = ["A1", "A2", "B1", "B2", "C1"];

const categoryIcons: Record<string, string> = {
  airport: "✈️",
  hotel: "🏨",
  restaurant: "🍽️",
  transport: "🚇",
  emergency: "🚨",
  shopping: "🛍️",
};

export default function TravelPhrasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { level } = useLevel();
  const [phrase, setPhrase] = useState<TravelPhrase | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhrase() {
      try {
        const res = await fetch("/api/travel-phrases/" + slug);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setPhrase(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhrase();
  }, [slug]);

  // Reset answers when level changes
  useEffect(() => {
    setAnswers({});
  }, [level]);

  const getVocabularyForLevel = useCallback(() => {
    if (!phrase?.vocabulary) return [];
    // Use smart filter that removes common words and only shows challenging vocabulary
    return filterVocabularyForLevel(phrase.vocabulary, level);
  }, [phrase, level]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-forest border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!phrase) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium mb-2">
            Phrase Not Found
          </h1>
          <Link href="/travel/phrases" className="text-forest hover:underline">
            Back to Phrases
          </Link>
        </div>
      </div>
    );
  }

  const content =
    phrase.content?.[level] || "Content not available for this level.";
  const exercises = phrase.exercises?.[level] || {};
  const vocab = getVocabularyForLevel();

  return (
    <article className="min-h-screen bg-cream pb-24 md:pb-12">
      {/* Back button - Mobile */}
      <div className="md:hidden sticky top-14 z-30 bg-cream/95 backdrop-blur-sm border-b border-gray-100">
        <div className="px-4 py-3">
          <Link
            href="/travel/phrases"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest transition-colors"
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
            Travel Phrases
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-forest/10 to-mint-light/30 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/travel/phrases"
            className="hidden md:inline-flex items-center gap-2 text-sm text-muted hover:text-forest transition-colors mb-4"
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
            Travel Phrases
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">
              {phrase.icon || categoryIcons[phrase.category] || "💬"}
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-medium text-gray-900">
            {phrase.title}
          </h1>
          <p className="text-muted mt-2 capitalize">{phrase.category}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="md:grid md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 mb-6 md:mb-0">
            <div className="md:sticky md:top-24 space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Words</p>
                    <p className="font-medium text-forest">
                      {phrase.wordCounts?.[level] || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Read time</p>
                    <p className="font-medium text-forest">
                      {phrase.readTimes?.[level] || "—"} min
                    </p>
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              <div className="hidden md:block">
                <TTSPlayer text={content} level={level} />
              </div>

              {/* Back link */}
              <div className="hidden md:block">
                <Link
                  href="/travel/phrases"
                  className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest transition-colors"
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
                  Back to Phrases
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Audio Player - Mobile */}
            <div className="md:hidden mb-6">
              <TTSPlayer text={content} level={level} />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-10">
              {content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-5 text-gray-800 leading-relaxed text-lg">
                  {para}
                </p>
              ))}
            </div>

            {/* Vocabulary */}
            {vocab.length > 0 && (
              <div className="bg-white rounded-xl p-6 mb-8 border border-gray-100">
                <h3 className="font-display text-lg font-medium text-gray-900 mb-4">
                  Vocabulary
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {vocab.slice(0, 12).map((v, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-forest shrink-0">
                        {v.word}
                      </span>
                      <span className="text-sm text-gray-600">{v.definition}</span>
                      <span className="ml-auto text-xs px-1.5 py-0.5 bg-mint-light text-forest rounded shrink-0">
                        {v.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercises */}
            {exercises && Object.keys(exercises).length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-display text-lg font-medium text-gray-900 mb-6">
                  Practice Exercises
                </h3>

                {exercises.comprehension && exercises.comprehension.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Comprehension
                    </h4>
                    <div className="space-y-4">
                      {exercises.comprehension.map((q: any, i: number) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900 mb-3">
                            {i + 1}. {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options?.map((opt: string, j: number) => (
                              <button
                                key={j}
                                onClick={() =>
                                  setAnswers({ ...answers, [`comp-${i}`]: j })
                                }
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                                  answers[`comp-${i}`] === j
                                    ? answers[`comp-${i}`] === q.correct
                                      ? "border-green-500 bg-green-50 text-green-800"
                                      : "border-red-500 bg-red-50 text-red-800"
                                    : "border-gray-200 hover:border-forest bg-white"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
