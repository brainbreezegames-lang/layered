import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; sectionSlug: string }> }
) {
  const { slug, sectionSlug } = await params;

  // Get destination
  const { data: destination, error: destError } = await supabase
    .from('Destination')
    .select('id, slug, name, country, region')
    .eq('slug', slug)
    .single();

  if (destError) {
    return NextResponse.json({ error: destError.message }, { status: 404 });
  }

  // Get all sections to find prev/next
  const { data: allSections, error: allSectionsError } = await supabase
    .from('DestinationSection')
    .select('id, slug, title, orderIndex')
    .eq('destinationId', destination.id)
    .order('orderIndex');

  if (allSectionsError) {
    return NextResponse.json({ error: allSectionsError.message }, { status: 500 });
  }

  // Get the current section with full content
  const { data: section, error: sectionError } = await supabase
    .from('DestinationSection')
    .select('*')
    .eq('destinationId', destination.id)
    .eq('slug', sectionSlug)
    .single();

  if (sectionError) {
    return NextResponse.json({ error: sectionError.message }, { status: 404 });
  }

  // Find prev/next sections
  const currentIndex = allSections.findIndex((s: { slug: string }) => s.slug === sectionSlug);
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  return NextResponse.json({
    ...section,
    destination,
    prevSection,
    nextSection,
    totalSections: allSections.length,
  });
}
