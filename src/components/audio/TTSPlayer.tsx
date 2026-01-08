"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface TTSPlayerProps {
  text: string;
  level?: string;
  className?: string;
}

const VOICES = [
  { id: "en-US-female", label: "Jenny", accent: "US" },
  { id: "en-US-male", label: "Guy", accent: "US" },
  { id: "en-GB-female", label: "Sonia", accent: "UK" },
  { id: "en-GB-male", label: "Ryan", accent: "UK" },
];

export function TTSPlayer({ text, level = "B1", className = "" }: TTSPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
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
      setError("Could not generate audio. Please try again.");
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

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio && audioUrl) {
      audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
    }
  }, [duration, audioUrl]);

  // Handle seek
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const time = parseFloat(e.target.value);
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Change playback rate
  const cyclePlaybackRate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      const rates = [0.75, 1, 1.25, 1.5];
      const currentIndex = rates.indexOf(playbackRate);
      const nextRate = rates[(currentIndex + 1) % rates.length];
      audio.playbackRate = nextRate;
      setPlaybackRate(nextRate);
    }
  }, [playbackRate]);

  // Change voice
  const handleVoiceChange = useCallback((voiceId: string) => {
    setSelectedVoice(voiceId);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
    setCurrentTime(0);
  }, [audioUrl, isPlaying]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const selectedVoiceData = VOICES.find(v => v.id === selectedVoice);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-gradient-to-r from-forest to-forest-light rounded-2xl p-4 sm:p-5 text-white ${className}`}>
      <audio ref={audioRef} src={audioUrl || undefined} preload="none" />

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
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              disabled={!audioUrl}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
            />
          </div>

          {/* Time display */}
          <div className="flex justify-between mt-1.5 text-xs text-white/70 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Secondary controls row */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        {/* Skip buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => skip(-10)}
            disabled={!audioUrl}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40"
            title="Back 10s"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>
          <span className="text-xs text-white/50 hidden sm:inline">10s</span>
          <button
            onClick={() => skip(10)}
            disabled={!audioUrl}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40"
            title="Forward 10s"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>
        </div>

        {/* Speed control */}
        <button
          onClick={cyclePlaybackRate}
          disabled={!audioUrl}
          className="px-3 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-40"
        >
          {playbackRate}x
        </button>

        {/* Voice selector */}
        <div className="flex items-center gap-1 sm:gap-2">
          {VOICES.map((voice) => (
            <button
              key={voice.id}
              onClick={() => handleVoiceChange(voice.id)}
              className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all ${
                selectedVoice === voice.id
                  ? "bg-white text-forest font-medium"
                  : "bg-white/10 hover:bg-white/20"
              }`}
              title={`${voice.label} (${voice.accent})`}
            >
              <span className="hidden sm:inline">{voice.label}</span>
              <span className="sm:hidden">{voice.accent}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading indicator text */}
      {isLoading && (
        <p className="text-center text-sm text-white/60 mt-3">
          Generating audio...
        </p>
      )}
    </div>
  );
}
