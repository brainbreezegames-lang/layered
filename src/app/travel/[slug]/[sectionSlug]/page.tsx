"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { TTSPlayer } from "@/components/audio/TTSPlayer";
import { useLevel } from "@/components/LevelContext";

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
  see: "👁️",
  eat: "🍽️",
  sleep: "🏨",
  tips: "💡",
  buy: "🛍️",
  drink: "🍷",
  do: "🎯",
};

export default function SectionPage({
  params,
}: {
  params: Promise<{ slug: string; sectionSlug: string }>;
}) {
  const { slug, sectionSlug } = use(params);
  const { level } = useLevel();
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

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

  // Reset answers when level changes
  useEffect(() => {
    setAnswers({});
  }, [level]);

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
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-[var(--color-text)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl mb-3">Section Not Found</h1>
          <Link href="/travel" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
            Back to Travel
          </Link>
        </div>
      </div>
    );
  }

  const content = section.content?.[level] || "Content not available for this level.";
  const exercises = section.exercises?.[level] || {};
  const vocab = getVocabularyForLevel();

  return (
    <article className="min-h-screen bg-[var(--color-cream)] pb-24 md:pb-12">
      {/* Mobile back button */}
      <div className="md:hidden sticky top-14 z-30 bg-[var(--color-cream)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="px-4 py-3">
          <Link
            href={"/travel/" + section.destination.slug}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            {section.destination.name}
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <Link
            href={"/travel/" + section.destination.slug}
            className="hidden md:inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            {section.destination.name}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl opacity-70">
              {sectionIcons[section.sectionType] || "📍"}
            </span>
            <span className="editorial-subhead">
              Section {section.orderIndex} of {section.totalSections}
            </span>
          </div>

          <h1 className="editorial-headline text-3xl md:text-4xl lg:text-5xl text-[var(--color-text)]">
            {section.title}
          </h1>

          <p className="mt-3 text-[var(--color-text-muted)]">
            {section.destination.name}, {section.destination.country}
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Section Info */}
              <div className="p-5 bg-white border border-[var(--color-border)] rounded-lg">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Words</p>
                    <p className="font-display text-lg text-[var(--color-text)]">
                      {section.wordCounts?.[level] || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Read time</p>
                    <p className="font-display text-lg text-[var(--color-text)]">
                      {section.readTimes?.[level] || "—"} min
                    </p>
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              <div className="hidden lg:block">
                <TTSPlayer text={content} level={level} />
              </div>

              {/* Source */}
              <div className="hidden lg:block text-xs text-[var(--color-text-muted)]">
                <p>Source: Wikivoyage</p>
                <p>License: CC BY-SA</p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9">
            {/* Mobile Audio Player */}
            <div className="lg:hidden mb-8">
              <TTSPlayer text={content} level={level} />
            </div>

            {/* Content text */}
            <div className="prose prose-lg max-w-none mb-12">
              {content.split("\n\n").map((para, paraIndex) => {
                const parts = highlightVocabulary(para, vocab);
                return (
                  <p
                    key={paraIndex}
                    className="mb-6 text-[var(--color-text)] leading-[1.85] text-lg md:text-xl"
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
                                className="border-b-2 border-[var(--color-gold)]/40 hover:border-[var(--color-gold)] transition-colors cursor-help"
                              >
                                {part.text}
                              </button>
                              {activeTooltip === `${paraIndex}-${i}` && (
                                <span className="absolute left-0 bottom-full mb-2 z-50 w-64 p-4 bg-[var(--color-text)] text-white text-sm rounded-lg shadow-xl">
                                  <span className="block font-display text-lg mb-1">
                                    {part.word.word}
                                  </span>
                                  <span className="block text-white/80 text-sm leading-relaxed">
                                    {part.word.definition}
                                  </span>
                                  <span className="block mt-2 text-xs text-white/50">
                                    {part.word.level} Level
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveTooltip(null);
                                    }}
                                    className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
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
              <section className="mb-12">
                <div className="mb-6 border-b border-[var(--color-border)] pb-3">
                  <p className="editorial-subhead mb-1">Key Terms</p>
                  <h3 className="font-display text-xl text-[var(--color-text)]">Vocabulary</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {vocab.slice(0, 12).map((v, i) => (
                    <div
                      key={i}
                      className="flex items-baseline gap-3 p-4 bg-white border border-[var(--color-border)] rounded-lg"
                    >
                      <span className="font-display text-[var(--color-text)] shrink-0">
                        {v.word}
                      </span>
                      <span className="text-sm text-[var(--color-text-soft)] leading-relaxed">
                        {v.definition}
                      </span>
                      <span className="ml-auto text-xs text-[var(--color-text-muted)] shrink-0">
                        {v.level}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Exercises */}
            {exercises && Object.keys(exercises).length > 0 && (
              <section className="mb-12">
                <div className="mb-6 border-b border-[var(--color-border)] pb-3">
                  <p className="editorial-subhead mb-1">Practice</p>
                  <h3 className="font-display text-xl text-[var(--color-text)]">Exercises</h3>
                </div>

                {/* Comprehension Questions */}
                {exercises.comprehension && exercises.comprehension.length > 0 && (
                  <div className="mb-10">
                    <h4 className="editorial-subhead mb-4">Comprehension</h4>
                    <div className="space-y-4">
                      {exercises.comprehension.map((q: any, i: number) => (
                        <div key={i} className="p-5 bg-white border border-[var(--color-border)] rounded-lg">
                          <p className="font-display text-[var(--color-text)] mb-4">
                            {i + 1}. {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options?.map((opt: string, j: number) => (
                              <button
                                key={j}
                                onClick={() => setAnswers({ ...answers, [`comp-${i}`]: j })}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                                  answers[`comp-${i}`] === j
                                    ? answers[`comp-${i}`] === q.correct
                                      ? "border-green-600 bg-green-50 text-green-800"
                                      : "border-red-600 bg-red-50 text-red-800"
                                    : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] bg-white"
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
                  <div className="mb-10">
                    <h4 className="editorial-subhead mb-4">True or False</h4>
                    <div className="space-y-4">
                      {exercises.trueOrFalse.map((q: any, i: number) => (
                        <div key={i} className="p-5 bg-white border border-[var(--color-border)] rounded-lg">
                          <p className="font-display text-[var(--color-text)] mb-4">{q.statement}</p>
                          <div className="flex gap-3">
                            {["True", "False"].map((opt, j) => (
                              <button
                                key={opt}
                                onClick={() => setAnswers({ ...answers, [`tf-${i}`]: j === 0 })}
                                className={`flex-1 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
                                  answers[`tf-${i}`] === (j === 0)
                                    ? answers[`tf-${i}`] === q.correct
                                      ? "border-green-600 bg-green-50 text-green-800"
                                      : "border-red-600 bg-red-50 text-red-800"
                                    : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] bg-white"
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
              </section>
            )}

            {/* Navigation */}
            <nav className="flex items-stretch gap-4 pt-8 border-t border-[var(--color-border)]">
              {section.prevSection ? (
                <Link
                  href={"/travel/" + section.destination.slug + "/" + section.prevSection.slug}
                  className="flex-1 flex items-center gap-4 p-5 bg-white border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-strong)] transition-all group"
                >
                  <svg className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="min-w-0">
                    <p className="editorial-subhead mb-1">Previous</p>
                    <p className="font-display text-[var(--color-text)] truncate group-hover:text-[var(--color-forest)] transition-colors">
                      {section.prevSection.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {section.nextSection && (
                <Link
                  href={"/travel/" + section.destination.slug + "/" + section.nextSection.slug}
                  className="flex-1 flex items-center justify-end gap-4 p-5 bg-white border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-strong)] transition-all group text-right"
                >
                  <div className="min-w-0">
                    <p className="editorial-subhead mb-1">Next</p>
                    <p className="font-display text-[var(--color-text)] truncate group-hover:text-[var(--color-forest)] transition-colors">
                      {section.nextSection.title}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </article>
  );
}
