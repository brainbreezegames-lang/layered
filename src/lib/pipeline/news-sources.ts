export const NEWS_SOURCES = [
  // BBC
  { name: "BBC World", url: "http://feeds.bbci.co.uk/news/world/rss.xml", category: "world" },
  { name: "BBC Science", url: "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml", category: "science" },

  // The Guardian
  { name: "Guardian World", url: "https://www.theguardian.com/world/rss", category: "world" },
  { name: "Guardian Culture", url: "https://www.theguardian.com/culture/rss", category: "culture" },
  { name: "Guardian Sport", url: "https://www.theguardian.com/sport/rss", category: "sports" },
  { name: "Guardian Science", url: "https://www.theguardian.com/science/rss", category: "science" },

  // NPR
  { name: "NPR News", url: "https://feeds.npr.org/1001/rss.xml", category: "world" },

  // Science Daily
  { name: "Science Daily", url: "https://www.sciencedaily.com/rss/all.xml", category: "science" },
];

export type NewsSource = typeof NEWS_SOURCES[number];
