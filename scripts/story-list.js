// Safe, filter-friendly stories from Project Gutenberg
// All authors passed away 70+ years ago (public domain)
// All themes are positive/neutral and family-friendly

const SEED_STORIES = [
  // O. Henry - Warm, twist endings
  {
    slug: "the-gift-of-the-magi",
    title: "The Gift of the Magi",
    author: "O. Henry",
    gutenbergId: 7256,
    category: "love",
    themes: ["love", "generosity", "sacrifice"],
    description: "A young couple discovers the true meaning of giving.",
    readingLevel: "A2" // Simple prose, short story
  },
  {
    slug: "the-last-leaf",
    title: "The Last Leaf",
    author: "O. Henry",
    gutenbergId: 7256,
    category: "moral",
    themes: ["hope", "friendship", "art"],
    description: "An artist makes a profound sacrifice for a friend.",
    readingLevel: "A2"
  },
  {
    slug: "the-ransom-of-red-chief",
    title: "The Ransom of Red Chief",
    author: "O. Henry",
    gutenbergId: 7256,
    category: "humor",
    themes: ["humor", "childhood", "irony"],
    description: "Two men find they have taken on more than they bargained for.",
    readingLevel: "B1"
  },
  {
    slug: "the-cop-and-the-anthem",
    title: "The Cop and the Anthem",
    author: "O. Henry",
    gutenbergId: 7256,
    category: "humor",
    themes: ["irony", "change", "choices"],
    description: "A man's plans take an unexpected turn.",
    readingLevel: "B1"
  },
  {
    slug: "a-retrieved-reformation",
    title: "A Retrieved Reformation",
    author: "O. Henry",
    gutenbergId: 7256,
    category: "moral",
    themes: ["redemption", "love", "change"],
    description: "A man decides to start a new life.",
    readingLevel: "B1"
  },

  // Oscar Wilde - Fairy tales, moral lessons
  {
    slug: "the-happy-prince",
    title: "The Happy Prince",
    author: "Oscar Wilde",
    gutenbergId: 902,
    category: "moral",
    themes: ["kindness", "sacrifice", "compassion"],
    description: "A statue and a bird help those in need.",
    readingLevel: "A2"
  },
  {
    slug: "the-selfish-giant",
    title: "The Selfish Giant",
    author: "Oscar Wilde",
    gutenbergId: 902,
    category: "moral",
    themes: ["kindness", "sharing", "transformation"],
    description: "A giant learns the joy of sharing his garden.",
    readingLevel: "A2"
  },
  {
    slug: "the-nightingale-and-the-rose",
    title: "The Nightingale and the Rose",
    author: "Oscar Wilde",
    gutenbergId: 902,
    category: "love",
    themes: ["love", "sacrifice", "beauty"],
    description: "A nightingale makes a sacrifice for love.",
    readingLevel: "B1"
  },

  // Anton Chekhov - Human stories
  {
    slug: "the-bet",
    title: "The Bet",
    author: "Anton Chekhov",
    gutenbergId: 13415,
    category: "moral",
    themes: ["wisdom", "values", "perspective"],
    description: "A wager leads to unexpected realizations.",
    readingLevel: "B2"
  },
  {
    slug: "a-day-in-the-country",
    title: "A Day in the Country",
    author: "Anton Chekhov",
    gutenbergId: 13415,
    category: "slice-of-life",
    themes: ["nature", "kindness", "childhood"],
    description: "Children experience wonder in nature.",
    readingLevel: "B1"
  },
  {
    slug: "the-lottery-ticket",
    title: "The Lottery Ticket",
    author: "Anton Chekhov",
    gutenbergId: 13415,
    category: "slice-of-life",
    themes: ["dreams", "relationships", "imagination"],
    description: "A couple imagines what they would do with winnings.",
    readingLevel: "B1"
  },

  // Arthur Conan Doyle - Detective stories (safe selections)
  {
    slug: "the-red-headed-league",
    title: "The Red-Headed League",
    author: "Arthur Conan Doyle",
    gutenbergId: 1661,
    category: "mystery",
    themes: ["cleverness", "deduction", "surprise"],
    description: "Holmes investigates a peculiar job advertisement.",
    readingLevel: "B2"
  },
  {
    slug: "a-scandal-in-bohemia",
    title: "A Scandal in Bohemia",
    author: "Arthur Conan Doyle",
    gutenbergId: 1661,
    category: "mystery",
    themes: ["cleverness", "wit", "respect"],
    description: "Holmes meets his match in a clever woman.",
    readingLevel: "B2"
  },

  // Mark Twain - Humor
  {
    slug: "the-celebrated-jumping-frog",
    title: "The Celebrated Jumping Frog of Calaveras County",
    author: "Mark Twain",
    gutenbergId: 3174,
    category: "humor",
    themes: ["humor", "competition", "storytelling"],
    description: "A tall tale about an unusual frog competition.",
    readingLevel: "B1"
  },

  // Saki - Short humor
  {
    slug: "the-open-window",
    title: "The Open Window",
    author: "Saki",
    gutenbergId: 3167,
    category: "humor",
    themes: ["imagination", "storytelling", "surprise"],
    description: "A young girl tells an imaginative story.",
    readingLevel: "B1"
  },

  // Rudyard Kipling - Adventure
  {
    slug: "rikki-tikki-tavi",
    title: "Rikki-Tikki-Tavi",
    author: "Rudyard Kipling",
    gutenbergId: 236,
    category: "adventure",
    themes: ["bravery", "loyalty", "protection"],
    description: "A brave mongoose protects his adopted family.",
    readingLevel: "B1"
  },

  // Kate Chopin - Simple prose
  {
    slug: "the-story-of-an-hour",
    title: "The Story of an Hour",
    author: "Kate Chopin",
    gutenbergId: 160,
    category: "slice-of-life",
    themes: ["freedom", "emotion", "surprise"],
    description: "A woman experiences a range of emotions in one hour.",
    readingLevel: "B1"
  },

  // Katherine Mansfield - Slice of life
  {
    slug: "the-garden-party",
    title: "The Garden Party",
    author: "Katherine Mansfield",
    gutenbergId: 1429,
    category: "slice-of-life",
    themes: ["growing up", "class", "empathy"],
    description: "A young woman gains new perspective at a party.",
    readingLevel: "B2"
  },
  {
    slug: "miss-brill",
    title: "Miss Brill",
    author: "Katherine Mansfield",
    gutenbergId: 1429,
    category: "slice-of-life",
    themes: ["loneliness", "imagination", "reality"],
    description: "An elderly woman enjoys her Sunday routine.",
    readingLevel: "B1"
  },

  // Guy de Maupassant
  {
    slug: "the-necklace",
    title: "The Necklace",
    author: "Guy de Maupassant",
    gutenbergId: 3090,
    category: "moral",
    themes: ["honesty", "pride", "consequences"],
    description: "A borrowed necklace changes a woman's life.",
    readingLevel: "B1"
  },
];

const STORY_CATEGORIES = [
  { slug: 'all', label: 'All Stories' },
  { slug: 'mystery', label: 'Mystery' },
  { slug: 'love', label: 'Love' },
  { slug: 'humor', label: 'Humor' },
  { slug: 'moral', label: 'Moral Tales' },
  { slug: 'adventure', label: 'Adventure' },
  { slug: 'slice-of-life', label: 'Slice of Life' },
];

const AUTHOR_BIOS = {
  "O. Henry": "O. Henry (1862-1910) was an American short story writer known for his clever plot twists and warm portrayals of everyday people. His real name was William Sydney Porter.",
  "Oscar Wilde": "Oscar Wilde (1854-1900) was an Irish writer famous for his wit, plays, and fairy tales. His stories often contain moral lessons wrapped in beautiful prose.",
  "Anton Chekhov": "Anton Chekhov (1860-1904) was a Russian writer and physician. He is considered one of the greatest short story writers, known for his deep understanding of human nature.",
  "Arthur Conan Doyle": "Arthur Conan Doyle (1859-1930) was a British writer best known for creating the detective Sherlock Holmes. His mystery stories are celebrated for their clever plots.",
  "Mark Twain": "Mark Twain (1835-1910) was an American writer and humorist. His real name was Samuel Clemens. He is known for his wit and storytelling ability.",
  "Saki": "Saki (1870-1916) was the pen name of British writer H.H. Munro. He wrote witty, sometimes dark short stories with unexpected endings.",
  "Rudyard Kipling": "Rudyard Kipling (1865-1936) was a British writer born in India. He wrote stories and poems for both children and adults, winning the Nobel Prize in Literature.",
  "Kate Chopin": "Kate Chopin (1850-1904) was an American author known for her short stories about women's lives in the late 19th century.",
  "Katherine Mansfield": "Katherine Mansfield (1888-1923) was a New Zealand writer who revolutionized the short story form with her modernist approach.",
  "Guy de Maupassant": "Guy de Maupassant (1850-1893) was a French writer considered a master of the short story form. His stories often feature twist endings and social commentary."
};

module.exports = { SEED_STORIES, STORY_CATEGORIES, AUTHOR_BIOS };
