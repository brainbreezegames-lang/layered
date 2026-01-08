import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/pipeline/fetch-news";

export async function GET() {
  try {
    console.log("Testing RSS feeds only...");
    const allNews = await fetchAllNews();

    return NextResponse.json({
      success: true,
      total: allNews.length,
      sample: allNews.slice(0, 10).map(a => ({
        title: a.title,
        source: a.source,
        link: a.link
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
