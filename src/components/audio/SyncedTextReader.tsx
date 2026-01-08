"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";

interface WordData {
  word: string;
  startTime: number;
  endTime: number;
  index: number;
  isWhitespace: boolean;
}

interface SyncedTextReaderProps {
  content: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  className?: string;
  onWordClick?: (wordIndex: number, estimatedTime: number) => void;
  renderWord?: (word: string, isActive: boolean, isPast: boolean) => React.ReactNode;
}

// Estimate words per minute based on typical TTS speed
const BASE_WPM = 150;

// Calculate relative word duration based on syllable count estimation
function estimateWordDuration(word: string, avgDuration: number): number {
  const cleanWord = word.replace(/[^a-zA-Z]/g, "");
  if (!cleanWord) return avgDuration * 0.3; // Punctuation gets short pause

  // Estimate syllables (rough approximation)
  const syllables = Math.max(1, cleanWord.replace(/[^aeiouy]/gi, "").length || 1);
  const lengthFactor = Math.min(2, Math.max(0.5, cleanWord.length / 5));

  return avgDuration * syllables * lengthFactor * 0.4;
}

// Parse text into words with timing estimates
function parseTextWithTiming(text: string, totalDuration: number): WordData[] {
  const tokens = text.split(/(\s+)/);
  const words: WordData[] = [];

  // First pass: calculate raw durations
  let totalWeight = 0;
  const weights: number[] = [];

  tokens.forEach((token) => {
    const isWhitespace = /^\s+$/.test(token);
    const weight = isWhitespace ? 0.1 : estimateWordDuration(token, 1);
    weights.push(weight);
    totalWeight += weight;
  });

  // Second pass: assign times proportionally
  let currentTime = 0;
  tokens.forEach((token, index) => {
    const isWhitespace = /^\s+$/.test(token);
    const duration = (weights[index] / totalWeight) * totalDuration;

    words.push({
      word: token,
      startTime: currentTime,
      endTime: currentTime + duration,
      index,
      isWhitespace,
    });

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
}: SyncedTextReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const lastScrollTime = useRef(0);

  // Parse content into timed words
  const words = useMemo(() => {
    if (!duration || duration <= 0) return [];
    return parseTextWithTiming(content, duration);
  }, [content, duration]);

  // Find current word index based on playback time
  const currentWordIndex = useMemo(() => {
    if (!isPlaying || currentTime <= 0 || words.length === 0) return -1;

    for (let i = 0; i < words.length; i++) {
      if (currentTime >= words[i].startTime && currentTime < words[i].endTime) {
        return i;
      }
    }

    // If past all words, return last word
    if (currentTime >= (words[words.length - 1]?.endTime || 0)) {
      return words.length - 1;
    }

    return -1;
  }, [currentTime, isPlaying, words]);

  // Auto-scroll to keep current word visible
  useEffect(() => {
    if (!isPlaying || currentWordIndex < 0 || !activeWordRef.current || !containerRef.current) {
      return;
    }

    // Throttle scrolling to every 100ms
    const now = Date.now();
    if (now - lastScrollTime.current < 100) return;
    lastScrollTime.current = now;

    const wordElement = activeWordRef.current;
    const container = containerRef.current;

    // Get positions
    const wordRect = wordElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Check if word is outside the visible area (with some padding)
    const padding = 80;
    const isAboveView = wordRect.top < containerRect.top + padding;
    const isBelowView = wordRect.bottom > containerRect.bottom - padding;

    if (isAboveView || isBelowView) {
      // Scroll to center the word in view
      const scrollTarget = wordElement.offsetTop - container.offsetHeight / 2 + wordElement.offsetHeight / 2;

      container.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior: "smooth",
      });
    }
  }, [currentWordIndex, isPlaying]);

  const handleWordClick = useCallback((index: number) => {
    if (onWordClick && words[index]) {
      onWordClick(index, words[index].startTime);
    }
  }, [onWordClick, words]);

  // Split content into paragraphs for rendering
  const paragraphs = useMemo(() => {
    const result: { words: WordData[]; key: number }[] = [];
    let currentParagraph: WordData[] = [];
    let paragraphIndex = 0;

    words.forEach((word) => {
      if (word.word.includes("\n\n")) {
        // End current paragraph
        if (currentParagraph.length > 0) {
          result.push({ words: currentParagraph, key: paragraphIndex++ });
          currentParagraph = [];
        }
        // Handle the newlines
        const parts = word.word.split("\n\n");
        parts.forEach((part, i) => {
          if (part) {
            currentParagraph.push({ ...word, word: part });
          }
          if (i < parts.length - 1 && currentParagraph.length > 0) {
            result.push({ words: currentParagraph, key: paragraphIndex++ });
            currentParagraph = [];
          }
        });
      } else if (word.word.includes("\n")) {
        currentParagraph.push(word);
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
    // Fallback: just render text without sync
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
        <p key={para.key} className="mb-4 last:mb-0">
          {para.words.map((word) => {
            const isActive = word.index === currentWordIndex;
            const isPast = word.index < currentWordIndex;
            const isClickable = !word.isWhitespace && onWordClick;

            if (renderWord) {
              return (
                <span
                  key={word.index}
                  ref={isActive ? activeWordRef : null}
                  onClick={isClickable ? () => handleWordClick(word.index) : undefined}
                  className={isClickable ? "cursor-pointer" : ""}
                >
                  {renderWord(word.word, isActive, isPast)}
                </span>
              );
            }

            return (
              <span
                key={word.index}
                ref={isActive ? activeWordRef : null}
                onClick={isClickable ? () => handleWordClick(word.index) : undefined}
                className={`
                  transition-all duration-150
                  ${isActive ? "synced-word-active" : ""}
                  ${isPast ? "synced-word-past" : ""}
                  ${isClickable ? "cursor-pointer hover:bg-[var(--color-warm)]" : ""}
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
