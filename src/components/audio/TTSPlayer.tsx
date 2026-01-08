"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface TTSPlayerProps {
  text: string;
  level?: string;
  compact?: boolean;
  className?: string;
}

const VOICES = [
  { id: "en-US-female", label: "Jenny (US)", gender: "Female" },
  { id: "en-US-male", label: "Guy (US)", gender: "Male" },
  { id: "en-GB-female", label: "Sonia (UK)", gender: "Female" },
  { id: "en-GB-male", label: "Ryan (UK)", gender: "Male" },
  { id: "en-AU-female", label: "Natasha (AU)", gender: "Female" },
  { id: "en-AU-male", label: "William (AU)", gender: "Male" },
];

export function TTSPlayer({ text, level = "B1", compact = false, className = "" }: TTSPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState("en-US-female");
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
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

  // Stop audio
  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
    }
  }, [duration]);

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
  const changeVoice = useCallback((voiceId: string) => {
    setSelectedVoice(voiceId);
    setShowVoiceMenu(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    stopAudio();
  }, [audioUrl, stopAudio]);

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

  const selectedVoiceInfo = VOICES.find(v => v.id === selectedVoice);

  // Compact mode
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <audio ref={audioRef} src={audioUrl || undefined} preload="none" />
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
            isPlaying
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-forest text-white hover:bg-forest-dark"
          } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Loading...</span>
            </>
          ) : isPlaying ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              <span>Pause</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Listen</span>
            </>
          )}
        </button>
        {isPlaying && (
          <button
            onClick={stopAudio}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Stop"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Full player
  return (
    <div className={`bg-gray-50 rounded-xl p-4 ${className}`}>
      <audio ref={audioRef} src={audioUrl || undefined} preload="none" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Listen to this content
        </span>

        <div className="relative">
          <button
            onClick={() => setShowVoiceMenu(!showVoiceMenu)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-forest transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>{selectedVoiceInfo?.label}</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showVoiceMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[180px]">
              {VOICES.map(voice => (
                <button
                  key={voice.id}
                  onClick={() => changeVoice(voice.id)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${
                    selectedVoice === voice.id ? "text-forest font-medium" : "text-gray-700"
                  }`}
                >
                  <span>{voice.label}</span>
                  <span className="text-xs text-gray-400">{voice.gender}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm mb-3 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isLoading
              ? "bg-gray-200 text-gray-400 cursor-wait"
              : isPlaying
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-forest text-white hover:bg-forest-dark"
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-gray-500 font-mono w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={!audioUrl}
            className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-forest disabled:opacity-50"
          />
          <span className="text-xs text-gray-500 font-mono w-10">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => skip(-10)}
            disabled={!audioUrl}
            className="p-2 text-gray-400 hover:text-forest transition-colors disabled:opacity-50"
            title="-10s"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>

          <button
            onClick={() => skip(10)}
            disabled={!audioUrl}
            className="p-2 text-gray-400 hover:text-forest transition-colors disabled:opacity-50"
            title="+10s"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>

          <button
            onClick={cyclePlaybackRate}
            disabled={!audioUrl}
            className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-forest transition-colors disabled:opacity-50"
            title="Speed"
          >
            {playbackRate}x
          </button>

          <button
            onClick={stopAudio}
            disabled={!audioUrl || !isPlaying}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Stop"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
