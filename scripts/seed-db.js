const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://otittsnvduydvqqzsxsm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aXR0c252ZHV5ZHZxcXpzeHNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzc4NjgzNCwiZXhwIjoyMDgzMzYyODM0fQ.Mx_EatSD5ZJbq2xjpr0msuLywWAiNyqmFmwEZjOU6RM'
);

const sampleArticles = [
  {
    id: 'c1',
    slug: 'scientists-discover-ocean-microplastics',
    title: 'Scientists Discover Microplastics in Remote Ocean Waters',
    subtitle: 'New research reveals alarming levels of plastic pollution in isolated marine areas',
    category: 'science',
    source: 'Science Daily',
    sourceUrl: 'https://example.com/ocean-microplastics-001',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
    heroAlt: 'Ocean research vessel',
    content: {
      A1: 'Scientists found tiny plastic in the ocean. The plastic is very small. We cannot see it. It is in the water. Fish eat this plastic. This is bad for fish. This is bad for us too. We need to stop using plastic.',
      A2: 'Scientists have found very small pieces of plastic in the ocean. These pieces are called microplastics. They are too small to see with our eyes. The plastic comes from our bottles and bags. Fish and sea animals eat this plastic by mistake. This can make them sick. The plastic can also end up in our food.',
      B1: 'Marine researchers have discovered alarming levels of microplastics in remote areas of the ocean. These tiny plastic fragments, often smaller than a grain of rice, have been found in water samples from some of the most isolated parts of the world. The particles come from the breakdown of larger plastic items like bottles and packaging. Scientists are concerned about the impact on marine ecosystems.',
      B2: 'A groundbreaking study has revealed that microplastics have infiltrated even the most remote oceanic regions, far from human habitation. Researchers collected water samples from locations thousands of miles from any coastline and found significant concentrations of plastic particles. These microscopic fragments originate from the degradation of consumer plastics and pose a considerable threat to marine food chains.',
      C1: 'An unprecedented investigation into oceanic pollution has exposed the pervasive nature of microplastic contamination across the world high seas. The comprehensive study, involving samples from over 50 remote locations, demonstrates that anthropogenic plastic waste has become ubiquitous in marine environments. Researchers found microplastic concentrations averaging 15 particles per litre of seawater, with implications for bioaccumulation throughout marine food webs.'
    },
    exercises: {
      A1: { comprehension: [{ id: '1', question: 'What did scientists find?', options: [{ id: 'a', text: 'Big fish' }, { id: 'b', text: 'Tiny plastic' }, { id: 'c', text: 'Clean water' }, { id: 'd', text: 'New islands' }], correctAnswer: 'b', explanation: 'The article says scientists found tiny plastic.' }] },
      A2: { comprehension: [{ id: '1', question: 'What are microplastics?', options: [{ id: 'a', text: 'Big bottles' }, { id: 'b', text: 'Very small pieces of plastic' }, { id: 'c', text: 'Fish food' }, { id: 'd', text: 'Ocean waves' }], correctAnswer: 'b', explanation: 'Microplastics are very small pieces of plastic.' }] },
      B1: { comprehension: [{ id: '1', question: 'Where did researchers find microplastics?', options: [{ id: 'a', text: 'Only near beaches' }, { id: 'b', text: 'In remote ocean areas' }, { id: 'c', text: 'In rivers only' }, { id: 'd', text: 'In lakes' }], correctAnswer: 'b', explanation: 'The article mentions microplastics were found in remote areas of the ocean.' }] },
      B2: { comprehension: [{ id: '1', question: 'What threat do microplastics pose?', options: [{ id: 'a', text: 'To marine food chains' }, { id: 'b', text: 'To mountain ecosystems' }, { id: 'c', text: 'To desert animals' }, { id: 'd', text: 'To forests' }], correctAnswer: 'a', explanation: 'The article states microplastics pose a threat to marine food chains.' }] },
      C1: { comprehension: [{ id: '1', question: 'What concentration of microplastics did researchers find?', options: [{ id: 'a', text: '5 particles per litre' }, { id: 'b', text: '15 particles per litre' }, { id: 'c', text: '50 particles per litre' }, { id: 'd', text: '100 particles per litre' }], correctAnswer: 'b', explanation: 'Researchers found an average of 15 particles per litre.' }] }
    },
    wordCounts: { A1: 50, A2: 85, B1: 120, B2: 145, C1: 180 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 2, C1: 2 },
    publishedAt: '2026-01-06T10:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c2',
    slug: 'new-ai-model-breaks-language-barriers',
    title: 'New AI Model Breaks Language Barriers',
    subtitle: 'Revolutionary technology enables real-time translation across 200 languages',
    category: 'science',
    source: 'Tech Review',
    sourceUrl: 'https://example.com/ai-translation-002',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    heroAlt: 'AI technology concept',
    content: {
      A1: 'A new computer program can translate languages. It works very fast. You speak in English. The program changes it to Spanish or French. It knows 200 languages. This helps people talk to each other. It is like magic.',
      A2: 'Scientists have created a new AI program that can translate between languages instantly. When you speak, the program listens and translates your words into another language. It can work with 200 different languages. This technology will help people from different countries communicate more easily.',
      B1: 'A breakthrough in artificial intelligence has produced a translation system capable of converting speech between 200 languages in real time. The new technology uses advanced machine learning to understand not just words, but context and cultural nuances. Early tests show accuracy rates of over 95%, making it more reliable than previous translation tools.',
      B2: 'Researchers have unveiled an artificial intelligence model that represents a significant leap forward in automated translation technology. The system can process spoken language in real time, converting it into any of 200 supported languages with remarkable accuracy. Unlike earlier translation tools, this model grasps idiomatic expressions and cultural context.',
      C1: 'A paradigm-shifting development in computational linguistics has yielded an AI translation system of unprecedented capability. The model employs sophisticated neural network architectures to achieve real-time conversion across 200 languages while preserving semantic nuance and pragmatic intent. Preliminary evaluations demonstrate translation fidelity exceeding 95%, representing a quantum leap from previous automated translation systems.'
    },
    exercises: {
      A1: { comprehension: [{ id: '1', question: 'How many languages can the program translate?', options: [{ id: 'a', text: '50' }, { id: 'b', text: '100' }, { id: 'c', text: '200' }, { id: 'd', text: '500' }], correctAnswer: 'c', explanation: 'The program can translate 200 languages.' }] },
      A2: { comprehension: [{ id: '1', question: 'What does the AI program do?', options: [{ id: 'a', text: 'Play games' }, { id: 'b', text: 'Translate languages' }, { id: 'c', text: 'Write stories' }, { id: 'd', text: 'Draw pictures' }], correctAnswer: 'b', explanation: 'The AI program translates languages.' }] },
      B1: { comprehension: [{ id: '1', question: 'What accuracy rate does the translation system achieve?', options: [{ id: 'a', text: 'Over 75%' }, { id: 'b', text: 'Over 85%' }, { id: 'c', text: 'Over 95%' }, { id: 'd', text: '100%' }], correctAnswer: 'c', explanation: 'The system shows accuracy rates over 95%.' }] },
      B2: { comprehension: [{ id: '1', question: 'What makes this model different from earlier tools?', options: [{ id: 'a', text: 'It is slower' }, { id: 'b', text: 'It understands idioms and cultural context' }, { id: 'c', text: 'It only works offline' }, { id: 'd', text: 'It costs more' }], correctAnswer: 'b', explanation: 'This model grasps idiomatic expressions and cultural context.' }] },
      C1: { comprehension: [{ id: '1', question: 'What type of architecture does the model employ?', options: [{ id: 'a', text: 'Simple algorithms' }, { id: 'b', text: 'Sophisticated neural network architectures' }, { id: 'c', text: 'Basic rule-based systems' }, { id: 'd', text: 'Manual translation protocols' }], correctAnswer: 'b', explanation: 'The model employs sophisticated neural network architectures.' }] }
    },
    wordCounts: { A1: 48, A2: 72, B1: 110, B2: 135, C1: 168 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 2, C1: 2 },
    publishedAt: '2026-01-05T14:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c3',
    slug: 'ancient-city-discovered-amazon-rainforest',
    title: 'Ancient City Discovered in Amazon Rainforest',
    subtitle: 'Archaeologists uncover a lost civilization hidden beneath the jungle canopy',
    category: 'culture',
    source: 'Archaeology Today',
    sourceUrl: 'https://example.com/amazon-city-003',
    heroImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200',
    heroAlt: 'Amazon rainforest canopy',
    content: {
      A1: 'Scientists found an old city in the jungle. The city was hiding under trees for many years. People lived there long ago. They built big buildings. Now we can see the city. It is very exciting news.',
      A2: 'Archaeologists have discovered the remains of an ancient city deep in the Amazon rainforest. The city was hidden under thick jungle for hundreds of years. Scientists used special technology to see through the trees. They found roads, buildings, and public squares. Many people lived in this city long ago.',
      B1: 'A team of archaeologists has made an extraordinary discovery in the heart of the Amazon rainforest. Using laser scanning technology called LiDAR, they have revealed the remains of a previously unknown city hidden beneath the dense jungle canopy. The settlement appears to date back over 1,000 years and includes sophisticated infrastructure such as roads, agricultural terraces, and ceremonial buildings.',
      B2: 'An archaeological expedition has uncovered evidence of a substantial ancient urban centre concealed within the Amazon rainforest. The discovery, made possible by aerial LiDAR surveys, has revealed an extensive network of structures and infrastructure that challenges previous assumptions about pre-Columbian civilizations in the region. The site includes complex water management systems and public architecture.',
      C1: 'A watershed archaeological discovery has fundamentally altered our understanding of pre-Columbian Amazonian civilizations. Employing state-of-the-art LiDAR technology, researchers have identified an elaborate urban complex sprawling beneath the rainforest canopy, suggesting sophisticated societal organization previously thought impossible in this ecosystem. The findings indicate a thriving metropolis with advanced hydraulic engineering and monumental architecture.'
    },
    exercises: {
      A1: { comprehension: [{ id: '1', question: 'Where was the city found?', options: [{ id: 'a', text: 'In the desert' }, { id: 'b', text: 'In the jungle' }, { id: 'c', text: 'In the ocean' }, { id: 'd', text: 'On a mountain' }], correctAnswer: 'b', explanation: 'The city was found in the jungle.' }] },
      A2: { comprehension: [{ id: '1', question: 'How was the city hidden?', options: [{ id: 'a', text: 'Under sand' }, { id: 'b', text: 'Under thick jungle' }, { id: 'c', text: 'Under water' }, { id: 'd', text: 'Under ice' }], correctAnswer: 'b', explanation: 'The city was hidden under thick jungle.' }] },
      B1: { comprehension: [{ id: '1', question: 'What technology was used to find the city?', options: [{ id: 'a', text: 'X-ray' }, { id: 'b', text: 'LiDAR' }, { id: 'c', text: 'Radar' }, { id: 'd', text: 'Sonar' }], correctAnswer: 'b', explanation: 'Scientists used LiDAR laser scanning technology.' }] },
      B2: { comprehension: [{ id: '1', question: 'What systems did the site include?', options: [{ id: 'a', text: 'Simple huts only' }, { id: 'b', text: 'Complex water management systems' }, { id: 'c', text: 'Modern electricity' }, { id: 'd', text: 'Railway systems' }], correctAnswer: 'b', explanation: 'The site includes complex water management systems.' }] },
      C1: { comprehension: [{ id: '1', question: 'What does the discovery suggest about the civilization?', options: [{ id: 'a', text: 'They were primitive' }, { id: 'b', text: 'They had sophisticated societal organization' }, { id: 'c', text: 'They were nomadic' }, { id: 'd', text: 'They had no technology' }], correctAnswer: 'b', explanation: 'The findings indicate sophisticated societal organization.' }] }
    },
    wordCounts: { A1: 45, A2: 78, B1: 118, B2: 140, C1: 165 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 2, C1: 2 },
    publishedAt: '2026-01-04T09:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c4',
    slug: 'world-cup-finals-draw-record-viewers',
    title: 'World Cup Finals Draw Record Viewers',
    subtitle: 'Historic match becomes most-watched sporting event in television history',
    category: 'sports',
    source: 'Sports Weekly',
    sourceUrl: 'https://example.com/world-cup-004',
    heroImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
    heroAlt: 'Football stadium',
    content: {
      A1: 'The World Cup final was on TV. Many people watched it. It was the most watched game ever. Billions of people saw it. The game was very exciting. The winner was very happy.',
      A2: 'The World Cup final has broken all TV records. More than 5 billion people around the world watched the match. This makes it the most-watched sporting event in history. The game was very exciting and went to extra time. Fans everywhere celebrated together.',
      B1: 'The World Cup final has become the most-watched sporting event in television history, with an estimated global audience exceeding 5 billion viewers. The thrilling match, which was decided in extra time, captivated audiences across every continent. Broadcasters reported unprecedented streaming numbers alongside traditional television viewership.',
      B2: 'In a historic broadcasting milestone, the World Cup final has shattered all previous viewership records, attracting an estimated 5.2 billion viewers worldwide. The dramatic conclusion, determined in the final minutes of extra time, generated record-breaking social media engagement and unprecedented streaming traffic. The event transcended sport to become a global cultural phenomenon.',
      C1: 'The World Cup final has established an unprecedented benchmark in global broadcasting, with preliminary audience estimates suggesting upwards of 5.2 billion concurrent viewers across all platforms. This watershed moment in sports media history reflects the tournament capacity to unite a fragmented global audience. The theatrical denouement, resolved in additional time, precipitated extraordinary levels of real-time digital engagement.'
    },
    exercises: {
      A1: { comprehension: [{ id: '1', question: 'What did people watch?', options: [{ id: 'a', text: 'A movie' }, { id: 'b', text: 'The World Cup final' }, { id: 'c', text: 'A news show' }, { id: 'd', text: 'A concert' }], correctAnswer: 'b', explanation: 'People watched the World Cup final.' }] },
      A2: { comprehension: [{ id: '1', question: 'How many people watched the match?', options: [{ id: 'a', text: '1 million' }, { id: 'b', text: '100 million' }, { id: 'c', text: '1 billion' }, { id: 'd', text: 'More than 5 billion' }], correctAnswer: 'd', explanation: 'More than 5 billion people watched the match.' }] },
      B1: { comprehension: [{ id: '1', question: 'How was the match decided?', options: [{ id: 'a', text: 'In regular time' }, { id: 'b', text: 'In extra time' }, { id: 'c', text: 'By coin toss' }, { id: 'd', text: 'It was cancelled' }], correctAnswer: 'b', explanation: 'The match was decided in extra time.' }] },
      B2: { comprehension: [{ id: '1', question: 'What made this event special beyond sport?', options: [{ id: 'a', text: 'The low cost' }, { id: 'b', text: 'It became a global cultural phenomenon' }, { id: 'c', text: 'The small stadium' }, { id: 'd', text: 'The short duration' }], correctAnswer: 'b', explanation: 'The event transcended sport to become a global cultural phenomenon.' }] },
      C1: { comprehension: [{ id: '1', question: 'What capacity does the article attribute to the tournament?', options: [{ id: 'a', text: 'To divide audiences' }, { id: 'b', text: 'To unite a fragmented global audience' }, { id: 'c', text: 'To exclude viewers' }, { id: 'd', text: 'To limit engagement' }], correctAnswer: 'b', explanation: 'The tournament has capacity to unite a fragmented global audience.' }] }
    },
    wordCounts: { A1: 42, A2: 68, B1: 95, B2: 125, C1: 155 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 2, C1: 2 },
    publishedAt: '2026-01-03T20:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c5',
    slug: 'global-leaders-agree-on-climate-action',
    title: 'Global Leaders Agree on Climate Action',
    subtitle: 'Historic summit produces binding commitments to reduce carbon emissions',
    category: 'world',
    source: 'World News',
    sourceUrl: 'https://example.com/climate-summit-005',
    heroImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1200',
    heroAlt: 'United Nations conference',
    content: {
      A1: 'World leaders had a big meeting. They talked about the Earth. They want to help our planet. They agreed to make less pollution. Many countries will work together. This is good news for everyone.',
      A2: 'Leaders from around the world have agreed to take action on climate change. At a big meeting, they promised to reduce pollution and protect the environment. All countries will work together to achieve these goals. Scientists say this agreement could help stop global warming.',
      B1: 'At a landmark international summit, world leaders have reached a historic agreement on climate action. The accord commits 195 nations to specific targets for reducing carbon emissions over the next decade. Environmental experts have praised the agreement as a significant step forward, though some activists argue that more ambitious action is needed.',
      B2: 'A historic climate summit has culminated in a binding international agreement that commits signatory nations to unprecedented emissions reduction targets. The accord establishes a framework for carbon taxation, renewable energy transition, and climate adaptation funding for developing nations. The agreement represents a significant departure from previous voluntary commitments.',
      C1: 'An epochal climate summit has yielded a landmark multilateral accord with legally binding provisions for carbon emissions reduction. The comprehensive framework encompasses differentiated responsibilities for developed and developing economies, innovative financing mechanisms, and robust verification protocols. The agreement represents a paradigmatic shift from aspirational pledges to enforceable commitments, potentially inaugurating a new era in international environmental governance.'
    },
    exercises: {
      A1: { comprehension: [{ id: '1', question: 'What did the leaders want to help?', options: [{ id: 'a', text: 'Their countries only' }, { id: 'b', text: 'Our planet' }, { id: 'c', text: 'Rich people' }, { id: 'd', text: 'Big companies' }], correctAnswer: 'b', explanation: 'The leaders want to help our planet.' }] },
      A2: { comprehension: [{ id: '1', question: 'What did the leaders promise to reduce?', options: [{ id: 'a', text: 'Taxes' }, { id: 'b', text: 'Jobs' }, { id: 'c', text: 'Pollution' }, { id: 'd', text: 'Schools' }], correctAnswer: 'c', explanation: 'The leaders promised to reduce pollution.' }] },
      B1: { comprehension: [{ id: '1', question: 'How many nations committed to the accord?', options: [{ id: 'a', text: '50' }, { id: 'b', text: '100' }, { id: 'c', text: '195' }, { id: 'd', text: '250' }], correctAnswer: 'c', explanation: '195 nations committed to the accord.' }] },
      B2: { comprehension: [{ id: '1', question: 'What does the accord establish?', options: [{ id: 'a', text: 'A military alliance' }, { id: 'b', text: 'A framework for carbon taxation and renewable energy' }, { id: 'c', text: 'Trade agreements only' }, { id: 'd', text: 'Tourism partnerships' }], correctAnswer: 'b', explanation: 'The accord establishes a framework for carbon taxation and renewable energy transition.' }] },
      C1: { comprehension: [{ id: '1', question: 'What kind of provisions does the accord have?', options: [{ id: 'a', text: 'Voluntary suggestions' }, { id: 'b', text: 'Legally binding provisions' }, { id: 'c', text: 'Temporary guidelines' }, { id: 'd', text: 'Optional recommendations' }], correctAnswer: 'b', explanation: 'The accord has legally binding provisions.' }] }
    },
    wordCounts: { A1: 40, A2: 65, B1: 95, B2: 130, C1: 165 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 2, C1: 2 },
    publishedAt: '2026-01-02T16:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c6',
    slug: 'viral-cat-video-raises-millions-for-charity',
    title: 'Viral Cat Video Raises Millions for Charity',
    subtitle: 'Internet sensation inspires global fundraising campaign',
    category: 'fun',
    source: 'Viral News',
    sourceUrl: 'https://example.com/cat-charity-006',
    heroImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200',
    heroAlt: 'Cute cat',
    content: {
      A1: 'A cat video became very popular on the internet. Many people watched it. The cat was very funny. People started to give money to help animals. They gave millions of dollars. The cat is now famous!',
      A2: 'A funny video of a cat has gone viral on social media. Millions of people around the world watched and shared the video. The cat owner started a charity campaign, and people donated over 5 million dollars to help animals in need. The cat has become an internet star.',
      B1: 'An unexpected internet sensation has emerged in the form of a cat video that has raised over $5 million for animal welfare charities. The video, featuring a rescued cat named Whiskers performing amusing antics, has been viewed more than 100 million times across various platforms. The owner launched an associated fundraising campaign that exceeded all expectations.',
      B2: 'A viral phenomenon centred on a rescued cat named Whiskers has generated an extraordinary $5 million in charitable donations for animal welfare organisations. The original video, depicting the feline engaging in endearing behaviour, accumulated over 100 million views within its first week online. The campaign demonstrates the remarkable fundraising potential of social media.',
      C1: 'An ostensibly unremarkable cat video has catalysed an extraordinary philanthropic response, generating in excess of $5 million for animal welfare initiatives globally. The viral sensation, featuring a previously shelter-dwelling feline christened Whiskers, accumulated 100 million views with unprecedented velocity. The phenomenon exemplifies the emergent capacity of social media to mobilise collective action and transform quotidian content into catalysts for meaningful social impact.'
    },
    exercises: {
      A1: { comprehension: [{ id: '1', question: 'What animal was in the video?', options: [{ id: 'a', text: 'A dog' }, { id: 'b', text: 'A cat' }, { id: 'c', text: 'A bird' }, { id: 'd', text: 'A fish' }], correctAnswer: 'b', explanation: 'A cat was in the video.' }] },
      A2: { comprehension: [{ id: '1', question: 'How much money was donated?', options: [{ id: 'a', text: '$1 million' }, { id: 'b', text: '$5 million' }, { id: 'c', text: '$10 million' }, { id: 'd', text: '$100 million' }], correctAnswer: 'b', explanation: 'Over $5 million was donated.' }] },
      B1: { comprehension: [{ id: '1', question: 'What is the cats name?', options: [{ id: 'a', text: 'Fluffy' }, { id: 'b', text: 'Whiskers' }, { id: 'c', text: 'Shadow' }, { id: 'd', text: 'Tiger' }], correctAnswer: 'b', explanation: 'The cat is named Whiskers.' }] },
      B2: { comprehension: [{ id: '1', question: 'How many views did the video get in its first week?', options: [{ id: 'a', text: '10 million' }, { id: 'b', text: '50 million' }, { id: 'c', text: '100 million' }, { id: 'd', text: '500 million' }], correctAnswer: 'c', explanation: 'The video got over 100 million views in its first week.' }] },
      C1: { comprehension: [{ id: '1', question: 'What capacity does the article say social media has?', options: [{ id: 'a', text: 'To limit engagement' }, { id: 'b', text: 'To mobilise collective action' }, { id: 'c', text: 'To reduce donations' }, { id: 'd', text: 'To prevent viral content' }], correctAnswer: 'b', explanation: 'Social media has emergent capacity to mobilise collective action.' }] }
    },
    wordCounts: { A1: 42, A2: 68, B1: 98, B2: 120, C1: 155 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 2, C1: 2 },
    publishedAt: '2026-01-01T12:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seed() {
  console.log('Seeding database with sample articles...');

  for (const article of sampleArticles) {
    const { data, error } = await supabase
      .from('Article')
      .upsert(article, { onConflict: 'id' });

    if (error) {
      console.error(`Error inserting ${article.slug}:`, error.message);
    } else {
      console.log(`Inserted: ${article.slug}`);
    }
  }

  console.log('Done!');

  // Verify count
  const { count } = await supabase.from('Article').select('*', { count: 'exact', head: true });
  console.log(`Total articles in database: ${count}`);
}

seed();
