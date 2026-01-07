"use client";

import { useState, ReactNode } from "react";
import { GapFillExercise } from "@/types";
import { ExerciseCard } from "./ExerciseCard";

interface Props {
  exercise: GapFillExercise;
}

export function GapFill({ exercise }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);

  const usedWords = Object.values(answers);

  const handleDrop = (blankId: number) => {
    if (showResults || !draggedWord) return;
    setAnswers((prev) => ({ ...prev, [blankId]: draggedWord }));
    setDraggedWord(null);
  };

  const handleWordClick = (word: string) => {
    if (showResults) return;
    // Find first empty blank
    const emptyBlank = exercise.blanks.find((b) => !answers[b.id]);
    if (emptyBlank) {
      setAnswers((prev) => ({ ...prev, [emptyBlank.id]: word }));
    }
  };

  const handleBlankClick = (blankId: number) => {
    if (showResults) return;
    const newAnswers = { ...answers };
    delete newAnswers[blankId];
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const reset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const isCorrect = (blankId: number) => {
    const blank = exercise.blanks.find((b) => b.id === blankId);
    return blank && answers[blankId]?.toLowerCase() === blank.answer.toLowerCase();
  };

  const correctCount = exercise.blanks.filter((b) => isCorrect(b.id)).length;

  // Render text with blanks
  const renderText = () => {
    const elements: ReactNode[] = [];
    let blankIndex = 0;

    // Split by _____ pattern
    const parts = exercise.text.split(/_____/);

    parts.forEach((part, index) => {
      elements.push(<span key={`text-${index}`}>{part}</span>);

      if (index < parts.length - 1) {
        const blank = exercise.blanks[blankIndex];
        if (blank) {
          const answer = answers[blank.id];
          const correct = showResults && isCorrect(blank.id);
          const incorrect = showResults && answer && !isCorrect(blank.id);

          elements.push(
            <span
              key={`blank-${blank.id}`}
              onClick={() => handleBlankClick(blank.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(blank.id)}
              className={`inline-block min-w-[100px] px-2 py-1 mx-1 border-b-2 text-center cursor-pointer transition-colors ${
                correct
                  ? "border-correct bg-correct/10 text-correct"
                  : incorrect
                  ? "border-incorrect bg-incorrect/10 text-incorrect"
                  : answer
                  ? "border-accent bg-accent/10"
                  : "border-gray-400 bg-gray-50"
              }`}
            >
              {answer || (
                <span className="text-gray-400">{blankIndex + 1}</span>
              )}
              {showResults && incorrect && (
                <span className="block text-xs text-correct mt-1">
                  ({blank.answer})
                </span>
              )}
            </span>
          );
          blankIndex++;
        }
      }
    });

    return elements;
  };

  return (
    <ExerciseCard
      title="Gap Fill"
      icon="📝"
      description={`${exercise.blanks.length} blanks to fill`}
    >
      <div className="mt-4">
        {/* Word Bank */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-ui font-semibold text-gray-700 mb-3">Word Bank</p>
          <div className="flex flex-wrap gap-2">
            {exercise.wordBank.map((word) => {
              const isUsed = usedWords.includes(word);
              return (
                <button
                  key={word}
                  onClick={() => !isUsed && handleWordClick(word)}
                  draggable={!isUsed && !showResults}
                  onDragStart={() => setDraggedWord(word)}
                  onDragEnd={() => setDraggedWord(null)}
                  disabled={isUsed || showResults}
                  className={`px-3 py-1.5 rounded-full font-ui text-sm transition-all ${
                    isUsed
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 hover:border-primary hover:bg-primary/5 cursor-grab"
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Text with blanks */}
        <div className="font-body text-lg leading-relaxed text-gray-800">
          {renderText()}
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
          {showResults ? (
            <>
              <p className="font-ui font-semibold">
                Score: {correctCount}/{exercise.blanks.length}
              </p>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-ui font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </>
          ) : (
            <button
              onClick={checkAnswers}
              disabled={Object.keys(answers).length < exercise.blanks.length}
              className="ml-auto px-6 py-2 bg-primary text-white font-ui font-medium rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answers
            </button>
          )}
        </div>
      </div>
    </ExerciseCard>
  );
}
