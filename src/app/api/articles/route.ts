import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  const where = category && category !== "all" ? { category } : {};

  const [rawArticles, total] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.article.count({ where }),
  ]);

  const articles = rawArticles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    subtitle: a.subtitle,
    category: a.category,
    heroImage: a.heroImage,
    heroAlt: a.heroAlt,
    publishedAt: a.publishedAt,
    wordCounts: a.wordCounts,
    readTimes: a.readTimes,
  }));

  return NextResponse.json({
    articles,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
      total,
    },
  });
}
