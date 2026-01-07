"use client";

import { VocabularyItem } from "@/types";
import { useState } from "react";

interface ArticleContentProps {
  content: string;
  vocabulary: VocabularyItem[];
}

export function ArticleContent({ content, vocabulary }: ArticleContentProps) {
  const [activeWord, setActiveWord] = useState<string | null>(null);

  // Create a map of vocabulary words for quick lookup
  const vocabMap = new Map(vocabulary.map((v) => [v.word.toLowerCase(), v]));

  // Split content into paragraphs and process
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  const highlightVocabulary = (text: string) => {
    const words = text.split(/(\s+)/);

    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, "");
      const vocabItem = vocabMap.get(cleanWord);

      if (vocabItem) {
        const isActive = activeWord === cleanWord;
        return (
          <span key={index} className="relative inline-block">
            <span
              className="vocab-word cursor-help"
              onMouseEnter={() => setActiveWord(cleanWord)}
              onMouseLeave={() => setActiveWord(null)}
              onClick={() => setActiveWord(isActive ? null : cleanWord)}
            >
              {word}
            </span>
            {isActive && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10 font-ui">
                <span className="font-semibold">{vocabItem.word}</span>: {vocabItem.definition}
                <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" />
              </span>
            )}
          </span>
        );
      }

      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div className="article-content font-body text-xl leading-relaxed text-gray-800">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-6">
          {highlightVocabulary(paragraph)}
        </p>
      ))}
    </div>
  );
}
