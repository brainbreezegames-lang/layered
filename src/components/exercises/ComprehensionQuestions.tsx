"use client";

import { useState } from "react";
import { ComprehensionQuestion } from "@/types";
import { ExerciseCard } from "./ExerciseCard";

interface Props {
  questions: ComprehensionQuestion[];
}

export function ComprehensionQuestions({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, answerId: string) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const reset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;

  return (
    <ExerciseCard
      title="Comprehension Questions"
      icon="📝"
      description={`${questions.length} questions about the article`}
      defaultOpen
    >
      <div className="space-y-6 mt-4">
        {questions.map((question, index) => (
          <div key={question.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
            <p className="font-ui font-medium text-gray-900 mb-3">
              {index + 1}. {question.question}
            </p>
            <div className="space-y-2">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.id;
                const isCorrect = option.id === question.correctAnswer;
                const showCorrect = showResults && isCorrect;
                const showIncorrect = showResults && isSelected && !isCorrect;

                return (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      showCorrect
                        ? "border-correct bg-correct/10"
                        : showIncorrect
                        ? "border-incorrect bg-incorrect/10"
                        : isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={isSelected}
                      onChange={() => handleAnswer(question.id, option.id)}
                      disabled={showResults}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="font-ui text-gray-700">
                      {option.id.toUpperCase()}) {option.text}
                    </span>
                    {showCorrect && (
                      <svg className="w-5 h-5 text-correct ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {showIncorrect && (
                      <svg className="w-5 h-5 text-incorrect ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                );
              })}
            </div>
            {showResults && answers[question.id] !== question.correctAnswer && (
              <p className="mt-2 text-sm text-gray-600 font-ui">
                💡 {question.explanation}
              </p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between pt-4">
          {showResults ? (
            <>
              <p className="font-ui font-semibold">
                Score: {correctCount}/{questions.length}
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
              disabled={Object.keys(answers).length < questions.length}
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
