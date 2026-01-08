"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";

interface ArticleCardArticle {
  id: string;
  slug: string;
  title: string;
  category: Category;
  heroImage: string | null;
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

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="article-card block"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        {article.heroImage ? (
          <Image
            src={article.heroImage}
            alt={article.heroAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
            <span className="font-display text-4xl text-stone-300">{article.title.charAt(0)}</span>
          </div>
        )}
        {/* Category pill overlay */}
        <div className="absolute top-3 left-3">
          <span className={`category-pill category-${article.category}`}>
            {categoryLabels[article.category]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="font-display text-lg md:text-xl font-medium text-gray-900 leading-snug line-clamp-2">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
