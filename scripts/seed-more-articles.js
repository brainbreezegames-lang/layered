const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://otittsnvduydvqqzsxsm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aXR0c252ZHV5ZHZxcXpzeHNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzc4NjgzNCwiZXhwIjoyMDgzMzYyODM0fQ.Mx_EatSD5ZJbq2xjpr0msuLywWAiNyqmFmwEZjOU6RM'
);

// Helper to generate simple exercises for each level
function generateExercises(level, topic) {
  const baseExercises = {
    comprehension: [
      { id: '1', question: `What is the main topic of this article?`, options: [{ id: 'a', text: 'Sports' }, { id: 'b', text: topic }, { id: 'c', text: 'Cooking' }, { id: 'd', text: 'Music' }], correctAnswer: 'b', explanation: `The article is about ${topic.toLowerCase()}.` },
      { id: '2', question: 'Is this a positive or negative news story?', options: [{ id: 'a', text: 'Very negative' }, { id: 'b', text: 'Mostly positive' }, { id: 'c', text: 'Neutral' }, { id: 'd', text: 'Cannot tell' }], correctAnswer: 'b', explanation: 'The article presents information in a generally positive way.' },
      { id: '3', question: 'Who would be most interested in this article?', options: [{ id: 'a', text: 'Only children' }, { id: 'b', text: 'Only scientists' }, { id: 'c', text: 'Many different people' }, { id: 'd', text: 'Only politicians' }], correctAnswer: 'c', explanation: 'This topic is interesting to many different people.' },
      { id: '4', question: 'When did this happen?', options: [{ id: 'a', text: 'A long time ago' }, { id: 'b', text: 'Recently' }, { id: 'c', text: 'In the future' }, { id: 'd', text: 'Never' }], correctAnswer: 'b', explanation: 'This is recent news.' },
      { id: '5', question: 'What is the purpose of this article?', options: [{ id: 'a', text: 'To entertain' }, { id: 'b', text: 'To inform' }, { id: 'c', text: 'To advertise' }, { id: 'd', text: 'To criticise' }], correctAnswer: 'b', explanation: 'The article aims to inform readers about the topic.' }
    ],
    vocabularyMatching: {
      pairs: [
        { word: 'important', definition: 'having great meaning or value' },
        { word: 'discover', definition: 'to find something for the first time' },
        { word: 'research', definition: 'careful study to learn new facts' },
        { word: 'expert', definition: 'a person who knows a lot about something' },
        { word: 'result', definition: 'what happens because of an action' },
        { word: 'increase', definition: 'to become larger or more' },
        { word: 'develop', definition: 'to grow or create something new' },
        { word: 'environment', definition: 'the world around us' },
        { word: 'technology', definition: 'machines and tools made by science' },
        { word: 'significant', definition: 'important or meaningful' }
      ]
    },
    gapFill: {
      text: `This article is about _____. Experts have been _____ this topic. The _____ show interesting findings. This could be very _____ for the future. More _____ is needed.`,
      blanks: [
        { id: 1, answer: topic.toLowerCase() },
        { id: 2, answer: 'studying' },
        { id: 3, answer: 'results' },
        { id: 4, answer: 'important' },
        { id: 5, answer: 'research' }
      ],
      wordBank: [topic.toLowerCase(), 'studying', 'results', 'important', 'research', 'small', 'easy', 'fast']
    },
    wordOrder: {
      sentences: [
        { scrambled: ['very', 'is', 'this', 'important'], correct: 'This is very important.' },
        { scrambled: ['found', 'have', 'researchers', 'something', 'new'], correct: 'Researchers have found something new.' },
        { scrambled: ['the', 'shows', 'research', 'interesting', 'results'], correct: 'The research shows interesting results.' },
        { scrambled: ['will', 'this', 'help', 'people', 'many'], correct: 'This will help many people.' },
        { scrambled: ['is', 'future', 'the', 'exciting'], correct: 'The future is exciting.' }
      ]
    },
    trueFalse: {
      statements: [
        { text: 'This is an article about news.', answer: true, explanation: 'Yes, this is a news article.' },
        { text: 'The topic is not important.', answer: false, explanation: 'The topic is presented as important.' },
        { text: 'Experts are involved in this story.', answer: true, explanation: 'The article mentions expert involvement.' },
        { text: 'This happened a long time ago.', answer: false, explanation: 'This is recent news.' },
        { text: 'The article gives us information.', answer: true, explanation: 'The article aims to inform readers.' }
      ]
    },
    discussion: [
      'What do you think about this topic?',
      'How might this affect your life?',
      'What questions would you ask an expert about this?'
    ]
  };
  return baseExercises;
}

const additionalArticles = [
  {
    id: 'art3',
    slug: 'world-leaders-agree-climate-action-plan',
    title: 'World Leaders Agree on Historic Climate Action Plan',
    subtitle: 'Nations commit to cutting emissions by half by 2035 in landmark agreement',
    category: 'world',
    source: 'Global News',
    sourceUrl: 'https://example.com/climate-action-2026',
    heroImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1200',
    heroAlt: 'World leaders at climate summit',
    content: {
      A1: `World leaders had a big meeting. They talked about the weather and the Earth. They made a plan to help our planet. The plan says we must make less pollution. All countries agreed to help. This is very good news for everyone. We need to take care of the Earth.`,
      A2: `Leaders from many countries met to discuss climate change. They agreed on a new plan to help the environment. The plan says countries must reduce pollution by half before 2035. This is the biggest climate agreement ever made. Scientists say this plan could slow down global warming. All 195 countries signed the agreement. This gives hope for the future of our planet.`,
      B1: `In a historic summit, world leaders from 195 countries have agreed on an ambitious plan to combat climate change. The agreement commits nations to reducing carbon emissions by 50% by 2035, the most aggressive target ever set. The plan includes funding for developing countries to adopt clean energy technologies and strict penalties for nations that fail to meet their targets. Environmental groups have praised the agreement as a turning point in the fight against global warming, though some argue even stronger measures are needed.`,
      B2: `A landmark climate summit has concluded with the most comprehensive environmental agreement in history. Representatives from 195 nations unanimously endorsed a binding commitment to halve global carbon emissions by 2035, accompanied by a $500 billion fund to support developing nations in transitioning to renewable energy sources. The agreement introduces unprecedented accountability measures, including trade sanctions for non-compliance. While environmental advocates celebrate this as a watershed moment, critics caution that implementation remains the critical challenge, pointing to the mixed track record of previous international climate commitments.`,
      C1: `An unprecedented climate summit has yielded what analysts are characterising as the most consequential environmental accord in human history. The agreement, ratified by 195 nations, mandates a 50% reduction in global carbon emissions by 2035—a target that necessitates fundamental transformation of global energy infrastructure. The accord establishes a $500 billion climate finance mechanism to facilitate decarbonisation in emerging economies, while introducing legally binding enforcement provisions including trade restrictions for non-compliant signatories. The diplomatic achievement reflects growing consensus among world powers that climate action has become an existential imperative, though sceptics note that translating ambitious commitments into concrete policy implementation has historically proven the Achilles heel of international environmental governance.`
    },
    vocabulary: [
      { word: 'climate', definition: 'the weather conditions in an area over a long time', level: 'A2' },
      { word: 'agreement', definition: 'when people decide the same thing together', level: 'A2' },
      { word: 'environment', definition: 'the natural world around us', level: 'A2' },
      { word: 'emissions', definition: 'gases released into the air', level: 'B1' },
      { word: 'unprecedented', definition: 'never happened before', level: 'B2' },
      { word: 'mandate', definition: 'to officially require something', level: 'C1' }
    ],
    exercises: {
      A1: generateExercises('A1', 'Climate change'),
      A2: generateExercises('A2', 'Climate change'),
      B1: generateExercises('B1', 'Climate action'),
      B2: generateExercises('B2', 'Climate policy'),
      C1: generateExercises('C1', 'Environmental governance')
    },
    wordCounts: { A1: 55, A2: 85, B1: 135, B2: 165, C1: 195 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
    publishedAt: '2026-01-04T09:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art4',
    slug: 'marathon-runner-sets-new-world-record',
    title: 'Marathon Runner Sets New World Record',
    subtitle: 'Kenyan athlete breaks the two-hour barrier in Berlin Marathon',
    category: 'sports',
    source: 'Sports Daily',
    sourceUrl: 'https://example.com/marathon-record-2026',
    heroImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200',
    heroAlt: 'Marathon runner crossing finish line',
    content: {
      A1: `A runner ran very fast. He won a big race. He ran faster than anyone before. The race was 42 kilometres long. He finished in less than two hours. Everyone was very surprised and happy. He is from Kenya. He is now the fastest marathon runner in the world.`,
      A2: `A Kenyan runner has broken the world record in the marathon. His name is James Kipchoge, and he finished the Berlin Marathon in one hour, fifty-nine minutes, and forty-five seconds. This is the first time anyone has run a marathon in under two hours in an official race. The previous record was two hours and thirty-five seconds. Kipchoge said it was the best day of his life. Thousands of fans cheered as he crossed the finish line.`,
      B1: `History was made at the Berlin Marathon when Kenyan athlete James Kipchoge became the first person to officially complete a marathon in under two hours. His time of 1:59:45 shatters the previous world record by almost a minute. The achievement was once considered impossible by sports scientists. Kipchoge, who had narrowly missed the sub-two-hour mark in a non-official attempt three years ago, credits years of dedicated training and perfect race conditions for his success. The 35-year-old plans to continue competing and believes the record can be broken again.`,
      B2: `The Berlin Marathon witnessed a historic moment as Kenyan long-distance runner James Kipchoge obliterated the world record with an astonishing time of 1:59:45, becoming the first athlete to officially break the two-hour barrier in the 42.195-kilometre race. The feat, long considered the holy grail of distance running, required Kipchoge to maintain an average pace of 2:50 per kilometre throughout the race. Sports physiologists have marvelled at the achievement, noting that it approaches the theoretical limits of human endurance. Kipchoge's success came after years of methodical preparation and optimal conditions including a flat course and favourable weather.`,
      C1: `In what is being hailed as the greatest achievement in distance running history, Kenyan marathoner James Kipchoge has shattered the psychological and physiological barrier of the two-hour marathon, completing the Berlin course in an unprecedented 1:59:45. The accomplishment represents the culmination of decades of incremental improvements in the discipline and challenges long-held assumptions about the limits of human aerobic capacity. Kipchoge's performance required sustaining a pace of approximately 2:50 per kilometre—a speed most recreational runners cannot maintain for even a single kilometre. Sports scientists attribute the breakthrough to a confluence of factors: genetic predisposition, altitude training methodologies, biomechanical efficiency, and the psychological resilience to push through the physiological distress of oxygen debt at such sustained intensities.`
    },
    vocabulary: [
      { word: 'marathon', definition: 'a very long running race of about 42 kilometres', level: 'A2' },
      { word: 'record', definition: 'the best result ever achieved', level: 'A1' },
      { word: 'barrier', definition: 'something that blocks or limits', level: 'B1' },
      { word: 'physiological', definition: 'related to how the body works', level: 'B2' },
      { word: 'culmination', definition: 'the highest point or final result', level: 'C1' }
    ],
    exercises: {
      A1: generateExercises('A1', 'Running'),
      A2: generateExercises('A2', 'Marathon running'),
      B1: generateExercises('B1', 'Athletic achievement'),
      B2: generateExercises('B2', 'Sports science'),
      C1: generateExercises('C1', 'Human performance')
    },
    wordCounts: { A1: 50, A2: 90, B1: 140, B2: 170, C1: 195 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
    publishedAt: '2026-01-03T18:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art5',
    slug: 'viral-video-dog-saves-owner-fire',
    title: 'Viral Video: Dog Saves Owner From House Fire',
    subtitle: 'Pet dog wakes sleeping family moments before flames engulf home',
    category: 'fun',
    source: 'Viral Stories',
    sourceUrl: 'https://example.com/hero-dog-2026',
    heroImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200',
    heroAlt: 'Golden retriever hero dog',
    content: {
      A1: `A dog saved a family from a fire. The dog barked very loud at night. The family was sleeping. The dog woke them up. They saw smoke and fire. They ran out of the house. The fire was very big. The dog is a hero now. Everyone loves this dog.`,
      A2: `A video of a heroic dog has gone viral on the internet. The dog, named Max, saved his family from a house fire. In the middle of the night, Max started barking loudly and jumping on his owner's bed. The owner woke up and smelled smoke. She quickly woke up her two children and they all escaped. Minutes later, the house was completely on fire. The video of Max has been seen over 50 million times. People are calling Max a hero dog.`,
      B1: `A golden retriever named Max is being celebrated as a hero after saving his family from a devastating house fire. Security camera footage shows Max persistently barking and pawing at his owner, Sarah Johnson, until she woke up at 3 AM. Johnson initially tried to ignore the dog, but his unusual behaviour convinced her something was wrong. Upon opening her bedroom door, she discovered smoke filling the hallway. She managed to evacuate her two young children just minutes before flames consumed the entire first floor. The heartwarming rescue video has been viewed over 50 million times, with many viewers moved to tears by Max's determination.`,
      B2: `Security footage capturing the moment a family pet saved three lives from a house fire has become one of the year's most viral videos. The footage shows Max, a four-year-old golden retriever, relentlessly attempting to wake his owner, Sarah Johnson, by barking and physically nudging her. Johnson reports that Max's behaviour was so unusual that she immediately suspected danger. Her instincts proved correct: upon investigating, she discovered that an electrical fault had sparked a fire in the kitchen that was rapidly spreading through the ground floor. The family escaped with seconds to spare. The footage, which has accumulated over 50 million views across social media platforms, has reignited discussions about the remarkable intuitive abilities of domestic animals in emergency situations.`,
      C1: `A remarkable piece of home security footage has captivated global audiences, documenting the precise moment when a family dog's extraordinary alertness prevented what could have been a triple fatality. The video depicts Max, a four-year-old golden retriever, exhibiting increasingly agitated behaviour as he attempts to rouse his sleeping owner from bed at approximately 3 AM. Sarah Johnson, initially dismissive of what she assumed was routine canine restlessness, was ultimately persuaded by Max's atypical persistence to investigate. Upon opening her bedroom door, she encountered a smoke-filled corridor and discovered that an electrical fault had ignited a fire that was rapidly progressing through the dwelling's ground floor. The family's narrow escape, captured in its entirety by multiple cameras, has resonated profoundly with viewers, accumulating over 50 million views and prompting renewed scholarly interest in the mechanisms by which domesticated animals perceive and respond to environmental threats.`
    },
    vocabulary: [
      { word: 'hero', definition: 'a very brave person (or animal) who helps others', level: 'A1' },
      { word: 'viral', definition: 'spreading very quickly on the internet', level: 'A2' },
      { word: 'evacuate', definition: 'to leave a dangerous place quickly', level: 'B1' },
      { word: 'intuitive', definition: 'understanding without thinking', level: 'B2' },
      { word: 'fatality', definition: 'a death caused by an accident or disaster', level: 'C1' }
    ],
    exercises: {
      A1: generateExercises('A1', 'Dogs'),
      A2: generateExercises('A2', 'Pet heroes'),
      B1: generateExercises('B1', 'Animal behaviour'),
      B2: generateExercises('B2', 'Emergency response'),
      C1: generateExercises('C1', 'Animal cognition')
    },
    wordCounts: { A1: 52, A2: 98, B1: 155, B2: 185, C1: 210 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
    publishedAt: '2026-01-02T12:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art6',
    slug: 'new-smartphone-battery-lasts-week',
    title: 'New Smartphone Battery Technology Lasts a Full Week',
    subtitle: 'Revolutionary solid-state battery could transform mobile devices',
    category: 'science',
    source: 'Tech Insider',
    sourceUrl: 'https://example.com/battery-tech-2026',
    heroImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200',
    heroAlt: 'Smartphone charging',
    content: {
      A1: `Scientists made a new battery. The battery is very good. Your phone can work for one week. You only need to charge it once. The battery is safe. It does not get hot. Many people want this battery. Phones will be better soon.`,
      A2: `Scientists have created a new type of battery that could change our phones forever. The battery can last for seven days on a single charge. Current phone batteries only last about one day. The new battery is called a solid-state battery. It is safer than normal batteries because it cannot catch fire. Phone companies are very excited about this technology. We might see phones with this battery in stores by 2027.`,
      B1: `Researchers have announced a breakthrough in battery technology that could extend smartphone battery life to an entire week on a single charge. The new solid-state battery uses a different type of material than current lithium-ion batteries, allowing it to store much more energy in the same space. Additionally, the technology is significantly safer as it eliminates the flammable liquid components that occasionally cause batteries to catch fire. Several major smartphone manufacturers have already begun negotiating licensing agreements. Industry analysts predict that the first commercial devices featuring this technology could reach consumers within 18 months.`,
      B2: `A team of materials scientists has unveiled a solid-state battery technology that promises to revolutionise portable electronics by extending smartphone battery life from the current one-day standard to approximately seven days per charge. The breakthrough involves replacing the liquid electrolyte found in conventional lithium-ion batteries with a specially engineered ceramic material that enables significantly higher energy density while eliminating fire risk. The technology also supports faster charging speeds, with full capacity achievable in under 15 minutes. Major technology corporations including Apple, Samsung, and Huawei have reportedly entered preliminary discussions with the research team. Market analysts suggest this development could reshape consumer expectations for mobile devices.`,
      C1: `Materials scientists have achieved what the technology industry is heralding as a paradigm shift in portable power storage: a solid-state battery architecture capable of sustaining contemporary smartphone functionality for approximately one week between charges. The innovation centres on a proprietary ceramic electrolyte that circumvents the energy density limitations inherent to conventional liquid electrolyte systems while simultaneously eliminating the thermal runaway risks that have plagued lithium-ion technology. The solid-state configuration additionally enables substantially accelerated charging protocols, with laboratory tests demonstrating full capacity restoration in under fifteen minutes. Multiple tier-one electronics manufacturers have initiated licensing negotiations, signalling potential commercial deployment within eighteen months. Industry observers suggest the technology could fundamentally recalibrate consumer expectations regarding mobile device utility and catalyse a new wave of innovation in portable computing.`
    },
    vocabulary: [
      { word: 'battery', definition: 'a device that stores electrical energy', level: 'A1' },
      { word: 'charge', definition: 'to fill a battery with electricity', level: 'A1' },
      { word: 'technology', definition: 'scientific knowledge used to make things', level: 'A2' },
      { word: 'breakthrough', definition: 'an important discovery or achievement', level: 'B1' },
      { word: 'paradigm shift', definition: 'a fundamental change in approach', level: 'C1' }
    ],
    exercises: {
      A1: generateExercises('A1', 'Phones'),
      A2: generateExercises('A2', 'Technology'),
      B1: generateExercises('B1', 'Battery technology'),
      B2: generateExercises('B2', 'Electronics innovation'),
      C1: generateExercises('C1', 'Materials science')
    },
    wordCounts: { A1: 48, A2: 95, B1: 145, B2: 175, C1: 200 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
    publishedAt: '2026-01-01T10:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seed() {
  console.log('Adding more articles to database...');

  for (const article of additionalArticles) {
    const { error } = await supabase
      .from('Article')
      .upsert(article, { onConflict: 'id' });

    if (error) {
      console.error(`Error inserting ${article.slug}:`, error.message);
    } else {
      console.log(`Inserted: ${article.slug}`);
    }
  }

  console.log('Done!');

  const { count } = await supabase.from('Article').select('*', { count: 'exact', head: true });
  console.log(`Total articles in database: ${count}`);
}

seed();
