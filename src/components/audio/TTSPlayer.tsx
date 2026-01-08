"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface TTSPlayerProps {
  text: string;
  level?: string;
  className?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onSeekRequest?: (seekTo: number) => void;
  seekToTime?: number; // External seek request (from word click)
}

// Narrators with personalities
const NARRATORS = [
  {
    id: "en_us_001",
    name: "Emma Collins",
    role: "US English",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "en_us_006",
    name: "James Mitchell",
    role: "US English",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "en_uk_001",
    name: "Oliver Bennett",
    role: "British English",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "en_au_001",
    name: "Sophie Taylor",
    role: "Australian English",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "en_us_009",
    name: "Marcus Chen",
    role: "US English",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "en_au_002",
    name: "Liam Walker",
    role: "Australian English",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&crop=face",
  },
];

const SPEEDS = [
  { value: 0.75, label: "0.75×" },
  { value: 1, label: "1×" },
  { value: 1.25, label: "1.25×" },
  { value: 1.5, label: "1.5×" },
];

const TTS_API = "/api/tts";
const MAX_CHUNK_SIZE = 280;

interface ChunkData {
  text: string;
  startTime: number;
  endTime: number;
  audioUrl: string | null;
  duration: number;
  wordStartIndex: number;
  wordEndIndex: number;
}

// Split text into chunks at sentence boundaries
function splitTextIntoChunks(text: string): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = "";

  for (const sentence of sentences) {
    if (sentence.length > MAX_CHUNK_SIZE) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      const parts = sentence.split(/(?<=,)\s+|(?<=;)\s+/);
      for (const part of parts) {
        if (part.length > MAX_CHUNK_SIZE) {
          const words = part.split(/\s+/);
          let wordChunk = "";
          for (const word of words) {
            if ((wordChunk + " " + word).length > MAX_CHUNK_SIZE) {
              if (wordChunk) chunks.push(wordChunk.trim());
              wordChunk = word;
            } else {
              wordChunk = wordChunk ? wordChunk + " " + word : word;
            }
          }
          if (wordChunk) chunks.push(wordChunk.trim());
        } else if ((currentChunk + " " + part).length > MAX_CHUNK_SIZE) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = part;
        } else {
          currentChunk = currentChunk ? currentChunk + " " + part : part;
        }
      }
    } else if ((currentChunk + " " + sentence).length > MAX_CHUNK_SIZE) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk = currentChunk ? currentChunk + " " + sentence : sentence;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks.filter(c => c.length > 0);
}

// Count words in text
function countWords(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

export function TTSPlayer({
  text,
  level = "B1",
  className = "",
  onTimeUpdate,
  onPlayStateChange,
  seekToTime
}: TTSPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedNarrator, setSelectedNarrator] = useState(NARRATORS[0]);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [isPreloading, setIsPreloading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<ChunkData[]>([]);
  const currentChunkIndexRef = useRef(0);
  const isStoppedRef = useRef(false);
  const audioUrlsRef = useRef<string[]>([]);
  const pausedTimeRef = useRef(0);
  const totalWordsRef = useRef(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isStoppedRef.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      audioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      audioUrlsRef.current = [];
    };
  }, []);

  // Notify parent of play state changes
  useEffect(() => {
    onPlayStateChange?.(isPlaying && !isPaused);
  }, [isPlaying, isPaused, onPlayStateChange]);

  // Notify parent of time updates
  useEffect(() => {
    if (onTimeUpdate && totalDuration > 0) {
      onTimeUpdate(currentTime, totalDuration);
    }
  }, [currentTime, totalDuration, onTimeUpdate]);

  // Handle external seek requests (from word clicks)
  useEffect(() => {
    if (seekToTime !== undefined && seekToTime >= 0 && totalDuration > 0) {
      seekToPosition(seekToTime);
    }
  }, [seekToTime, totalDuration]);

  // Generate audio for a chunk and get actual duration
  const generateChunkAudio = useCallback(async (chunkText: string, voice: string): Promise<{ url: string; duration: number } | null> => {
    try {
      const response = await fetch(TTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chunkText, voice }),
      });

      if (!response.ok) throw new Error("TTS API request failed");

      const data = await response.json();
      if (!data.data) throw new Error("No audio data received");

      const audioBlob = await fetch(`data:audio/mp3;base64,${data.data}`).then(r => r.blob());
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlsRef.current.push(audioUrl);

      // Get actual duration by loading the audio
      const duration = await new Promise<number>((resolve) => {
        const tempAudio = new Audio(audioUrl);
        tempAudio.addEventListener('loadedmetadata', () => {
          resolve(tempAudio.duration);
        });
        tempAudio.addEventListener('error', () => {
          // Fallback: estimate based on word count (~150 WPM)
          const wordCount = countWords(chunkText);
          resolve((wordCount / 150) * 60);
        });
      });

      return { url: audioUrl, duration };
    } catch (err) {
      console.error("Chunk audio generation error:", err);
      return null;
    }
  }, []);

  // Preload all audio chunks and build timing map
  const preloadAllChunks = useCallback(async (voice: string): Promise<boolean> => {
    setIsPreloading(true);
    setLoadingText("Preparing audio...");

    const textChunks = splitTextIntoChunks(text);
    const chunkDataArray: ChunkData[] = [];
    let cumulativeTime = 0;
    let cumulativeWordIndex = 0;

    for (let i = 0; i < textChunks.length; i++) {
      if (isStoppedRef.current) {
        setIsPreloading(false);
        return false;
      }

      setLoadingText(`Loading ${i + 1} of ${textChunks.length}...`);

      const result = await generateChunkAudio(textChunks[i], voice);
      if (!result) {
        setIsPreloading(false);
        return false;
      }

      const wordCount = countWords(textChunks[i]);

      chunkDataArray.push({
        text: textChunks[i],
        startTime: cumulativeTime,
        endTime: cumulativeTime + result.duration,
        audioUrl: result.url,
        duration: result.duration,
        wordStartIndex: cumulativeWordIndex,
        wordEndIndex: cumulativeWordIndex + wordCount - 1,
      });

      cumulativeTime += result.duration;
      cumulativeWordIndex += wordCount;
    }

    chunksRef.current = chunkDataArray;
    totalWordsRef.current = cumulativeWordIndex;
    setTotalDuration(cumulativeTime);
    setIsPreloading(false);
    return true;
  }, [text, generateChunkAudio]);

  // Find chunk index for a given time
  const findChunkForTime = useCallback((time: number): number => {
    for (let i = 0; i < chunksRef.current.length; i++) {
      if (time >= chunksRef.current[i].startTime && time < chunksRef.current[i].endTime) {
        return i;
      }
    }
    return chunksRef.current.length - 1;
  }, []);

  // Play a specific chunk from a specific time offset
  const playChunkFromTime = useCallback(async (chunkIndex: number, startOffset: number = 0) => {
    if (isStoppedRef.current || chunkIndex >= chunksRef.current.length) {
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    const chunk = chunksRef.current[chunkIndex];
    if (!chunk.audioUrl) return;

    currentChunkIndexRef.current = chunkIndex;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(chunk.audioUrl);
    audio.playbackRate = speed;
    audio.currentTime = startOffset;
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      const absoluteTime = chunk.startTime + audio.currentTime;
      setCurrentTime(absoluteTime);
    };

    audio.onended = () => {
      if (!isStoppedRef.current) {
        playChunkFromTime(chunkIndex + 1, 0);
      }
    };

    audio.onerror = () => {
      if (!isStoppedRef.current) {
        setError("Playback failed");
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    try {
      await audio.play();
      setIsPlaying(true);
      setIsPaused(false);
    } catch (err) {
      console.error("Play error:", err);
      setError("Failed to play audio");
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [speed]);

  // Seek to a specific time position
  const seekToPosition = useCallback((targetTime: number) => {
    if (chunksRef.current.length === 0) return;

    const clampedTime = Math.max(0, Math.min(targetTime, totalDuration));
    const chunkIndex = findChunkForTime(clampedTime);
    const chunk = chunksRef.current[chunkIndex];
    const offsetInChunk = clampedTime - chunk.startTime;

    pausedTimeRef.current = clampedTime;
    setCurrentTime(clampedTime);

    if (isPlaying && !isPaused) {
      playChunkFromTime(chunkIndex, offsetInChunk);
    }
  }, [totalDuration, findChunkForTime, isPlaying, isPaused, playChunkFromTime]);

  // Start playing (with preload if needed)
  const startPlaying = useCallback(async () => {
    if (!text || isLoading || isPreloading) return;

    setIsLoading(true);
    setError(null);
    isStoppedRef.current = false;

    // Check if we need to preload (new text or voice change)
    if (chunksRef.current.length === 0) {
      // Clean up previous audio
      audioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      audioUrlsRef.current = [];

      const success = await preloadAllChunks(selectedNarrator.id);
      if (!success) {
        setError("Failed to load audio");
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);

    // Resume from paused position or start from beginning
    const startTime = isPaused ? pausedTimeRef.current : 0;
    const chunkIndex = findChunkForTime(startTime);
    const chunk = chunksRef.current[chunkIndex];
    const offsetInChunk = startTime - chunk.startTime;

    await playChunkFromTime(chunkIndex, offsetInChunk);
  }, [text, isLoading, isPreloading, preloadAllChunks, selectedNarrator.id, isPaused, findChunkForTime, playChunkFromTime]);

  // Pause playback
  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      pausedTimeRef.current = currentTime;
      setIsPaused(true);
    }
  }, [isPlaying, currentTime]);

  // Resume playback
  const resume = useCallback(async () => {
    if (isPaused && chunksRef.current.length > 0) {
      const chunkIndex = findChunkForTime(pausedTimeRef.current);
      const chunk = chunksRef.current[chunkIndex];
      const offsetInChunk = pausedTimeRef.current - chunk.startTime;
      await playChunkFromTime(chunkIndex, offsetInChunk);
    }
  }, [isPaused, findChunkForTime, playChunkFromTime]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      startPlaying();
    }
  }, [isPlaying, isPaused, pause, resume, startPlaying]);

  // Stop playback completely
  const stop = useCallback(() => {
    isStoppedRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    pausedTimeRef.current = 0;
  }, []);

  // Handle narrator change - preserve position
  const handleNarratorChange = useCallback(async (narrator: typeof NARRATORS[0]) => {
    const wasPlaying = isPlaying && !isPaused;
    const savedTime = currentTime;

    // Stop current playback
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setSelectedNarrator(narrator);
    setIsExpanded(false);

    // Clear cached audio (need to regenerate for new voice)
    audioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    audioUrlsRef.current = [];
    chunksRef.current = [];
    setTotalDuration(0);

    // If was playing, reload and resume from same position
    if (wasPlaying || isPaused) {
      setIsLoading(true);
      isStoppedRef.current = false;

      const success = await preloadAllChunks(narrator.id);
      if (success) {
        setIsLoading(false);
        pausedTimeRef.current = Math.min(savedTime, chunksRef.current[chunksRef.current.length - 1]?.endTime || 0);
        setCurrentTime(pausedTimeRef.current);

        if (wasPlaying) {
          const chunkIndex = findChunkForTime(pausedTimeRef.current);
          const chunk = chunksRef.current[chunkIndex];
          const offsetInChunk = pausedTimeRef.current - chunk.startTime;
          await playChunkFromTime(chunkIndex, offsetInChunk);
        } else {
          setIsPaused(true);
        }
      } else {
        setIsLoading(false);
        setError("Failed to reload audio");
      }
    }
  }, [isPlaying, isPaused, currentTime, preloadAllChunks, findChunkForTime, playChunkFromTime]);

  // Handle speed change
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  }, []);

  // Handle progress bar click for seeking
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (totalDuration <= 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const targetTime = percentage * totalDuration;

    seekToPosition(targetTime);
  }, [totalDuration, seekToPosition]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className={`relative ${className}`}>
      {/* Elegant editorial divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] font-medium">
          Listen
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent" />
      </div>

      {/* Main Player */}
      <div className="flex items-start gap-4">
        {/* Narrator Avatar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative flex-shrink-0 group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[var(--color-border)] group-hover:ring-[var(--color-forest)] transition-all">
            <Image
              src={selectedNarrator.avatar}
              alt={selectedNarrator.name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[var(--color-cream)] rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Controls & Info */}
        <div className="flex-1 min-w-0">
          {/* Narrator Info & Play Button */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={togglePlay}
              disabled={isLoading || isPreloading}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-light)] transition-colors disabled:opacity-50"
            >
              {isLoading || isPreloading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : isPlaying && !isPaused ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="min-w-0">
              <p className="font-display text-sm text-[var(--color-text)] truncate">
                {selectedNarrator.name}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                {isLoading || isPreloading ? loadingText : selectedNarrator.role}
              </p>
            </div>

            {(isPlaying || isPaused) && (
              <button
                onClick={stop}
                className="ml-auto p-1.5 rounded-full hover:bg-[var(--color-cream-dark)] transition-colors"
                title="Stop"
              >
                <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress Bar - Clickable for seeking */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div className="flex-1 h-1.5 bg-[var(--color-warm)] rounded-full overflow-hidden group-hover:h-2 transition-all">
              <div
                className="h-full bg-[var(--color-forest)] rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums w-16 text-right">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>

          {/* Speed Controls */}
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mr-1">Speed</span>
            {SPEEDS.map((s) => (
              <button
                key={s.value}
                onClick={() => handleSpeedChange(s.value)}
                className={`px-2 py-0.5 text-[10px] rounded transition-all ${
                  speed === s.value
                    ? "bg-[var(--color-text)] text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-cream-dark)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      {/* Narrator Selection Dropdown */}
      {isExpanded && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-white border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden">
          <div className="p-3 border-b border-[var(--color-border)]">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Choose Narrator</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {NARRATORS.map((narrator) => (
              <button
                key={narrator.id}
                onClick={() => handleNarratorChange(narrator)}
                className={`w-full flex items-center gap-3 p-3 hover:bg-[var(--color-cream)] transition-colors ${
                  selectedNarrator.id === narrator.id ? "bg-[var(--color-cream)]" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={narrator.avatar}
                    alt={narrator.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="text-left min-w-0">
                  <p className="font-display text-sm text-[var(--color-text)] truncate">
                    {narrator.name}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    {narrator.role}
                  </p>
                </div>
                {selectedNarrator.id === narrator.id && (
                  <svg className="w-4 h-4 ml-auto text-[var(--color-forest)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Bottom divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent mt-6" />
    </div>
  );
}
