import { Level } from "@/types";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function generateWithAI(prompt: string, systemPrompt: string = ""): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY not set");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://layered-app.vercel.app",
      "X-Title": "Layered",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-lite-preview-09-2025",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenRouter error:', response.status, errorText);
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

const LEVEL_GUIDELINES: Record<Level, string> = {
  A1: `
- Use ONLY the 500 most common English words
- Maximum 8 words per sentence
- Use ONLY present tense (no past, no future, no perfect tenses)
- No idioms, phrasal verbs, or slang
- No passive voice
- Simple subject-verb-object structure
- Repeat important words for reinforcement
- Keep ALL the information from the original - do NOT remove facts
- Target length: SAME as original (400-500 words) - make language simpler, NOT shorter`,
  A2: `
- Use ONLY the 1,000 most common English words
- Maximum 12 words per sentence
- Use present tense and simple past tense
- No idioms or phrasal verbs
- Avoid passive voice when possible
- Simple and compound sentences only
- Keep ALL information from the original
- Target length: SAME as original (400-500 words) - simpler language, not shorter`,
  B1: `
- Use the 2,000 most common English words
- Average 15 words per sentence
- All common tenses allowed (present, past, future, present perfect)
- Simple phrasal verbs allowed (look up, find out, etc.)
- Compound and some complex sentences allowed
- Keep ALL information from the original
- Target length: SAME as original (400-600 words)`,
  B2: `
- Use up to 4,000 common words
- Natural sentence length variation
- All tenses and aspects allowed
- Idioms and phrasal verbs allowed
- Complex sentences allowed
- Passive voice is fine
- Keep ALL information and nuance from the original
- Target length: SAME as original (500-700 words)`,
  C1: `
- Preserve sophisticated vocabulary
- Keep complex sentence structures
- Maintain idiomatic expressions
- Keep nuanced meanings
- This should read like native-level journalism
- Make minimal changes - only simplify truly obscure words or unclear constructions
- Target length: SAME as original (500-800 words)`,
};

export async function generateLevelVersion(originalText: string, level: Level): Promise<string> {
  const prompt = `
Adapt this article to ${level} level. Keep the SAME length and ALL information.
Do NOT summarize. Do NOT shorten. Make the LANGUAGE simpler, not the content.

RULES FOR ${level}:
${LEVEL_GUIDELINES[level]}

CRITICAL:
- The output MUST be approximately the same word count as the original
- Keep ALL facts and information - do not remove anything
- Make it sound natural, like real journalism
- Do NOT include any preamble or explanations
- Do NOT add a title or heading - just the article body paragraphs
- Output ONLY the adapted article text

ORIGINAL ARTICLE:
${originalText}

OUTPUT (${level} LEVEL):`;

  const systemPrompt = `You are an expert at adapting English text for ${level} learners. The goal is to make text READABLE for that level, NOT SHORTER. All levels should be the same length - the difference is language complexity, not length.`;

  return await generateWithAI(prompt, systemPrompt);
}

export async function generateAllLevels(originalText: string): Promise<Record<Level, string>> {
  const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];

  // Generate sequentially with delays to avoid rate limiting
  console.log("Generating all level versions sequentially...");
  const versions: Record<Level, string> = {} as Record<Level, string>;

  for (const level of levels) {
    const text = await generateLevelVersion(originalText, level);
    console.log(`✓ ${level} version done`);
    versions[level] = text;

    // Add 2 second delay between requests to avoid rate limiting
    if (level !== "C1") {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return versions;
}

export async function generateLevelHeadlines(
  originalTitle: string,
  originalSubtitle: string,
  levelVersions: Record<Level, string>
): Promise<{ titles: Record<Level, string>; subtitles: Record<Level, string> }> {
  const prompt = `
You are a New York Times headline editor. Create SHORT, punchy newspaper headlines.

ORIGINAL: ${originalTitle}

CRITICAL RULES - HEADLINES MUST BE SHORT:
- Title: MAXIMUM 10 words (shorter is better)
- Subtitle: MAXIMUM 15 words
- Drop articles (a, the, an) when possible
- Use active voice, strong verbs
- Think newspaper front page, NOT article text

EXAMPLES OF GOOD HEADLINES:
✓ "Gaza Girl's Voice Featured in Film" (6 words)
✓ "Documentary Uses Child's Final Call" (5 words)
✓ "Film Captures Girl's Plea for Help" (6 words)

BAD - TOO LONG:
✗ "A Palestinian director made a film based on a girl's pleas" (11 words - too long!)
✗ Long detailed sentences explaining the whole story

A1: Title 5-6 words | Subtitle 8-10 words | Simple words only
A2: Title 6-7 words | Subtitle 10-12 words | Common words
B1: Title 6-8 words | Subtitle 12-14 words | Clear language
B2: Title 7-9 words | Subtitle 13-15 words | Sophisticated
C1: Title 7-10 words | Subtitle 13-15 words | Refined language

Return ONLY valid JSON (no markdown):
{
  "A1": {"title": "...", "subtitle": "..."},
  "A2": {"title": "...", "subtitle": "..."},
  "B1": {"title": "...", "subtitle": "..."},
  "B2": {"title": "...", "subtitle": "..."},
  "C1": {"title": "...", "subtitle": "..."}
}`;

  const systemPrompt = `You create SHORT newspaper headlines. Never write long sentences. Always return valid JSON.`;

  const response = await generateWithAI(prompt, systemPrompt);

  // Parse JSON response
  const parsed = JSON.parse(response.trim());

  const titles: Record<Level, string> = {} as Record<Level, string>;
  const subtitles: Record<Level, string> = {} as Record<Level, string>;

  for (const level of ["A1", "A2", "B1", "B2", "C1"] as Level[]) {
    titles[level] = parsed[level].title;
    subtitles[level] = parsed[level].subtitle;
  }

  return { titles, subtitles };
}

export async function generateExercises(articleText: string, level: Level): Promise<unknown> {
  const prompt = `
Based on this ${level}-level English article, generate 6 types of exercises.

ARTICLE:
${articleText}

Generate exercises in this exact JSON format:
{
  "comprehension": [
    {
      "id": "1",
      "question": "What is the main topic of this article?",
      "options": [
        { "id": "a", "text": "Option one" },
        { "id": "b", "text": "Option two" },
        { "id": "c", "text": "Option three" },
        { "id": "d", "text": "Option four" }
      ],
      "correctAnswer": "b",
      "explanation": "The article discusses..."
    }
  ],
  "vocabularyMatching": {
    "pairs": [
      { "word": "word1", "definition": "definition1" }
    ]
  },
  "gapFill": {
    "text": "Text with _____ blanks.",
    "blanks": [{ "id": 1, "answer": "word" }],
    "wordBank": ["word", "other", "words"]
  },
  "wordOrder": {
    "sentences": [
      { "scrambled": ["word", "order", "test"], "correct": "Test word order" }
    ]
  },
  "trueFalse": {
    "statements": [
      { "text": "Statement here.", "answer": true, "explanation": "Because..." }
    ]
  },
  "discussion": ["Question 1?", "Question 2?", "Question 3?"]
}

Generate:
- 5 comprehension questions
- 10 vocabulary matching pairs
- 10 gap fill blanks
- 10 word order sentences
- 8 true/false statements
- 3 discussion questions

IMPORTANT: Return ONLY valid JSON, no other text. Make exercises appropriate for ${level} level.`;

  const systemPrompt = `You are an ESL exercise generator. Create clear, educational exercises. Always return valid JSON only.`;

  const response = await generateWithAI(prompt, systemPrompt);

  try {
    const parsed = JSON.parse(response);

    // Validate exercise structure
    const required = ['comprehension', 'vocabularyMatching', 'gapFill', 'wordOrder', 'trueFalse', 'discussion'];
    const missing = required.filter(key => !(key in parsed));

    if (missing.length > 0) {
      throw new Error(`Missing exercise types: ${missing.join(', ')}`);
    }

    return parsed;
  } catch (error) {
    // Try to extract JSON if there's extra text
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // Validate extracted JSON too
      const required = ['comprehension', 'vocabularyMatching', 'gapFill', 'wordOrder', 'trueFalse', 'discussion'];
      const missing = required.filter(key => !(key in parsed));

      if (missing.length > 0) {
        throw new Error(`Extracted JSON missing exercise types: ${missing.join(', ')}`);
      }

      return parsed;
    }

    throw new Error(`Failed to parse exercises JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function generateAllExercises(levelVersions: Record<Level, string>): Promise<Record<Level, unknown>> {
  // Generate sequentially with delays to avoid rate limiting
  console.log("Generating all exercises sequentially...");
  const exercises: Record<Level, unknown> = {} as Record<Level, unknown>;
  const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];

  for (const level of levels) {
    const text = levelVersions[level];
    const ex = await generateExercises(text, level);
    console.log(`✓ ${level} exercises done`);
    exercises[level] = ex;

    // Add 2 second delay between requests to avoid rate limiting
    if (level !== "C1") {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return exercises;
}

export interface VocabularyWord {
  word: string;
  definition: string;
  level: Level;
}

export async function generateVocabulary(levelVersions: Record<Level, string>): Promise<VocabularyWord[]> {
  console.log("Generating level-specific vocabulary...");

  const prompt = `You are an expert ESL vocabulary specialist. Extract vocabulary words from this article that language learners should know.

CRITICAL RULES:
1. NEVER include basic common words that everyone knows: "said", "police", "city", "day", "time", "people", "country", "government", "official", "make", "get", "go", "come", "want", "need", "like", "see", "know", "think", "say", "tell", "work", "live", "have", "be", "do"
2. Each level must have DIFFERENT words - NO OVERLAP between levels
3. Words must actually appear in the article text

LEVEL DEFINITIONS:
- A1 (Beginner): Basic verbs and nouns for survival English (e.g., "arrest", "escape", "neighbor", "bridge")
- A2 (Elementary): Common but not obvious words (e.g., "witness", "protest", "victim", "investigate")
- B1 (Intermediate): Academic/news vocabulary (e.g., "authorities", "conflict", "incident", "consequences")
- B2 (Upper-Intermediate): Sophisticated expressions (e.g., "allegations", "controversy", "jurisdiction", "substantial")
- C1 (Advanced): Formal/technical language (e.g., "unprecedented", "deteriorating", "subsequently", "implications", "contentious")

ARTICLE CONTENT FOR EACH LEVEL:
A1: ${levelVersions.A1}
A2: ${levelVersions.A2}
B1: ${levelVersions.B1}
B2: ${levelVersions.B2}
C1: ${levelVersions.C1}

Extract UNIQUE words for each level with NO repeats:
- 12 words ONLY for A1 users (from A1 text, basic words)
- 12 words ONLY for A2 users (from A2 text, NOT in A1 list)
- 12 words ONLY for B1 users (from B1 text, NOT in A1/A2 lists)
- 12 words ONLY for B2 users (from B2 text, NOT in A1/A2/B1 lists)
- 12 words ONLY for C1 users (from C1 text, NOT in any other list, formal/advanced only)

Return ONLY a JSON array with exactly 60 words total (12 per level):
[{"word": "allegations", "definition": "claims that someone did something wrong", "level": "B2"}]

IMPORTANT: Each word must be unique to ONE level. No word should appear twice in different levels.`;

  const systemPrompt = `You are an ESL vocabulary specialist. Extract genuinely useful vocabulary for language learners. Always return valid JSON only.`;

  try {
    const response = await generateWithAI(prompt, systemPrompt);

    // Parse JSON from response
    let vocabulary: VocabularyWord[];
    try {
      const parsed = JSON.parse(response);
      // Handle both array and {words: [...]} formats
      vocabulary = Array.isArray(parsed) ? parsed : (parsed.words || []);
    } catch {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        vocabulary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse vocabulary JSON");
      }
    }

    console.log(`✓ Generated ${vocabulary.length} vocabulary words (12 per level)`);
    return vocabulary;
  } catch (error) {
    console.error("Failed to generate vocabulary:", error);
    // Throw error instead of silently returning empty array
    // This will cause processArticle to fail rather than create incomplete content
    throw new Error(`Vocabulary generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
