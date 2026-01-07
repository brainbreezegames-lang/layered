"use client";

import { useState, useEffect } from "react";
import { WordOrderExercise } from "@/types";
import { ExerciseCard } from "./ExerciseCard";

interface Props {
  exercise: WordOrderExercise;
}

export function WordOrder({ exercise }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);

  const currentSentence = exercise.sentences[currentIndex];

  useEffect(() => {
    setShuffledWords([...currentSentence.scrambled].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
  }, [currentIndex, currentSentence.scrambled]);

  const handleWordClick = (word: string, fromSelected: boolean) => {
    if (showResults) return;

    if (fromSelected) {
      setSelectedWords((prev) => {
        const index = prev.indexOf(word);
        const newSelected = [...prev];
        newSelected.splice(index, 1);
        return newSelected;
      });
    } else {
      const availableCount = shuffledWords.filter((w) => w === word).length;
      const usedCount = selectedWords.filter((w) => w === word).length;
      if (usedCount < availableCount) {
        setSelectedWords((prev) => [...prev, word]);
      }
    }
  };

  const checkAnswer = () => {
    const userAnswer = selectedWords.join(" ").toLowerCase();
    const correctAnswer = currentSentence.correct.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    setResults((prev) => [...prev, isCorrect]);
    setShowResults(true);
  };

  const nextSentence = () => {
    if (currentIndex < exercise.sentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowResults(false);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setSelectedWords([]);
    setShowResults(false);
    setResults([]);
  };

  const isFinished = showResults && currentIndex === exercise.sentences.length - 1;
  const correctCount = results.filter(Boolean).length;

  const getWordAvailability = (word: string) => {
    const totalCount = shuffledWords.filter((w) => w === word).length;
    const usedCount = selectedWords.filter((w) => w === word).length;
    return totalCount - usedCount;
  };

  return (
    <ExerciseCard
      title="Word Order"
      icon="🔀"
      description={`${exercise.sentences.length} sentences to arrange`}
    >
      <div className="mt-4">
        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-ui text-sm text-gray-600">
            Sentence {currentIndex + 1} of {exercise.sentences.length}
          </p>
          <div className="flex gap-1">
            {exercise.sentences.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index < results.length
                    ? results[index]
                      ? "bg-correct"
                      : "bg-incorrect"
                    : index === currentIndex
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Selected words (answer area) */}
        <div className="min-h-[60px] p-4 bg-gray-50 rounded-lg mb-4 border-2 border-dashed border-gray-300">
          {selectedWords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <button
                  key={`selected-${index}`}
                  onClick={() => handleWordClick(word, true)}
                  disabled={showResults}
                  className={`px-3 py-1.5 rounded-lg font-ui text-sm transition-all ${
                    showResults
                      ? results[results.length - 1]
                        ? "bg-correct/20 text-correct border border-correct"
                        : "bg-incorrect/20 text-incorrect border border-incorrect"
                      : "bg-primary text-white hover:bg-primary-light"
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 font-ui text-sm">Click words below to build the sentence</p>
          )}
        </div>

        {/* Available words */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[...new Set(shuffledWords)].map((word) => {
            const available = getWordAvailability(word);
            return (
              <button
                key={word}
                onClick={() => handleWordClick(word, false)}
                disabled={showResults || available === 0}
                className={`px-3 py-1.5 rounded-lg font-ui text-sm border transition-all ${
                  available === 0
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white border-gray-300 hover:border-primary hover:bg-primary/5"
                }`}
              >
                {word}
                {shuffledWords.filter((w) => w === word).length > 1 && (
                  <span className="ml-1 text-xs text-gray-400">({available})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Show correct answer if wrong */}
        {showResults && !results[results.length - 1] && (
          <p className="text-sm text-gray-600 font-ui mb-4">
            ✓ Correct answer: <span className="text-correct font-medium">{currentSentence.correct}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {isFinished ? (
            <>
              <p className="font-ui font-semibold">
                Final Score: {correctCount}/{exercise.sentences.length}
              </p>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-ui font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </>
          ) : showResults ? (
            <button
              onClick={nextSentence}
              className="ml-auto px-6 py-2 bg-primary text-white font-ui font-medium rounded-lg hover:bg-primary-light transition-colors"
            >
              Next Sentence
            </button>
          ) : (
            <button
              onClick={checkAnswer}
              disabled={selectedWords.length !== shuffledWords.length}
              className="ml-auto px-6 py-2 bg-primary text-white font-ui font-medium rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          )}
        </div>
      </div>
    </ExerciseCard>
  );
}
