// Search for relevant images using Unsplash API
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string | null;
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
}

// Extract search keywords from article title
function extractKeywords(title: string): string {
  // Remove common words and get key terms
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
    'she', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where',
    'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'after',
    'before', 'during', 'while', 'about', 'against', 'between', 'into',
    'through', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'says', 'said', 'new', 'first',
    'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right',
    'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young',
    'important', 'public', 'bad', 'good', 'key', 'major', 'us', 'uk',
  ]);

  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Take first 3 meaningful words as search query
  return words.slice(0, 3).join(' ');
}

// Search Unsplash for images matching the query
export async function searchRelevantImage(title: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.log('UNSPLASH_ACCESS_KEY not set, using fallback');
    return null;
  }

  const query = extractKeywords(title);
  if (!query) {
    console.log('No keywords extracted from title');
    return null;
  }

  console.log(`Searching Unsplash for: "${query}"`);

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status}`);
      return null;
    }

    const data: UnsplashSearchResponse = await response.json();

    if (data.results.length > 0) {
      const photo = data.results[0];
      console.log(`Found image: ${photo.alt_description || 'no description'}`);
      return photo.urls.regular;
    }

    console.log('No images found for query');
    return null;
  } catch (error) {
    console.error('Unsplash search failed:', error);
    return null;
  }
}

// Fallback: topic-based images when API is not available
const TOPIC_IMAGES: Record<string, string> = {
  // Politics & Government
  'trump': 'photo-1580128660010-fd027e1e587a',
  'biden': 'photo-1580128660010-fd027e1e587a',
  'election': 'photo-1540910419892-4a36d2c3266c',
  'congress': 'photo-1523995462485-3d171b5c8fa9',
  'president': 'photo-1580128660010-fd027e1e587a',
  'government': 'photo-1523995462485-3d171b5c8fa9',
  'politics': 'photo-1529107386315-e1a2ed48a620',
  'vote': 'photo-1540910419892-4a36d2c3266c',
  'law': 'photo-1589829545856-d10d557cf95f',
  'court': 'photo-1589829545856-d10d557cf95f',
  'police': 'photo-1453873531674-2151bcd01707',
  'crime': 'photo-1453873531674-2151bcd01707',
  'prison': 'photo-1453873531674-2151bcd01707',

  // International
  'china': 'photo-1547981609-4b6bfe67ca0b',
  'russia': 'photo-1513326738677-b964603b136d',
  'ukraine': 'photo-1555109307-f7d9da25c244',
  'europe': 'photo-1519677100203-a0e668c92439',
  'asia': 'photo-1480796927426-f609979314bd',
  'africa': 'photo-1516026672322-bc52d61a55d5',
  'middle east': 'photo-1547471080-7cc2caa01a7e',
  'immigration': 'photo-1532375810709-75b1da00537c',
  'refugee': 'photo-1532375810709-75b1da00537c',
  'war': 'photo-1555109307-f7d9da25c244',
  'military': 'photo-1555109307-f7d9da25c244',

  // Economy & Business
  'economy': 'photo-1611974789855-9c2a0a7236a3',
  'market': 'photo-1611974789855-9c2a0a7236a3',
  'stock': 'photo-1611974789855-9c2a0a7236a3',
  'business': 'photo-1507679799987-c73779587ccf',
  'trade': 'photo-1507679799987-c73779587ccf',
  'bank': 'photo-1501167786227-4cba60f6d58f',
  'money': 'photo-1501167786227-4cba60f6d58f',
  'tax': 'photo-1554224155-6726b3ff858f',
  'inflation': 'photo-1611974789855-9c2a0a7236a3',

  // Environment & Climate
  'climate': 'photo-1611273426858-450d8e3c9fce',
  'environment': 'photo-1441974231531-c6227db76b6e',
  'storm': 'photo-1527482937786-6f0e5a4a9b1a',
  'hurricane': 'photo-1527482937786-6f0e5a4a9b1a',
  'flood': 'photo-1547683905-f686c993aae5',
  'fire': 'photo-1473116763249-2faaef81ccda',
  'wildfire': 'photo-1473116763249-2faaef81ccda',
  'earthquake': 'photo-1547683905-f686c993aae5',
  'weather': 'photo-1534088568595-a066f410bcda',
  'pollution': 'photo-1611273426858-450d8e3c9fce',
  'forest': 'photo-1441974231531-c6227db76b6e',
  'ocean': 'photo-1518837695005-2083093ee35b',
  'animal': 'photo-1474511320723-9a56873571b7',
  'wildlife': 'photo-1474511320723-9a56873571b7',

  // Health & Medicine
  'health': 'photo-1576091160399-112ba8d25d1d',
  'hospital': 'photo-1519494026892-80bbd2d6fd0d',
  'doctor': 'photo-1576091160399-112ba8d25d1d',
  'medicine': 'photo-1584308666744-24d5c474f2ae',
  'vaccine': 'photo-1584308666744-24d5c474f2ae',
  'covid': 'photo-1584483766114-2cea6facdf57',
  'virus': 'photo-1584483766114-2cea6facdf57',
  'disease': 'photo-1576091160399-112ba8d25d1d',
  'mental': 'photo-1493836512294-502baa1986e2',
  'drug': 'photo-1584308666744-24d5c474f2ae',

  // Technology
  'technology': 'photo-1518770660439-4636190af475',
  'tech': 'photo-1518770660439-4636190af475',
  'ai': 'photo-1677442136019-21780ecad995',
  'artificial': 'photo-1677442136019-21780ecad995',
  'robot': 'photo-1485827404703-89b55fcc595e',
  'computer': 'photo-1518770660439-4636190af475',
  'internet': 'photo-1558494949-ef010cbdcc31',
  'cyber': 'photo-1558494949-ef010cbdcc31',
  'phone': 'photo-1511707171634-5f897ff02aa9',
  'app': 'photo-1511707171634-5f897ff02aa9',
  'social media': 'photo-1611262588024-d12430b98920',
  'facebook': 'photo-1611262588024-d12430b98920',
  'twitter': 'photo-1611605698335-8b1569810432',
  'google': 'photo-1573804633927-bfcbcd909acd',
  'apple': 'photo-1611186871348-b1ce696e52c9',
  'amazon': 'photo-1523474253046-8cd2748b5fd2',

  // Space & Science
  'space': 'photo-1446776811953-b23d57bd21aa',
  'nasa': 'photo-1446776811953-b23d57bd21aa',
  'rocket': 'photo-1517976487492-5750f3195933',
  'satellite': 'photo-1446776811953-b23d57bd21aa',
  'planet': 'photo-1614732414444-096e5f1122d5',
  'mars': 'photo-1614728263952-84ea256f9679',
  'moon': 'photo-1522030299830-16b8d3d049fe',
  'research': 'photo-1507413245164-6160d8298b31',
  'scientist': 'photo-1532094349884-543bc11b234d',
  'study': 'photo-1507413245164-6160d8298b31',

  // Agriculture & Food
  'farm': 'photo-1500937386664-56d1dfef3f32',
  'agriculture': 'photo-1500937386664-56d1dfef3f32',
  'food': 'photo-1504674900247-0877df9cc836',
  'crop': 'photo-1500937386664-56d1dfef3f32',
  'wheat': 'photo-1500937386664-56d1dfef3f32',
  'cattle': 'photo-1500595046743-cd271d694d30',

  // Energy
  'energy': 'photo-1473341304170-971dccb5ac1e',
  'oil': 'photo-1518709766631-a6a7f45921c3',
  'gas': 'photo-1518709766631-a6a7f45921c3',
  'solar': 'photo-1509391366360-2e959784a276',
  'wind': 'photo-1532601224476-15c79f2f7a51',
  'nuclear': 'photo-1591799264318-7e6ef8ddb7ea',
  'electric': 'photo-1593941707882-a5bba14938c7',

  // Transport
  'car': 'photo-1494976388531-d1058494cdd8',
  'plane': 'photo-1436491865332-7a61a109cc05',
  'train': 'photo-1474487548417-781cb71495f3',
  'ship': 'photo-1494564605686-2e931f77a8a2',
  'transport': 'photo-1449824913935-59a10b8d2000',
  'traffic': 'photo-1449824913935-59a10b8d2000',
  'airport': 'photo-1436491865332-7a61a109cc05',

  // Education
  'school': 'photo-1523050854058-8df90110c9f1',
  'university': 'photo-1523050854058-8df90110c9f1',
  'education': 'photo-1503676260728-1c00da094a0b',
  'student': 'photo-1523050854058-8df90110c9f1',
  'teacher': 'photo-1503676260728-1c00da094a0b',

  // Default fallbacks by category
  '_world': 'photo-1451187580459-43490279c0fa',
  '_science': 'photo-1507413245164-6160d8298b31',
  '_culture': 'photo-1493225457124-a3eb161ffa5f',
  '_sports': 'photo-1461896836934-28e4bc8f7705',
  '_fun': 'photo-1513151233558-d860c5398176',
};

// Find best matching image based on title keywords
export function findTopicImage(title: string, category: string): string {
  const lowerTitle = title.toLowerCase();

  // Check each topic keyword
  for (const [keyword, photoId] of Object.entries(TOPIC_IMAGES)) {
    if (keyword.startsWith('_')) continue; // Skip category fallbacks
    if (lowerTitle.includes(keyword)) {
      return `https://images.unsplash.com/${photoId}?w=800&q=80`;
    }
  }

  // Fall back to category default
  const fallbackKey = `_${category}`;
  const fallbackId = TOPIC_IMAGES[fallbackKey] || TOPIC_IMAGES['_world'];
  return `https://images.unsplash.com/${fallbackId}?w=800&q=80`;
}

// Main function: try Unsplash API first, fall back to topic matching
export async function getArticleImage(title: string, category: string): Promise<string> {
  // Try Unsplash API search first
  const apiImage = await searchRelevantImage(title);
  if (apiImage) {
    return apiImage;
  }

  // Fall back to topic-based matching
  return findTopicImage(title, category);
}
