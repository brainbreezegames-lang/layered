import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// Split text into chunks for Google TTS (max ~200 chars per request)
function splitText(text: string, maxLength: number = 200): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length <= maxLength) {
      current += sentence;
    } else {
      if (current) chunks.push(current.trim());
      current = sentence;
    }
  }
  if (current) chunks.push(current.trim());

  return chunks;
}

export async function POST(request: NextRequest) {
  try {
    const { text, voice = "en-US-female", level = "B1" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Limit text length
    const truncatedText = text.slice(0, 3000);

    // Split into chunks
    const chunks = splitText(truncatedText);

    // Determine language code based on voice
    const langCode = voice.startsWith("en-GB") ? "en-GB" :
                     voice.startsWith("en-AU") ? "en-AU" : "en-US";

    // Fetch audio for each chunk
    const audioChunks: ArrayBuffer[] = [];

    for (const chunk of chunks) {
      const encodedText = encodeURIComponent(chunk);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodedText}`;

      const response = await fetch(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/",
        },
      });

      if (!response.ok) {
        console.error(`TTS chunk failed: ${response.status}`);
        continue;
      }

      const buffer = await response.arrayBuffer();
      if (buffer.byteLength > 0) {
        audioChunks.push(buffer);
      }
    }

    if (audioChunks.length === 0) {
      throw new Error("No audio generated");
    }

    // Combine all audio chunks
    const totalLength = audioChunks.reduce((acc, buf) => acc + buf.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunks) {
      combined.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    return new NextResponse(combined, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": combined.length.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate audio", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    voices: [
      { id: "en-US-female", name: "US English", gender: "neutral", accent: "en-US" },
      { id: "en-GB-female", name: "UK English", gender: "neutral", accent: "en-GB" },
      { id: "en-AU-female", name: "AU English", gender: "neutral", accent: "en-AU" },
    ],
    levels: ["A1", "A2", "B1", "B2", "C1"],
  });
}
