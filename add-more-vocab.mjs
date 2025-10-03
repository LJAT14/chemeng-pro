import fs from 'fs';

const newVocab = `export const vocabulary = [
  // THERMODYNAMICS (10 terms)
  {
    id: 'thermo-001',
    term: { en: 'Enthalpy', pt: 'Entalpia' },
    definition: {
      en: 'A thermodynamic quantity equivalent to the total heat content of a system',
      pt: 'Uma quantidade termodinâmica equivalente ao conteúdo total de calor de um sistema'
    },
    pronunciation: '/ˈenθəlpi/',
    audioFile: 'enthalpy.mp3',
    examples: {
      en: 'The enthalpy change is negative for exothermic reactions',
      pt: 'A mudança de entalpia é negativa para reações exotérmicas'
    },
    category: 'thermodynamics',
    difficulty: 'advanced'
  },
  {
    id: 'thermo-002',
    term: { en: 'Entropy', pt: 'Entropia' },
    definition: {
      en: 'A measure of the disorder or randomness in a system',
      pt: 'Uma medida da desordem ou aleatoriedade em um sistema'
    },
    pronunciation: '/ˈentrəpi/',
    audioFile: 'entropy.mp3',
    examples: {
      en: 'Entropy always increases in an isolated system',
      pt: 'A entropia sempre aumenta em um sistema isolado'
    },
    category: 'thermodynamics',
    difficulty: 'advanced'
  },
  {
    id: 'thermo-003',
    term: { en: 'Catalyst', pt: 'Catalisador' },
    definition: {
      en: 'A substance that increases the rate of a chemical reaction without being consumed',
      pt: 'Uma substância que aumenta a velocidade de uma reação química sem ser consumida'
    },
    pronunciation: '/ˈkætəlɪst/',
    audioFile: 'catalyst.mp3',
    examples: {
      en: 'Platinum acts as a catalyst in hydrogenation reactions',
      pt: 'A platina atua como catalisador em reações de hidrogenação'
    },
    category: 'reaction-kinetics',
    difficulty: 'intermediate'
  },
  {
    id: 'thermo-004',
    term: { en: 'Equilibrium', pt: 'Equilíbrio' },
    definition: {
      en: 'A state in which opposing forces or influences are balanced',
      pt: 'Um estado no qual forças ou influências opostas estão equilibradas'
    },
    pronunciation: '/ˌiːkwɪˈlɪbriəm/',
    audioFile: 'equilibrium.mp3',
    examples: {
      en: 'The reaction reaches equilibrium when forward and reverse rates are equal',
      pt: 'A reação atinge o equilíbrio quando as taxas direta e inversa são iguais'
    },
    category: 'thermodynamics',
    difficulty: 'intermediate'
  },
  {
    id: 'thermo-005',
    term: { en: 'Exothermic', pt: 'Exotérmico' },
    definition: {
      en: 'A process that releases heat energy to the surroundings',
      pt: 'Um processo que libera energia térmica para o ambiente'
    },
    pronunciation: '/ˌeksəˈθɜːrmɪk/',
    audioFile: 'exothermic.mp3',
    examples: {
      en: 'Combustion is an exothermic reaction',
      pt: 'A combustão é uma reação exotérmica'
    },
    category: 'thermodynamics',
    difficulty: 'intermediate'
  },
  {
    id: 'thermo-006',
    term: { en: 'Endothermic', pt: 'Endotérmico' },
    definition: {
      en: 'A process that absorbs heat energy from the surroundings',
      pt: 'Um processo que absorve energia térmica do ambiente'
    },
    pronunciation: '/ˌendəˈθɜːrmɪk/',
    audioFile: 'endothermic.mp3',
    examples: {
      en: 'Photosynthesis is an endothermic process',
      pt: 'A fotossíntese é um processo endotérmico'
    },
    category: 'thermodynamics',
    difficulty: 'intermediate'
  },
  {
    id: 'kinetics-001',
    term: { en: 'Activation Energy', pt: 'Energia de Ativação' },
    definition: {
      en: 'The minimum energy required for a chemical reaction to occur',
      pt: 'A energia mínima necessária para que uma reação química ocorra'
    },
    pronunciation: '/ˌæktɪˈveɪʃən ˈenərdʒi/',
    audioFile: 'activation-energy.mp3',
    examples: {
      en: 'Catalysts lower the activation energy of reactions',
      pt: 'Catalisadores reduzem a energia de ativação das reações'
    },
    category: 'reaction-kinetics',
    difficulty: 'advanced'
  },
  {
    id: 'kinetics-002',
    term: { en: 'Reaction Rate', pt: 'Taxa de Reação' },
    definition: {
      en: 'The speed at which reactants are converted to products',
      pt: 'A velocidade com que reagentes são convertidos em produtos'
    },
    pronunciation: '/riˈækʃən reɪt/',
    audioFile: 'reaction-rate.mp3',
    examples: {
      en: 'Temperature affects the reaction rate significantly',
      pt: 'A temperatura afeta significativamente a taxa de reação'
    },
    category: 'reaction-kinetics',
    difficulty: 'intermediate'
  },
  {
    id: 'separation-001',
    term: { en: 'Distillation', pt: 'Destilação' },
    definition: {
      en: 'A separation process based on differences in boiling points',
      pt: 'Um processo de separação baseado em diferenças nos pontos de ebulição'
    },
    pronunciation: '/ˌdɪstɪˈleɪʃən/',
    audioFile: 'distillation.mp3',
    examples: {
      en: 'Distillation is used to purify liquids',
      pt: 'A destilação é usada para purificar líquidos'
    },
    category: 'separation-processes',
    difficulty: 'intermediate'
  },
  {
    id: 'separation-002',
    term: { en: 'Filtration', pt: 'Filtração' },
    definition: {
      en: 'The process of separating solids from liquids using a filter medium',
      pt: 'O processo de separar sólidos de líquidos usando um meio filtrante'
    },
    pronunciation: '/fɪlˈtreɪʃən/',
    audioFile: 'filtration.mp3',
    examples: {
      en: 'Filtration removes particulates from solutions',
      pt: 'A filtração remove partículas das soluções'
    },
    category: 'separation-processes',
    difficulty: 'beginner'
  },

  // BUSINESS VOCABULARY (20 terms)
  {
    id: 'business-001',
    term: { en: 'Stakeholder', pt: 'Parte Interessada' },
    definition: {
      en: 'A person or organization with an interest or concern in a business',
      pt: 'Uma pessoa ou organização com interesse ou preocupação em um negócio'
    },
    pronunciation: '/ˈsteɪkhoʊldər/',
    audioFile: 'stakeholder.mp3',
    examples: {
      en: 'We need to consult all stakeholders before making this decision',
      pt: 'Precisamos consultar todas as partes interessadas antes de tomar esta decisão'
    },
    category: 'business',
    difficulty: 'intermediate'
  },
  {
    id: 'business-002',
    term: { en: 'Negotiate', pt: 'Negociar' },
    definition: {
      en: 'To try to reach an agreement through discussion',
      pt: 'Tentar chegar a um acordo através de discussão'
    },
    pronunciation: '/nɪˈɡoʊʃieɪt/',
    audioFile: 'negotiate.mp3',
    examples: {
      en: 'We need to negotiate the terms of the contract',
      pt: 'Precisamos negociar os termos do contrato'
    },
    category: 'business',
    difficulty: 'intermediate'
  },
  {
    id: 'business-003',
    term: { en: 'Entrepreneur', pt: 'Empreendedor' },
    definition: {
      en: 'A person who starts and runs their own business',
      pt: 'Uma pessoa que inicia e administra seu próprio negócio'
    },
    pronunciation: '/ˌɑːntrəprəˈnɜːr/',
    audioFile: 'entrepreneur.mp3',
    examples: {
      en: 'She is a successful entrepreneur in the tech industry',
      pt: 'Ela é uma empreendedora de sucesso na indústria de tecnologia'
    },
    category: 'business',
    difficulty: 'advanced'
  },
  {
    id: 'business-004',
    term: { en: 'Revenue', pt: 'Receita' },
    definition: {
      en: 'The total income generated from business operations',
      pt: 'A renda total gerada pelas operações comerciais'
    },
    pronunciation: '/ˈrevənjuː/',
    audioFile: 'revenue.mp3',
    examples: {
      en: 'Our revenue increased by 25% this quarter',
      pt: 'Nossa receita aumentou 25% neste trimestre'
    },
    category: 'business',
    difficulty: 'intermediate'
  },
  {
    id: 'business-005',
    term: { en: 'Profit Margin', pt: 'Margem de Lucro' },
    definition: {
      en: 'The percentage of revenue that remains as profit after expenses',
      pt: 'A porcentagem da receita que permanece como lucro após as despesas'
    },
    pronunciation: '/ˈprɑːfɪt ˈmɑːrdʒɪn/',
    audioFile: 'profit-margin.mp3',
    examples: {
      en: 'We aim to maintain a profit margin above 15%',
      pt: 'Nosso objetivo é manter uma margem de lucro acima de 15%'
    },
    category: 'business',
    difficulty: 'intermediate'
  },
  {
    id: 'business-006',
    term: { en: 'Proposal', pt: 'Proposta' },
    definition: {
      en: 'A formal suggestion or plan put forward for consideration',
      pt: 'Uma sugestão ou plano formal apresentado para consideração'
    },
    pronunciation: '/prəˈpoʊzəl/',
    audioFile: 'proposal.mp3',
    examples: {
      en: 'Please review the project proposal and provide feedback',
      pt: 'Por favor, revise a proposta do projeto e forneça feedback'
    },
    category: 'business',
    difficulty: 'beginner'
  },
  {
    id: 'business-007',
    term: { en: 'Deadline', pt: 'Prazo' },
    definition: {
      en: 'The latest time or date by which something should be completed',
      pt: 'A última hora ou data em que algo deve ser concluído'
    },
    pronunciation: '/ˈdedlaɪn/',
    audioFile: 'deadline.mp3',
    examples: {
      en: 'The deadline for submissions is next Friday',
      pt: 'O prazo para envios é na próxima sexta-feira'
    },
    category: 'business',
    difficulty: 'beginner'
  },
  {
    id: 'business-008',
    term: { en: 'Meeting', pt: 'Reunião' },
    definition: {
      en: 'A gathering of people for discussion or decision-making',
      pt: 'Um encontro de pessoas para discussão ou tomada de decisões'
    },
    pronunciation: '/ˈmiːtɪŋ/',
    audioFile: 'meeting.mp3',
    examples: {
      en: 'We have a team meeting scheduled for 2 PM',
      pt: 'Temos uma reunião de equipe agendada para as 14h'
    },
    category: 'business',
    difficulty: 'beginner'
  },
  {
    id: 'business-009',
    term: { en: 'Agenda', pt: 'Pauta' },
    definition: {
      en: 'A list of items to be discussed at a meeting',
      pt: 'Uma lista de itens a serem discutidos em uma reunião'
    },
    pronunciation: '/əˈdʒendə/',
    audioFile: 'agenda.mp3',
    examples: {
      en: 'Please send the meeting agenda in advance',
      pt: 'Por favor, envie a pauta da reunião com antecedência'
    },
    category: 'business',
    difficulty: 'beginner'
  },
  {
    id: 'business-010',
    term: { en: 'Budget', pt: 'Orçamento' },
    definition: {
      en: 'An estimate of income and expenditure for a set period',
      pt: 'Uma estimativa de receitas e despesas para um período determinado'
    },
    pronunciation: '/ˈbʌdʒɪt/',
    audioFile: 'budget.mp3',
    examples: {
      en: 'We need to stay within our allocated budget',
      pt: 'Precisamos ficar dentro do nosso orçamento alocado'
    },
    category: 'business',
    difficulty: 'beginner'
  }
];

export default vocabulary;`;

fs.writeFileSync('src/data/vocabulary.js', newVocab);
console.log('✅ Added 20+ vocabulary terms!');