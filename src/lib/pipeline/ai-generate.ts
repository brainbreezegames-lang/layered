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
