"use client";

import { useState, useEffect } from "react";
import { VocabularyMatchingExercise } from "@/types";
import { ExerciseCard } from "./ExerciseCard";

interface Props {
  exercise: VocabularyMatchingExercise;
}

export function VocabularyMatching({ exercise }: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]);

  useEffect(() => {
    setShuffledDefinitions(
      [...exercise.pairs.map((p) => p.definition)].sort(() => Math.random() - 0.5)
    );
  }, [exercise]);

  const handleWordClick = (word: string) => {
    if (showResults) return;
    if (matches[word]) {
      const newMatches = { ...matches };
      delete newMatches[word];
      setMatches(newMatches);
    } else {
      setSelectedWord(word);
    }
  };

  const handleDefinitionClick = (definition: string) => {
    if (showResults || !selectedWord) return;
    if (Object.values(matches).includes(definition)) return;

    setMatches((prev) => ({ ...prev, [selectedWord]: definition }));
    setSelectedWord(null);
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const reset = () => {
    setMatches({});
    setShowResults(false);
    setSelectedWord(null);
    setShuffledDefinitions(
      [...exercise.pairs.map((p) => p.definition)].sort(() => Math.random() - 0.5)
    );
  };

  const isCorrect = (word: string) => {
    const pair = exercise.pairs.find((p) => p.word === word);
    return pair && matches[word] === pair.definition;
  };

  const correctCount = exercise.pairs.filter((p) => matches[p.word] === p.definition).length;

  return (
    <ExerciseCard
      title="Vocabulary Matching"
      icon="🔤"
      description={`${exercise.pairs.length} pairs to match`}
    >
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-4 font-ui">
          Click a word, then click its matching definition
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Words column */}
          <div className="space-y-2">
            <p className="font-ui font-semibold text-gray-700 mb-2">Words</p>
            {exercise.pairs.map((pair) => {
              const isMatched = !!matches[pair.word];
              const correct = showResults && isCorrect(pair.word);
              const incorrect = showResults && isMatched && !isCorrect(pair.word);

              return (
                <button
                  key={pair.word}
                  onClick={() => handleWordClick(pair.word)}
                  disabled={showResults}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 font-ui transition-all ${
                    correct
                      ? "border-correct bg-correct/10"
                      : incorrect
                      ? "border-incorrect bg-incorrect/10"
                      : selectedWord === pair.word
                      ? "border-primary bg-primary/10"
                      : isMatched
                      ? "border-accent bg-accent/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {pair.word}
                  {isMatched && !showResults && (
                    <span className="ml-2 text-xs text-gray-500">(click to unmatch)</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Definitions column */}
          <div className="space-y-2">
            <p className="font-ui font-semibold text-gray-700 mb-2">Definitions</p>
            {shuffledDefinitions.map((definition) => {
              const isMatched = Object.values(matches).includes(definition);
              const matchedWord = Object.keys(matches).find((w) => matches[w] === definition);
              const correct = showResults && matchedWord && isCorrect(matchedWord);
              const incorrect = showResults && matchedWord && !isCorrect(matchedWord);

              return (
                <button
                  key={definition}
                  onClick={() => handleDefinitionClick(definition)}
                  disabled={showResults || isMatched}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 font-ui text-sm transition-all ${
                    correct
                      ? "border-correct bg-correct/10"
                      : incorrect
                      ? "border-incorrect bg-incorrect/10"
                      : isMatched
                      ? "border-accent bg-accent/10 opacity-60"
                      : selectedWord
                      ? "border-gray-200 hover:border-primary cursor-pointer"
                      : "border-gray-200"
                  }`}
                >
                  {definition}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
          {showResults ? (
            <>
              <p className="font-ui font-semibold">
                Score: {correctCount}/{exercise.pairs.length}
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
              disabled={Object.keys(matches).length < exercise.pairs.length}
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
