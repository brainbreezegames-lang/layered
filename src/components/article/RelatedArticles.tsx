import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";

interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: Category;
  heroImage: string;
  heroAlt: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

const categoryLabels: Record<Category, string> = {
  world: "World",
  culture: "Culture",
  science: "Science",
  sports: "Sports",
  fun: "Fun",
};

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
        More to Explore
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={article.heroImage}
                alt={article.heroAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-ui font-medium text-primary mb-2">
                {categoryLabels[article.category]}
              </p>
              <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600 font-body line-clamp-2">
                {article.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
