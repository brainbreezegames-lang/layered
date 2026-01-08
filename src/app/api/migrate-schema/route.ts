import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runMigration() {
  console.log("Running schema migration...");

  // Add titles column if it doesn't exist
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "titles" JSONB;
  `);

  // Add subtitles column if it doesn't exist
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "subtitles" JSONB;
  `);

  console.log("✓ Schema migration completed");
}

export async function POST() {
  try {
    await runMigration();
    return NextResponse.json({
      success: true,
      message: "Schema updated successfully",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Failed to update schema", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await runMigration();
    return NextResponse.json({
      success: true,
      message: "Schema updated successfully",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Failed to update schema", details: String(error) },
      { status: 500 }
    );
  }
}
