const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://otittsnvduydvqqzsxsm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aXR0c252ZHV5ZHZxcXpzeHNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzc4NjgzNCwiZXhwIjoyMDgzMzYyODM0fQ.Mx_EatSD5ZJbq2xjpr0msuLywWAiNyqmFmwEZjOU6RM'
);

const sampleArticles = [
  {
    id: 'art1',
    slug: 'scientists-discover-high-seas-microplastics',
    title: 'Scientists Discover Alarming Levels of Microplastics in Remote Ocean Waters',
    subtitle: 'New research reveals plastic pollution has reached the most isolated marine environments on Earth',
    category: 'science',
    source: 'Nature Science Journal',
    sourceUrl: 'https://example.com/microplastics-study-2026',
    heroImage: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1200',
    heroAlt: 'Ocean waves with sunlight',
    content: {
      A1: `Scientists found plastic in the sea. The plastic is very, very small. We call it microplastic.

The plastic is everywhere in the ocean. It is far from people. It is far from cities. But the plastic is there.

Fish eat the plastic. Birds eat the plastic too. This is very bad for them. They can get sick.

The plastic comes from us. It comes from our bottles. It comes from our bags. We throw them away. Then they go to the sea.

We need to use less plastic. We need to clean the ocean. Scientists say this is very important. We must help our planet.`,

      A2: `Scientists have made a worrying discovery. They found tiny pieces of plastic in the ocean. These pieces are called microplastics. They are smaller than a grain of rice.

The scientists studied water from remote parts of the ocean. These places are very far from any city or town. But they still found plastic there. This surprised many people.

The microplastics are dangerous for sea animals. Fish and other creatures eat them by mistake. The plastic stays in their bodies. It can make them sick or even kill them.

Where does this plastic come from? Most of it comes from larger plastic items. Things like bottles, bags, and packaging break down over time. They become smaller and smaller until they are microplastics.

Scientists are calling for action. They want people to use less plastic. They also want better ways to clean the oceans. This is a big problem that needs everyone's help to solve.`,

      B1: `Marine researchers have made a disturbing discovery about the extent of plastic pollution in our oceans. A comprehensive study has revealed that microplastics have now reached even the most remote and isolated areas of the world's seas.

The research team collected water samples from fifty different locations across the Pacific and Atlantic oceans. Many of these sampling sites were thousands of kilometres from the nearest coastline. Despite their remoteness, every single sample contained microplastic particles.

Microplastics are tiny fragments of plastic, usually less than five millimetres in size. They form when larger plastic items, such as bottles, bags, and fishing nets, gradually break down due to sunlight and wave action. Once they become this small, they are almost impossible to remove from the water.

The presence of these particles in remote ocean areas has serious implications for marine ecosystems. Small fish and zooplankton consume microplastics, mistaking them for food. These plastics then move up the food chain as larger animals eat smaller ones, eventually reaching species like tuna, sharks, and even whales.

Scientists involved in the study are urging governments and individuals to take immediate action. They recommend reducing single-use plastic consumption, improving waste management systems, and investing in new technologies to clean up existing pollution.`,

      B2: `A landmark study published this week has exposed the pervasive nature of microplastic contamination across the world's oceans, with researchers finding significant concentrations of plastic particles in some of the most isolated marine environments on Earth.

The research, conducted over three years by an international team of oceanographers, involved collecting and analysing water samples from more than fifty locations across the Pacific, Atlantic, and Indian oceans. Crucially, many sampling sites were situated in remote areas far from major shipping lanes and coastlines, where scientists had hoped to find relatively pristine waters.

The results proved otherwise. Every sample analysed contained microplastic particles, with an average concentration of approximately fifteen particles per litre of seawater. In some locations, concentrations exceeded forty particles per litre, comparable to levels found near major coastal cities.

These findings have profound implications for marine ecosystems. Microplastics readily absorb toxic chemicals from seawater, including pesticides and industrial pollutants. When marine organisms ingest these contaminated particles, the toxins can accumulate in their tissues, a process known as bioaccumulation. This creates a pathway for harmful substances to concentrate as they move up the food chain, ultimately reaching apex predators and potentially human consumers.

The study's lead author has called for urgent international cooperation to address what she describes as "an environmental crisis hiding in plain sight." Recommendations include implementing stricter regulations on plastic production, developing biodegradable alternatives, and significantly increasing investment in ocean cleanup technologies.`,

      C1: `An exhaustive oceanographic survey has unveiled the ubiquitous presence of microplastic contamination in even the most geographically isolated marine environments, fundamentally challenging previous assumptions about the pristine nature of remote oceanic regions and underscoring the truly global scale of anthropogenic plastic pollution.

The three-year investigation, representing one of the most comprehensive assessments of oceanic microplastic distribution ever undertaken, deployed advanced sampling methodologies across more than fifty strategically selected locations spanning the Pacific, Atlantic, and Indian ocean basins. Researchers deliberately targeted sampling sites in remote pelagic zones, often situated thousands of kilometres from the nearest continental landmass, where minimal direct human impact might have preserved relatively uncontaminated waters.

The findings proved unequivocally otherwise. Without exception, every water sample analysed revealed the presence of microplastic particulates, with mean concentrations averaging fifteen particles per litre. Notably, certain sampling locations exhibited concentrations exceeding forty particles per litre—figures disturbingly comparable to measurements obtained in heavily polluted coastal metropolitan areas. Spectroscopic analysis identified polyethylene and polypropylene as the predominant polymer types, consistent with the breakdown of common consumer plastic products.

The ecological ramifications of such widespread contamination are multifaceted and concerning. Microplastics function as vectors for persistent organic pollutants, readily adsorbing hydrophobic contaminants including polychlorinated biphenyls and organochlorine pesticides from ambient seawater. Upon ingestion by marine organisms, these contaminated particles facilitate bioaccumulation and biomagnification of toxic substances throughout trophic levels, with documented physiological impacts including endocrine disruption, reduced reproductive success, and compromised immune function across numerous species.

The study's principal investigator characterised the findings as indicative of "an environmental crisis of unprecedented proportions that demands immediate, coordinated international response." The research team advocates for transformative policy interventions, including mandatory extended producer responsibility schemes, accelerated development of genuinely biodegradable polymer alternatives, and substantial investment in emerging ocean remediation technologies.`
    },
    exercises: {
      A1: {
        comprehension: [
          { id: '1', question: 'What did scientists find in the sea?', options: [{ id: 'a', text: 'Big fish' }, { id: 'b', text: 'Small plastic' }, { id: 'c', text: 'Gold' }, { id: 'd', text: 'Ships' }], correctAnswer: 'b', explanation: 'Scientists found very small plastic called microplastic.' },
          { id: '2', question: 'Where is the plastic?', options: [{ id: 'a', text: 'Only near cities' }, { id: 'b', text: 'Only on beaches' }, { id: 'c', text: 'Everywhere in the ocean' }, { id: 'd', text: 'Only in rivers' }], correctAnswer: 'c', explanation: 'The plastic is everywhere in the ocean, even far from people.' },
          { id: '3', question: 'What eats the plastic?', options: [{ id: 'a', text: 'Only fish' }, { id: 'b', text: 'Fish and birds' }, { id: 'c', text: 'Only birds' }, { id: 'd', text: 'People' }], correctAnswer: 'b', explanation: 'Both fish and birds eat the plastic.' },
          { id: '4', question: 'Where does the plastic come from?', options: [{ id: 'a', text: 'The sky' }, { id: 'b', text: 'Bottles and bags' }, { id: 'c', text: 'Fish' }, { id: 'd', text: 'The moon' }], correctAnswer: 'b', explanation: 'The plastic comes from bottles and bags that we throw away.' },
          { id: '5', question: 'What do scientists want us to do?', options: [{ id: 'a', text: 'Use more plastic' }, { id: 'b', text: 'Stop going to the beach' }, { id: 'c', text: 'Use less plastic' }, { id: 'd', text: 'Eat more fish' }], correctAnswer: 'c', explanation: 'Scientists want us to use less plastic and help clean the ocean.' }
        ],
        vocabularyMatching: {
          pairs: [
            { word: 'ocean', definition: 'a very big area of salt water' },
            { word: 'plastic', definition: 'a material made by people, often used for bottles' },
            { word: 'small', definition: 'not big, little' },
            { word: 'sick', definition: 'not healthy, ill' },
            { word: 'throw away', definition: 'to put something in the rubbish' },
            { word: 'bottle', definition: 'a container for water or drinks' },
            { word: 'clean', definition: 'to remove dirt or rubbish' },
            { word: 'planet', definition: 'Earth, the world we live on' },
            { word: 'far', definition: 'a long distance away' },
            { word: 'help', definition: 'to do something good for someone or something' }
          ]
        },
        gapFill: {
          text: 'Scientists found tiny _____ in the ocean. Fish and _____ eat this plastic. The plastic comes from _____ and bags. We need to _____ less plastic. We must _____ our planet.',
          blanks: [
            { id: 1, answer: 'plastic' },
            { id: 2, answer: 'birds' },
            { id: 3, answer: 'bottles' },
            { id: 4, answer: 'use' },
            { id: 5, answer: 'help' }
          ],
          wordBank: ['plastic', 'birds', 'bottles', 'use', 'help', 'fish', 'water', 'clean']
        },
        wordOrder: {
          sentences: [
            { scrambled: ['plastic', 'the', 'ocean', 'in', 'is'], correct: 'The plastic is in the ocean.' },
            { scrambled: ['eat', 'fish', 'the', 'plastic'], correct: 'Fish eat the plastic.' },
            { scrambled: ['less', 'need', 'we', 'use', 'to', 'plastic'], correct: 'We need to use less plastic.' },
            { scrambled: ['very', 'is', 'small', 'the', 'plastic'], correct: 'The plastic is very small.' },
            { scrambled: ['help', 'must', 'planet', 'we', 'our'], correct: 'We must help our planet.' }
          ]
        },
        trueFalse: {
          statements: [
            { text: 'The plastic in the ocean is very big.', answer: false, explanation: 'The plastic is very, very small. We call it microplastic.' },
            { text: 'The plastic is far from cities.', answer: true, explanation: 'The article says the plastic is far from people and cities.' },
            { text: 'Only fish eat the plastic.', answer: false, explanation: 'Both fish and birds eat the plastic.' },
            { text: 'The plastic comes from bottles and bags.', answer: true, explanation: 'The article says plastic comes from our bottles and bags.' },
            { text: 'Scientists say we should use more plastic.', answer: false, explanation: 'Scientists say we need to use less plastic.' }
          ]
        },
        discussion: [
          'Do you use plastic bottles? Why or why not?',
          'How can you use less plastic at home?',
          'What animals live in the ocean?'
        ]
      },
      A2: {
        comprehension: [
          { id: '1', question: 'What are microplastics?', options: [{ id: 'a', text: 'Very large pieces of plastic' }, { id: 'b', text: 'Tiny pieces of plastic smaller than rice' }, { id: 'c', text: 'A type of fish' }, { id: 'd', text: 'Clean water' }], correctAnswer: 'b', explanation: 'Microplastics are tiny pieces of plastic smaller than a grain of rice.' },
          { id: '2', question: 'Where did scientists find the microplastics?', options: [{ id: 'a', text: 'Only in cities' }, { id: 'b', text: 'Only on beaches' }, { id: 'c', text: 'In remote parts of the ocean' }, { id: 'd', text: 'Only in rivers' }], correctAnswer: 'c', explanation: 'Scientists found microplastics in remote parts of the ocean, very far from cities.' },
          { id: '3', question: 'Why are microplastics dangerous for sea animals?', options: [{ id: 'a', text: 'They are too hot' }, { id: 'b', text: 'Animals eat them and get sick' }, { id: 'c', text: 'They are too big' }, { id: 'd', text: 'They make the water cold' }], correctAnswer: 'b', explanation: 'Sea animals eat microplastics by mistake, and it can make them sick.' },
          { id: '4', question: 'How do larger plastic items become microplastics?', options: [{ id: 'a', text: 'People cut them' }, { id: 'b', text: 'They break down over time' }, { id: 'c', text: 'Fish eat them' }, { id: 'd', text: 'They disappear' }], correctAnswer: 'b', explanation: 'Larger plastic items break down over time until they become microplastics.' },
          { id: '5', question: 'What do scientists want people to do?', options: [{ id: 'a', text: 'Use more plastic bags' }, { id: 'b', text: 'Stop going to the ocean' }, { id: 'c', text: 'Use less plastic and clean the oceans' }, { id: 'd', text: 'Buy more bottles' }], correctAnswer: 'c', explanation: 'Scientists want people to use less plastic and find better ways to clean the oceans.' }
        ],
        vocabularyMatching: {
          pairs: [
            { word: 'discovery', definition: 'finding something new' },
            { word: 'tiny', definition: 'very, very small' },
            { word: 'remote', definition: 'far away from cities and people' },
            { word: 'dangerous', definition: 'something that can hurt you' },
            { word: 'creature', definition: 'a living animal' },
            { word: 'break down', definition: 'to become smaller pieces' },
            { word: 'packaging', definition: 'material around products in shops' },
            { word: 'action', definition: 'doing something to solve a problem' },
            { word: 'surprised', definition: 'feeling shocked by something unexpected' },
            { word: 'solve', definition: 'to find an answer to a problem' }
          ]
        },
        gapFill: {
          text: 'Scientists made a worrying _____. They found _____ pieces of plastic called microplastics. These are smaller than a grain of _____. Sea animals eat them by _____ and can get sick. Scientists want people to use _____ plastic.',
          blanks: [
            { id: 1, answer: 'discovery' },
            { id: 2, answer: 'tiny' },
            { id: 3, answer: 'rice' },
            { id: 4, answer: 'mistake' },
            { id: 5, answer: 'less' }
          ],
          wordBank: ['discovery', 'tiny', 'rice', 'mistake', 'less', 'more', 'large', 'water']
        },
        wordOrder: {
          sentences: [
            { scrambled: ['found', 'scientists', 'in', 'plastic', 'the', 'ocean'], correct: 'Scientists found plastic in the ocean.' },
            { scrambled: ['microplastics', 'very', 'are', 'small'], correct: 'Microplastics are very small.' },
            { scrambled: ['can', 'plastic', 'animals', 'make', 'sick'], correct: 'Plastic can make animals sick.' },
            { scrambled: ['calling', 'scientists', 'for', 'are', 'action'], correct: 'Scientists are calling for action.' },
            { scrambled: ['needs', 'problem', 'this', 'help', 'everyone\'s'], correct: 'This problem needs everyone\'s help.' }
          ]
        },
        trueFalse: {
          statements: [
            { text: 'Microplastics are bigger than a grain of rice.', answer: false, explanation: 'They are smaller than a grain of rice.' },
            { text: 'Scientists found plastic in remote parts of the ocean.', answer: true, explanation: 'Yes, even in places very far from cities.' },
            { text: 'Sea animals eat microplastics on purpose.', answer: false, explanation: 'They eat them by mistake, thinking it is food.' },
            { text: 'Larger plastic items break down into microplastics.', answer: true, explanation: 'Things like bottles and bags break down over time.' },
            { text: 'Only scientists can help solve this problem.', answer: false, explanation: 'Everyone needs to help solve this problem.' }
          ]
        },
        discussion: [
          'What plastic items do you use every day?',
          'How can shops reduce plastic packaging?',
          'Would you change your habits to help the ocean?'
        ]
      },
      B1: {
        comprehension: [
          { id: '1', question: 'How many locations did researchers collect samples from?', options: [{ id: 'a', text: 'Twenty' }, { id: 'b', text: 'Fifty' }, { id: 'c', text: 'One hundred' }, { id: 'd', text: 'Five' }], correctAnswer: 'b', explanation: 'The research team collected samples from fifty different locations.' },
          { id: '2', question: 'What size are microplastics?', options: [{ id: 'a', text: 'Less than one metre' }, { id: 'b', text: 'Less than five millimetres' }, { id: 'c', text: 'Less than one centimetre' }, { id: 'd', text: 'Exactly five millimetres' }], correctAnswer: 'b', explanation: 'Microplastics are tiny fragments usually less than five millimetres in size.' },
          { id: '3', question: 'How do microplastics form?', options: [{ id: 'a', text: 'They are made in factories' }, { id: 'b', text: 'Fish create them' }, { id: 'c', text: 'Larger plastics break down from sunlight and waves' }, { id: 'd', text: 'They fall from the sky' }], correctAnswer: 'c', explanation: 'Microplastics form when larger items break down due to sunlight and wave action.' },
          { id: '4', question: 'How do microplastics move up the food chain?', options: [{ id: 'a', text: 'They float upwards' }, { id: 'b', text: 'Small creatures eat them, then are eaten by larger animals' }, { id: 'c', text: 'They swim by themselves' }, { id: 'd', text: 'People put them there' }], correctAnswer: 'b', explanation: 'Small fish eat microplastics, then larger animals eat the smaller ones.' },
          { id: '5', question: 'What do scientists recommend?', options: [{ id: 'a', text: 'Using more plastic' }, { id: 'b', text: 'Closing all beaches' }, { id: 'c', text: 'Reducing plastic use and improving waste management' }, { id: 'd', text: 'Stopping all fishing' }], correctAnswer: 'c', explanation: 'Scientists recommend reducing single-use plastic and improving waste management systems.' }
        ],
        vocabularyMatching: {
          pairs: [
            { word: 'comprehensive', definition: 'complete and including everything' },
            { word: 'remote', definition: 'far away from populated areas' },
            { word: 'fragment', definition: 'a small piece broken off something' },
            { word: 'gradually', definition: 'slowly, over time' },
            { word: 'implications', definition: 'possible effects or results' },
            { word: 'consume', definition: 'to eat or use something' },
            { word: 'marine', definition: 'relating to the sea' },
            { word: 'ecosystem', definition: 'all living things in an environment' },
            { word: 'urging', definition: 'strongly encouraging someone to do something' },
            { word: 'immediate', definition: 'happening right now, without delay' }
          ]
        },
        gapFill: {
          text: 'Marine researchers have made a _____ discovery. They collected samples from fifty _____ locations. Microplastics are tiny _____ less than five millimetres. They form when larger items _____ break down. Scientists are _____ governments to take action.',
          blanks: [
            { id: 1, answer: 'disturbing' },
            { id: 2, answer: 'different' },
            { id: 3, answer: 'fragments' },
            { id: 4, answer: 'gradually' },
            { id: 5, answer: 'urging' }
          ],
          wordBank: ['disturbing', 'different', 'fragments', 'gradually', 'urging', 'happy', 'quickly', 'pieces']
        },
        wordOrder: {
          sentences: [
            { scrambled: ['made', 'have', 'researchers', 'discovery', 'a', 'disturbing'], correct: 'Researchers have made a disturbing discovery.' },
            { scrambled: ['contained', 'sample', 'every', 'microplastics'], correct: 'Every sample contained microplastics.' },
            { scrambled: ['almost', 'are', 'remove', 'to', 'they', 'impossible'], correct: 'They are almost impossible to remove.' },
            { scrambled: ['food', 'move', 'up', 'the', 'they', 'chain'], correct: 'They move up the food chain.' },
            { scrambled: ['action', 'immediate', 'urging', 'scientists', 'are'], correct: 'Scientists are urging immediate action.' }
          ]
        },
        trueFalse: {
          statements: [
            { text: 'Some samples from remote areas were free of microplastics.', answer: false, explanation: 'Every single sample contained microplastic particles.' },
            { text: 'Microplastics are less than five millimetres in size.', answer: true, explanation: 'The article states they are usually less than five millimetres.' },
            { text: 'Once plastics become very small, they are easy to remove.', answer: false, explanation: 'The article says they are almost impossible to remove.' },
            { text: 'Microplastics can reach whales through the food chain.', answer: true, explanation: 'They move up the food chain, eventually reaching whales.' },
            { text: 'Scientists think individuals cannot help with this problem.', answer: false, explanation: 'Scientists urge both governments and individuals to take action.' }
          ]
        },
        discussion: [
          'What responsibilities do governments have in reducing plastic pollution?',
          'How might microplastics in fish affect human health?',
          'What alternatives to plastic packaging have you seen in shops?'
        ]
      },
      B2: {
        comprehension: [
          { id: '1', question: 'How long did the research project take?', options: [{ id: 'a', text: 'One year' }, { id: 'b', text: 'Two years' }, { id: 'c', text: 'Three years' }, { id: 'd', text: 'Five years' }], correctAnswer: 'c', explanation: 'The research was conducted over three years.' },
          { id: '2', question: 'What was the average concentration of microplastics found?', options: [{ id: 'a', text: 'Five particles per litre' }, { id: 'b', text: 'Fifteen particles per litre' }, { id: 'c', text: 'Forty particles per litre' }, { id: 'd', text: 'One hundred particles per litre' }], correctAnswer: 'b', explanation: 'The average concentration was approximately fifteen particles per litre.' },
          { id: '3', question: 'What is bioaccumulation?', options: [{ id: 'a', text: 'Plastic floating on water' }, { id: 'b', text: 'Toxins building up in organisms that eat contaminated particles' }, { id: 'c', text: 'Fish swimming together' }, { id: 'd', text: 'Waves breaking down plastic' }], correctAnswer: 'b', explanation: 'Bioaccumulation is the process where toxins accumulate in tissues when organisms ingest contaminated particles.' },
          { id: '4', question: 'What types of chemicals do microplastics absorb?', options: [{ id: 'a', text: 'Only salt' }, { id: 'b', text: 'Vitamins and minerals' }, { id: 'c', text: 'Pesticides and industrial pollutants' }, { id: 'd', text: 'Oxygen' }], correctAnswer: 'c', explanation: 'Microplastics absorb toxic chemicals including pesticides and industrial pollutants.' },
          { id: '5', question: 'How did the lead author describe the situation?', options: [{ id: 'a', text: 'A minor inconvenience' }, { id: 'b', text: 'An environmental crisis hiding in plain sight' }, { id: 'c', text: 'A solved problem' }, { id: 'd', text: 'A natural phenomenon' }], correctAnswer: 'b', explanation: 'She described it as "an environmental crisis hiding in plain sight."' }
        ],
        vocabularyMatching: {
          pairs: [
            { word: 'landmark', definition: 'very important and significant' },
            { word: 'pervasive', definition: 'spreading everywhere' },
            { word: 'contamination', definition: 'pollution or making something impure' },
            { word: 'pristine', definition: 'perfectly clean and unspoiled' },
            { word: 'profound', definition: 'very deep or significant' },
            { word: 'accumulate', definition: 'to gradually collect or build up' },
            { word: 'apex', definition: 'the top or highest point' },
            { word: 'unprecedented', definition: 'never happened before' },
            { word: 'biodegradable', definition: 'able to break down naturally' },
            { word: 'implement', definition: 'to put into action' }
          ]
        },
        gapFill: {
          text: 'A _____ study has exposed the _____ nature of microplastic contamination. Scientists had hoped to find _____ waters in remote areas. Microplastics absorb toxic chemicals and create a pathway for _____ through the food chain. The lead author called for _____ international cooperation.',
          blanks: [
            { id: 1, answer: 'landmark' },
            { id: 2, answer: 'pervasive' },
            { id: 3, answer: 'pristine' },
            { id: 4, answer: 'bioaccumulation' },
            { id: 5, answer: 'urgent' }
          ],
          wordBank: ['landmark', 'pervasive', 'pristine', 'bioaccumulation', 'urgent', 'small', 'dirty', 'slow']
        },
        wordOrder: {
          sentences: [
            { scrambled: ['exposed', 'study', 'has', 'the', 'contamination', 'pervasive'], correct: 'The study has exposed the pervasive contamination.' },
            { scrambled: ['otherwise', 'results', 'proved', 'the'], correct: 'The results proved otherwise.' },
            { scrambled: ['chemicals', 'absorb', 'microplastics', 'toxic', 'readily'], correct: 'Microplastics readily absorb toxic chemicals.' },
            { scrambled: ['phenomenon', 'global', 'cultural', 'became', 'a', 'it'], correct: 'It became a global cultural phenomenon.' },
            { scrambled: ['cooperation', 'international', 'called', 'she', 'for'], correct: 'She called for international cooperation.' }
          ]
        },
        trueFalse: {
          statements: [
            { text: 'Some remote areas had higher concentrations than coastal cities.', answer: false, explanation: 'Some locations had concentrations comparable to major coastal cities, not higher.' },
            { text: 'Microplastics can carry toxic chemicals into organisms.', answer: true, explanation: 'They absorb toxins which then enter organisms that ingest them.' },
            { text: 'Bioaccumulation only affects small fish.', answer: false, explanation: 'Bioaccumulation affects the entire food chain up to apex predators and humans.' },
            { text: 'The research involved samples from three oceans.', answer: true, explanation: 'Samples came from the Pacific, Atlantic, and Indian oceans.' },
            { text: 'Scientists recommend focusing only on cleanup technologies.', answer: false, explanation: 'They recommend regulations on production, biodegradable alternatives, AND cleanup technologies.' }
          ]
        },
        discussion: [
          'Should companies be legally required to use biodegradable packaging?',
          'How might microplastic pollution affect the fishing industry economically?',
          'What role should international organisations play in addressing ocean pollution?'
        ]
      },
      C1: {
        comprehension: [
          { id: '1', question: 'What did the survey fundamentally challenge?', options: [{ id: 'a', text: 'The existence of microplastics' }, { id: 'b', text: 'Assumptions about pristine remote oceanic regions' }, { id: 'c', text: 'The size of the oceans' }, { id: 'd', text: 'The number of fish species' }], correctAnswer: 'b', explanation: 'The survey challenged previous assumptions about the pristine nature of remote oceanic regions.' },
          { id: '2', question: 'Which polymers were identified as predominant?', options: [{ id: 'a', text: 'Nylon and polyester' }, { id: 'b', text: 'Polyethylene and polypropylene' }, { id: 'c', text: 'PVC and rubber' }, { id: 'd', text: 'Silicone and latex' }], correctAnswer: 'b', explanation: 'Spectroscopic analysis identified polyethylene and polypropylene as predominant polymer types.' },
          { id: '3', question: 'What are hydrophobic contaminants?', options: [{ id: 'a', text: 'Water-loving substances' }, { id: 'b', text: 'Substances that repel water and are absorbed by plastics' }, { id: 'c', text: 'Types of fish' }, { id: 'd', text: 'Ocean currents' }], correctAnswer: 'b', explanation: 'Hydrophobic contaminants are water-repelling substances that microplastics readily adsorb from seawater.' },
          { id: '4', question: 'What physiological impacts were documented?', options: [{ id: 'a', text: 'Increased swimming speed' }, { id: 'b', text: 'Endocrine disruption, reduced reproduction, compromised immunity' }, { id: 'c', text: 'Better camouflage' }, { id: 'd', text: 'Larger body size' }], correctAnswer: 'b', explanation: 'Documented impacts include endocrine disruption, reduced reproductive success, and compromised immune function.' },
          { id: '5', question: 'What does the researcher advocate for regarding producer responsibility?', options: [{ id: 'a', text: 'Voluntary guidelines' }, { id: 'b', text: 'Mandatory extended producer responsibility schemes' }, { id: 'c', text: 'No producer involvement' }, { id: 'd', text: 'Reduced production only' }], correctAnswer: 'b', explanation: 'The team advocates for mandatory extended producer responsibility schemes.' }
        ],
        vocabularyMatching: {
          pairs: [
            { word: 'ubiquitous', definition: 'present everywhere, found in all places' },
            { word: 'anthropogenic', definition: 'caused by human activity' },
            { word: 'pelagic', definition: 'relating to the open sea' },
            { word: 'unequivocally', definition: 'in a way that leaves no doubt' },
            { word: 'spectroscopic', definition: 'using light analysis to identify substances' },
            { word: 'biomagnification', definition: 'increasing concentration of toxins up the food chain' },
            { word: 'trophic', definition: 'relating to feeding and nutrition levels' },
            { word: 'transformative', definition: 'causing major change' },
            { word: 'remediation', definition: 'the action of reversing environmental damage' },
            { word: 'unprecedented', definition: 'never done or known before' }
          ]
        },
        gapFill: {
          text: 'The survey unveiled the _____ presence of microplastic contamination. Researchers targeted _____ zones in remote areas. The findings proved _____ that all samples contained plastic. Microplastics function as vectors for persistent organic pollutants, facilitating _____ throughout trophic levels. The principal investigator characterised this as requiring _____ policy interventions.',
          blanks: [
            { id: 1, answer: 'ubiquitous' },
            { id: 2, answer: 'pelagic' },
            { id: 3, answer: 'unequivocally' },
            { id: 4, answer: 'biomagnification' },
            { id: 5, answer: 'transformative' }
          ],
          wordBank: ['ubiquitous', 'pelagic', 'unequivocally', 'biomagnification', 'transformative', 'minimal', 'coastal', 'simple']
        },
        wordOrder: {
          sentences: [
            { scrambled: ['unveiled', 'survey', 'has', 'the', 'presence', 'ubiquitous', 'the'], correct: 'The survey has unveiled the ubiquitous presence.' },
            { scrambled: ['anthropogenic', 'demonstrates', 'this', 'pollution', 'scale', 'the', 'of'], correct: 'This demonstrates the scale of anthropogenic pollution.' },
            { scrambled: ['unequivocally', 'findings', 'proved', 'the', 'otherwise'], correct: 'The findings proved unequivocally otherwise.' },
            { scrambled: ['multifaceted', 'are', 'ramifications', 'ecological', 'the'], correct: 'The ecological ramifications are multifaceted.' },
            { scrambled: ['interventions', 'policy', 'transformative', 'advocates', 'team', 'the', 'for'], correct: 'The team advocates for transformative policy interventions.' }
          ]
        },
        trueFalse: {
          statements: [
            { text: 'The investigation represents one of the most comprehensive assessments ever undertaken.', answer: true, explanation: 'The article explicitly states this about the three-year investigation.' },
            { text: 'PCBs and organochlorine pesticides are examples of hydrophilic contaminants.', answer: false, explanation: 'They are hydrophobic (water-repelling) contaminants.' },
            { text: 'The polymer types found are inconsistent with consumer plastic products.', answer: false, explanation: 'They are consistent with the breakdown of common consumer plastic products.' },
            { text: 'Biomagnification refers to toxins decreasing at higher trophic levels.', answer: false, explanation: 'Biomagnification means toxins concentrate and increase at higher trophic levels.' },
            { text: 'The research team supports emerging ocean remediation technologies.', answer: true, explanation: 'They advocate for substantial investment in emerging ocean remediation technologies.' }
          ]
        },
        discussion: [
          'How might extended producer responsibility schemes change corporate behaviour in the plastics industry?',
          'Evaluate the ethical implications of microplastic contamination reaching human food supplies.',
          'To what extent should wealthy nations bear responsibility for global ocean plastic pollution?'
        ]
      }
    },
    wordCounts: { A1: 95, A2: 168, B1: 285, B2: 365, C1: 425 },
    readTimes: { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 },
    publishedAt: '2026-01-06T10:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art2',
    slug: 'ancient-city-amazon-rainforest-discovery',
    title: 'Ancient City Discovered Hidden Beneath Amazon Rainforest',
    subtitle: 'Archaeologists use laser technology to reveal a lost civilization that thrived over a thousand years ago',
    category: 'culture',
    source: 'Archaeological Review',
    sourceUrl: 'https://example.com/amazon-city-discovery-2026',
    heroImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200',
    heroAlt: 'Dense Amazon rainforest canopy',
    content: {
      A1: `Scientists found an old city in the jungle. The city is very, very old. It is more than 1,000 years old.

The city was under the trees. The trees are very tall. We could not see the city before. But now we can.

Scientists used a special machine. The machine uses light. The light goes through the trees. Then scientists can see what is under the trees.

The old city is big. It has roads. It has houses. It has big buildings too. Many people lived there long ago.

The people grew food. They made water systems. They were very clever. But we do not know why they left.

This is an exciting discovery. Scientists want to learn more about these people.`,

      A2: `Archaeologists have found the remains of an ancient city hidden deep in the Amazon rainforest. The city is believed to be more than 1,000 years old.

For hundreds of years, nobody knew the city was there. The tall trees of the jungle completely hid it from view. But scientists have now found it using special technology.

The technology is called LiDAR. It uses lasers to see through the trees. The lasers bounce off the ground and create a picture of what is underneath. This is how scientists discovered the hidden city.

The city is surprisingly large. Researchers found roads, houses, and large public buildings. There are also signs of farms and water management systems. This suggests the people who lived there were quite advanced.

Scientists think thousands of people may have lived in this city. They want to know more about how these people lived and why they eventually left. The discovery could change what we know about ancient civilisations in South America.`,

      B1: `A team of archaeologists has made a remarkable discovery deep in the Amazon rainforest. Using advanced laser scanning technology, they have uncovered the remains of a previously unknown ancient city that flourished more than a millennium ago.

The discovery was made possible by LiDAR technology, which stands for Light Detection and Ranging. This system uses aircraft-mounted lasers to penetrate the dense forest canopy and map the ground below. When researchers analysed the data, they were astonished to find clear evidence of a substantial urban settlement.

The hidden city covers an area of approximately twelve square kilometres. The scans revealed a sophisticated network of roads connecting various districts, along with residential areas, ceremonial platforms, and what appear to be administrative buildings. Perhaps most impressively, archaeologists identified elaborate water management infrastructure, including canals and reservoirs.

These findings challenge long-held assumptions about pre-Columbian societies in the Amazon region. Historians previously believed that the rainforest environment was too challenging to support large, permanent settlements. This discovery suggests otherwise, indicating that ancient Amazonian peoples developed complex urban societies comparable to those found elsewhere in the Americas.

The research team plans to conduct ground surveys to learn more about the city's inhabitants, their culture, and the reasons for the settlement's eventual abandonment.`,

      B2: `An international team of archaeologists has revealed one of the most significant archaeological discoveries in recent decades: a vast ancient city concealed beneath the canopy of the Amazon rainforest, apparently undisturbed for over a thousand years.

The breakthrough came through the deployment of airborne LiDAR technology, which employs pulsed laser light to penetrate dense vegetation and generate precise three-dimensional maps of terrain features. When processed, the survey data unveiled an extensive urban complex that had remained invisible to conventional aerial photography and satellite imaging.

The settlement spans approximately twelve square kilometres and exhibits a level of urban planning previously thought impossible for ancient Amazonian societies. Researchers identified a geometric network of raised causeways connecting distinct urban sectors, ceremonial plazas oriented according to astronomical alignments, and residential compounds arranged in hierarchical patterns suggesting complex social stratification.

Particularly noteworthy is the city's sophisticated hydraulic engineering. The LiDAR scans exposed an intricate system of canals, reservoirs, and raised agricultural platforms known as "raised fields." This infrastructure would have enabled year-round cultivation in an environment characterised by seasonal flooding, potentially supporting a population of tens of thousands.

The discovery fundamentally challenges the prevailing archaeological consensus that the Amazon was sparsely populated before European contact. Lead researcher Dr. Maria Santos described the find as "reshaping our understanding of pre-Columbian complexity in tropical environments."

The team now faces the considerable challenge of protecting the site from looting and deforestation while conducting detailed excavations to understand the civilisation's rise, achievements, and mysterious collapse.`,

      C1: `In a discovery that promises to reconfigure scholarly understanding of pre-Columbian Amazonian civilisation, an international consortium of archaeologists has unveiled evidence of an extensive urban complex lying dormant beneath the rainforest canopy for approximately twelve centuries.

The revelation emerged from a comprehensive aerial LiDAR survey encompassing several hundred square kilometres of remote jungle terrain. LiDAR—Light Detection and Ranging technology—operates by emitting millions of laser pulses that penetrate forest cover, with return signals enabling the generation of extraordinarily detailed topographical models. Upon processing the accumulated data, researchers confronted incontrovertible evidence of systematic landscape modification on a scale previously undocumented in the Amazon basin.

The identified settlement extends across roughly twelve square kilometres, exhibiting urbanistic characteristics that challenge entrenched narratives of Amazonian prehistory. The LiDAR imagery delineates an orthogonal network of elevated causeways interconnecting distinct functional zones, including apparent residential quarters, ceremonial precincts featuring monumental platform mounds, and specialised areas potentially dedicated to craft production or commerce. The geometric precision of the urban layout indicates centralised planning and administrative sophistication.

Perhaps most revelatory are the hydraulic engineering works. The survey exposed an elaborate water management infrastructure comprising a hierarchy of interconnected canals, substantial reservoir basins, and extensive tracts of raised-field agriculture. This agricultural technology, involving the construction of elevated planting surfaces interspersed with water channels, represents a highly effective adaptation to the seasonally flooded Amazonian landscape, capable of sustaining agricultural productivity year-round and potentially supporting population densities far exceeding previous estimates.

These findings necessitate fundamental revision of the scholarly consensus regarding Amazonian prehistory. The traditional characterisation of pre-Columbian Amazonia as an ecological barrier to complex societal development appears increasingly untenable in light of accumulating evidence for sophisticated, densely populated polities.

The discovery simultaneously presents urgent conservation imperatives. The research team emphasises the vulnerability of the site to illegal logging operations and agricultural encroachment, calling for immediate protective measures while systematic archaeological investigation proceeds.`
    },
    exercises: {
      A1: {
        comprehension: [
          { id: '1', question: 'How old is the city?', options: [{ id: 'a', text: '100 years old' }, { id: 'b', text: 'More than 1,000 years old' }, { id: 'c', text: '10 years old' }, { id: 'd', text: '500 years old' }], correctAnswer: 'b', explanation: 'The city is more than 1,000 years old.' },
          { id: '2', question: 'Where was the city hiding?', options: [{ id: 'a', text: 'In the desert' }, { id: 'b', text: 'In the ocean' }, { id: 'c', text: 'Under the trees' }, { id: 'd', text: 'On a mountain' }], correctAnswer: 'c', explanation: 'The city was under the trees in the jungle.' },
          { id: '3', question: 'What did scientists use to find the city?', options: [{ id: 'a', text: 'A camera' }, { id: 'b', text: 'A special machine with light' }, { id: 'c', text: 'A map' }, { id: 'd', text: 'A boat' }], correctAnswer: 'b', explanation: 'Scientists used a special machine that uses light (LiDAR).' },
          { id: '4', question: 'What does the city have?', options: [{ id: 'a', text: 'Only trees' }, { id: 'b', text: 'Roads, houses, and big buildings' }, { id: 'c', text: 'Only water' }, { id: 'd', text: 'Nothing' }], correctAnswer: 'b', explanation: 'The city has roads, houses, and big buildings.' },
          { id: '5', question: 'What did the people grow?', options: [{ id: 'a', text: 'Trees only' }, { id: 'b', text: 'Food' }, { id: 'c', text: 'Flowers only' }, { id: 'd', text: 'Nothing' }], correctAnswer: 'b', explanation: 'The people grew food.' }
        ],
        vocabularyMatching: {
          pairs: [
            { word: 'jungle', definition: 'a forest with many trees and plants' },
            { word: 'old', definition: 'not new, from a long time ago' },
            { word: 'machine', definition: 'something made to do work' },
            { word: 'light', definition: 'what helps us see things' },
            { word: 'road', definition: 'a path for walking or driving' },
            { word: 'building', definition: 'a place where people live or work' },
            { word: 'clever', definition: 'smart, good at thinking' },
            { word: 'discovery', definition: 'finding something new' },
            { word: 'exciting', definition: 'making you feel happy and interested' },
            { word: 'learn', definition: 'to get new knowledge' }
          ]
        },
        gapFill: {
          text: 'Scientists found an _____ city in the jungle. The city was under the _____. Scientists used a special _____ with light. The city has roads and _____. The people were very _____.',
          blanks: [
            { id: 1, answer: 'old' },
            { id: 2, answer: 'trees' },
            { id: 3, answer: 'machine' },
            { id: 4, answer: 'buildings' },
            { id: 5, answer: 'clever' }
          ],
          wordBank: ['old', 'trees', 'machine', 'buildings', 'clever', 'new', 'water', 'small']
        },
        wordOrder: {
          sentences: [
            { scrambled: ['city', 'found', 'an', 'old', 'scientists'], correct: 'Scientists found an old city.' },
            { scrambled: ['the', 'was', 'trees', 'under', 'city'], correct: 'The city was under the trees.' },
            { scrambled: ['big', 'the', 'city', 'is'], correct: 'The city is big.' },
            { scrambled: ['food', 'grew', 'the', 'people'], correct: 'The people grew food.' },
            { scrambled: ['exciting', 'an', 'is', 'this', 'discovery'], correct: 'This is an exciting discovery.' }
          ]
        },
        trueFalse: {
          statements: [
            { text: 'The city is 100 years old.', answer: false, explanation: 'The city is more than 1,000 years old.' },
            { text: 'The city was under the trees.', answer: true, explanation: 'Yes, the tall trees hid the city.' },
            { text: 'Scientists used a camera to find the city.', answer: false, explanation: 'Scientists used a special machine with light.' },
            { text: 'The city has roads and buildings.', answer: true, explanation: 'Yes, the city has roads, houses, and big buildings.' },
            { text: 'The people who lived there were not clever.', answer: false, explanation: 'The people were very clever - they grew food and made water systems.' }
          ]
        },
        discussion: [
          'Would you like to visit an old city? Why?',
          'What is in your city or town?',
          'Do you think there are more hidden cities in the world?'
        ]
      },
      A2: {
        comprehension: [
          { id: '1', question: 'What technology did scientists use?', options: [{ id: 'a', text: 'X-rays' }, { id: 'b', text: 'LiDAR with lasers' }, { id: 'c', text: 'Radio waves' }, { id: 'd', text: 'Sound waves' }], correctAnswer: 'b', explanation: 'Scientists used LiDAR technology, which uses lasers.' },
          { id: '2', question: 'How does LiDAR work?', options: [{ id: 'a', text: 'It cuts down trees' }, { id: 'b', text: 'Lasers bounce off the ground and create a picture' }, { id: 'c', text: 'It takes normal photos' }, { id: 'd', text: 'It uses sound' }], correctAnswer: 'b', explanation: 'LiDAR uses lasers that bounce off the ground to create pictures.' },
          { id: '3', question: 'What did researchers find in the city?', options: [{ id: 'a', text: 'Only trees' }, { id: 'b', text: 'Roads, houses, and public buildings' }, { id: 'c', text: 'Modern shops' }, { id: 'd', text: 'Nothing important' }], correctAnswer: 'b', explanation: 'Researchers found roads, houses, and large public buildings.' },
          { id: '4', question: 'What does the water management system suggest?', options: [{ id: 'a', text: 'The people were not advanced' }, { id: 'b', text: 'The people were quite advanced' }, { id: 'c', text: 'There was no water' }, { id: 'd', text: 'They had modern technology' }], correctAnswer: 'b', explanation: 'The water management systems suggest the people were quite advanced.' },
          { id: '5', question: 'What do scientists want to know?', options: [{ id: 'a', text: 'How to cut down trees' }, { id: 'b', text: 'How the people lived and why they left' }, { id: 'c', text: 'How to build lasers' }, { id: 'd', text: 'Nothing more' }], correctAnswer: 'b', explanation: 'Scientists want to know how the people lived and why they left.' }
        ],
        vocabularyMatching: {
          pairs: [
            { word: 'remains', definition: 'what is left of something old' },
            { word: 'ancient', definition: 'from a very long time ago' },
            { word: 'hidden', definition: 'not able to be seen' },
            { word: 'technology', definition: 'machines and science used together' },
            { word: 'laser', definition: 'a very strong, focused light' },
            { word: 'bounce', definition: 'to hit something and come back' },
            { word: 'research', definition: 'studying to learn new things' },
            { word: 'advanced', definition: 'well developed and modern for its time' },
            { word: 'civilisation', definition: 'a society with its own culture' },
            { word: 'eventually', definition: 'after some time, in the end' }
          ]
        },
        gapFill: {
          text: 'Archaeologists found the _____ of an ancient city. The technology used is called _____. It uses _____ to see through trees. The city has roads, houses, and _____ buildings. Scientists want to know why the people _____ left.',
          blanks: [
            { id: 1, answer: 'remains' },
            { id: 2, answer: 'LiDAR' },
            { id: 3, answer: 'lasers' },
            { id: 4, answer: 'public' },
            { id: 5, answer: 'eventually' }
          ],
          wordBank: ['remains', 'LiDAR', 'lasers', 'public', 'eventually', 'modern', 'sound', 'quickly']
        },
        wordOrder: {
          sentences: [
            { scrambled: ['hidden', 'the', 'was', 'city', 'jungle', 'in', 'the'], correct: 'The city was hidden in the jungle.' },
            { scrambled: ['uses', 'LiDAR', 'lasers', 'technology'], correct: 'LiDAR technology uses lasers.' },
            { scrambled: ['large', 'is', 'city', 'the', 'surprisingly'], correct: 'The city is surprisingly large.' },
            { scrambled: ['were', 'people', 'the', 'advanced', 'quite'], correct: 'The people were quite advanced.' },
            { scrambled: ['could', 'discovery', 'the', 'change', 'know', 'we', 'what'], correct: 'The discovery could change what we know.' }
          ]
        },
        trueFalse: {
          statements: [
            { text: 'People always knew about this city.', answer: false, explanation: 'Nobody knew the city was there for hundreds of years.' },
            { text: 'LiDAR uses lasers to see through trees.', answer: true, explanation: 'Yes, LiDAR uses lasers that penetrate the forest.' },
            { text: 'The city is very small.', answer: false, explanation: 'The city is surprisingly large.' },
            { text: 'The people had water management systems.', answer: true, explanation: 'Yes, there are signs of water management systems.' },
            { text: 'Scientists already know everything about this city.', answer: false, explanation: 'Scientists want to learn more about how these people lived.' }
          ]
        },
        discussion: [
          'Why do you think ancient people built cities in the jungle?',
          'What modern technology helps us learn about the past?',
          'Would you like to be an archaeologist? Why or why not?'
        ]
      },
      B1: {
        comprehension: [
          { id: '1', question: 'What does LiDAR stand for?', options: [{ id: 'a', text: 'Light and Dark Analysis Research' }, { id: 'b', text: 'Light Detection and Ranging' }, { id: 'c', text: 'Laser Information Data Recording' }, { id: 'd', text: 'Long-distance Image Detection and Review' }], correctAnswer: 'b', explanation: 'LiDAR stands for Light Detection and Ranging.' },
          { id: '2', question: 'How large is the hidden city?', options: [{ id: 'a', text: 'Two square kilometres' }, { id: 'b', text: 'Twelve square kilometres' }, { id: 'c', text: 'Twenty square kilometres' }, { id: 'd', text: 'One hundred square kilometres' }], correctAnswer: 'b', explanation: 'The city covers approximately twelve square kilometres.' },
          { id: '3', question: 'What water infrastructure did archaeologists find?', options: [{ id: 'a', text: 'Modern pipes' }, { id: 'b', text: 'Canals and reservoirs' }, { id: 'c', text: 'Swimming pools' }, { id: 'd', text: 'Nothing related to water' }], correctAnswer: 'b', explanation: 'They found canals and reservoirs as part of water management infrastructure.' },
          { id: '4', question: 'What did historians previously believe about the rainforest?', options: [{ id: 'a', text: 'It was easy to live there' }, { id: 'b', text: 'It was too challenging for large settlements' }, { id: 'c', text: 'Many cities existed there' }, { id: 'd', text: 'It had no trees' }], correctAnswer: 'b', explanation: 'Historians believed the rainforest was too challenging for large, permanent settlements.' },
          { id: '5', question: 'What will the research team do next?', options: [{ id: 'a', text: 'Destroy the city' }, { id: 'b', text: 'Conduct ground surveys' }, { id: 'c', text: 'Stop all research' }, { id: 'd', text: 'Build a new city' }], correctAnswer: 'b', explanation: 'The team plans to conduct ground surveys to learn more.' }
        ],
        vocabularyMatching: {
          pairs: [
            { word: 'remarkable', definition: 'very unusual and deserving attention' },
            { word: 'flourished', definition: 'grew and developed successfully' },
            { word: 'millennium', definition: 'a period of one thousand years' },
            { word: 'penetrate', definition: 'to go into or through something' },
            { word: 'substantial', definition: 'large in size or amount' },
            { word: 'sophisticated', definition: 'complex and advanced' },
            { word: 'ceremonial', definition: 'related to formal rituals or events' },
            { word: 'assumptions', definition: 'things believed to be true without proof' },
            { word: 'comparable', definition: 'similar enough to be compared' },
            { word: 'abandonment', definition: 'leaving something completely' }
          ]
        },
        gapFill: {
          text: 'A team has made a _____ discovery. They found a city that _____ more than a millennium ago. LiDAR can _____ the dense forest canopy. The city shows _____ water management. This challenges long-held _____ about the Amazon.',
          blanks: [
            { id: 1, answer: 'remarkable' },
            { id: 2, answer: 'flourished' },
            { id: 3, answer: 'penetrate' },
            { id: 4, answer: 'sophisticated' },
            { id: 5, answer: 'assumptions' }
          ],
          wordBank: ['remarkable', 'flourished', 'penetrate', 'sophisticated', 'assumptions', 'small', 'simple', 'facts']
        },
        wordOrder: {
          sentences: [
            { scrambled: ['remarkable', 'made', 'a', 'have', 'archaeologists', 'discovery'], correct: 'Archaeologists have made a remarkable discovery.' },
            { scrambled: ['canopy', 'LiDAR', 'the', 'can', 'penetrate', 'forest'], correct: 'LiDAR can penetrate the forest canopy.' },
            { scrambled: ['challenge', 'findings', 'these', 'assumptions', 'long-held'], correct: 'These findings challenge long-held assumptions.' },
            { scrambled: ['covered', 'twelve', 'city', 'the', 'kilometres', 'square'], correct: 'The city covered twelve square kilometres.' },
            { scrambled: ['conduct', 'to', 'team', 'plans', 'the', 'surveys', 'ground'], correct: 'The team plans to conduct ground surveys.' }
          ]
        },
        trueFalse: {
          statements: [
            { text: 'LiDAR uses sound waves to map the ground.', answer: false, explanation: 'LiDAR uses laser light, not sound waves.' },
            { text: 'The city shows evidence of ceremonial platforms.', answer: true, explanation: 'Yes, scans revealed ceremonial platforms among other structures.' },
            { text: 'Historians always believed large settlements existed in the Amazon.', answer: false, explanation: 'Historians previously believed the environment was too challenging for large settlements.' },
            { text: 'The water infrastructure included canals and reservoirs.', answer: true, explanation: 'Yes, archaeologists identified canals and reservoirs.' },
            { text: 'The research is now completely finished.', answer: false, explanation: 'The team plans to conduct ground surveys to learn more.' }
          ]
        },
        discussion: [
          'Why might ancient civilisations have disappeared?',
          'How has technology changed the way we study history?',
          'Should ancient sites be protected from tourism? Why or why not?'
        ]
      },
      B2: {
        comprehension: [
          { id: '1', question: 'How does LiDAR generate maps?', options: [{ id: 'a', text: 'Using satellite photos' }, { id: 'b', text: 'Using pulsed laser light to create 3D terrain maps' }, { id: 'c', text: 'Using sound waves' }, { id: 'd', text: 'Using ground robots' }], correctAnswer: 'b', explanation: 'LiDAR employs pulsed laser light to generate precise three-dimensional maps of terrain.' },
          { id: '2', question: 'What do the hierarchical residential patterns suggest?', options: [{ id: 'a', text: 'Everyone was equal' }, { id: 'b', text: 'Complex social stratification' }, { id: 'c', text: 'Random settlement' }, { id: 'd', text: 'Modern planning' }], correctAnswer: 'b', explanation: 'Hierarchical patterns suggest complex social stratification.' },
          { id: '3', question: 'What are "raised fields"?', options: [{ id: 'a', text: 'Sports areas' }, { id: 'b', text: 'Elevated agricultural platforms' }, { id: 'c', text: 'Building foundations' }, { id: 'd', text: 'Animal enclosures' }], correctAnswer: 'b', explanation: 'Raised fields are elevated agricultural platforms used for year-round cultivation.' },
          { id: '4', question: 'What did Dr. Maria Santos say about the find?', options: [{ id: 'a', text: 'It is not important' }, { id: 'b', text: 'It reshapes our understanding of pre-Columbian complexity' }, { id: 'c', text: 'It proves nothing new' }, { id: 'd', text: 'It should be ignored' }], correctAnswer: 'b', explanation: 'She said it is "reshaping our understanding of pre-Columbian complexity."' },
          { id: '5', question: 'What challenges does the team face?', options: [{ id: 'a', text: 'Too much funding' }, { id: 'b', text: 'Protecting the site from looting and deforestation' }, { id: 'c', text: 'Too many researchers' }, { id: 'd', text: 'The site is too small' }], correctAnswer: 'b', explanation: 'The team must protect the site from looting and deforestation.' }
          ],
        vocabularyMatching: {
          pairs: [
            { word: 'concealed', definition: 'hidden from view' },
            { word: 'deployment', definition: 'the use of something for a specific purpose' },
            { word: 'geometric', definition: 'relating to shapes and patterns' },
            { word: 'astronomical', definition: 'related to stars and planets' },
            { word: 'stratification', definition: 'division into different levels' },
            { word: 'hydraulic', definition: 'related to water and fluid systems' },
            { word: 'intricate', definition: 'very detailed and complex' },
            { word: 'consensus', definition: 'general agreement' },
            { word: 'excavations', definition: 'digging to find buried things' },
            { word: 'looting', definition: 'stealing valuable items' }
          ]
        },
        gapFill: {
          text: 'The city had _____ causeways connecting different sectors. Plazas were oriented according to _____ alignments. The _____ engineering was particularly noteworthy. This challenges the prevailing archaeological _____. The site faces threats from _____ and deforestation.',
          blanks: [
            { id: 1, answer: 'geometric' },
            { id: 2, answer: 'astronomical' },
            { id: 3, answer: 'hydraulic' },
            { id: 4, answer: 'consensus' },
            { id: 5, answer: 'looting' }
          ],
          wordBank: ['geometric', 'astronomical', 'hydraulic', 'consensus', 'looting', 'simple', 'modern', 'tourism']
        },
        wordOrder: {
          sentences: [
            { scrambled: ['revealed', 'team', 'has', 'an', 'the', 'discovery', 'significant'], correct: 'The team has revealed a significant discovery.' },
            { scrambled: ['invisible', 'city', 'the', 'to', 'remained', 'photography', 'conventional'], correct: 'The city remained invisible to conventional photography.' },
            { scrambled: ['challenges', 'discovery', 'the', 'consensus', 'prevailing', 'the'], correct: 'The discovery challenges the prevailing consensus.' },
            { scrambled: ['support', 'tens', 'could', 'of', 'infrastructure', 'the', 'thousands'], correct: 'The infrastructure could support tens of thousands.' },
            { scrambled: ['protecting', 'challenge', 'faces', 'team', 'the', 'the', 'site', 'of'], correct: 'The team faces the challenge of protecting the site.' }
          ]
        },
        trueFalse: {
          statements: [
            { text: 'The city was visible using conventional satellite imaging.', answer: false, explanation: 'The city had remained invisible to conventional aerial photography and satellite imaging.' },
            { text: 'Residential compounds were arranged in hierarchical patterns.', answer: true, explanation: 'Yes, suggesting complex social stratification.' },
            { text: 'Raised fields helped manage seasonal flooding.', answer: true, explanation: 'Yes, this enabled year-round cultivation in a seasonally flooded environment.' },
            { text: 'Before European contact, the Amazon was densely populated according to old theories.', answer: false, explanation: 'The old consensus was that the Amazon was sparsely populated before European contact.' },
            { text: 'The site is completely safe from threats.', answer: false, explanation: 'The site faces threats from looting and deforestation.' }
          ]
        },
        discussion: [
          'How should archaeological sites be protected while still allowing research?',
          'What might explain the collapse of this ancient civilisation?',
          'Should local communities have a say in how archaeological sites are managed?'
        ]
      },
      C1: {
        comprehension: [
          { id: '1', question: 'What does the discovery promise to reconfigure?', options: [{ id: 'a', text: 'Modern city planning' }, { id: 'b', text: 'Scholarly understanding of pre-Columbian Amazonian civilisation' }, { id: 'c', text: 'Current forestry practices' }, { id: 'd', text: 'Tourism patterns' }], correctAnswer: 'b', explanation: 'It promises to reconfigure scholarly understanding of pre-Columbian Amazonian civilisation.' },
          { id: '2', question: 'What does "orthogonal network" refer to?', options: [{ id: 'a', text: 'Circular roads' }, { id: 'b', text: 'A system arranged at right angles' }, { id: 'c', text: 'Underground tunnels' }, { id: 'd', text: 'Random pathways' }], correctAnswer: 'b', explanation: 'An orthogonal network is arranged in a geometric pattern with right angles.' },
          { id: '3', question: 'Why is raised-field agriculture significant?', options: [{ id: 'a', text: 'It uses modern machinery' }, { id: 'b', text: 'It allows year-round productivity in seasonally flooded landscapes' }, { id: 'c', text: 'It requires no water' }, { id: 'd', text: 'It only grows one type of crop' }], correctAnswer: 'b', explanation: 'Raised-field agriculture sustains year-round productivity in seasonally flooded areas.' },
          { id: '4', question: 'What characterisation of pre-Columbian Amazonia is now untenable?', options: [{ id: 'a', text: 'That it had cities' }, { id: 'b', text: 'That it was an ecological barrier to complex societal development' }, { id: 'c', text: 'That people lived there' }, { id: 'd', text: 'That it had forests' }], correctAnswer: 'b', explanation: 'The idea that Amazonia was an ecological barrier to complex societies is now untenable.' },
          { id: '5', question: 'What conservation imperatives does the discovery present?', options: [{ id: 'a', text: 'More tourism development' }, { id: 'b', text: 'Protection from illegal logging and agricultural encroachment' }, { id: 'c', text: 'Immediate excavation of everything' }, { id: 'd', text: 'No action needed' }], correctAnswer: 'b', explanation: 'The site needs protection from illegal logging and agricultural encroachment.' }
        ],
        vocabularyMatching: {
          pairs: [
            { word: 'consortium', definition: 'a group of organisations working together' },
            { word: 'dormant', definition: 'inactive or sleeping' },
            { word: 'topographical', definition: 'relating to the physical features of land' },
            { word: 'incontrovertible', definition: 'impossible to deny or dispute' },
            { word: 'delineates', definition: 'describes or outlines precisely' },
            { word: 'precincts', definition: 'areas or districts with specific purposes' },
            { word: 'polities', definition: 'politically organised societies or states' },
            { word: 'untenable', definition: 'impossible to defend or maintain' },
            { word: 'imperatives', definition: 'essential or urgent requirements' },
            { word: 'encroachment', definition: 'gradual intrusion into an area' }
          ]
        },
        gapFill: {
          text: 'An international _____ of archaeologists unveiled the complex. The LiDAR data provided _____ evidence of landscape modification. The imagery _____ an orthogonal network of causeways. The traditional characterisation appears increasingly _____. The team emphasises urgent conservation _____.',
          blanks: [
            { id: 1, answer: 'consortium' },
            { id: 2, answer: 'incontrovertible' },
            { id: 3, answer: 'delineates' },
            { id: 4, answer: 'untenable' },
            { id: 5, answer: 'imperatives' }
          ],
          wordBank: ['consortium', 'incontrovertible', 'delineates', 'untenable', 'imperatives', 'questionable', 'obscures', 'suggestions']
        },
        wordOrder: {
          sentences: [
            { scrambled: ['reconfigure', 'promises', 'discovery', 'the', 'understanding', 'to', 'scholarly'], correct: 'The discovery promises to reconfigure scholarly understanding.' },
            { scrambled: ['incontrovertible', 'confronted', 'researchers', 'evidence', 'with'], correct: 'Researchers confronted incontrovertible evidence.' },
            { scrambled: ['untenable', 'characterisation', 'appears', 'traditional', 'the', 'increasingly'], correct: 'The traditional characterisation appears increasingly untenable.' },
            { scrambled: ['necessitate', 'findings', 'these', 'fundamental', 'revision'], correct: 'These findings necessitate fundamental revision.' },
            { scrambled: ['emphasises', 'team', 'the', 'the', 'vulnerability', 'site', 'of', 'the'], correct: 'The team emphasises the vulnerability of the site.' }
          ]
        },
        trueFalse: {
          statements: [
            { text: 'The urban complex has been dormant for approximately twelve centuries.', answer: true, explanation: 'The article states it lay dormant for approximately twelve centuries.' },
            { text: 'Spectroscopic analysis was used to study the ruins.', answer: false, explanation: 'The article mentions LiDAR and topographical models, not spectroscopic analysis for this site.' },
            { text: 'The orthogonal layout suggests centralised planning.', answer: true, explanation: 'Yes, the geometric precision indicates centralised planning.' },
            { text: 'Raised-field agriculture is ineffective in flooded environments.', answer: false, explanation: 'It is highly effective in seasonally flooded landscapes.' },
            { text: 'The site is vulnerable to illegal logging operations.', answer: true, explanation: 'Yes, the research team emphasises this vulnerability.' }
          ]
        },
        discussion: [
          'To what extent should archaeological discoveries influence contemporary environmental policy?',
          'Evaluate the challenges of balancing scientific research with site preservation.',
          'How might this discovery affect indigenous communities claims to ancestral lands?'
        ]
      }
    },
    wordCounts: { A1: 102, A2: 175, B1: 295, B2: 385, C1: 445 },
    readTimes: { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 },
    publishedAt: '2026-01-05T14:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seed() {
  console.log('Clearing existing articles...');
  await supabase.from('Article').delete().neq('id', '');

  console.log('Seeding database with high-quality articles...');

  for (const article of sampleArticles) {
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
