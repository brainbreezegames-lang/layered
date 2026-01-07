import { ExerciseCard } from "./ExerciseCard";

interface Props {
  questions: string[];
}

export function DiscussionQuestions({ questions }: Props) {
  return (
    <ExerciseCard
      title="Discussion Questions"
      icon="💬"
      description={`${questions.length} questions for conversation`}
    >
      <div className="space-y-4 mt-4">
        {questions.map((question, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10"
          >
            <p className="font-ui text-gray-800">
              <span className="font-semibold text-primary mr-2">{index + 1}.</span>
              {question}
            </p>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-ui">
            💡 Tip: Practice discussing these questions with a partner, teacher, or by writing your answers.
          </p>
        </div>
      </div>
    </ExerciseCard>
  );
}
