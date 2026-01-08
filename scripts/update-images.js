/**
 * Update Images Script
 *
 * Adds Unsplash images to Stories and updates broken images in Explore
 * Usage: node scripts/update-images.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Story images by slug - high quality Unsplash images
const storyImages = {
  'the-gift-of-the-magi': 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=1200',
  'the-last-leaf': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
  'the-ransom-of-red-chief': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200',
  'the-cop-and-the-anthem': 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200',
  'a-retrieved-reformation': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200',
  'the-happy-prince': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  'the-selfish-giant': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200',
  'the-nightingale-and-the-rose': 'https://images.unsplash.com/photo-1518882605630-8b11ba4adf01?w=1200',
  'the-bet': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200',
  'a-day-in-the-country': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
  'the-lottery-ticket': 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=1200',
  'the-red-headed-league': 'https://images.unsplash.com/photo-1509266272358-7701da638078?w=1200',
  'a-scandal-in-bohemia': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
  'the-celebrated-jumping-frog': 'https://images.unsplash.com/photo-1474314170901-f351b68f544f?w=1200',
  'the-open-window': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200',
  'rikki-tikki-tavi': 'https://images.unsplash.com/photo-1579168765467-3b235f938439?w=1200',
  'the-story-of-an-hour': 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=1200',
  'the-garden-party': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200',
  'miss-brill': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200',
  'the-necklace': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200'
};

// Explore article image updates
const exploreImages = {
  'albert-einstein': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200'
};

async function updateStoryImages() {
  console.log('Updating Story images...\n');

  let updated = 0;
  let errors = 0;

  for (const [slug, heroImage] of Object.entries(storyImages)) {
    const { error } = await supabase
      .from('Story')
      .update({ heroImage })
      .eq('slug', slug);

    if (error) {
      console.error(`  Error updating ${slug}: ${error.message}`);
      errors++;
    } else {
      console.log(`  Updated: ${slug}`);
      updated++;
    }
  }

  console.log(`\nStories updated: ${updated}, errors: ${errors}`);
}

async function updateExploreImages() {
  console.log('\nUpdating Explore article images...\n');

  let updated = 0;
  let errors = 0;

  for (const [slug, heroImage] of Object.entries(exploreImages)) {
    const { error } = await supabase
      .from('ExploreArticle')
      .update({ heroImage })
      .eq('slug', slug);

    if (error) {
      console.error(`  Error updating ${slug}: ${error.message}`);
      errors++;
    } else {
      console.log(`  Updated: ${slug}`);
      updated++;
    }
  }

  console.log(`\nExplore articles updated: ${updated}, errors: ${errors}`);
}

async function main() {
  console.log('='.repeat(50));
  console.log('Updating Images to Unsplash');
  console.log('='.repeat(50) + '\n');

  await updateStoryImages();
  await updateExploreImages();

  console.log('\n' + '='.repeat(50));
  console.log('Done!');
  console.log('='.repeat(50));
}

main().catch(console.error);
