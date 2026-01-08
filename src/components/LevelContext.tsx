"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Level } from "@/types";

interface LevelContextType {
  level: Level;
  setLevel: (level: Level) => void;
}

const LevelContext = createContext<LevelContextType | undefined>(undefined);

const STORAGE_KEY = "selectedLevel";
const VALID_LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

export function LevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevelState] = useState<Level>("B1");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_LEVELS.includes(saved as Level)) {
      setLevelState(saved as Level);
    }
  }, []);

  // Wrapper that also saves to localStorage
  const setLevel = (newLevel: Level) => {
    setLevelState(newLevel);
    localStorage.setItem(STORAGE_KEY, newLevel);
  };

  return (
    <LevelContext.Provider value={{ level, setLevel }}>
      {children}
    </LevelContext.Provider>
  );
}

export function useLevel() {
  const context = useContext(LevelContext);
  if (context === undefined) {
    throw new Error("useLevel must be used within a LevelProvider");
  }
  return context;
}
