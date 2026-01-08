import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await db.article.deleteMany();

    return NextResponse.json({
      success: true,
      deleted: result.count,
      message: `Deleted ${result.count} articles from database`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete articles", details: String(error) },
      { status: 500 }
    );
  }
}
