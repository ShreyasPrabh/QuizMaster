import { createTopic } from '../helpers'

export const ENGLISH_TOPICS = {
  grammar: createTopic('grammar', 'Grammar & Syntax Rules', '✍️', 'English', 'Parts of speech, subject-verb agreement, tenses, active/passive voice, and clauses.', [
    { title: 'Parts of Speech & Functions', description: 'Nouns, pronouns, verbs, adjectives, adverbs, and prepositions.' },
    { title: 'Subject-Verb Agreement & Tenses', description: 'Singular/plural agreement, compound subjects, and perfect tenses.' },
    { title: 'Direct/Indirect Speech & Voices', description: 'Reported speech rules, tense shifts, and active to passive voice.' },
    { title: 'Clauses, Modifiers & Punctuation', description: 'Independent/dependent clauses, dangling modifiers, and semicolons.' },
  ]),

  vocabulary: createTopic('vocabulary', 'Vocabulary & Synonyms', '📚', 'English', 'Etymology, root words, prefixes, suffixes, contextual synonyms, and antonyms.', [
    { title: 'Root Words & Etymology', description: 'Latin and Greek roots, common prefixes, and suffixes.' },
    { title: 'Synonyms & Antonyms', description: 'Contextual synonyms, precise shades of meaning, and antonyms.' },
    { title: 'Homophones & Confusing Words', description: 'Affect vs effect, complement vs compliment, and principal.' },
    { title: 'Advanced Academic Vocabulary', description: 'Formal GRE/academic vocabulary in sentence construction.' },
  ]),

  idioms: createTopic('idioms', 'Idioms, Proverbs & Phrases', '🎭', 'English', 'Common figurative expressions, idioms, phrasal verbs, and traditional proverbs.', [
    { title: 'Popular Idioms & Meanings', description: 'Figurative expressions, origin contexts, and standard usage.' },
    { title: 'Phrasal Verbs & Prepositions', description: 'Bring up, call off, carry out, give in, and look into.' },
    { title: 'Proverbs & Timeless Sayings', description: 'Traditional wisdom, cross-cultural proverbs, and metaphors.' },
    { title: 'Collocations & Fixed Expressions', description: 'Natural word pairings, verb-noun, and adjective-noun pairings.' },
  ]),

  reading: createTopic('reading', 'Reading Comprehension & Reasoning', '📝', 'English', 'Paragraph inference, tone analysis, main idea deduction, and error spotting.', [
    { title: 'Main Idea & Author’s Purpose', description: 'Identifying central thesis statements and intent in passages.' },
    { title: 'Logical Inferences & Deductions', description: 'Drawing valid logical conclusions supported by evidence.' },
    { title: 'Tone, Mood & Rhetorical Devices', description: 'Analyzing subjective, objective, pragmatic tones, and metaphors.' },
    { title: 'Sentence Correction & Error Spotting', description: 'Detecting parallelism errors, misplaced modifiers, and phrasing.' },
  ]),

  tenses: createTopic('tenses', 'Tenses & Conditionals', '⏳', 'English', 'Past, present, future tenses, perfect aspects, and 0/1/2/3 conditionals.', [
    { title: 'Present & Past Simple vs Continuous', description: 'Action states, habitual actions, and time markers.' },
    { title: 'Perfect & Perfect Continuous Tenses', description: 'Present perfect (have/has), past perfect (had), and continuous forms.' },
    { title: 'Future Tense Constructions', description: 'will, going to, future continuous, and future perfect.' },
    { title: 'Conditional Sentences (Type 0, 1, 2, 3 & Mixed)', description: 'Real vs hypothetical conditionals, if-clauses, and inverted conditionals.' },
  ]),

  voice: createTopic('voice', 'Active & Passive Voice', '🗣️', 'English', 'Transitive verb transformations, passive agents, and imperative conversions.', [
    { title: 'Basic Active to Passive Transformations', description: 'Object-to-subject promotion, auxiliary be + past participle.' },
    { title: 'Passive Voice Across All Tenses', description: 'Continuous and perfect passive sentence constructions.' },
    { title: 'Passive with Modals & Two Objects', description: 'can/must/should be done, direct vs indirect object promotion.' },
    { title: 'Imperatives & Impersonal Passive', description: 'Let it be done, It is believed that..., and formal passive style.' },
  ]),

  speech: createTopic('speech', 'Direct & Indirect Speech', '💬', 'English', 'Reported speech, pronoun shifting, backshifting of tenses, and questions.', [
    { title: 'Reported Statements & Backshifting Rules', description: 'Present to past tense shift, time/place adverb adjustments.' },
    { title: 'Reporting Yes/No & Wh- Questions', description: 'asked if/whether, word order normalization in indirect questions.' },
    { title: 'Reported Commands, Requests & Suggestions', description: 'told/ordered to, warned not to, and suggested that...' },
    { title: 'Reporting Modals & Universal Truths', description: 'Exceptions where tenses do not backshift (universal facts).' },
  ]),

  essaywriting: createTopic('essaywriting', 'Essay Writing & Argumentation', '🖋️', 'English', 'Thesis statements, transitions, paragraph structuring, and essay styles.', [
    { title: 'Thesis Statements & Introductions', description: 'Hook, background context, and clear arguable thesis.' },
    { title: 'Body Paragraph Structure (PEEL Method)', description: 'Point, Evidence, Explanation, and Link back to thesis.' },
    { title: 'Transitions & Logical Cohesion', description: 'Furthermore, consequently, on the contrary, and transitional phrases.' },
    { title: 'Conclusions & Persuasive Techniques', description: 'Restating thesis, synthesis of main points, and call to action.' },
  ]),

  etymology: createTopic('etymology', 'Etymology & Word Origins', '🔍', 'English', 'Latin roots, Greek affixes, loanwords from French/German, and portmanteaus.', [
    { title: 'Greek Roots (Bio, Chron, Tele, Phil)', description: 'Etymological derivations and scientific compound terms.' },
    { title: 'Latin Roots (Bene, Mal, Dict, Spect)', description: 'Prefixes, stems, and Latin-based English vocabulary.' },
    { title: 'Loanwords & Borrowed Expressions', description: 'De facto, rendezvous, zeitgeist, and foreign adoptions.' },
    { title: 'Portmanteaus, Acronyms & Neologisms', description: 'Blended words, backronyms, and modern linguistic evolutions.' },
  ]),

  errorspotting: createTopic('errorspotting', 'Common Grammatical Errors', '❌', 'English', 'Dangling participles, faulty parallelism, pronoun ambiguity, and double negatives.', [
    { title: 'Subject-Verb & Pronoun Disagreements', description: 'Each of the students has..., neither/nor agreement rules.' },
    { title: 'Dangling & Misplaced Modifiers', description: 'Walking into the room, the TV was on (correction techniques).' },
    { title: 'Faulty Parallelism in Lists & Clauses', description: 'Aligning gerunds, infinitives, and coordinate clauses.' },
    { title: 'Redundancy, Clichés & Double Negatives', description: 'Eliminating repetitive phrasing and grammatical inconsistencies.' },
  ]),
}
