import { NextRequest, NextResponse } from "next/server";

// Use Edge Runtime for better performance and compatibility
export const runtime = "edge";
export const maxDuration = 60;

// Available voices - Microsoft Edge Neural TTS
const VOICES: Record<string, string> = {
  "en-US-female": "en-US-JennyNeural",
  "en-US-male": "en-US-GuyNeural",
  "en-GB-female": "en-GB-SoniaNeural",
  "en-GB-male": "en-GB-RyanNeural",
};

// Rate adjustment based on CEFR level
const RATE_BY_LEVEL: Record<string, string> = {
  A1: "-20%",
  A2: "-10%",
  B1: "+0%",
  B2: "+5%",
  C1: "+10%",
};

export async function POST(request: NextRequest) {
  try {
    const { text, voice = "en-US-female", level = "B1" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Limit text length
    const truncatedText = text.slice(0, 5000);
    const voiceName = VOICES[voice] || VOICES["en-US-female"];
    const rate = RATE_BY_LEVEL[level] || "+0%";

    // Dynamic import for edge-tts-universal
    const { UniversalEdgeTTS } = await import("edge-tts-universal");

    // Create TTS instance with prosody options
    const tts = new UniversalEdgeTTS(truncatedText, voiceName, {
      rate: rate,
      pitch: "+0Hz",
      volume: "+0%",
    });

    // Generate audio
    const result = await tts.synthesize();

    if (!result || !result.audio) {
      throw new Error("No audio generated");
    }

    // Get audio as ArrayBuffer
    const audioBuffer = await result.audio.arrayBuffer();

    if (!audioBuffer || audioBuffer.byteLength === 0) {
      throw new Error("Audio buffer is empty");
    }

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
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
    voices: Object.entries(VOICES).map(([key, name]) => ({
      id: key,
      name: name,
      gender: key.includes("female") ? "female" : "male",
      accent: key.split("-").slice(0, 2).join("-"),
    })),
    levels: Object.keys(RATE_BY_LEVEL),
  });
}
