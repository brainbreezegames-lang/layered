import "dotenv/config";
import { supabaseAdmin } from "../src/lib/supabase";

async function deleteSeedArticles() {
  console.log("🗑️  Deleting seed articles...\n");

  // Delete the two manually seeded articles
  const seedSlugs = [
    "scientists-discover-ocean-microplastics",
    "japan-earthquake-recovery-efforts",
  ];

  for (const slug of seedSlugs) {
    const { error } = await supabaseAdmin
      .from("Article")
      .delete()
      .eq("slug", slug);

    if (error) {
      console.error(`❌ Failed to delete ${slug}:`, error);
    } else {
      console.log(`✅ Deleted: ${slug}`);
    }
  }

  console.log("\n🎉 Seed articles deleted!");
  console.log("Now click 'Fetch New' on the homepage to get AI-generated articles.");
}

deleteSeedArticles();
