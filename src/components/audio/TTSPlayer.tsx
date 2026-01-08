"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface TTSPlayerProps {
  text: string;
  level?: string;
  className?: string;
}

// Speed options based on CEFR level
const SPEED_OPTIONS = [
  { id: "slow", label: "0.8x", rate: 0.8 },
  { id: "normal", label: "1x", rate: 1.0 },
  { id: "fast", label: "1.2x", rate: 1.2 },
];

export function TTSPlayer({ text, level = "B1", className = "" }: TTSPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const startTimeRef = useRef<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Get the best available voice (prefer natural/enhanced voices)
  const getBestVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();

    // Priority order for natural-sounding voices
    const preferredVoices = [
      // macOS premium voices
      "Samantha (Enhanced)",
      "Samantha",
      "Daniel (Enhanced)",
      "Daniel",
      "Karen (Enhanced)",
      "Karen",
      // Chrome/Edge neural voices
      "Microsoft Aria Online (Natural)",
      "Microsoft Guy Online (Natural)",
      "Google UK English Female",
      "Google UK English Male",
      "Google US English",
    ];

    for (const preferred of preferredVoices) {
      const voice = voices.find(v => v.name.includes(preferred.split(" ")[0]) && v.lang.startsWith("en"));
      if (voice) return voice;
    }

    // Fallback to any English voice
    return voices.find(v => v.lang.startsWith("en")) || voices[0];
  }, []);

  const generateAndPlay = useCallback(async () => {
    if (!text || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Stop any existing speech
      window.speechSynthesis.cancel();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Use first 5000 characters
      const audioText = text.slice(0, 5000);

      const utterance = new SpeechSynthesisUtterance(audioText);
      utteranceRef.current = utterance;

      // Set voice and rate
      const voice = getBestVoice();
      if (voice) utterance.voice = voice;

      const speedOption = SPEED_OPTIONS.find(s => s.id === speed);
      utterance.rate = speedOption?.rate || 1.0;
      utterance.pitch = 1.0;

      // Estimate duration (rough: ~150 words per minute at normal speed)
      const wordCount = audioText.split(/\s+/).length;
      const estimatedDuration = (wordCount / 150) * 60 / (speedOption?.rate || 1);
      setDuration(estimatedDuration);

      // Event listeners
      utterance.onstart = () => {
        setIsLoading(false);
        setIsPlaying(true);
        startTimeRef.current = Date.now();

        // Update progress
        progressIntervalRef.current = setInterval(() => {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const prog = Math.min((elapsed / estimatedDuration) * 100, 99);
          setProgress(prog);
        }, 100);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        setTimeout(() => setProgress(0), 500);
      };

      utterance.onerror = (e) => {
        if (e.error !== "canceled") {
          setError("Speech synthesis failed. Please try again.");
        }
        setIsPlaying(false);
        setIsLoading(false);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("TTS Error:", err);
      setError("Failed to generate audio. Please try again.");
      setIsLoading(false);
    }
  }, [text, speed, isLoading, getBestVoice]);

  const togglePlay = useCallback(() => {
    if (!utteranceRef.current || !isPlaying) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        generateAndPlay();
      }
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  }, [isPlaying, generateAndPlay]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    utteranceRef.current = null;
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const handleSpeedChange = useCallback((speedId: string) => {
    setSpeed(speedId);
    // If playing, restart with new speed
    if (isPlaying) {
      stop();
      setTimeout(() => generateAndPlay(), 100);
    }
  }, [isPlaying, stop, generateAndPlay]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = duration * (progress / 100);

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
          disabled={isLoading || !voicesLoaded}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
            isLoading || !voicesLoaded
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

      {/* Speed selector */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 pt-3 border-t border-white/10">
        <span className="text-xs text-white/50 mr-2">Speed:</span>
        {SPEED_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSpeedChange(opt.id)}
            className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all ${
              speed === opt.id
                ? "bg-white text-forest font-medium"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {!voicesLoaded && (
        <p className="text-center text-xs text-white/40 mt-3">
          Loading speech engine...
        </p>
      )}
    </div>
  );
}
