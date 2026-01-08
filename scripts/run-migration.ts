import "dotenv/config";
import { supabaseAdmin } from "../src/lib/supabase";

async function runMigration() {
  console.log("Running migration to add titles and subtitles columns...\n");

  try {
    // Add columns
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE "Article"
        ADD COLUMN IF NOT EXISTS "titles" JSONB,
        ADD COLUMN IF NOT EXISTS "subtitles" JSONB;
      `
    });

    if (error) {
      // If RPC doesn't work, try direct query
      console.log("Trying direct SQL execution...");
      const { error: directError } = await supabaseAdmin
        .from('Article')
        .select('titles, subtitles')
        .limit(0);

      if (directError && directError.message.includes('column')) {
        console.error("❌ Columns don't exist. Please run this SQL in Supabase Dashboard:");
        console.log("\n" + `
ALTER TABLE "Article"
ADD COLUMN IF NOT EXISTS "titles" JSONB,
ADD COLUMN IF NOT EXISTS "subtitles" JSONB;
        `.trim() + "\n");
        process.exit(1);
      }
    }

    console.log("✅ Migration complete!");
    console.log("Columns 'titles' and 'subtitles' added to Article table.\n");
  } catch (error) {
    console.error("Migration failed:", error);
    console.log("\n📋 Please run this SQL manually in Supabase Dashboard > SQL Editor:\n");
    console.log(`
ALTER TABLE "Article"
ADD COLUMN IF NOT EXISTS "titles" JSONB,
ADD COLUMN IF NOT EXISTS "subtitles" JSONB;
    `.trim());
    process.exit(1);
  }
}

runMigration();
