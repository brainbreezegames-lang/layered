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
    throw new Error(`OpenRouter API error: ${response.status}`);
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
- Just output the adapted article text directly

ORIGINAL ARTICLE:
${originalText}

REWRITTEN AT ${level} LEVEL:`;

  const systemPrompt = `You are an expert ESL content writer who adapts news articles for English learners. You preserve factual accuracy while adjusting language complexity.`;

  return await generateWithAI(prompt, systemPrompt);
}

export async function generateAllLevels(originalText: string): Promise<Record<Level, string>> {
  const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];

  // Run all level generations in parallel for speed
  console.log("Generating all level versions in parallel...");
  const results = await Promise.all(
    levels.map(async (level) => {
      const text = await generateLevelVersion(originalText, level);
      console.log(`✓ ${level} version done`);
      return { level, text };
    })
  );

  const versions: Record<Level, string> = {} as Record<Level, string>;
  for (const { level, text } of results) {
    versions[level] = text;
  }

  return versions;
}

export async function generateLevelHeadlines(
  originalTitle: string,
  originalSubtitle: string,
  levelVersions: Record<Level, string>
): Promise<{ titles: Record<Level, string>; subtitles: Record<Level, string> }> {
  const prompt = `
You are a New York Times headline editor adapting headlines for English language learners at different proficiency levels.

ORIGINAL TITLE: ${originalTitle}
ORIGINAL SUBTITLE: ${originalSubtitle || "(no subtitle)"}

Create level-appropriate versions of this headline and subtitle. Follow New York Times editorial standards:
- Headlines should be clear, compelling, and capture the essence of the story
- Use strong verbs and concrete nouns
- Avoid clichés and jargon
- Each level should use vocabulary appropriate to that proficiency

A1 (Beginner):
- Use only the 500 most common English words
- Maximum 6-8 words for title
- Simple present tense preferred
- Very simple subtitle (8-12 words)

A2 (Elementary):
- Use the 1,000 most common words
- Maximum 8-10 words for title
- Present and simple past tense
- Clear, simple subtitle (10-15 words)

B1 (Intermediate):
- Use 2,000 common words
- 8-12 words for title
- More sophisticated structure allowed
- Engaging subtitle (12-18 words)

B2 (Upper-Intermediate):
- Use 3,500 common words
- 8-14 words for title
- Natural, varied structures
- Compelling subtitle (15-20 words)

C1 (Advanced):
- Full vocabulary range
- Can use original title or refine it
- Sophisticated, NYT-quality subtitle
- Preserve nuance and style

Return ONLY a JSON object in this exact format (no markdown, no explanation):
{
  "A1": {"title": "...", "subtitle": "..."},
  "A2": {"title": "...", "subtitle": "..."},
  "B1": {"title": "...", "subtitle": "..."},
  "B2": {"title": "...", "subtitle": "..."},
  "C1": {"title": "...", "subtitle": "..."}
}`;

  const systemPrompt = `You are an expert headline editor who adapts titles for different reading levels while maintaining journalistic quality. You always return valid JSON.`;

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
  // Run all exercise generations in parallel for speed
  console.log("Generating all exercises in parallel...");
  const results = await Promise.all(
    Object.entries(levelVersions).map(async ([level, text]) => {
      const exercises = await generateExercises(text, level as Level);
      console.log(`✓ ${level} exercises done`);
      return { level: level as Level, exercises };
    })
  );

  const exercises: Record<Level, unknown> = {} as Record<Level, unknown>;
  for (const { level, exercises: ex } of results) {
    exercises[level] = ex;
  }

  return exercises;
}

export interface VocabularyWord {
  word: string;
  definition: string;
  level: Level;
}

export async function generateVocabulary(levelVersions: Record<Level, string>): Promise<VocabularyWord[]> {
  console.log("Generating vocabulary...");

  // Use the C1 version which has the richest vocabulary
  const c1Text = levelVersions.C1;

  const prompt = `You are an expert ESL vocabulary specialist. Extract 25 vocabulary words from this article that are genuinely worth teaching to language learners.

CRITICAL RULES:
1. DO NOT include common everyday words that all English speakers know (e.g., "said", "police", "city", "day", "time", "people", "country", "government", "official")
2. A1 words should be basic but useful verbs/nouns that beginners need (e.g., "arrest", "escape", "danger")
3. A2 words should be slightly less common (e.g., "witness", "protest", "victim")
4. B1 words should be intermediate vocabulary (e.g., "investigation", "conflict", "authorities")
5. B2 words should be sophisticated (e.g., "allegations", "controversy", "jurisdiction")
6. C1 words should be advanced/formal (e.g., "unprecedented", "deteriorating", "subsequently")

ARTICLE CONTENT:
${c1Text}

Return ONLY a JSON array with exactly 25 words:
- 3 A1 words (basic but not obvious)
- 5 A2 words
- 7 B1 words
- 6 B2 words
- 4 C1 words (sophisticated/formal)

Format: [{"word": "allegations", "definition": "claims that someone has done something wrong", "level": "B2"}]

Only include words that appear in the article. Each word must be genuinely challenging for its assigned level. Do NOT include common words like "police", "city", "people", "country", etc.`;

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

    console.log(`✓ Generated ${vocabulary.length} vocabulary words`);
    return vocabulary;
  } catch (error) {
    console.error("Failed to generate vocabulary:", error);
    return []; // Return empty array on failure
  }
}
