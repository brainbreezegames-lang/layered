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

  // Get destination
  const { data: destination, error: destError } = await supabase
    .from('Destination')
    .select('*')
    .eq('slug', slug)
    .single();

  if (destError) {
    return NextResponse.json({ error: destError.message }, { status: 404 });
  }

  // Get sections for this destination
  const { data: sections, error: sectionsError } = await supabase
    .from('DestinationSection')
    .select('id, slug, title, sectionType, orderIndex, wordCounts, readTimes')
    .eq('destinationId', destination.id)
    .order('orderIndex');

  if (sectionsError) {
    return NextResponse.json({ error: sectionsError.message }, { status: 500 });
  }

  return NextResponse.json({ ...destination, sections });
}
