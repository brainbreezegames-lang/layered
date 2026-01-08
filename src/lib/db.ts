import { supabaseAdmin, ArticleRow } from "./supabase";

type ArticleCreateInput = {
  slug: string;
  title: string;
  subtitle?: string | null;
  titles?: Record<string, string> | null;
  subtitles?: Record<string, string> | null;
  category: string;
  source: string;
  sourceUrl: string;
  heroImage?: string | null;
  heroAlt?: string | null;
  content: Record<string, string>;
  exercises: Record<string, unknown>;
  audio?: Record<string, { url: string; duration: number }> | null;
  vocabulary?: Array<{ word: string; definition: string; level: string }> | null;
  wordCounts: Record<string, number>;
  readTimes: Record<string, number>;
  publishedAt: Date;
};

function generateId(): string {
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}

export const db = {
  article: {
    async findUnique({ where }: { where: { sourceUrl?: string; slug?: string } }): Promise<ArticleRow | null> {
      let query = supabaseAdmin.from("Article").select("*");

      if (where.sourceUrl) {
        query = query.eq("sourceUrl", where.sourceUrl);
      } else if (where.slug) {
        query = query.eq("slug", where.slug);
      }

      const { data, error } = await query.single();

      if (error || !data) return null;
      return data as ArticleRow;
    },

    async create({ data }: { data: ArticleCreateInput }): Promise<ArticleRow> {
      const now = new Date().toISOString();
      const row = {
        id: generateId(),
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle || null,
        titles: data.titles || null,
        subtitles: data.subtitles || null,
        category: data.category,
        source: data.source,
        sourceUrl: data.sourceUrl,
        heroImage: data.heroImage || null,
        heroAlt: data.heroAlt || null,
        content: data.content,
        exercises: data.exercises,
        audio: data.audio || null,
        vocabulary: data.vocabulary || null,
        wordCounts: data.wordCounts,
        readTimes: data.readTimes,
        publishedAt: data.publishedAt.toISOString(),
        createdAt: now,
        updatedAt: now,
      };

      const { data: result, error } = await supabaseAdmin
        .from("Article")
        .insert(row)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create article: ${error.message}`);
      }

      return result as ArticleRow;
    },

    async findMany({
      where,
      orderBy,
      take,
      skip,
    }: {
      where?: { category?: string };
      orderBy?: { publishedAt?: "asc" | "desc" };
      take?: number;
      skip?: number;
    } = {}): Promise<ArticleRow[]> {
      let query = supabaseAdmin.from("Article").select("*");

      if (where?.category) {
        query = query.eq("category", where.category);
      }

      if (orderBy?.publishedAt) {
        query = query.order("publishedAt", { ascending: orderBy.publishedAt === "asc" });
      } else {
        query = query.order("publishedAt", { ascending: false });
      }

      if (skip) {
        query = query.range(skip, skip + (take || 10) - 1);
      } else if (take) {
        query = query.limit(take);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching articles:", error);
        return [];
      }

      return (data || []) as ArticleRow[];
    },

    async count({ where }: { where?: { category?: string } } = {}): Promise<number> {
      let query = supabaseAdmin.from("Article").select("*", { count: "exact", head: true });

      if (where?.category) {
        query = query.eq("category", where.category);
      }

      const { count, error } = await query;

      if (error) {
        console.error("Error counting articles:", error);
        return 0;
      }

      return count || 0;
    },

    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<{
        vocabulary: Array<{ word: string; definition: string; level: string }>;
        heroImage: string;
        heroAlt: string;
        titles: Record<string, string>;
        subtitles: Record<string, string>;
        content: Record<string, string>;
      }>;
    }): Promise<ArticleRow> {
      const { data: result, error } = await supabaseAdmin
        .from("Article")
        .update({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", where.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update article: ${error.message}`);
      }

      return result as ArticleRow;
    },

    async deleteMany(): Promise<{ count: number }> {
      const { data, error } = await supabaseAdmin
        .from("Article")
        .delete()
        .neq("id", ""); // Delete all rows

      if (error) {
        throw new Error(`Failed to delete articles: ${error.message}`);
      }

      return { count: Array.isArray(data) ? data.length : 0 };
    },
  },
};
