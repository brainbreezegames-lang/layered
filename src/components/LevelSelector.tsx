"use client";

import { Level } from "@/types";
import { useLevel } from "./LevelContext";

const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];

export function LevelSelector() {
  const { level, setLevel } = useLevel();

  return (
    <div className="flex items-center gap-1">
      {levels.map((l) => (
        <button
          key={l}
          onClick={() => setLevel(l)}
          className={`level-badge level-badge-${l.toLowerCase()} ${
            level === l ? "active" : ""
          }`}
          aria-pressed={level === l}
          aria-label={`Set reading level to ${l}`}
        >
          {l}
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
      className="px-3 py-2 rounded-lg border-2 border-primary bg-transparent font-mono text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      aria-label="Select reading level"
    >
      {levels.map((l) => (
        <option key={l} value={l}>
          {l}
        </option>
      ))}
    </select>
  );
}
