"use client";

import { useState, ReactNode } from "react";

interface ExerciseCardProps {
  title: string;
  icon: string;
  description: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ExerciseCard({ title, icon, description, children, defaultOpen = false }: ExerciseCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-hidden="true">
            {icon}
          </span>
          <div className="text-left">
            <h3 className="font-ui font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-5 pt-0 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}
