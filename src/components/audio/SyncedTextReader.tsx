"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";

interface WordData {
  word: string;
  startTime: number;
  endTime: number;
  index: number;
  globalIndex: number;
  isWhitespace: boolean;
  isPunctuation: boolean;
}

interface SyncedTextReaderProps {
  content: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  className?: string;
  onWordClick?: (wordIndex: number, estimatedTime: number) => void;
  renderWord?: (word: string, isActive: boolean, isPast: boolean, onClick?: () => void) => React.ReactNode;
  vocabWords?: Set<string>; // Words that shouldn't trigger seek (have definitions)
}

// Estimate word duration weight based on characteristics
function getWordWeight(word: string): number {
  const cleanWord = word.replace(/[^a-zA-Z]/g, "");
  if (!cleanWord) return 0.2; // Punctuation/whitespace

  // Count vowel groups as approximate syllables
  const vowelGroups = cleanWord.match(/[aeiouy]+/gi) || [];
  const syllables = Math.max(1, vowelGroups.length);

  // Longer words and more syllables = more time
  const lengthFactor = Math.min(2, cleanWord.length / 4);

  return syllables * lengthFactor;
}

// Parse text into words with timing based on actual duration
function parseTextWithTiming(text: string, totalDuration: number): WordData[] {
  // Split into tokens, preserving whitespace
  const tokens = text.split(/(\s+)/);
  const words: WordData[] = [];

  // Calculate total weight for proportional timing
  let totalWeight = 0;
  const weights: number[] = [];

  tokens.forEach((token) => {
    const isWhitespace = /^\s+$/.test(token);
    const weight = isWhitespace ? 0.15 : getWordWeight(token);
    weights.push(weight);
    totalWeight += weight;
  });

  // Assign times proportionally
  let currentTime = 0;
  let globalIndex = 0;

  tokens.forEach((token, index) => {
    const isWhitespace = /^\s+$/.test(token);
    const isPunctuation = !isWhitespace && /^[.,!?;:'"()\-—]+$/.test(token);
    const duration = totalWeight > 0 ? (weights[index] / totalWeight) * totalDuration : 0;

    words.push({
      word: token,
      startTime: currentTime,
      endTime: currentTime + duration,
      index,
      globalIndex: isWhitespace ? -1 : globalIndex,
      isWhitespace,
      isPunctuation,
    });

    if (!isWhitespace) globalIndex++;
    currentTime += duration;
  });

  return words;
}

export function SyncedTextReader({
  content,
  currentTime,
  duration,
  isPlaying,
  className = "",
  onWordClick,
  renderWord,
  vocabWords = new Set(),
}: SyncedTextReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const lastScrollTime = useRef(0);

  // Parse content with timing based on actual duration
  const words = useMemo(() => {
    if (!duration || duration <= 0) return [];
    return parseTextWithTiming(content, duration);
  }, [content, duration]);

  // Find current word based on playback time
  const currentWordIndex = useMemo(() => {
    if (!isPlaying || currentTime < 0 || words.length === 0) return -1;

    // Binary search for efficiency
    let low = 0;
    let high = words.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const word = words[mid];

      if (currentTime >= word.startTime && currentTime < word.endTime) {
        return mid;
      } else if (currentTime < word.startTime) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    // If past all words, return last non-whitespace word
    for (let i = words.length - 1; i >= 0; i--) {
      if (!words[i].isWhitespace) return i;
    }

    return -1;
  }, [currentTime, isPlaying, words]);

  // Auto-scroll to keep current word visible
  useEffect(() => {
    if (!isPlaying || currentWordIndex < 0 || !activeWordRef.current || !containerRef.current) {
      return;
    }

    // Throttle scrolling
    const now = Date.now();
    if (now - lastScrollTime.current < 150) return;
    lastScrollTime.current = now;

    const wordElement = activeWordRef.current;
    const container = containerRef.current;

    const wordRect = wordElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const padding = 100;
    const isAboveView = wordRect.top < containerRect.top + padding;
    const isBelowView = wordRect.bottom > containerRect.bottom - padding;

    if (isAboveView || isBelowView) {
      const scrollTarget = wordElement.offsetTop - container.offsetHeight / 2 + wordElement.offsetHeight / 2;
      container.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior: "smooth",
      });
    }
  }, [currentWordIndex, isPlaying]);

  // Handle word click for seeking
  const handleWordClick = useCallback((index: number) => {
    if (onWordClick && words[index] && !words[index].isWhitespace) {
      // Don't seek if it's a vocab word (has definition)
      const cleanWord = words[index].word.toLowerCase().replace(/[.,!?;:'"]/g, "");
      if (!vocabWords.has(cleanWord)) {
        onWordClick(index, words[index].startTime);
      }
    }
  }, [onWordClick, words, vocabWords]);

  // Split into paragraphs for rendering
  const paragraphs = useMemo(() => {
    const result: { words: WordData[]; key: number }[] = [];
    let currentParagraph: WordData[] = [];
    let paragraphIndex = 0;

    words.forEach((word) => {
      if (word.word.includes("\n\n")) {
        if (currentParagraph.length > 0) {
          result.push({ words: currentParagraph, key: paragraphIndex++ });
          currentParagraph = [];
        }
        const parts = word.word.split("\n\n");
        parts.forEach((part, i) => {
          if (part.trim()) {
            currentParagraph.push({ ...word, word: part });
          }
          if (i < parts.length - 1 && currentParagraph.length > 0) {
            result.push({ words: currentParagraph, key: paragraphIndex++ });
            currentParagraph = [];
          }
        });
      } else {
        currentParagraph.push(word);
      }
    });

    if (currentParagraph.length > 0) {
      result.push({ words: currentParagraph, key: paragraphIndex });
    }

    return result;
  }, [words]);

  if (words.length === 0) {
    return (
      <div className={className}>
        {content.split("\n\n").map((para, i) => (
          <p key={i} className="mb-4 last:mb-0">{para}</p>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`synced-text-reader ${className}`}
    >
      {paragraphs.map((para) => (
        <p key={para.key} className="mb-5 last:mb-0 leading-relaxed">
          {para.words.map((word) => {
            const isActive = word.index === currentWordIndex;
            const isPast = word.index < currentWordIndex;
            const isClickable = !word.isWhitespace && onWordClick;
            const cleanWord = word.word.toLowerCase().replace(/[.,!?;:'"]/g, "");
            const isVocab = vocabWords.has(cleanWord);

            if (renderWord) {
              const clickHandler = isClickable && !isVocab ? () => handleWordClick(word.index) : undefined;
              return (
                <span
                  key={word.index}
                  ref={isActive ? activeWordRef : null}
                  onClick={clickHandler}
                  className={isClickable && !isVocab ? "cursor-pointer" : ""}
                >
                  {renderWord(word.word, isActive, isPast, clickHandler)}
                </span>
              );
            }

            return (
              <span
                key={word.index}
                ref={isActive ? activeWordRef : null}
                onClick={isClickable && !isVocab ? () => handleWordClick(word.index) : undefined}
                className={`
                  synced-word
                  ${isActive ? "synced-word-active" : ""}
                  ${isPast ? "synced-word-past" : ""}
                  ${isClickable && !isVocab ? "synced-word-clickable" : ""}
                `}
              >
                {word.word}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
