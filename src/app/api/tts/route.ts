import { NextRequest, NextResponse } from "next/server";

// TikTok TTS via Weilbyte's API (proxied to avoid CORS)
const TTS_API = "https://tiktok-tts.weilnet.workers.dev/api/generation";

export async function POST(request: NextRequest) {
  try {
    const { text, voice } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Limit text to 300 characters (TikTok API limit)
    const limitedText = text.slice(0, 300);

    const response = await fetch(TTS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: limitedText,
        voice: voice || "en_us_001",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TTS API error:", errorText);
      return NextResponse.json(
        { error: "TTS generation failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.data) {
      return NextResponse.json(
        { error: "No audio data received" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data.data });
  } catch (error) {
    console.error("TTS proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
