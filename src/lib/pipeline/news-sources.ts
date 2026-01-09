export const NEWS_SOURCES = [
  // === WORLD ===
  { name: "BBC World", url: "http://feeds.bbci.co.uk/news/world/rss.xml", category: "world" },
  { name: "Guardian World", url: "https://www.theguardian.com/world/rss", category: "world" },
  { name: "NPR News", url: "https://feeds.npr.org/1001/rss.xml", category: "world" },

  // === SCIENCE ===
  { name: "BBC Science", url: "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml", category: "science" },
  { name: "Guardian Science", url: "https://www.theguardian.com/science/rss", category: "science" },
  { name: "Science Daily", url: "https://www.sciencedaily.com/rss/all.xml", category: "science" },

  // === SPORTS ===
  { name: "BBC Sport", url: "http://feeds.bbci.co.uk/sport/rss.xml", category: "sports" },
  { name: "Guardian Sport", url: "https://www.theguardian.com/sport/rss", category: "sports" },
  { name: "ESPN", url: "https://www.espn.com/espn/rss/news", category: "sports" },

  // === CULTURE ===
  { name: "Guardian Culture", url: "https://www.theguardian.com/culture/rss", category: "culture" },
  { name: "Guardian Film", url: "https://www.theguardian.com/film/rss", category: "culture" },
  { name: "Guardian Music", url: "https://www.theguardian.com/music/rss", category: "culture" },
  { name: "BBC Entertainment", url: "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml", category: "culture" },

  // === FUN (Lifestyle, Travel, Food) ===
  { name: "Guardian Travel", url: "https://www.theguardian.com/travel/rss", category: "fun" },
  { name: "Guardian Food", url: "https://www.theguardian.com/food/rss", category: "fun" },
  { name: "Guardian Lifestyle", url: "https://www.theguardian.com/lifeandstyle/rss", category: "fun" },
];

export type NewsSource = typeof NEWS_SOURCES[number];
