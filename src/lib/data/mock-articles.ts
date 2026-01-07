import { Article } from "@/types";

export const mockArticle: Article = {
  id: "1",
  slug: "life-of-joy-and-work",
  title: "A Life of Joy and Work",
  subtitle: "I am banned from working now, but as I look back on my career in Afghanistan, I feel hope for the future",
  category: "world",
  tags: ["afghanistan", "women", "work", "education"],
  source: "Aeon",
  sourceUrl: "https://aeon.co/essays/example",
  publishedAt: "2025-01-07",
  wordCount: { A1: 320, A2: 450, B1: 620, B2: 780, C1: 850 },
  readTime: { A1: 4, A2: 6, B1: 8, B2: 10, C1: 12 },
  heroImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1600&h=900&fit=crop",
  heroAlt: "A woman reading a book in warm sunlight",
  heroCredit: "Unsplash",
  content: {
    A1: `I am Fatima. I am from Afghanistan. I was a teacher. I loved my job very much.

Every day, I went to school. I taught young girls. They wanted to learn. They were happy to be in school.

Now, I cannot work. Women cannot work in my country. This makes me sad. But I still have hope.

I remember my students. They were smart and kind. They asked many questions. They wanted to know about the world.

Education is important. It helps people. It gives them power. When you learn, you can do many things.

I think about the future. I believe things will change. Girls will go to school again. Women will work again.

My life was full of joy. Teaching gave me purpose. I helped many young people. This makes me proud.

I wait for better days. I read books at home. I write stories. I do not give up hope.

The world is watching. People care about us. One day, we will be free to learn and work again.`,

    A2: `My name is Fatima, and I come from Afghanistan. For many years, I worked as a teacher in a girls' school. It was the best job I could imagine.

Every morning, I woke up excited to go to work. My students were eager to learn. They asked questions about everything - science, history, literature. Their curiosity made me happy.

Now, everything has changed. The government says women cannot work. Schools for girls are closed. I stay at home and think about my students.

I remember one girl named Zahra. She wanted to become a doctor. She studied very hard. I wonder where she is now and if she still dreams of helping people.

Education changes lives. When I was young, my mother could not read. She always told me to study hard. She wanted a better life for me.

I became a teacher because I believe in education. Every child deserves the chance to learn. Knowledge opens doors to new possibilities.

Some days are difficult. I feel sad and worried about the future. But then I remember all the students I taught over the years. Many of them are now mothers themselves. They teach their children at home.

Hope is powerful. It keeps us going when times are hard. I believe that one day, things will change. Girls will return to school. Women will work again.

Until then, I read and write. I keep my mind active. I refuse to give up on my dreams.`,

    B1: `My name is Fatima, and for twenty-three years, I dedicated my life to education in Afghanistan. Working as a teacher in a girls' secondary school was more than just a profession for me—it was my calling.

Every morning, I would arrive early at the school, preparing lessons and arranging the classroom. My students, ranging from twelve to eighteen years old, brought energy and enthusiasm that made every day meaningful. They asked challenging questions about science, debated historical events, and discussed literature with surprising depth.

Everything changed when the new government took power. Women were banned from working, and girls' schools were shut down. Overnight, my career of more than two decades came to an end. The silence in my home felt unbearable after years of busy classrooms.

I often think about my former students. There was Zahra, who dreamed of becoming a surgeon. There was Maryam, whose poetry moved everyone who heard it. There was little Sana, who struggled with mathematics but never gave up trying. I wonder what has become of their dreams.

The power of education cannot be measured in simple terms. It transforms individuals and entire communities. My own mother never learned to read or write, but she understood education's value. She sacrificed everything to send me to school, working long hours so I could have opportunities she never had.

During difficult moments, I remind myself that knowledge cannot be taken away. The girls I taught carry their education within them. They teach their younger siblings at home. They refuse to let their minds go dark.

I fill my days with reading and writing. I document stories from my teaching years. Perhaps one day, these memories will become a book that inspires others.

Hope remains my constant companion. History teaches us that change is inevitable. Restrictions never last forever. I believe that someday, I will return to the classroom, and my students will return to their desks, ready to learn once more.`,

    B2: `For twenty-three years, I devoted myself entirely to education in Afghanistan, serving as a teacher in a girls' secondary school in Kabul. It was never merely a job—it represented my deepest convictions about human potential and the transformative power of learning.

My daily routine began before sunrise, when I would review lesson plans and consider how to engage students with challenging material. The girls who filled my classroom ranged from twelve to eighteen years old, each bringing unique perspectives shaped by their families, their neighbourhoods, and their personal struggles. Their intellectual curiosity constantly surprised me, whether they were questioning scientific theories, analysing literary themes, or debating historical interpretations.

The sudden prohibition on women's work devastated not just my career but my sense of identity. After more than two decades of purposeful activity, the enforced idleness felt like a physical weight pressing down on my chest. The silence of my home contrasted painfully with memories of lively classroom discussions.

My former students occupy my thoughts constantly. Zahra possessed remarkable aptitude for biology and dreamed of becoming a neurosurgeon. Maryam wrote poetry that captured complex emotions with startling precision. Sana struggled academically but demonstrated such determination that her eventual improvements felt like personal victories for us both. The uncertainty surrounding their futures haunts me.

Education's impact extends far beyond individual advancement. It reshapes family dynamics, community expectations, and societal possibilities. My own mother, illiterate her entire life, understood this intuitively. She worked exhausting hours as a cleaner so that I could attend school and eventually university. Her sacrifice established a principle I carried into my teaching: everyone deserves access to knowledge.

The current restrictions have not eliminated education—they have merely driven it underground. Throughout the city, women gather secretly to teach and learn. My former students continue their studies through informal networks, sharing books and discussing ideas in private homes. Knowledge, once acquired, proves remarkably resistant to suppression.

I spend my days reading voraciously and documenting my experiences through writing. These records serve multiple purposes: preserving memories, processing difficult emotions, and potentially inspiring future generations. Perhaps these accounts will eventually demonstrate to the world what Afghan women have accomplished and continue to accomplish despite enormous obstacles.

Hope sustains me through the darkest moments. Historical precedent suggests that repressive measures eventually falter. The desire for education, especially among those denied it, only intensifies with prohibition. I maintain absolute confidence that circumstances will change, that schools will reopen, and that I will return to the profession that gave my life meaning.`,

    C1: `Throughout twenty-three years of teaching in Afghanistan, I witnessed countless young women discover their intellectual capabilities and begin imagining futures that their mothers could never have conceived. Working at a girls' secondary school in Kabul was never simply employment—it represented my most profound convictions about human dignity and the emancipatory potential of education.

My mornings commenced before dawn, when I would meticulously review lesson plans and contemplate pedagogical approaches that might illuminate complex concepts for students with vastly different backgrounds and learning styles. The young women who populated my classroom—ranging from twelve to eighteen years of age—arrived carrying the weight of family expectations, economic constraints, and societal pressures that would have crushed less resilient spirits. Their intellectual voracity never ceased to astound me, whether they were interrogating scientific methodologies, deconstructing literary narratives, or challenging historical interpretations with sophisticated argumentation.

The abrupt prohibition of women's employment shattered not merely my professional life but my fundamental sense of purpose and identity. After more than two decades of meaningful pedagogical engagement, the enforced domesticity felt like a form of suffocation. The oppressive silence of my home stood in stark contrast to the vibrant classroom exchanges that had previously structured my existence.

My former students inhabit my consciousness perpetually. Zahra demonstrated extraordinary aptitude for biological sciences and harboured ambitions of pioneering neurosurgical techniques. Maryam possessed a poetic sensibility that could articulate ineffable emotional complexities with devastating precision. Sana, despite persistent academic struggles, exhibited such unwavering determination that her incremental progress felt like mutual triumphs. The profound uncertainty surrounding their trajectories weighs heavily upon me.

Education's transformative capacity transcends individual advancement to encompass familial reformation, community reconstitution, and societal reimagination. My own mother, who remained illiterate throughout her seventy-two years, grasped this truth with intuitive clarity. She endured exhausting labour as a domestic worker, sacrificing her health and comfort so that I might access educational opportunities categorically denied to her generation. Her selflessness established an ethical imperative that animated my entire teaching career: every human being possesses an inherent right to knowledge and intellectual development.

Contemporary restrictions have not eradicated educational aspiration—they have merely displaced it into clandestine spaces. Throughout Kabul and beyond, women convene surreptitiously to transmit and acquire knowledge. Former students perpetuate their studies through informal networks, circulating prohibited texts and conducting intellectual discussions within private residences. Knowledge, once internalised, demonstrates remarkable imperviousness to authoritarian suppression.

I occupy my constrained days with voracious reading and systematic documentation of experiences accumulated over decades. These written records serve multiple functions simultaneously: preserving institutional memory, processing psychological trauma, and potentially inspiring subsequent generations. Perhaps these testimonies will eventually demonstrate to international observers what Afghan women have accomplished and continue to accomplish despite seemingly insurmountable obstacles.

Hope remains my existential anchor through periods of profound darkness. Historical analysis suggests that repressive regimes invariably encounter the limits of their coercive capabilities. The yearning for education, particularly among those systematically denied access, paradoxically intensifies under prohibition. I maintain unwavering conviction that circumstances will eventually transform, that educational institutions will resume operations, and that I shall return to the vocation that imbued my existence with significance.`
  },
  audio: {
    A1: { url: "/audio/article-1-a1.mp3", duration: 180 },
    A2: { url: "/audio/article-1-a2.mp3", duration: 240 },
    B1: { url: "/audio/article-1-b1.mp3", duration: 360 },
    B2: { url: "/audio/article-1-b2.mp3", duration: 480 },
    C1: { url: "/audio/article-1-c1.mp3", duration: 600 },
  },
  vocabulary: [
    { word: "banned", definition: "officially not allowed", level: "A2" },
    { word: "career", definition: "a job or profession that you do for a long time", level: "A2" },
    { word: "dedicated", definition: "gave all your time and effort to something", level: "B1" },
    { word: "curiosity", definition: "a strong desire to know or learn something", level: "B1" },
    { word: "devastating", definition: "causing great shock or sadness", level: "B2" },
    { word: "suppress", definition: "to stop something by force", level: "B2" },
    { word: "emancipatory", definition: "relating to freedom from restrictions", level: "C1" },
    { word: "pedagogical", definition: "relating to teaching methods", level: "C1" },
  ],
  exercises: {
    A1: {
      comprehension: [
        { id: "1", question: "What was Fatima's job?", options: [{ id: "a", text: "Doctor" }, { id: "b", text: "Teacher" }, { id: "c", text: "Writer" }, { id: "d", text: "Cook" }], correctAnswer: "b", explanation: "Fatima says 'I was a teacher.'" },
        { id: "2", question: "How does Fatima feel about not working?", options: [{ id: "a", text: "Happy" }, { id: "b", text: "Angry" }, { id: "c", text: "Sad" }, { id: "d", text: "Excited" }], correctAnswer: "c", explanation: "Fatima says 'This makes me sad.'" },
        { id: "3", question: "What does Fatima do at home now?", options: [{ id: "a", text: "She cooks" }, { id: "b", text: "She reads and writes" }, { id: "c", text: "She sleeps" }, { id: "d", text: "She watches TV" }], correctAnswer: "b", explanation: "Fatima says 'I read books at home. I write stories.'" },
        { id: "4", question: "What does Fatima believe about the future?", options: [{ id: "a", text: "Nothing will change" }, { id: "b", text: "Things will get worse" }, { id: "c", text: "Things will change" }, { id: "d", text: "She doesn't know" }], correctAnswer: "c", explanation: "Fatima says 'I believe things will change.'" },
        { id: "5", question: "Who did Fatima teach?", options: [{ id: "a", text: "Boys" }, { id: "b", text: "Old people" }, { id: "c", text: "Young girls" }, { id: "d", text: "Adults" }], correctAnswer: "c", explanation: "Fatima says 'I taught young girls.'" },
      ],
      vocabularyMatching: {
        pairs: [
          { word: "teacher", definition: "a person who helps you learn" },
          { word: "school", definition: "a place where children learn" },
          { word: "hope", definition: "a feeling that good things will happen" },
          { word: "proud", definition: "feeling good about something you did" },
          { word: "future", definition: "the time that will come" },
          { word: "learn", definition: "to get new knowledge or skills" },
          { word: "world", definition: "all the countries and people on Earth" },
          { word: "free", definition: "able to do what you want" },
          { word: "purpose", definition: "a reason for doing something" },
          { word: "remember", definition: "to think about the past" },
        ],
      },
      gapFill: {
        text: "I am Fatima. I am from _____. I was a _____. I loved my _____ very much. Every day, I went to _____. I taught young _____. They wanted to _____. Now, I cannot _____. This makes me _____. But I still have _____. Education is _____.",
        blanks: [
          { id: 1, answer: "Afghanistan" },
          { id: 2, answer: "teacher" },
          { id: 3, answer: "job" },
          { id: 4, answer: "school" },
          { id: 5, answer: "girls" },
          { id: 6, answer: "learn" },
          { id: 7, answer: "work" },
          { id: 8, answer: "sad" },
          { id: 9, answer: "hope" },
          { id: 10, answer: "important" },
        ],
        wordBank: ["Afghanistan", "teacher", "job", "school", "girls", "learn", "work", "sad", "hope", "important", "happy", "boy", "play"],
      },
      wordOrder: {
        sentences: [
          { scrambled: ["teacher", "was", "I", "a"], correct: "I was a teacher" },
          { scrambled: ["school", "to", "went", "I"], correct: "I went to school" },
          { scrambled: ["job", "my", "loved", "I"], correct: "I loved my job" },
          { scrambled: ["learn", "to", "wanted", "They"], correct: "They wanted to learn" },
          { scrambled: ["hope", "have", "still", "I"], correct: "I still have hope" },
          { scrambled: ["important", "is", "Education"], correct: "Education is important" },
          { scrambled: ["girls", "young", "taught", "I"], correct: "I taught young girls" },
          { scrambled: ["sad", "me", "makes", "This"], correct: "This makes me sad" },
          { scrambled: ["books", "read", "I", "home", "at"], correct: "I read books at home" },
          { scrambled: ["change", "will", "Things"], correct: "Things will change" },
        ],
      },
      trueFalse: {
        statements: [
          { text: "Fatima is from Pakistan.", answer: false, explanation: "Fatima is from Afghanistan." },
          { text: "Fatima was a teacher.", answer: true, explanation: "The text says 'I was a teacher.'" },
          { text: "Fatima taught boys.", answer: false, explanation: "Fatima taught young girls." },
          { text: "Fatima can work now.", answer: false, explanation: "The text says 'Now, I cannot work.'" },
          { text: "Fatima has hope for the future.", answer: true, explanation: "Fatima says 'I still have hope.'" },
          { text: "Fatima reads books at home.", answer: true, explanation: "The text says 'I read books at home.'" },
          { text: "Fatima's students were lazy.", answer: false, explanation: "The students wanted to learn and were happy." },
          { text: "Fatima believes things will change.", answer: true, explanation: "Fatima says 'I believe things will change.'" },
        ],
      },
      discussion: [
        "Why is education important?",
        "What makes a good teacher?",
        "What do you hope for in the future?",
      ],
    },
    A2: {
      comprehension: [
        { id: "1", question: "How long did Fatima work as a teacher?", options: [{ id: "a", text: "Five years" }, { id: "b", text: "Ten years" }, { id: "c", text: "Many years" }, { id: "d", text: "One year" }], correctAnswer: "c", explanation: "The text says Fatima worked 'for many years.'" },
        { id: "2", question: "What did Zahra want to become?", options: [{ id: "a", text: "A teacher" }, { id: "b", text: "A doctor" }, { id: "c", text: "A writer" }, { id: "d", text: "A lawyer" }], correctAnswer: "b", explanation: "The text says Zahra 'wanted to become a doctor.'" },
        { id: "3", question: "Why couldn't Fatima's mother read?", options: [{ id: "a", text: "She was lazy" }, { id: "b", text: "She didn't want to" }, { id: "c", text: "She never had the chance" }, { id: "d", text: "She forgot how" }], correctAnswer: "c", explanation: "The mother told Fatima to study because she wanted a better life for her, implying she didn't have educational opportunities." },
        { id: "4", question: "What do some former students do now?", options: [{ id: "a", text: "They work in offices" }, { id: "b", text: "They teach their children at home" }, { id: "c", text: "They travel abroad" }, { id: "d", text: "They don't do anything" }], correctAnswer: "b", explanation: "The text says students who are now mothers 'teach their children at home.'" },
        { id: "5", question: "What keeps Fatima going during hard times?", options: [{ id: "a", text: "Money" }, { id: "b", text: "Friends" }, { id: "c", text: "Hope" }, { id: "d", text: "Food" }], correctAnswer: "c", explanation: "The text says 'Hope is powerful. It keeps us going when times are hard.'" },
      ],
      vocabularyMatching: {
        pairs: [
          { word: "eager", definition: "very interested and excited to do something" },
          { word: "curious", definition: "wanting to know or learn about things" },
          { word: "deserve", definition: "to have earned something through actions" },
          { word: "possibility", definition: "something that might happen" },
          { word: "government", definition: "the group of people who control a country" },
          { word: "refuse", definition: "to say no to something" },
          { word: "dream", definition: "something you hope will happen" },
          { word: "sacrifice", definition: "to give up something important" },
          { word: "knowledge", definition: "information and understanding" },
          { word: "powerful", definition: "having great strength or influence" },
        ],
      },
      gapFill: {
        text: "My name is Fatima. For many years, I worked as a _____ in a girls' school. My students were _____ to learn. They asked questions about _____. Now, the government says women cannot _____. I remember one girl named _____. She wanted to become a _____. Education _____ lives. My mother could not _____. She wanted a better _____ for me. Hope is _____.",
        blanks: [
          { id: 1, answer: "teacher" },
          { id: 2, answer: "eager" },
          { id: 3, answer: "everything" },
          { id: 4, answer: "work" },
          { id: 5, answer: "Zahra" },
          { id: 6, answer: "doctor" },
          { id: 7, answer: "changes" },
          { id: 8, answer: "read" },
          { id: 9, answer: "life" },
          { id: 10, answer: "powerful" },
        ],
        wordBank: ["teacher", "eager", "everything", "work", "Zahra", "doctor", "changes", "read", "life", "powerful", "nothing", "weak", "Maryam"],
      },
      wordOrder: {
        sentences: [
          { scrambled: ["excited", "go", "to", "was", "I", "work", "to"], correct: "I was excited to go to work" },
          { scrambled: ["eager", "were", "learn", "to", "students", "My"], correct: "My students were eager to learn" },
          { scrambled: ["changed", "has", "Everything"], correct: "Everything has changed" },
          { scrambled: ["lives", "changes", "Education"], correct: "Education changes lives" },
          { scrambled: ["powerful", "is", "Hope"], correct: "Hope is powerful" },
          { scrambled: ["learn", "to", "chance", "the", "deserves", "child", "Every"], correct: "Every child deserves the chance to learn" },
          { scrambled: ["become", "to", "wanted", "She", "doctor", "a"], correct: "She wanted to become a doctor" },
          { scrambled: ["give", "up", "refuse", "to", "I"], correct: "I refuse to give up" },
          { scrambled: ["change", "will", "things", "day", "one"], correct: "One day things will change" },
          { scrambled: ["hard", "studied", "very", "She"], correct: "She studied very hard" },
        ],
      },
      trueFalse: {
        statements: [
          { text: "Fatima woke up excited to go to work.", answer: true, explanation: "The text says 'Every morning, I woke up excited to go to work.'" },
          { text: "Fatima's students didn't like asking questions.", answer: false, explanation: "The students 'asked questions about everything.'" },
          { text: "Zahra wanted to be a teacher like Fatima.", answer: false, explanation: "Zahra wanted to become a doctor." },
          { text: "Fatima's mother could read very well.", answer: false, explanation: "The text says 'my mother could not read.'" },
          { text: "Schools for girls are now closed.", answer: true, explanation: "The text says 'Schools for girls are closed.'" },
          { text: "Fatima has given up hope.", answer: false, explanation: "Fatima says 'I refuse to give up on my dreams.'" },
          { text: "Some of Fatima's former students are now mothers.", answer: true, explanation: "The text says 'Many of them are now mothers themselves.'" },
          { text: "Fatima stays at home and does nothing.", answer: false, explanation: "Fatima reads and writes to keep her mind active." },
        ],
      },
      discussion: [
        "How did your parents or family help with your education?",
        "What challenges do students face in your country?",
        "Why do you think hope is important during difficult times?",
      ],
    },
    B1: {
      comprehension: [
        { id: "1", question: "How many years did Fatima work as a teacher?", options: [{ id: "a", text: "Fifteen years" }, { id: "b", text: "Twenty years" }, { id: "c", text: "Twenty-three years" }, { id: "d", text: "Thirty years" }], correctAnswer: "c", explanation: "The text states Fatima 'dedicated' herself to education 'for twenty-three years.'" },
        { id: "2", question: "What happened when the new government took power?", options: [{ id: "a", text: "Schools improved" }, { id: "b", text: "Women were banned from working" }, { id: "c", text: "Fatima got promoted" }, { id: "d", text: "More schools opened" }], correctAnswer: "b", explanation: "The text says 'Women were banned from working, and girls' schools were shut down.'" },
        { id: "3", question: "What did Fatima's mother sacrifice for her education?", options: [{ id: "a", text: "Her time" }, { id: "b", text: "Her health" }, { id: "c", text: "Everything" }, { id: "d", text: "Her home" }], correctAnswer: "c", explanation: "The text says Fatima's mother 'sacrificed everything to send me to school.'" },
        { id: "4", question: "What does Fatima believe about knowledge?", options: [{ id: "a", text: "It can be taken away" }, { id: "b", text: "It cannot be taken away" }, { id: "c", text: "It is not important" }, { id: "d", text: "It is dangerous" }], correctAnswer: "b", explanation: "Fatima says 'knowledge cannot be taken away.'" },
        { id: "5", question: "What is Fatima documenting?", options: [{ id: "a", text: "News stories" }, { id: "b", text: "Recipes" }, { id: "c", text: "Stories from her teaching years" }, { id: "d", text: "Government policies" }], correctAnswer: "c", explanation: "The text says Fatima documents 'stories from my teaching years.'" },
      ],
      vocabularyMatching: {
        pairs: [
          { word: "dedicated", definition: "committed to a task or purpose" },
          { word: "calling", definition: "a strong feeling to do a particular job" },
          { word: "enthusiasm", definition: "intense enjoyment and interest" },
          { word: "unbearable", definition: "too painful or difficult to accept" },
          { word: "resilient", definition: "able to recover from difficulties" },
          { word: "inevitable", definition: "certain to happen; unavoidable" },
          { word: "restriction", definition: "a rule or limit on something" },
          { word: "companion", definition: "a person or thing you spend time with" },
          { word: "transform", definition: "to change completely" },
          { word: "profound", definition: "very deep or intense" },
        ],
      },
      gapFill: {
        text: "For twenty-three years, I _____ my life to education in Afghanistan. Working as a teacher was more than just a profession—it was my _____. My students brought energy and _____ that made every day meaningful. The silence in my home felt _____ after years of busy classrooms. The power of education cannot be _____ in simple terms. It _____ individuals and entire communities. Knowledge cannot be taken _____. Hope remains my constant _____. History teaches us that change is _____. _____ never last forever.",
        blanks: [
          { id: 1, answer: "dedicated" },
          { id: 2, answer: "calling" },
          { id: 3, answer: "enthusiasm" },
          { id: 4, answer: "unbearable" },
          { id: 5, answer: "measured" },
          { id: 6, answer: "transforms" },
          { id: 7, answer: "away" },
          { id: 8, answer: "companion" },
          { id: 9, answer: "inevitable" },
          { id: 10, answer: "Restrictions" },
        ],
        wordBank: ["dedicated", "calling", "enthusiasm", "unbearable", "measured", "transforms", "away", "companion", "inevitable", "Restrictions", "counted", "destroys", "permanent"],
      },
      wordOrder: {
        sentences: [
          { scrambled: ["calling", "my", "was", "it", "profession", "a", "than", "more"], correct: "It was more than a profession it was my calling" },
          { scrambled: ["cannot", "measured", "be", "education", "of", "power", "The"], correct: "The power of education cannot be measured" },
          { scrambled: ["away", "taken", "be", "cannot", "Knowledge"], correct: "Knowledge cannot be taken away" },
          { scrambled: ["change", "that", "us", "teaches", "inevitable", "is", "History"], correct: "History teaches us that change is inevitable" },
          { scrambled: ["forever", "last", "never", "Restrictions"], correct: "Restrictions never last forever" },
          { scrambled: ["companion", "constant", "my", "remains", "Hope"], correct: "Hope remains my constant companion" },
          { scrambled: ["meaningful", "day", "every", "made", "enthusiasm", "Their"], correct: "Their enthusiasm made every day meaningful" },
          { scrambled: ["communities", "entire", "and", "individuals", "transforms", "It"], correct: "It transforms individuals and entire communities" },
          { scrambled: ["classroom", "the", "to", "return", "will", "I"], correct: "I will return to the classroom" },
          { scrambled: ["questions", "challenging", "asked", "They"], correct: "They asked challenging questions" },
        ],
      },
      trueFalse: {
        statements: [
          { text: "Fatima worked in a boys' school.", answer: false, explanation: "Fatima worked in a 'girls' secondary school.'" },
          { text: "Fatima would arrive early at school to prepare lessons.", answer: true, explanation: "The text says she 'would arrive early at the school, preparing lessons.'" },
          { text: "Maryam wanted to become a surgeon.", answer: false, explanation: "Zahra dreamed of becoming a surgeon; Maryam wrote poetry." },
          { text: "Fatima's mother was well-educated.", answer: false, explanation: "Her mother 'never learned to read or write.'" },
          { text: "The girls continue to teach their siblings at home.", answer: true, explanation: "The text says 'They teach their younger siblings at home.'" },
          { text: "Fatima has stopped reading and writing.", answer: false, explanation: "Fatima 'fills her days with reading and writing.'" },
          { text: "Fatima believes she will never teach again.", answer: false, explanation: "She believes 'someday, I will return to the classroom.'" },
          { text: "Fatima's students asked challenging questions.", answer: true, explanation: "The text mentions students with 'surprising depth' who 'asked challenging questions.'" },
        ],
      },
      discussion: [
        "What qualities make education transformative for individuals and communities?",
        "How can people maintain hope during prolonged periods of difficulty?",
        "What role does informal education play when formal schooling is unavailable?",
      ],
    },
    B2: {
      comprehension: [
        { id: "1", question: "How does Fatima describe her teaching career?", options: [{ id: "a", text: "As a necessary job" }, { id: "b", text: "As her deepest convictions about human potential" }, { id: "c", text: "As a way to earn money" }, { id: "d", text: "As something she fell into accidentally" }], correctAnswer: "b", explanation: "Fatima says teaching 'represented my deepest convictions about human potential and the transformative power of learning.'" },
        { id: "2", question: "What does Fatima compare the enforced idleness to?", options: [{ id: "a", text: "A vacation" }, { id: "b", text: "A physical weight pressing down" }, { id: "c", text: "A long sleep" }, { id: "d", text: "A dream" }], correctAnswer: "b", explanation: "The text describes enforced idleness as 'a physical weight pressing down on my chest.'" },
        { id: "3", question: "What has happened to education since the restrictions?", options: [{ id: "a", text: "It has completely stopped" }, { id: "b", text: "It has moved underground" }, { id: "c", text: "It has improved" }, { id: "d", text: "It has become more public" }], correctAnswer: "b", explanation: "The text says 'The current restrictions have not eliminated education—they have merely driven it underground.'" },
        { id: "4", question: "What does Fatima say about knowledge and suppression?", options: [{ id: "a", text: "Knowledge can be easily suppressed" }, { id: "b", text: "Knowledge is resistant to suppression" }, { id: "c", text: "Suppression makes knowledge weaker" }, { id: "d", text: "Knowledge and suppression are unrelated" }], correctAnswer: "b", explanation: "The text states 'Knowledge, once acquired, proves remarkably resistant to suppression.'" },
        { id: "5", question: "What purpose does Fatima's writing serve?", options: [{ id: "a", text: "Only entertainment" }, { id: "b", text: "Multiple purposes including preserving memories and inspiring others" }, { id: "c", text: "Making money" }, { id: "d", text: "Criticizing the government" }], correctAnswer: "b", explanation: "The text says her records serve 'multiple purposes: preserving memories, processing difficult emotions, and potentially inspiring future generations.'" },
      ],
      vocabularyMatching: {
        pairs: [
          { word: "convictions", definition: "strong beliefs or opinions" },
          { word: "voracity", definition: "eagerness or enthusiasm in pursuit of something" },
          { word: "prohibition", definition: "the act of officially forbidding something" },
          { word: "devastating", definition: "causing severe shock or destruction" },
          { word: "suppress", definition: "to forcibly put an end to something" },
          { word: "clandestine", definition: "done secretly or kept hidden" },
          { word: "imperative", definition: "of vital importance; crucial" },
          { word: "precedent", definition: "an earlier event serving as an example" },
          { word: "intuitively", definition: "in a way based on feelings rather than facts" },
          { word: "repressive", definition: "inhibiting or restraining freedom" },
        ],
      },
      gapFill: {
        text: "For twenty-three years, I devoted myself entirely to education, serving as a teacher. It represented my deepest _____ about human potential. Their intellectual _____ constantly surprised me. The sudden _____ on women's work devastated my career. The current restrictions have not eliminated education—they have merely driven it _____. Women gather _____ to teach and learn. Knowledge, once acquired, proves remarkably resistant to _____. Historical _____ suggests that repressive measures eventually falter. The desire for education only _____ with prohibition. I maintain absolute _____ that circumstances will change.",
        blanks: [
          { id: 1, answer: "convictions" },
          { id: 2, answer: "curiosity" },
          { id: 3, answer: "prohibition" },
          { id: 4, answer: "underground" },
          { id: 5, answer: "secretly" },
          { id: 6, answer: "suppression" },
          { id: 7, answer: "precedent" },
          { id: 8, answer: "intensifies" },
          { id: 9, answer: "confidence" },
        ],
        wordBank: ["convictions", "curiosity", "prohibition", "underground", "secretly", "suppression", "precedent", "intensifies", "confidence", "doubts", "publicly", "weakens", "permission"],
      },
      wordOrder: {
        sentences: [
          { scrambled: ["suppression", "to", "resistant", "remarkably", "proves", "Knowledge"], correct: "Knowledge proves remarkably resistant to suppression" },
          { scrambled: ["underground", "driven", "it", "merely", "have", "they"], correct: "They have merely driven it underground" },
          { scrambled: ["falter", "eventually", "measures", "repressive", "that", "suggests", "precedent", "Historical"], correct: "Historical precedent suggests that repressive measures eventually falter" },
          { scrambled: ["prohibition", "with", "intensifies", "education", "for", "desire", "The"], correct: "The desire for education intensifies with prohibition" },
          { scrambled: ["potential", "human", "about", "convictions", "deepest", "my", "represented", "It"], correct: "It represented my deepest convictions about human potential" },
          { scrambled: ["me", "surprised", "constantly", "curiosity", "intellectual", "Their"], correct: "Their intellectual curiosity constantly surprised me" },
          { scrambled: ["career", "my", "devastated", "prohibition", "sudden", "The"], correct: "The sudden prohibition devastated my career" },
          { scrambled: ["learn", "and", "teach", "to", "secretly", "gather", "Women"], correct: "Women gather secretly to teach and learn" },
          { scrambled: ["change", "will", "circumstances", "that", "confidence", "maintain", "I"], correct: "I maintain confidence that circumstances will change" },
          { scrambled: ["existence", "my", "meaning", "gave", "profession", "the", "that"], correct: "The profession that gave my existence meaning" },
        ],
      },
      trueFalse: {
        statements: [
          { text: "Fatima describes teaching as merely a job for income.", answer: false, explanation: "She says it 'represented my deepest convictions about human potential.'" },
          { text: "The enforced idleness affected Fatima's sense of identity.", answer: true, explanation: "The text says it 'devastated not just my career but my sense of identity.'" },
          { text: "Sana was the student who excelled at biology.", answer: false, explanation: "Zahra had aptitude for biology; Sana struggled academically." },
          { text: "Fatima's mother worked as a cleaner.", answer: true, explanation: "The text says 'She worked exhausting hours as a cleaner.'" },
          { text: "Education has been completely eliminated under the restrictions.", answer: false, explanation: "The text says restrictions 'have not eliminated education—they have merely driven it underground.'" },
          { text: "Former students share books in private homes.", answer: true, explanation: "The text mentions 'sharing books and discussing ideas in private homes.'" },
          { text: "Fatima believes repressive regimes will last forever.", answer: false, explanation: "She says 'Historical precedent suggests that repressive measures eventually falter.'" },
          { text: "The desire for education decreases when it is prohibited.", answer: false, explanation: "The text says 'The desire for education...only intensifies with prohibition.'" },
        ],
      },
      discussion: [
        "How does the prohibition of education paradoxically strengthen the desire for learning?",
        "What ethical obligations do we have to ensure universal access to education?",
        "How can documentation and personal narratives contribute to social change?",
      ],
    },
    C1: {
      comprehension: [
        { id: "1", question: "How does Fatima characterize the potential of education?", options: [{ id: "a", text: "As merely practical" }, { id: "b", text: "As emancipatory" }, { id: "c", text: "As overrated" }, { id: "d", text: "As limited" }], correctAnswer: "b", explanation: "Fatima refers to 'the emancipatory potential of education.'" },
        { id: "2", question: "What does Fatima say about her students' arguments?", options: [{ id: "a", text: "They were simplistic" }, { id: "b", text: "They showed sophisticated argumentation" }, { id: "c", text: "They were always wrong" }, { id: "d", text: "They avoided controversy" }], correctAnswer: "b", explanation: "The text mentions students 'challenging historical interpretations with sophisticated argumentation.'" },
        { id: "3", question: "How does Fatima describe the effect of enforced domesticity?", options: [{ id: "a", text: "As refreshing" }, { id: "b", text: "As a form of suffocation" }, { id: "c", text: "As productive" }, { id: "d", text: "As peaceful" }], correctAnswer: "b", explanation: "The text describes 'enforced domesticity felt like a form of suffocation.'" },
        { id: "4", question: "What ethical imperative did Fatima's mother establish?", options: [{ id: "a", text: "That wealth is essential" }, { id: "b", text: "That everyone has a right to knowledge" }, { id: "c", text: "That obedience is paramount" }, { id: "d", text: "That tradition must be preserved" }], correctAnswer: "b", explanation: "The text states her mother's sacrifice 'established an ethical imperative...every human being possesses an inherent right to knowledge.'" },
        { id: "5", question: "What does Fatima say about authoritarian suppression?", options: [{ id: "a", text: "It always succeeds eventually" }, { id: "b", text: "It has no effect on education" }, { id: "c", text: "Regimes encounter limits to their coercive capabilities" }, { id: "d", text: "It makes people give up" }], correctAnswer: "c", explanation: "The text states 'repressive regimes invariably encounter the limits of their coercive capabilities.'" },
      ],
      vocabularyMatching: {
        pairs: [
          { word: "emancipatory", definition: "setting free from legal, social, or political restrictions" },
          { word: "pedagogical", definition: "relating to the methods and practice of teaching" },
          { word: "voracity", definition: "extreme eagerness or enthusiasm" },
          { word: "ineffable", definition: "too great or extreme to be expressed in words" },
          { word: "categorically", definition: "in a way that is absolute and unconditional" },
          { word: "clandestinely", definition: "in a secretive or hidden manner" },
          { word: "imperviousness", definition: "inability to be affected or disturbed" },
          { word: "existential", definition: "relating to existence or the nature of being" },
          { word: "coercive", definition: "using force or threats to make someone comply" },
          { word: "imbued", definition: "filled with a particular quality or feeling" },
        ],
      },
      gapFill: {
        text: "Throughout twenty-three years of teaching, I witnessed young women discover their intellectual capabilities. It represented my most profound convictions about human dignity and the _____ potential of education. Their intellectual _____ never ceased to astound me. The abrupt prohibition shattered my fundamental sense of purpose and _____. The _____ domesticity felt like a form of suffocation. Contemporary restrictions have merely displaced education into _____ spaces. Knowledge demonstrates remarkable _____ to authoritarian suppression. Historical analysis suggests that repressive regimes invariably encounter the limits of their _____ capabilities. I maintain unwavering conviction that circumstances will eventually _____.",
        blanks: [
          { id: 1, answer: "emancipatory" },
          { id: 2, answer: "voracity" },
          { id: 3, answer: "identity" },
          { id: 4, answer: "enforced" },
          { id: 5, answer: "clandestine" },
          { id: 6, answer: "imperviousness" },
          { id: 7, answer: "coercive" },
          { id: 8, answer: "transform" },
        ],
        wordBank: ["emancipatory", "voracity", "identity", "enforced", "clandestine", "imperviousness", "coercive", "transform", "restrictive", "vulnerability", "persuasive", "deteriorate", "public"],
      },
      wordOrder: {
        sentences: [
          { scrambled: ["suppression", "authoritarian", "to", "imperviousness", "remarkable", "demonstrates", "Knowledge"], correct: "Knowledge demonstrates remarkable imperviousness to authoritarian suppression" },
          { scrambled: ["capabilities", "coercive", "their", "of", "limits", "the", "encounter", "invariably", "regimes", "Repressive"], correct: "Repressive regimes invariably encounter the limits of their coercive capabilities" },
          { scrambled: ["suffocation", "of", "form", "a", "like", "felt", "domesticity", "enforced", "The"], correct: "The enforced domesticity felt like a form of suffocation" },
          { scrambled: ["spaces", "clandestine", "into", "it", "displaced", "merely", "have", "restrictions", "Contemporary"], correct: "Contemporary restrictions have merely displaced it into clandestine spaces" },
          { scrambled: ["education", "of", "potential", "emancipatory", "the", "about", "convictions", "profound", "most", "my"], correct: "My most profound convictions about the emancipatory potential of education" },
          { scrambled: ["me", "astound", "to", "ceased", "never", "voracity", "intellectual", "Their"], correct: "Their intellectual voracity never ceased to astound me" },
          { scrambled: ["identity", "and", "purpose", "of", "sense", "fundamental", "my", "shattered", "prohibition", "The"], correct: "The prohibition shattered my fundamental sense of purpose and identity" },
          { scrambled: ["prohibition", "under", "intensifies", "paradoxically", "education", "for", "yearning", "The"], correct: "The yearning for education paradoxically intensifies under prohibition" },
          { scrambled: ["transform", "eventually", "will", "circumstances", "that", "conviction", "unwavering", "maintain", "I"], correct: "I maintain unwavering conviction that circumstances will eventually transform" },
          { scrambled: ["significance", "with", "existence", "my", "imbued", "that", "vocation", "the"], correct: "The vocation that imbued my existence with significance" },
        ],
      },
      trueFalse: {
        statements: [
          { text: "Fatima views education as having emancipatory potential.", answer: true, explanation: "She explicitly refers to 'the emancipatory potential of education.'" },
          { text: "The students' questions were unsophisticated.", answer: false, explanation: "Students showed 'sophisticated argumentation' when challenging interpretations." },
          { text: "Maryam could articulate complex emotions with precision.", answer: true, explanation: "Maryam 'could articulate ineffable emotional complexities with devastating precision.'" },
          { text: "Fatima's mother was literate throughout her life.", answer: false, explanation: "Her mother 'remained illiterate throughout her seventy-two years.'" },
          { text: "Knowledge shows vulnerability to authoritarian suppression.", answer: false, explanation: "Knowledge demonstrates 'remarkable imperviousness to authoritarian suppression.'" },
          { text: "Educational activities have ceased entirely under the current regime.", answer: false, explanation: "Education has been 'displaced into clandestine spaces,' not eliminated." },
          { text: "Fatima believes repressive capabilities have no limits.", answer: false, explanation: "She says regimes 'encounter the limits of their coercive capabilities.'" },
          { text: "The desire for education weakens when prohibited.", answer: false, explanation: "The 'yearning for education...paradoxically intensifies under prohibition.'" },
        ],
      },
      discussion: [
        "How does the concept of 'emancipatory education' relate to broader movements for social justice?",
        "What psychological mechanisms allow individuals to maintain hope and purpose during prolonged periods of oppression?",
        "To what extent can clandestine educational networks compensate for the loss of formal institutional structures?",
      ],
    },
  },
};

export const mockArticles: Article[] = [
  mockArticle,
  {
    ...mockArticle,
    id: "2",
    slug: "ocean-plastic-crisis",
    title: "The Ocean Plastic Crisis",
    subtitle: "Scientists discover new solutions to clean our seas",
    category: "science",
    tags: ["environment", "ocean", "plastic", "science"],
    source: "Nature",
    heroImage: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1600&h=900&fit=crop",
    heroAlt: "Ocean waves with visible pollution",
  },
  {
    ...mockArticle,
    id: "3",
    slug: "world-cup-dreams",
    title: "World Cup Dreams",
    subtitle: "How underdogs are changing international football",
    category: "sports",
    tags: ["football", "world cup", "sports"],
    source: "ESPN",
    heroImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&h=900&fit=crop",
    heroAlt: "Football stadium at night",
  },
  {
    ...mockArticle,
    id: "4",
    slug: "ancient-art-discovery",
    title: "Ancient Art Discovery",
    subtitle: "Cave paintings reveal secrets of early human creativity",
    category: "culture",
    tags: ["art", "history", "archaeology"],
    source: "Smithsonian",
    heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&h=900&fit=crop",
    heroAlt: "Ancient cave painting",
  },
  {
    ...mockArticle,
    id: "5",
    slug: "robot-chef-restaurant",
    title: "Robot Chef Opens Restaurant",
    subtitle: "The future of dining is automated and delicious",
    category: "fun",
    tags: ["technology", "food", "robots"],
    source: "Wired",
    heroImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&h=900&fit=crop",
    heroAlt: "Robotic arm in kitchen",
  },
];
