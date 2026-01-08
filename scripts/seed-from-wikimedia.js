/**
 * Seed content from Wikimedia APIs
 * Fetches real content from Wikivoyage and Simple Wikipedia
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ========== WIKIVOYAGE FUNCTIONS ==========

async function fetchWikivoyagePage(title) {
  const url = `https://en.wikivoyage.org/w/api.php?` + new URLSearchParams({
    action: 'parse',
    page: title,
    format: 'json',
    origin: '*',
    prop: 'text|sections'
  });

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) throw new Error(data.error.info);
  return data.parse;
}

async function fetchWikivoyageSection(title, sectionIndex) {
  const url = `https://en.wikivoyage.org/w/api.php?` + new URLSearchParams({
    action: 'parse',
    page: title,
    section: sectionIndex.toString(),
    format: 'json',
    origin: '*',
    prop: 'text'
  });

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) throw new Error(data.error.info);
  return data.parse.text['*'];
}

function cleanHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<table[^>]*>[\s\S]*?<\/table>/gi, '')
    .replace(/<div class="(listing|mw-|nav)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\[\d+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapSectionType(title) {
  const t = title.toLowerCase();
  if (t.includes('get in') || t.includes('by plane') || t.includes('by train')) return 'get-in';
  if (t.includes('get around')) return 'get-around';
  if (t === 'see' || t === 'do') return 'see';
  if (t === 'eat') return 'eat';
  if (t === 'drink') return 'drink';
  if (t === 'sleep') return 'sleep';
  if (t === 'buy') return 'buy';
  if (t.includes('understand') || t.includes('stay safe') || t.includes('cope')) return 'tips';
  return null;
}

// Map region based on destination
const destinationRegions = {
  'London': { country: 'United Kingdom', region: 'europe' },
  'Paris': { country: 'France', region: 'europe' },
  'Tokyo': { country: 'Japan', region: 'asia' },
  'New York City': { country: 'United States', region: 'americas' },
  'Sydney': { country: 'Australia', region: 'oceania' },
  'Rome': { country: 'Italy', region: 'europe' },
  'Barcelona': { country: 'Spain', region: 'europe' },
  'Bangkok': { country: 'Thailand', region: 'asia' },
  'Dubai': { country: 'United Arab Emirates', region: 'asia' },
  'Amsterdam': { country: 'Netherlands', region: 'europe' },
};

// Hero images for destinations
const destinationImages = {
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200',
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
  'New York City': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200',
  'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200',
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200',
  'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200',
  'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200',
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
  'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200',
};

async function processDestination(name) {
  console.log(`\nProcessing ${name}...`);

  const page = await fetchWikivoyagePage(name);
  const info = destinationRegions[name] || { country: 'Unknown', region: 'europe' };

  // Find relevant sections
  const relevantSections = [];
  for (const section of page.sections) {
    const sectionType = mapSectionType(section.line);
    if (sectionType && section.level === '2') {
      relevantSections.push({
        title: section.line,
        index: section.index,
        type: sectionType
      });
    }
  }

  console.log(`Found ${relevantSections.length} relevant sections`);

  // Fetch section content
  const sections = [];
  for (const section of relevantSections.slice(0, 6)) { // Limit to 6 sections
    console.log(`  Fetching: ${section.title}`);
    const html = await fetchWikivoyageSection(name, section.index);
    const text = cleanHtml(html);

    if (text.length > 200) {
      // Create level-adapted content (simplified version - in production use AI)
      const content = createLevelContent(text);
      const wordCounts = {
        A1: content.A1.split(' ').length,
        A2: content.A2.split(' ').length,
        B1: content.B1.split(' ').length,
        B2: content.B2.split(' ').length,
        C1: content.C1.split(' ').length,
      };

      sections.push({
        slug: section.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        title: section.title,
        sectionType: section.type,
        orderIndex: sections.length + 1,
        content,
        exercises: createExercises(text, section.title),
        vocabulary: extractVocabulary(text),
        wordCounts,
        readTimes: {
          A1: Math.ceil(wordCounts.A1 / 150),
          A2: Math.ceil(wordCounts.A2 / 150),
          B1: Math.ceil(wordCounts.B1 / 180),
          B2: Math.ceil(wordCounts.B2 / 200),
          C1: Math.ceil(wordCounts.C1 / 220),
        }
      });
    }
  }

  return {
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    wikiTitle: name,
    name,
    country: info.country,
    region: info.region,
    heroImage: destinationImages[name],
    description: `Explore ${name}, ${info.country} with level-adapted travel guides.`,
    sections
  };
}

function createLevelContent(text) {
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  // A1: Very simple, first 3-4 short sentences
  const a1Sentences = sentences.slice(0, 4).map(s =>
    s.split(',')[0].trim() // Take only first clause
  ).filter(s => s.length < 100);

  // A2: Simple, first 6-8 sentences
  const a2Sentences = sentences.slice(0, 8).map(s => s.trim());

  // B1: Moderate, first 12 sentences
  const b1Sentences = sentences.slice(0, 12).map(s => s.trim());

  // B2: Fuller content
  const b2Sentences = sentences.slice(0, 18).map(s => s.trim());

  // C1: Full content
  const c1Sentences = sentences.slice(0, 25).map(s => s.trim());

  return {
    A1: a1Sentences.join(' ') || sentences[0],
    A2: a2Sentences.join(' ') || text.substring(0, 500),
    B1: b1Sentences.join(' ') || text.substring(0, 800),
    B2: b2Sentences.join(' ') || text.substring(0, 1200),
    C1: c1Sentences.join(' ') || text.substring(0, 1800),
  };
}

function createExercises(text, title) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

  return {
    A1: {
      comprehension: [{
        question: `What is this section about?`,
        options: [title, 'Food', 'Weather', 'Sports'],
        correct: 0
      }],
      trueOrFalse: [{
        statement: `This section gives information about ${title.toLowerCase()}.`,
        correct: true
      }]
    },
    A2: {
      comprehension: [{
        question: `What is the main topic of this section?`,
        options: [title, 'History', 'Culture', 'Politics'],
        correct: 0
      }]
    },
    B1: {
      comprehension: [{
        question: `What practical information does this section provide?`,
        options: [`Information about ${title.toLowerCase()}`, 'Recipes', 'Movie reviews', 'Sports scores'],
        correct: 0
      }]
    },
    B2: {
      discussion: [
        `What aspects of ${title.toLowerCase()} would be most important for a traveler?`,
        `How might this information differ in other cities?`
      ]
    },
    C1: {
      discussion: [
        `Analyze the practical implications of the information provided in this section.`,
        `How does this compare to similar information for other major cities?`
      ]
    }
  };
}

function extractVocabulary(text) {
  // Common travel vocabulary that might appear
  const travelWords = {
    'airport': { definition: 'A place where airplanes take off and land', level: 'A1' },
    'train': { definition: 'A vehicle that runs on rails', level: 'A1' },
    'bus': { definition: 'A large vehicle that carries passengers', level: 'A1' },
    'taxi': { definition: 'A car you pay to take you places', level: 'A1' },
    'hotel': { definition: 'A place to stay when traveling', level: 'A1' },
    'restaurant': { definition: 'A place to eat food', level: 'A1' },
    'museum': { definition: 'A building where art or history is displayed', level: 'A2' },
    'monument': { definition: 'A structure built to remember a person or event', level: 'A2' },
    'underground': { definition: 'A railway system that runs below ground', level: 'A2' },
    'departure': { definition: 'When you leave a place', level: 'B1' },
    'arrival': { definition: 'When you reach a place', level: 'B1' },
    'terminal': { definition: 'A building at an airport or station', level: 'B1' },
    'accommodation': { definition: 'A place to stay', level: 'B2' },
    'itinerary': { definition: 'A plan of a journey', level: 'B2' },
    'excursion': { definition: 'A short trip for pleasure', level: 'B2' },
  };

  const vocab = [];
  const textLower = text.toLowerCase();

  for (const [word, info] of Object.entries(travelWords)) {
    if (textLower.includes(word)) {
      vocab.push({ word, ...info });
    }
  }

  return vocab.slice(0, 10);
}

// ========== SIMPLE WIKIPEDIA FUNCTIONS ==========

async function fetchSimpleWikipedia(title) {
  const url = `https://simple.wikipedia.org/w/api.php?` + new URLSearchParams({
    action: 'parse',
    page: title,
    format: 'json',
    origin: '*',
    prop: 'text|categories|images'
  });

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) throw new Error(data.error.info);
  return data.parse;
}

const exploreArticles = [
  { title: 'Albert Einstein', category: 'people' },
  { title: 'Marie Curie', category: 'people' },
  { title: 'Leonardo da Vinci', category: 'people' },
  { title: 'Great Wall of China', category: 'places' },
  { title: 'Eiffel Tower', category: 'places' },
  { title: 'Grand Canyon', category: 'places' },
  { title: 'Solar System', category: 'science' },
  { title: 'DNA', category: 'science' },
  { title: 'Electricity', category: 'science' },
  { title: 'World War II', category: 'history' },
  { title: 'Ancient Rome', category: 'history' },
  { title: 'Renaissance', category: 'history' },
  { title: 'Olympic Games', category: 'culture' },
  { title: 'Jazz', category: 'culture' },
  { title: 'Shakespeare', category: 'culture' },
];

const exploreImages = {
  'Albert Einstein': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/800px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg',
  'Marie Curie': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c._1920s.jpg/800px-Marie_Curie_c._1920s.jpg',
  'Leonardo da Vinci': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Leonardo_self.jpg/800px-Leonardo_self.jpg',
  'Great Wall of China': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200',
  'Eiffel Tower': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=1200',
  'Grand Canyon': 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=1200',
  'Solar System': 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1200',
  'DNA': 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=1200',
  'Electricity': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200',
  'World War II': 'https://images.unsplash.com/photo-1580130379624-3a069adbffc5?w=1200',
  'Ancient Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200',
  'Renaissance': 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200',
  'Olympic Games': 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=1200',
  'Jazz': 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200',
  'Shakespeare': 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1200',
};

async function processExploreArticle(title, category) {
  console.log(`\nProcessing ${title}...`);

  const page = await fetchSimpleWikipedia(title);
  const text = cleanHtml(page.text['*']);

  if (text.length < 200) {
    console.log(`  Skipping - content too short`);
    return null;
  }

  // Create level-adapted content
  const content = createLevelContent(text);
  const wordCounts = {
    A1: content.A1.split(' ').length,
    A2: content.A2.split(' ').length,
    B1: content.B1.split(' ').length,
    B2: content.B2.split(' ').length,
    C1: content.C1.split(' ').length,
  };

  // Extract first sentence as excerpt
  const firstSentence = text.match(/^[^.!?]+[.!?]/)?.[0] || text.substring(0, 150);

  return {
    slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    wikiTitle: title,
    title,
    category,
    heroImage: exploreImages[title],
    excerpt: firstSentence.trim(),
    content,
    exercises: createExploreExercises(text, title),
    vocabulary: extractExploreVocabulary(text, category),
    wordCounts,
    readTimes: {
      A1: Math.max(1, Math.ceil(wordCounts.A1 / 150)),
      A2: Math.max(1, Math.ceil(wordCounts.A2 / 150)),
      B1: Math.max(1, Math.ceil(wordCounts.B1 / 180)),
      B2: Math.max(2, Math.ceil(wordCounts.B2 / 200)),
      C1: Math.max(2, Math.ceil(wordCounts.C1 / 220)),
    }
  };
}

function createExploreExercises(text, title) {
  return {
    A1: {
      comprehension: [{
        question: `What is this article about?`,
        options: [title, 'A recipe', 'A movie', 'A song'],
        correct: 0
      }],
      trueOrFalse: [{
        statement: `This article is about ${title}.`,
        correct: true
      }]
    },
    A2: {
      comprehension: [{
        question: `What is the main topic?`,
        options: [title, 'Sports', 'Weather', 'Food'],
        correct: 0
      }]
    },
    B1: {
      comprehension: [{
        question: `What can you learn from this article?`,
        options: [`About ${title}`, 'How to cook', 'How to drive', 'How to swim'],
        correct: 0
      }],
      discussion: [`Why is ${title} important?`]
    },
    B2: {
      discussion: [
        `What are the most interesting facts about ${title}?`,
        `How has ${title} influenced the world?`
      ]
    },
    C1: {
      discussion: [
        `Analyze the significance of ${title} in broader context.`,
        `What are some common misconceptions about ${title}?`
      ]
    }
  };
}

function extractExploreVocabulary(text, category) {
  const vocabByCategory = {
    people: {
      'scientist': { definition: 'A person who studies science', level: 'A2' },
      'artist': { definition: 'A person who creates art', level: 'A2' },
      'inventor': { definition: 'A person who creates new things', level: 'B1' },
      'discovery': { definition: 'Finding something new', level: 'B1' },
      'achievement': { definition: 'Something you succeed at', level: 'B2' },
    },
    places: {
      'landmark': { definition: 'A famous building or place', level: 'A2' },
      'ancient': { definition: 'Very old', level: 'B1' },
      'magnificent': { definition: 'Very impressive and beautiful', level: 'B2' },
      'heritage': { definition: 'Things from the past that are important', level: 'B2' },
    },
    science: {
      'experiment': { definition: 'A test to learn something', level: 'A2' },
      'theory': { definition: 'An idea that explains something', level: 'B1' },
      'research': { definition: 'Careful study to find facts', level: 'B1' },
      'phenomenon': { definition: 'Something that happens in nature', level: 'B2' },
    },
    history: {
      'war': { definition: 'A fight between countries', level: 'A1' },
      'empire': { definition: 'A group of countries ruled by one leader', level: 'B1' },
      'civilization': { definition: 'An advanced society', level: 'B2' },
      'revolution': { definition: 'A big change in how things are done', level: 'B2' },
    },
    culture: {
      'tradition': { definition: 'A custom passed down through time', level: 'A2' },
      'ceremony': { definition: 'A formal event', level: 'B1' },
      'influence': { definition: 'The power to affect something', level: 'B1' },
      'artistic': { definition: 'Related to art', level: 'B2' },
    }
  };

  const vocab = [];
  const textLower = text.toLowerCase();
  const categoryVocab = vocabByCategory[category] || {};

  for (const [word, info] of Object.entries(categoryVocab)) {
    if (textLower.includes(word)) {
      vocab.push({ word, ...info });
    }
  }

  return vocab.slice(0, 8);
}

// ========== MAIN SEEDING FUNCTIONS ==========

async function seedDestinations() {
  console.log('\n========== SEEDING TRAVEL DESTINATIONS ==========');

  const destinations = ['London', 'Paris', 'Tokyo', 'New York City', 'Sydney', 'Rome', 'Barcelona', 'Bangkok'];

  for (const name of destinations) {
    try {
      const data = await processDestination(name);

      // Upsert destination
      const { data: dest, error: destError } = await supabase
        .from('Destination')
        .upsert({
          slug: data.slug,
          wikiTitle: data.wikiTitle,
          name: data.name,
          country: data.country,
          region: data.region,
          heroImage: data.heroImage,
          description: data.description,
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (destError) {
        console.error(`Error seeding ${name}:`, destError.message);
        continue;
      }

      console.log(`Seeded destination: ${name} (${data.sections.length} sections)`);

      // Upsert sections
      for (const section of data.sections) {
        const { error: sectionError } = await supabase
          .from('DestinationSection')
          .upsert({
            ...section,
            destinationId: dest.id,
          }, { onConflict: 'destinationId,slug' });

        if (sectionError) {
          console.error(`  Error seeding section ${section.title}:`, sectionError.message);
        } else {
          console.log(`  Seeded section: ${section.title}`);
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.error(`Error processing ${name}:`, err.message);
    }
  }
}

async function seedExploreArticles() {
  console.log('\n========== SEEDING EXPLORE ARTICLES ==========');

  for (const { title, category } of exploreArticles) {
    try {
      const data = await processExploreArticle(title, category);

      if (!data) continue;

      const { error } = await supabase
        .from('ExploreArticle')
        .upsert(data, { onConflict: 'slug' });

      if (error) {
        console.error(`Error seeding ${title}:`, error.message);
      } else {
        console.log(`Seeded article: ${title} (${data.wordCounts.B1} words at B1)`);
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.error(`Error processing ${title}:`, err.message);
    }
  }
}

async function main() {
  console.log('Starting Wikimedia content seeding...\n');

  await seedDestinations();
  await seedExploreArticles();

  console.log('\n========== SEEDING COMPLETE ==========');
}

main().catch(console.error);
