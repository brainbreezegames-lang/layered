"use client";

import { Level } from "@/types";
import { useLevel } from "./LevelContext";

const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];

export function LevelSelector() {
  const { level, setLevel } = useLevel();

  return (
    <div className="level-selector">
      {levels.map((l) => (
        <button
          key={l}
          onClick={() => setLevel(l)}
          className={`level-btn ${level === l ? "active" : ""}`}
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
    <div className="level-selector">
      {levels.map((l) => (
        <button
          key={l}
          onClick={() => setLevel(l)}
          className={`level-btn ${level === l ? "active" : ""}`}
          aria-pressed={level === l}
          aria-label={`Set reading level to ${l}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
