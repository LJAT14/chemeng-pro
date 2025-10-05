// src/pages/VocabularyBuilder.jsx
import React, { useState } from 'react';
import { BookOpen, Volume2, CheckCircle, XCircle, Star, Play } from 'lucide-react';

const vocabularyData = [
  // Process Equipment (15)
  { id: 1, term: 'Heat Exchanger', definition: 'Device that transfers heat between fluids', example: 'The heat exchanger cools the product stream', category: 'equipment', difficulty: 'beginner' },
  { id: 2, term: 'Distillation Column', definition: 'Equipment that separates liquid mixtures based on boiling points', example: 'Crude oil is separated in a distillation column', category: 'equipment', difficulty: 'beginner' },
  { id: 3, term: 'Reactor', definition: 'Vessel where chemical reactions occur', example: 'The reactor operates at 200°C and 5 bar pressure', category: 'equipment', difficulty: 'beginner' },
  { id: 4, term: 'Pump', definition: 'Device that moves fluids by mechanical action', example: 'The centrifugal pump transfers liquid to the storage tank', category: 'equipment', difficulty: 'beginner' },
  { id: 5, term: 'Compressor', definition: 'Machine that increases gas pressure', example: 'The compressor raises pressure from 1 to 10 bar', category: 'equipment', difficulty: 'beginner' },
  { id: 6, term: 'Separator', definition: 'Equipment that divides mixtures into components', example: 'The separator removes water from the oil phase', category: 'equipment', difficulty: 'beginner' },
  { id: 7, term: 'Evaporator', definition: 'Device that removes solvent by vaporization', example: 'The evaporator concentrates the solution', category: 'equipment', difficulty: 'intermediate' },
  { id: 8, term: 'Crystallizer', definition: 'Equipment that produces solid crystals from solution', example: 'Salt is recovered using a crystallizer', category: 'equipment', difficulty: 'intermediate' },
  { id: 9, term: 'Filtration Unit', definition: 'System that separates solids from liquids', example: 'The filtration unit removes particles from the process stream', category: 'equipment', difficulty: 'beginner' },
  { id: 10, term: 'Condenser', definition: 'Device that cools vapor to liquid', example: 'The condenser liquefies the overhead vapor', category: 'equipment', difficulty: 'beginner' },
  { id: 11, term: 'Centrifuge', definition: 'Equipment using rotation to separate materials', example: 'The centrifuge separates solids by density', category: 'equipment', difficulty: 'intermediate' },
  { id: 12, term: 'Dryer', definition: 'Equipment that removes moisture', example: 'The rotary dryer reduces water content to 2%', category: 'equipment', difficulty: 'beginner' },
  { id: 13, term: 'Mixer', definition: 'Device that blends materials uniformly', example: 'The static mixer ensures homogeneous product', category: 'equipment', difficulty: 'beginner' },
  { id: 14, term: 'Absorption Tower', definition: 'Column where gas contacts liquid for mass transfer', example: 'CO2 is removed in the absorption tower', category: 'equipment', difficulty: 'intermediate' },
  { id: 15, term: 'Extraction Unit', definition: 'Equipment that separates using solvent', example: 'Caffeine is removed by solvent extraction', category: 'equipment', difficulty: 'intermediate' },

  // Chemical Processes (15)
  { id: 16, term: 'Polymerization', definition: 'Reaction where monomers combine to form polymers', example: 'Polymerization of ethylene produces polyethylene', category: 'processes', difficulty: 'intermediate' },
  { id: 17, term: 'Catalysis', definition: 'Process acceleration using a catalyst', example: 'Platinum catalysis speeds up the hydrogenation', category: 'processes', difficulty: 'intermediate' },
  { id: 18, term: 'Oxidation', definition: 'Chemical reaction involving oxygen addition', example: 'Oxidation of ethanol produces acetic acid', category: 'processes', difficulty: 'beginner' },
  { id: 19, term: 'Reduction', definition: 'Chemical reaction removing oxygen or adding hydrogen', example: 'Iron ore reduction produces metallic iron', category: 'processes', difficulty: 'beginner' },
  { id: 20, term: 'Hydrogenation', definition: 'Addition of hydrogen to unsaturated compounds', example: 'Vegetable oil hydrogenation creates margarine', category: 'processes', difficulty: 'intermediate' },
  { id: 21, term: 'Esterification', definition: 'Reaction of acid and alcohol forming ester', example: 'Esterification produces biodiesel from vegetable oil', category: 'processes', difficulty: 'intermediate' },
  { id: 22, term: 'Neutralization', definition: 'Reaction between acid and base', example: 'Neutralization of sulfuric acid requires sodium hydroxide', category: 'processes', difficulty: 'beginner' },
  { id: 23, term: 'Fermentation', definition: 'Biological process converting sugars to products', example: 'Yeast fermentation produces ethanol', category: 'processes', difficulty: 'beginner' },
  { id: 24, term: 'Cracking', definition: 'Breaking large molecules into smaller ones', example: 'Catalytic cracking produces gasoline from heavy oil', category: 'processes', difficulty: 'intermediate' },
  { id: 25, term: 'Isomerization', definition: 'Rearrangement of molecular structure', example: 'Isomerization improves octane rating of gasoline', category: 'processes', difficulty: 'advanced' },
  { id: 26, term: 'Precipitation', definition: 'Formation of solid from solution', example: 'Silver chloride precipitation confirms chloride presence', category: 'processes', difficulty: 'beginner' },
  { id: 27, term: 'Adsorption', definition: 'Molecules adhering to a surface', example: 'Activated carbon adsorption removes impurities', category: 'processes', difficulty: 'intermediate' },
  { id: 28, term: 'Crystallization', definition: 'Formation of solid crystals from solution', example: 'Sugar crystallization produces table sugar', category: 'processes', difficulty: 'beginner' },
  { id: 29, term: 'Pyrolysis', definition: 'Thermal decomposition in absence of oxygen', example: 'Biomass pyrolysis produces bio-oil', category: 'processes', difficulty: 'advanced' },
  { id: 30, term: 'Electrolysis', definition: 'Chemical decomposition using electricity', example: 'Water electrolysis produces hydrogen and oxygen', category: 'processes', difficulty: 'intermediate' },

  // Properties & Parameters (20)
  { id: 31, term: 'Viscosity', definition: 'Resistance to flow', example: 'High viscosity fluids require stronger pumps', category: 'properties', difficulty: 'beginner' },
  { id: 32, term: 'Density', definition: 'Mass per unit volume', example: 'Water density is 1000 kg/m³', category: 'properties', difficulty: 'beginner' },
  { id: 33, term: 'pH', definition: 'Measure of acidity or alkalinity', example: 'Neutral pH is 7.0', category: 'properties', difficulty: 'beginner' },
  { id: 34, term: 'Boiling Point', definition: 'Temperature at which liquid becomes vapor', example: 'Water boiling point is 100°C at 1 atm', category: 'properties', difficulty: 'beginner' },
  { id: 35, term: 'Melting Point', definition: 'Temperature at which solid becomes liquid', example: 'Ice melting point is 0°C', category: 'properties', difficulty: 'beginner' },
  { id: 36, term: 'Solubility', definition: 'Maximum amount that dissolves in solvent', example: 'Salt solubility increases with temperature', category: 'properties', difficulty: 'beginner' },
  { id: 37, term: 'Enthalpy', definition: 'Total heat content of system', example: 'Enthalpy change indicates heat absorbed or released', category: 'properties', difficulty: 'intermediate' },
  { id: 38, term: 'Entropy', definition: 'Measure of disorder in system', example: 'Entropy increases during mixing', category: 'properties', difficulty: 'intermediate' },
  { id: 39, term: 'Yield', definition: 'Amount of product obtained from reaction', example: 'The reaction yield was 85%', category: 'properties', difficulty: 'beginner' },
  { id: 40, term: 'Conversion', definition: 'Fraction of reactant transformed', example: '90% conversion means 10% unreacted', category: 'properties', difficulty: 'intermediate' },
  { id: 41, term: 'Selectivity', definition: 'Fraction forming desired product', example: 'High selectivity minimizes byproducts', category: 'properties', difficulty: 'intermediate' },
  { id: 42, term: 'Residence Time', definition: 'Average time spent in reactor', example: 'Longer residence time increases conversion', category: 'properties', difficulty: 'intermediate' },
  { id: 43, term: 'Flow Rate', definition: 'Volume or mass per unit time', example: 'The flow rate is 100 L/min', category: 'properties', difficulty: 'beginner' },
  { id: 44, term: 'Pressure Drop', definition: 'Pressure decrease across equipment', example: 'Excessive pressure drop indicates fouling', category: 'properties', difficulty: 'intermediate' },
  { id: 45, term: 'Heat Capacity', definition: 'Heat required to raise temperature', example: 'Water has high heat capacity', category: 'properties', difficulty: 'intermediate' },
  { id: 46, term: 'Thermal Conductivity', definition: 'Ability to conduct heat', example: 'Metals have high thermal conductivity', category: 'properties', difficulty: 'intermediate' },
  { id: 47, term: 'Diffusivity', definition: 'Rate of molecular spreading', example: 'Gas diffusivity is higher than liquid', category: 'properties', difficulty: 'advanced' },
  { id: 48, term: 'Volatility', definition: 'Tendency to vaporize', example: 'Gasoline is highly volatile', category: 'properties', difficulty: 'intermediate' },
  { id: 49, term: 'Flammability', definition: 'Ability to ignite and burn', example: 'Hydrogen has high flammability', category: 'properties', difficulty: 'beginner' },
  { id: 50, term: 'Toxicity', definition: 'Degree of harmfulness to organisms', example: 'Cyanide has high toxicity', category: 'properties', difficulty: 'beginner' },
];

const VocabularyBuilder = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [mode, setMode] = useState('browse');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [savedWords, setSavedWords] = useState([]);

  const filteredVocab = vocabularyData.filter(word => {
    const categoryMatch = selectedCategory === 'all' || word.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || word.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const playAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en-')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleSave = (wordId) => {
    setSavedWords(prev => 
      prev.includes(wordId) 
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId]
    );
  };

  const startQuiz = () => {
    setMode('quiz');
    setQuizAnswers([]);
    setShowQuizResults(false);
  };

  const handleQuizAnswer = (wordId, isCorrect) => {
    setQuizAnswers(prev => [...prev, { wordId, isCorrect }]);
  };

  const calculateQuizScore = () => {
    const correct = quizAnswers.filter(a => a.isCorrect).length;
    return { correct, total: quizAnswers.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Vocabulary Builder</h1>
          <p className="text-gray-300">Master chemical engineering terminology</p>
        </div>

        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={() => setMode('browse')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'browse' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setMode('flashcard')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'flashcard' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={startQuiz}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'quiz' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Quiz Mode
          </button>
        </div>

        {mode === 'browse' && (
          <div className="mb-6 flex gap-3 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="equipment">Equipment</option>
              <option value="processes">Processes</option>
              <option value="properties">Properties</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <div className="ml-auto text-gray-300">
              {filteredVocab.length} words
            </div>
          </div>
        )}

        {mode === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVocab.map((word) => (
              <div
                key={word.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">{word.term}</h3>
                    <div className="flex gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        word.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        word.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {word.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                        {word.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSave(word.id)}
                    className="ml-2"
                  >
                    <Star className={`w-6 h-6 ${savedWords.includes(word.id) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                  </button>
                </div>

                <p className="text-gray-300 mb-3">{word.definition}</p>
                <div className="bg-white/5 rounded-lg p-3 mb-3">
                  <p className="text-gray-400 text-sm italic">"{word.example}"</p>
                </div>

                <button
                  onClick={() => playAudio(word.term)}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  Hear pronunciation
                </button>
              </div>
            ))}
          </div>
        )}

        {mode === 'flashcard' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 text-center text-gray-300">
              Card {currentIndex + 1} of {filteredVocab.length}
            </div>

            <div
              onClick={() => setShowDefinition(!showDefinition)}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 cursor-pointer hover:border-purple-500 transition-all min-h-96 flex flex-col items-center justify-center"
            >
              {!showDefinition ? (
                <div className="text-center">
                  <h2 className="text-5xl font-bold text-white mb-6">
                    {filteredVocab[currentIndex]?.term}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(filteredVocab[currentIndex]?.term);
                    }}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    Hear it
                  </button>
                  <p className="text-gray-400 mt-8">Click to see definition</p>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {filteredVocab[currentIndex]?.term}
                  </h3>
                  <p className="text-xl text-gray-300 mb-4">
                    {filteredVocab[currentIndex]?.definition}
                  </p>
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <p className="text-gray-400 italic">
                      "{filteredVocab[currentIndex]?.example}"
                    </p>
                  </div>
                  <p className="text-gray-400">Click to flip back</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => {
                  setCurrentIndex(Math.max(0, currentIndex - 1));
                  setShowDefinition(false);
                }}
                disabled={currentIndex === 0}
                className="bg-white/10 hover:bg-white/20 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all"
              >
                Previous
              </button>

              <button
                onClick={() => {
                  setCurrentIndex(Math.min(filteredVocab.length - 1, currentIndex + 1));
                  setShowDefinition(false);
                }}
                disabled={currentIndex === filteredVocab.length - 1}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {mode === 'quiz' && !showQuizResults && (
          <div className="max-w-2xl mx-auto">
            {filteredVocab.slice(0, 10).map((word, idx) => (
              <div
                key={word.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-4 border border-white/20"
              >
                <p className="text-white font-semibold mb-4">
                  {idx + 1}. What does "{word.term}" mean?
                </p>

                <div className="space-y-2">
                  {[word.definition, 'A type of chemical reaction', 'A safety procedure', 'A measurement unit']
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .concat(word.definition)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .slice(0, 4)
                    .map((option, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleQuizAnswer(word.id, option === word.definition)}
                        disabled={quizAnswers.some(a => a.wordId === word.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          quizAnswers.find(a => a.wordId === word.id)
                            ? option === word.definition
                              ? 'bg-green-600 text-white'
                              : 'bg-white/5 text-gray-500'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                </div>
              </div>
            ))}

            {quizAnswers.length === Math.min(10, filteredVocab.length) && (
              <button
                onClick={() => setShowQuizResults(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all"
              >
                See Results
              </button>
            )}
          </div>
        )}

        {mode === 'quiz' && showQuizResults && (
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-4xl font-bold text-purple-400 mb-6">
              {calculateQuizScore().correct} / {calculateQuizScore().total}
            </p>

            <button
              onClick={startQuiz}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyBuilder;