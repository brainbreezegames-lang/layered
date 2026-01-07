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
  tags,
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
    <aside className="lg:sticky lg:top-24 space-y-6">
      {/* Source info */}
      <div className="pb-6 border-b border-gray-200">
        <p className="text-xs text-muted font-ui uppercase tracking-wider mb-1">
          Adapted by
        </p>
        <p className="font-ui text-sm text-gray-900">Layered Editors</p>
        <p className="text-xs text-muted font-ui uppercase tracking-wider mt-4 mb-1">
          Original source
        </p>
        <p className="font-ui text-sm text-gray-900">{source}</p>
      </div>

      {/* Stats */}
      <div className="pb-6 border-b border-gray-200">
        <p className="font-ui text-sm text-muted">
          {wordCount} words · {readTime} min read
        </p>
      </div>

      {/* Category & Tags */}
      <div className="pb-6 border-b border-gray-200">
        <p className="text-xs text-muted font-ui uppercase tracking-wider mb-2">
          {categoryLabels[category]}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-ui text-muted lowercase"
              >
                {tag}
                {tags.indexOf(tag) < tags.length - 1 && ","}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions - Editorial text links */}
      <div className="space-y-4">
        <button
          onClick={handleDownload}
          className="text-link group"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Download exercises</span>
          <svg
            className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <button
          onClick={handlePrint}
          className="text-link group no-print"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          <span>Print this lesson</span>
          <svg
            className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}
