import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Level } from "@/types";

export async function POST() {
  try {
    console.log("Stripping unwanted titles from article content...");

    const articles = await db.article.findMany();
    console.log(`Found ${articles.length} articles`);

    let updated = 0;

    for (const article of articles) {
      try {
        const content = article.content as Record<Level, string>;
        const cleanedContent: Record<Level, string> = {} as Record<Level, string>;
        let needsUpdate = false;

        // Check each level and strip the first line if it looks like a title
        for (const level of ["A1", "A2", "B1", "B2", "C1"] as Level[]) {
          const text = content[level];
          const lines = text.split('\n');

          // If first line looks like a title (short, no ending punctuation, followed by blank line)
          if (lines.length > 2 && lines[0].length > 0 && lines[0].length < 100 && lines[1].trim() === '') {
            // Strip first line and following blank line
            cleanedContent[level] = lines.slice(2).join('\n').trim();
            needsUpdate = true;
            console.log(`  ${level}: Removed title "${lines[0]}"`);
          } else {
            cleanedContent[level] = text;
          }
        }

        if (needsUpdate) {
          await db.article.update({
            where: { id: article.id },
            data: { content: cleanedContent },
          });
          console.log(`✓ Updated: ${article.slug}`);
          updated++;
        }
      } catch (error) {
        console.error(`✗ Failed: ${article.slug}`, error);
      }
    }

    return NextResponse.json({
      success: true,
      total: articles.length,
      updated,
    });
  } catch (error) {
    console.error("Fix error:", error);
    return NextResponse.json(
      { error: "Failed to fix titles", details: String(error) },
      { status: 500 }
    );
  }
}
