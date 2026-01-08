"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface TTSPlayerProps {
  text: string;
  level?: string;
  compact?: boolean;
  className?: string;
}

const VOICES = [
  { id: "en-US-female", label: "Jenny (US)" },
  { id: "en-US-male", label: "Guy (US)" },
  { id: "en-GB-female", label: "Sonia (UK)" },
  { id: "en-GB-male", label: "Ryan (UK)" },
];

export function TTSPlayer({ text, level = "B1", compact = false, className = "" }: TTSPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("en-US-female");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate audio from TTS API
  const generateAudio = useCallback(async () => {
    if (!text || isLoading) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: selectedVoice, level }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate audio");
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioUrl(url);
      return url;
    } catch (err) {
      setError("Could not generate audio");
      console.error("TTS Error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [text, selectedVoice, level, audioUrl, isLoading]);

  // Play/Pause toggle
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;

    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    let url: string | null = audioUrl;
    if (!url) {
      const generated = await generateAudio();
      if (!generated) return;
      url = generated;
    }

    setTimeout(() => {
      const audioEl = audioRef.current;
      if (audioEl) {
        audioEl.play().catch(console.error);
        setIsPlaying(true);
      }
    }, 100);
  }, [isPlaying, audioUrl, generateAudio]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Clear audio when voice changes
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVoice = e.target.value;
    setSelectedVoice(newVoice);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  // Compact mode - simple inline button
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <audio ref={audioRef} src={audioUrl || undefined} preload="none" />
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all ${
            isLoading
              ? "bg-gray-200 text-gray-500 cursor-wait"
              : isPlaying
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-forest text-white hover:bg-forest-dark"
          }`}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span>Loading...</span>
            </>
          ) : isPlaying ? (
            <>
              <PauseIcon />
              <span>Pause</span>
            </>
          ) : (
            <>
              <PlayIcon />
              <span>Listen</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Full player - clean card design
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${className}`}>
      <audio ref={audioRef} src={audioUrl || undefined} preload="none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <SpeakerIcon />
          Listen
        </span>
        <select
          value={selectedVoice}
          onChange={handleVoiceChange}
          className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-forest"
        >
          {VOICES.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-600 text-sm mb-3 p-2 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Play button */}
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all ${
          isLoading
            ? "bg-gray-100 text-gray-500 cursor-wait"
            : isPlaying
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-forest text-white hover:bg-forest-dark"
        }`}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>Generating audio...</span>
          </>
        ) : isPlaying ? (
          <>
            <PauseIcon />
            <span>Pause Audio</span>
          </>
        ) : (
          <>
            <PlayIcon />
            <span>Play Audio</span>
          </>
        )}
      </button>

      {/* Tip */}
      <p className="text-xs text-gray-400 text-center mt-2">
        Audio is generated based on your reading level
      </p>
    </div>
  );
}

// Icons
function PlayIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
}
