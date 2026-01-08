"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { TTSPlayer } from "@/components/audio/TTSPlayer";

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

const categoryColors: Record<string, string> = {
  mystery: "bg-purple-100 text-purple-800",
  love: "bg-rose-100 text-rose-800",
  humor: "bg-amber-100 text-amber-800",
  moral: "bg-emerald-100 text-emerald-800",
  adventure: "bg-blue-100 text-blue-800",
  "slice-of-life": "bg-orange-100 text-orange-800",
};

export default function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("B1");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedLevel");
    if (saved) setLevel(saved);
  }, []);

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

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    localStorage.setItem("selectedLevel", newLevel);
    setAnswers({});
    setShowResults(false);
  };

  // Get vocabulary for current level and below
  const getVocabularyForLevel = useCallback(() => {
    if (!story?.vocabulary) return [];
    const levelIndex = levels.indexOf(level);
    return story.vocabulary.filter(v => levels.indexOf(v.level) <= levelIndex);
  }, [story, level]);

  // Highlight vocabulary words in content
  const highlightVocabulary = useCallback((text: string, vocab: { word: string; definition: string; level: string }[]) => {
    if (!vocab || vocab.length === 0) return text;

    const words = vocab.map(v => v.word.toLowerCase());
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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-forest border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium mb-2">Story Not Found</h1>
          <Link href="/stories" className="text-forest hover:underline">Back to Stories</Link>
        </div>
      </div>
    );
  }

  const content = story.content?.[level] || "Content not available for this level.";
  const exercises = story.exercises?.[level] || {};
  const vocab = getVocabularyForLevel();

  return (
    <article className="min-h-screen bg-cream pb-24 md:pb-12">
      {/* Back button - Mobile */}
      <div className="md:hidden sticky top-14 z-30 bg-cream/95 backdrop-blur-sm border-b border-gray-100">
        <div className="px-4 py-3">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Stories
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
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
          <div className="w-full h-full bg-gradient-to-br from-forest/40 via-forest/20 to-mint-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${categoryColors[story.category] || "bg-gray-100 text-gray-800"}`}>
              {story.category.replace("-", " ")}
            </span>
            <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-medium text-white leading-tight">
              {story.title}
            </h1>
            <p className="mt-2 text-white/80 text-sm md:text-lg">
              by {story.author}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="md:grid md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 mb-6 md:mb-0">
            <div className="md:sticky md:top-24 space-y-4">
              {/* Story info card */}
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
                    <p className="font-medium text-forest">{story.wordCounts?.[level] || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Read time</p>
                    <p className="font-medium text-forest">{story.readTimes?.[level] || "—"} min</p>
                  </div>
                </div>

                {/* Themes */}
                {story.themes && story.themes.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Themes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {story.themes.map((theme) => (
                        <span
                          key={theme}
                          className="text-xs px-2 py-1 bg-mint-light text-forest rounded-full"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source */}
                <div className="hidden md:block pt-3 border-t border-gray-100 mt-3">
                  <p className="text-xs text-gray-500 mb-1">Source</p>
                  {story.sourceUrl ? (
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-forest hover:underline"
                    >
                      {story.source}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-700">{story.source}</p>
                  )}
                </div>
              </div>

              {/* Audio Player - Desktop */}
              <div className="hidden md:block">
                <TTSPlayer text={content} level={level} />
              </div>

              {/* Author bio - Desktop */}
              {story.authorBio && (
                <div className="hidden md:block bg-cream-warm rounded-xl p-5">
                  <h3 className="font-display text-sm font-medium text-gray-900 mb-2">
                    About the Author
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{story.authorBio}</p>
                </div>
              )}

              {/* Back to stories - Desktop */}
              <div className="hidden md:block">
                <Link
                  href="/stories"
                  className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Stories
                </Link>
              </div>
            </div>
          </div>

          {/* Story content */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Audio Player - Mobile */}
            <div className="md:hidden mb-6">
              <TTSPlayer text={content} level={level} />
            </div>

            {/* Story text with vocabulary highlighting */}
            <div className="prose prose-lg max-w-none mb-10">
              {content.split("\n\n").map((para, paraIndex) => {
                const parts = highlightVocabulary(para, vocab);
                return (
                  <p key={paraIndex} className="mb-5 text-gray-800 leading-relaxed text-lg first-letter:text-4xl first-letter:font-display first-letter:font-medium first-letter:mr-1 first-letter:float-left first-letter:leading-none">
                    {Array.isArray(parts) ? (
                      parts.map((part, i) =>
                        part.isVocab && part.word ? (
                          <span key={i} className="relative">
                            <button
                              onClick={() => setActiveTooltip(activeTooltip === `${paraIndex}-${i}` ? null : `${paraIndex}-${i}`)}
                              className="vocabulary-word bg-gradient-to-b from-transparent via-transparent to-mint-light/60 hover:to-mint-light transition-colors cursor-help"
                            >
                              {part.text}
                            </button>
                            {activeTooltip === `${paraIndex}-${i}` && (
                              <span className="absolute left-0 bottom-full mb-2 z-50 w-64 p-3 bg-forest text-white text-sm rounded-lg shadow-lg">
                                <span className="block font-serif text-lg mb-1">{part.word.word}</span>
                                <span className="block text-white/90 text-xs">{part.word.definition}</span>
                                <span className="block mt-2 text-xs text-mint-light">{part.word.level} Level</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }}
                                  className="absolute top-1 right-1 p-1 hover:bg-white/10 rounded"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Author bio - Mobile */}
            {story.authorBio && (
              <div className="md:hidden bg-cream-warm rounded-xl p-5 mb-8">
                <h3 className="font-display text-base font-medium text-gray-900 mb-2">
                  About {story.author}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{story.authorBio}</p>
              </div>
            )}

            {/* Vocabulary section */}
            {vocab.length > 0 && (
              <div className="bg-white rounded-xl p-6 mb-8 border border-gray-100">
                <h3 className="font-display text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Vocabulary
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {vocab.slice(0, 12).map((v, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-forest shrink-0">{v.word}</span>
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
                <h3 className="font-display text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
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
                          <p className="font-medium text-gray-900 mb-3">{i + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options?.map((opt: string, j: number) => (
                              <button
                                key={j}
                                onClick={() => setAnswers({ ...answers, [`comp-${i}`]: j })}
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
                          <p className="font-medium text-gray-900 mb-3">{q.statement}</p>
                          <div className="flex gap-3">
                            {["True", "False"].map((opt, j) => (
                              <button
                                key={opt}
                                onClick={() => setAnswers({ ...answers, [`tf-${i}`]: j === 0 })}
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

                {/* Fill in the Blank */}
                {exercises.fillInTheBlank && exercises.fillInTheBlank.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Fill in the Blank
                    </h4>
                    <div className="space-y-4">
                      {exercises.fillInTheBlank.map((q: any, i: number) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900 mb-3">{q.sentence}</p>
                          <input
                            type="text"
                            placeholder="Your answer..."
                            onChange={(e) => setAnswers({ ...answers, [`fill-${i}`]: e.target.value })}
                            className={`w-full px-4 py-3 rounded-lg border transition-all text-sm ${
                              answers[`fill-${i}`]
                                ? answers[`fill-${i}`].toLowerCase() === q.answer.toLowerCase()
                                  ? "border-green-500 bg-green-50"
                                  : "border-red-500 bg-red-50"
                                : "border-gray-200 focus:border-forest bg-white"
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
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Discussion Questions
                    </h4>
                    <div className="space-y-3">
                      {exercises.discussion.map((q: string, i: number) => (
                        <div key={i} className="p-4 bg-mint-light/30 rounded-lg">
                          <p className="text-gray-800">{q}</p>
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
