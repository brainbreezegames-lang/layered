"use client";

import { useLevel } from "@/components/LevelContext";
import { HeroSection } from "@/components/article/HeroSection";
import { Sidebar } from "@/components/article/Sidebar";
import { ArticleContent } from "@/components/article/ArticleContent";
import { AudioPlayer } from "@/components/article/AudioPlayer";
import { ExerciseSection } from "@/components/exercises/ExerciseSection";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { mockArticle, mockArticles } from "@/lib/data/mock-articles";

export default function ArticlePage() {
  const { level } = useLevel();
  const article = mockArticle;
  const relatedArticles = mockArticles.filter((a) => a.id !== article.id);

  return (
    <article>
      {/* Hero */}
      <HeroSection
        image={article.heroImage}
        alt={article.heroAlt}
        title={article.title}
        subtitle={article.subtitle}
        credit={article.heroCredit}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-3 mb-8 lg:mb-0">
            <Sidebar
              source={article.source}
              sourceUrl={article.sourceUrl}
              wordCount={article.wordCount[level]}
              readTime={article.readTime[level]}
              category={article.category}
              tags={article.tags}
              articleId={article.id}
              level={level}
            />
          </div>

          {/* Article content */}
          <div className="lg:col-span-9">
            {/* Audio player */}
            <AudioPlayer
              audioUrl={article.audio[level].url}
              duration={article.audio[level].duration}
            />

            {/* Article text */}
            <ArticleContent
              content={article.content[level]}
              vocabulary={article.vocabulary.filter(
                (v) =>
                  ["A1", "A2", "B1", "B2", "C1"].indexOf(v.level) <=
                  ["A1", "A2", "B1", "B2", "C1"].indexOf(level)
              )}
            />

            {/* Exercises */}
            <ExerciseSection exercises={article.exercises[level]} />

            {/* Related articles */}
            <RelatedArticles articles={relatedArticles} />
          </div>
        </div>
      </div>
    </article>
  );
}
