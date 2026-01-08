import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Large pool of unique images - same as in process-article.ts
const CATEGORY_IMAGES: Record<string, string[]> = {
  world: [
    "photo-1451187580459-43490279c0fa",
    "photo-1526778548025-fa2f459cd5c1",
    "photo-1488085061387-422e29b40080",
    "photo-1517483000871-1dbf64a6e1c6",
    "photo-1477959858617-67f85cf4f1df",
    "photo-1480714378408-67cf0d13bc1b",
    "photo-1514924013411-cbf25faa35bb",
    "photo-1502602898657-3e91760cbb34",
    "photo-1513635269975-59663e0ac1ad",
    "photo-1518391846015-55a9cc003b25",
    "photo-1496442226666-8d4d0e62e6e9",
    "photo-1444723121867-7a241cacace9",
    "photo-1534430480872-3498386e7856",
    "photo-1512453979798-5ea266f8880c",
    "photo-1506973035872-a4ec16b8e8d9",
    "photo-1523482580672-f109ba8cb9be",
    "photo-1552832230-c0197dd311b5",
    "photo-1515542622106-78bda8ba0e5b",
    "photo-1548013146-72479768bada",
    "photo-1524492412937-b28074a5d7da",
  ],
  science: [
    "photo-1507413245164-6160d8298b31",
    "photo-1532094349884-543bc11b234d",
    "photo-1576086213369-97a306d36557",
    "photo-1451187580459-43490279c0fa",
    "photo-1446776811953-b23d57bd21aa",
    "photo-1454789548928-9efd52dc4031",
    "photo-1462331940025-496dfbfc7564",
    "photo-1484589065579-248aad0d628b",
    "photo-1530973428-5bf2db2e4d71",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1559757175-5700dde675bc",
    "photo-1614728263952-84ea256f9679",
    "photo-1581822261290-991b38693d1b",
    "photo-1635070041078-e363dbe005cb",
    "photo-1628595351029-c2bf17511435",
    "photo-1581093458791-9d42e3c7e117",
    "photo-1576319155264-99536e0be1ee",
    "photo-1617791160505-6f00504e3519",
    "photo-1444703686981-a3abbc4d4fe3",
    "photo-1419242902214-272b3f66ee7a",
  ],
  culture: [
    "photo-1493225457124-a3eb161ffa5f",
    "photo-1518998053901-5348d3961a04",
    "photo-1499364615650-ec38552f4f34",
    "photo-1514320291840-2e0a9bf2a9ae",
    "photo-1460661419201-fd4cecdf8a8b",
    "photo-1547826039-bfc35e0f1ea8",
    "photo-1507838153414-b4b713384a76",
    "photo-1511379938547-c1f69419868d",
    "photo-1485579149621-3123dd979885",
    "photo-1514525253161-7a46d19cd819",
    "photo-1533174072545-7a4b6ad7a6c3",
    "photo-1459749411175-04bf5292ceea",
    "photo-1478147427282-58a87a120781",
    "photo-1536440136628-849c177e76a1",
    "photo-1594909122845-11baa439b7bf",
    "photo-1518834107812-67b0b7c58434",
    "photo-1545987796-200677ee1011",
    "photo-1513364776144-60967b0f800f",
    "photo-1561214115-f2f134cc4912",
    "photo-1544967082-d9d25d867d66",
  ],
  sports: [
    "photo-1461896836934-28e4bc8f7705",
    "photo-1579952363873-27f3bade9f55",
    "photo-1530549387789-4c1017266635",
    "photo-1517649763962-0c623066013b",
    "photo-1552674605-db6ffd4facb5",
    "photo-1571019614242-c5c5dee9f50b",
    "photo-1574629810360-7efbbe195018",
    "photo-1546519638-68e109498ffc",
    "photo-1587280501635-68a0e82cd5ff",
    "photo-1542144582-1ba00456b5e3",
    "photo-1508098682722-e99c43a406b2",
    "photo-1535131749006-b7f58c99034b",
    "photo-1519861531473-9200262188bf",
    "photo-1431324155629-1a6deb1dec8d",
    "photo-1560272564-c83b66b1ad12",
    "photo-1612872087720-bb876e2e67d1",
    "photo-1544298621-a27d63aa391e",
    "photo-1551698618-1dfe5d97d256",
    "photo-1521412644187-c49fa049e84d",
    "photo-1599058917212-d750089bc07e",
  ],
  fun: [
    "photo-1513151233558-d860c5398176",
    "photo-1527529482837-4698179dc6ce",
    "photo-1464349095431-e9a21285b5f3",
    "photo-1533174072545-7a4b6ad7a6c3",
    "photo-1496024840928-4c417adf211d",
    "photo-1502086223501-7ea6ecd79368",
    "photo-1558618666-fcd25c85cd64",
    "photo-1506157786151-b8491531f063",
    "photo-1492684223066-81342ee5ff30",
    "photo-1514525253161-7a46d19cd819",
    "photo-1504196606672-aef5c9cefc92",
    "photo-1470225620780-dba8ba36b745",
    "photo-1429962714451-bb934ecdc4ec",
    "photo-1516450360452-9312f5e86fc7",
    "photo-1478145046317-39f10e56b5e9",
    "photo-1530103862676-de8c9debad1d",
    "photo-1485872299829-c673f5194813",
    "photo-1504674900247-0877df9cc836",
    "photo-1414235077428-338989a2e8c0",
    "photo-1517248135467-4c7edcad34c4",
  ],
};

// Same hash function as process-article.ts
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getUniqueImage(category: string, sourceUrl: string): string {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.world;
  const index = hashString(sourceUrl) % images.length;
  const photoId = images[index];
  return `https://images.unsplash.com/${photoId}?w=800&q=80`;
}

export async function POST() {
  try {
    // Get all articles with their sourceUrl for deterministic image selection
    const { data: articles, error } = await supabaseAdmin
      .from("Article")
      .select("id, category, sourceUrl, heroImage");

    if (error) throw error;

    let updated = 0;

    // Update ALL articles with unique images based on their sourceUrl
    for (const article of articles || []) {
      const newImage = getUniqueImage(article.category, article.sourceUrl);

      // Only update if different (to avoid unnecessary writes)
      if (article.heroImage !== newImage) {
        const { error: updateError } = await supabaseAdmin
          .from("Article")
          .update({ heroImage: newImage })
          .eq("id", article.id);

        if (!updateError) {
          updated++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      total: articles?.length || 0,
      updated,
    });
  } catch (error) {
    console.error("Fix images failed:", error);
    return NextResponse.json(
      { error: "Failed", details: String(error) },
      { status: 500 }
    );
  }
}
