import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: book, error: bookError } = await supabase
    .from('Book')
    .select('*')
    .eq('slug', slug)
    .single();

  if (bookError) {
    return NextResponse.json({ error: bookError.message }, { status: 404 });
  }

  const { data: chapters } = await supabase
    .from('Chapter')
    .select('id, slug, title, orderIndex, wordCounts, readTimes')
    .eq('bookId', book.id)
    .order('orderIndex');

  return NextResponse.json({ ...book, chapters });
}
