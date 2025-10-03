export const expandedGrammarRules = [
  {
    id: 'present-simple',
    category: 'tenses',
    title: { en: 'Present Simple', pt: 'Presente Simples' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used for habits, routines, general truths, and permanent situations',
      pt: 'Usado para hábitos, rotinas, verdades gerais e situações permanentes'
    },
    rules: [
      { en: 'Add -s/-es for he/she/it', pt: 'Adicione -s/-es para he/she/it' },
      { en: 'Use base form for I/you/we/they', pt: 'Use forma base para I/you/we/they' }
    ],
    examples: [
      { en: 'Water boils at 100°C', pt: 'A água ferve a 100°C' },
      { en: 'She works in a chemical plant', pt: 'Ela trabalha numa planta química' }
    ]
  },
  {
    id: 'present-continuous',
    category: 'tenses',
    title: { en: 'Present Continuous', pt: 'Presente Contínuo' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used for actions happening now or temporary situations',
      pt: 'Usado para ações acontecendo agora ou situações temporárias'
    },
    rules: [
      { en: 'Form: am/is/are + verb-ing', pt: 'Forma: am/is/are + verbo-ing' }
    ],
    examples: [
      { en: 'I am conducting an experiment', pt: 'Estou conduzindo um experimento' }
    ]
  },
  {
    id: 'present-perfect',
    category: 'tenses',
    title: { en: 'Present Perfect', pt: 'Presente Perfeito' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Connects past actions to present',
      pt: 'Conecta ações passadas ao presente'
    },
    rules: [
      { en: 'Form: have/has + past participle', pt: 'Forma: have/has + particípio passado' }
    ],
    examples: [
      { en: 'They have tested five catalysts', pt: 'Eles testaram cinco catalisadores' }
    ]
  },
  {
    id: 'zero-conditional',
    category: 'conditionals',
    title: { en: 'Zero Conditional', pt: 'Condicional Zero' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used for general truths and scientific facts',
      pt: 'Usado para verdades gerais e fatos científicos'
    },
    rules: [
      { en: 'Form: If + present simple, present simple', pt: 'Forma: If + presente simples, presente simples' }
    ],
    examples: [
      { en: 'If you heat water to 100°C, it boils', pt: 'Se você aquece água a 100°C, ela ferve' }
    ]
  },
  {
    id: 'passive-present',
    category: 'passive',
    title: { en: 'Passive Voice - Present', pt: 'Voz Passiva - Presente' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used when the action is more important than who does it',
      pt: 'Usado quando a ação é mais importante do que quem a faz'
    },
    rules: [
      { en: 'Form: is/are + past participle', pt: 'Forma: is/are + particípio passado' }
    ],
    examples: [
      { en: 'The samples are analyzed daily', pt: 'As amostras são analisadas diariamente' }
    ]
  }
];

export default expandedGrammarRules;