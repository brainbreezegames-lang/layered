"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Level } from "@/types";

interface LevelContextType {
  level: Level;
  setLevel: (level: Level) => void;
}

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export function LevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<Level>("B1");

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
