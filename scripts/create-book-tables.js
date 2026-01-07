const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://otittsnvduydvqqzsxsm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aXR0c252ZHV5ZHZxcXpzeHNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzc4NjgzNCwiZXhwIjoyMDgzMzYyODM0fQ.Mx_EatSD5ZJbq2xjpr0msuLywWAiNyqmFmwEZjOU6RM'
);

async function createTables() {
  console.log('Creating Book table...');

  // Test if Book table exists by trying to select from it
  const { error: bookCheckError } = await supabase.from('Book').select('id').limit(1);

  if (bookCheckError && bookCheckError.code === '42P01') {
    console.log('Book table does not exist. Please create it in Supabase dashboard with SQL:');
    console.log(`
CREATE TABLE "Book" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "wikiTitle" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT NOT NULL,
  "coverImage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Book_category_idx" ON "Book"("category");

CREATE TABLE "Chapter" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "wikiTitle" TEXT NOT NULL,
  "bookId" TEXT NOT NULL REFERENCES "Book"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "orderIndex" INTEGER NOT NULL,
  "content" JSONB NOT NULL,
  "exercises" JSONB NOT NULL,
  "audio" JSONB,
  "vocabulary" JSONB,
  "wordCounts" JSONB NOT NULL,
  "readTimes" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE("bookId", "slug")
);

CREATE INDEX "Chapter_bookId_idx" ON "Chapter"("bookId");
    `);
    return false;
  } else if (bookCheckError) {
    console.log('Error checking Book table:', bookCheckError.message);
    return false;
  }

  console.log('Book table exists!');

  // Check Chapter table
  const { error: chapterCheckError } = await supabase.from('Chapter').select('id').limit(1);

  if (chapterCheckError && chapterCheckError.code === '42P01') {
    console.log('Chapter table does not exist.');
    return false;
  } else if (chapterCheckError) {
    console.log('Error checking Chapter table:', chapterCheckError.message);
    return false;
  }

  console.log('Chapter table exists!');
  return true;
}

createTables();
