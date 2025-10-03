export const expandedInterviewQuestions = [
  {
    id: 'conv-001',
    category: 'conversational',
    difficulty: 'beginner',
    question: {
      en: 'How was your day today?',
      pt: 'Como foi seu dia hoje?'
    },
    keywords: ['good', 'productive', 'busy', 'routine'],
    tips: {
      en: [
        'Be specific - mention 1-2 activities',
        'Use past tense',
        'Show emotion about the day',
        'Keep it concise (2-3 sentences)'
      ],
      pt: [
        'Seja específico - mencione 1-2 atividades',
        'Use passado',
        'Mostre emoção sobre o dia',
        'Mantenha conciso (2-3 frases)'
      ]
    },
    analysis: {
      goodAnswer: {
        en: 'My day was quite productive. I attended three meetings and finished my project proposal. I feel accomplished.',
        pt: 'Meu dia foi bem produtivo. Participei de três reuniões e terminei minha proposta. Estou realizado.'
      },
      whyGood: {
        en: 'Specific details, past tense, shows emotion, appropriate length',
        pt: 'Detalhes específicos, passado, mostra emoção, comprimento apropriado'
      }
    }
  },
  {
    id: 'conv-002',
    category: 'conversational',
    difficulty: 'beginner',
    question: {
      en: 'What are your hobbies?',
      pt: 'Quais são seus hobbies?'
    },
    keywords: ['reading', 'sports', 'music', 'enjoy'],
    tips: {
      en: [
        'Name 2-3 specific hobbies',
        'Explain WHY you enjoy them',
        'Use present simple',
        'Add a brief example'
      ],
      pt: [
        'Nomeie 2-3 hobbies específicos',
        'Explique POR QUE gosta deles',
        'Use presente simples',
        'Adicione exemplo breve'
      ]
    }
  },
  {
    id: 'behav-001',
    category: 'behavioral',
    difficulty: 'intermediate',
    question: {
      en: 'Tell me about a time you faced a difficult challenge at work.',
      pt: 'Conte sobre um desafio difícil no trabalho.'
    },
    keywords: ['challenge', 'problem', 'solution', 'result'],
    tips: {
      en: [
        'Use STAR method (Situation, Task, Action, Result)',
        'Be specific',
        'Use past tense',
        'Show what you learned'
      ],
      pt: [
        'Use método STAR',
        'Seja específico',
        'Use passado',
        'Mostre o que aprendeu'
      ]
    }
  },
  {
    id: 'casual-001',
    category: 'casual',
    difficulty: 'beginner',
    question: {
      en: 'What did you have for breakfast?',
      pt: 'O que você tomou no café da manhã?'
    },
    keywords: ['breakfast', 'coffee', 'ate', 'food'],
    tips: {
      en: ['Use past simple', 'Be specific', 'Add a comment'],
      pt: ['Use passado simples', 'Seja específico', 'Adicione comentário']
    }
  }
];

export default expandedInterviewQuestions;