"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Chapter {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  content: Record<string, string>;
  exercises: Record<string, { questions: any[] }>;
  vocabulary: { word: string; definition: string; level: string }[];
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
  book: { id: string; title: string; slug: string };
  prevChapter: { slug: string; title: string } | null;
  nextChapter: { slug: string; title: string } | null;
}

const levels = ["A1", "A2", "B1", "B2", "C1"];

export default function ChapterPage({ params }: { params: Promise<{ bookSlug: string; chapterSlug: string }> }) {
  const { bookSlug, chapterSlug } = use(params);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("B1");
  const [showExercises, setShowExercises] = useState(false);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  useEffect(() => {
    const saved = localStorage.getItem("selectedLevel");
    if (saved) setLevel(saved);
  }, []);

  useEffect(() => {
    async function fetchChapter() {
      try {
        const res = await fetch("/api/chapters/" + bookSlug + "/" + chapterSlug);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setChapter(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchChapter();
  }, [bookSlug, chapterSlug]);

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    localStorage.setItem("selectedLevel", newLevel);
    setAnswers({});
  };

  const speak = () => {
    if (!chapter) return;
    const content = chapter.content?.[level] || "";
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = level === "A1" ? 0.7 : level === "A2" ? 0.8 : 0.9;
    speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-forest border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium mb-2">Chapter Not Found</h1>
          <Link href="/learn" className="text-forest hover:underline">Back to Learn</Link>
        </div>
      </div>
    );
  }

  const content = chapter.content?.[level] || "Content not available for this level.";
  const exercises = chapter.exercises?.[level]?.questions || [];

  return (
    <div className="min-h-screen bg-cream">
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href={"/learn/" + bookSlug} className="text-muted hover:text-forest text-sm">
              &larr; {chapter.book?.title}
            </Link>
            <div className="flex items-center gap-2">
              {levels.map((l) => (
                <button
                  key={l}
                  onClick={() => handleLevelChange(l)}
                  className={"px-3 py-1 rounded-full text-xs font-medium transition-all " + (
                    level === l
                      ? "bg-forest text-white"
                      : "bg-cream-warm text-muted hover:bg-gray-200"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="text-sm text-muted mb-2">Chapter {chapter.orderIndex}</div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-gray-900">
            {chapter.title}
          </h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted">
            <span>{chapter.wordCounts?.[level] || "—"} words</span>
            <span>{chapter.readTimes?.[level] || "—"} min read</span>
            <button onClick={speak} className="text-forest hover:text-forest-dark flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              Listen
            </button>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          {content.split("\n\n").map((para, i) => (
            <p key={i} className="mb-4 text-gray-800 leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {chapter.vocabulary && chapter.vocabulary.length > 0 && (
          <div className="mt-10 p-5 bg-mint-light rounded-xl">
            <h3 className="font-display text-lg font-medium text-forest mb-4">Vocabulary</h3>
            <div className="grid gap-3">
              {chapter.vocabulary.map((v, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-medium text-gray-900">{v.word}:</span>
                  <span className="text-muted">{v.definition}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {exercises.length > 0 && (
          <div className="mt-10">
            <button
              onClick={() => setShowExercises(!showExercises)}
              className="w-full py-4 bg-forest text-white rounded-xl font-medium hover:bg-forest-dark transition-colors"
            >
              {showExercises ? "Hide Exercises" : "Practice Exercises"}
            </button>

            {showExercises && (
              <div className="mt-6 space-y-6">
                {exercises.map((q: any, i: number) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-gray-100">
                    <p className="font-medium text-gray-900 mb-3">{i + 1}. {q.question}</p>
                    
                    {q.type === "multiple_choice" && (
                      <div className="space-y-2">
                        {q.options?.map((opt: string, j: number) => (
                          <button
                            key={j}
                            onClick={() => setAnswers({ ...answers, [i]: j })}
                            className={"w-full text-left px-4 py-3 rounded-lg border transition-all " + (
                              answers[i] === j
                                ? answers[i] === q.correct
                                  ? "border-green-500 bg-green-50"
                                  : "border-red-500 bg-red-50"
                                : "border-gray-200 hover:border-forest"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === "true_false" && (
                      <div className="flex gap-3">
                        {["True", "False"].map((opt, j) => (
                          <button
                            key={opt}
                            onClick={() => setAnswers({ ...answers, [i]: j === 0 })}
                            className={"flex-1 px-4 py-3 rounded-lg border transition-all " + (
                              answers[i] === (j === 0)
                                ? answers[i] === q.answer
                                  ? "border-green-500 bg-green-50"
                                  : "border-red-500 bg-red-50"
                                : "border-gray-200 hover:border-forest"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === "fill_blank" && (
                      <input
                        type="text"
                        placeholder="Your answer..."
                        onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                        className={"w-full px-4 py-3 rounded-lg border transition-all " + (
                          answers[i]
                            ? answers[i].toLowerCase() === q.answer.toLowerCase()
                              ? "border-green-500 bg-green-50"
                              : "border-red-500 bg-red-50"
                            : "border-gray-200 focus:border-forest"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-12 flex items-center justify-between pt-6 border-t border-gray-200">
          {chapter.prevChapter ? (
            <Link
              href={"/learn/" + bookSlug + "/" + chapter.prevChapter.slug}
              className="flex items-center gap-2 text-forest hover:text-forest-dark"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">{chapter.prevChapter.title}</span>
            </Link>
          ) : <div />}
          
          {chapter.nextChapter ? (
            <Link
              href={"/learn/" + bookSlug + "/" + chapter.nextChapter.slug}
              className="flex items-center gap-2 text-forest hover:text-forest-dark"
            >
              <span className="text-sm">{chapter.nextChapter.title}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </article>
    </div>
  );
}
