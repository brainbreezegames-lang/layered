/**
 * Seed Travel Data
 *
 * Seeds sample travel destinations and phrases into the database
 * Usage: node scripts/seed-travel.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Sample destination data
const sampleDestinations = [
  {
    slug: 'london',
    wikiTitle: 'London',
    name: 'London',
    country: 'United Kingdom',
    region: 'europe',
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200',
    description: 'The historic capital of England, known for its royal heritage, world-class museums, and vibrant culture.',
  },
  {
    slug: 'paris',
    wikiTitle: 'Paris',
    name: 'Paris',
    country: 'France',
    region: 'europe',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
    description: 'The City of Light, famous for the Eiffel Tower, art museums, and romantic atmosphere.',
  },
  {
    slug: 'tokyo',
    wikiTitle: 'Tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'asia',
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    description: 'A fascinating blend of ancient traditions and cutting-edge technology.',
  },
  {
    slug: 'new-york-city',
    wikiTitle: 'New York City',
    name: 'New York City',
    country: 'United States',
    region: 'americas',
    heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200',
    description: 'The city that never sleeps, home to iconic landmarks like the Statue of Liberty and Times Square.',
  },
  {
    slug: 'sydney',
    wikiTitle: 'Sydney',
    name: 'Sydney',
    country: 'Australia',
    region: 'oceania',
    heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200',
    description: 'Australia\'s largest city, famous for its Opera House and beautiful harbour.',
  },
];

// Sample sections for London
const londonSections = [
  {
    slug: 'getting-there',
    title: 'Getting There',
    sectionType: 'get-in',
    orderIndex: 1,
    content: {
      A1: 'London has big airports. Heathrow is the biggest. You can take a train or bus to the city. The train is fast. The bus is cheap.',
      A2: 'London has several airports. Heathrow is the largest and most popular. You can take the Heathrow Express train to the city center in 15 minutes. The Underground is cheaper but takes longer.',
      B1: 'London is served by several major airports. Heathrow, located west of the city, is the largest and handles most international flights. Gatwick, to the south, is the second largest. The Heathrow Express offers a quick 15-minute journey to Paddington Station, while the Underground provides a more affordable option.',
      B2: 'London boasts excellent transport connections with five airports serving the metropolitan area. Heathrow Airport, situated approximately 24 kilometers west of central London, handles the majority of long-haul international flights. The Heathrow Express provides a premium 15-minute service to Paddington, while the Piccadilly line offers a budget-friendly alternative taking around 50 minutes.',
      C1: 'As one of the world\'s most connected cities, London is served by a comprehensive network of five international airports. Heathrow, the UK\'s busiest airport and one of the world\'s major aviation hubs, handles predominantly long-haul and European traffic. Transport options range from the premium Heathrow Express—offering a seamless 15-minute journey to Paddington—to the economical Piccadilly line, which, while slower, provides direct access to numerous central London stations.',
    },
    exercises: {
      A1: {
        comprehension: [
          { question: 'What is the biggest airport in London?', options: ['Gatwick', 'Heathrow', 'Stansted'], correct: 1 },
        ],
        trueOrFalse: [
          { statement: 'The bus is faster than the train.', correct: false },
        ],
      },
      A2: {
        comprehension: [
          { question: 'How long does the Heathrow Express take?', options: ['5 minutes', '15 minutes', '30 minutes'], correct: 1 },
        ],
      },
      B1: {
        comprehension: [
          { question: 'Where is Heathrow Airport located?', options: ['North of London', 'South of London', 'West of London'], correct: 2 },
        ],
      },
      B2: {
        comprehension: [
          { question: 'Which line provides budget-friendly transport from Heathrow?', options: ['Victoria line', 'Piccadilly line', 'Central line'], correct: 1 },
        ],
      },
      C1: {
        comprehension: [
          { question: 'What type of traffic does Heathrow predominantly handle?', options: ['Domestic flights only', 'Long-haul and European traffic', 'Cargo only'], correct: 1 },
        ],
      },
    },
    vocabulary: [
      { word: 'airport', definition: 'A place where planes take off and land', level: 'A1' },
      { word: 'express', definition: 'A fast train or bus service', level: 'A2' },
      { word: 'metropolitan', definition: 'Relating to a large city', level: 'B2' },
    ],
    wordCounts: { A1: 35, A2: 55, B1: 80, B2: 100, C1: 120 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
  },
  {
    slug: 'getting-around',
    title: 'Getting Around',
    sectionType: 'get-around',
    orderIndex: 2,
    content: {
      A1: 'London has buses and trains. The Underground is called "the Tube." You can walk in the city center. Buy an Oyster card for travel.',
      A2: 'London has an excellent public transport system. The Underground, known as the Tube, is the fastest way to travel. Red double-decker buses are iconic. Get an Oyster card or use contactless payment.',
      B1: 'London offers one of the world\'s most comprehensive public transport networks. The Underground, affectionately known as the Tube, comprises 11 lines serving 270 stations. The iconic red double-decker buses cover routes not served by the Tube. An Oyster card or contactless bank card provides the most economical way to travel.',
      B2: 'London\'s public transport system is renowned for its efficiency and coverage. The Underground network, colloquially referred to as the Tube, operates 11 lines across 270 stations, making it one of the oldest and most extensive metro systems globally. Complementing this are the distinctive red double-decker buses, river boats, and the Docklands Light Railway.',
      C1: 'London possesses one of the most sophisticated public transport networks in the world, seamlessly integrating various modes of travel. The Underground, established in 1863 as the world\'s first subterranean railway, now encompasses 11 lines traversing 270 stations. This extensive network is complemented by an intricate bus system featuring the iconic Routemaster double-deckers, Thames river services, and the automated Docklands Light Railway.',
    },
    exercises: {
      A1: {
        comprehension: [
          { question: 'What is the Underground called?', options: ['The Metro', 'The Tube', 'The Train'], correct: 1 },
        ],
      },
      A2: {
        comprehension: [
          { question: 'What color are London buses?', options: ['Blue', 'Green', 'Red'], correct: 2 },
        ],
      },
      B1: {
        comprehension: [
          { question: 'How many stations does the Tube have?', options: ['170', '270', '370'], correct: 1 },
        ],
      },
      B2: {
        comprehension: [
          { question: 'What does DLR stand for?', options: ['Direct London Rail', 'Docklands Light Railway', 'Downtown Local Railway'], correct: 1 },
        ],
      },
      C1: {
        comprehension: [
          { question: 'When was the Underground established?', options: ['1863', '1903', '1923'], correct: 0 },
        ],
      },
    },
    vocabulary: [
      { word: 'underground', definition: 'A railway system that runs below ground', level: 'A1' },
      { word: 'double-decker', definition: 'A bus with two floors', level: 'A2' },
      { word: 'subterranean', definition: 'Existing or occurring under the earth\'s surface', level: 'C1' },
    ],
    wordCounts: { A1: 30, A2: 50, B1: 75, B2: 95, C1: 115 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
  },
  {
    slug: 'what-to-see',
    title: 'What to See',
    sectionType: 'see',
    orderIndex: 3,
    content: {
      A1: 'See Big Ben and the Tower of London. Visit Buckingham Palace. The British Museum is free. Walk in Hyde Park.',
      A2: 'London has many famous sights. Big Ben and the Houses of Parliament are iconic. Visit the Tower of London to see the Crown Jewels. Buckingham Palace is where the King lives. Many museums are free, including the British Museum and Natural History Museum.',
      B1: 'London offers an extraordinary array of attractions. The Tower of London, a UNESCO World Heritage Site, houses the Crown Jewels and has served as a royal palace, prison, and treasury. The British Museum contains over 8 million works spanning human history. Westminster Abbey has witnessed every coronation since 1066.',
      B2: 'London\'s cultural heritage is unparalleled, offering visitors an exceptional range of historical and contemporary attractions. The Tower of London, established by William the Conqueror in 1066, serves as both a monument to Norman conquest and a repository for the Crown Jewels. The British Museum, with its collection of over 8 million artefacts, provides an encyclopedic journey through human civilisation.',
      C1: 'London\'s rich tapestry of cultural and historical attractions reflects its status as one of the world\'s great cities. The Tower of London, commenced by William the Conqueror following his conquest in 1066, has variously served as a royal residence, armoury, treasury, menagerie, and state prison. Today, it houses the Crown Jewels and hosts the Yeoman Warders, whose ceremonial duties date back centuries. The British Museum, founded in 1753, contains over 8 million works representing the entirety of human cultural achievement.',
    },
    exercises: {
      A1: {
        comprehension: [
          { question: 'Which museum is free?', options: ['London Zoo', 'British Museum', 'Madame Tussauds'], correct: 1 },
        ],
      },
      A2: {
        comprehension: [
          { question: 'What can you see at the Tower of London?', options: ['The Crown Jewels', 'Big Ben', 'Hyde Park'], correct: 0 },
        ],
      },
      B1: {
        comprehension: [
          { question: 'How many works does the British Museum contain?', options: ['1 million', '8 million', '20 million'], correct: 1 },
        ],
      },
      B2: {
        comprehension: [
          { question: 'Who established the Tower of London?', options: ['Henry VIII', 'Queen Victoria', 'William the Conqueror'], correct: 2 },
        ],
      },
      C1: {
        comprehension: [
          { question: 'When was the British Museum founded?', options: ['1653', '1753', '1853'], correct: 1 },
        ],
      },
    },
    vocabulary: [
      { word: 'palace', definition: 'A large house where a king or queen lives', level: 'A1' },
      { word: 'heritage', definition: 'Traditions and buildings from the past', level: 'B1' },
      { word: 'repository', definition: 'A place where things are stored', level: 'C1' },
    ],
    wordCounts: { A1: 25, A2: 60, B1: 85, B2: 105, C1: 135 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
  },
];

// Sample travel phrases
const samplePhrases = [
  {
    slug: 'at-the-airport',
    title: 'At the Airport',
    category: 'airport',
    icon: '✈️',
    content: {
      A1: 'Hello. My name is... Where is my gate? I need help. Thank you.',
      A2: 'Where is the check-in desk? Is this the right gate for London? My flight is delayed. Can I have a window seat?',
      B1: 'Excuse me, could you tell me where the check-in desk for British Airways is? I\'d like to request an aisle seat if possible. Is there anywhere I can leave my luggage while I wait?',
      B2: 'I\'m afraid my connecting flight was delayed, and I\'ve missed my connection. Could you help me rebook onto the next available flight? I also need to locate my checked baggage.',
      C1: 'I appear to have been inadvertently offloaded from my original flight due to overbooking. I understand these situations occur, but I would appreciate it if you could expedite my rebooking onto the next available service, preferably with comparable seating arrangements.',
    },
    exercises: {
      A1: { comprehension: [{ question: 'What do you say to be polite?', options: ['Stop', 'Thank you', 'No'], correct: 1 }] },
      A2: { comprehension: [{ question: 'Where do you go first at the airport?', options: ['The gate', 'The check-in desk', 'The shop'], correct: 1 }] },
      B1: { comprehension: [{ question: 'What kind of seat is by the aisle?', options: ['Window seat', 'Aisle seat', 'Middle seat'], correct: 1 }] },
      B2: { comprehension: [{ question: 'What happened to the flight?', options: ['It was early', 'It was delayed', 'It was cancelled'], correct: 1 }] },
      C1: { comprehension: [{ question: 'What does "offloaded" mean?', options: ['Upgraded', 'Removed from the flight', 'Given extra luggage'], correct: 1 }] },
    },
    vocabulary: [
      { word: 'gate', definition: 'The door to get on the airplane', level: 'A1' },
      { word: 'delayed', definition: 'Late; not on time', level: 'A2' },
      { word: 'connecting flight', definition: 'A second flight you take after the first one', level: 'B1' },
      { word: 'inadvertently', definition: 'By accident; without meaning to', level: 'C1' },
    ],
    wordCounts: { A1: 15, A2: 30, B1: 50, B2: 45, C1: 55 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 1, C1: 1 },
  },
  {
    slug: 'at-the-hotel',
    title: 'At the Hotel',
    category: 'hotel',
    icon: '🏨',
    content: {
      A1: 'I have a reservation. My room, please. Where is the bathroom? Thank you.',
      A2: 'I have a reservation under the name Smith. What time is check-out? Is breakfast included? Can I have an extra towel?',
      B1: 'Good evening, I have a reservation for two nights under the name Johnson. Could you confirm the room has a view of the garden? Also, I\'d like to arrange a wake-up call for 7 AM tomorrow.',
      B2: 'I\'d like to enquire about upgrading my room to a suite, if one is available. Additionally, could you recommend some local restaurants? I\'m particularly interested in trying authentic local cuisine.',
      C1: 'I understand you offer a concierge service. I\'d be most grateful if you could arrange theatre tickets for this evening—preferably something in the West End. Furthermore, I require the services of your business centre for a video conference tomorrow morning.',
    },
    exercises: {
      A1: { comprehension: [{ question: 'What do you have?', options: ['A problem', 'A reservation', 'A question'], correct: 1 }] },
      A2: { comprehension: [{ question: 'What is included with the room?', options: ['Dinner', 'Breakfast', 'Lunch'], correct: 1 }] },
      B1: { comprehension: [{ question: 'What does the guest want?', options: ['A wake-up call', 'A taxi', 'A meal'], correct: 0 }] },
      B2: { comprehension: [{ question: 'What kind of food is the guest interested in?', options: ['Fast food', 'Authentic local cuisine', 'Italian food'], correct: 1 }] },
      C1: { comprehension: [{ question: 'What does "concierge" mean?', options: ['A hotel helper', 'A room type', 'A restaurant'], correct: 0 }] },
    },
    vocabulary: [
      { word: 'reservation', definition: 'A booking; when you save a room', level: 'A1' },
      { word: 'check-out', definition: 'When you leave the hotel', level: 'A2' },
      { word: 'suite', definition: 'A large, expensive hotel room', level: 'B1' },
      { word: 'concierge', definition: 'A hotel employee who helps guests', level: 'B2' },
    ],
    wordCounts: { A1: 15, A2: 30, B1: 50, B2: 45, C1: 55 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 1, C1: 1 },
  },
  {
    slug: 'at-the-restaurant',
    title: 'At the Restaurant',
    category: 'restaurant',
    icon: '🍽️',
    content: {
      A1: 'A table for two, please. The menu, please. Water, please. The bill, please.',
      A2: 'Do you have a table for four? Can I see the menu? I\'d like the chicken, please. Could I have the bill?',
      B1: 'Good evening, do you have a table available for this evening? We don\'t have a reservation. Could you recommend something from the menu? I\'m vegetarian. Does this dish contain nuts?',
      B2: 'We\'d like to see the wine list, please. Could you recommend a wine that pairs well with the fish? I have a severe nut allergy—could you ensure the kitchen is aware? Also, we\'re celebrating a birthday.',
      C1: 'We\'d appreciate a quiet table if possible—we have some business to discuss. Could you walk us through today\'s specials? I\'m particularly interested in locally sourced ingredients. Also, could we arrange for the sommelier to suggest an appropriate wine pairing for each course?',
    },
    exercises: {
      A1: { comprehension: [{ question: 'How many people want a table?', options: ['One', 'Two', 'Three'], correct: 1 }] },
      A2: { comprehension: [{ question: 'What food does the person order?', options: ['Fish', 'Chicken', 'Beef'], correct: 1 }] },
      B1: { comprehension: [{ question: 'What does the person not eat?', options: ['Fish', 'Meat', 'Vegetables'], correct: 1 }] },
      B2: { comprehension: [{ question: 'What is the person allergic to?', options: ['Milk', 'Nuts', 'Eggs'], correct: 1 }] },
      C1: { comprehension: [{ question: 'What is a sommelier?', options: ['A chef', 'A wine expert', 'A waiter'], correct: 1 }] },
    },
    vocabulary: [
      { word: 'menu', definition: 'A list of food and drinks', level: 'A1' },
      { word: 'bill', definition: 'The paper showing how much to pay', level: 'A1' },
      { word: 'allergy', definition: 'When food makes you sick', level: 'B1' },
      { word: 'sommelier', definition: 'A person who knows about wine', level: 'C1' },
    ],
    wordCounts: { A1: 20, A2: 30, B1: 50, B2: 55, C1: 65 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 1, C1: 1 },
  },
];

async function seedDestinations() {
  console.log('Seeding destinations...');

  for (const dest of sampleDestinations) {
    const { error } = await supabase
      .from('Destination')
      .upsert(dest, { onConflict: 'slug' });

    if (error) {
      console.error(`Error seeding ${dest.name}:`, error.message);
    } else {
      console.log(`Seeded destination: ${dest.name}`);
    }
  }
}

async function seedLondonSections() {
  console.log('Seeding London sections...');

  // Get London's ID
  const { data: london } = await supabase
    .from('Destination')
    .select('id')
    .eq('slug', 'london')
    .single();

  if (!london) {
    console.error('London destination not found');
    return;
  }

  for (const section of londonSections) {
    const { error } = await supabase
      .from('DestinationSection')
      .upsert({
        ...section,
        destinationId: london.id,
      }, { onConflict: 'destinationId,slug' });

    if (error) {
      console.error(`Error seeding section ${section.title}:`, error.message);
    } else {
      console.log(`Seeded section: ${section.title}`);
    }
  }
}

async function seedPhrases() {
  console.log('Seeding travel phrases...');

  for (const phrase of samplePhrases) {
    const { error } = await supabase
      .from('TravelPhrase')
      .upsert(phrase, { onConflict: 'slug' });

    if (error) {
      console.error(`Error seeding ${phrase.title}:`, error.message);
    } else {
      console.log(`Seeded phrase: ${phrase.title}`);
    }
  }
}

async function main() {
  console.log('Starting travel data seed...\n');

  await seedDestinations();
  await seedLondonSections();
  await seedPhrases();

  console.log('\nTravel data seed complete!');
}

main().catch(console.error);
