# Story Seeding Documentation

This guide explains how to seed classic short stories into your language learning platform.

## Overview

The story seeding system automatically:
1. Fetches public domain stories from Project Gutenberg
2. Generates leveled content (A1-C1) using Claude AI
3. Creates comprehension exercises for each level
4. Extracts and categorizes vocabulary
5. Calculates word counts and reading times
6. Stores everything in your Supabase database

## Files

- **story-list.js** - Curated list of 20 filter-safe stories
- **seed-stories.js** - Main seeding script with Gutenberg integration
- **STORIES-README.md** - This documentation

## Prerequisites

1. **Environment Variables** (in `.env.local`):
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Dependencies**:
   ```bash
   npm install @anthropic-ai/sdk @supabase/supabase-js dotenv
   ```

3. **Database**: Ensure your Story table is created (run Prisma migrations)

## Usage

### Seed All Stories

To seed all 20 stories:

```bash
node scripts/seed-stories.js
```

**Note**: This will take 60-90 minutes as each story requires:
- Fetching from Gutenberg (~2-5 seconds)
- AI content generation (~30-60 seconds)
- AI exercise generation (~30-60 seconds)
- AI vocabulary extraction (~15-30 seconds)
- 3-second delay between stories

**Estimated cost**: ~$2-5 in Claude API credits for all 20 stories

### Seed a Single Story

To test with one story or seed specific stories:

```bash
node scripts/seed-stories.js the-gift-of-the-magi
```

Available slugs:
- `the-gift-of-the-magi`
- `the-last-leaf`
- `the-ransom-of-red-chief`
- `the-cop-and-the-anthem`
- `a-retrieved-reformation`
- `the-happy-prince`
- `the-selfish-giant`
- `the-nightingale-and-the-rose`
- `the-bet`
- `a-day-in-the-country`
- `the-lottery-ticket`
- `the-red-headed-league`
- `a-scandal-in-bohemia`
- `the-celebrated-jumping-frog`
- `the-open-window`
- `rikki-tikki-tavi`
- `the-story-of-an-hour`
- `the-garden-party`
- `miss-brill`
- `the-necklace`

## Story Categories

Stories are organized into 6 categories:

1. **Mystery** - Detective stories (Sherlock Holmes)
2. **Love** - Romantic stories with heart
3. **Humor** - Funny, lighthearted tales
4. **Moral Tales** - Stories with lessons
5. **Adventure** - Action and bravery
6. **Slice of Life** - Everyday human experiences

## Content Structure

Each story includes:

### Leveled Content (5 levels)
- **A1** (Beginner): 200-300 words, simple vocabulary
- **A2** (Elementary): 400-500 words, basic grammar
- **B1** (Intermediate): 600-800 words, mixed tenses
- **B2** (Upper Intermediate): 1000-1200 words, rich vocabulary
- **C1** (Advanced): 1500-2000 words, literary devices

### Exercises (per level)
- **Comprehension**: 3-5 multiple-choice questions
- **Vocabulary**: 5 key words with definitions
- **Fill in the Blank**: 5 sentences
- **True or False**: 5 statements
- **Discussion**: 2-3 reflection questions

### Metadata
- Word counts per level
- Reading times per level (adjusted by proficiency)
- 30-50 vocabulary words categorized by CEFR level
- Author biography
- Themes and categories

## Troubleshooting

### Story Already Exists
```
⚠ Story already exists. Skipping.
```
The script automatically skips stories that are already in the database.

### Gutenberg Fetch Failed
```
Error fetching Gutenberg text: Failed to fetch: 404
```
- Check if the Gutenberg ID is correct
- Try accessing the URL manually: `https://www.gutenberg.org/cache/epub/{ID}/pg{ID}.txt`
- Some stories may be in collections; the script tries to extract them automatically

### AI Generation Failed
```
Error generating leveled content: ...
```
- Check your Anthropic API key
- Ensure you have API credits
- Check for rate limits (script includes 3-second delays)

### Database Error
```
Database error: ...
```
- Verify Supabase credentials in `.env.local`
- Check that the Story table exists
- Ensure SUPABASE_SERVICE_ROLE_KEY is set (not just anon key)

## Output Example

```
============================================================
Processing: The Gift of the Magi by O. Henry
============================================================
  Fetching from Gutenberg ID 7256...
  ✓ Fetched 3456 characters
  Generating leveled content (A1-C1)...
  ✓ Generated content for all 5 levels
  Generating exercises for all levels...
  ✓ Generated exercises for all 5 levels
  Generating vocabulary list...
  ✓ Generated 42 vocabulary words
  ✓ Calculated metrics: {
    wordCounts: { A1: 287, A2: 456, B1: 743, B2: 1124, C1: 1876 },
    readTimes: { A1: 5, A2: 6, B1: 8, B2: 10, C1: 13 }
  }
  Saving to database...
  ✓ Successfully saved story!
  Story ID: clx1234567890abcdef

  Waiting 3 seconds before next story...
```

## Adding More Stories

To add more stories to the list:

1. Open `scripts/story-list.js`
2. Add a new entry to `SEED_STORIES`:
   ```javascript
   {
     slug: "your-story-slug",
     title: "Your Story Title",
     author: "Author Name",
     gutenbergId: 12345, // Find this on gutenberg.org
     category: "mystery", // mystery, love, humor, moral, adventure, slice-of-life
     themes: ["theme1", "theme2"],
     description: "Brief description for learners.",
     readingLevel: "B1" // Suggested base level
   }
   ```
3. If it's a new author, add their bio to `AUTHOR_BIOS`
4. Run the seed script

## Safety Notes

All 20 stories in the default list are:
- Public domain (authors died 70+ years ago)
- Family-friendly themes
- No violent, dark, or triggering content
- Appropriate for language learners of all ages
- Filter-safe (no profanity or adult themes)

## Next Steps

After seeding stories, you'll want to:

1. **Create Story UI Components**:
   - Story list page (`/app/stories/page.tsx`)
   - Story detail page (`/app/stories/[slug]/page.tsx`)
   - Story card component
   - Exercise components

2. **Add Audio** (optional):
   - Use text-to-speech API (ElevenLabs, Google TTS, etc.)
   - Generate audio for each level
   - Update audio field in database

3. **Add Hero Images** (optional):
   - Find public domain images
   - Generate AI images
   - Update heroImage field

4. **Create Category Pages**:
   - `/app/stories/category/[slug]/page.tsx`
   - Filter stories by category

## API Endpoints

The following API routes are already set up:

- `GET /api/stories` - List all stories (with optional category filter)
- `GET /api/stories/[slug]` - Get single story with full content

Example usage:
```javascript
// Get all stories
const response = await fetch('/api/stories');
const stories = await response.json();

// Get stories by category
const response = await fetch('/api/stories?category=mystery');

// Get single story
const response = await fetch('/api/stories/the-gift-of-the-magi');
const story = await response.json();
```

## Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify all environment variables are set correctly
3. Test with a single story first before seeding all
4. Check Anthropic API usage and credits

Happy seeding! 📚✨
