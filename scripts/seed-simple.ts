import "dotenv/config";
import { supabaseAdmin } from "../src/lib/supabase";

// Simple seed articles - minimal data to get site working
const SIMPLE_ARTICLES = [
  {
    id: `c${Date.now().toString(36)}1`,
    slug: "scientists-discover-ocean-microplastics",
    title: "Scientists Discover Microplastics in Remote Ocean Waters",
    subtitle: "New research reveals plastic pollution has reached the most isolated marine environments",
    category: "science",
    source: "Science Daily",
    sourceUrl: "https://sciencedaily.com/seed/microplastics-ocean-1",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
    heroAlt: "Ocean water with plastic pollution",
    content: {
      A1: "Scientists found tiny plastic in the ocean. The plastic is very small. It is everywhere in the water. This is bad for fish. Fish eat the plastic. We need to use less plastic. We need to clean the ocean.",
      A2: "Scientists have found tiny pieces of plastic in the ocean. These small plastics are called microplastics. They found them in water very far from land. Fish eat these plastics by mistake. This is a big problem for the ocean. Many animals can get sick from eating plastic.",
      B1: "Marine researchers have made an important discovery about plastic pollution in our oceans. A comprehensive study has revealed that microplastics have now reached even the most remote areas of the world's seas. The research team collected water samples from fifty different locations across the Pacific and Atlantic oceans. They found microplastics in every single sample, even in areas thousands of kilometers from the nearest coastline.",
      B2: "Marine researchers have made a disturbing discovery about the extent of plastic pollution in our oceans. A comprehensive study has revealed that microplastics have now reached even the most remote and isolated areas of the world's seas. The research team collected water samples from fifty different locations across the Pacific and Atlantic oceans. Despite their remoteness, every single sample contained microplastic particles. The researchers warn that this pollution poses a serious threat to marine ecosystems.",
      C1: "Marine researchers have made a disturbing discovery about the extent of plastic pollution in our oceans. A comprehensive study has revealed that microplastics have now reached even the most remote and isolated areas of the world's seas. The research team collected water samples from fifty different locations across the Pacific and Atlantic oceans, many thousands of kilometers from the nearest coastline. Despite their remoteness, every single sample contained microplastic particles. The researchers warn that this ubiquitous pollution poses a serious and unprecedented threat to marine ecosystems worldwide.",
    },
    exercises: {
      A1: { comprehension: [], vocabularyMatching: { pairs: [] }, gapFill: { text: "", blanks: [], wordBank: [] }, wordOrder: { sentences: [] }, trueFalse: { statements: [] }, discussion: [] },
      A2: { comprehension: [], vocabularyMatching: { pairs: [] }, gapFill: { text: "", blanks: [], wordBank: [] }, wordOrder: { sentences: [] }, trueFalse: { statements: [] }, discussion: [] },
      B1: { comprehension: [], vocabularyMatching: { pairs: [] }, gapFill: { text: "", blanks: [], wordBank: [] }, wordOrder: { sentences: [] }, trueFalse: { statements: [] }, discussion: [] },
      B2: { comprehension: [], vocabularyMatching: { pairs: [] }, gapFill: { text: "", blanks: [], wordBank: [] }, wordOrder: { sentences: [] }, trueFalse: { statements: [] }, discussion: [] },
      C1: { comprehension: [], vocabularyMatching: { pairs: [] }, gapFill: { text: "", blanks: [], wordBank: [] }, wordOrder: { sentences: [] }, trueFalse: { statements: [] }, discussion: [] },
    },
    vocabulary: [],
    wordCounts: { A1: 42, A2: 61, B1: 98, B2: 121, C1: 138 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
    publishedAt: new Date("2026-01-08T06:00:00Z").toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: `c${Date.now().toString(36)}2`,
    slug: "japan-earthquake-recovery-efforts",
    title: "Japan Begins Recovery After Major Earthquake",
    subtitle: "Communities work together to rebuild following the devastating natural disaster",
    category: "world",
    source: "BBC World",
    sourceUrl: "https://bbc.com/seed/japan-earthquake-1",
    heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200",
    heroAlt: "Emergency response teams in Japan",
    content: {
      A1: "A big earthquake hit Japan. Many buildings fell down. People are working together to help. They are cleaning the streets. They are fixing houses. Everyone is helping each other. This is important.",
      A2: "A major earthquake struck Japan last week. The earthquake damaged many buildings and roads. Emergency teams came to help people. Now, communities are working together to rebuild. Volunteers are cleaning up debris. Construction workers are repairing damaged structures. The recovery process will take time.",
      B1: "A powerful earthquake struck central Japan last week, causing significant damage to infrastructure and homes across several cities. Emergency response teams worked around the clock to rescue people and provide essential services. Now, as the immediate crisis passes, communities are beginning the long process of recovery. Local residents, volunteers, and construction teams are collaborating to clear debris, repair damaged buildings, and restore normalcy to affected areas.",
      B2: "A powerful earthquake struck central Japan last week, causing significant damage to infrastructure and homes across several cities. Emergency response teams worked tirelessly to rescue those trapped and provide essential services to affected communities. Now, as the immediate crisis subsides, the focus has shifted to long-term recovery efforts. Local residents, volunteers, and construction teams are collaborating extensively to clear debris, repair damaged structures, and restore normalcy. The Japanese government has pledged substantial financial support for reconstruction.",
      C1: "A powerful earthquake struck central Japan last week, causing significant damage to infrastructure and homes across several cities. Emergency response teams worked tirelessly to rescue those trapped and provide essential services to affected communities. Now, as the immediate crisis subsides, the focus has shifted to comprehensive long-term recovery efforts. Local residents, volunteers, and construction teams are collaborating extensively to clear debris, repair damaged structures, and restore normalcy to devastated areas. The Japanese government has pledged substantial financial support for reconstruction, while emphasizing the importance of building more resilient infrastructure to withstand future seismic events.",
    },
    exercises: {
      A1: { comprehension: [], vocabularyMatching: { pairs: [] }, gapFill: { text: "", blanks: [], wordBank: [] }, wordOrder: { sentences: [] }, trueFalse: { statements: [] }, discussion: [] },
      A2: { comprehension: [], vocabularyMatching: { pairs: [] }, gapFill: { text: "", blanks: [], wordBank: [] }, wordOrder: { sentences: [] }, trueFalse: { statements: [] }, discussion: [] },
      B1: { comprehension: [], vocabularyMatching: { pairs: [] }, gapFill: { text: "", blanks: [], wordBank: [] }, wordOrder: { sentences: [] }, trueFalse: { statements: [] }, discussion: [] },
      B2: { comprehension: [], vocabularyMatching: { pairs: [] }, gapFill: { text: "", blanks: [], wordBank: [] }, wordOrder: { sentences: [] }, trueFalse: { statements: [] }, discussion: [] },
      C1: { comprehension: [], vocabularyMatching: { pairs: [] }, gapFill: { text: "", blanks: [], wordBank: [] }, wordOrder: { sentences: [] }, trueFalse: { statements: [] }, discussion: [] },
    },
    vocabulary: [],
    wordCounts: { A1: 38, A2: 58, B1: 94, B2: 117, C1: 135 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
    publishedAt: new Date("2026-01-08T05:00:00Z").toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log("🌱 Seeding database with articles (simple version)...\n");

  for (const article of SIMPLE_ARTICLES) {
    try {
      // Check if exists
      const { data: existing } = await supabaseAdmin
        .from("Article")
        .select("id")
        .eq("slug", article.slug)
        .single();

      if (existing) {
        console.log(`⏭️  Skipped: ${article.title} (already exists)`);
        continue;
      }

      // Insert directly
      const { error } = await supabaseAdmin
        .from("Article")
        .insert(article);

      if (error) {
        throw error;
      }

      console.log(`✅ Created: ${article.title}`);
    } catch (error) {
      console.error(`❌ Failed: ${article.title}`, error);
    }
  }

  console.log("\n🎉 Seeding complete!");
  console.log(`\n📝 Next steps:
1. Visit your site - articles should now appear!
2. Run this SQL in Supabase Dashboard to enable level-specific titles:

ALTER TABLE "Article"
ADD COLUMN IF NOT EXISTS "titles" JSONB,
ADD COLUMN IF NOT EXISTS "subtitles" JSONB;
  `);
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
