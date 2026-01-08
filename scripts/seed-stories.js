require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
const cuid = require('cuid');
const { SEED_STORIES, AUTHOR_BIOS } = require('./story-list');

// Google AI configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyBa6JKCsPhEBNZg4rgE-j6bBl2rBXSz2FQ';
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper: Call Google Gemini API
async function callGemini(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Helper: Fetch story from Project Gutenberg
async function fetchFromGutenberg(gutenbergId, storyTitle) {
  console.log(`  Fetching from Gutenberg ID ${gutenbergId}...`);

  try {
    const response = await fetch(`https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.txt`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const fullText = await response.text();

    // Extract the specific story from the collection
    const storyPattern = new RegExp(
      `${storyTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?(?=(?:\\n\\n[A-Z][A-Z\\s]{3,}\\n|END OF|\\*\\*\\* END|$))`,
      'i'
    );

    const match = fullText.match(storyPattern);

    if (!match) {
      console.log(`  Warning: Could not extract "${storyTitle}" specifically. Using cleaned text.`);
      return cleanGutenbergText(fullText);
    }

    return cleanGutenbergText(match[0]);
  } catch (error) {
    console.error(`  Error fetching Gutenberg text: ${error.message}`);
    throw error;
  }
}

// Helper: Clean Gutenberg boilerplate text
function cleanGutenbergText(text) {
  let cleaned = text.replace(/^\*\*\*.*?START OF.*?\*\*\*[\s\S]*?\n\n/i, '');
  cleaned = cleaned.replace(/\n\n.*?END OF.*?\*\*\*[\s\S]*$/i, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();

  // Take first 12000 chars max to avoid token limits
  if (cleaned.length > 12000) {
    cleaned = cleaned.substring(0, 12000);
  }

  return cleaned;
}

// Helper: Parse JSON from AI response
function parseJSON(text) {
  // Remove markdown code blocks if present
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Try to find JSON object/array in the text
  const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]}]/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  return JSON.parse(cleaned);
}

// Helper: Generate leveled content using Gemini
async function generateLeveledContent(originalText, storyInfo) {
  console.log(`  Generating leveled content (A1-C1)...`);

  const prompt = `You are an expert in adapting literature for language learners at different CEFR levels.

Adapt this classic short story for 5 different proficiency levels: A1, A2, B1, B2, and C1.

STORY: "${storyInfo.title}" by ${storyInfo.author}
THEMES: ${storyInfo.themes.join(', ')}

ORIGINAL TEXT:
${originalText.substring(0, 5000)}

Create 5 versions:

**A1 (Beginner):** Very simple vocabulary, present simple tense, short sentences (5-10 words), ~250 words total

**A2 (Elementary):** Simple vocabulary, past simple tense added, slightly longer sentences, ~450 words total

**B1 (Intermediate):** Wider vocabulary, present perfect included, complex sentences, ~700 words total

**B2 (Upper Intermediate):** Rich vocabulary with idioms, all tenses, nuanced descriptions, ~1100 words total

**C1 (Advanced):** Sophisticated vocabulary, literary devices, close to original complexity, ~1800 words total

Return ONLY valid JSON (no markdown, no explanation):
{"A1": "story text...", "A2": "story text...", "B1": "story text...", "B2": "story text...", "C1": "story text..."}`;

  try {
    const responseText = await callGemini(prompt);
    const leveledContent = parseJSON(responseText);

    const requiredLevels = ['A1', 'A2', 'B1', 'B2', 'C1'];
    for (const level of requiredLevels) {
      if (!leveledContent[level]) {
        throw new Error(`Missing level: ${level}`);
      }
    }

    console.log(`  ✓ Generated content for all 5 levels`);
    return leveledContent;
  } catch (error) {
    console.error(`  Error generating leveled content: ${error.message}`);
    throw error;
  }
}

// Helper: Generate exercises for all levels
async function generateExercises(content, storyInfo) {
  console.log(`  Generating exercises for all levels...`);

  const prompt = `Create language learning exercises for this story at 5 CEFR levels (A1, A2, B1, B2, C1).

STORY: "${storyInfo.title}" by ${storyInfo.author}

A1 VERSION: ${content.A1.substring(0, 400)}...
B1 VERSION: ${content.B1.substring(0, 600)}...

For each level create:
1. comprehension: 4 multiple choice questions
2. vocabulary: 5 words with definitions
3. fillInTheBlank: 5 sentences with one blank
4. trueOrFalse: 5 statements
5. discussion: 2 open questions

Return ONLY valid JSON:
{
  "A1": {
    "comprehension": [{"question": "...", "options": ["a", "b", "c", "d"], "correct": 0}],
    "vocabulary": [{"word": "...", "definition": "..."}],
    "fillInTheBlank": [{"sentence": "The ___ was happy.", "answer": "boy"}],
    "trueOrFalse": [{"statement": "...", "correct": true}],
    "discussion": ["What do you think about...?"]
  },
  "A2": {...},
  "B1": {...},
  "B2": {...},
  "C1": {...}
}`;

  try {
    const responseText = await callGemini(prompt);
    const exercises = parseJSON(responseText);
    console.log(`  ✓ Generated exercises for all 5 levels`);
    return exercises;
  } catch (error) {
    console.error(`  Error generating exercises: ${error.message}`);
    throw error;
  }
}

// Helper: Generate vocabulary list
async function generateVocabulary(content) {
  console.log(`  Generating vocabulary list...`);

  const prompt = `Extract 30 important vocabulary words from this story and categorize by CEFR level.

STORY CONTENT:
${content.B1}

Return ONLY a JSON array:
[{"word": "example", "definition": "a thing characteristic of its kind", "level": "B1"}]

Include words useful for language learners at levels A1, A2, B1, B2, and C1.`;

  try {
    const responseText = await callGemini(prompt);
    const vocabulary = parseJSON(responseText);
    console.log(`  ✓ Generated ${vocabulary.length} vocabulary words`);
    return vocabulary;
  } catch (error) {
    console.error(`  Error generating vocabulary: ${error.message}`);
    return []; // Return empty array on error
  }
}

// Helper: Calculate word counts and reading times
function calculateMetrics(content) {
  const metrics = { wordCounts: {}, readTimes: {} };
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const readingSpeeds = { A1: 60, A2: 80, B1: 100, B2: 120, C1: 150 };

  for (const level of levels) {
    const text = content[level] || '';
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    metrics.wordCounts[level] = wordCount;
    metrics.readTimes[level] = Math.ceil(wordCount / readingSpeeds[level]);
  }

  console.log(`  ✓ Word counts:`, metrics.wordCounts);
  return metrics;
}

// Main: Seed a single story
async function seedStory(storyData) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${storyData.title} by ${storyData.author}`);
  console.log(`${'='.repeat(60)}`);

  try {
    // 1. Check if story already exists
    const { data: existing } = await supabase
      .from('Story')
      .select('id')
      .eq('slug', storyData.slug)
      .single();

    if (existing) {
      console.log(`  ⚠ Story already exists. Skipping.`);
      return { success: true, skipped: true };
    }

    // 2. Fetch original text from Gutenberg
    const originalText = await fetchFromGutenberg(storyData.gutenbergId, storyData.title);

    if (!originalText || originalText.length < 100) {
      throw new Error('Fetched text is too short or empty');
    }

    console.log(`  ✓ Fetched ${originalText.length} characters`);

    // 3. Generate leveled content
    const content = await generateLeveledContent(originalText, storyData);

    // 4. Generate exercises
    const exercises = await generateExercises(content, storyData);

    // 5. Generate vocabulary
    const vocabulary = await generateVocabulary(content);

    // 6. Calculate metrics
    const { wordCounts, readTimes } = calculateMetrics(content);

    // 7. Prepare story record
    const storyRecord = {
      id: cuid(),
      slug: storyData.slug,
      title: storyData.title,
      author: storyData.author,
      authorBio: AUTHOR_BIOS[storyData.author] || null,
      category: storyData.category,
      themes: storyData.themes,
      source: 'Project Gutenberg',
      sourceUrl: `https://www.gutenberg.org/ebooks/${storyData.gutenbergId}`,
      heroImage: null,
      content: content,
      exercises: exercises,
      audio: null,
      vocabulary: vocabulary,
      wordCounts: wordCounts,
      readTimes: readTimes,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 8. Insert into database
    console.log(`  Saving to database...`);
    const { data, error } = await supabase
      .from('Story')
      .insert([storyRecord])
      .select();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`  ✓ Successfully saved story!`);
    console.log(`  Story ID: ${data[0].id}`);
    return { success: true, id: data[0].id };

  } catch (error) {
    console.error(`  ✗ Failed to process story: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main: Seed all stories
async function seedAllStories() {
  console.log('\n🌟 Starting Story Seeding Process 🌟\n');
  console.log(`Model: Google Gemini 2.0 Flash`);
  console.log(`Total stories to process: ${SEED_STORIES.length}\n`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < SEED_STORIES.length; i++) {
    const story = SEED_STORIES[i];
    console.log(`\n[${i + 1}/${SEED_STORIES.length}]`);

    const result = await seedStory(story);

    if (result.success) {
      if (result.skipped) {
        skipCount++;
      } else {
        successCount++;
      }
    } else {
      failCount++;
    }

    // Add delay between stories to avoid rate limits
    if (i < SEED_STORIES.length - 1) {
      console.log(`\n  Waiting 3 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Seeding Complete!');
  console.log('='.repeat(60));
  console.log(`✓ Successful: ${successCount}`);
  console.log(`⏭ Skipped: ${skipCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log(`Total: ${SEED_STORIES.length}`);
  console.log('='.repeat(60) + '\n');
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length > 0 && args[0] !== '--all') {
    const slug = args[0];
    const story = SEED_STORIES.find(s => s.slug === slug);

    if (!story) {
      console.error(`Story not found: ${slug}`);
      console.log('\nAvailable slugs:');
      SEED_STORIES.forEach(s => console.log(`  - ${s.slug}`));
      process.exit(1);
    }

    seedStory(story)
      .then((result) => {
        if (result.success) {
          console.log('\n✓ Done!');
          process.exit(0);
        } else {
          console.error('\n✗ Failed:', result.error);
          process.exit(1);
        }
      })
      .catch(error => {
        console.error('\n✗ Error:', error);
        process.exit(1);
      });
  } else {
    seedAllStories()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('\n✗ Fatal error:', error);
        process.exit(1);
      });
  }
}

module.exports = { seedStory, seedAllStories, fetchFromGutenberg };
