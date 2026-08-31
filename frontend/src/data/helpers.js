// Core Quiz Generation Helpers

export function build20Questions(baseList, topicPrefix, topicName, moduleTitle, difficulty) {
  const result = [...baseList]
  let index = 1

  const coreTemplates = [
    {
      text: `In ${topicName} (${moduleTitle}), what is the primary fundamental principle or core mechanism?`,
      code_snippet: null,
      explanation: `Core principles establish deterministic rules and reliable behavior across execution states.`,
      choices: [
        { id: '1', text: `Core foundational rule and mechanism in ${moduleTitle}`, is_correct: true },
        { id: '2', text: 'Arbitrary random selection', is_correct: false },
        { id: '3', text: 'Static global side-effect', is_correct: false },
        { id: '4', text: 'Undefined runtime state', is_correct: false },
      ],
    },
    {
      text: `Which property or theorem is universally applied when evaluating operations in ${moduleTitle}?`,
      code_snippet: null,
      explanation: `Systematic evaluation ensures consistency and predictable mathematical or logical outcomes.`,
      choices: [
        { id: '1', text: 'Preserves conservation, balance, and invariants across transformations', is_correct: true },
        { id: '2', text: 'Reverses order of evaluation arbitrarily', is_correct: false },
        { id: '3', text: 'Disables validation checks', is_correct: false },
        { id: '4', text: 'Forces memory corruption', is_correct: false },
      ],
    },
    {
      text: `In ${topicName} (${moduleTitle}), what is the best practice for optimal performance and error prevention?`,
      code_snippet: null,
      explanation: `Adhering to established industry or domain standards prevents regressions and resource bottlenecks.`,
      choices: [
        { id: '1', text: 'Structured isolation, modularization, and strict input validation', is_correct: true },
        { id: '2', text: 'Bypassing boundary checks silently', is_correct: false },
        { id: '3', text: 'Ignoring exceptional cases', is_correct: false },
        { id: '4', text: 'Overriding system clock signals', is_correct: false },
      ],
    },
    {
      text: `What is the computational or operational complexity associated with standard operations in ${moduleTitle}?`,
      code_snippet: null,
      explanation: `Optimal implementations achieve logarithmic or constant bounds for core operations.`,
      choices: [
        { id: '1', text: 'O(1) to O(n log n) efficiency bound depending on distribution', is_correct: true },
        { id: '2', text: 'O(n!) factorial exponential growth', is_correct: false },
        { id: '3', text: 'Infinite recursion', is_correct: false },
        { id: '4', text: 'Undetermined complexity', is_correct: false },
      ],
    },
    {
      text: `What is the primary advantage of mastering ${moduleTitle} in ${topicName}?`,
      code_snippet: null,
      explanation: `Deep understanding provides the mental framework for solving complex multi-variable problems.`,
      choices: [
        { id: '1', text: 'Enables high-level analytical reasoning, architectural precision, and practical mastery', is_correct: true },
        { id: '2', text: 'Requires memorization without conceptual understanding', is_correct: false },
        { id: '3', text: 'Disables automated testing', is_correct: false },
        { id: '4', text: 'Restricts hardware capability', is_correct: false },
      ],
    },
  ]

  while (result.length < 20) {
    const tmpl = coreTemplates[(index - 1) % coreTemplates.length]
    result.push({
      id: `${topicPrefix}-${difficulty}-${result.length + 1}`,
      text: `${tmpl.text} (Question ${result.length + 1})`,
      code_snippet: tmpl.code_snippet,
      difficulty,
      explanation: tmpl.explanation,
      choices: tmpl.choices,
    })
    index++
  }

  return result.slice(0, 20)
}

/**
 * Standard factory helper to easily declare any topic and its learning modules.
 * Simply provide:
 * - id: unique key (e.g. 'java', 'react', 'rust')
 * - name: Display title (e.g. 'Java Programming', 'React 19')
 * - icon: Emoji or icon identifier (e.g. '☕', '⚛️')
 * - category: Main domain ('Programming', 'Mathematics', etc.)
 * - description: Subtitle summary
 * - modulesData: Array of [{ title, description }]
 */
export function createTopic(id, name, icon, category, description, modulesData) {
  return {
    id,
    name,
    icon,
    category,
    description,
    modules: modulesData.map((m, idx) => ({
      id: `${id}-m${idx + 1}`,
      number: idx + 1,
      title: m.title,
      description: m.description,
      difficulties: {
        easy: build20Questions(m.easyQuestions || [], `${id}-m${idx + 1}`, name, m.title, 'easy'),
        intermediate: build20Questions(m.intermediateQuestions || [], `${id}-m${idx + 1}`, name, m.title, 'intermediate'),
        hard: build20Questions(m.hardQuestions || [], `${id}-m${idx + 1}`, name, m.title, 'hard'),
      },
    })),
  }
}
