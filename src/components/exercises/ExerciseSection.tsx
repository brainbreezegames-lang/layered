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
        <ComprehensionQuestions questions={exercises.comprehension} />
        <VocabularyMatching exercise={exercises.vocabularyMatching} />
        <GapFill exercise={exercises.gapFill} />
        <WordOrder exercise={exercises.wordOrder} />
        <TrueFalse exercise={exercises.trueFalse} />
        <DiscussionQuestions questions={exercises.discussion} />
      </div>
    </section>
  );
}
