import { NextResponse } from "next/server";
import { generateAllLevels, generateAllExercises, generateVocabulary } from "@/lib/pipeline/ai-generate";
import { db } from "@/lib/db";
import { Level } from "@/types";

// AI processing - takes longer
export const maxDuration = 300;

export async function POST() {
  const results: { title: string; status: "success" | "error"; message?: string }[] = [];

  try {
    console.log("Finding articles that need AI processing...");

    // Find articles that have raw content but no A1 level (unprocessed)
    const allArticles = await db.article.findMany();
    const unprocessed = allArticles.filter(
      (a) => a.content && "raw" in (a.content as Record<string, string>) && !("A1" in (a.content as Record<string, string>))
    );

    console.log(`Found ${unprocessed.length} articles needing AI processing`);

    if (unprocessed.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No articles need processing",
        processed: 0,
        results: [],
      });
    }

    // Process up to 3 articles per run (AI is slow)
    const toProcess = unprocessed.slice(0, 3);
    let successCount = 0;

    for (const article of toProcess) {
      try {
        console.log(`\n🤖 Processing with AI: ${article.title}`);
        const rawContent = (article.content as Record<string, string>).raw;

        // Generate 5 level versions
        console.log("  Generating level versions...");
        const levelVersions = await generateAllLevels(rawContent);

        // Generate exercises and vocabulary in parallel
        console.log("  Generating exercises and vocabulary...");
        const [exercises, vocabulary] = await Promise.all([
          generateAllExercises(levelVersions),
          generateVocabulary(levelVersions),
        ]);

        // Calculate word counts and read times for each level
        const wordCounts: Record<Level, number> = {} as Record<Level, number>;
        const readTimes: Record<Level, number> = {} as Record<Level, number>;

        for (const [level, text] of Object.entries(levelVersions)) {
          const words = text.split(/\s+/).length;
          wordCounts[level as Level] = words;
          readTimes[level as Level] = Math.ceil(words / 200);
        }

        // Update article with AI-generated content
        await db.article.update({
          where: { id: article.id },
          data: {
            content: levelVersions as Record<string, string>,
            exercises: exercises as Record<string, unknown>,
            vocabulary: vocabulary,
            wordCounts: wordCounts as Record<string, number>,
            readTimes: readTimes as Record<string, number>,
          },
        });

        results.push({
          title: article.title,
          status: "success",
        });
        successCount++;
        console.log(`✅ AI processed: ${article.title}`);
      } catch (error) {
        console.error(`❌ AI processing failed for ${article.title}:`, error);
        results.push({
          title: article.title,
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const remaining = unprocessed.length - toProcess.length;
    return NextResponse.json({
      success: true,
      message: `Processed ${successCount} articles with AI.${remaining > 0 ? ` ${remaining} more waiting.` : ""}`,
      processed: successCount,
      remaining,
      results,
    });
  } catch (error) {
    console.error("Process articles failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        results,
      },
      { status: 500 }
    );
  }
}
