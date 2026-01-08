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
// Each topic has multiple images to avoid duplicates
const TOPIC_IMAGES: Record<string, string[]> = {
  // Politics & Government
  'trump': ['photo-1580128660010-fd027e1e587a', 'photo-1585776245991-cf89dd7fc73a'],
  'biden': ['photo-1580128660010-fd027e1e587a', 'photo-1612831455740-a2f6212eeeb2'],
  'election': ['photo-1540910419892-4a36d2c3266c', 'photo-1494172961521-33799ddd43a5'],
  'congress': ['photo-1523995462485-3d171b5c8fa9', 'photo-1541872703-74c5e44368f9'],
  'president': ['photo-1580128660010-fd027e1e587a', 'photo-1551836022-d5d88e9218df'],
  'government': ['photo-1523995462485-3d171b5c8fa9', 'photo-1575540325855-4b5d285e3845'],
  'politics': ['photo-1529107386315-e1a2ed48a620', 'photo-1541872703-74c5e44368f9'],
  'vote': ['photo-1540910419892-4a36d2c3266c', 'photo-1598128558393-70ff21433be0'],
  'law': ['photo-1589829545856-d10d557cf95f', 'photo-1436450412740-6b988f486c6b'],
  'court': ['photo-1589829545856-d10d557cf95f', 'photo-1479142506502-19b3a3b7ff33'],
  'police': ['photo-1453873531674-2151bcd01707', 'photo-1557597774-9d273605dfa9'],
  'crime': ['photo-1453873531674-2151bcd01707', 'photo-1605806616949-1e87b487fc2f'],
  'prison': ['photo-1453873531674-2151bcd01707', 'photo-1584713503693-bb386ec95cf2'],
  'shooting': ['photo-1453873531674-2151bcd01707', 'photo-1557597774-9d273605dfa9'],
  'immigration': ['photo-1532375810709-75b1da00537c', 'photo-1569974507005-6dc61f97fb5c'],
  'border': ['photo-1532375810709-75b1da00537c', 'photo-1569974507005-6dc61f97fb5c'],

  // International - specific countries/regions
  'china': ['photo-1547981609-4b6bfe67ca0b', 'photo-1508804185872-d7badad00f7d'],
  'russia': ['photo-1513326738677-b964603b136d', 'photo-1547448415-e9f5b28e570d'],
  'ukraine': ['photo-1555109307-f7d9da25c244', 'photo-1589519160732-57fc498494f8'],
  'europe': ['photo-1519677100203-a0e668c92439', 'photo-1467269204594-9661b134dd2b'],
  'asia': ['photo-1480796927426-f609979314bd', 'photo-1493780474015-884fe90026c0'],
  'africa': ['photo-1516026672322-bc52d61a55d5', 'photo-1489392191049-fc10c97e64b6'],
  'middle east': ['photo-1547471080-7cc2caa01a7e', 'photo-1466442929976-97f336a657be'],
  'cambodia': ['photo-1559592413-7cec4d0cae2b', 'photo-1528181304800-259b08848526'],
  'scam': ['photo-1563013544-824ae1b704d3', 'photo-1614064641938-3bbee52942c7'],
  'extradite': ['photo-1589829545856-d10d557cf95f', 'photo-1436450412740-6b988f486c6b'],
  'arrest': ['photo-1453873531674-2151bcd01707', 'photo-1557597774-9d273605dfa9'],
  'refugee': ['photo-1532375810709-75b1da00537c', 'photo-1569974507005-6dc61f97fb5c'],
  'war': ['photo-1555109307-f7d9da25c244', 'photo-1579548122080-c35fd6820ecb'],
  'military': ['photo-1555109307-f7d9da25c244', 'photo-1534643960519-11ad79bc19df'],
  'minneapolis': ['photo-1558618666-fcd25c85cd64', 'photo-1572817933382-5821c4ea6a9c'],
  'wales': ['photo-1506905925346-21bda4d32df4', 'photo-1558979158-65a1eaa08691'],
  'brexit': ['photo-1529655683826-aba9b3e77383', 'photo-1494587351196-bbf5f29cff42'],
  'farm': ['photo-1500937386664-56d1dfef3f32', 'photo-1574943320219-553eb213f72d'],
  'subsidy': ['photo-1554224155-6726b3ff858f', 'photo-1579621970563-ebec7560ff3e'],

  // Economy & Business
  'economy': ['photo-1611974789855-9c2a0a7236a3', 'photo-1590283603385-17ffb3a7f29f'],
  'market': ['photo-1611974789855-9c2a0a7236a3', 'photo-1535320903710-d993d3d77d29'],
  'stock': ['photo-1611974789855-9c2a0a7236a3', 'photo-1590283603385-17ffb3a7f29f'],
  'business': ['photo-1507679799987-c73779587ccf', 'photo-1556761175-5973dc0f32e7'],
  'trade': ['photo-1507679799987-c73779587ccf', 'photo-1586528116311-ad8dd3c8310d'],
  'bank': ['photo-1501167786227-4cba60f6d58f', 'photo-1541354329998-f4d9a9f9297f'],
  'money': ['photo-1501167786227-4cba60f6d58f', 'photo-1554224155-6726b3ff858f'],
  'tax': ['photo-1554224155-6726b3ff858f', 'photo-1579621970563-ebec7560ff3e'],
  'inflation': ['photo-1611974789855-9c2a0a7236a3', 'photo-1554224155-6726b3ff858f'],

  // Environment & Climate
  'climate': ['photo-1611273426858-450d8e3c9fce', 'photo-1569163139599-0f4517e36f51'],
  'environment': ['photo-1441974231531-c6227db76b6e', 'photo-1470071459604-3b5ec3a7fe05'],
  'storm': ['photo-1527482937786-6f0e5a4a9b1a', 'photo-1509635022432-0220ac12960b'],
  'hurricane': ['photo-1527482937786-6f0e5a4a9b1a', 'photo-1509635022432-0220ac12960b'],
  'flood': ['photo-1547683905-f686c993aae5', 'photo-1446034295857-c39f8844fad4'],
  'fire': ['photo-1473116763249-2faaef81ccda', 'photo-1602615576820-ea14cf3e476a'],
  'wildfire': ['photo-1473116763249-2faaef81ccda', 'photo-1602615576820-ea14cf3e476a'],
  'earthquake': ['photo-1547683905-f686c993aae5', 'photo-1547683905-f686c993aae5'],
  'weather': ['photo-1534088568595-a066f410bcda', 'photo-1504608524841-42fe6f032b4b'],
  'pollution': ['photo-1611273426858-450d8e3c9fce', 'photo-1569163139599-0f4517e36f51'],
  'forest': ['photo-1441974231531-c6227db76b6e', 'photo-1448375240586-882707db888b'],
  'ocean': ['photo-1518837695005-2083093ee35b', 'photo-1505118380757-91f5f5632de0'],
  'animal': ['photo-1474511320723-9a56873571b7', 'photo-1564349683136-77e08dba1ef7'],
  'wildlife': ['photo-1474511320723-9a56873571b7', 'photo-1564349683136-77e08dba1ef7'],

  // Health & Medicine
  'health': ['photo-1576091160399-112ba8d25d1d', 'photo-1538108149393-fbbd81895907'],
  'hospital': ['photo-1519494026892-80bbd2d6fd0d', 'photo-1586773860418-d37222d8fce3'],
  'doctor': ['photo-1576091160399-112ba8d25d1d', 'photo-1612349317150-e413f6a5b16d'],
  'medicine': ['photo-1584308666744-24d5c474f2ae', 'photo-1471864190281-a93a3070b6de'],
  'vaccine': ['photo-1584308666744-24d5c474f2ae', 'photo-1615631648086-325025c9e51e'],
  'covid': ['photo-1584483766114-2cea6facdf57', 'photo-1583947215259-38e31be8751f'],
  'virus': ['photo-1584483766114-2cea6facdf57', 'photo-1583947215259-38e31be8751f'],
  'disease': ['photo-1576091160399-112ba8d25d1d', 'photo-1538108149393-fbbd81895907'],
  'mental': ['photo-1493836512294-502baa1986e2', 'photo-1474418397713-7ede21d49118'],
  'drug': ['photo-1584308666744-24d5c474f2ae', 'photo-1471864190281-a93a3070b6de'],

  // Technology
  'technology': ['photo-1518770660439-4636190af475', 'photo-1485827404703-89b55fcc595e'],
  'tech': ['photo-1518770660439-4636190af475', 'photo-1519389950473-47ba0277781c'],
  'ai': ['photo-1677442136019-21780ecad995', 'photo-1620712943543-bcc4688e7485'],
  'artificial': ['photo-1677442136019-21780ecad995', 'photo-1620712943543-bcc4688e7485'],
  'robot': ['photo-1485827404703-89b55fcc595e', 'photo-1546776310-eef45dd6d63c'],
  'computer': ['photo-1518770660439-4636190af475', 'photo-1517694712202-14dd9538aa97'],
  'internet': ['photo-1558494949-ef010cbdcc31', 'photo-1544197150-b99a580bb7a8'],
  'cyber': ['photo-1558494949-ef010cbdcc31', 'photo-1550751827-4bd374c3f58b'],
  'phone': ['photo-1511707171634-5f897ff02aa9', 'photo-1523206489230-c012c64b2b48'],
  'app': ['photo-1511707171634-5f897ff02aa9', 'photo-1512941937669-90a1b58e7e9c'],
  'social media': ['photo-1611262588024-d12430b98920', 'photo-1562577309-4932fdd64cd1'],
  'facebook': ['photo-1611262588024-d12430b98920', 'photo-1562577309-4932fdd64cd1'],
  'twitter': ['photo-1611605698335-8b1569810432', 'photo-1562577309-4932fdd64cd1'],
  'google': ['photo-1573804633927-bfcbcd909acd', 'photo-1519389950473-47ba0277781c'],
  'apple': ['photo-1611186871348-b1ce696e52c9', 'photo-1491933382434-500287f9b54b'],
  'amazon': ['photo-1523474253046-8cd2748b5fd2', 'photo-1590599145008-e4ec48682067'],

  // Space & Science
  'space': ['photo-1446776811953-b23d57bd21aa', 'photo-1454789548928-9efd52dc4031'],
  'nasa': ['photo-1446776811953-b23d57bd21aa', 'photo-1457364559154-aa2644600ebb'],
  'rocket': ['photo-1517976487492-5750f3195933', 'photo-1516849841032-87cbac4d88f7'],
  'satellite': ['photo-1446776811953-b23d57bd21aa', 'photo-1581822261290-991b38693d1b'],
  'planet': ['photo-1614732414444-096e5f1122d5', 'photo-1545156521-77bd85671d30'],
  'mars': ['photo-1614728263952-84ea256f9679', 'photo-1573588028698-f4759bebf7a1'],
  'moon': ['photo-1522030299830-16b8d3d049fe', 'photo-1532693322450-2cb5c511067d'],
  'research': ['photo-1507413245164-6160d8298b31', 'photo-1532094349884-543bc11b234d'],
  'scientist': ['photo-1532094349884-543bc11b234d', 'photo-1507413245164-6160d8298b31'],
  'study': ['photo-1507413245164-6160d8298b31', 'photo-1434030216411-0b793f4b4173'],

  // Agriculture & Food
  'agriculture': ['photo-1500937386664-56d1dfef3f32', 'photo-1574943320219-553eb213f72d'],
  'food': ['photo-1504674900247-0877df9cc836', 'photo-1476224203421-9ac39bcb3327'],
  'crop': ['photo-1500937386664-56d1dfef3f32', 'photo-1574943320219-553eb213f72d'],
  'wheat': ['photo-1500937386664-56d1dfef3f32', 'photo-1568051243851-f9b136146e97'],
  'cattle': ['photo-1500595046743-cd271d694d30', 'photo-1570042225831-d98fa7577f1e'],

  // Energy
  'energy': ['photo-1473341304170-971dccb5ac1e', 'photo-1509391366360-2e959784a276'],
  'oil': ['photo-1518709766631-a6a7f45921c3', 'photo-1513828583688-c52646db42da'],
  'gas': ['photo-1518709766631-a6a7f45921c3', 'photo-1545259742-b4fd8fea67e4'],
  'solar': ['photo-1509391366360-2e959784a276', 'photo-1508514177221-188b1cf16e9d'],
  'wind': ['photo-1532601224476-15c79f2f7a51', 'photo-1466611653911-95081537e5b7'],
  'nuclear': ['photo-1591799264318-7e6ef8ddb7ea', 'photo-1576671414121-aa2d83c8f38c'],
  'electric': ['photo-1593941707882-a5bba14938c7', 'photo-1558618666-fcd25c85cd64'],

  // Transport
  'car': ['photo-1494976388531-d1058494cdd8', 'photo-1492144534655-ae79c964c9d7'],
  'plane': ['photo-1436491865332-7a61a109cc05', 'photo-1474302770737-173ee21bab63'],
  'train': ['photo-1474487548417-781cb71495f3', 'photo-1544620347-c4fd4a3d5957'],
  'ship': ['photo-1494564605686-2e931f77a8a2', 'photo-1520250497591-112f2f40a3f4'],
  'transport': ['photo-1449824913935-59a10b8d2000', 'photo-1474487548417-781cb71495f3'],
  'traffic': ['photo-1449824913935-59a10b8d2000', 'photo-1494515843206-f3117d3f51b7'],
  'airport': ['photo-1436491865332-7a61a109cc05', 'photo-1529074963764-98f45c47344b'],

  // Education
  'school': ['photo-1523050854058-8df90110c9f1', 'photo-1580582932707-520aed937b7b'],
  'university': ['photo-1523050854058-8df90110c9f1', 'photo-1562774053-701939374585'],
  'education': ['photo-1503676260728-1c00da094a0b', 'photo-1509062522246-3755977927d7'],
  'student': ['photo-1523050854058-8df90110c9f1', 'photo-1427504494785-3a9ca7044f45'],
  'teacher': ['photo-1503676260728-1c00da094a0b', 'photo-1577896851231-70ef18881754'],

  // Film & Entertainment
  'film': ['photo-1478147427282-58a87a120781', 'photo-1489599849927-2ee91cede3ba'],
  'movie': ['photo-1478147427282-58a87a120781', 'photo-1489599849927-2ee91cede3ba'],
  'cinema': ['photo-1478147427282-58a87a120781', 'photo-1517604931442-7e0c8ed2963c'],
  'hollywood': ['photo-1478147427282-58a87a120781', 'photo-1489599849927-2ee91cede3ba'],
  'director': ['photo-1485846234645-a62644f84728', 'photo-1478147427282-58a87a120781'],
  'actor': ['photo-1485846234645-a62644f84728', 'photo-1478147427282-58a87a120781'],
  'actress': ['photo-1485846234645-a62644f84728', 'photo-1478147427282-58a87a120781'],
  'oscar': ['photo-1478147427282-58a87a120781', 'photo-1485846234645-a62644f84728'],
  'theatre': ['photo-1503095396549-807759245b35', 'photo-1478147427282-58a87a120781'],
  'theater': ['photo-1503095396549-807759245b35', 'photo-1478147427282-58a87a120781'],
  'documentary': ['photo-1478147427282-58a87a120781', 'photo-1489599849927-2ee91cede3ba'],
  'palestinian': ['photo-1552799446-159ba9523315', 'photo-1501506069358-8f497c6b4c6e'],
  'gaza': ['photo-1552799446-159ba9523315', 'photo-1501506069358-8f497c6b4c6e'],
  'israel': ['photo-1552799446-159ba9523315', 'photo-1501506069358-8f497c6b4c6e'],

  // Music
  'music': ['photo-1511379938547-c1f69419868d', 'photo-1507838153414-b4b713384a76'],
  'concert': ['photo-1493225457124-a3eb161ffa5f', 'photo-1514525253161-7a46d19cd819'],
  'singer': ['photo-1493225457124-a3eb161ffa5f', 'photo-1510915228340-29c85a43dcfe'],
  'band': ['photo-1493225457124-a3eb161ffa5f', 'photo-1514525253161-7a46d19cd819'],
  'album': ['photo-1511379938547-c1f69419868d', 'photo-1487180144351-b8472da7d491'],

  // Sports
  'football': ['photo-1579952363873-27f3bade9f55', 'photo-1606925797300-0b35e9d1794e'],
  'soccer': ['photo-1579952363873-27f3bade9f55', 'photo-1606925797300-0b35e9d1794e'],
  'basketball': ['photo-1574629810360-7efbbe195018', 'photo-1546519638-68e109498ffc'],
  'tennis': ['photo-1622163642998-1ea32b0bbc67', 'photo-1554068865-24cecd4e34b8'],
  'boxing': ['photo-1549719386-74dfcbf7dbed', 'photo-1517438476312-10d79c077509'],
  'athlete': ['photo-1461896836934-28e4bc8f7705', 'photo-1552674605-db6ffd4facb5'],
  'championship': ['photo-1461896836934-28e4bc8f7705', 'photo-1579952363873-27f3bade9f55'],
  'olympics': ['photo-1461896836934-28e4bc8f7705', 'photo-1552674605-db6ffd4facb5'],
  'stadium': ['photo-1461896836934-28e4bc8f7705', 'photo-1522778119026-d647f0596c20'],
  'joshua': ['photo-1549719386-74dfcbf7dbed', 'photo-1517438476312-10d79c077509'],
  'driver': ['photo-1494976388531-d1058494cdd8', 'photo-1492144534655-ae79c964c9d7'],
  'driving': ['photo-1494976388531-d1058494cdd8', 'photo-1449824913935-59a10b8d2000'],

  // Art & Museums
  'museum': ['photo-1514320291840-2e0a9bf2a9ae', 'photo-1566127444977-a4f74d8676ad'],
  'art': ['photo-1460661419201-fd4cecdf8a8b', 'photo-1547826039-bfc35e0f1ea8'],
  'painting': ['photo-1460661419201-fd4cecdf8a8b', 'photo-1547826039-bfc35e0f1ea8'],
  'gallery': ['photo-1514320291840-2e0a9bf2a9ae', 'photo-1567696911980-2eed69a46042'],
  'exhibition': ['photo-1514320291840-2e0a9bf2a9ae', 'photo-1566127444977-a4f74d8676ad'],
};

// Category fallbacks - diverse images not city skylines
const CATEGORY_FALLBACKS: Record<string, string[]> = {
  'world': [
    'photo-1451187580459-43490279c0fa', // earth from space
    'photo-1526778548025-fa2f459cd5c1', // world map
    'photo-1521295121783-8a321d551ad2', // globe
    'photo-1489549132488-d00b7eee80f1', // newspaper
    'photo-1504711434969-e33886168f5c', // news
  ],
  'science': [
    'photo-1507413245164-6160d8298b31', // laboratory
    'photo-1532094349884-543bc11b234d', // scientist
    'photo-1576086213369-97a306d36557', // microscope
    'photo-1446776811953-b23d57bd21aa', // space
    'photo-1507003211169-0a1dd7228f2d', // brain
  ],
  'culture': [
    'photo-1493225457124-a3eb161ffa5f', // concert
    'photo-1514320291840-2e0a9bf2a9ae', // museum
    'photo-1460661419201-fd4cecdf8a8b', // painting
    'photo-1478147427282-58a87a120781', // cinema
    'photo-1507838153414-b4b713384a76', // piano
  ],
  'sports': [
    'photo-1461896836934-28e4bc8f7705', // stadium
    'photo-1579952363873-27f3bade9f55', // soccer
    'photo-1530549387789-4c1017266635', // swimming
    'photo-1574629810360-7efbbe195018', // basketball
    'photo-1552674605-db6ffd4facb5', // running
  ],
  'fun': [
    'photo-1513151233558-d860c5398176', // confetti
    'photo-1527529482837-4698179dc6ce', // party
    'photo-1492684223066-81342ee5ff30', // fireworks
    'photo-1504674900247-0877df9cc836', // food
    'photo-1496024840928-4c417adf211d', // beach
  ],
};

// Simple hash function to get deterministic index from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Find best matching image based on title keywords
export function findTopicImage(title: string, category: string): string {
  const lowerTitle = title.toLowerCase();

  // Sort keywords by length (descending) so more specific keywords match first
  // e.g., "palestinian" before "film", "hollywood" before "film"
  const sortedKeywords = Object.entries(TOPIC_IMAGES)
    .sort(([a], [b]) => b.length - a.length);

  // Check each topic keyword (most specific first)
  for (const [keyword, photoIds] of sortedKeywords) {
    if (lowerTitle.includes(keyword)) {
      // Use hash of title to deterministically pick an image
      // This ensures same article always gets same image, but different articles get different images
      const index = hashString(title + keyword) % photoIds.length;
      const photoId = photoIds[index];
      return `https://images.unsplash.com/${photoId}?w=800&q=80`;
    }
  }

  // Fall back to category default
  const fallbackIds = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS['world'];
  const index = hashString(title) % fallbackIds.length;
  const photoId = fallbackIds[index];
  return `https://images.unsplash.com/${photoId}?w=800&q=80`;
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
