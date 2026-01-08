# Database Scripts

## Initial Setup

### 1. Add Database Columns (One-time setup)

Run this SQL in your Supabase Dashboard > SQL Editor:

```sql
ALTER TABLE "Article"
ADD COLUMN IF NOT EXISTS "titles" JSONB,
ADD COLUMN IF NOT EXISTS "subtitles" JSONB;
```

Or run:
```bash
npx tsx scripts/run-migration.ts
```

### 2. Seed Initial Articles

To populate the database with starter articles:

```bash
npx tsx scripts/seed-simple.ts
```

This creates 2 sample articles so the site is never empty.

### 3. Seed Full Articles (after migration)

Once the `titles` and `subtitles` columns are added:

```bash
npx tsx scripts/seed-articles.ts
```

This creates articles with complete exercise sets and vocabulary.

## Files

- `migrate-add-titles-subtitles.sql` - SQL to add missing columns
- `run-migration.ts` - Automated migration runner
- `seed-simple.ts` - Quick seed without titles/subtitles
- `seed-articles.ts` - Full seed with all fields
