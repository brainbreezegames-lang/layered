require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  console.error('❌ DIRECT_URL environment variable not set');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function addColumns() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✓ Connected to database');

    // Add titles column
    console.log('Adding titles column...');
    await client.query(`
      ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "titles" JSONB;
    `);
    console.log('✓ Added titles column');

    // Add subtitles column
    console.log('Adding subtitles column...');
    await client.query(`
      ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "subtitles" JSONB;
    `);
    console.log('✓ Added subtitles column');

    console.log('\n✅ Schema migration completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addColumns();
