import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  titles: Record<string, string> | null;
  subtitles: Record<string, string> | null;
  category: string;
  source: string;
  sourceUrl: string;
  heroImage: string | null;
  heroAlt: string | null;
  content: Record<string, string>;
  exercises: Record<string, unknown>;
  audio: Record<string, { url: string; duration: number }> | null;
  vocabulary: Array<{ word: string; definition: string; level: string }> | null;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};
