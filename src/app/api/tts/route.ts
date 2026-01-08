import { NextRequest, NextResponse } from "next/server";

// Microsoft Edge TTS voices - natural neural voices
const VOICES = {
  "en-US-female": "en-US-JennyNeural",
  "en-US-male": "en-US-GuyNeural",
  "en-GB-female": "en-GB-SoniaNeural",
  "en-GB-male": "en-GB-RyanNeural",
  "en-AU-female": "en-AU-NatashaNeural",
  "en-AU-male": "en-AU-WilliamNeural",
} as const;

type VoiceKey = keyof typeof VOICES;

// Rate adjustment based on CEFR level
const RATE_BY_LEVEL: Record<string, string> = {
  A1: "-20%",
  A2: "-10%",
  B1: "+0%",
  B2: "+5%",
  C1: "+10%",
};

export const maxDuration = 60; // Allow up to 60 seconds for audio generation

export async function POST(request: NextRequest) {
  try {
    const { text, voice = "en-US-female", level = "B1" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Limit text length (3000 chars max for performance on serverless)
    const truncatedText = text.slice(0, 3000);

    // Get voice and rate settings
    const voiceName = VOICES[voice as VoiceKey] || VOICES["en-US-female"];
    const rate = RATE_BY_LEVEL[level] || "+0%";

    // Dynamic import to avoid issues with module loading
    const { MsEdgeTTS, OUTPUT_FORMAT } = await import("msedge-tts");

    // Create TTS instance
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    // Generate audio - returns { audioStream, metadataStream }
    const result = tts.toStream(truncatedText, { rate, pitch: "+0Hz", volume: "+0%" });

    // Collect audio chunks from the audio stream with timeout
    const chunks: Buffer[] = [];

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Audio generation timed out")), 55000);
    });

    const audioPromise = (async () => {
      for await (const chunk of result.audioStream) {
        chunks.push(Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    })();

    const audioBuffer = await Promise.race([audioPromise, timeoutPromise]);

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
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

// GET endpoint to list available voices
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
