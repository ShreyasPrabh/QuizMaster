import React from 'react'
import {
  Terminal,
  Cpu,
  Code2,
  Zap,
  Binary,
  Atom,
  FlaskConical,
  Compass,
  Layers,
  Globe,
  BookOpen,
  Trophy,
  Gamepad2,
  Joystick,
  Database,
  Network,
  Workflow,
  CircuitBoard,
  Sparkles,
  Flame,
  Shield,
  Dna,
  Radio,
  FileCode2,
  Calculator,
  Languages,
  PenTool,
  Brain,
  Microscope,
  Boxes,
  Braces
} from 'lucide-react'

// Topic to icon mapping with vibrant retro color accents
const TOPIC_ICON_MAP = {
  // Programming
  java: { icon: CoffeeCupIcon, bg: 'var(--neon-pink)', color: '#fff' },
  python: { icon: Code2, bg: 'var(--neon-green)', color: '#000' },
  cpp: { icon: Cpu, bg: 'var(--neon-cyan)', color: '#000' },
  javascript: { icon: Zap, bg: 'var(--neon-yellow)', color: '#000' },
  typescript: { icon: Braces, bg: 'var(--neon-cyan)', color: '#000' },
  go: { icon: Boxes, bg: 'var(--neon-cyan)', color: '#000' },
  rust: { icon: CircuitBoard, bg: 'var(--neon-orange)', color: '#fff' },
  ruby: { icon: Sparkles, bg: 'var(--neon-pink)', color: '#fff' },
  php: { icon: FileCode2, bg: 'var(--neon-purple)', color: '#fff' },
  swift: { icon: Flame, bg: 'var(--neon-orange)', color: '#fff' },

  // Mathematics
  algebra: { icon: Calculator, bg: 'var(--neon-cyan)', color: '#000' },
  calculus: { icon: Compass, bg: 'var(--neon-pink)', color: '#fff' },
  linearalgebra: { icon: Binary, bg: 'var(--neon-purple)', color: '#fff' },
  probability: { icon: Gamepad2, bg: 'var(--neon-yellow)', color: '#000' },
  statistics: { icon: Workflow, bg: 'var(--neon-green)', color: '#000' },
  geometry: { icon: Compass, bg: 'var(--neon-cyan)', color: '#000' },
  trigonometry: { icon: Calculator, bg: 'var(--neon-orange)', color: '#fff' },
  discretemath: { icon: Binary, bg: 'var(--neon-pink)', color: '#fff' },
  numbertheory: { icon: Brain, bg: 'var(--neon-yellow)', color: '#000' },
  differentialequations: { icon: Workflow, bg: 'var(--neon-purple)', color: '#fff' },

  // Science
  physicsmechanics: { icon: Atom, bg: 'var(--neon-cyan)', color: '#000' },
  electromagnetism: { icon: Zap, bg: 'var(--neon-yellow)', color: '#000' },
  quantumphysics: { icon: Sparkles, bg: 'var(--neon-purple)', color: '#fff' },
  organicchemistry: { icon: FlaskConical, bg: 'var(--neon-green)', color: '#000' },
  inorganicchemistry: { icon: FlaskConical, bg: 'var(--neon-cyan)', color: '#000' },
  molecularbiology: { icon: Dna, bg: 'var(--neon-pink)', color: '#fff' },
  genetics: { icon: Dna, bg: 'var(--neon-green)', color: '#000' },
  astronomy: { icon: Radio, bg: 'var(--neon-purple)', color: '#fff' },
  thermodynamics: { icon: Flame, bg: 'var(--neon-orange)', color: '#fff' },
  ecology: { icon: Globe, bg: 'var(--neon-green)', color: '#000' },

  // Computer Science
  dsa: { icon: CircuitBoard, bg: 'var(--neon-pink)', color: '#fff' },
  algorithms: { icon: Workflow, bg: 'var(--neon-yellow)', color: '#000' },
  os: { icon: Cpu, bg: 'var(--neon-cyan)', color: '#000' },
  computernetworks: { icon: Network, bg: 'var(--neon-purple)', color: '#fff' },
  dbms: { icon: Database, bg: 'var(--neon-green)', color: '#000' },
  computerarchitecture: { icon: Cpu, bg: 'var(--neon-orange)', color: '#fff' },
  compilerdesign: { icon: Terminal, bg: 'var(--neon-pink)', color: '#fff' },
  softwareengineering: { icon: Layers, bg: 'var(--neon-cyan)', color: '#000' },
  cybersecurity: { icon: Shield, bg: 'var(--neon-pink)', color: '#fff' },
  aiml: { icon: Brain, bg: 'var(--neon-purple)', color: '#fff' },

  // General Knowledge
  worldhistory: { icon: Trophy, bg: 'var(--neon-yellow)', color: '#000' },
  worldgeography: { icon: Globe, bg: 'var(--neon-green)', color: '#000' },
  globaleconomy: { icon: Sparkles, bg: 'var(--neon-cyan)', color: '#000' },
  sciencetech: { icon: Atom, bg: 'var(--neon-purple)', color: '#fff' },
  worldpolitics: { icon: Shield, bg: 'var(--neon-orange)', color: '#fff' },
  literature: { icon: BookOpen, bg: 'var(--neon-pink)', color: '#fff' },
  artmusic: { icon: Radio, bg: 'var(--neon-yellow)', color: '#000' },
  worldcinema: { icon: Gamepad2, bg: 'var(--neon-pink)', color: '#fff' },
  sports: { icon: Trophy, bg: 'var(--neon-green)', color: '#000' },
  modernmythology: { icon: Sparkles, bg: 'var(--neon-cyan)', color: '#000' },

  // English
  advancedgrammar: { icon: PenTool, bg: 'var(--neon-pink)', color: '#fff' },
  vocabularybuilder: { icon: BookOpen, bg: 'var(--neon-yellow)', color: '#000' },
  idiomsphrases: { icon: Sparkles, bg: 'var(--neon-cyan)', color: '#000' },
  readingcomprehension: { icon: BookOpen, bg: 'var(--neon-green)', color: '#000' },
  sentencecorrection: { icon: PenTool, bg: 'var(--neon-orange)', color: '#fff' },
  synonymsantonyms: { icon: Languages, bg: 'var(--neon-purple)', color: '#fff' },
  literarydevices: { icon: Sparkles, bg: 'var(--neon-pink)', color: '#fff' },
  professionalwriting: { icon: PenTool, bg: 'var(--neon-cyan)', color: '#000' },
  phrasalverbs: { icon: Languages, bg: 'var(--neon-green)', color: '#000' },
  commonerrors: { icon: Shield, bg: 'var(--neon-yellow)', color: '#000' },
}

// Category fallback icon mapping
const CATEGORY_ICON_MAP = {
  Programming: { icon: Terminal, bg: 'var(--neon-pink)', color: '#fff' },
  Mathematics: { icon: Calculator, bg: 'var(--neon-cyan)', color: '#000' },
  Science: { icon: Atom, bg: 'var(--neon-green)', color: '#000' },
  'Computer Science': { icon: Cpu, bg: 'var(--neon-purple)', color: '#fff' },
  'General Knowledge': { icon: Globe, bg: 'var(--neon-yellow)', color: '#000' },
  English: { icon: Languages, bg: 'var(--neon-orange)', color: '#fff' },
}

// Module stage icons (for Stage 1, 2, 3, 4, 5...)
const STAGE_ICONS = [
  CircuitBoard,
  Cpu,
  Zap,
  Shield,
  Sparkles,
  Trophy,
  Brain,
  Workflow,
]

// Custom Retro Coffee Pixel Cup Icon
function CoffeeCupIcon({ size = 18, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  )
}

/**
 * RetroIcon Component
 * Renders a stylized, high-contrast retro arcade badge with icons that match the cyber aesthetic
 */
export default function RetroIcon({
  topicId,
  category,
  stageNumber,
  size = 'md',
  badge = true,
  style = {}
}) {
  const cleanId = (topicId || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const config = TOPIC_ICON_MAP[cleanId] || (category && CATEGORY_ICON_MAP[category]) || {
    icon: Joystick,
    bg: 'var(--neon-cyan)',
    color: '#000',
  }

  // If stage number is provided, pick stage icon
  const IconComponent = stageNumber
    ? STAGE_ICONS[(stageNumber - 1) % STAGE_ICONS.length] || Zap
    : config.icon

  const sizePx = size === 'sm' ? 14 : size === 'lg' ? 24 : size === 'xl' ? 32 : 18
  const boxDim = size === 'sm' ? '28px' : size === 'lg' ? '46px' : size === 'xl' ? '60px' : '36px'

  if (!badge) {
    return <IconComponent size={sizePx} color={config.bg} style={style} />
  }

  return (
    <div
      style={{
        width: boxDim,
        height: boxDim,
        background: config.bg,
        color: config.color,
        border: '2.5px solid #000000',
        boxShadow: size === 'sm' ? '2px 2px 0px #000' : '3px 3px 0px #000',
        borderRadius: '6px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transform: 'rotate(-2deg)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
      className="retro-icon-badge"
    >
      <IconComponent size={sizePx} strokeWidth={2.5} />
    </div>
  )
}
