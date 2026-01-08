"use client";

import { VocabularyItem } from "@/types";
import { useState, useEffect, useCallback, useMemo } from "react";
import { TTSPlayer } from "@/components/audio/TTSPlayer";
import { SyncedTextReader } from "@/components/audio/SyncedTextReader";
import { useLevel } from "@/components/LevelContext";

interface ArticleContentProps {
  content: string;
  vocabulary: VocabularyItem[];
}

export function ArticleContent({ content, vocabulary }: ArticleContentProps) {
  const [activeWord, setActiveWord] = useState<VocabularyItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [followAlong, setFollowAlong] = useState(true);
  const { level } = useLevel();

  // Create a map of vocabulary words for quick lookup
  const vocabMap = useMemo(
    () => new Map(vocabulary.map((v) => [v.word.toLowerCase(), v])),
    [vocabulary]
  );

  // Handle time updates from TTS player
  const handleTimeUpdate = useCallback((time: number, dur: number) => {
    setCurrentTime(time);
    setDuration(dur);
  }, []);

  // Handle play state changes
  const handlePlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
    if (!playing) {
      setCurrentTime(0);
    }
  }, []);

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

  const handleWordClick = useCallback((vocabItem: VocabularyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveWord((prev) => (prev?.word === vocabItem.word ? null : vocabItem));
  }, []);

  // Render word with vocabulary highlighting AND sync highlighting
  const renderWord = useCallback(
    (word: string, isActive: boolean, isPast: boolean) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, "");
      const vocabItem = vocabMap.get(cleanWord);
      const isVocabActive = activeWord?.word.toLowerCase() === cleanWord;

      // Build class names
      const classes = [
        "transition-all duration-150",
        isActive && followAlong ? "synced-word-active" : "",
        isPast && followAlong ? "synced-word-past" : "",
        vocabItem ? "vocab-highlight" : "",
        isVocabActive ? "active" : "",
      ]
        .filter(Boolean)
        .join(" ");

      if (vocabItem) {
        return (
          <span
            className={classes}
            onClick={(e) => handleWordClick(vocabItem, e)}
          >
            {word}
          </span>
        );
      }

      return <span className={classes}>{word}</span>;
    },
    [vocabMap, activeWord, followAlong, handleWordClick]
  );

  // Split content into paragraphs for non-synced rendering
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  // Track which words have been highlighted for vocabulary (first occurrence only)
  const highlightVocabulary = (text: string) => {
    const highlightedWords = new Set<string>();
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

      {/* Audio Player - Above content for all devices */}
      <div className="mb-6">
        <TTSPlayer
          text={content}
          level={level}
          onTimeUpdate={handleTimeUpdate}
          onPlayStateChange={handlePlayStateChange}
        />
      </div>

      {/* Follow along toggle - only show when audio is available */}
      {duration > 0 && (
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setFollowAlong(!followAlong)}
            className={`follow-along-toggle ${followAlong ? "active" : ""}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {followAlong ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              )}
            </svg>
            Follow along
          </button>
          {isPlaying && followAlong && (
            <span className="text-xs text-[var(--color-text-muted)]">
              Words highlight as they&apos;re spoken
            </span>
          )}
        </div>
      )}

      {/* Article text - Synced or Regular based on playback state */}
      <div className={`reading-mode ${isPlaying && followAlong ? "active" : ""}`}>
        {isPlaying && followAlong && duration > 0 ? (
          <SyncedTextReader
            content={content}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            className="font-body"
            renderWord={renderWord}
          />
        ) : (
          <div className="font-body">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {highlightVocabulary(paragraph)}
              </p>
            ))}
          </div>
        )}
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
