"use client";

import { Category, Level } from "@/types";

interface SidebarProps {
  source: string;
  sourceUrl: string;
  wordCount: number;
  readTime: number;
  category: Category;
  tags: string[];
  articleId: string;
  level: Level;
}

const categoryLabels: Record<Category, string> = {
  world: "World",
  culture: "Culture",
  science: "Science",
  sports: "Sports",
  fun: "Fun",
};

export function Sidebar({
  source,
  wordCount,
  readTime,
  category,
  articleId,
  level,
}: SidebarProps) {
  const handleDownload = async () => {
    window.open(`/api/pdf/${articleId}/${level}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <aside className="space-y-4 md:space-y-6">
      {/* Article Info Card - Editorial style */}
      <div className="bg-[var(--color-cream-dark)] rounded-md p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-3 md:block md:space-y-4">
          {/* Category */}
          <span className="category-tag">
            {categoryLabels[category]}
          </span>

          {/* Level */}
          <span className="level-tag">
            {level}
          </span>

          {/* Stats */}
          <span className="text-sm text-[var(--color-text-muted)] md:block">
            {wordCount} words · {readTime} min read
          </span>
        </div>

        {/* Source - Hidden on mobile, shown on desktop */}
        <div className="hidden md:block mt-5 pt-5 border-t border-[var(--color-border)]">
          <p className="editorial-subhead mb-1">Source</p>
          <p className="text-sm text-[var(--color-text)]">{source}</p>
        </div>
      </div>

      {/* Actions - Desktop only (mobile uses floating bar) */}
      <div className="hidden md:block bg-[var(--color-cream-dark)] rounded-md p-5 md:p-6 space-y-3">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--color-forest)] text-white rounded-md font-medium text-sm hover:bg-[var(--color-forest-dark)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Exercises
        </button>

        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--color-warm)] text-[var(--color-text)] rounded-md font-medium text-sm hover:bg-[var(--color-border)] transition-colors no-print"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Lesson
        </button>
      </div>
    </aside>
  );
}
