/**
 * Simple Wikipedia Content Fetcher
 *
 * Fetches articles from Simple English Wikipedia API
 * Usage: node scripts/fetch-simple-wikipedia.js <article-title>
 * Example: node scripts/fetch-simple-wikipedia.js "Albert Einstein"
 */

const SIMPLE_WIKI_API = 'https://simple.wikipedia.org/w/api.php';

/**
 * Fetch an article from Simple Wikipedia
 */
async function fetchArticle(articleTitle) {
  const url = `${SIMPLE_WIKI_API}?` + new URLSearchParams({
    action: 'parse',
    page: articleTitle,
    format: 'json',
    origin: '*',
    prop: 'text|categories|images',
  });

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(`Wikipedia API error: ${data.error.info}`);
  }

  return {
    title: data.parse.title,
    html: data.parse.text['*'],
    categories: data.parse.categories || [],
    images: data.parse.images || [],
  };
}

/**
 * Search for articles
 */
async function searchArticles(query, limit = 10) {
  const url = `${SIMPLE_WIKI_API}?` + new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    srlimit: limit.toString(),
    format: 'json',
    origin: '*',
  });

  const response = await fetch(url);
  const data = await response.json();

  return data.query.search.map(result => ({
    title: result.title,
    snippet: result.snippet.replace(/<[^>]+>/g, ''),
  }));
}

/**
 * Get featured/good articles
 */
async function getFeaturedArticles(limit = 50) {
  const url = `${SIMPLE_WIKI_API}?` + new URLSearchParams({
    action: 'query',
    list: 'categorymembers',
    cmtitle: 'Category:Very_good_articles',
    cmlimit: limit.toString(),
    format: 'json',
    origin: '*',
  });

  const response = await fetch(url);
  const data = await response.json();

  return data.query.categorymembers.map(m => m.title);
}

/**
 * Clean HTML content to plain text
 */
function cleanHtml(html) {
  // Remove infoboxes, tables, and other non-content elements
  let text = html
    .replace(/<table[^>]*>[\s\S]*?<\/table>/gi, '')
    .replace(/<div class="infobox[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="navbox[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '') // Remove superscript references
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\[\d+\]/g, '') // Remove reference numbers
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

/**
 * Determine article category from Wikipedia categories
 */
function determineCategory(categories) {
  const categoryNames = categories.map(c => c['*'].toLowerCase());

  // People
  if (categoryNames.some(c =>
    c.includes('births') ||
    c.includes('deaths') ||
    c.includes('people') ||
    c.includes('actors') ||
    c.includes('musicians') ||
    c.includes('scientists') ||
    c.includes('politicians')
  )) {
    return 'people';
  }

  // Places
  if (categoryNames.some(c =>
    c.includes('countries') ||
    c.includes('cities') ||
    c.includes('geography') ||
    c.includes('landmarks') ||
    c.includes('buildings')
  )) {
    return 'places';
  }

  // Science
  if (categoryNames.some(c =>
    c.includes('science') ||
    c.includes('biology') ||
    c.includes('physics') ||
    c.includes('chemistry') ||
    c.includes('animals') ||
    c.includes('plants') ||
    c.includes('technology')
  )) {
    return 'science';
  }

  // History
  if (categoryNames.some(c =>
    c.includes('history') ||
    c.includes('wars') ||
    c.includes('ancient') ||
    c.includes('medieval') ||
    c.includes('century')
  )) {
    return 'history';
  }

  // Culture
  if (categoryNames.some(c =>
    c.includes('culture') ||
    c.includes('art') ||
    c.includes('music') ||
    c.includes('literature') ||
    c.includes('food') ||
    c.includes('religion') ||
    c.includes('sports')
  )) {
    return 'culture';
  }

  return 'culture'; // Default
}

/**
 * Get first image from article
 */
function getHeroImage(images) {
  // Filter out common non-content images
  const contentImages = images.filter(img => {
    const name = img.toLowerCase();
    return !name.includes('icon') &&
           !name.includes('logo') &&
           !name.includes('flag') &&
           !name.includes('commons-logo') &&
           !name.includes('wikibooks') &&
           !name.includes('wikiquote');
  });

  if (contentImages.length > 0) {
    // Return Wikimedia Commons URL for the image
    const imageName = contentImages[0];
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageName)}?width=800`;
  }

  return null;
}

/**
 * Generate an excerpt from the content
 */
function generateExcerpt(text, maxLength = 200) {
  // Get first paragraph-worth of text
  const firstParagraph = text.split('.').slice(0, 2).join('.') + '.';

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, maxLength - 3) + '...';
}

/**
 * Main function to fetch and process an article
 */
async function processArticle(articleTitle) {
  console.log(`Fetching "${articleTitle}" from Simple Wikipedia...`);

  const article = await fetchArticle(articleTitle);
  const cleanText = cleanHtml(article.html);

  console.log(`Article length: ${cleanText.length} characters`);

  return {
    title: article.title,
    wikiTitle: article.title,
    category: determineCategory(article.categories),
    heroImage: getHeroImage(article.images),
    excerpt: generateExcerpt(cleanText),
    rawText: cleanText,
    categories: article.categories.map(c => c['*']),
  };
}

// CLI usage
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'search') {
    const query = process.argv[3];
    if (!query) {
      console.log('Usage: node scripts/fetch-simple-wikipedia.js search <query>');
      process.exit(1);
    }

    searchArticles(query)
      .then(results => {
        console.log('\n=== Search Results ===');
        results.forEach((r, i) => {
          console.log(`${i + 1}. ${r.title}`);
          console.log(`   ${r.snippet}\n`);
        });
      })
      .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
      });
  } else if (command === 'featured') {
    getFeaturedArticles()
      .then(articles => {
        console.log('\n=== Featured Articles ===');
        articles.forEach((title, i) => {
          console.log(`${i + 1}. ${title}`);
        });
      })
      .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
      });
  } else {
    const articleTitle = command || process.argv[2];

    if (!articleTitle) {
      console.log('Usage:');
      console.log('  node scripts/fetch-simple-wikipedia.js <article-title>');
      console.log('  node scripts/fetch-simple-wikipedia.js search <query>');
      console.log('  node scripts/fetch-simple-wikipedia.js featured');
      console.log('');
      console.log('Examples:');
      console.log('  node scripts/fetch-simple-wikipedia.js "Albert Einstein"');
      console.log('  node scripts/fetch-simple-wikipedia.js search "world war"');
      process.exit(1);
    }

    processArticle(articleTitle)
      .then(data => {
        console.log('\n=== Article Data ===');
        console.log(JSON.stringify(data, null, 2));
      })
      .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
      });
  }
}

module.exports = { fetchArticle, searchArticles, getFeaturedArticles, processArticle };
