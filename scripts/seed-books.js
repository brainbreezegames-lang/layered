const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://otittsnvduydvqqzsxsm.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aXR0c252ZHV5ZHZxcXpzeHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNzg0NzYsImV4cCI6MjA1MTg1NDQ3Nn0.Xr9kbUk_z2hnRIFDdqdkQ5fJH4asS5JzYqEjbBLYykk'
);

const books = [
  {
    id: 'book-python',
    slug: 'python-programming',
    wikiTitle: 'Python_Programming',
    title: 'Python Programming',
    description: 'Learn Python from scratch',
    category: 'computing',
    coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400'
  },
  {
    id: 'book-human-body',
    slug: 'human-body',
    wikiTitle: 'Human_Physiology',
    title: 'The Human Body',
    description: 'Explore how your body works',
    category: 'science',
    coverImage: 'https://images.unsplash.com/photo-1559757175-7cb036e0e82a?w=400'
  },
  {
    id: 'book-world-history',
    slug: 'world-history',
    wikiTitle: 'World_History',
    title: 'World History',
    description: 'Journey through human civilization',
    category: 'history',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400'
  }
];

const chapters = [
  {
    id: 'ch-python-1',
    slug: 'getting-started',
    wikiTitle: 'Python_Programming/Getting_Started',
    bookId: 'book-python',
    title: 'Getting Started with Python',
    orderIndex: 1,
    content: {
      A1: 'Python is a computer language. It is easy to learn. You can use Python to make programs.\n\nTo start, you need to install Python. Go to python.org. Click download. Install it on your computer.\n\nAfter you install Python, you can write code. Open IDLE. Type: print("Hello"). Press Enter. You will see "Hello" on the screen.',
      A2: 'Python is a programming language that many people use. It is popular because it is easy to read and write. Companies like Google and Netflix use Python.\n\nTo begin, visit python.org and download the latest version. After installation, open IDLE. Try typing: print("Hello, World!")\n\nThe print() function displays text. Congratulations - you wrote your first program!',
      B1: 'Python is one of the most popular programming languages in the world. Created by Guido van Rossum in 1991, it is known for clear syntax and readability.\n\nTo get started, download Python from python.org. Once installed, you can use IDLE or advanced editors like VS Code.\n\nThe print() function outputs text to the console. Python\'s minimalist syntax means no class definitions or semicolons needed for simple programs.',
      B2: 'Python has established itself as one of the most versatile programming languages since its creation in 1991. Its design philosophy emphasizes code readability, using significant whitespace to define code blocks.\n\nSetting up involves downloading from python.org or using package managers. For development, options range from IDLE to sophisticated IDEs like PyCharm.\n\nYour first program: print("Hello, World!") demonstrates Python\'s minimalist syntax - no boilerplate required.',
      C1: 'Python\'s ascendancy represents a fascinating case study in language design philosophy. Created by Guido van Rossum in the late 1980s as a successor to ABC, it incorporates that language\'s strengths while addressing its limitations.\n\nEstablishing a robust development environment requires consideration of virtual environments (venv), version management (pyenv), and tooling choices.\n\nThe canonical first program - print("Hello, World!") - embodies Python\'s philosophy from PEP 20: "Simple is better than complex."'
    },
    exercises: {
      A1: { questions: [{ type: 'multiple_choice', question: 'What is Python?', options: ['A snake', 'A computer language', 'A game'], correct: 1 }] },
      A2: { questions: [{ type: 'fill_blank', question: 'Python comes with a program called ___.', answer: 'IDLE' }] },
      B1: { questions: [{ type: 'multiple_choice', question: 'When was Python created?', options: ['1981', '1991', '2001'], correct: 1 }] },
      B2: { questions: [{ type: 'true_false', question: 'Python uses significant whitespace.', answer: true }] },
      C1: { questions: [{ type: 'fill_blank', question: 'The Zen of Python is in PEP ___.', answer: '20' }] }
    },
    vocabulary: [{ word: 'programming', definition: 'Writing instructions for computers', level: 'A2' }],
    wordCounts: { A1: 80, A2: 120, B1: 160, B2: 200, C1: 250 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 }
  },
  {
    id: 'ch-python-2',
    slug: 'variables',
    wikiTitle: 'Python_Programming/Variables',
    bookId: 'book-python',
    title: 'Variables and Data Types',
    orderIndex: 2,
    content: {
      A1: 'A variable is like a box. You put things in it. The box has a name.\n\nIn Python: name = "John" and age = 25\n\nNow "name" has "John" in it. Use print(name) to show it.',
      A2: 'Variables store information. Think of them as labeled containers.\n\nCreating variables: name = "Sarah", age = 30, height = 1.65\n\nTypes: Text (strings) use quotes, Numbers (integers) don\'t, Decimals (floats) have dots.',
      B1: 'Variables store and manipulate data. Python has built-in types: strings for text, integers for whole numbers, floats for decimals, booleans for True/False.\n\nPython is dynamically typed - no need to declare types. Variable names should be descriptive using lowercase and underscores.',
      B2: 'Python variables are references to objects in memory. Dynamic typing determines type at runtime.\n\nCore types: str (immutable strings), int (arbitrary-precision), float (IEEE 754), bool, NoneType.\n\nType conversion is explicit: int("25"). Understanding mutability is crucial for debugging.',
      C1: 'Python\'s variable model differs from compiled languages. Variables are names bound to objects - when x = 42, Python creates an integer object and binds "x" to it.\n\nThe id() function reveals memory addresses. The "is" operator tests identity, not equality. String interning optimizes memory for small strings.'
    },
    exercises: {
      A1: { questions: [{ type: 'multiple_choice', question: 'What is a variable?', options: ['A game', 'A box for storing things', 'A computer'], correct: 1 }] },
      A2: { questions: [{ type: 'true_false', question: 'Strings use quotes.', answer: true }] },
      B1: { questions: [{ type: 'fill_blank', question: 'Python is ___ typed.', answer: 'dynamically' }] },
      B2: { questions: [{ type: 'multiple_choice', question: 'Which are immutable?', options: ['Lists', 'Strings', 'Dictionaries'], correct: 1 }] },
      C1: { questions: [{ type: 'fill_blank', question: 'The ___ operator tests identity.', answer: 'is' }] }
    },
    vocabulary: [{ word: 'variable', definition: 'A named storage location', level: 'A1' }],
    wordCounts: { A1: 50, A2: 80, B1: 120, B2: 160, C1: 200 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 2, C1: 2 }
  },
  {
    id: 'ch-body-1',
    slug: 'cells',
    wikiTitle: 'Human_Physiology/The_Cell',
    bookId: 'book-human-body',
    title: 'Cells: Building Blocks of Life',
    orderIndex: 1,
    content: {
      A1: 'Your body is made of tiny parts called cells. Cells are very small. You cannot see them.\n\nEvery part of you has cells. Skin cells, blood cells, brain cells. They do different jobs.',
      A2: 'Cells are the smallest living parts of your body. Millions fit on a pin head. You need a microscope to see them.\n\nDifferent cells have different jobs: skin cells protect, blood cells carry oxygen, nerve cells send messages.',
      B1: 'Cells are the fundamental units of life. Humans have approximately 37 trillion cells. The cell theory states all living things are made of cells.\n\nKey structures: plasma membrane (boundary), cytoplasm (interior), nucleus (DNA housing). Mitochondria generate energy.',
      B2: 'The cell is the basic structural and functional unit. Robert Hooke first observed cells in 1665. Human cells are eukaryotic with membrane-bound organelles.\n\nThe plasma membrane\'s phospholipid bilayer regulates transport. Mitochondria conduct oxidative phosphorylation to generate ATP.',
      C1: 'The cell stands as biology\'s fundamental organizational unit. The body comprises approximately 37.2 trillion cells representing 200 distinct types.\n\nMitochondria, with their own DNA, provide evidence for endosymbiotic theory. Signal transduction pathways integrate extracellular cues with cellular responses.'
    },
    exercises: {
      A1: { questions: [{ type: 'true_false', question: 'You can see cells with your eyes.', answer: false }] },
      A2: { questions: [{ type: 'fill_blank', question: 'Blood cells carry ___.', answer: 'oxygen' }] },
      B1: { questions: [{ type: 'multiple_choice', question: 'Which organelle generates energy?', options: ['Nucleus', 'Mitochondria', 'Ribosome'], correct: 1 }] },
      B2: { questions: [{ type: 'true_false', question: 'Mitochondria have their own DNA.', answer: true }] },
      C1: { questions: [{ type: 'fill_blank', question: 'Evidence for ___ theory comes from mitochondria.', answer: 'endosymbiotic' }] }
    },
    vocabulary: [{ word: 'cell', definition: 'The smallest unit of life', level: 'A1' }],
    wordCounts: { A1: 50, A2: 80, B1: 120, B2: 160, C1: 200 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 2, C1: 2 }
  },
  {
    id: 'ch-history-1',
    slug: 'ancient-civilizations',
    wikiTitle: 'World_History/Ancient_Civilizations',
    bookId: 'book-world-history',
    title: 'Ancient Civilizations',
    orderIndex: 1,
    content: {
      A1: 'Long ago, people lived in small groups. They moved to find food. Then they learned to farm. They built villages, then cities.\n\nThe first big cities were in Mesopotamia. Egypt built pyramids.',
      A2: 'About 10,000 years ago, humans learned to farm. This is the Agricultural Revolution. Farming let people stay in one place.\n\nFirst civilizations around 3500 BCE: Mesopotamia invented writing, Egypt built pyramids along the Nile.',
      B1: 'The Agricultural Revolution enabled settled communities. Surplus food allowed specialization: craftspeople, priests, soldiers, administrators.\n\nMesopotamia developed cuneiform writing around 3400 BCE. The Code of Hammurabi (1754 BCE) is an early legal code. Egyptian pyramids at Giza remain impressive.',
      B2: 'The Neolithic Revolution catalyzed complex societies. Agricultural surplus created stratified societies with non-food-producing specialists.\n\nMesopotamians developed the sexagesimal system - hence 60-minute hours. The Epic of Gilgamesh (2100 BCE) is humanity\'s oldest literary work.',
      C1: 'The emergence of complex societies during the fourth millennium BCE represents a pivotal juncture. State formation theories emphasize irrigation management, population pressure, and trade networks.\n\nEgyptian civilization\'s longevity derived partly from geographical isolation. The Indus Valley\'s standardization implies sophisticated administration without obvious markers of royal authority.'
    },
    exercises: {
      A1: { questions: [{ type: 'multiple_choice', question: 'What did people learn that changed their lives?', options: ['Swim', 'Farm', 'Fly'], correct: 1 }] },
      A2: { questions: [{ type: 'fill_blank', question: 'The rulers of Egypt were called ___.', answer: 'pharaohs' }] },
      B1: { questions: [{ type: 'fill_blank', question: 'The Sumerians developed ___ writing.', answer: 'cuneiform' }] },
      B2: { questions: [{ type: 'multiple_choice', question: 'What numerical system did Mesopotamians use?', options: ['Decimal', 'Sexagesimal', 'Binary'], correct: 1 }] },
      C1: { questions: [{ type: 'fill_blank', question: 'The Epic of ___ is the oldest literary work.', answer: 'Gilgamesh' }] }
    },
    vocabulary: [{ word: 'civilization', definition: 'An advanced society with cities and writing', level: 'A2' }],
    wordCounts: { A1: 50, A2: 80, B1: 120, B2: 160, C1: 200 },
    readTimes: { A1: 1, A2: 1, B1: 1, B2: 2, C1: 2 }
  }
];

async function seed() {
  console.log('Seeding books and chapters...');
  await supabase.from('Chapter').delete().neq('id', '');
  await supabase.from('Book').delete().neq('id', '');
  
  const { error: bookError } = await supabase.from('Book').insert(
    books.map(b => ({ ...b, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }))
  );
  if (bookError) { console.error('Book error:', bookError); return; }
  
  const { error: chapterError } = await supabase.from('Chapter').insert(
    chapters.map(c => ({ ...c, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }))
  );
  if (chapterError) { console.error('Chapter error:', chapterError); return; }
  
  console.log('Done!');
}

seed();
