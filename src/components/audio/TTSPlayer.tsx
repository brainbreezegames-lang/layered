"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface TTSPlayerProps {
  text: string;
  level?: string;
  className?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
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
const MAX_CHUNK_SIZE = 280; // Leave some buffer for the 300 char API limit

// Split text into chunks at sentence boundaries
function splitTextIntoChunks(text: string): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = "";

  for (const sentence of sentences) {
    // If a single sentence is too long, split it further
    if (sentence.length > MAX_CHUNK_SIZE) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      // Split long sentence by commas or at word boundaries
      const parts = sentence.split(/(?<=,)\s+|(?<=;)\s+/);
      for (const part of parts) {
        if (part.length > MAX_CHUNK_SIZE) {
          // Last resort: split at word boundaries
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

export function TTSPlayer({ text, level = "B1", className = "", onTimeUpdate, onPlayStateChange }: TTSPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNarrator, setSelectedNarrator] = useState(NARRATORS[0]);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading...");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<string[]>([]);
  const totalChunksRef = useRef(0);
  const isStoppedRef = useRef(false);
  const audioUrlsRef = useRef<string[]>([]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isStoppedRef.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Clean up all audio URLs
      audioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      audioUrlsRef.current = [];
    };
  }, []);

  // Estimate total duration based on text length (rough estimate: ~150 words per minute)
  const estimatedDuration = Math.ceil((text.split(/\s+/).length / 150) * 60);

  // Notify parent of play state changes
  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  // Notify parent of time updates - call immediately and on progress change
  useEffect(() => {
    if (onTimeUpdate) {
      const currentTime = (progress / 100) * estimatedDuration;
      onTimeUpdate(currentTime, estimatedDuration);
    }
  }, [progress, onTimeUpdate, estimatedDuration]);

  // Generate audio for a specific chunk
  const generateChunkAudio = useCallback(async (chunkText: string, voice: string): Promise<string | null> => {
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
      return audioUrl;
    } catch (err) {
      console.error("Chunk audio generation error:", err);
      return null;
    }
  }, []);

  // Play a specific chunk
  const playChunk = useCallback(async (chunkIndex: number) => {
    if (isStoppedRef.current || chunkIndex >= chunksRef.current.length) {
      setIsPlaying(false);
      setIsLoading(false);
      setProgress(100);
      return;
    }

    setCurrentChunkIndex(chunkIndex);
    setLoadingText(`Loading part ${chunkIndex + 1} of ${totalChunksRef.current}...`);

    const chunkText = chunksRef.current[chunkIndex];
    const audioUrl = await generateChunkAudio(chunkText, selectedNarrator.id);

    if (!audioUrl || isStoppedRef.current) {
      if (!isStoppedRef.current) {
        setError("Failed to generate audio");
        setIsPlaying(false);
        setIsLoading(false);
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audio.playbackRate = speed;
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      if (audio.duration && totalChunksRef.current > 0) {
        // Calculate overall progress
        const chunkProgress = audio.currentTime / audio.duration;
        const overallProgress = ((chunkIndex + chunkProgress) / totalChunksRef.current) * 100;
        setProgress(overallProgress);
      }
    };

    audio.onended = () => {
      if (!isStoppedRef.current) {
        // Play next chunk
        playChunk(chunkIndex + 1);
      }
    };

    audio.onerror = () => {
      if (!isStoppedRef.current) {
        setError("Playback failed");
        setIsPlaying(false);
        setIsLoading(false);
      }
    };

    try {
      await audio.play();
      setIsLoading(false);
    } catch (err) {
      console.error("Play error:", err);
      setError("Failed to play audio");
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [generateChunkAudio, selectedNarrator.id, speed]);

  // Start playing from the beginning
  const startPlaying = useCallback(async () => {
    if (!text || isLoading) return;

    setIsLoading(true);
    setError(null);
    isStoppedRef.current = false;

    // Clean up previous audio URLs
    audioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    audioUrlsRef.current = [];

    // Split text into chunks
    const chunks = splitTextIntoChunks(text);
    chunksRef.current = chunks;
    totalChunksRef.current = chunks.length;

    setCurrentChunkIndex(0);
    setProgress(0);
    setIsPlaying(true);

    // Start playing first chunk
    await playChunk(0);
  }, [text, isLoading, playChunk]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !isPlaying) {
      startPlaying();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, startPlaying]);

  const stop = useCallback(() => {
    isStoppedRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    // Clean up audio URLs
    audioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    audioUrlsRef.current = [];

    setIsPlaying(false);
    setIsLoading(false);
    setProgress(0);
    setCurrentChunkIndex(0);
  }, []);

  const handleNarratorChange = useCallback((narrator: typeof NARRATORS[0]) => {
    setSelectedNarrator(narrator);
    setIsExpanded(false);
    stop();
  }, [stop]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  }, []);

  // Calculate current time for display
  const currentTime = (progress / 100) * estimatedDuration;

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
              disabled={isLoading}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-light)] transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : isPlaying ? (
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
                {isLoading ? loadingText : selectedNarrator.role}
              </p>
            </div>

            {(isPlaying || isLoading) && (
              <button
                onClick={stop}
                className="ml-auto p-1.5 rounded-full hover:bg-[var(--color-cream-dark)] transition-colors"
              >
                <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-[var(--color-warm)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-forest)] rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums w-16 text-right">
              {formatTime(currentTime)} / {formatTime(estimatedDuration)}
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
