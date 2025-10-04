// src/data/interviewQuestions.js
// This file contains properly formatted questions for AIInterviewChat component

export const interviewQuestions = {
  // Technical Roles
  'chemical-engineer': [
    {
      id: 'chem-1',
      question: {
        en: 'Describe your experience with process design and optimization.',
        pt: 'Descreva sua experiência com projeto e otimização de processos.'
      },
      category: 'technical'
    },
    {
      id: 'chem-2',
      question: {
        en: "How do you approach troubleshooting a reactor that's not meeting specifications?",
        pt: 'Como você aborda a solução de problemas de um reator que não está atendendo às especificações?'
      },
      category: 'technical'
    },
    {
      id: 'chem-3',
      question: {
        en: "Explain the principles of distillation and when you'd use it.",
        pt: 'Explique os princípios da destilação e quando você a usaria.'
      },
      category: 'technical'
    },
    {
      id: 'chem-4',
      question: {
        en: 'What safety protocols do you follow when working with hazardous materials?',
        pt: 'Quais protocolos de segurança você segue ao trabalhar com materiais perigosos?'
      },
      category: 'safety'
    },
    {
      id: 'chem-5',
      question: {
        en: 'Tell me about a time you improved process efficiency.',
        pt: 'Conte-me sobre uma vez que você melhorou a eficiência do processo.'
      },
      category: 'behavioral'
    },
    {
      id: 'chem-6',
      question: {
        en: 'How do you perform mass and energy balances?',
        pt: 'Como você realiza balanços de massa e energia?'
      },
      category: 'technical'
    },
    {
      id: 'chem-7',
      question: {
        en: 'What is your experience with process simulation software like Aspen Plus or HYSYS?',
        pt: 'Qual é sua experiência com software de simulação de processos como Aspen Plus ou HYSYS?'
      },
      category: 'technical'
    },
    {
      id: 'chem-8',
      question: {
        en: 'Describe a challenging chemical engineering project you have worked on.',
        pt: 'Descreva um projeto desafiador de engenharia química em que você trabalhou.'
      },
      category: 'behavioral'
    }
  ],

  'process-engineer': [
    {
      id: 'proc-1',
      question: {
        en: 'How do you optimize existing processes for better efficiency?',
        pt: 'Como você otimiza processos existentes para melhor eficiência?'
      },
      category: 'technical'
    },
    {
      id: 'proc-2',
      question: {
        en: 'Describe your experience with heat exchangers and their design.',
        pt: 'Descreva sua experiência com trocadores de calor e seu projeto.'
      },
      category: 'technical'
    },
    {
      id: 'proc-3',
      question: {
        en: 'What tools do you use for process flow diagrams?',
        pt: 'Quais ferramentas você usa para diagramas de fluxo de processo?'
      },
      category: 'technical'
    },
    {
      id: 'proc-4',
      question: {
        en: 'Tell me about a time you reduced production costs.',
        pt: 'Conte-me sobre uma vez que você reduziu custos de produção.'
      },
      category: 'behavioral'
    },
    {
      id: 'proc-5',
      question: {
        en: 'How do you handle process deviations?',
        pt: 'Como você lida com desvios de processo?'
      },
      category: 'technical'
    },
    {
      id: 'proc-6',
      question: {
        en: 'What is your experience with Six Sigma or Lean methodologies?',
        pt: 'Qual é sua experiência com metodologias Six Sigma ou Lean?'
      },
      category: 'technical'
    }
  ],

  'software-engineer': [
    {
      id: 'soft-1',
      question: {
        en: 'Describe your experience with full-stack development.',
        pt: 'Descreva sua experiência com desenvolvimento full-stack.'
      },
      category: 'technical'
    },
    {
      id: 'soft-2',
      question: {
        en: 'How do you approach debugging a complex system issue?',
        pt: 'Como você aborda a depuração de um problema de sistema complexo?'
      },
      category: 'technical'
    },
    {
      id: 'soft-3',
      question: {
        en: 'What is your preferred tech stack and why?',
        pt: 'Qual é sua pilha de tecnologia preferida e por quê?'
      },
      category: 'technical'
    },
    {
      id: 'soft-4',
      question: {
        en: 'Tell me about a time you optimized application performance.',
        pt: 'Conte-me sobre uma vez que você otimizou o desempenho de uma aplicação.'
      },
      category: 'behavioral'
    },
    {
      id: 'soft-5',
      question: {
        en: 'How do you ensure code quality in your projects?',
        pt: 'Como você garante a qualidade do código em seus projetos?'
      },
      category: 'technical'
    }
  ],

  'data-scientist': [
    {
      id: 'data-1',
      question: {
        en: 'Describe your experience with machine learning models.',
        pt: 'Descreva sua experiência com modelos de aprendizado de máquina.'
      },
      category: 'technical'
    },
    {
      id: 'data-2',
      question: {
        en: 'How do you handle missing or incomplete data?',
        pt: 'Como você lida com dados ausentes ou incompletos?'
      },
      category: 'technical'
    },
    {
      id: 'data-3',
      question: {
        en: 'What is your approach to feature engineering?',
        pt: 'Qual é sua abordagem para engenharia de características?'
      },
      category: 'technical'
    },
    {
      id: 'data-4',
      question: {
        en: 'Tell me about a data analysis project you are proud of.',
        pt: 'Conte-me sobre um projeto de análise de dados de que você se orgulha.'
      },
      category: 'behavioral'
    }
  ],

  'project-manager': [
    {
      id: 'pm-1',
      question: {
        en: 'How do you prioritize tasks when everything is high priority?',
        pt: 'Como você prioriza tarefas quando tudo é alta prioridade?'
      },
      category: 'behavioral'
    },
    {
      id: 'pm-2',
      question: {
        en: 'Describe your experience managing cross-functional teams.',
        pt: 'Descreva sua experiência gerenciando equipes multifuncionais.'
      },
      category: 'behavioral'
    },
    {
      id: 'pm-3',
      question: {
        en: 'How do you handle project delays or setbacks?',
        pt: 'Como você lida com atrasos ou contratempos de projeto?'
      },
      category: 'behavioral'
    },
    {
      id: 'pm-4',
      question: {
        en: 'What project management methodologies do you prefer?',
        pt: 'Quais metodologias de gerenciamento de projetos você prefere?'
      },
      category: 'technical'
    }
  ],

  'team-lead': [
    {
      id: 'lead-1',
      question: {
        en: 'How do you delegate tasks effectively?',
        pt: 'Como você delega tarefas efetivamente?'
      },
      category: 'behavioral'
    },
    {
      id: 'lead-2',
      question: {
        en: 'Describe a time you resolved a conflict within your team.',
        pt: 'Descreva uma vez que você resolveu um conflito dentro de sua equipe.'
      },
      category: 'behavioral'
    },
    {
      id: 'lead-3',
      question: {
        en: 'How do you provide constructive feedback?',
        pt: 'Como você fornece feedback construtivo?'
      },
      category: 'behavioral'
    }
  ],

  'business-analyst': [
    {
      id: 'ba-1',
      question: {
        en: 'How do you gather and document requirements?',
        pt: 'Como você coleta e documenta requisitos?'
      },
      category: 'technical'
    },
    {
      id: 'ba-2',
      question: {
        en: 'Describe your experience with process improvement.',
        pt: 'Descreva sua experiência com melhoria de processos.'
      },
      category: 'behavioral'
    },
    {
      id: 'ba-3',
      question: {
        en: 'How do you handle conflicting stakeholder requirements?',
        pt: 'Como você lida com requisitos conflitantes de partes interessadas?'
      },
      category: 'behavioral'
    }
  ],

  'product-manager': [
    {
      id: 'prod-1',
      question: {
        en: 'How do you prioritize features in a product roadmap?',
        pt: 'Como você prioriza recursos em um roteiro de produto?'
      },
      category: 'technical'
    },
    {
      id: 'prod-2',
      question: {
        en: 'Describe your experience with user research.',
        pt: 'Descreva sua experiência com pesquisa de usuário.'
      },
      category: 'behavioral'
    }
  ],

  'general-professional': [
    {
      id: 'gen-1',
      question: {
        en: 'Tell me about yourself and your background.',
        pt: 'Fale-me sobre você e seu histórico.'
      },
      category: 'conversational'
    },
    {
      id: 'gen-2',
      question: {
        en: 'What are your career goals for the next 5 years?',
        pt: 'Quais são seus objetivos de carreira para os próximos 5 anos?'
      },
      category: 'conversational'
    },
    {
      id: 'gen-3',
      question: {
        en: 'Why are you interested in this field?',
        pt: 'Por que você está interessado neste campo?'
      },
      category: 'conversational'
    },
    {
      id: 'gen-4',
      question: {
        en: 'What is your biggest professional achievement?',
        pt: 'Qual é sua maior conquista profissional?'
      },
      category: 'behavioral'
    },
    {
      id: 'gen-5',
      question: {
        en: 'How do you handle workplace challenges?',
        pt: 'Como você lida com desafios no local de trabalho?'
      },
      category: 'behavioral'
    }
  ],

  'casual-conversation': [
    {
      id: 'casual-1',
      question: {
        en: 'What do you enjoy doing in your free time?',
        pt: 'O que você gosta de fazer no seu tempo livre?'
      },
      category: 'conversational'
    },
    {
      id: 'casual-2',
      question: {
        en: 'Tell me about a book or article you read recently.',
        pt: 'Conte-me sobre um livro ou artigo que você leu recentemente.'
      },
      category: 'conversational'
    },
    {
      id: 'casual-3',
      question: {
        en: 'What is something interesting you have learned lately?',
        pt: 'O que é algo interessante que você aprendeu ultimamente?'
      },
      category: 'conversational'
    },
    {
      id: 'casual-4',
      question: {
        en: 'How do you stay motivated and productive?',
        pt: 'Como você se mantém motivado e produtivo?'
      },
      category: 'conversational'
    }
  ],

  'behavioral-interview': [
    {
      id: 'beh-1',
      question: {
        en: 'Tell me about a time you had to work with a difficult colleague.',
        pt: 'Conte-me sobre uma vez que você teve que trabalhar com um colega difícil.'
      },
      category: 'behavioral'
    },
    {
      id: 'beh-2',
      question: {
        en: 'Describe a situation where you had to meet a tight deadline.',
        pt: 'Descreva uma situação em que você teve que cumprir um prazo apertado.'
      },
      category: 'behavioral'
    },
    {
      id: 'beh-3',
      question: {
        en: 'How do you handle criticism?',
        pt: 'Como você lida com críticas?'
      },
      category: 'behavioral'
    },
    {
      id: 'beh-4',
      question: {
        en: 'Tell me about a time you showed leadership.',
        pt: 'Conte-me sobre uma vez que você demonstrou liderança.'
      },
      category: 'behavioral'
    }
  ],

  'student-intern': [
    {
      id: 'student-1',
      question: {
        en: 'What interests you about this field of study or work?',
        pt: 'O que te interessa neste campo de estudo ou trabalho?'
      },
      category: 'conversational'
    },
    {
      id: 'student-2',
      question: {
        en: 'Describe a challenging course or project you have completed.',
        pt: 'Descreva um curso ou projeto desafiador que você completou.'
      },
      category: 'behavioral'
    },
    {
      id: 'student-3',
      question: {
        en: 'How do you balance academics with other activities?',
        pt: 'Como você equilibra acadêmicos com outras atividades?'
      },
      category: 'conversational'
    },
    {
      id: 'student-4',
      question: {
        en: 'What skills from your studies are you eager to apply?',
        pt: 'Quais habilidades de seus estudos você está ansioso para aplicar?'
      },
      category: 'conversational'
    }
  ]
};

export default interviewQuestions;