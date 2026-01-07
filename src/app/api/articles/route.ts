import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  const where = category && category !== "all" ? { category } : {};

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        category: true,
        heroImage: true,
        heroAlt: true,
        publishedAt: true,
        wordCounts: true,
        readTimes: true,
      },
    }),
    db.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
      total,
    },
  });
}
