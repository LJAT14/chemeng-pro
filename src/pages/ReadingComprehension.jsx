// src/pages/ReadingComprehension.jsx
import React, { useState } from 'react';
import { Headphones, Play, Pause, CheckCircle, XCircle, Award, Volume2 } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { speakText, stopSpeaking } from '../services/elevenLabsTTS';

const readingArticles = [
  {
    id: 1,
    title: 'Green Chemistry and Sustainable Processes',
    level: 'intermediate',
    category: 'Environmental',
    text: `Green chemistry, also known as sustainable chemistry, is an area of chemistry and chemical engineering focused on the design of products and processes that minimize the use and generation of hazardous substances. The concept emerged in the 1990s as industries recognized the need to reduce environmental impact.

The twelve principles of green chemistry guide researchers and engineers in developing more sustainable processes. These principles include preventing waste, designing safer chemicals, using renewable feedstocks, and increasing energy efficiency. For example, pharmaceutical companies now use enzymatic catalysis instead of traditional metal catalysts, reducing toxic waste significantly.

One major success story is the development of bio-based plastics. Traditional plastics are derived from petroleum, a non-renewable resource. However, new materials like polylactic acid (PLA) are produced from corn starch or sugarcane, making them biodegradable and renewable. Companies worldwide are investing in these alternatives to reduce their carbon footprint.

Despite progress, challenges remain. Green alternatives often cost more than conventional methods, making large-scale adoption difficult. Additionally, some "green" processes require more energy, offsetting environmental benefits. Researchers continue working to make sustainable chemistry both environmentally friendly and economically viable.`,
    audioText: 'Green chemistry, also known as sustainable chemistry, is an area of chemistry focused on designing products and processes that minimize hazardous substances.',
    questions: [
      {
        question: 'When did the concept of green chemistry emerge?',
        options: ['1980s', '1990s', '2000s', '2010s'],
        correct: 1
      },
      {
        question: 'What is PLA produced from?',
        options: ['Petroleum', 'Natural gas', 'Corn starch or sugarcane', 'Coal'],
        correct: 2
      },
      {
        question: 'What is a major challenge for green chemistry adoption?',
        options: ['Lack of research', 'Higher costs', 'Government regulations', 'Public opposition'],
        correct: 1
      },
      {
        question: 'What do pharmaceutical companies now use instead of metal catalysts?',
        options: ['Plastic catalysts', 'Enzymatic catalysis', 'Heat treatment', 'Chemical solvents'],
        correct: 1
      }
    ]
  },
  {
    id: 2,
    title: 'Nanotechnology in Chemical Engineering',
    level: 'advanced',
    category: 'Technology',
    text: `Nanotechnology represents a revolutionary approach in chemical engineering, operating at the molecular and atomic scale. At the nanoscale, materials exhibit unique properties different from their bulk counterparts, opening new possibilities for innovation.

In catalysis, nanoparticles provide significantly higher surface area compared to traditional catalysts, dramatically increasing reaction efficiency. Gold nanoparticles, typically inert in bulk form, become highly reactive at the nanoscale and are now used in pollution control and hydrogen production. This demonstrates how scale fundamentally changes material behavior.

The pharmaceutical industry has embraced nanotechnology for drug delivery systems. Nanocarriers can target specific cells, reducing side effects and improving treatment efficacy. For instance, cancer treatments using nanoparticles can deliver medication directly to tumor cells while sparing healthy tissue, a major advancement over conventional chemotherapy.

However, nanotechnology raises safety concerns. The same properties that make nanomaterials useful may also pose health risks. Studies suggest some nanoparticles can cross cell membranes and accumulate in organs. Regulatory frameworks are still developing to address these concerns while fostering innovation.

Future applications include self-cleaning surfaces, advanced water filtration, and more efficient solar cells. As research progresses, nanotechnology will likely transform multiple industries, though responsible development remains crucial.`,
    audioText: 'Nanotechnology represents a revolutionary approach in chemical engineering, operating at the molecular and atomic scale where materials exhibit unique properties.',
    questions: [
      {
        question: 'Why are nanoparticles effective as catalysts?',
        options: ['They are cheaper', 'Higher surface area', 'Easier to produce', 'More stable'],
        correct: 1
      },
      {
        question: 'How do nanocarriers improve cancer treatment?',
        options: ['Target specific cells', 'Cost less', 'Work faster', 'Taste better'],
        correct: 0
      },
      {
        question: 'What safety concern is mentioned about nanoparticles?',
        options: ['Explosion risk', 'High cost', 'Can cross cell membranes', 'Environmental pollution'],
        correct: 2
      },
      {
        question: 'Gold nanoparticles are used in:',
        options: ['Food production', 'Pollution control', 'Building materials', 'Textile manufacturing'],
        correct: 1
      }
    ]
  },
  {
    id: 3,
    title: 'Process Safety Management',
    level: 'beginner',
    category: 'Safety',
    text: `Process safety management is critical in chemical engineering to prevent accidents and protect workers, communities, and the environment. Unlike personal safety, which focuses on individual protection, process safety addresses large-scale hazards inherent in chemical processes.

The foundation of process safety is hazard identification. Engineers must identify potential dangers such as toxic releases, fires, and explosions before they occur. Common tools include Hazard and Operability Studies (HAZOP) and Failure Mode and Effects Analysis (FMEA). These systematic approaches examine each component of a process to find vulnerabilities.

Once hazards are identified, multiple layers of protection are implemented. This concept, known as the "Swiss cheese model," assumes no single safeguard is perfect. Instead, several independent protective layers work together. If one fails, others remain to prevent incidents. Layers include proper equipment design, safety instrumented systems, emergency response plans, and regular training.

Major accidents like Bhopal (1984) and the BP Texas City refinery explosion (2005) highlighted the consequences of inadequate process safety. These disasters killed hundreds and caused billions in damages. In response, regulations became stricter, and companies invested heavily in safety management systems.

Today, chemical plants use advanced monitoring systems and artificial intelligence to predict and prevent failures. Despite technological progress, human factors remain crucial. Effective safety culture, where every employee prioritizes safety, is essential for preventing accidents.`,
    audioText: 'Process safety management is critical in chemical engineering to prevent accidents and protect workers, communities, and the environment.',
    questions: [
      {
        question: 'What does HAZOP stand for?',
        options: ['Hazard Analysis', 'Hazard and Operability Studies', 'Hazardous Operations', 'Hazard Prevention'],
        correct: 1
      },
      {
        question: 'What is the "Swiss cheese model"?',
        options: ['A type of equipment', 'Multiple layers of protection', 'A safety training method', 'An emergency plan'],
        correct: 1
      },
      {
        question: 'When did the Bhopal disaster occur?',
        options: ['1974', '1984', '1994', '2004'],
        correct: 1
      },
      {
        question: 'What is essential for preventing accidents according to the text?',
        options: ['Expensive equipment', 'Government regulations', 'Effective safety culture', 'Insurance policies'],
        correct: 2
      }
    ]
  },
  {
    id: 4,
    title: 'Renewable Energy and Chemical Engineering',
    level: 'intermediate',
    category: 'Energy',
    text: `Chemical engineers play a vital role in developing renewable energy technologies. As the world transitions away from fossil fuels, innovative chemical processes are needed to harness solar, wind, and biomass energy efficiently.

Biofuels represent one significant area where chemical engineering expertise is essential. Converting biomass like corn, sugarcane, or algae into ethanol or biodiesel requires sophisticated chemical processes. Second-generation biofuels use non-food crops and agricultural waste, addressing concerns about food security. However, breaking down cellulose from plant material remains technically challenging and expensive.

Hydrogen is emerging as a clean fuel alternative. Chemical engineers are developing efficient methods to produce hydrogen through water electrolysis powered by renewable electricity. The challenge lies in storing and transporting hydrogen safely and economically. New materials and processes are being researched to make hydrogen a viable fuel for vehicles and power generation.

Battery technology is another crucial area. Lithium-ion batteries dominate the market, but their production requires rare materials and poses environmental concerns. Chemical engineers are exploring alternatives like solid-state batteries and flow batteries that could be safer, cheaper, and more sustainable.

Carbon capture and storage (CCS) technology offers a way to reduce emissions from existing power plants. Chemical engineers design absorption systems that capture CO2 from exhaust gases before release. The captured carbon can be stored underground or used in manufacturing processes. While promising, CCS remains expensive and energy-intensive, limiting widespread adoption.`,
    audioText: 'Chemical engineers play a vital role in developing renewable energy technologies as the world transitions away from fossil fuels.',
    questions: [
      {
        question: 'What do second-generation biofuels use?',
        options: ['Corn only', 'Non-food crops and waste', 'Petroleum', 'Natural gas'],
        correct: 1
      },
      {
        question: 'What is the main challenge with hydrogen fuel?',
        options: ['Production cost', 'Storage and transport', 'Environmental impact', 'Energy efficiency'],
        correct: 1
      },
      {
        question: 'What does CCS stand for?',
        options: ['Chemical Capture System', 'Carbon Capture and Storage', 'Clean Coal Solution', 'Carbon Control System'],
        correct: 1
      },
      {
        question: 'What limits CCS adoption?',
        options: ['Lack of research', 'Expensive and energy-intensive', 'Government bans', 'Public opposition'],
        correct: 1
      }
    ]
  }
];

const ReadingComprehension = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const playAudio = () => {
    if (!selectedArticle) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(selectedArticle.text);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en-')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (questionIdx, answerIdx) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIdx] = answerIdx;
    setUserAnswers(newAnswers);
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const resetArticle = () => {
    setSelectedArticle(null);
    setUserAnswers([]);
    setShowResults(false);
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedArticle.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) correct++;
    });
    return correct;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Reading Comprehension</h1>
          <p className="text-gray-300">Read technical articles and test your understanding</p>
        </div>

        {!selectedArticle ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {readingArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500 transition-all text-left"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-xl mb-2">{article.title}</h3>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        article.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        article.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {article.level}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                        {article.category}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{article.questions.length} questions</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {!showResults ? (
              <>
                {/* Article */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
                  <h2 className="text-3xl font-bold text-white mb-4">{selectedArticle.title}</h2>
                  
                  {/* Audio Controls */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-lg">
                    <button
                      onClick={playAudio}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      {isPlaying ? 'Pause' : 'Listen'}
                    </button>

                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300 text-sm">Speed:</span>
                      {[0.75, 1.0, 1.25].map(speed => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-3 py-1 rounded transition-all text-sm ${
                            playbackSpeed === speed
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">{selectedArticle.text}</p>
                  </div>
                </div>

                {/* Questions */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">Comprehension Questions</h3>

                  <div className="space-y-6">
                    {selectedArticle.questions.map((q, qIdx) => (
                      <div key={qIdx} className="bg-white/5 rounded-lg p-6">
                        <p className="text-white font-semibold mb-4">{qIdx + 1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((option, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleAnswer(qIdx, oIdx)}
                              className={`w-full text-left p-3 rounded-lg transition-all ${
                                userAnswers[qIdx] === oIdx
                                  ? 'bg-purple-600 text-white border-2 border-purple-400'
                                  : 'bg-white/5 text-gray-300 border-2 border-white/10 hover:border-white/30'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={submitAnswers}
                      disabled={userAnswers.length !== selectedArticle.questions.length}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all"
                    >
                      Submit Answers
                    </button>

                    <button
                      onClick={resetArticle}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all"
                    >
                      Back to Articles
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Results</h2>
                <p className="text-4xl font-bold text-purple-400 mb-6">
                  {calculateScore()} / {selectedArticle.questions.length}
                </p>

                {/* Review */}
                <div className="text-left space-y-4 mb-8">
                  {selectedArticle.questions.map((q, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-4">
                      <p className="text-white mb-2">{idx + 1}. {q.question}</p>
                      <div className="flex items-center gap-2">
                        {userAnswers[idx] === q.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={userAnswers[idx] === q.correct ? 'text-green-400' : 'text-red-400'}>
                          Your answer: {q.options[userAnswers[idx]]}
                        </span>
                      </div>
                      {userAnswers[idx] !== q.correct && (
                        <p className="text-green-400 text-sm mt-1">
                          Correct: {q.options[q.correct]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetArticle}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-all"
                >
                  Try Another Article
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingComprehension;