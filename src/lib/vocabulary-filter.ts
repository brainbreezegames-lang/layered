/**
 * Smart vocabulary filter that removes common/basic words
 * Works automatically for any content without hardcoding
 */

import { Level } from "@/types";

// Flexible vocabulary type that accepts string levels from API
interface VocabInput {
  word: string;
  definition: string;
  level: string;
}

// Top 2000 most common English words (should NEVER be highlighted for intermediate+ learners)
// Source: Based on frequency lists from Oxford, Cambridge, and GSL
const COMMON_WORDS = new Set([
  // Function words
  "the", "a", "an", "and", "or", "but", "if", "then", "so", "as", "at", "by", "for", "in", "of", "on", "to", "with", "from",
  // Pronouns
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "its", "our", "their",
  "this", "that", "these", "those", "who", "what", "which", "where", "when", "why", "how",
  // Common verbs
  "be", "is", "am", "are", "was", "were", "been", "being", "have", "has", "had", "having", "do", "does", "did", "done", "doing",
  "go", "goes", "went", "gone", "going", "come", "comes", "came", "coming", "get", "gets", "got", "getting",
  "make", "makes", "made", "making", "take", "takes", "took", "taken", "taking", "see", "sees", "saw", "seen", "seeing",
  "know", "knows", "knew", "known", "knowing", "think", "thinks", "thought", "thinking", "want", "wants", "wanted", "wanting",
  "give", "gives", "gave", "given", "giving", "use", "uses", "used", "using", "find", "finds", "found", "finding",
  "tell", "tells", "told", "telling", "ask", "asks", "asked", "asking", "work", "works", "worked", "working",
  "seem", "seems", "seemed", "seeming", "feel", "feels", "felt", "feeling", "try", "tries", "tried", "trying",
  "leave", "leaves", "left", "leaving", "call", "calls", "called", "calling", "keep", "keeps", "kept", "keeping",
  "let", "lets", "letting", "begin", "begins", "began", "begun", "beginning", "put", "puts", "putting",
  "show", "shows", "showed", "shown", "showing", "hear", "hears", "heard", "hearing", "play", "plays", "played", "playing",
  "run", "runs", "ran", "running", "move", "moves", "moved", "moving", "live", "lives", "lived", "living",
  "believe", "believes", "believed", "believing", "hold", "holds", "held", "holding", "bring", "brings", "brought", "bringing",
  "happen", "happens", "happened", "happening", "write", "writes", "wrote", "written", "writing",
  "sit", "sits", "sat", "sitting", "stand", "stands", "stood", "standing", "lose", "loses", "lost", "losing",
  "pay", "pays", "paid", "paying", "meet", "meets", "met", "meeting", "include", "includes", "included", "including",
  "continue", "continues", "continued", "continuing", "set", "sets", "setting", "learn", "learns", "learned", "learning",
  "change", "changes", "changed", "changing", "lead", "leads", "led", "leading", "understand", "understands", "understood",
  "watch", "watches", "watched", "watching", "follow", "follows", "followed", "following", "stop", "stops", "stopped", "stopping",
  "create", "creates", "created", "creating", "speak", "speaks", "spoke", "spoken", "speaking", "read", "reads", "reading",
  "spend", "spends", "spent", "spending", "grow", "grows", "grew", "grown", "growing", "open", "opens", "opened", "opening",
  "walk", "walks", "walked", "walking", "win", "wins", "won", "winning", "offer", "offers", "offered", "offering",
  "remember", "remembers", "remembered", "remembering", "love", "loves", "loved", "loving", "consider", "considers", "considered",
  "appear", "appears", "appeared", "appearing", "buy", "buys", "bought", "buying", "wait", "waits", "waited", "waiting",
  "serve", "serves", "served", "serving", "die", "dies", "died", "dying", "send", "sends", "sent", "sending",
  "expect", "expects", "expected", "expecting", "build", "builds", "built", "building", "stay", "stays", "stayed", "staying",
  "fall", "falls", "fell", "fallen", "falling", "cut", "cuts", "cutting", "reach", "reaches", "reached", "reaching",
  "kill", "kills", "killed", "killing", "remain", "remains", "remained", "remaining", "suggest", "suggests", "suggested",
  "raise", "raises", "raised", "raising", "pass", "passes", "passed", "passing", "sell", "sells", "sold", "selling",
  "require", "requires", "required", "requiring", "report", "reports", "reported", "reporting", "decide", "decides", "decided",
  "pull", "pulls", "pulled", "pulling", "break", "breaks", "broke", "broken", "breaking",
  // Common nouns - people
  "people", "person", "man", "men", "woman", "women", "child", "children", "boy", "girl", "baby", "family", "friend",
  "mother", "father", "parent", "son", "daughter", "brother", "sister", "husband", "wife", "kid", "guy",
  // Common nouns - time
  "time", "year", "day", "week", "month", "hour", "minute", "second", "moment", "today", "tomorrow", "yesterday",
  "morning", "afternoon", "evening", "night", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december",
  "spring", "summer", "fall", "autumn", "winter", "christmas", "easter", "birthday", "holiday",
  // Common nouns - places
  "place", "world", "country", "city", "town", "state", "home", "house", "room", "door", "window", "floor", "wall",
  "street", "road", "way", "school", "office", "store", "shop", "church", "hospital", "hotel", "restaurant", "park",
  "america", "american", "english", "british", "european", "african", "asian",
  // Common nouns - things
  "thing", "something", "anything", "nothing", "everything", "way", "part", "number", "name", "word", "line", "side",
  "hand", "head", "face", "eye", "eyes", "body", "life", "water", "food", "money", "car", "book", "paper", "phone",
  "table", "chair", "bed", "door", "window", "picture", "story", "question", "answer", "idea", "fact", "case",
  "point", "group", "problem", "issue", "reason", "result", "end", "beginning", "example", "kind", "type", "sort",
  // Common nouns - nature/animals
  "sun", "moon", "star", "sky", "air", "wind", "rain", "snow", "fire", "tree", "flower", "grass", "garden",
  "animal", "dog", "cat", "bird", "fish", "horse", "cow",
  // Common adjectives
  "good", "bad", "great", "little", "small", "big", "large", "long", "short", "high", "low", "old", "young", "new",
  "first", "last", "next", "other", "same", "different", "few", "many", "much", "more", "most", "less", "least",
  "own", "only", "just", "right", "left", "early", "late", "hard", "easy", "fast", "slow", "hot", "cold", "warm", "cool",
  "black", "white", "red", "blue", "green", "yellow", "brown", "pink", "orange", "purple", "gray", "grey",
  "happy", "sad", "angry", "afraid", "sure", "sorry", "ready", "able", "possible", "important", "special", "free",
  "open", "close", "full", "empty", "true", "false", "real", "beautiful", "nice", "pretty", "fine", "poor", "rich",
  "dead", "alive", "sick", "healthy", "strong", "weak", "dark", "light", "bright", "clear", "clean", "dirty",
  "quiet", "loud", "safe", "dangerous", "simple", "whole", "single", "double", "public", "private", "general", "local",
  // Common adverbs
  "not", "very", "really", "too", "also", "just", "only", "still", "even", "already", "yet", "never", "always",
  "often", "sometimes", "usually", "here", "there", "now", "then", "today", "again", "back", "away", "up", "down",
  "out", "in", "off", "on", "over", "well", "much", "more", "most", "ever", "almost", "enough", "quite", "rather",
  // Numbers
  "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen",
  "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "thirty", "forty", "fifty",
  "sixty", "seventy", "eighty", "ninety", "hundred", "thousand", "million", "billion", "half", "quarter",
  "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth",
  // Common words that AI often wrongly tags as vocabulary
  "dollar", "dollars", "cent", "cents", "price", "cost", "pay", "paid",
  "gift", "present", "letter", "card", "box", "bag", "bottle", "glass", "cup", "plate",
  "look", "looked", "looking", "watch", "watched", "watching", "listen", "listened", "listening",
  "eat", "ate", "eaten", "eating", "drink", "drank", "drunk", "drinking", "sleep", "slept", "sleeping",
  "talk", "talked", "talking", "laugh", "laughed", "laughing", "smile", "smiled", "smiling", "cry", "cried", "crying",
  "wear", "wore", "worn", "wearing", "carry", "carried", "carrying", "turn", "turned", "turning",
  "start", "started", "starting", "finish", "finished", "finishing", "help", "helped", "helping",
  "need", "needed", "needing", "want", "wanted", "wanting", "like", "liked", "liking",
  "hat", "coat", "dress", "shirt", "shoe", "shoes", "clothes", "hair",
  "wall", "floor", "ceiling", "roof", "corner", "step", "stairs",
  "inside", "outside", "front", "behind", "between", "under", "above", "below", "beside", "near", "far",
]);

// Words that require at least B1 level (intermediate vocabulary)
const B1_MINIMUM_WORDS = new Set([
  "afford", "anxious", "appointment", "arrangement", "assist", "atmosphere", "attract", "avoid",
  "behavior", "benefit", "blame", "borrow", "budget", "calculate", "cancel", "capable", "celebrate",
  "challenge", "character", "circumstances", "citizen", "claim", "collect", "combine", "comment",
  "communicate", "community", "compare", "compete", "complain", "complete", "concentrate", "concern",
  "conclude", "condition", "confirm", "connect", "consequence", "construct", "consumer", "contact",
  "contain", "content", "contrast", "contribute", "control", "convenient", "conversation", "convince",
  "cooperate", "cope", "correct", "criticism", "culture", "curious", "current", "customer",
  "damage", "debate", "deceive", "declare", "decrease", "defeat", "defend", "define", "delay",
  "deliver", "demand", "demonstrate", "deny", "depend", "describe", "deserve", "desire", "destroy",
  "detail", "detect", "determine", "develop", "device", "disappear", "disappoint", "disaster",
  "discipline", "discover", "discuss", "disease", "display", "distance", "distribute", "disturb",
  "divide", "document", "domestic", "dominate", "doubt", "dramatic", "economic", "education",
  "effective", "efficient", "effort", "elderly", "election", "element", "eliminate", "embarrass",
  "emerge", "emotion", "emphasize", "employ", "enable", "encourage", "enemy", "energy", "engage",
  "engine", "enormous", "ensure", "enterprise", "entire", "environment", "equal", "equipment",
  "escape", "essential", "establish", "estimate", "evaluate", "event", "eventually", "evidence",
  "exact", "examine", "exceed", "excellent", "except", "exchange", "excite", "exclude", "excuse",
  "exercise", "exist", "expand", "experiment", "expert", "explain", "explore", "export", "expose",
  "express", "extend", "extent", "external", "extra", "extraordinary", "extreme", "facility",
  "factor", "fail", "fair", "familiar", "fashion", "fault", "favor", "feature", "federal", "fee",
]);

// Words that require at least B2 level (upper intermediate)
const B2_MINIMUM_WORDS = new Set([
  "abolish", "absorb", "abstract", "abundant", "accelerate", "accommodate", "accomplish", "accumulate",
  "accurate", "acknowledge", "acquire", "adapt", "adequate", "administer", "adolescent", "advocate",
  "aesthetic", "affiliate", "aggregate", "allocate", "alter", "alternative", "amateur", "ambiguous",
  "amend", "analogy", "anticipate", "apparatus", "apparent", "appreciate", "appropriate", "arbitrary",
  "articulate", "artificial", "ascertain", "aspire", "assemble", "assess", "asset", "assign", "assume",
  "assure", "attain", "attribute", "authentic", "authorize", "autonomous", "available", "behalf",
  "bias", "bizarre", "bond", "boost", "breach", "bulk", "bureaucracy", "capable", "capacity",
  "cease", "chronic", "circumstance", "clarify", "classic", "clause", "clinical", "coherent",
  "coincide", "collaborate", "collapse", "colleague", "commence", "commodity", "compatible",
  "compensate", "compile", "complement", "complex", "comply", "component", "comprehensive",
  "comprise", "compromise", "conceive", "concentrate", "concept", "concrete", "concurrent",
  "condemn", "conduct", "confer", "confine", "confirm", "conflict", "conform", "confront",
  "consensus", "consent", "conservative", "considerable", "consist", "consistent", "consolidate",
  "constitute", "constrain", "consultation", "contemporary", "context", "contradict", "controversy",
  "convention", "convert", "convey", "cooperate", "coordinate", "corporate", "correspond", "corrupt",
  "credible", "criterion", "crucial", "cumulative", "currency", "curriculum", "decline", "dedicate",
]);

// Words that require C1 level (advanced)
const C1_MINIMUM_WORDS = new Set([
  "abate", "aberration", "abhor", "abridge", "abrogate", "absolve", "abstain", "accentuate",
  "accolade", "acquiesce", "acrimony", "adamant", "adept", "admonish", "advent", "adversary",
  "affable", "affluent", "aggravate", "alacrity", "albeit", "allegation", "alleviate", "allot",
  "allude", "altruistic", "amalgamate", "ambivalent", "ameliorate", "amenable", "amicable",
  "anachronism", "analogous", "anomaly", "antagonist", "antithesis", "apathy", "apex", "appease",
  "apprehensive", "arbitrary", "archaic", "ardent", "arduous", "articulate", "ascertain", "ascetic",
  "aspersion", "assiduous", "astute", "atrophy", "audacious", "augment", "auspicious", "austere",
  "avarice", "aversion", "banal", "beguile", "belabor", "belligerent", "benevolent", "bequeath",
  "bewilder", "bolster", "bombastic", "boon", "bourgeois", "brevity", "buttress", "cacophony",
  "cajole", "callous", "candid", "candor", "capitulate", "capricious", "castigate", "catalyst",
  "caustic", "censure", "cerebral", "chagrin", "charlatan", "chicanery", "circumscribe", "circumspect",
  "circumvent", "clandestine", "clemency", "coalesce", "coerce", "cogent", "cognizant", "colloquial",
  "commensurate", "compelling", "complacent", "compliant", "complicit", "concede", "conciliatory",
  "concise", "condemn", "condescend", "condone", "conducive", "conflagration", "confluence",
  "conjecture", "connoisseur", "conscientious", "consecrate", "consequential", "construe",
  "consummate", "contentious", "contiguous", "contingent", "contrite", "conundrum", "converge",
  "copious", "corroborate", "cosmopolitan", "countenance", "covert", "credulous", "culminate",
  "culpable", "cursory", "cynical", "dearth", "debacle", "debilitate", "decadent", "decorum",
  "deference", "deft", "defunct", "delegate", "deleterious", "delineate", "demeanor", "demise",
  "denounce", "deplore", "deprecate", "deride", "derivative", "despondent", "destitute", "deter",
  "detrimental", "deviate", "devoid", "diatribe", "dichotomy", "didactic", "diffident", "digress",
  "dilapidated", "diligent", "diminish", "discern", "disclose", "discordant", "discourse",
  "discrepancy", "discretion", "discriminate", "disdain", "disinterested", "disparage", "disparate",
  "disparity", "dispassionate", "dispel", "disseminate", "dissent", "dissolution", "diverge",
  "divulge", "dogmatic", "dormant", "dubious", "duplicity", "ebullient", "eccentric", "eclectic",
  "edify", "efface", "efficacy", "effusive", "egregious", "elated", "elicit", "eloquent", "elucidate",
  "elusive", "emanate", "embellish", "eminent", "empathy", "empirical", "emulate", "endemic",
  "enervate", "engender", "enigma", "enmity", "enumerate", "ephemeral", "epitome", "equanimity",
  "equivocal", "eradicate", "erratic", "erudite", "eschew", "esoteric", "ethereal", "euphemism",
  "exacerbate", "exalt", "exasperate", "excerpt", "exemplary", "exemplify", "exonerate", "expedient",
  "expedite", "explicit", "exponent", "expound", "extraneous", "extrapolate", "extricate", "exuberant",
  "facetious", "facilitate", "fallacious", "fallacy", "fastidious", "feasible", "fervent", "fickle",
  "flagrant", "fledgling", "florid", "flourish", "fluctuate", "foment", "forestall", "formidable",
  "fortuitous", "foster", "fractious", "frivolous", "frugal", "furtive", "futile", "galvanize",
  "garner", "garrulous", "germane", "glean", "gratuitous", "gregarious", "guile", "hackneyed",
  "hamper", "hapless", "harangue", "harbinger", "haughty", "hegemony", "heinous", "heresy",
  "hiatus", "hierarchy", "hinder", "homogeneous", "hubris", "hypothetical", "iconoclast", "idiosyncrasy",
  "ignominious", "illicit", "imminent", "immutable", "impair", "impartial", "impasse", "impeccable",
  "impecunious", "impede", "impending", "imperative", "imperious", "impertinent", "impervious",
  "impetuous", "implicit", "implore", "impoverish", "impromptu", "impudent", "impugn", "inadvertent",
  "inane", "incendiary", "incessant", "incipient", "incisive", "incite", "incongruous", "inconsequential",
  "incontrovertible", "incumbent", "indifferent", "indigenous", "indigent", "indignant", "indolent",
  "induce", "ineffable", "inept", "inexorable", "infamous", "inference", "ingenious", "ingenuous",
  "inherent", "inhibit", "innate", "innocuous", "innuendo", "insatiable", "insidious", "insinuate",
  "insipid", "insolent", "instigate", "insufferable", "insurgent", "integral", "intrepid", "intricate",
  "intrinsic", "introspective", "inundate", "inure", "invalidate", "invective", "invoke", "irascible",
  "irreverent", "itinerant", "jeopardize", "judicious", "juxtapose", "kindle", "labyrinth", "laconic",
  "lampoon", "languish", "largesse", "latent", "laudable", "laud", "lavish", "lethargic", "levity",
  "liaison", "litigious", "lofty", "lucid", "ludicrous", "luminous", "magnanimous", "malevolent",
  "malleable", "mandate", "manifest", "marginal", "mar", "meander", "meticulous", "milieu", "mitigate",
  "mollify", "momentous", "monotonous", "morose", "mundane", "munificent", "myopic", "myriad",
  "nascent", "negate", "negligent", "neophyte", "nonchalant", "notoriety", "novel", "noxious",
  "nuance", "nullify", "obdurate", "obfuscate", "oblique", "oblivious", "obscure", "obsequious",
  "obsolete", "obstinate", "obviate", "occlude", "odious", "officious", "ominous", "onerous",
  "opaque", "opportune", "opprobrium", "optimal", "opulent", "orate", "orthodox", "ostentatious",
  "ostracize", "overt", "pacify", "painstaking", "palatable", "palpable", "panacea", "paradigm",
  "paradox", "paragon", "paramount", "pariah", "parody", "parsimonious", "partisan", "pastoral",
  "patent", "pathological", "patronize", "paucity", "pedantic", "pejorative", "penchant", "pensive",
  "penury", "perennial", "perfidious", "perfunctory", "peripheral", "permeate", "pernicious",
  "perpetuate", "perquisite", "persevere", "perspicacious", "perturb", "peruse", "pervasive",
  "petulant", "philanthropic", "phlegmatic", "pinnacle", "pious", "pivotal", "placate", "placid",
  "plaintive", "platitude", "plausible", "plight", "plethora", "poignant", "polarize", "ponderous",
  "portend", "postulate", "potent", "pragmatic", "preamble", "precarious", "precedent", "precipitate",
  "preclude", "precocious", "precursor", "predilection", "predominant", "preeminent", "preempt",
  "premise", "preponderance", "prerogative", "presage", "prescient", "pretentious", "prevalent",
  "pristine", "privation", "proclivity", "procrastinate", "prodigal", "prodigious", "profane",
  "proficient", "profligate", "profound", "profuse", "proliferate", "prolific", "prologue",
  "prominent", "promulgate", "propensity", "prophetic", "propitious", "proponent", "propriety",
  "prosaic", "proscribe", "protagonist", "protract", "provident", "provincial", "provisional",
  "provocative", "prowess", "proximity", "prudent", "pugnacious", "punctilious", "pungent",
  "punitive", "purist", "quagmire", "quaint", "qualm", "quandary", "quarantine", "quell",
  "querulous", "quintessential", "quixotic", "ramification", "rampant", "rancor", "ratify",
  "raucous", "rebuke", "rebut", "recalcitrant", "recant", "recapitulate", "reciprocate",
  "reclusive", "reconcile", "recondite", "rectify", "redress", "redundant", "refute", "regal",
  "relegate", "relentless", "relinquish", "remorse", "renounce", "replete", "reprehensible",
  "reprieve", "reprimand", "reproach", "repudiate", "repugnant", "requisite", "rescind",
  "resilient", "resolute", "respite", "restitution", "restive", "resurgent", "reticent",
  "retribution", "revere", "rhetoric", "rigorous", "robust", "rudimentary", "ruminate",
  "sagacious", "salient", "sanction", "sanguine", "sardonic", "saturate", "savvy", "scant",
  "scathing", "schism", "scrupulous", "scrutinize", "secular", "sedentary", "seditious",
  "seminal", "sensational", "sentimental", "sequester", "serendipity", "serene", "servile",
  "sever", "shrewd", "skeptical", "slander", "sloth", "sobriety", "solace", "solicitous",
  "solvent", "soporific", "sordid", "spawn", "specious", "sporadic", "spurious", "spurn",
  "squalid", "stagnant", "staid", "stark", "static", "staunch", "steadfast", "stigma",
  "stipulate", "stoic", "stratagem", "strident", "stringent", "stupefy", "stymie", "subjugate",
  "sublime", "subordinate", "subpoena", "subsequent", "subside", "substantiate", "subterfuge",
  "subtle", "subvert", "succinct", "succumb", "suffice", "superficial", "superfluous",
  "superlative", "supplant", "supple", "suppress", "surfeit", "surmise", "surmount", "surpass",
  "surreptitious", "surrogate", "susceptible", "sustain", "sycophant", "synthesis", "tacit",
  "tactful", "taint", "tangential", "tangible", "tantamount", "tedious", "temerity", "temper",
  "tempestuous", "tenable", "tenacious", "tentative", "tenuous", "terse", "therapeutic",
  "thwart", "tirade", "torpid", "tortuous", "tractable", "tranquil", "transcend", "transient",
  "transparent", "travesty", "treatise", "trepidation", "trite", "trivial", "truculent",
  "tumultuous", "turbulent", "turmoil", "ubiquitous", "ulterior", "unanimous", "unassuming",
  "uncanny", "undermine", "underscore", "unequivocal", "unfettered", "uniform", "unilateral",
  "unprecedented", "unscrupulous", "unwitting", "upbraid", "usurp", "utilitarian", "utopia",
  "vacillate", "vacuous", "validate", "vanquish", "vapid", "vehement", "venerate", "veracious",
  "verbose", "verdant", "verify", "vernacular", "versatile", "vestige", "vex", "viable",
  "vicarious", "vigilant", "vilify", "vindicate", "vindictive", "virtuoso", "virulent",
  "visceral", "vitriolic", "vivacious", "vociferous", "volatile", "volition", "voracious",
  "wane", "wary", "watershed", "whimsical", "wield", "wistful", "zealous", "zenith",
]);

/**
 * Filters vocabulary to only include words that are genuinely challenging
 * for the given user level
 */
export function filterVocabularyForLevel<T extends VocabInput>(
  vocabulary: T[],
  userLevel: Level | string
): T[] {
  const levels = ["A1", "A2", "B1", "B2", "C1"];
  const userLevelIndex = levels.indexOf(userLevel);

  return vocabulary.filter((item) => {
    const word = item.word.toLowerCase().trim();
    const wordLevel = item.level;
    const wordLevelIndex = levels.indexOf(wordLevel);

    // Rule 1: Never show words below the user's level
    if (wordLevelIndex < userLevelIndex) {
      return false;
    }

    // Rule 2: Never show extremely common words regardless of tagged level
    if (COMMON_WORDS.has(word)) {
      return false;
    }

    // Rule 3: For B1+ users, also check if word should actually be at that level
    if (userLevelIndex >= 2) {
      // B1 or higher
      // If word is tagged as A1/A2 but user is B1+, skip it
      if (wordLevelIndex < 2) {
        return false;
      }
    }

    // Rule 4: For B2+ users, be even more strict
    if (userLevelIndex >= 3) {
      // B2 or higher
      if (B1_MINIMUM_WORDS.has(word) && wordLevelIndex < 3) {
        return false;
      }
    }

    // Rule 5: For C1 users, only show genuinely advanced words
    if (userLevelIndex >= 4) {
      // C1
      // Check if it's actually a C1-worthy word
      if (!C1_MINIMUM_WORDS.has(word) && !B2_MINIMUM_WORDS.has(word)) {
        // Word isn't in our advanced word lists - be suspicious
        // Allow it only if it's explicitly tagged as C1
        if (wordLevelIndex < 4) {
          return false;
        }
      }
    }

    return true;
  });
}

/**
 * Determines the minimum CEFR level a word should be taught at
 */
export function getWordMinimumLevel(word: string): string {
  const normalizedWord = word.toLowerCase().trim();

  if (COMMON_WORDS.has(normalizedWord)) {
    return "SKIP"; // Should never be vocabulary
  }

  if (C1_MINIMUM_WORDS.has(normalizedWord)) {
    return "C1";
  }

  if (B2_MINIMUM_WORDS.has(normalizedWord)) {
    return "B2";
  }

  if (B1_MINIMUM_WORDS.has(normalizedWord)) {
    return "B1";
  }

  // Default: A2 (basic vocabulary that isn't ultra-common)
  return "A2";
}
