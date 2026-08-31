import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom'
import {
  ChevronRight,
  ChevronDown,
  Layers,
  ArrowRight,
  ArrowLeft,
  Star,
  Zap,
  Trophy,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { TOPIC_MODULES } from '../data/topicModules'

// Helper to compute exact true dynamic counts for any topic
function getTrueTopicCounts(topicId) {
  const topic = TOPIC_MODULES[topicId]
  if (!topic || !topic.modules) return { questions: 0, modules: 0 }

  let qCount = 0
  topic.modules.forEach((m) => {
    qCount += m.difficulties?.easy?.length || 0
    qCount += m.difficulties?.intermediate?.length || 0
    qCount += m.difficulties?.hard?.length || 0
  })

  return { questions: qCount, modules: topic.modules.length }
}

const mainCategoryConfigs = [
  {
    id: 'prog',
    slug: 'programming',
    name: 'Programming',
    icon: '</>',
    color: '#6366F1',
    description: 'Master core syntax, OOP architecture, concurrency, and memory in 10 languages.',
  },
  {
    id: 'math',
    slug: 'mathematics',
    name: 'Mathematics',
    icon: 'π',
    color: '#3B82F6',
    description: 'Equations, calculus, linear algebra, probability, and discrete mathematics.',
  },
  {
    id: 'sci',
    slug: 'science',
    name: 'Science',
    icon: '⚗️',
    color: '#10B981',
    description: 'Mechanics, molecular chemistry, cellular biology, and quantum physics.',
  },
  {
    id: 'cs',
    slug: 'computerscience',
    name: 'Computer Science',
    icon: '💻',
    color: '#06B6D4',
    description: 'Data structures, algorithms, operating systems, networks, and system design.',
  },
  {
    id: 'gk',
    slug: 'generalknowledge',
    name: 'General Knowledge',
    icon: '🌐',
    color: '#8B5CF6',
    description: 'World history, geography, landmark discoveries, economics, and capitals.',
  },
  {
    id: 'eng',
    slug: 'english',
    name: 'English',
    icon: '📖',
    color: '#EC4899',
    description: 'Grammar syntax, advanced vocabulary, idioms, tenses, and reading comprehension.',
  },
]

const subtopicsMap = {
  prog: [
    { name: 'Java', icon: '☕', topicId: 'java' },
    { name: 'Python', icon: '🐍', topicId: 'python' },
    { name: 'C++', icon: '⚙️', topicId: 'cpp' },
    { name: 'JavaScript', icon: '🟨', topicId: 'javascript' },
    { name: 'TypeScript', icon: '🔷', topicId: 'typescript' },
    { name: 'Go (Golang)', icon: '🐹', topicId: 'golang' },
    { name: 'Rust', icon: '🦀', topicId: 'rust' },
    { name: 'Kotlin', icon: '🟣', topicId: 'kotlin' },
    { name: 'SQL & Databases', icon: '🐬', topicId: 'sql' },
    { name: 'C# & .NET', icon: '🎯', topicId: 'csharp' },
  ],
  math: [
    { name: 'Algebra & Equations', icon: '📐', topicId: 'algebra' },
    { name: 'Geometry & Trigonometry', icon: '📏', topicId: 'geometry' },
    { name: 'Calculus & Analysis', icon: '📈', topicId: 'calculus' },
    { name: 'Probability & Statistics', icon: '📊', topicId: 'statistics' },
    { name: 'Linear Algebra & Matrices', icon: '🔢', topicId: 'linearalgebra' },
    { name: 'Number Theory & Primes', icon: '🧩', topicId: 'numbertheory' },
    { name: 'Discrete Mathematics', icon: '🕸️', topicId: 'discrete' },
    { name: 'Differential Equations', icon: '📉', topicId: 'diffeq' },
    { name: 'Financial Mathematics', icon: '💰', topicId: 'financialmath' },
    { name: 'Mathematical Logic & Sets', icon: '💡', topicId: 'logicsets' },
  ],
  sci: [
    { name: 'Physics & Mechanics', icon: '⚛️', topicId: 'physics' },
    { name: 'Chemistry & Molecules', icon: '🧪', topicId: 'chemistry' },
    { name: 'Biology & Genetics', icon: '🧬', topicId: 'biology' },
    { name: 'Thermodynamics & Heat', icon: '⚡', topicId: 'thermodynamics' },
    { name: 'Electromagnetism & Optics', icon: '💡', topicId: 'electromagnetism' },
    { name: 'Organic Chemistry', icon: '🧫', topicId: 'organicchem' },
    { name: 'Astronomy & Astrophysics', icon: '🪐', topicId: 'astronomy' },
    { name: 'Human Anatomy & Physiology', icon: '🫀', topicId: 'anatomy' },
    { name: 'Earth & Environmental Science', icon: '🌋', topicId: 'earthscience' },
    { name: 'Quantum Physics Basics', icon: '🔮', topicId: 'quantum' },
  ],
  cs: [
    { name: 'Data Structures & Algorithms', icon: '🌳', topicId: 'datastructures' },
    { name: 'Operating Systems & Architecture', icon: '🖥️', topicId: 'operatingsystems' },
    { name: 'Computer Networks & Security', icon: '🌐', topicId: 'networks' },
    { name: 'Database Engineering & SQL', icon: '🗄️', topicId: 'databases' },
    { name: 'System Design & Architecture', icon: '🏗️', topicId: 'systemdesign' },
    { name: 'Cloud Computing & DevOps', icon: '☁️', topicId: 'clouddevops' },
    { name: 'Cybersecurity & Ethical Hacking', icon: '🛡️', topicId: 'cybersecurity' },
    { name: 'Artificial Intelligence & ML', icon: '🤖', topicId: 'aiandml' },
    { name: 'Compilers & Automata Theory', icon: '⚙️', topicId: 'compilers' },
    { name: 'Web Architecture & Protocols', icon: '🕸️', topicId: 'webarchitecture' },
  ],
  gk: [
    { name: 'World Geography & Continents', icon: '🌍', topicId: 'geography' },
    { name: 'World History & Civilizations', icon: '🏛️', topicId: 'history' },
    { name: 'Discoveries & Inventions', icon: '🚀', topicId: 'discoveries' },
    { name: 'Capitals & Nations', icon: '📰', topicId: 'capitals' },
    { name: 'International Organizations & Treaties', icon: '🌐', topicId: 'orgs' },
    { name: 'World Art & Cultural Heritage', icon: '🎨', topicId: 'artculture' },
    { name: 'Space Exploration & Missions', icon: '🛸', topicId: 'spaceexpl' },
    { name: 'Global Economics & Trade', icon: '💹', topicId: 'economics' },
    { name: 'Famous Leaders & Nobel Laureates', icon: '🏆', topicId: 'leaders' },
    { name: 'World Literature & Philosophy', icon: '📚', topicId: 'literature' },
  ],
  eng: [
    { name: 'Grammar & Syntax Rules', icon: '✍️', topicId: 'grammar' },
    { name: 'Vocabulary & Synonyms', icon: '📚', topicId: 'vocabulary' },
    { name: 'Idioms, Proverbs & Phrases', icon: '🎭', topicId: 'idioms' },
    { name: 'Reading Comprehension & Reasoning', icon: '📝', topicId: 'reading' },
    { name: 'Tenses & Conditionals', icon: '⏳', topicId: 'tenses' },
    { name: 'Active & Passive Voice', icon: '🗣️', topicId: 'voice' },
    { name: 'Direct & Indirect Speech', icon: '💬', topicId: 'speech' },
    { name: 'Essay Writing & Argumentation', icon: '🖋️', topicId: 'essaywriting' },
    { name: 'Etymology & Word Origins', icon: '🔍', topicId: 'etymology' },
    { name: 'Common Grammatical Errors', icon: '❌', topicId: 'errorspotting' },
  ],
}

function resolveCategory(slug) {
  if (!slug) return null
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, '')

  if (normalized.startsWith('prog')) return 'prog'
  if (normalized.startsWith('math')) return 'math'
  if (normalized.startsWith('sci')) return 'sci'
  if (normalized.startsWith('cs') || normalized.includes('comput')) return 'cs'
  if (normalized.startsWith('gk') || normalized.includes('general')) return 'gk'
  if (normalized.startsWith('eng')) return 'eng'

  // Check if it's a subtopic ID (e.g. 'java' -> 'prog', 'algebra' -> 'math')
  for (const [catId, subs] of Object.entries(subtopicsMap)) {
    if (
      subs.some(
        (s) =>
          s.topicId === normalized ||
          s.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized
      )
    ) {
      return catId
    }
  }

  return null
}

export default function Topics() {
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = (searchParams.get('q') || '').toLowerCase().trim()

  const activeCategory = resolveCategory(categorySlug)
  const [expandedTopicId, setExpandedTopicId] = useState(null)

  // Auto-expand subtopic if matched in URL
  useEffect(() => {
    if (categorySlug) {
      const normalized = categorySlug.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (TOPIC_MODULES[normalized]) {
        setExpandedTopicId(normalized)
      }
    }
  }, [categorySlug])

  const currentCategoryObj = activeCategory
    ? mainCategoryConfigs.find((c) => c.id === activeCategory)
    : null

  const currentSubtopics = activeCategory ? subtopicsMap[activeCategory] || [] : []

  // Filter subtopics if search query is active
  const displayedSubtopics = useMemo(() => {
    if (!searchQuery) return currentSubtopics
    return currentSubtopics.filter(
      (sub) =>
        sub.name.toLowerCase().includes(searchQuery) ||
        (currentCategoryObj && currentCategoryObj.name.toLowerCase().includes(searchQuery))
    )
  }, [currentSubtopics, searchQuery, currentCategoryObj])

  // Compute true dynamic total questions for the selected category
  const activeCategoryTotalQuestions = currentSubtopics.reduce((acc, sub) => {
    const { questions } = getTrueTopicCounts(sub.topicId)
    return acc + questions
  }, 0)

  const toggleExpand = (topicId) => {
    setExpandedTopicId((prev) => (prev === topicId ? null : topicId))
  }

  // =========================================================================
  // VIEW 1: CATEGORY DETAIL VIEW (e.g. /topics/generalknowledge, /topics/programming)
  // =========================================================================
  if (currentCategoryObj) {
    return (
      <div className="qm-topics-page">
        {/* BACK TO ALL CATEGORIES */}
        <button
          className="qm-back-to-topics-btn mb-4"
          onClick={() => navigate('/topics')}
        >
          <ArrowLeft size={16} />
          <span>Back to All Categories</span>
        </button>

        {/* CATEGORY HERO BANNER */}
        <div className="qm-category-hero-banner mb-6">
          <div className="qm-cat-hero-left">
            <div
              className="qm-cat-hero-icon-box"
              style={{ color: currentCategoryObj.color }}
            >
              <span>{currentCategoryObj.icon}</span>
            </div>
            <div>
              <div className="qm-cat-hero-meta-row">
                <span className="qm-badge-level">Subject Domain</span>
                <span className="qm-cat-meta-stat">
                  {currentSubtopics.length} Subtopics
                </span>
                <span className="qm-cat-meta-stat">
                  {activeCategoryTotalQuestions} Questions Total
                </span>
              </div>
              <h1 className="qm-cat-hero-title">{currentCategoryObj.name}</h1>
              <p className="qm-cat-hero-desc">{currentCategoryObj.description}</p>
            </div>
          </div>
        </div>

        {/* SECTION HEADER BAR */}
        <div className="qm-category-subtopics-header mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="qm-cat-section-title">
                {currentCategoryObj.name} Topics
              </h2>
              <p className="qm-cat-section-subtitle">
                Select any topic below to view its learning modules and practice quizzes
              </p>
            </div>
            <span className="qm-cat-count-pill">
              {displayedSubtopics.length} Topics Available
            </span>
          </div>
        </div>

        {/* SUBTOPICS GRID (CLICK TO OPEN DEDICATED TOPIC PAGE) */}
        <div className="qm-subtopics-list-grid">
          {displayedSubtopics.map((sub) => {
            const { questions, modules } = getTrueTopicCounts(sub.topicId)

            return (
              <div
                key={sub.topicId}
                className="qm-subtopic-row-card"
                onClick={() => navigate(`/topic/${sub.topicId}`)}
              >
                <div className="qm-sub-left">
                  <span className="qm-sub-icon">{sub.icon}</span>
                  <div className="qm-sub-text">
                    <h3>{sub.name}</h3>
                    <span className="qm-sub-count">
                      {questions} Questions · {modules} {modules === 1 ? 'Module' : 'Modules'}
                    </span>
                  </div>
                </div>
                <div className="qm-sub-right-action">
                  <ArrowRight size={18} className="qm-chevron" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // =========================================================================
  // VIEW 2: MAIN TOPICS ROOT (/topics) - 6 FEATURED CATEGORY TILES
  // =========================================================================
  return (
    <div className="qm-topics-page">
      {/* PAGE HEADER */}
      <div className="qm-page-welcome-header">
        <h1>Explore Subject Domains</h1>
        <p>
          {searchQuery
            ? `Filtering domains matching "${searchQuery}"`
            : 'Select any category below to open its dedicated learning topics and practice quizzes.'}
        </p>
      </div>

      {/* 6 MAIN CATEGORY CARDS GRID */}
      <div className="qm-main-categories-grid">
        {mainCategoryConfigs.map((cat) => {
          const subs = subtopicsMap[cat.id] || []
          const catTotalQuestions = subs.reduce((acc, s) => {
            const { questions } = getTrueTopicCounts(s.topicId)
            return acc + questions
          }, 0)

          return (
            <div
              key={cat.id}
              className="qm-card qm-category-featured-card"
              onClick={() => navigate(`/topics/${cat.slug}`)}
            >
              <div className="qm-featured-card-top">
                <div
                  className="qm-cat-icon-large-square"
                  style={{ background: `${cat.color}15`, color: cat.color }}
                >
                  {cat.icon}
                </div>
                <div className="qm-featured-card-badge">
                  <span>{subs.length} Topics</span>
                </div>
              </div>

              <div className="qm-featured-card-body">
                <h2 className="qm-featured-card-title">{cat.name}</h2>
                <p className="qm-featured-card-desc">{cat.description}</p>
              </div>

              <div className="qm-featured-card-footer">
                <span className="qm-featured-qcount">{catTotalQuestions} Questions Total</span>
                <div className="qm-featured-explore-btn">
                  <span>Explore</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
