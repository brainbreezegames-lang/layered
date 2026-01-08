"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { TTSPlayer } from "@/components/audio/TTSPlayer";

interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
}

interface Section {
  id: string;
  slug: string;
  title: string;
  sectionType: string;
  orderIndex: number;
  content: Record<string, string>;
  exercises: Record<string, any>;
  vocabulary: { word: string; definition: string; level: string }[] | null;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
  destination: Destination;
  prevSection: { slug: string; title: string } | null;
  nextSection: { slug: string; title: string } | null;
  totalSections: number;
}

const levels = ["A1", "A2", "B1", "B2", "C1"];

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

export default function SectionPage({
  params,
}: {
  params: Promise<{ slug: string; sectionSlug: string }>;
}) {
  const { slug, sectionSlug } = use(params);
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("B1");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedLevel");
    if (saved) setLevel(saved);
  }, []);

  useEffect(() => {
    async function fetchSection() {
      try {
        const res = await fetch("/api/destinations/" + slug + "/" + sectionSlug);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setSection(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSection();
  }, [slug, sectionSlug]);

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    localStorage.setItem("selectedLevel", newLevel);
    setAnswers({});
  };

  const getVocabularyForLevel = useCallback(() => {
    if (!section?.vocabulary) return [];
    const levelIndex = levels.indexOf(level);
    return section.vocabulary.filter((v) => levels.indexOf(v.level) <= levelIndex);
  }, [section, level]);

  const highlightVocabulary = useCallback(
    (
      text: string,
      vocab: { word: string; definition: string; level: string }[]
    ) => {
      if (!vocab || vocab.length === 0) return text;

      const parts: {
        text: string;
        isVocab: boolean;
        word?: (typeof vocab)[0];
      }[] = [];
      let remaining = text;
      const usedWords = new Set<string>();

      while (remaining.length > 0) {
        let found = false;
        for (const v of vocab) {
          const wordLower = v.word.toLowerCase();
          if (usedWords.has(wordLower)) continue;

          const regex = new RegExp(`\\b(${v.word})\\b`, "i");
          const match = remaining.match(regex);

          if (match && match.index !== undefined) {
            if (match.index > 0) {
              parts.push({ text: remaining.slice(0, match.index), isVocab: false });
            }
            parts.push({ text: match[1], isVocab: true, word: v });
            remaining = remaining.slice(match.index + match[1].length);
            usedWords.add(wordLower);
            found = true;
            break;
          }
        }
        if (!found) {
          const nextWord = remaining.match(/^\S+\s*/);
          if (nextWord) {
            parts.push({ text: nextWord[0], isVocab: false });
            remaining = remaining.slice(nextWord[0].length);
          } else {
            parts.push({ text: remaining, isVocab: false });
            remaining = "";
          }
        }
      }

      return parts;
    },
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-forest border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium mb-2">
            Section Not Found
          </h1>
          <Link href="/travel" className="text-forest hover:underline">
            Back to Travel
          </Link>
        </div>
      </div>
    );
  }

  const content =
    section.content?.[level] || "Content not available for this level.";
  const exercises = section.exercises?.[level] || {};
  const vocab = getVocabularyForLevel();

  return (
    <article className="min-h-screen bg-cream pb-24 md:pb-12">
      {/* Back button - Mobile */}
      <div className="md:hidden sticky top-14 z-30 bg-cream/95 backdrop-blur-sm border-b border-gray-100">
        <div className="px-4 py-3">
          <Link
            href={"/travel/" + section.destination.slug}
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
            {section.destination.name}
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-forest/10 to-mint-light/30 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={"/travel/" + section.destination.slug}
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
            {section.destination.name}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">
              {sectionIcons[section.sectionType] || "📍"}
            </span>
            <span className="text-sm text-muted">
              Section {section.orderIndex} of {section.totalSections}
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-medium text-gray-900">
            {section.title}
          </h1>
          <p className="text-muted mt-2">
            {section.destination.name}, {section.destination.country}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="md:grid md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 mb-6 md:mb-0">
            <div className="md:sticky md:top-24 space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                {/* Level selector */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Reading Level
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((l) => (
                      <button
                        key={l}
                        onClick={() => handleLevelChange(l)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
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

                {/* Stats */}
                <div className="flex items-center gap-4 py-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Words</p>
                    <p className="font-medium text-forest">
                      {section.wordCounts?.[level] || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Read time</p>
                    <p className="font-medium text-forest">
                      {section.readTimes?.[level] || "—"} min
                    </p>
                  </div>
                </div>

                {/* Source */}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Source</p>
                  <p className="text-sm text-gray-700">Wikivoyage</p>
                  <p className="text-xs text-gray-500 mt-1">CC BY-SA</p>
                </div>
              </div>

              {/* Audio Player */}
              <div className="hidden md:block">
                <TTSPlayer text={content} level={level} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Audio Player - Mobile */}
            <div className="md:hidden mb-6">
              <TTSPlayer text={content} level={level} />
            </div>

            {/* Content text */}
            <div className="prose prose-lg max-w-none mb-10">
              {content.split("\n\n").map((para, paraIndex) => {
                const parts = highlightVocabulary(para, vocab);
                return (
                  <p
                    key={paraIndex}
                    className="mb-5 text-gray-800 leading-relaxed text-lg"
                  >
                    {Array.isArray(parts)
                      ? parts.map((part, i) =>
                          part.isVocab && part.word ? (
                            <span key={i} className="relative">
                              <button
                                onClick={() =>
                                  setActiveTooltip(
                                    activeTooltip === `${paraIndex}-${i}`
                                      ? null
                                      : `${paraIndex}-${i}`
                                  )
                                }
                                className="vocabulary-word bg-gradient-to-b from-transparent via-transparent to-mint-light/60 hover:to-mint-light transition-colors cursor-help"
                              >
                                {part.text}
                              </button>
                              {activeTooltip === `${paraIndex}-${i}` && (
                                <span className="absolute left-0 bottom-full mb-2 z-50 w-64 p-3 bg-forest text-white text-sm rounded-lg shadow-lg">
                                  <span className="block font-serif text-lg mb-1">
                                    {part.word.word}
                                  </span>
                                  <span className="block text-white/90 text-xs">
                                    {part.word.definition}
                                  </span>
                                  <span className="block mt-2 text-xs text-mint-light">
                                    {part.word.level} Level
                                  </span>
                                </span>
                              )}
                            </span>
                          ) : (
                            <span key={i}>{part.text}</span>
                          )
                        )
                      : para}
                  </p>
                );
              })}
            </div>

            {/* Vocabulary */}
            {vocab.length > 0 && (
              <div className="bg-white rounded-xl p-6 mb-8 border border-gray-100">
                <h3 className="font-display text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-forest"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
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
              <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8">
                <h3 className="font-display text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-forest"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Practice Exercises
                </h3>

                {/* Comprehension Questions */}
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

                {/* True or False */}
                {exercises.trueOrFalse && exercises.trueOrFalse.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      True or False
                    </h4>
                    <div className="space-y-4">
                      {exercises.trueOrFalse.map((q: any, i: number) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900 mb-3">
                            {q.statement}
                          </p>
                          <div className="flex gap-3">
                            {["True", "False"].map((opt, j) => (
                              <button
                                key={opt}
                                onClick={() =>
                                  setAnswers({ ...answers, [`tf-${i}`]: j === 0 })
                                }
                                className={`flex-1 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
                                  answers[`tf-${i}`] === (j === 0)
                                    ? answers[`tf-${i}`] === q.correct
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

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              {section.prevSection ? (
                <Link
                  href={
                    "/travel/" +
                    section.destination.slug +
                    "/" +
                    section.prevSection.slug
                  }
                  className="flex-1 flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-forest/30 hover:shadow-md transition-all group"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs text-muted">Previous</p>
                    <p className="font-medium text-gray-900 truncate group-hover:text-forest transition-colors">
                      {section.prevSection.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {section.nextSection && (
                <Link
                  href={
                    "/travel/" +
                    section.destination.slug +
                    "/" +
                    section.nextSection.slug
                  }
                  className="flex-1 flex items-center justify-end gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-forest/30 hover:shadow-md transition-all group text-right"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-muted">Next</p>
                    <p className="font-medium text-gray-900 truncate group-hover:text-forest transition-colors">
                      {section.nextSection.title}
                    </p>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
