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
      model: "anthropic/claude-3.5-sonnet",
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
- Use only the 500 most common English words
- Maximum 8 words per sentence
- Use only present tense
- No idioms, phrasal verbs, or complex grammar
- Simple subject-verb-object structure
- Target: 150-200 words total`,
  A2: `
- Use only the 1,000 most common English words
- Maximum 12 words per sentence
- Use present and simple past tense
- Avoid idioms and phrasal verbs
- Simple sentence structures
- Target: 250-350 words total`,
  B1: `
- Use the 2,000 most common English words
- Average 15 words per sentence
- Use all common tenses
- Some simple phrasal verbs allowed
- Compound sentences allowed
- Target: 400-500 words total`,
  B2: `
- Use up to 3,500 common words
- Natural sentence length variation
- All tenses and aspects allowed
- Idioms and phrasal verbs allowed
- Complex sentences allowed
- Target: 550-700 words total`,
  C1: `
- Preserve original vocabulary and complexity
- Keep sophisticated sentence structures
- Maintain idiomatic expressions
- Keep nuanced meanings intact
- Target: Original length (600-900 words)`,
};

export async function generateLevelVersion(originalText: string, level: Level): Promise<string> {
  const prompt = `
Rewrite this news article at ${level} English proficiency level.

RULES FOR ${level}:
${LEVEL_GUIDELINES[level]}

IMPORTANT:
- Keep ALL the key facts and information from the original
- Make it sound natural, not like a textbook
- Do not add information that isn't in the original
- Do not include any preamble like "Here is the rewritten article"
- Do NOT add a title or heading at the start - just the article body paragraphs
- Just output the adapted article text directly

ORIGINAL ARTICLE:
${originalText}

REWRITTEN AT ${level} LEVEL:`;

  const systemPrompt = `You are an expert ESL content writer who adapts news articles for English learners. You preserve factual accuracy while adjusting language complexity. Output only article body paragraphs without titles or headings.`;

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
    return JSON.parse(response);
  } catch {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse exercises JSON");
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
    return []; // Return empty array on failure
  }
}
