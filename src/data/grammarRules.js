export const grammarRules = [
 // Present Perfect Continuous
{
  id: 'present-perfect-continuous',
  category: 'tenses',
  title: { en: 'Present Perfect Continuous', pt: 'Presente Perfeito Contínuo' },
  difficulty: 'intermediate',
  explanation: {
    en: 'Used for actions that started in the past and are still continuing',
    pt: 'Usado para ações que começaram no passado e ainda continuam'
  },
  rules: [
    { en: 'Form: have/has been + verb-ing', pt: 'Forma: have/has been + verbo-ing' },
    { en: 'Emphasizes duration of ongoing action', pt: 'Enfatiza duração de ação em andamento' }
  ],
  examples: [
    { en: 'I have been studying English for 5 years', pt: 'Estudo inglês há 5 anos' },
    { en: 'She has been working here since January', pt: 'Ela trabalha aqui desde janeiro' }
  ]
},

// Past Perfect
{
  id: 'past-perfect',
  category: 'tenses',
  title: { en: 'Past Perfect', pt: 'Passado Perfeito' },
  difficulty: 'intermediate',
  explanation: {
    en: 'Used for actions completed before another past action',
    pt: 'Usado para ações completadas antes de outra ação no passado'
  },
  rules: [
    { en: 'Form: had + past participle', pt: 'Forma: had + particípio passado' }
  ],
  examples: [
    { en: 'Before the experiment failed, we had tested it three times', pt: 'Antes do experimento falhar, tínhamos testado três vezes' }
  ]
},

// Modal: Could (ability)
{
  id: 'modal-could-ability',
  category: 'modals',
  title: { en: 'Could - Past Ability', pt: 'Could - Habilidade Passada' },
  difficulty: 'beginner',
  explanation: {
    en: 'Expresses past ability or polite requests',
    pt: 'Expressa habilidade passada ou pedidos educados'
  },
  rules: [
    { en: 'Past ability: could + base verb', pt: 'Habilidade passada: could + verbo base' },
    { en: 'Polite request: Could you...?', pt: 'Pedido educado: Could you...?' }
  ],
  examples: [
    { en: 'I could speak French when I was young', pt: 'Eu falava francês quando era jovem' },
    { en: 'Could you send me the report?', pt: 'Você poderia me enviar o relatório?' }
  ]
},

// Comparatives with -er
{
  id: 'comparatives-er',
  category: 'comparison',
  title: { en: 'Comparatives with -er', pt: 'Comparativos com -er' },
  difficulty: 'beginner',
  explanation: {
    en: 'Short adjectives add -er to compare two things',
    pt: 'Adjetivos curtos adicionam -er para comparar duas coisas'
  },
  rules: [
    { en: 'One syllable: add -er (fast → faster)', pt: 'Uma sílaba: adicione -er' },
    { en: 'Two syllables ending in -y: change to -ier (busy → busier)', pt: 'Duas sílabas terminando em -y: mude para -ier' }
  ],
  examples: [
    { en: 'This method is faster than the old one', pt: 'Este método é mais rápido que o antigo' },
    { en: 'The new catalyst is cheaper', pt: 'O novo catalisador é mais barato' }
  ]
},// Add these to your existing grammarRules array in src/data/grammarRules.js
// Insert before the closing ];

  {
    id: 'present-perfect-continuous',
    category: 'tenses',
    title: { en: 'Present Perfect Continuous', pt: 'Presente Perfeito Contínuo' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used for actions that started in the past and continue to the present',
      pt: 'Usado para ações que começaram no passado e continuam até o presente'
    },
    rules: [
      { en: 'Form: have/has been + verb-ing', pt: 'Forma: have/has been + verbo-ing' },
      { en: 'Focus on duration of ongoing action', pt: 'Foco na duração da ação contínua' }
    ],
    examples: [
      { en: 'I have been studying English for 5 years', pt: 'Estudo inglês há 5 anos' },
      { en: 'She has been working here since 2020', pt: 'Ela trabalha aqui desde 2020' }
    ]
  },
  {
    id: 'past-perfect',
    category: 'tenses',
    title: { en: 'Past Perfect', pt: 'Passado Perfeito' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used for actions completed before another past action',
      pt: 'Usado para ações completadas antes de outra ação no passado'
    },
    rules: [
      { en: 'Form: had + past participle', pt: 'Forma: had + particípio passado' },
      { en: 'Shows sequence of past events', pt: 'Mostra sequência de eventos passados' }
    ],
    examples: [
      { en: 'The experiment had failed before we arrived', pt: 'O experimento tinha falado antes de chegarmos' },
      { en: 'I had already eaten when she called', pt: 'Eu já tinha comido quando ela ligou' }
    ]
  },
  {
    id: 'future-continuous',
    category: 'tenses',
    title: { en: 'Future Continuous', pt: 'Futuro Contínuo' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used for actions in progress at a specific future time',
      pt: 'Usado para ações em progresso em momento específico do futuro'
    },
    rules: [
      { en: 'Form: will be + verb-ing', pt: 'Forma: will be + verbo-ing' }
    ],
    examples: [
      { en: 'I will be working on the report tomorrow', pt: 'Estarei trabalhando no relatório amanhã' },
      { en: 'This time next week, we will be analyzing the results', pt: 'Na próxima semana a esta hora, estaremos analisando os resultados' }
    ]
  },
  {
    id: 'conditional-first',
    category: 'conditionals',
    title: { en: 'First Conditional', pt: 'Primeiro Condicional' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used for real or likely future situations',
      pt: 'Usado para situações futuras reais ou prováveis'
    },
    rules: [
      { en: 'Form: If + present simple, will + verb', pt: 'Forma: If + presente simples, will + verbo' }
    ],
    examples: [
      { en: 'If the temperature increases, the reaction will accelerate', pt: 'Se a temperatura aumentar, a reação acelerará' },
      { en: 'If you heat water to 100°C, it will boil', pt: 'Se você aquecer água a 100°C, ela ferverá' }
    ]
  },
  {
    id: 'conditional-second',
    category: 'conditionals',
    title: { en: 'Second Conditional', pt: 'Segundo Condicional' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used for hypothetical or unlikely present/future situations',
      pt: 'Usado para situações hipotéticas ou improváveis no presente/futuro'
    },
    rules: [
      { en: 'Form: If + past simple, would + verb', pt: 'Forma: If + passado simples, would + verbo' }
    ],
    examples: [
      { en: 'If I had more time, I would run more experiments', pt: 'Se eu tivesse mais tempo, faria mais experimentos' },
      { en: 'If the catalyst were cheaper, we would use it', pt: 'Se o catalisador fosse mais barato, o usaríamos' }
    ]
  },
  {
    id: 'passive-voice',
    category: 'voice',
    title: { en: 'Passive Voice', pt: 'Voz Passiva' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used when the action is more important than who does it',
      pt: 'Usado quando a ação é mais importante que quem a faz'
    },
    rules: [
      { en: 'Form: be + past participle', pt: 'Forma: be + particípio passado' },
      { en: 'Common in scientific writing', pt: 'Comum em escrita científica' }
    ],
    examples: [
      { en: 'The mixture was heated to 80°C', pt: 'A mistura foi aquecida a 80°C' },
      { en: 'The results are being analyzed', pt: 'Os resultados estão sendo analisados' }
    ]
  },
  {
    id: 'reported-speech',
    category: 'speech',
    title: { en: 'Reported Speech', pt: 'Discurso Indireto' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used to report what someone said without using their exact words',
      pt: 'Usado para reportar o que alguém disse sem usar suas palavras exatas'
    },
    rules: [
      { en: 'Verb tenses move back one step', pt: 'Tempos verbais retrocedem um passo' },
      { en: 'Pronouns and time expressions change', pt: 'Pronomes e expressões de tempo mudam' }
    ],
    examples: [
      { en: 'She said, "I am working" → She said she was working', pt: 'Ela disse: "Estou trabalhando" → Ela disse que estava trabalhando' },
      { en: 'He asked, "Do you understand?" → He asked if I understood', pt: 'Ele perguntou: "Você entende?" → Ele perguntou se eu entendia' }
    ]
  },
  {
    id: 'modal-verbs-ability',
    category: 'modals',
    title: { en: 'Modals - Ability', pt: 'Modais - Habilidade' },
    difficulty: 'beginner',
    explanation: {
      en: 'Can, could, be able to express ability',
      pt: 'Can, could, be able to expressam habilidade'
    },
    rules: [
      { en: 'can - present ability', pt: 'can - habilidade presente' },
      { en: 'could - past ability', pt: 'could - habilidade passada' },
      { en: 'be able to - all tenses', pt: 'be able to - todos os tempos' }
    ],
    examples: [
      { en: 'I can solve this equation', pt: 'Posso resolver esta equação' },
      { en: 'She was able to complete the analysis', pt: 'Ela conseguiu completar a análise' }
    ]
  },
  {
    id: 'modal-verbs-obligation',
    category: 'modals',
    title: { en: 'Modals - Obligation', pt: 'Modais - Obrigação' },
    difficulty: 'beginner',
    explanation: {
      en: 'Must, have to, should express obligation',
      pt: 'Must, have to, should expressam obrigação'
    },
    rules: [
      { en: 'must - strong obligation', pt: 'must - obrigação forte' },
      { en: 'have to - external obligation', pt: 'have to - obrigação externa' },
      { en: 'should - advice/recommendation', pt: 'should - conselho/recomendação' }
    ],
    examples: [
      { en: 'You must wear safety goggles in the lab', pt: 'Você deve usar óculos de segurança no laboratório' },
      { en: 'We should check the results twice', pt: 'Devíamos verificar os resultados duas vezes' }
    ]
  },
  {
    id: 'articles-definite',
    category: 'articles',
    title: { en: 'Definite Article (the)', pt: 'Artigo Definido (the)' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used for specific or known things',
      pt: 'Usado para coisas específicas ou conhecidas'
    },
    rules: [
      { en: 'Use when both speaker and listener know what is referred to', pt: 'Use quando falante e ouvinte sabem do que se trata' },
      { en: 'Use with superlatives', pt: 'Use com superlativos' }
    ],
    examples: [
      { en: 'The experiment we conducted yesterday', pt: 'O experimento que conduzimos ontem' },
      { en: 'The best solution is distillation', pt: 'A melhor solução é destilação' }
    ]
  },
  {
    id: 'relative-clauses',
    category: 'clauses',
    title: { en: 'Relative Clauses', pt: 'Orações Relativas' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Add extra information about a noun',
      pt: 'Adicionam informação extra sobre um substantivo'
    },
    rules: [
      { en: 'who - for people', pt: 'who - para pessoas' },
      { en: 'which - for things', pt: 'which - para coisas' },
      { en: 'that - for both (informal)', pt: 'that - para ambos (informal)' }
    ],
    examples: [
      { en: 'The engineer who designed this process is brilliant', pt: 'O engenheiro que projetou este processo é brilhante' },
      { en: 'The catalyst which we used increased the yield', pt: 'O catalisador que usamos aumentou o rendimento' }
    ]
  },
  {
    id: 'comparatives-superlatives',
    category: 'comparison',
    title: { en: 'Comparatives and Superlatives', pt: 'Comparativos e Superlativos' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used to compare things',
      pt: 'Usados para comparar coisas'
    },
    rules: [
      { en: 'Short adjectives: add -er/-est', pt: 'Adjetivos curtos: adicione -er/-est' },
      { en: 'Long adjectives: use more/most', pt: 'Adjetivos longos: use more/most' }
    ],
    examples: [
      { en: 'This method is faster than the old one', pt: 'Este método é mais rápido que o antigo' },
      { en: 'It is the most efficient process', pt: 'É o processo mais eficiente' }
    ]
  }
]

export default grammarRules;