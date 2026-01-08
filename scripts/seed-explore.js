/**
 * Seed Explore Data
 *
 * Seeds sample explore articles into the database
 * Usage: node scripts/seed-explore.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Sample explore articles
const sampleArticles = [
  {
    slug: 'albert-einstein',
    wikiTitle: 'Albert Einstein',
    title: 'Albert Einstein',
    category: 'people',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/800px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg',
    excerpt: 'A famous scientist who changed how we understand space, time, and energy.',
    content: {
      A1: 'Albert Einstein was a scientist. He was born in Germany in 1879. He moved to America. He had white hair. He was very smart. He won a big prize for science.',
      A2: 'Albert Einstein was a famous scientist. He was born in Germany in 1879. He is known for his theory about energy and matter: E=mc². This changed how we understand the universe. He won the Nobel Prize in Physics in 1921. He moved to America in 1933.',
      B1: 'Albert Einstein (1879-1955) was one of the most influential physicists in history. Born in Ulm, Germany, he developed the theory of relativity, which revolutionized our understanding of space, time, and energy. His famous equation E=mc² showed that mass and energy are interchangeable. He received the Nobel Prize in Physics in 1921 for his work on the photoelectric effect.',
      B2: 'Albert Einstein (1879-1955) stands as one of the most revolutionary figures in the history of science. Born in Ulm, Germany, Einstein demonstrated an early aptitude for mathematics and physics. His annus mirabilis papers of 1905 introduced special relativity and the mass-energy equivalence formula E=mc², fundamentally altering our conception of the physical universe. He was awarded the Nobel Prize in Physics in 1921, though notably for his explanation of the photoelectric effect rather than relativity.',
      C1: 'Albert Einstein (1879-1955) remains the archetypal scientific genius, whose contributions to theoretical physics irrevocably transformed our understanding of the cosmos. Born in Ulm, Germany, Einstein exhibited an unconventional intellect from childhood, famously struggling with the rigid Prussian educational system yet demonstrating remarkable aptitude for independent inquiry. His annus mirabilis of 1905 produced four groundbreaking papers: on the photoelectric effect, Brownian motion, special relativity, and mass-energy equivalence. The latter introduced the iconic equation E=mc², establishing the fundamental interchangeability of mass and energy.',
    },
    exercises: {
      A1: {
        comprehension: [
          { question: 'Where was Einstein born?', options: ['America', 'Germany', 'France'], correct: 1 },
        ],
        trueOrFalse: [
          { statement: 'Einstein had black hair.', correct: false },
        ],
      },
      A2: {
        comprehension: [
          { question: 'What is Einstein\'s famous equation?', options: ['E=mc²', 'A+B=C', 'X=Y'], correct: 0 },
        ],
        trueOrFalse: [
          { statement: 'Einstein won the Nobel Prize.', correct: true },
        ],
      },
      B1: {
        comprehension: [
          { question: 'What year did Einstein receive the Nobel Prize?', options: ['1905', '1921', '1955'], correct: 1 },
          { question: 'What did E=mc² show?', options: ['Light is fast', 'Mass and energy are interchangeable', 'Space is curved'], correct: 1 },
        ],
      },
      B2: {
        comprehension: [
          { question: 'For what work was Einstein awarded the Nobel Prize?', options: ['Theory of relativity', 'Photoelectric effect', 'Mass-energy equivalence'], correct: 1 },
        ],
        fillInTheBlank: [
          { sentence: 'Einstein\'s papers of 1905 are called his annus _______.', answer: 'mirabilis' },
        ],
      },
      C1: {
        comprehension: [
          { question: 'How is Einstein described in terms of education?', options: ['Excelled in the Prussian system', 'Struggled with the rigid system', 'Was homeschooled'], correct: 1 },
        ],
        discussion: [
          'How did Einstein\'s unconventional thinking contribute to his scientific breakthroughs?',
          'Why do you think the Nobel committee awarded Einstein for the photoelectric effect rather than relativity?',
        ],
      },
    },
    vocabulary: [
      { word: 'scientist', definition: 'A person who studies science', level: 'A1' },
      { word: 'theory', definition: 'An idea that explains something', level: 'A2' },
      { word: 'revolutionary', definition: 'Causing a big change', level: 'B1' },
      { word: 'aptitude', definition: 'Natural ability or talent', level: 'B2' },
      { word: 'irrevocably', definition: 'In a way that cannot be changed', level: 'C1' },
    ],
    wordCounts: { A1: 40, A2: 65, B1: 95, B2: 120, C1: 150 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 3, C1: 4 },
  },
  {
    slug: 'great-wall-of-china',
    wikiTitle: 'Great Wall of China',
    title: 'The Great Wall of China',
    category: 'places',
    heroImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200',
    excerpt: 'The longest wall ever built, stretching across northern China.',
    content: {
      A1: 'The Great Wall of China is very long. It is in China. It is made of stone. People visit it. It is very old.',
      A2: 'The Great Wall of China is the longest wall in the world. It was built to protect China from enemies. The wall is over 2,000 years old. Millions of people visit it every year. You can walk on parts of the wall.',
      B1: 'The Great Wall of China is one of the most remarkable structures ever built by humans. Stretching over 21,000 kilometers, it was constructed over many centuries to protect Chinese states from invasions. Construction began in the 7th century BC, with the most famous sections built during the Ming Dynasty (1368-1644). Today, it is a UNESCO World Heritage Site and one of China\'s most popular tourist attractions.',
      B2: 'The Great Wall of China represents one of humanity\'s most ambitious construction projects, extending over 21,000 kilometers across northern China. Rather than a single continuous wall, it comprises numerous overlapping sections built by different dynasties over two millennia. The most well-preserved sections date from the Ming Dynasty (1368-1644), when the wall was reinforced with stone and brick. Contrary to popular belief, the wall is not visible from space with the naked eye.',
      C1: 'The Great Wall of China stands as a testament to human ambition and perseverance, constituting one of the most extensive construction endeavours in recorded history. Spanning approximately 21,196 kilometers, this fortification system evolved over more than two millennia, with contributions from successive dynasties seeking to defend against incursions from nomadic peoples of the Eurasian Steppe. The appellation "Great Wall" somewhat misleadingly suggests a unified structure; in reality, it comprises a complex network of walls, watchtowers, and natural defensive barriers constructed at different periods.',
    },
    exercises: {
      A1: {
        comprehension: [
          { question: 'Where is the Great Wall?', options: ['Japan', 'China', 'Korea'], correct: 1 },
        ],
        trueOrFalse: [
          { statement: 'The wall is new.', correct: false },
        ],
      },
      A2: {
        comprehension: [
          { question: 'Why was the wall built?', options: ['For tourists', 'To protect China', 'For decoration'], correct: 1 },
        ],
      },
      B1: {
        comprehension: [
          { question: 'How long is the Great Wall?', options: ['5,000 km', '21,000 km', '100,000 km'], correct: 1 },
          { question: 'When were the most famous sections built?', options: ['Han Dynasty', 'Ming Dynasty', 'Qing Dynasty'], correct: 1 },
        ],
      },
      B2: {
        comprehension: [
          { question: 'Can you see the wall from space?', options: ['Yes, easily', 'No, not with the naked eye', 'Only at night'], correct: 1 },
        ],
        trueOrFalse: [
          { statement: 'The wall is a single continuous structure.', correct: false },
        ],
      },
      C1: {
        comprehension: [
          { question: 'What does the passage say the term "Great Wall" misleadingly suggests?', options: ['It\'s not great', 'It\'s a unified structure', 'It\'s made of stone'], correct: 1 },
        ],
        discussion: [
          'How does the Great Wall reflect the political and military concerns of ancient China?',
          'What challenges might have been faced in constructing such an extensive fortification?',
        ],
      },
    },
    vocabulary: [
      { word: 'wall', definition: 'A structure made of stone or brick', level: 'A1' },
      { word: 'protect', definition: 'To keep safe from danger', level: 'A2' },
      { word: 'dynasty', definition: 'A series of rulers from the same family', level: 'B1' },
      { word: 'fortification', definition: 'A defensive military construction', level: 'B2' },
      { word: 'endeavour', definition: 'An attempt to achieve a goal', level: 'C1' },
    ],
    wordCounts: { A1: 30, A2: 55, B1: 95, B2: 115, C1: 140 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 3, C1: 3 },
  },
  {
    slug: 'how-airplanes-fly',
    wikiTitle: 'Lift (force)',
    title: 'How Airplanes Fly',
    category: 'science',
    heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200',
    excerpt: 'The science behind how heavy metal machines can soar through the sky.',
    content: {
      A1: 'Airplanes can fly. They have wings. The wings help them go up. Engines make them go fast. Pilots fly the planes.',
      A2: 'Airplanes fly because of their wings. When the plane moves fast, air flows over and under the wings. The wing shape makes the plane go up. This force is called "lift." Engines push the plane forward. This is called "thrust."',
      B1: 'Airplanes fly due to the principles of aerodynamics. The wings are designed with a curved upper surface and a flatter lower surface. When the plane moves forward, air travels faster over the top of the wing than underneath it. This difference in air speed creates lower pressure above the wing and higher pressure below, generating an upward force called lift. The engines provide thrust to overcome air resistance, or drag.',
      B2: 'The ability of aircraft to achieve sustained flight relies on the fundamental principles of aerodynamics, primarily the generation of lift. Wings are engineered with an aerofoil shape—curved on top and relatively flat below. As the aircraft accelerates, air flowing over the curved upper surface must travel a greater distance, increasing its velocity and consequently decreasing pressure according to Bernoulli\'s principle. The higher pressure beneath the wing creates an upward force, lift, which must exceed the aircraft\'s weight for flight to occur.',
      C1: 'Aircraft flight represents a sophisticated interplay of aerodynamic forces, governed by principles first systematically articulated in the early 20th century. The generation of lift, the force enabling an aircraft to overcome gravity, is primarily attributed to the aerofoil geometry of wings. As an aircraft accelerates, the differential in air velocity above and below the wing—with air traversing the curved upper surface more rapidly—creates a pressure differential consistent with Bernoulli\'s principle. This phenomenon, combined with Newton\'s third law as the wing deflects air downward, produces the requisite upward force.',
    },
    exercises: {
      A1: {
        comprehension: [
          { question: 'What helps airplanes go up?', options: ['Engines', 'Wings', 'Pilots'], correct: 1 },
        ],
      },
      A2: {
        comprehension: [
          { question: 'What is the force that makes planes go up called?', options: ['Thrust', 'Lift', 'Push'], correct: 1 },
        ],
      },
      B1: {
        comprehension: [
          { question: 'What creates lift?', options: ['Engine power', 'Difference in air pressure', 'Weight of the plane'], correct: 1 },
          { question: 'What is air resistance called?', options: ['Lift', 'Thrust', 'Drag'], correct: 2 },
        ],
      },
      B2: {
        comprehension: [
          { question: 'What scientific principle explains the pressure difference?', options: ['Newton\'s law', 'Bernoulli\'s principle', 'Einstein\'s theory'], correct: 1 },
        ],
      },
      C1: {
        comprehension: [
          { question: 'What two scientific principles are mentioned?', options: ['Bernoulli and Newton', 'Einstein and Hawking', 'Darwin and Mendel'], correct: 0 },
        ],
        discussion: [
          'How do the principles of aerodynamics apply to other forms of transportation?',
          'What innovations in wing design have improved aircraft efficiency?',
        ],
      },
    },
    vocabulary: [
      { word: 'fly', definition: 'To move through the air', level: 'A1' },
      { word: 'lift', definition: 'The force that pushes something up', level: 'A2' },
      { word: 'aerodynamics', definition: 'The study of how air moves around objects', level: 'B1' },
      { word: 'velocity', definition: 'The speed of something in a direction', level: 'B2' },
      { word: 'requisite', definition: 'Necessary or required', level: 'C1' },
    ],
    wordCounts: { A1: 30, A2: 55, B1: 100, B2: 120, C1: 145 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 3, C1: 3 },
  },
];

async function seedArticles() {
  console.log('Seeding explore articles...');

  for (const article of sampleArticles) {
    const { error } = await supabase
      .from('ExploreArticle')
      .upsert(article, { onConflict: 'slug' });

    if (error) {
      console.error(`Error seeding ${article.title}:`, error.message);
    } else {
      console.log(`Seeded article: ${article.title}`);
    }
  }
}

async function main() {
  console.log('Starting explore data seed...\n');

  await seedArticles();

  console.log('\nExplore data seed complete!');
}

main().catch(console.error);
