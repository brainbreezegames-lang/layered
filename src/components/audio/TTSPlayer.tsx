"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface TTSPlayerProps {
  text: string;
  level?: string;
  className?: string;
}

// TikTok TTS voices (via Weilbyte's free API)
const VOICES = [
  { id: "en_us_001", label: "Female", accent: "US" },
  { id: "en_us_006", label: "Male 1", accent: "US" },
  { id: "en_us_007", label: "Male 2", accent: "US" },
  { id: "en_us_009", label: "Male 3", accent: "US" },
  { id: "en_us_010", label: "Male 4", accent: "US" },
  { id: "en_uk_001", label: "Male", accent: "UK" },
  { id: "en_au_001", label: "Female", accent: "AU" },
  { id: "en_au_002", label: "Male", accent: "AU" },
];

// API endpoint (Weilbyte's free TikTok TTS)
const TTS_API = "https://tiktok-tts.weilnet.workers.dev/api/generation";

export function TTSPlayer({ text, level = "B1", className = "" }: TTSPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("en_us_001");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const generateAndPlay = useCallback(async () => {
    if (!text || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // TikTok TTS has a 300 character limit per request
      // We'll use the first 300 characters for now
      const audioText = text.slice(0, 300);

      // Call Weilbyte's TikTok TTS API
      const response = await fetch(TTS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: audioText,
          voice: selectedVoice,
        }),
      });

      if (!response.ok) {
        throw new Error("TTS API request failed");
      }

      const data = await response.json();

      if (!data.data) {
        throw new Error("No audio data received");
      }

      // Convert base64 to audio
      const audioBlob = await fetch(`data:audio/mp3;base64,${data.data}`).then(r => r.blob());
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set up event listeners
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setError("Audio playback failed. Please try again.");
        setIsPlaying(false);
        setIsLoading(false);
      };

      // Play
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err) {
      console.error("TTS Error:", err);
      setError("Failed to generate audio. Please try again.");
      setIsLoading(false);
    }
  }, [text, selectedVoice, isLoading]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) {
      generateAndPlay();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, generateAndPlay]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const handleVoiceChange = useCallback((voiceId: string) => {
    setSelectedVoice(voiceId);
    if (audioRef.current) {
      stop();
    }
  }, [stop]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = audioRef.current?.currentTime || 0;
  const currentVoice = VOICES.find(v => v.id === selectedVoice);

  return (
    <div className={`bg-gradient-to-r from-forest to-forest-light rounded-2xl p-4 sm:p-5 text-white ${className}`}>
      {/* Error message */}
      {error && (
        <div className="bg-red-500/20 text-red-100 text-sm mb-4 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Main controls row */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
            isLoading
              ? "bg-white/20 cursor-wait"
              : "bg-white text-forest hover:bg-white/90 active:scale-95"
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : isPlaying ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Progress section */}
        <div className="flex-1 min-w-0">
          {/* Progress bar */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time display */}
          <div className="flex justify-between mt-1.5 text-xs text-white/70 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Stop button */}
        {isPlaying && (
          <button
            onClick={stop}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        )}
      </div>

      {/* Voice selector */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50">Voice:</span>
          <span className="text-xs text-white/70">{currentVoice?.label} ({currentVoice?.accent})</span>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
          {VOICES.slice(0, 4).map((voice) => (
            <button
              key={voice.id}
              onClick={() => handleVoiceChange(voice.id)}
              className={`px-2 sm:px-3 py-1.5 text-xs rounded-lg transition-all ${
                selectedVoice === voice.id
                  ? "bg-white text-forest font-medium"
                  : "bg-white/10 hover:bg-white/20"
              }`}
              title={`${voice.label} (${voice.accent})`}
            >
              {voice.accent} {voice.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <p className="text-center text-sm text-white/60 mt-3">
          Generating audio...
        </p>
      )}
    </div>
  );
}
