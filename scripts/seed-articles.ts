import "dotenv/config";
import { db } from "../src/lib/db";

const SEED_ARTICLES = [
  {
    slug: "scientists-discover-ocean-microplastics",
    title: "Scientists Discover Microplastics in Remote Ocean Waters",
    subtitle: "New research reveals plastic pollution has reached the most isolated marine environments",
    category: "science",
    source: "Science Daily",
    sourceUrl: "https://sciencedaily.com/seed/microplastics-ocean-1",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
    heroAlt: "Ocean water with plastic pollution",
    content: {
      A1: "Scientists found tiny plastic in the ocean. The plastic is very small. It is everywhere in the water. This is bad for fish. Fish eat the plastic. We need to use less plastic. We need to clean the ocean.",
      A2: "Scientists have found tiny pieces of plastic in the ocean. These small plastics are called microplastics. They found them in water very far from land. Fish eat these plastics by mistake. This is a big problem for the ocean. Many animals can get sick from eating plastic.",
      B1: "Marine researchers have made an important discovery about plastic pollution in our oceans. A comprehensive study has revealed that microplastics have now reached even the most remote areas of the world's seas. The research team collected water samples from fifty different locations across the Pacific and Atlantic oceans. They found microplastics in every single sample, even in areas thousands of kilometers from the nearest coastline.",
      B2: "Marine researchers have made a disturbing discovery about the extent of plastic pollution in our oceans. A comprehensive study has revealed that microplastics have now reached even the most remote and isolated areas of the world's seas. The research team collected water samples from fifty different locations across the Pacific and Atlantic oceans. Despite their remoteness, every single sample contained microplastic particles. The researchers warn that this pollution poses a serious threat to marine ecosystems.",
      C1: "Marine researchers have made a disturbing discovery about the extent of plastic pollution in our oceans. A comprehensive study has revealed that microplastics have now reached even the most remote and isolated areas of the world's seas. The research team collected water samples from fifty different locations across the Pacific and Atlantic oceans, many thousands of kilometers from the nearest coastline. Despite their remoteness, every single sample contained microplastic particles. The researchers warn that this ubiquitous pollution poses a serious and unprecedented threat to marine ecosystems worldwide.",
    },
    titles: {
      A1: "Tiny Plastic Found in Ocean",
      A2: "Scientists Find Small Plastic in Ocean Water",
      B1: "Microplastics Discovered in Remote Ocean Areas",
      B2: "Plastic Pollution Reaches Earth's Most Isolated Seas",
      C1: "Microplastic Contamination Pervades Remote Marine Environments",
    },
    subtitles: {
      A1: "Plastic is bad for fish and water",
      A2: "Small plastic pieces are everywhere in the sea",
      B1: "Research shows plastic has spread to distant waters",
      B2: "New study reveals extent of ocean pollution crisis",
      C1: "Comprehensive analysis exposes unprecedented marine contamination",
    },
    exercises: {
      A1: {
        comprehension: [
          { id: "1", question: "Where did scientists find plastic?", options: [{ id: "a", text: "In the mountains" }, { id: "b", text: "In the ocean" }, { id: "c", text: "In the forest" }, { id: "d", text: "In the city" }], correctAnswer: "b", explanation: "Scientists found plastic in the ocean water." },
          { id: "2", question: "Is the plastic big or small?", options: [{ id: "a", text: "Very big" }, { id: "b", text: "Very small" }, { id: "c", text: "Medium" }, { id: "d", text: "Huge" }], correctAnswer: "b", explanation: "The plastic is very small." },
        ],
        vocabularyMatching: {
          pairs: [
            { word: "ocean", definition: "A very large area of salt water" },
            { word: "plastic", definition: "A material made by humans" },
            { word: "fish", definition: "An animal that lives in water" },
            { word: "tiny", definition: "Very small" },
            { word: "water", definition: "The liquid in rivers and seas" },
          ],
        },
        gapFill: {
          text: "Scientists found _____ plastic in the _____. It is bad for _____.",
          blanks: [
            { id: 1, answer: "tiny" },
            { id: 2, answer: "ocean" },
            { id: 3, answer: "fish" },
          ],
          wordBank: ["tiny", "ocean", "fish", "big", "mountain", "birds"],
        },
        wordOrder: {
          sentences: [
            { scrambled: ["found", "Scientists", "plastic", "tiny"], correct: "Scientists found tiny plastic" },
            { scrambled: ["is", "The", "small", "plastic", "very"], correct: "The plastic is very small" },
          ],
        },
        trueFalse: {
          statements: [
            { text: "Scientists found plastic in the ocean.", answer: true, explanation: "Yes, they found plastic in the ocean water." },
            { text: "The plastic is very big.", answer: false, explanation: "No, the plastic is very small." },
          ],
        },
        discussion: [
          "Do you use plastic every day?",
          "How can we use less plastic?",
          "Why is plastic bad for the ocean?",
        ],
      },
      A2: {
        comprehension: [
          { id: "1", question: "What are microplastics?", options: [{ id: "a", text: "Big pieces of plastic" }, { id: "b", text: "Small pieces of plastic" }, { id: "c", text: "A type of fish" }, { id: "d", text: "Ocean water" }], correctAnswer: "b", explanation: "Microplastics are small pieces of plastic." },
          { id: "2", question: "Where did scientists find microplastics?", options: [{ id: "a", text: "Only near cities" }, { id: "b", text: "Only in rivers" }, { id: "c", text: "Far from land" }, { id: "d", text: "Only on beaches" }], correctAnswer: "c", explanation: "They found them far from land in the ocean." },
        ],
        vocabularyMatching: {
          pairs: [
            { word: "microplastics", definition: "Very small pieces of plastic" },
            { word: "pollution", definition: "When something makes the environment dirty" },
            { word: "remote", definition: "Far away from other places" },
            { word: "discover", definition: "To find something new" },
            { word: "ocean", definition: "A very large area of salt water" },
          ],
        },
        gapFill: {
          text: "Scientists have _____ tiny pieces of _____ in the ocean. Fish eat these _____ by mistake.",
          blanks: [
            { id: 1, answer: "found" },
            { id: 2, answer: "plastic" },
            { id: 3, answer: "microplastics" },
          ],
          wordBank: ["found", "plastic", "microplastics", "lost", "metal", "food"],
        },
        wordOrder: {
          sentences: [
            { scrambled: ["found", "Scientists", "have", "microplastics"], correct: "Scientists have found microplastics" },
            { scrambled: ["is", "This", "a", "problem", "big"], correct: "This is a big problem" },
          ],
        },
        trueFalse: {
          statements: [
            { text: "Microplastics are only found near cities.", answer: false, explanation: "They are found far from land too." },
            { text: "Fish can eat microplastics by mistake.", answer: true, explanation: "Yes, fish eat them thinking they are food." },
          ],
        },
        discussion: [
          "What kinds of plastic do you use every day?",
          "How does plastic get into the ocean?",
          "What can we do to help the ocean?",
        ],
      },
      B1: {
        comprehension: [
          { id: "1", question: "How many locations did researchers study?", options: [{ id: "a", text: "Twenty" }, { id: "b", text: "Fifty" }, { id: "c", text: "One hundred" }, { id: "d", text: "Ten" }], correctAnswer: "b", explanation: "They collected samples from fifty different locations." },
          { id: "2", question: "Which oceans were studied?", options: [{ id: "a", text: "Only Pacific" }, { id: "b", text: "Only Atlantic" }, { id: "c", text: "Pacific and Atlantic" }, { id: "d", text: "Indian Ocean" }], correctAnswer: "c", explanation: "The study covered both Pacific and Atlantic oceans." },
        ],
        vocabularyMatching: {
          pairs: [
            { word: "comprehensive", definition: "Complete and thorough" },
            { word: "remote", definition: "Far away from other places" },
            { word: "isolated", definition: "Separated from others" },
            { word: "marine", definition: "Related to the sea" },
            { word: "samples", definition: "Small amounts taken for testing" },
          ],
        },
        gapFill: {
          text: "Marine researchers have made an important _____ about plastic pollution. They collected water _____ from fifty different _____.",
          blanks: [
            { id: 1, answer: "discovery" },
            { id: 2, answer: "samples" },
            { id: 3, answer: "locations" },
          ],
          wordBank: ["discovery", "samples", "locations", "mistake", "fish", "cities"],
        },
        wordOrder: {
          sentences: [
            { scrambled: ["reached", "have", "Microplastics", "remote", "areas"], correct: "Microplastics have reached remote areas" },
            { scrambled: ["collected", "The", "team", "water", "samples"], correct: "The team collected water samples" },
          ],
        },
        trueFalse: {
          statements: [
            { text: "The study only looked at coastal areas.", answer: false, explanation: "They studied remote areas far from coastlines." },
            { text: "Every sample contained microplastics.", answer: true, explanation: "All samples showed microplastic contamination." },
          ],
        },
        discussion: [
          "Why is ocean pollution an important issue?",
          "How do you think plastic reaches remote ocean areas?",
          "What role can individuals play in reducing plastic pollution?",
        ],
      },
      B2: {
        comprehension: [
          { id: "1", question: "What was surprising about the findings?", options: [{ id: "a", text: "Microplastics were only near cities" }, { id: "b", text: "Every remote sample had microplastics" }, { id: "c", text: "No pollution was found" }, { id: "d", text: "Only large plastic was found" }], correctAnswer: "b", explanation: "Despite being thousands of kilometers from coastlines, all samples contained microplastics." },
          { id: "2", question: "What do researchers warn about?", options: [{ id: "a", text: "Fish population growth" }, { id: "b", text: "Threat to marine ecosystems" }, { id: "c", text: "Ocean temperature rise" }, { id: "d", text: "Coastal development" }], correctAnswer: "b", explanation: "They warn this pollution poses a serious threat to marine ecosystems." },
        ],
        vocabularyMatching: {
          pairs: [
            { word: "disturbing", definition: "Causing worry or concern" },
            { word: "comprehensive", definition: "Including everything; thorough" },
            { word: "coastline", definition: "The land along the edge of the sea" },
            { word: "remoteness", definition: "The quality of being far away" },
            { word: "ecosystems", definition: "Communities of living things and their environment" },
          ],
        },
        gapFill: {
          text: "The study has _____ that microplastics have reached the most _____ areas. Despite their _____, every sample contained plastic particles.",
          blanks: [
            { id: 1, answer: "revealed" },
            { id: 2, answer: "remote" },
            { id: 3, answer: "remoteness" },
          ],
          wordBank: ["revealed", "remote", "remoteness", "hidden", "nearby", "closeness"],
        },
        wordOrder: {
          sentences: [
            { scrambled: ["poses", "This", "a", "threat", "serious", "pollution"], correct: "This pollution poses a serious threat" },
            { scrambled: ["isolated", "most", "the", "Even", "areas", "are", "contaminated"], correct: "Even the most isolated areas are contaminated" },
          ],
        },
        trueFalse: {
          statements: [
            { text: "The pollution only affects areas near human activity.", answer: false, explanation: "The study found pollution even in the most remote locations." },
            { text: "The researchers are concerned about marine ecosystems.", answer: true, explanation: "They specifically warn about threats to marine ecosystems." },
          ],
        },
        discussion: [
          "What are the long-term consequences of microplastic pollution?",
          "How should governments respond to this research?",
          "What innovations could help address ocean plastic pollution?",
        ],
      },
      C1: {
        comprehension: [
          { id: "1", question: "What makes this pollution particularly concerning?", options: [{ id: "a", text: "It only affects one ocean" }, { id: "b", text: "It is ubiquitous even in remote areas" }, { id: "c", text: "It is decreasing over time" }, { id: "d", text: "It only affects surface water" }], correctAnswer: "b", explanation: "The ubiquitous nature of the pollution, reaching even the most remote locations, makes it particularly concerning." },
          { id: "2", question: "How is this threat characterized?", options: [{ id: "a", text: "Minor and temporary" }, { id: "b", text: "Limited to coastal regions" }, { id: "c", text: "Serious and unprecedented" }, { id: "d", text: "Easily reversible" }], correctAnswer: "c", explanation: "Researchers characterize it as a serious and unprecedented threat to marine ecosystems worldwide." },
        ],
        vocabularyMatching: {
          pairs: [
            { word: "ubiquitous", definition: "Present everywhere; widespread" },
            { word: "unprecedented", definition: "Never done or known before" },
            { word: "pervades", definition: "Spreads throughout; permeates" },
            { word: "contamination", definition: "The presence of unwanted substances" },
            { word: "comprehensive", definition: "Complete; including all aspects" },
          ],
        },
        gapFill: {
          text: "This _____ pollution poses an _____ threat to marine ecosystems worldwide. The _____ nature of the contamination is particularly concerning.",
          blanks: [
            { id: 1, answer: "ubiquitous" },
            { id: 2, answer: "unprecedented" },
            { id: 3, answer: "pervasive" },
          ],
          wordBank: ["ubiquitous", "unprecedented", "pervasive", "limited", "common", "restricted"],
        },
        wordOrder: {
          sentences: [
            { scrambled: ["poses", "pollution", "This", "threat", "unprecedented", "an"], correct: "This pollution poses an unprecedented threat" },
            { scrambled: ["contamination", "The", "remote", "most", "the", "reaches", "areas"], correct: "The contamination reaches the most remote areas" },
          ],
        },
        trueFalse: {
          statements: [
            { text: "The contamination is limited to specific geographic regions.", answer: false, explanation: "The study demonstrates ubiquitous contamination across remote oceanic regions." },
            { text: "This represents an unprecedented environmental challenge.", answer: true, explanation: "Researchers characterize this as an unprecedented threat to marine ecosystems." },
          ],
        },
        discussion: [
          "What systemic changes are needed to address microplastic pollution?",
          "How does this research challenge our understanding of ocean health?",
          "What ethical responsibilities do developed nations have regarding ocean pollution?",
        ],
      },
    },
    vocabulary: [
      { word: "ocean", definition: "A very large area of salt water", level: "A1" },
      { word: "plastic", definition: "A light, strong material made by humans", level: "A1" },
      { word: "tiny", definition: "Very small in size", level: "A1" },
      { word: "fish", definition: "An animal that lives in water", level: "A1" },
      { word: "water", definition: "The liquid in rivers and seas", level: "A1" },
      { word: "microplastics", definition: "Very small pieces of plastic", level: "A2" },
      { word: "pollution", definition: "When something makes the environment dirty", level: "A2" },
      { word: "remote", definition: "Far away from other places", level: "A2" },
      { word: "discover", definition: "To find something for the first time", level: "A2" },
      { word: "mistake", definition: "Something done wrong by accident", level: "A2" },
      { word: "comprehensive", definition: "Complete and thorough", level: "B1" },
      { word: "marine", definition: "Related to the sea or ocean", level: "B1" },
      { word: "isolated", definition: "Separated from others", level: "B1" },
      { word: "samples", definition: "Small amounts taken for testing", level: "B1" },
      { word: "coastline", definition: "The land along the edge of the sea", level: "B1" },
      { word: "disturbing", definition: "Causing worry or concern", level: "B2" },
      { word: "extent", definition: "The size or scale of something", level: "B2" },
      { word: "remoteness", definition: "The quality of being far away", level: "B2" },
      { word: "ecosystems", definition: "Communities of living things and their environment", level: "B2" },
      { word: "particles", definition: "Very small pieces of matter", level: "B2" },
      { word: "ubiquitous", definition: "Present everywhere; widespread", level: "C1" },
      { word: "unprecedented", definition: "Never done or known before", level: "C1" },
      { word: "pervades", definition: "Spreads throughout; permeates", level: "C1" },
      { word: "contamination", definition: "The presence of unwanted substances", level: "C1" },
      { word: "pervasive", definition: "Spreading widely throughout an area", level: "C1" },
    ],
    wordCounts: { A1: 42, A2: 61, B1: 98, B2: 121, C1: 138 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
    publishedAt: new Date("2026-01-08T06:00:00Z"),
  },
  {
    slug: "japan-earthquake-recovery-efforts",
    title: "Japan Begins Recovery After Major Earthquake",
    subtitle: "Communities work together to rebuild following the devastating natural disaster",
    category: "world",
    source: "BBC World",
    sourceUrl: "https://bbc.com/seed/japan-earthquake-1",
    heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200",
    heroAlt: "Emergency response teams in Japan",
    content: {
      A1: "A big earthquake hit Japan. Many buildings fell down. People are working together to help. They are cleaning the streets. They are fixing houses. Everyone is helping each other. This is important.",
      A2: "A major earthquake struck Japan last week. The earthquake damaged many buildings and roads. Emergency teams came to help people. Now, communities are working together to rebuild. Volunteers are cleaning up debris. Construction workers are repairing damaged structures. The recovery process will take time.",
      B1: "A powerful earthquake struck central Japan last week, causing significant damage to infrastructure and homes across several cities. Emergency response teams worked around the clock to rescue people and provide essential services. Now, as the immediate crisis passes, communities are beginning the long process of recovery. Local residents, volunteers, and construction teams are collaborating to clear debris, repair damaged buildings, and restore normalcy to affected areas.",
      B2: "A powerful earthquake struck central Japan last week, causing significant damage to infrastructure and homes across several cities. Emergency response teams worked tirelessly to rescue those trapped and provide essential services to affected communities. Now, as the immediate crisis subsides, the focus has shifted to long-term recovery efforts. Local residents, volunteers, and construction teams are collaborating extensively to clear debris, repair damaged structures, and restore normalcy. The Japanese government has pledged substantial financial support for reconstruction.",
      C1: "A powerful earthquake struck central Japan last week, causing significant damage to infrastructure and homes across several cities. Emergency response teams worked tirelessly to rescue those trapped and provide essential services to affected communities. Now, as the immediate crisis subsides, the focus has shifted to comprehensive long-term recovery efforts. Local residents, volunteers, and construction teams are collaborating extensively to clear debris, repair damaged structures, and restore normalcy to devastated areas. The Japanese government has pledged substantial financial support for reconstruction, while emphasizing the importance of building more resilient infrastructure to withstand future seismic events.",
    },
    titles: {
      A1: "Big Earthquake Hits Japan",
      A2: "Japan Starts Recovery After Earthquake",
      B1: "Japanese Communities Begin Earthquake Recovery",
      B2: "Japan Launches Major Recovery After Devastating Quake",
      C1: "Japan Initiates Comprehensive Reconstruction Following Seismic Disaster",
    },
    subtitles: {
      A1: "People work together to help and fix buildings",
      A2: "Communities work to rebuild after natural disaster",
      B1: "Recovery efforts underway as communities rebuild together",
      B2: "Government pledges support as communities collaborate on reconstruction",
      C1: "Coordinated recovery emphasizes resilient infrastructure development",
    },
    exercises: {
      A1: {
        comprehension: [
          { id: "1", question: "What happened in Japan?", options: [{ id: "a", text: "A big storm" }, { id: "b", text: "A big earthquake" }, { id: "c", text: "A fire" }, { id: "d", text: "Flooding" }], correctAnswer: "b", explanation: "A big earthquake hit Japan." },
          { id: "2", question: "What are people doing?", options: [{ id: "a", text: "Going on vacation" }, { id: "b", text: "Working together to help" }, { id: "c", text: "Leaving the country" }, { id: "d", text: "Nothing" }], correctAnswer: "b", explanation: "People are working together to help rebuild." },
        ],
        vocabularyMatching: {
          pairs: [
            { word: "earthquake", definition: "When the ground shakes strongly" },
            { word: "building", definition: "A structure like a house or school" },
            { word: "help", definition: "To do something useful for someone" },
            { word: "street", definition: "A road in a town or city" },
            { word: "together", definition: "With other people" },
          ],
        },
        gapFill: {
          text: "A big _____ hit Japan. Many _____ fell down. People are working _____ to help.",
          blanks: [
            { id: 1, answer: "earthquake" },
            { id: 2, answer: "buildings" },
            { id: 3, answer: "together" },
          ],
          wordBank: ["earthquake", "buildings", "together", "storm", "cars", "alone"],
        },
        wordOrder: {
          sentences: [
            { scrambled: ["earthquake", "A", "big", "Japan", "hit"], correct: "A big earthquake hit Japan" },
            { scrambled: ["helping", "is", "Everyone", "other", "each"], correct: "Everyone is helping each other" },
          ],
        },
        trueFalse: {
          statements: [
            { text: "An earthquake happened in Japan.", answer: true, explanation: "Yes, a big earthquake hit Japan." },
            { text: "Nobody is helping.", answer: false, explanation: "No, people are working together to help." },
          ],
        },
        discussion: [
          "Have you ever felt an earthquake?",
          "How can people help after a disaster?",
          "Why is teamwork important?",
        ],
      },
      A2: {
        comprehension: [
          { id: "1", question: "When did the earthquake happen?", options: [{ id: "a", text: "Yesterday" }, { id: "b", text: "Last week" }, { id: "c", text: "Last month" }, { id: "d", text: "Last year" }], correctAnswer: "b", explanation: "The earthquake struck Japan last week." },
          { id: "2", question: "Who is helping with recovery?", options: [{ id: "a", text: "Only the government" }, { id: "b", text: "Only volunteers" }, { id: "c", text: "Communities working together" }, { id: "d", text: "Nobody" }], correctAnswer: "c", explanation: "Communities are working together, including volunteers and workers." },
        ],
        vocabularyMatching: {
          pairs: [
            { word: "struck", definition: "Hit suddenly" },
            { word: "damaged", definition: "Broken or harmed" },
            { word: "emergency", definition: "A serious, unexpected situation" },
            { word: "volunteers", definition: "People who help without payment" },
            { word: "debris", definition: "Broken pieces of buildings or objects" },
          ],
        },
        gapFill: {
          text: "The earthquake _____ many buildings. Emergency teams came to _____ people. Now communities are working together to _____.",
          blanks: [
            { id: 1, answer: "damaged" },
            { id: 2, answer: "help" },
            { id: 3, answer: "rebuild" },
          ],
          wordBank: ["damaged", "help", "rebuild", "built", "ignore", "destroy"],
        },
        wordOrder: {
          sentences: [
            { scrambled: ["earthquake", "struck", "major", "A", "Japan"], correct: "A major earthquake struck Japan" },
            { scrambled: ["are", "Volunteers", "debris", "up", "cleaning"], correct: "Volunteers are cleaning up debris" },
          ],
        },
        trueFalse: {
          statements: [
            { text: "The earthquake damaged buildings and roads.", answer: true, explanation: "Yes, many buildings and roads were damaged." },
            { text: "Recovery will happen very quickly.", answer: false, explanation: "No, the recovery process will take time." },
          ],
        },
        discussion: [
          "What do emergency teams do after disasters?",
          "Why do people volunteer to help?",
          "What would you do if an earthquake happened near you?",
        ],
      },
      B1: {
        comprehension: [
          { id: "1", question: "Where in Japan did the earthquake occur?", options: [{ id: "a", text: "Northern Japan" }, { id: "b", text: "Central Japan" }, { id: "c", text: "Southern Japan" }, { id: "d", text: "All of Japan" }], correctAnswer: "b", explanation: "The earthquake struck central Japan." },
          { id: "2", question: "What are communities doing now?", options: [{ id: "a", text: "Evacuating" }, { id: "b", text: "Waiting for help" }, { id: "c", text: "Beginning recovery efforts" }, { id: "d", text: "Nothing" }], correctAnswer: "c", explanation: "Communities are beginning the long process of recovery." },
        ],
        vocabularyMatching: {
          pairs: [
            { word: "infrastructure", definition: "Basic systems like roads and electricity" },
            { word: "debris", definition: "Scattered broken pieces and rubble" },
            { word: "collaborate", definition: "Work together on a project" },
            { word: "normalcy", definition: "The state of being normal" },
            { word: "affected", definition: "Influenced or changed by something" },
          ],
        },
        gapFill: {
          text: "Emergency teams worked around the _____ to rescue people. Communities are now _____ to clear debris and restore _____.",
          blanks: [
            { id: 1, answer: "clock" },
            { id: 2, answer: "collaborating" },
            { id: 3, answer: "normalcy" },
          ],
          wordBank: ["clock", "collaborating", "normalcy", "day", "competing", "chaos"],
        },
        wordOrder: {
          sentences: [
            { scrambled: ["earthquake", "struck", "powerful", "A", "Japan", "central"], correct: "A powerful earthquake struck central Japan" },
            { scrambled: ["are", "teams", "collaborating", "Construction", "to", "repair", "buildings"], correct: "Construction teams are collaborating to repair buildings" },
          ],
        },
        trueFalse: {
          statements: [
            { text: "The earthquake only affected one city.", answer: false, explanation: "It caused damage across several cities." },
            { text: "Emergency teams worked continuously during the crisis.", answer: true, explanation: "Yes, they worked around the clock." },
          ],
        },
        discussion: [
          "Why is infrastructure important after a disaster?",
          "How do communities typically respond to natural disasters?",
          "What lessons can other countries learn from Japan's response?",
        ],
      },
      B2: {
        comprehension: [
          { id: "1", question: "What has the government promised?", options: [{ id: "a", text: "New laws" }, { id: "b", text: "Substantial financial support" }, { id: "c", text: "International help" }, { id: "d", text: "Nothing specific" }], correctAnswer: "b", explanation: "The government has pledged substantial financial support for reconstruction." },
          { id: "2", question: "What is the current focus?", options: [{ id: "a", text: "Immediate rescue" }, { id: "b", text: "Evacuation" }, { id: "c", text: "Long-term recovery" }, { id: "d", text: "Investigation" }], correctAnswer: "c", explanation: "The focus has shifted to long-term recovery efforts." },
        ],
        vocabularyMatching: {
          pairs: [
            { word: "tirelessly", definition: "Working without rest or fatigue" },
            { word: "subsides", definition: "Becomes less intense or severe" },
            { word: "extensively", definition: "In a large or comprehensive way" },
            { word: "pledged", definition: "Made a formal promise" },
            { word: "reconstruction", definition: "The process of building again" },
          ],
        },
        gapFill: {
          text: "As the crisis _____, focus has shifted to recovery. The government has _____ financial support, while communities _____ extensively.",
          blanks: [
            { id: 1, answer: "subsides" },
            { id: 2, answer: "pledged" },
            { id: 3, answer: "collaborate" },
          ],
          wordBank: ["subsides", "pledged", "collaborate", "grows", "refused", "compete"],
        },
        wordOrder: {
          sentences: [
            { scrambled: ["worked", "teams", "Emergency", "tirelessly", "rescue", "to", "people"], correct: "Emergency teams worked tirelessly to rescue people" },
            { scrambled: ["has", "government", "The", "support", "substantial", "pledged"], correct: "The government has pledged substantial support" },
          ],
        },
        trueFalse: {
          statements: [
            { text: "The immediate crisis is still ongoing.", answer: false, explanation: "No, the immediate crisis is subsiding." },
            { text: "Multiple groups are working together on recovery.", answer: true, explanation: "Yes, residents, volunteers, and construction teams are collaborating." },
          ],
        },
        discussion: [
          "What role should governments play in disaster recovery?",
          "How can communities prepare for natural disasters?",
          "What are the economic impacts of major earthquakes?",
        ],
      },
      C1: {
        comprehension: [
          { id: "1", question: "What is emphasized in the recovery approach?", options: [{ id: "a", text: "Speed of reconstruction" }, { id: "b", text: "Building resilient infrastructure" }, { id: "c", text: "Cost reduction" }, { id: "d", text: "International cooperation" }], correctAnswer: "b", explanation: "The government emphasizes building more resilient infrastructure to withstand future seismic events." },
          { id: "2", question: "How is the recovery effort characterized?", options: [{ id: "a", text: "Limited and temporary" }, { id: "b", text: "Comprehensive and long-term" }, { id: "c", text: "Chaotic and disorganized" }, { id: "d", text: "Minimal and inadequate" }], correctAnswer: "b", explanation: "It is described as comprehensive long-term recovery efforts." },
        ],
        vocabularyMatching: {
          pairs: [
            { word: "comprehensive", definition: "Complete and thorough in scope" },
            { word: "devastated", definition: "Severely damaged or destroyed" },
            { word: "resilient", definition: "Able to withstand or recover from difficulties" },
            { word: "seismic", definition: "Related to earthquakes" },
            { word: "infrastructure", definition: "Fundamental systems and facilities" },
          ],
        },
        gapFill: {
          text: "The government emphasizes building more _____ infrastructure to withstand future _____ events. Recovery efforts are _____ and long-term.",
          blanks: [
            { id: 1, answer: "resilient" },
            { id: 2, answer: "seismic" },
            { id: 3, answer: "comprehensive" },
          ],
          wordBank: ["resilient", "seismic", "comprehensive", "weak", "volcanic", "limited"],
        },
        wordOrder: {
          sentences: [
            { scrambled: ["has", "government", "The", "support", "substantial", "pledged", "financial"], correct: "The government has pledged substantial financial support" },
            { scrambled: ["infrastructure", "resilient", "more", "Building", "emphasized", "is"], correct: "Building more resilient infrastructure is emphasized" },
          ],
        },
        trueFalse: {
          statements: [
            { text: "The recovery focuses solely on immediate needs.", answer: false, explanation: "No, it is comprehensive and includes long-term planning for resilient infrastructure." },
            { text: "Future disaster preparedness is part of the recovery strategy.", answer: true, explanation: "Yes, there is emphasis on building infrastructure to withstand future seismic events." },
          ],
        },
        discussion: [
          "How can infrastructure be designed to be more resilient to earthquakes?",
          "What are the ethical considerations in disaster recovery funding?",
          "How does Japan's disaster preparedness compare to other earthquake-prone nations?",
        ],
      },
    },
    vocabulary: [
      { word: "earthquake", definition: "When the ground shakes strongly", level: "A1" },
      { word: "building", definition: "A structure like a house or office", level: "A1" },
      { word: "help", definition: "To do something useful for someone", level: "A1" },
      { word: "together", definition: "With other people", level: "A1" },
      { word: "street", definition: "A road in a town or city", level: "A1" },
      { word: "struck", definition: "Hit suddenly and with force", level: "A2" },
      { word: "damaged", definition: "Broken or harmed", level: "A2" },
      { word: "emergency", definition: "A serious, unexpected situation", level: "A2" },
      { word: "volunteers", definition: "People who help without payment", level: "A2" },
      { word: "debris", definition: "Broken pieces of buildings or objects", level: "A2" },
      { word: "infrastructure", definition: "Basic systems like roads and electricity", level: "B1" },
      { word: "collaborate", definition: "Work together on a project", level: "B1" },
      { word: "normalcy", definition: "The state of being normal", level: "B1" },
      { word: "affected", definition: "Influenced or changed by something", level: "B1" },
      { word: "significant", definition: "Large or important enough to notice", level: "B1" },
      { word: "tirelessly", definition: "Working without rest or fatigue", level: "B2" },
      { word: "subsides", definition: "Becomes less intense or severe", level: "B2" },
      { word: "extensively", definition: "In a large or comprehensive way", level: "B2" },
      { word: "pledged", definition: "Made a formal promise", level: "B2" },
      { word: "reconstruction", definition: "The process of building again", level: "B2" },
      { word: "comprehensive", definition: "Complete and thorough in scope", level: "C1" },
      { word: "devastated", definition: "Severely damaged or destroyed", level: "C1" },
      { word: "resilient", definition: "Able to withstand or recover from difficulties", level: "C1" },
      { word: "seismic", definition: "Related to earthquakes", level: "C1" },
      { word: "emphasizing", definition: "Giving special importance or attention to", level: "C1" },
    ],
    wordCounts: { A1: 38, A2: 58, B1: 94, B2: 117, C1: 135 },
    readTimes: { A1: 1, A2: 1, B1: 2, B2: 2, C1: 3 },
    publishedAt: new Date("2026-01-08T05:00:00Z"),
  },
];

async function seed() {
  console.log("🌱 Seeding database with initial articles...\n");

  for (const article of SEED_ARTICLES) {
    try {
      // Check if already exists
      const existing = await db.article.findUnique({
        where: { slug: article.slug },
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${article.title} (already exists)`);
        continue;
      }

      // Create article
      await db.article.create({
        data: {
          ...article,
          publishedAt: article.publishedAt,
        },
      });

      console.log(`✅ Created: ${article.title}`);
    } catch (error) {
      console.error(`❌ Failed to seed ${article.title}:`, error);
    }
  }

  console.log("\n🎉 Seeding complete!");
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
