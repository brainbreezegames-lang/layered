"use client";

import { Level } from "@/types";
import { useLevel } from "./LevelContext";

const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];

export function LevelSelector() {
  const { level, setLevel } = useLevel();

  return (
    <div className="flex items-center">
      {levels.map((l, i) => (
        <button
          key={l}
          onClick={() => setLevel(l)}
          className={`level-btn ${level === l ? "active" : ""}`}
          aria-pressed={level === l}
          aria-label={`Set reading level to ${l}`}
        >
          {l}
          {i < levels.length - 1 && (
            <span className="text-gray-300 ml-1.5">/</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function LevelSelectorMobile() {
  const { level, setLevel } = useLevel();

  return (
    <select
      value={level}
      onChange={(e) => setLevel(e.target.value as Level)}
      className="px-3 py-2 bg-transparent font-ui text-sm text-muted focus:outline-none focus:text-primary border-b border-gray-300"
      aria-label="Select reading level"
    >
      {levels.map((l) => (
        <option key={l} value={l}>
          Level {l}
        </option>
      ))}
    </select>
  );
}
