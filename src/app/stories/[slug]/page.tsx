"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { TTSPlayer } from "@/components/audio/TTSPlayer";
import { useLevel } from "@/components/LevelContext";

interface Story {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorBio: string | null;
  category: string;
  themes: string[];
  source: string;
  sourceUrl: string | null;
  heroImage: string | null;
  content: Record<string, string>;
  exercises: Record<string, any>;
  vocabulary: { word: string; definition: string; level: string }[];
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
}

const levels = ["A1", "A2", "B1", "B2", "C1"];

export default function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { level } = useLevel();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStory() {
      try {
        const res = await fetch("/api/stories/" + slug);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setStory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStory();
  }, [slug]);

  // Reset answers when level changes
  useEffect(() => {
    setAnswers({});
  }, [level]);

  const getVocabularyForLevel = useCallback(() => {
    if (!story?.vocabulary) return [];
    const levelIndex = levels.indexOf(level);
    return story.vocabulary.filter(v => levels.indexOf(v.level) <= levelIndex);
  }, [story, level]);

  const highlightVocabulary = useCallback((text: string, vocab: { word: string; definition: string; level: string }[]) => {
    if (!vocab || vocab.length === 0) return text;

    const parts: { text: string; isVocab: boolean; word?: typeof vocab[0] }[] = [];
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-[var(--color-text)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl mb-3">Story Not Found</h1>
          <Link href="/stories" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const content = story.content?.[level] || "Content not available for this level.";
  const exercises = story.exercises?.[level] || {};
  const vocab = getVocabularyForLevel();

  return (
    <article className="min-h-screen bg-[var(--color-cream)] pb-24 md:pb-12">
      {/* Mobile back button */}
      <div className="md:hidden sticky top-14 z-30 bg-[var(--color-cream)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="px-4 py-3">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Stories
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1]">
        {story.heroImage ? (
          <Image
            src={story.heroImage}
            alt={story.title}
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
              href="/stories"
              className="hidden md:inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Stories
            </Link>
            <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
              {story.category.replace("-", " ")}
            </p>
            <h1 className="editorial-headline text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              {story.title}
            </h1>
            <p className="mt-2 text-white/80 text-lg">
              by {story.author}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Story info */}
              <div className="p-5 bg-white border border-[var(--color-border)] rounded-lg">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Words</p>
                    <p className="font-display text-lg text-[var(--color-text)]">
                      {story.wordCounts?.[level] || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Read time</p>
                    <p className="font-display text-lg text-[var(--color-text)]">
                      {story.readTimes?.[level] || "—"} min
                    </p>
                  </div>
                </div>

                {/* Themes */}
                {story.themes && story.themes.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
                    <p className="editorial-subhead mb-2">Themes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {story.themes.map((theme) => (
                        <span key={theme} className="level-tag text-xs">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Author bio */}
              {story.authorBio && (
                <div className="hidden lg:block p-5 bg-[var(--color-warm)] border border-[var(--color-border)] rounded-lg">
                  <p className="editorial-subhead mb-2">About the Author</p>
                  <p className="text-sm text-[var(--color-text-soft)] leading-relaxed">{story.authorBio}</p>
                </div>
              )}

              {/* Source */}
              <div className="hidden lg:block text-xs text-[var(--color-text-muted)]">
                <p>Source: {story.source}</p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9">
            {/* Audio Player - Inline with content */}
            <div className="mb-8">
              <TTSPlayer text={content} level={level} />
            </div>

            {/* Story text with vocabulary highlighting */}
            <div className="prose prose-lg max-w-none mb-12">
              {content.split("\n\n").map((para, paraIndex) => {
                const parts = highlightVocabulary(para, vocab);
                return (
                  <p
                    key={paraIndex}
                    className="mb-6 text-[var(--color-text)] leading-[1.85] text-lg md:text-xl first:first-letter:float-left first:first-letter:font-display first:first-letter:text-5xl first:first-letter:pr-3 first:first-letter:pt-1 first:first-letter:leading-none first:first-letter:text-[var(--color-forest)]"
                  >
                    {Array.isArray(parts) ? (
                      parts.map((part, i) =>
                        part.isVocab && part.word ? (
                          <span key={i} className="relative">
                            <button
                              onClick={() => setActiveTooltip(activeTooltip === `${paraIndex}-${i}` ? null : `${paraIndex}-${i}`)}
                              className="border-b-2 border-[var(--color-gold)]/40 hover:border-[var(--color-gold)] transition-colors cursor-help"
                            >
                              {part.text}
                            </button>
                            {activeTooltip === `${paraIndex}-${i}` && (
                              <span className="absolute left-0 bottom-full mb-2 z-50 w-64 p-4 bg-[var(--color-text)] text-white text-sm rounded-lg shadow-xl">
                                <span className="block font-display text-lg mb-1">{part.word.word}</span>
                                <span className="block text-white/80 text-sm leading-relaxed">{part.word.definition}</span>
                                <span className="block mt-2 text-xs text-white/50">{part.word.level} Level</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }}
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
                    ) : (
                      para
                    )}
                  </p>
                );
              })}
            </div>

            {/* Mobile author bio */}
            {story.authorBio && (
              <div className="lg:hidden p-5 bg-[var(--color-warm)] border border-[var(--color-border)] rounded-lg mb-8">
                <p className="editorial-subhead mb-2">About {story.author}</p>
                <p className="text-sm text-[var(--color-text-soft)] leading-relaxed">{story.authorBio}</p>
              </div>
            )}

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
                      <span className="font-display text-[var(--color-text)] shrink-0">{v.word}</span>
                      <span className="text-sm text-[var(--color-text-soft)] leading-relaxed">{v.definition}</span>
                      <span className="ml-auto text-xs text-[var(--color-text-muted)] shrink-0">{v.level}</span>
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
                          <p className="font-display text-[var(--color-text)] mb-4">{i + 1}. {q.question}</p>
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

                {/* Fill in the Blank */}
                {exercises.fillInTheBlank && exercises.fillInTheBlank.length > 0 && (
                  <div className="mb-10">
                    <h4 className="editorial-subhead mb-4">Fill in the Blank</h4>
                    <div className="space-y-4">
                      {exercises.fillInTheBlank.map((q: any, i: number) => (
                        <div key={i} className="p-5 bg-white border border-[var(--color-border)] rounded-lg">
                          <p className="font-display text-[var(--color-text)] mb-4">{q.sentence}</p>
                          <input
                            type="text"
                            placeholder="Your answer..."
                            onChange={(e) => setAnswers({ ...answers, [`fill-${i}`]: e.target.value })}
                            className={`w-full px-4 py-3 rounded-lg border transition-all text-sm ${
                              answers[`fill-${i}`]
                                ? answers[`fill-${i}`].toLowerCase() === q.answer.toLowerCase()
                                  ? "border-green-600 bg-green-50"
                                  : "border-red-600 bg-red-50"
                                : "border-[var(--color-border)] focus:border-[var(--color-text)] bg-white"
                            }`}
                          />
                          {answers[`fill-${i}`] && answers[`fill-${i}`].toLowerCase() !== q.answer.toLowerCase() && (
                            <p className="mt-2 text-sm text-green-600">
                              Correct answer: <span className="font-medium">{q.answer}</span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discussion Questions */}
                {exercises.discussion && exercises.discussion.length > 0 && (
                  <div>
                    <h4 className="editorial-subhead mb-4">Discussion</h4>
                    <div className="space-y-3">
                      {exercises.discussion.map((q: string, i: number) => (
                        <div key={i} className="p-5 bg-[var(--color-warm)] border border-[var(--color-border)] rounded-lg">
                          <p className="text-[var(--color-text)] leading-relaxed">{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Back link */}
            <div className="pt-8 border-t border-[var(--color-border)]">
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
