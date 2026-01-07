import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookSlug: string; chapterSlug: string }> }
) {
  const { bookSlug, chapterSlug } = await params;

  const { data: book } = await supabase
    .from('Book')
    .select('id, title, slug')
    .eq('slug', bookSlug)
    .single();

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const { data: chapter, error } = await supabase
    .from('Chapter')
    .select('*')
    .eq('bookId', book.id)
    .eq('slug', chapterSlug)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const { data: allChapters } = await supabase
    .from('Chapter')
    .select('slug, title, orderIndex')
    .eq('bookId', book.id)
    .order('orderIndex');

  const currentIndex = allChapters?.findIndex(c => c.slug === chapterSlug) ?? -1;
  const prevChapter = currentIndex > 0 ? allChapters?.[currentIndex - 1] : null;
  const nextChapter = currentIndex < (allChapters?.length ?? 0) - 1 ? allChapters?.[currentIndex + 1] : null;

  return NextResponse.json({ ...chapter, book, prevChapter, nextChapter });
}
