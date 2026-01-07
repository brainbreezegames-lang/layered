"use client";

import { ExerciseSet } from "@/types";
import { ComprehensionQuestions } from "./ComprehensionQuestions";
import { VocabularyMatching } from "./VocabularyMatching";
import { GapFill } from "./GapFill";
import { WordOrder } from "./WordOrder";
import { TrueFalse } from "./TrueFalse";
import { DiscussionQuestions } from "./DiscussionQuestions";

interface Props {
  exercises: ExerciseSet;
}

export function ExerciseSection({ exercises }: Props) {
  if (!exercises) return null;

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <div className="text-center mb-10">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Exercises
        </h2>
        <p className="text-gray-500 font-ui">
          Practice what you&apos;ve learned
        </p>
      </div>

      <div className="space-y-4">
        {exercises.comprehension && exercises.comprehension.length > 0 && (
          <ComprehensionQuestions questions={exercises.comprehension} />
        )}
        {exercises.vocabularyMatching?.pairs && exercises.vocabularyMatching.pairs.length > 0 && (
          <VocabularyMatching exercise={exercises.vocabularyMatching} />
        )}
        {exercises.gapFill?.blanks && exercises.gapFill.blanks.length > 0 && (
          <GapFill exercise={exercises.gapFill} />
        )}
        {exercises.wordOrder?.sentences && exercises.wordOrder.sentences.length > 0 && (
          <WordOrder exercise={exercises.wordOrder} />
        )}
        {exercises.trueFalse?.statements && exercises.trueFalse.statements.length > 0 && (
          <TrueFalse exercise={exercises.trueFalse} />
        )}
        {exercises.discussion && exercises.discussion.length > 0 && (
          <DiscussionQuestions questions={exercises.discussion} />
        )}
      </div>
    </section>
  );
}
