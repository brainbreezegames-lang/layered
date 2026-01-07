"use client";

import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  duration: number;
}

export function AudioPlayer({ audioUrl, duration }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const changePlaybackRate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const rates = [0.5, 0.75, 1, 1.25, 1.5];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-4">
        {/* Skip back */}
        <button
          onClick={() => skip(-15)}
          className="p-2 text-gray-500 hover:text-primary transition-colors"
          aria-label="Skip back 15 seconds"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
          </svg>
          <span className="text-xs block -mt-1">15</span>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-light transition-colors shadow-md"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Skip forward */}
        <button
          onClick={() => skip(15)}
          className="p-2 text-gray-500 hover:text-primary transition-colors"
          aria-label="Skip forward 15 seconds"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
          </svg>
          <span className="text-xs block -mt-1">15</span>
        </button>

        {/* Progress section */}
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm text-gray-500 font-mono w-12 text-right">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 accent-primary"
            aria-label="Seek"
          />

          <span className="text-sm text-gray-500 font-mono w-12">
            {formatTime(duration)}
          </span>
        </div>

        {/* Playback rate */}
        <button
          onClick={changePlaybackRate}
          className="px-2 py-1 text-sm font-mono text-gray-600 hover:text-primary border border-gray-200 rounded-md hover:border-primary transition-colors"
          aria-label={`Playback speed: ${playbackRate}x`}
        >
          {playbackRate}x
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Listen to this article · {formatTime(duration)} listen
      </p>
    </div>
  );
}
