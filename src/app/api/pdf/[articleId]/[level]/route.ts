import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Level, ExerciseSet } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string; level: string }> }
) {
  const { articleId, level } = await params;

  if (!["A1", "A2", "B1", "B2", "C1"].includes(level)) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }

  // Find article by ID or slug
  let article = await db.article.findUnique({ where: { slug: articleId } });
  if (!article) {
    // Try finding by ID
    const articles = await db.article.findMany({});
    article = articles.find(a => a.id === articleId) || null;
  }

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const exercises = article.exercises as Record<Level, ExerciseSet>;
  const exerciseSet = exercises[level as Level];
  const content = (article.content as Record<Level, string>)[level as Level];

  if (!exerciseSet) {
    return NextResponse.json({ error: "Exercises not found for this level" }, { status: 404 });
  }

  // Generate HTML for PDF
  const html = generateExerciseHTML(article.title, level as Level, content, exerciseSet);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${article.slug}-${level}-exercises.html"`,
    },
  });
}

function generateExerciseHTML(title: string, level: Level, content: string, exercises: ExerciseSet): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${level} Exercises | Layered</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Syne', sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fff;
    }

    h1 { font-size: 24px; margin-bottom: 8px; }
    h2 { font-size: 18px; margin: 32px 0 16px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
    h3 { font-size: 14px; margin: 24px 0 12px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; }

    .level-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .article-text {
      background: #fafafa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 32px;
      font-size: 14px;
      white-space: pre-wrap;
    }

    .question {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .question-text {
      font-weight: 500;
      margin-bottom: 8px;
    }

    .options {
      list-style: none;
      padding-left: 0;
    }

    .option {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 14px;
    }

    .option-box {
      width: 16px;
      height: 16px;
      border: 1px solid #ccc;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 3px;
    }

    .vocab-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .vocab-item {
      padding: 8px 12px;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 13px;
    }

    .gap-fill-text {
      font-size: 14px;
      line-height: 2;
    }

    .blank {
      display: inline-block;
      min-width: 100px;
      border-bottom: 1px solid #333;
      margin: 0 4px;
    }

    .word-bank {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .word-bank span {
      padding: 4px 12px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
    }

    .sentence-scramble {
      margin-bottom: 16px;
    }

    .scrambled-words {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }

    .scrambled-words span {
      padding: 4px 12px;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 13px;
    }

    .answer-line {
      border-bottom: 1px solid #ccc;
      min-height: 24px;
    }

    .true-false-item {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      align-items: flex-start;
    }

    .tf-boxes {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .tf-box {
      width: 40px;
      height: 24px;
      border: 1px solid #ccc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: #666;
    }

    .discussion-item {
      margin-bottom: 16px;
    }

    .discussion-lines {
      margin-top: 8px;
    }

    .discussion-line {
      border-bottom: 1px solid #e5e5e5;
      height: 28px;
    }

    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 1px solid #e5e5e5;
      font-size: 12px;
      color: #666;
      text-align: center;
    }

    @media print {
      body { padding: 20px; }
      .question { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="level-badge">Level ${level}</div>

  <h2>Article</h2>
  <div class="article-text">${content}</div>

  ${exercises.comprehension && exercises.comprehension.length > 0 ? `
  <h2>Comprehension Questions</h2>
  ${exercises.comprehension.map((q, i) => `
    <div class="question">
      <div class="question-text">${i + 1}. ${q.question}</div>
      <ul class="options">
        ${q.options.map(opt => `
          <li class="option">
            <span class="option-box"></span>
            <span>${opt.id.toUpperCase()}) ${opt.text}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('')}
  ` : ''}

  ${exercises.vocabularyMatching?.pairs && exercises.vocabularyMatching.pairs.length > 0 ? `
  <h2>Vocabulary Matching</h2>
  <p style="font-size: 13px; color: #666; margin-bottom: 16px;">Match each word with its definition.</p>
  <div class="vocab-grid">
    <div>
      <h3>Words</h3>
      ${exercises.vocabularyMatching.pairs.map((p, i) => `
        <div class="vocab-item">${i + 1}. ${p.word}</div>
      `).join('')}
    </div>
    <div>
      <h3>Definitions</h3>
      ${shuffleArray([...exercises.vocabularyMatching.pairs]).map((p, i) => `
        <div class="vocab-item">${String.fromCharCode(65 + i)}. ${p.definition}</div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${exercises.gapFill?.blanks && exercises.gapFill.blanks.length > 0 ? `
  <h2>Gap Fill</h2>
  <p style="font-size: 13px; color: #666; margin-bottom: 16px;">Fill in the blanks using words from the word bank.</p>
  <div class="gap-fill-text">
    ${exercises.gapFill.text.replace(/_____/g, '<span class="blank"></span>')}
  </div>
  <div class="word-bank">
    ${exercises.gapFill.wordBank.map(w => `<span>${w}</span>`).join('')}
  </div>
  ` : ''}

  ${exercises.wordOrder?.sentences && exercises.wordOrder.sentences.length > 0 ? `
  <h2>Word Order</h2>
  <p style="font-size: 13px; color: #666; margin-bottom: 16px;">Arrange the words to make correct sentences.</p>
  ${exercises.wordOrder.sentences.map((s, i) => `
    <div class="sentence-scramble">
      <div>${i + 1}.</div>
      <div class="scrambled-words">
        ${s.scrambled.map(w => `<span>${w}</span>`).join('')}
      </div>
      <div class="answer-line"></div>
    </div>
  `).join('')}
  ` : ''}

  ${exercises.trueFalse?.statements && exercises.trueFalse.statements.length > 0 ? `
  <h2>True or False</h2>
  ${exercises.trueFalse.statements.map((s, i) => `
    <div class="true-false-item">
      <div class="tf-boxes">
        <div class="tf-box">T</div>
        <div class="tf-box">F</div>
      </div>
      <div>${i + 1}. ${s.text}</div>
    </div>
  `).join('')}
  ` : ''}

  ${exercises.discussion && exercises.discussion.length > 0 ? `
  <h2>Discussion Questions</h2>
  ${exercises.discussion.map((q, i) => `
    <div class="discussion-item">
      <div>${i + 1}. ${q}</div>
      <div class="discussion-lines">
        <div class="discussion-line"></div>
        <div class="discussion-line"></div>
        <div class="discussion-line"></div>
      </div>
    </div>
  `).join('')}
  ` : ''}

  <div class="footer">
    Generated by Layered - Learn English Through News<br>
    layered-app.vercel.app
  </div>

  <script>
    // Auto print on load
    // window.onload = () => window.print();
  </script>
</body>
</html>`;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
