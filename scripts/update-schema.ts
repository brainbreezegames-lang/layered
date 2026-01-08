import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateSchema() {
  try {
    console.log('Adding titles and subtitles columns to Article table...');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "titles" JSONB;
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "subtitles" JSONB;
    `);

    console.log('✓ Schema updated successfully!');
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateSchema();
