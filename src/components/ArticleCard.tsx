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

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden mb-4">
        <Image
          src={article.heroImage}
          alt={article.heroAlt}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div>
        <p className="text-xs font-ui text-muted uppercase tracking-wider mb-2">
          {categoryLabels[article.category]}
        </p>
        <h3 className="font-display text-xl md:text-2xl font-medium text-gray-900 leading-snug group-hover:text-primary transition-colors">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
