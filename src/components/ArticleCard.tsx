"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";

interface ArticleCardArticle {
  id: string;
  slug: string;
  title: string;
  category: Category;
  heroImage: string;
  heroAlt: string;
  publishedAt?: string;
}

interface ArticleCardProps {
  article: ArticleCardArticle;
}

const categoryLabels: Record<Category, string> = {
  world: "World",
  culture: "Culture",
  science: "Science",
  sports: "Sports",
  fun: "Fun",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.heroImage}
          alt={article.heroAlt}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl md:text-[22px] font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-3 mb-4">
          {article.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-ui text-gray-500">
            {categoryLabels[article.category]}
            {article.publishedAt && ` · ${formatDate(article.publishedAt)}`}
          </p>
          <span className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
