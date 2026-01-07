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
  world: "World News",
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
        <p className="text-sm text-gray-500 font-ui mb-1">Adapted by</p>
        <p className="font-ui font-semibold text-primary">LAYERED EDITORS</p>
        <p className="text-sm text-gray-500 font-ui mt-3 mb-1">Original source</p>
        <p className="font-ui text-gray-700">{source}</p>
      </div>

      {/* Stats */}
      <div className="pb-6 border-b border-gray-200">
        <p className="font-ui text-gray-600">
          <span className="font-semibold">{wordCount}</span> words · {readTime} min read
        </p>
      </div>

      {/* Category & Tags */}
      <div className="pb-6 border-b border-gray-200">
        <p className="font-ui font-semibold text-primary mb-2">
          {categoryLabels[category]}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-cream-dark text-gray-600 text-xs font-ui rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-ui font-medium rounded-lg hover:bg-primary-light transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Exercises
        </button>

        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary text-primary font-ui font-medium rounded-lg hover:bg-primary hover:text-white transition-colors no-print"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print This Lesson
        </button>
      </div>
    </aside>
  );
}
