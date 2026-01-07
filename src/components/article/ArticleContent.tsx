"use client";

import { VocabularyItem } from "@/types";
import { useState, useCallback, useEffect } from "react";

interface ArticleContentProps {
  content: string;
  vocabulary: VocabularyItem[];
}

export function ArticleContent({ content, vocabulary }: ArticleContentProps) {
  const [activeWord, setActiveWord] = useState<VocabularyItem | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const speakText = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [content, isSpeaking]);

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

      {/* Article text */}
      <div className="font-body">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            {highlightVocabulary(paragraph)}
          </p>
        ))}
      </div>

      {/* Mobile Floating Actions */}
      <div className="floating-actions no-print">
        <button
          onClick={speakText}
          className={`action-btn ${isSpeaking ? "action-btn-secondary" : "action-btn-primary"}`}
        >
          {isSpeaking ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              <span>Pause</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span>Listen</span>
            </>
          )}
        </button>
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
