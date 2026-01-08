import { NextRequest, NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// Microsoft Edge TTS voices - natural neural voices
const VOICES = {
  "en-US-female": "en-US-JennyNeural",
  "en-US-male": "en-US-GuyNeural",
  "en-US-female-2": "en-US-AriaNeural",
  "en-US-male-2": "en-US-ChristopherNeural",
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

export async function POST(request: NextRequest) {
  try {
    const { text, voice = "en-US-female", level = "B1" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Limit text length (5000 chars max for performance)
    const truncatedText = text.slice(0, 5000);

    // Get voice and rate settings
    const voiceName = VOICES[voice as VoiceKey] || VOICES["en-US-female"];
    const rate = RATE_BY_LEVEL[level] || "+0%";

    // Create TTS instance
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    // Generate audio - returns { audioStream, metadataStream }
    const result = tts.toStream(truncatedText, { rate, pitch: "+0Hz", volume: "+0%" });

    // Collect audio chunks from the audio stream
    const chunks: Buffer[] = [];
    for await (const chunk of result.audioStream) {
      chunks.push(Buffer.from(chunk));
    }

    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio", details: String(error) },
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
