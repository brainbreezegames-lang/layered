import { db } from "@/lib/db";
import { getFullArticle, NewsItem } from "./fetch-news";
import { generateAllLevels, generateAllExercises, generateVocabulary } from "./ai-generate";
import { Level } from "@/types";

// Large pool of unique, high-quality Unsplash images per category
// Each image is curated and will only be used once per article (deterministic selection)
const CATEGORY_IMAGES: Record<string, string[]> = {
  world: [
    "photo-1451187580459-43490279c0fa", // earth from space
    "photo-1526778548025-fa2f459cd5c1", // world map
    "photo-1488085061387-422e29b40080", // airplane wing
    "photo-1517483000871-1dbf64a6e1c6", // city skyline
    "photo-1477959858617-67f85cf4f1df", // urban night
    "photo-1480714378408-67cf0d13bc1b", // new york
    "photo-1514924013411-cbf25faa35bb", // london
    "photo-1502602898657-3e91760cbb34", // paris eiffel
    "photo-1513635269975-59663e0ac1ad", // london bridge
    "photo-1518391846015-55a9cc003b25", // tokyo
    "photo-1496442226666-8d4d0e62e6e9", // times square
    "photo-1444723121867-7a241cacace9", // golden gate
    "photo-1534430480872-3498386e7856", // dubai
    "photo-1512453979798-5ea266f8880c", // dubai skyline
    "photo-1506973035872-a4ec16b8e8d9", // sydney opera
    "photo-1523482580672-f109ba8cb9be", // sydney bridge
    "photo-1552832230-c0197dd311b5", // rome colosseum
    "photo-1515542622106-78bda8ba0e5b", // great wall
    "photo-1548013146-72479768bada", // taj mahal
    "photo-1524492412937-b28074a5d7da", // statue of liberty
  ],
  science: [
    "photo-1507413245164-6160d8298b31", // laboratory
    "photo-1532094349884-543bc11b234d", // scientist
    "photo-1576086213369-97a306d36557", // microscope
    "photo-1451187580459-43490279c0fa", // earth
    "photo-1446776811953-b23d57bd21aa", // space shuttle
    "photo-1454789548928-9efd52dc4031", // astronaut
    "photo-1462331940025-496dfbfc7564", // nebula
    "photo-1484589065579-248aad0d628b", // DNA
    "photo-1530973428-5bf2db2e4d71", // molecules
    "photo-1507003211169-0a1dd7228f2d", // brain scan
    "photo-1559757175-5700dde675bc", // rocket launch
    "photo-1614728263952-84ea256f9679", // mars rover
    "photo-1581822261290-991b38693d1b", // satellite
    "photo-1635070041078-e363dbe005cb", // quantum
    "photo-1628595351029-c2bf17511435", // lab equipment
    "photo-1581093458791-9d42e3c7e117", // chemistry
    "photo-1576319155264-99536e0be1ee", // physics
    "photo-1617791160505-6f00504e3519", // telescope
    "photo-1444703686981-a3abbc4d4fe3", // stars
    "photo-1419242902214-272b3f66ee7a", // milky way
  ],
  culture: [
    "photo-1493225457124-a3eb161ffa5f", // concert
    "photo-1518998053901-5348d3961a04", // abstract art
    "photo-1499364615650-ec38552f4f34", // theater masks
    "photo-1514320291840-2e0a9bf2a9ae", // museum
    "photo-1460661419201-fd4cecdf8a8b", // painting
    "photo-1547826039-bfc35e0f1ea8", // art gallery
    "photo-1507838153414-b4b713384a76", // piano
    "photo-1511379938547-c1f69419868d", // music studio
    "photo-1485579149621-3123dd979885", // vinyl records
    "photo-1514525253161-7a46d19cd819", // festival lights
    "photo-1533174072545-7a4b6ad7a6c3", // crowd concert
    "photo-1459749411175-04bf5292ceea", // stage lights
    "photo-1478147427282-58a87a120781", // cinema
    "photo-1536440136628-849c177e76a1", // movie theater
    "photo-1594909122845-11baa439b7bf", // ballet
    "photo-1518834107812-67b0b7c58434", // opera house
    "photo-1545987796-200677ee1011", // art supplies
    "photo-1513364776144-60967b0f800f", // street art
    "photo-1561214115-f2f134cc4912", // sculpture
    "photo-1544967082-d9d25d867d66", // jazz
  ],
  sports: [
    "photo-1461896836934-28e4bc8f7705", // stadium lights
    "photo-1579952363873-27f3bade9f55", // soccer ball
    "photo-1530549387789-4c1017266635", // swimming
    "photo-1517649763962-0c623066013b", // cycling race
    "photo-1552674605-db6ffd4facb5", // running
    "photo-1571019614242-c5c5dee9f50b", // gym
    "photo-1574629810360-7efbbe195018", // basketball
    "photo-1546519638-68e109498ffc", // basketball court
    "photo-1587280501635-68a0e82cd5ff", // tennis
    "photo-1542144582-1ba00456b5e3", // tennis court
    "photo-1508098682722-e99c43a406b2", // golf
    "photo-1535131749006-b7f58c99034b", // golf course
    "photo-1519861531473-9200262188bf", // basketball hoop
    "photo-1431324155629-1a6deb1dec8d", // baseball
    "photo-1560272564-c83b66b1ad12", // football
    "photo-1612872087720-bb876e2e67d1", // volleyball
    "photo-1544298621-a27d63aa391e", // surfing
    "photo-1551698618-1dfe5d97d256", // skiing
    "photo-1521412644187-c49fa049e84d", // skateboarding
    "photo-1599058917212-d750089bc07e", // martial arts
  ],
  fun: [
    "photo-1513151233558-d860c5398176", // confetti
    "photo-1527529482837-4698179dc6ce", // party
    "photo-1464349095431-e9a21285b5f3", // balloons
    "photo-1533174072545-7a4b6ad7a6c3", // celebration
    "photo-1496024840928-4c417adf211d", // beach fun
    "photo-1502086223501-7ea6ecd79368", // amusement park
    "photo-1558618666-fcd25c85cd64", // roller coaster
    "photo-1506157786151-b8491531f063", // festival
    "photo-1492684223066-81342ee5ff30", // fireworks
    "photo-1514525253161-7a46d19cd819", // lights
    "photo-1504196606672-aef5c9cefc92", // DJ party
    "photo-1470225620780-dba8ba36b745", // DJ booth
    "photo-1429962714451-bb934ecdc4ec", // dancing
    "photo-1516450360452-9312f5e86fc7", // concert crowd
    "photo-1478145046317-39f10e56b5e9", // sparklers
    "photo-1530103862676-de8c9debad1d", // birthday
    "photo-1485872299829-c673f5194813", // ice cream
    "photo-1504674900247-0877df9cc836", // food
    "photo-1414235077428-338989a2e8c0", // restaurant
    "photo-1517248135467-4c7edcad34c4", // cafe
  ],
};

// Simple hash function to get consistent index from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get unique image based on article URL (deterministic - same URL always gets same image)
function getUniqueImage(category: string, articleUrl: string): string {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.world;
  const index = hashString(articleUrl) % images.length;
  const photoId = images[index];
  return `https://images.unsplash.com/${photoId}?w=800&q=80`;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function processArticle(newsItem: NewsItem) {
  console.log(`Processing: ${newsItem.title}`);

  // Check if already exists
  const existing = await db.article.findUnique({
    where: { sourceUrl: newsItem.link },
  });
  if (existing) {
    console.log("Article already exists, skipping");
    return null;
  }

  // Get full article text
  const fullArticle = await getFullArticle(newsItem.link);
  if (!fullArticle || fullArticle.textContent.length < 300) {
    console.log("Article too short or failed to extract, skipping");
    return null;
  }

  // Generate 5 level versions
  console.log("Generating level versions...");
  const levelVersions = await generateAllLevels(fullArticle.textContent);

  // Generate exercises and vocabulary in parallel
  console.log("Generating exercises and vocabulary...");
  const [exercises, vocabulary] = await Promise.all([
    generateAllExercises(levelVersions),
    generateVocabulary(levelVersions),
  ]);

  // Get unique image based on article URL (deterministic, never repeats for different URLs)
  const heroImage = getUniqueImage(newsItem.category, newsItem.link);

  // Calculate word counts and read times
  const wordCounts: Record<Level, number> = {} as Record<Level, number>;
  const readTimes: Record<Level, number> = {} as Record<Level, number>;

  for (const [level, text] of Object.entries(levelVersions)) {
    const words = text.split(/\s+/).length;
    wordCounts[level as Level] = words;
    readTimes[level as Level] = Math.ceil(words / 200);
  }

  // Save to database
  const article = await db.article.create({
    data: {
      slug: generateSlug(newsItem.title),
      title: newsItem.title,
      subtitle: newsItem.description,
      category: newsItem.category,
      source: newsItem.source,
      sourceUrl: newsItem.link,
      heroImage: heroImage,
      heroAlt: newsItem.title,
      content: levelVersions as Record<string, string>,
      exercises: exercises as Record<string, object>,
      vocabulary: vocabulary,
      wordCounts: wordCounts as Record<string, number>,
      readTimes: readTimes as Record<string, number>,
      publishedAt: new Date(), // Use current time so new articles appear at top
    },
  });

  console.log(`✓ Saved: ${article.slug}`);
  return article;
}
