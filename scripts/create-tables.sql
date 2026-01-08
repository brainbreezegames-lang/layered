-- Create Travel and Explore tables for Layered app

-- Destination table (Travel)
CREATE TABLE IF NOT EXISTS "Destination" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  "wikiTitle" TEXT NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  "heroImage" TEXT,
  description TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- DestinationSection table
CREATE TABLE IF NOT EXISTS "DestinationSection" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT NOT NULL,
  "destinationId" TEXT NOT NULL REFERENCES "Destination"(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "sectionType" TEXT NOT NULL,
  "orderIndex" INTEGER NOT NULL,
  content JSONB NOT NULL,
  exercises JSONB NOT NULL,
  audio JSONB,
  vocabulary JSONB,
  "wordCounts" JSONB NOT NULL,
  "readTimes" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("destinationId", slug)
);

-- TravelPhrase table
CREATE TABLE IF NOT EXISTS "TravelPhrase" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  content JSONB NOT NULL,
  exercises JSONB NOT NULL,
  audio JSONB,
  vocabulary JSONB,
  "wordCounts" JSONB NOT NULL,
  "readTimes" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ExploreArticle table
CREATE TABLE IF NOT EXISTS "ExploreArticle" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  "wikiTitle" TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  "heroImage" TEXT,
  excerpt TEXT,
  content JSONB NOT NULL,
  exercises JSONB NOT NULL,
  audio JSONB,
  vocabulary JSONB,
  "wordCounts" JSONB NOT NULL,
  "readTimes" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_destination_region ON "Destination"(region);
CREATE INDEX IF NOT EXISTS idx_destinationsection_destinationid ON "DestinationSection"("destinationId");
CREATE INDEX IF NOT EXISTS idx_travelphrase_category ON "TravelPhrase"(category);
CREATE INDEX IF NOT EXISTS idx_explorearticle_category ON "ExploreArticle"(category);
