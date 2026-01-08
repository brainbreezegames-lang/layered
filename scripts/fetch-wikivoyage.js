/**
 * Wikivoyage Content Fetcher
 *
 * Fetches travel destination content from Wikivoyage API
 * Usage: node scripts/fetch-wikivoyage.js <destination-name>
 * Example: node scripts/fetch-wikivoyage.js London
 */

const WIKIVOYAGE_API = 'https://en.wikivoyage.org/w/api.php';

/**
 * Fetch a destination page from Wikivoyage
 */
async function fetchDestination(destinationName) {
  const url = `${WIKIVOYAGE_API}?` + new URLSearchParams({
    action: 'parse',
    page: destinationName,
    format: 'json',
    origin: '*',
    prop: 'text|sections|categories',
  });

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(`Wikivoyage API error: ${data.error.info}`);
  }

  return {
    title: data.parse.title,
    html: data.parse.text['*'],
    sections: data.parse.sections,
    categories: data.parse.categories,
  };
}

/**
 * Fetch a specific section of a destination
 */
async function fetchSection(destinationName, sectionIndex) {
  const url = `${WIKIVOYAGE_API}?` + new URLSearchParams({
    action: 'parse',
    page: destinationName,
    section: sectionIndex.toString(),
    format: 'json',
    origin: '*',
    prop: 'text',
  });

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(`Wikivoyage API error: ${data.error.info}`);
  }

  return data.parse.text['*'];
}

/**
 * Clean HTML content to plain text
 */
function cleanHtml(html) {
  // Remove HTML tags
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\[\d+\]/g, '') // Remove reference numbers like [1]
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

/**
 * Map Wikivoyage section titles to our section types
 */
function mapSectionType(sectionTitle) {
  const title = sectionTitle.toLowerCase();

  if (title.includes('get in') || title.includes('by plane') || title.includes('by train')) {
    return 'get-in';
  }
  if (title.includes('get around')) {
    return 'get-around';
  }
  if (title.includes('see') || title.includes('do')) {
    return 'see';
  }
  if (title.includes('eat')) {
    return 'eat';
  }
  if (title.includes('drink')) {
    return 'drink';
  }
  if (title.includes('sleep') || title.includes('stay')) {
    return 'sleep';
  }
  if (title.includes('buy') || title.includes('shop')) {
    return 'buy';
  }
  if (title.includes('understand') || title.includes('stay safe') || title.includes('cope')) {
    return 'tips';
  }

  return 'tips';
}

/**
 * Determine region from destination
 */
function determineRegion(categories) {
  const categoryNames = categories.map(c => c['*'].toLowerCase());

  if (categoryNames.some(c => c.includes('europe'))) return 'europe';
  if (categoryNames.some(c => c.includes('asia'))) return 'asia';
  if (categoryNames.some(c => c.includes('north america') || c.includes('south america') || c.includes('central america'))) return 'americas';
  if (categoryNames.some(c => c.includes('africa') || c.includes('middle east'))) return 'africa';
  if (categoryNames.some(c => c.includes('oceania') || c.includes('australia'))) return 'oceania';

  return 'europe'; // Default
}

/**
 * Main function to fetch and process a destination
 */
async function processDestination(destinationName) {
  console.log(`Fetching ${destinationName} from Wikivoyage...`);

  const destination = await fetchDestination(destinationName);

  console.log(`Found ${destination.sections.length} sections`);

  // Filter to main travel sections
  const travelSections = destination.sections.filter(s => {
    const title = s.line.toLowerCase();
    return (
      title.includes('get in') ||
      title.includes('get around') ||
      title.includes('see') ||
      title.includes('do') ||
      title.includes('eat') ||
      title.includes('drink') ||
      title.includes('sleep') ||
      title.includes('buy') ||
      title.includes('understand') ||
      title.includes('stay safe')
    );
  });

  console.log(`Processing ${travelSections.length} travel sections...`);

  const sections = [];

  for (const section of travelSections) {
    const html = await fetchSection(destinationName, section.index);
    const text = cleanHtml(html);

    if (text.length > 100) { // Only include sections with meaningful content
      sections.push({
        title: section.line,
        sectionType: mapSectionType(section.line),
        orderIndex: sections.length + 1,
        rawText: text,
      });
    }
  }

  return {
    name: destination.title,
    wikiTitle: destination.title,
    region: determineRegion(destination.categories),
    sections,
  };
}

// CLI usage
if (require.main === module) {
  const destinationName = process.argv[2];

  if (!destinationName) {
    console.log('Usage: node scripts/fetch-wikivoyage.js <destination-name>');
    console.log('Example: node scripts/fetch-wikivoyage.js London');
    process.exit(1);
  }

  processDestination(destinationName)
    .then(data => {
      console.log('\n=== Destination Data ===');
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { fetchDestination, fetchSection, processDestination };
