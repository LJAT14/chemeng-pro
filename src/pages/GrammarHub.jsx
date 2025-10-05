import React, { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, Award, ChevronRight } from 'lucide-react';

const grammarLessons = [
  {
    id: 1,
    title: 'Technical Present Tense',
    level: 'beginner',
    lesson: `The present simple tense is used to describe processes, facts, and general truths in chemical engineering.

Examples:
- "Heat transfers from hot to cold objects"
- "Catalysts increase reaction rates"
- "Water boils at 100°C at standard pressure"

Use present simple for:
• Scientific facts
• Process descriptions
• General principles
• Equipment functions`,
    exercises: [
      {
        question: 'The reactor ___ (operate) at 200°C.',
        options: ['operate', 'operates', 'operating', 'operated'],
        correct: 1
      },
      {
        question: 'Distillation ___ (separate) liquids based on boiling points.',
        options: ['separate', 'separates', 'separating', 'separated'],
        correct: 1
      },
      {
        question: 'Safety protocols ___ (require) immediate attention.',
        options: ['require', 'requires', 'requiring', 'required'],
        correct: 0
      }
    ]
  },
  {
    id: 2,
    title: 'Passive Voice in Technical Writing',
    level: 'intermediate',
    lesson: `Passive voice is commonly used in technical and scientific writing to focus on the action rather than the actor.

Structure: be + past participle

Examples:
- Active: "We measured the temperature"
- Passive: "The temperature was measured"

- Active: "Engineers design the reactor"
- Passive: "The reactor is designed by engineers"

Use passive when:
• The actor is unknown or unimportant
• Writing formal reports
• Describing procedures
• Emphasizing the action`,
    exercises: [
      {
        question: 'The samples ___ (analyze) in the laboratory yesterday.',
        options: ['analyzed', 'were analyzed', 'are analyzed', 'have analyzed'],
        correct: 1
      },
      {
        question: 'New safety measures ___ (implement) next month.',
        options: ['implement', 'will implement', 'will be implemented', 'implementing'],
        correct: 2
      },
      {
        question: 'The results ___ (publish) in a scientific journal.',
        options: ['publish', 'published', 'will be published', 'publishing'],
        correct: 2
      }
    ]
  },
  {
    id: 3,
    title: 'Conditional Sentences',
    level: 'intermediate',
    lesson: `Conditional sentences express cause-and-effect relationships common in engineering.

Zero Conditional (General truths):
If/When + present simple, present simple
"If you heat water to 100°C, it boils"

First Conditional (Real future possibilities):
If + present simple, will + base verb
"If we increase pressure, the reaction rate will increase"

Second Conditional (Hypothetical):
If + past simple, would + base verb
"If we had unlimited funding, we would upgrade the equipment"`,
    exercises: [
      {
        question: 'If the temperature ___ (exceed) 150°C, the alarm will sound.',
        options: ['exceed', 'exceeds', 'exceeded', 'will exceed'],
        correct: 1
      },
      {
        question: 'The system would fail if we ___ (not monitor) it constantly.',
        options: ['do not monitor', 'did not monitor', 'will not monitor', 'have not monitored'],
        correct: 1
      },
      {
        question: 'If you ___ (add) acid to base, neutralization occurs.',
        options: ['add', 'will add', 'would add', 'added'],
        correct: 0
      }
    ]
  },
  {
    id: 4,
    title: 'Articles (a, an, the)',
    level: 'beginner',
    lesson: `Articles are tricky but essential in technical English.

A/An (indefinite - first mention):
- "A reactor" (any reactor)
- "An engineer" (any engineer)
- Use 'an' before vowel sounds

The (definite - specific/known):
- "The reactor in Building 3" (specific reactor)
- "The process we discussed" (specific process)

No article (generalizations):
- "Engineers work with chemicals" (engineers in general)
- "Safety is important" (safety in general)`,
    exercises: [
      {
        question: '___ catalyst speeds up reactions without being consumed.',
        options: ['A', 'An', 'The', '(no article)'],
        correct: 0
      },
      {
        question: 'We need to repair ___ pump that failed yesterday.',
        options: ['a', 'an', 'the', '(no article)'],
        correct: 2
      },
      {
        question: '___ safety is our top priority in the plant.',
        options: ['A', 'An', 'The', '(no article)'],
        correct: 3
      }
    ]
  },
  {
    id: 5,
    title: 'Modal Verbs (must, should, can)',
    level: 'intermediate',
    lesson: `Modal verbs express necessity, obligation, possibility, and ability.

Must (strong obligation/necessity):
"You must wear safety equipment"
"The temperature must not exceed 200°C"

Should (recommendation/advice):
"You should check pressure regularly"
"We should implement this procedure"

Can (ability/possibility):
"This method can reduce costs"
"Engineers can optimize the process"

May/Might (possibility):
"The reaction may produce byproducts"`,
    exercises: [
      {
        question: 'Workers ___ wear protective gear in the lab.',
        options: ['can', 'must', 'may', 'should'],
        correct: 1
      },
      {
        question: 'We ___ consider alternative methods to improve efficiency.',
        options: ['can', 'must', 'should', 'will'],
        correct: 2
      },
      {
        question: 'This equipment ___ handle pressures up to 500 psi.',
        options: ['can', 'must', 'should', 'may'],
        correct: 0
      }
    ]
  },
  {
    id: 6,
    title: 'Prepositions of Process',
    level: 'advanced',
    lesson: `Prepositions are critical in describing processes and relationships.

Common patterns:
- "at" + temperature/pressure: "at 100°C", "at 2 atm"
- "by" + method: "separated by distillation"
- "through" + process: "flows through the pipe"
- "into/from" + transformation: "converted into energy"
- "in" + location/time: "in the reactor", "in 5 minutes"

Examples:
"The mixture is heated AT 200°C FOR 2 hours"
"The liquid passes THROUGH the column"
"Energy is converted FROM heat INTO electricity"`,
    exercises: [
      {
        question: 'The reaction occurs ___ a temperature of 150°C.',
        options: ['in', 'at', 'on', 'by'],
        correct: 1
      },
      {
        question: 'The substance is separated ___ filtration.',
        options: ['with', 'by', 'through', 'from'],
        correct: 1
      },
      {
        question: 'The gas flows ___ the pipe into the condenser.',
        options: ['by', 'at', 'through', 'from'],
        correct: 2
      }
    ]
  }
];

const GrammarHub = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentExercise] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextExercise = () => {
    if (currentExercise < selectedLesson.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedLesson.exercises.forEach((ex, idx) => {
      if (userAnswers[idx] === ex.correct) correct++;
    });
    setScore(correct);
    setShowResults(true);
  };

  const resetLesson = () => {
    setSelectedLesson(null);
    setCurrentExercise(0);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Grammar Hub</h1>
          <p className="text-gray-300">Master English grammar for technical communication</p>
        </div>

        {!selectedLesson ? (
          <>
            {/* Lesson Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grammarLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500 transition-all text-left"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{lesson.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        lesson.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        lesson.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {lesson.level}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {lesson.exercises.length} exercises
                  </p>

                  <div className="flex items-center text-purple-400 font-medium text-sm group-hover:gap-2 gap-1 transition-all">
                    Start Lesson
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            {!showResults ? (
              <>
                {/* Lesson Content */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
                  <h2 className="text-3xl font-bold text-white mb-4">{selectedLesson.title}</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 whitespace-pre-line">{selectedLesson.lesson}</p>
                  </div>
                </div>

                {/* Exercise */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      Exercise {currentExercise + 1} of {selectedLesson.exercises.length}
                    </h3>
                    <div className="text-gray-400 text-sm">
                      {userAnswers.filter(a => a !== undefined).length} / {selectedLesson.exercises.length} answered
                    </div>
                  </div>

                  <p className="text-xl text-white mb-6">
                    {selectedLesson.exercises[currentExercise].question}
                  </p>

                  <div className="space-y-3 mb-6">
                    {selectedLesson.exercises[currentExercise].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          userAnswers[currentExercise] === idx
                            ? 'bg-purple-600 text-white border-2 border-purple-400'
                            : 'bg-white/5 text-gray-300 border-2 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}. {option}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={nextExercise}
                      disabled={userAnswers[currentExercise] === undefined}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all"
                    >
                      {currentExercise < selectedLesson.exercises.length - 1 ? 'Next' : 'Finish'}
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <button
                      onClick={resetLesson}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all"
                    >
                      Exit
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
                <p className="text-4xl font-bold text-purple-400 mb-6">
                  {score} / {selectedLesson.exercises.length}
                </p>
                <p className="text-gray-300 mb-8">
                  {score === selectedLesson.exercises.length ? 'Perfect score! Excellent work!' :
                   score >= selectedLesson.exercises.length * 0.7 ? 'Great job! Keep practicing!' :
                   'Good effort! Review the lesson and try again.'}
                </p>

                {/* Review Answers */}
                <div className="text-left mb-8 space-y-4">
                  {selectedLesson.exercises.map((ex, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-4">
                      <p className="text-white mb-2">{ex.question}</p>
                      <div className="flex items-center gap-2">
                        {userAnswers[idx] === ex.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={userAnswers[idx] === ex.correct ? 'text-green-400' : 'text-red-400'}>
                          Your answer: {ex.options[userAnswers[idx]]}
                        </span>
                      </div>
                      {userAnswers[idx] !== ex.correct && (
                        <p className="text-green-400 text-sm mt-1">
                          Correct: {ex.options[ex.correct]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetLesson}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-all"
                >
                  Back to Lessons
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarHub;
 