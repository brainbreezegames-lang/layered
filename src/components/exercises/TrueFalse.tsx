"use client";

import { useState } from "react";
import { TrueFalseExercise } from "@/types";
import { ExerciseCard } from "./ExerciseCard";

interface Props {
  exercise: TrueFalseExercise;
}

export function TrueFalse({ exercise }: Props) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (index: number, answer: boolean) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const reset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const correctCount = exercise.statements.filter(
    (s, index) => answers[index] === s.answer
  ).length;

  return (
    <ExerciseCard
      title="True or False"
      icon="✓✗"
      description={`${exercise.statements.length} statements to judge`}
    >
      <div className="space-y-4 mt-4">
        {exercise.statements.map((statement, index) => {
          const userAnswer = answers[index];
          const isCorrect = showResults && userAnswer === statement.answer;
          const isIncorrect = showResults && userAnswer !== null && userAnswer !== statement.answer;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-colors ${
                isCorrect
                  ? "border-correct bg-correct/5"
                  : isIncorrect
                  ? "border-incorrect bg-incorrect/5"
                  : "border-gray-200"
              }`}
            >
              <p className="font-ui text-gray-800 mb-3">
                {index + 1}. {statement.text}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(index, true)}
                  disabled={showResults}
                  className={`flex-1 py-2 px-4 rounded-lg font-ui font-medium transition-all border-2 ${
                    userAnswer === true
                      ? showResults
                        ? statement.answer === true
                          ? "border-correct bg-correct text-white"
                          : "border-incorrect bg-incorrect text-white"
                        : "border-primary bg-primary text-white"
                      : showResults && statement.answer === true
                      ? "border-correct bg-correct/10 text-correct"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  ✓ True
                </button>
                <button
                  onClick={() => handleAnswer(index, false)}
                  disabled={showResults}
                  className={`flex-1 py-2 px-4 rounded-lg font-ui font-medium transition-all border-2 ${
                    userAnswer === false
                      ? showResults
                        ? statement.answer === false
                          ? "border-correct bg-correct text-white"
                          : "border-incorrect bg-incorrect text-white"
                        : "border-primary bg-primary text-white"
                      : showResults && statement.answer === false
                      ? "border-correct bg-correct/10 text-correct"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  ✗ False
                </button>
              </div>

              {showResults && isIncorrect && (
                <p className="mt-2 text-sm text-gray-600 font-ui">
                  💡 {statement.explanation}
                </p>
              )}
            </div>
          );
        })}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {showResults ? (
            <>
              <p className="font-ui font-semibold">
                Score: {correctCount}/{exercise.statements.length}
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
              disabled={Object.keys(answers).length < exercise.statements.length}
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
