"use client";

import { VocabularyItem } from "@/types";
import { useState, useEffect } from "react";
import { TTSPlayer } from "@/components/audio/TTSPlayer";
import { useLevel } from "@/components/LevelContext";

interface ArticleContentProps {
  content: string;
  vocabulary: VocabularyItem[];
}

export function ArticleContent({ content, vocabulary }: ArticleContentProps) {
  const [activeWord, setActiveWord] = useState<VocabularyItem | null>(null);
  const { level } = useLevel();

  // Create a map of vocabulary words for quick lookup
  const vocabMap = new Map(vocabulary.map((v) => [v.word.toLowerCase(), v]));

  // Track which words have been highlighted to only show first occurrence
  const highlightedWords = new Set<string>();

  // Split content into paragraphs and process
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".vocab-highlight") && !target.closest(".vocab-tooltip")) {
        setActiveWord(null);
      }
    };

    if (activeWord) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeWord]);

  const handleWordClick = (vocabItem: VocabularyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveWord(activeWord?.word === vocabItem.word ? null : vocabItem);
  };

  const highlightVocabulary = (text: string) => {
    const words = text.split(/(\s+)/);

    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, "");
      const vocabItem = vocabMap.get(cleanWord);

      // Only highlight first occurrence of each word
      if (vocabItem && !highlightedWords.has(cleanWord)) {
        highlightedWords.add(cleanWord);
        const isActive = activeWord?.word.toLowerCase() === cleanWord;
        return (
          <span
            key={index}
            className={`vocab-highlight ${isActive ? "active" : ""}`}
            onClick={(e) => handleWordClick(vocabItem, e)}
          >
            {word}
          </span>
        );
      }

      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div className="article-content">
      {/* Vocabulary hint */}
      {vocabulary.length > 0 && (
        <p className="text-sm text-muted mb-6 no-print">
          <span className="vocab-highlight">Highlighted words</span> have definitions — tap to learn.
        </p>
      )}

      {/* Audio Player - Desktop (above content) */}
      <div className="hidden md:block mb-8">
        <TTSPlayer text={content} level={level} />
      </div>

      {/* Article text */}
      <div className="font-body">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            {highlightVocabulary(paragraph)}
          </p>
        ))}
      </div>

      {/* Mobile Floating Actions - Using compact TTS player */}
      <div className="floating-actions no-print">
        <TTSPlayer text={content} level={level} compact />
      </div>

      {/* Vocabulary Tooltip - Fixed position for mobile */}
      {activeWord && (
        <div className="vocab-tooltip">
          <button
            className="close-btn"
            onClick={() => setActiveWord(null)}
            aria-label="Close definition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="word">{activeWord.word}</div>
          <div className="definition">{activeWord.definition}</div>
          <span className="level-tag">{activeWord.level} vocabulary</span>
        </div>
      )}
    </div>
  );
}
