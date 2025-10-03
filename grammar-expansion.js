export const expandedGrammarRules = [
  // VERB TENSES (12 rules)
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
      { en: 'Use base form for I/you/we/they', pt: 'Use forma base para I/you/we/they' },
      { en: 'Negative: do not/does not + base verb', pt: 'Negativo: do not/does not + verbo base' }
    ],
    examples: [
      { en: 'Water boils at 100°C', pt: 'A água ferve a 100°C' },
      { en: 'She works in a chemical plant', pt: 'Ela trabalha numa planta química' },
      { en: 'They do not use catalysts', pt: 'Eles não usam catalisadores' }
    ],
    exercises: [
      {
        question: 'Complete: The reaction ____ (occur) at high temperatures.',
        options: ['occur', 'occurs', 'occurring', 'occurred'],
        correctAnswer: 1,
        explanation: { en: 'Use "occurs" - third person singular takes -s', pt: 'Use "occurs" - terceira pessoa singular leva -s' }
      }
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
      { en: 'Form: am/is/are + verb-ing', pt: 'Forma: am/is/are + verbo-ing' },
      { en: 'Not used with stative verbs (know, understand)', pt: 'Não usado com verbos estativos (know, understand)' }
    ],
    examples: [
      { en: 'I am conducting an experiment', pt: 'Estou conduzindo um experimento' },
      { en: 'The temperature is rising rapidly', pt: 'A temperatura está subindo rapidamente' }
    ],
    exercises: [
      {
        question: 'Complete: We ____ (monitor) the pressure right now.',
        options: ['monitor', 'are monitoring', 'monitored', 'have monitored'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'present-perfect',
    category: 'tenses',
    title: { en: 'Present Perfect', pt: 'Presente Perfeito' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Connects past actions to present - unspecified time or continuing relevance',
      pt: 'Conecta ações passadas ao presente - tempo não especificado ou relevância contínua'
    },
    rules: [
      { en: 'Form: have/has + past participle', pt: 'Forma: have/has + particípio passado' },
      { en: 'Use "since" for point in time, "for" for duration', pt: 'Use "since" para ponto no tempo, "for" para duração' }
    ],
    examples: [
      { en: 'They have tested five catalysts', pt: 'Eles testaram cinco catalisadores' },
      { en: 'She has worked here for ten years', pt: 'Ela trabalha aqui há dez anos' }
    ],
    exercises: [
      {
        question: 'Complete: The company ____ (develop) new processes since 2020.',
        options: ['develops', 'developed', 'has developed', 'is developing'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'past-simple',
    category: 'tenses',
    title: { en: 'Past Simple', pt: 'Passado Simples' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used for completed actions at a specific time in the past',
      pt: 'Usado para ações completadas em momento específico no passado'
    },
    rules: [
      { en: 'Regular verbs: add -ed', pt: 'Verbos regulares: adicione -ed' },
      { en: 'Irregular verbs: memorize forms', pt: 'Verbos irregulares: memorize as formas' }
    ],
    examples: [
      { en: 'We completed the analysis yesterday', pt: 'Completamos a análise ontem' },
      { en: 'The experiment failed due to contamination', pt: 'O experimento falhou devido à contaminação' }
    ]
  },
  {
    id: 'future-simple',
    category: 'tenses',
    title: { en: 'Future Simple (will)', pt: 'Futuro Simples (will)' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used for predictions, spontaneous decisions, and promises',
      pt: 'Usado para previsões, decisões espontâneas e promessas'
    },
    rules: [
      { en: 'Form: will + base verb', pt: 'Forma: will + verbo base' },
      { en: 'Negative: will not (won\'t)', pt: 'Negativo: will not (won\'t)' }
    ],
    examples: [
      { en: 'The reaction will produce hydrogen gas', pt: 'A reação produzirá gás hidrogênio' },
      { en: 'I will send you the report tomorrow', pt: 'Enviarei o relatório amanhã' }
    ]
  },

  // CONDITIONALS (4 rules)
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
      { en: 'Form: If + present simple, present simple', pt: 'Forma: If + presente simples, presente simples' },
      { en: 'Can replace "if" with "when"', pt: 'Pode substituir "if" por "when"' }
    ],
    examples: [
      { en: 'If you heat water to 100°C, it boils', pt: 'Se você aquece água a 100°C, ela ferve' },
      { en: 'When pressure increases, volume decreases', pt: 'Quando a pressão aumenta, o volume diminui' }
    ],
    exercises: [
      {
        question: 'Complete: If the catalyst ____ (be) effective, the reaction rate increases.',
        options: ['is', 'will be', 'was', 'would be'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'first-conditional',
    category: 'conditionals',
    title: { en: 'First Conditional', pt: 'Primeira Condicional' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used for real possibilities in the future',
      pt: 'Usado para possibilidades reais no futuro'
    },
    rules: [
      { en: 'Form: If + present simple, will + base verb', pt: 'Forma: If + presente simples, will + verbo base' }
    ],
    examples: [
      { en: 'If we increase the temperature, the yield will improve', pt: 'Se aumentarmos a temperatura, o rendimento melhorará' }
    ]
  },
  {
    id: 'second-conditional',
    category: 'conditionals',
    title: { en: 'Second Conditional', pt: 'Segunda Condicional' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used for hypothetical or unlikely situations in present/future',
      pt: 'Usado para situações hipotéticas ou improváveis no presente/futuro'
    },
    rules: [
      { en: 'Form: If + past simple, would + base verb', pt: 'Forma: If + passado simples, would + verbo base' }
    ],
    examples: [
      { en: 'If we had better equipment, we would get accurate results', pt: 'Se tivéssemos melhor equipamento, obteríamos resultados precisos' }
    ]
  },
  {
    id: 'third-conditional',
    category: 'conditionals',
    title: { en: 'Third Conditional', pt: 'Terceira Condicional' },
    difficulty: 'advanced',
    explanation: {
      en: 'Used for hypothetical situations in the past (impossible to change)',
      pt: 'Usado para situações hipotéticas no passado (impossível de mudar)'
    },
    rules: [
      { en: 'Form: If + past perfect, would have + past participle', pt: 'Forma: If + past perfect, would have + particípio passado' }
    ],
    examples: [
      { en: 'If they had controlled the temperature, the reaction would not have failed', pt: 'Se tivessem controlado a temperatura, a reação não teria falhado' }
    ]
  },

  // PASSIVE VOICE (3 rules)
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
      { en: 'Form: is/are + past participle', pt: 'Forma: is/are + particípio passado' },
      { en: 'Common in scientific writing', pt: 'Comum em escrita científica' }
    ],
    examples: [
      { en: 'The samples are analyzed daily', pt: 'As amostras são analisadas diariamente' },
      { en: 'Ethanol is produced from fermentation', pt: 'O etanol é produzido por fermentação' }
    ],
    exercises: [
      {
        question: 'Convert to passive: "We test the catalyst regularly."',
        options: [
          'The catalyst tests regularly',
          'The catalyst is tested regularly',
          'The catalyst was tested regularly',
          'The catalyst has been tested regularly'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'passive-past',
    category: 'passive',
    title: { en: 'Passive Voice - Past', pt: 'Voz Passiva - Passado' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used for completed actions where the doer is unknown or unimportant',
      pt: 'Usado para ações completadas onde o agente é desconhecido ou sem importância'
    },
    rules: [
      { en: 'Form: was/were + past participle', pt: 'Forma: was/were + particípio passado' }
    ],
    examples: [
      { en: 'The experiment was conducted last week', pt: 'O experimento foi conduzido semana passada' }
    ]
  },
  {
    id: 'passive-perfect',
    category: 'passive',
    title: { en: 'Passive Voice - Present Perfect', pt: 'Voz Passiva - Presente Perfeito' },
    difficulty: 'advanced',
    explanation: {
      en: 'Used for actions completed at an unspecified time with present relevance',
      pt: 'Usado para ações completadas em tempo não especificado com relevância presente'
    },
    rules: [
      { en: 'Form: has/have been + past participle', pt: 'Forma: has/have been + particípio passado' }
    ],
    examples: [
      { en: 'The results have been verified', pt: 'Os resultados foram verificados' }
    ]
  },

  // MODAL VERBS (8 rules)
  {
    id: 'modal-can',
    category: 'modals',
    title: { en: 'Can/Could - Ability & Permission', pt: 'Can/Could - Habilidade & Permissão' },
    difficulty: 'beginner',
    explanation: {
      en: 'Express ability, possibility, and permission',
      pt: 'Expressar habilidade, possibilidade e permissão'
    },
    rules: [
      { en: 'Can: present ability/permission', pt: 'Can: habilidade/permissão presente' },
      { en: 'Could: past ability, polite requests', pt: 'Could: habilidade passada, pedidos polidos' }
    ],
    examples: [
      { en: 'This process can reduce costs by 30%', pt: 'Este processo pode reduzir custos em 30%' },
      { en: 'Could you send me the data?', pt: 'Você poderia me enviar os dados?' }
    ]
  },
  {
    id: 'modal-must',
    category: 'modals',
    title: { en: 'Must/Have to - Obligation', pt: 'Must/Have to - Obrigação' },
    difficulty: 'beginner',
    explanation: {
      en: 'Express necessity and obligation',
      pt: 'Expressar necessidade e obrigação'
    },
    rules: [
      { en: 'Must: strong obligation (personal opinion)', pt: 'Must: obrigação forte (opinião pessoal)' },
      { en: 'Have to: external obligation', pt: 'Have to: obrigação externa' }
    ],
    examples: [
      { en: 'Safety protocols must be followed', pt: 'Protocolos de segurança devem ser seguidos' },
      { en: 'We have to submit the report by Friday', pt: 'Temos que enviar o relatório até sexta' }
    ]
  },
  {
    id: 'modal-should',
    category: 'modals',
    title: { en: 'Should/Ought to - Advice', pt: 'Should/Ought to - Conselho' },
    difficulty: 'beginner',
    explanation: {
      en: 'Give advice, recommendations, and expectations',
      pt: 'Dar conselhos, recomendações e expectativas'
    },
    examples: [
      { en: 'You should calibrate the equipment regularly', pt: 'Você deveria calibrar o equipamento regularmente' }
    ]
  },
  {
    id: 'modal-may-might',
    category: 'modals',
    title: { en: 'May/Might - Possibility', pt: 'May/Might - Possibilidade' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Express possibility and permission',
      pt: 'Expressar possibilidade e permissão'
    },
    examples: [
      { en: 'The results may vary depending on conditions', pt: 'Os resultados podem variar dependendo das condições' }
    ]
  },
  {
    id: 'modal-would',
    category: 'modals',
    title: { en: 'Would - Hypothetical & Polite', pt: 'Would - Hipotético & Polido' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used for hypothetical situations, past habits, and polite requests',
      pt: 'Usado para situações hipotéticas, hábitos passados e pedidos polidos'
    },
    examples: [
      { en: 'I would recommend using a different solvent', pt: 'Eu recomendaria usar um solvente diferente' }
    ]
  },

  // ARTICLES (3 rules)
  {
    id: 'article-a-an',
    category: 'articles',
    title: { en: 'A/An - Indefinite Articles', pt: 'A/An - Artigos Indefinidos' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used with singular countable nouns when not specific',
      pt: 'Usado com substantivos contáveis singulares quando não específicos'
    },
    rules: [
      { en: 'Use "a" before consonant sounds', pt: 'Use "a" antes de sons consonantais' },
      { en: 'Use "an" before vowel sounds', pt: 'Use "an" antes de sons vocálicos' }
    ],
    examples: [
      { en: 'A catalyst speeds up reactions', pt: 'Um catalisador acelera reações' },
      { en: 'An exothermic reaction releases heat', pt: 'Uma reação exotérmica libera calor' }
    ]
  },
  {
    id: 'article-the',
    category: 'articles',
    title: { en: 'The - Definite Article', pt: 'The - Artigo Definido' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used when referring to specific or previously mentioned things',
      pt: 'Usado ao se referir a coisas específicas ou mencionadas anteriormente'
    },
    examples: [
      { en: 'The reaction we discussed yesterday', pt: 'A reação que discutimos ontem' }
    ]
  },
  {
    id: 'article-zero',
    category: 'articles',
    title: { en: 'Zero Article', pt: 'Artigo Zero' },
    difficulty: 'intermediate',
    explanation: {
      en: 'No article used with plural/uncountable nouns in general statements',
      pt: 'Nenhum artigo usado com substantivos plurais/incontáveis em declarações gerais'
    },
    examples: [
      { en: 'Catalysts are essential in industry', pt: 'Catalisadores são essenciais na indústria' }
    ]
  },

  // PREPOSITIONS (6 rules)
  {
    id: 'prep-time',
    category: 'prepositions',
    title: { en: 'Prepositions of Time', pt: 'Preposições de Tempo' },
    difficulty: 'beginner',
    explanation: {
      en: 'In, on, at for expressing time',
      pt: 'In, on, at para expressar tempo'
    },
    rules: [
      { en: 'At: specific times (at 3pm, at night)', pt: 'At: horários específicos (at 3pm, at night)' },
      { en: 'On: days and dates (on Monday, on July 4th)', pt: 'On: dias e datas (on Monday, on July 4th)' },
      { en: 'In: months, years, seasons (in July, in 2024)', pt: 'In: meses, anos, estações (in July, in 2024)' }
    ],
    examples: [
      { en: 'The meeting is at 2pm on Friday', pt: 'A reunião é às 14h na sexta-feira' },
      { en: 'We started the project in January', pt: 'Começamos o projeto em janeiro' }
    ]
  },
  {
    id: 'prep-place',
    category: 'prepositions',
    title: { en: 'Prepositions of Place', pt: 'Preposições de Lugar' },
    difficulty: 'beginner',
    explanation: {
      en: 'In, on, at for expressing location',
      pt: 'In, on, at para expressar localização'
    },
    rules: [
      { en: 'In: enclosed spaces (in the lab, in Brazil)', pt: 'In: espaços fechados (in the lab, in Brazil)' },
      { en: 'On: surfaces (on the table, on the floor)', pt: 'On: superfícies (on the table, on the floor)' },
      { en: 'At: specific points (at the entrance, at 25°C)', pt: 'At: pontos específicos (at the entrance, at 25°C)' }
    ],
    examples: [
      { en: 'The equipment is in the laboratory', pt: 'O equipamento está no laboratório' }
    ]
  },

  // REPORTED SPEECH (2 rules)
  {
    id: 'reported-statements',
    category: 'reported-speech',
    title: { en: 'Reported Statements', pt: 'Discurso Indireto - Declarações' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Converting direct speech to reported speech',
      pt: 'Convertendo discurso direto para indireto'
    },
    rules: [
      { en: 'Backshift tenses (present → past)', pt: 'Retroceder tempos verbais (presente → passado)' },
      { en: 'Change pronouns and time expressions', pt: 'Mudar pronomes e expressões de tempo' }
    ],
    examples: [
      { en: 'Direct: "The test failed." → Reported: She said the test had failed', pt: 'Direto: "O teste falhou." → Indireto: Ela disse que o teste tinha falhado' }
    ]
  },

  // RELATIVE CLAUSES (2 rules)
  {
    id: 'relative-defining',
    category: 'relative-clauses',
    title: { en: 'Defining Relative Clauses', pt: 'Orações Relativas Restritivas' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Essential information - no commas',
      pt: 'Informação essencial - sem vírgulas'
    },
    rules: [
      { en: 'Who: for people', pt: 'Who: para pessoas' },
      { en: 'Which/that: for things', pt: 'Which/that: para coisas' },
      { en: 'Where: for places', pt: 'Where: para lugares' }
    ],
    examples: [
      { en: 'The engineer who designed this process won an award', pt: 'O engenheiro que projetou este processo ganhou um prêmio' }
    ]
  },

  // COMPARATIVES & SUPERLATIVES (2 rules)
  {
    id: 'comparatives',
    category: 'comparison',
    title: { en: 'Comparatives', pt: 'Comparativos' },
    difficulty: 'beginner',
    explanation: {
      en: 'Comparing two things',
      pt: 'Comparando duas coisas'
    },
    rules: [
      { en: 'Short adjectives: add -er (faster, higher)', pt: 'Adjetivos curtos: adicione -er (faster, higher)' },
      { en: 'Long adjectives: more + adjective (more efficient)', pt: 'Adjetivos longos: more + adjetivo (more efficient)' }
    ],
    examples: [
      { en: 'This method is faster than the previous one', pt: 'Este método é mais rápido que o anterior' },
      { en: 'Platinum is more expensive than nickel', pt: 'Platina é mais cara que níquel' }
    ]
  },
  {
    id: 'superlatives',
    category: 'comparison',
    title: { en: 'Superlatives', pt: 'Superlativos' },
    difficulty: 'beginner',
    explanation: {
      en: 'Comparing three or more things',
      pt: 'Comparando três ou mais coisas'
    },
    rules: [
      { en: 'Short adjectives: the + -est (the fastest)', pt: 'Adjetivos curtos: the + -est (the fastest)' },
      { en: 'Long adjectives: the most + adjective', pt: 'Adjetivos longos: the most + adjetivo' }
    ],
    examples: [
      { en: 'This is the most efficient catalyst', pt: 'Este é o catalisador mais eficiente' }
    ]
  },

  // GERUNDS & INFINITIVES (3 rules)
  {
    id: 'gerunds',
    category: 'verbals',
    title: { en: 'Gerunds (-ing as noun)', pt: 'Gerúndios (-ing como substantivo)' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Verb + -ing used as a noun',
      pt: 'Verbo + -ing usado como substantivo'
    },
    rules: [
      { en: 'After prepositions', pt: 'Após preposições' },
      { en: 'As subject of sentence', pt: 'Como sujeito da frase' },
      { en: 'After certain verbs (enjoy, finish, avoid)', pt: 'Após certos verbos (enjoy, finish, avoid)' }
    ],
    examples: [
      { en: 'Heating the mixture is necessary', pt: 'Aquecer a mistura é necessário' },
      { en: 'We finished testing the samples', pt: 'Terminamos de testar as amostras' }
    ]
  },
  {
    id: 'infinitives',
    category: 'verbals',
    title: { en: 'Infinitives (to + verb)', pt: 'Infinitivos (to + verbo)' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Base verb with "to"',
      pt: 'Verbo base com "to"'
    },
    rules: [
      { en: 'After certain verbs (want, need, plan)', pt: 'Após certos verbos (want, need, plan)' },
      { en: 'To express purpose', pt: 'Para expressar propósito' }
    ],
    examples: [
      { en: 'We need to optimize the process', pt: 'Precisamos otimizar o processo' },
      { en: 'To reduce costs, use recycled materials', pt: 'Para reduzir custos, use materiais reciclados' }
    ]
  },

  // CONJUNCTIONS (2 rules)
  {
    id: 'coordinating-conjunctions',
    category: 'conjunctions',
    title: { en: 'Coordinating Conjunctions', pt: 'Conjunções Coordenativas' },
    difficulty: 'beginner',
    explanation: {
      en: 'Connect equal grammatical elements',
      pt: 'Conectam elementos gramaticais iguais'
    },
    rules: [
      { en: 'FANBOYS: for, and, nor, but, or, yet, so', pt: 'FANBOYS: for, and, nor, but, or, yet, so' }
    ],
    examples: [
      { en: 'The reaction was fast but incomplete', pt: 'A reação foi rápida mas incompleta' }
    ]
  },
  {
    id: 'subordinating-conjunctions',
    category: 'conjunctions',
    title: { en: 'Subordinating Conjunctions', pt: 'Conjunções Subordinativas' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Connect dependent clause to main clause',
      pt: 'Conectam oração dependente à principal'
    },
    rules: [
      { en: 'Examples: because, although, when, if, unless', pt: 'Exemplos: because, although, when, if, unless' }
    ],
    examples: [
      { en: 'Although the cost is high, the efficiency justifies it', pt: 'Embora o custo seja alto, a eficiência justifica' }
    ]
  },

  // QUESTION FORMATION (2 rules)
  {
    id: 'yes-no-questions',
    category: 'questions',
    title: { en: 'Yes/No Questions', pt: 'Perguntas Sim/Não' },
    difficulty: 'beginner',
    explanation: {
      en: 'Questions answered with yes or no',
      pt: 'Perguntas respondidas com sim ou não'
    },
    rules: [
      { en: 'Invert auxiliary + subject', pt: 'Inverta auxiliar + sujeito' },
      { en: 'Use do/does/did for simple tenses', pt: 'Use do/does/did para tempos simples' }
    ],
    examples: [
      { en: 'Is the reaction exothermic?', pt: 'A reação é exotérmica?' },
      { en: 'Did you measure the pH?', pt: 'Você mediu o pH?' }
    ]
  },
  {
    id: 'wh-questions',
    category: 'questions',
    title: { en: 'Wh- Questions', pt: 'Perguntas com Wh-' },
    difficulty: 'beginner',
    explanation: {
      en: 'Questions seeking specific information',
      pt: 'Perguntas buscando informação específica'
    },
    rules: [
      { en: 'Start with: what, where, when, why, who, how', pt: 'Comece com: what, where, when, why, who, how' }
    ],
    examples: [
      { en: 'What causes this reaction?', pt: 'O que causa esta reação?' },
      { en: 'How do you calculate the yield?', pt: 'Como você calcula o rendimento?' }
    ]
  }
];

// Export function to save to file
export const saveGrammarExpansion = () => {
  return expandedGrammarRules;
};

export default expandedGrammarRules;