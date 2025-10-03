import React, { useState } from 'react';
import { Volume2, Bookmark } from 'lucide-react';
import Card from '../shared/Card';

const VocabCard = ({ term, language = 'en' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Card onClick={() => setIsFlipped(!isFlipped)}>
      <div className="relative min-h-[200px] flex flex-col justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
          className="absolute top-0 right-0"
        >
          <Bookmark className={isSaved ? 'fill-yellow-400 text-yellow-400 w-5 h-5' : 'text-slate-400 w-5 h-5'} />
        </button>
        
        {!isFlipped ? (
          <div>
            <h3 className="text-2xl font-bold mb-2">{term.term.en}</h3>
            <p className="text-slate-400 text-sm mb-4">{term.pronunciation}</p>
            <button className="flex items-center space-x-2 text-purple-400">
              <Volume2 className="w-5 h-5" />
              <span>Listen</span>
            </button>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-semibold text-purple-400 mb-2">Translation (PT-BR):</h4>
            <p className="text-xl mb-4">{term.term.pt}</p>
            <h4 className="text-lg font-semibold text-purple-400 mb-2">Definition:</h4>
            <p className="text-slate-300">{term.definition[language]}</p>
          </div>
        )}
        
        <p className="text-xs text-slate-500 mt-4">Click to flip</p>
      </div>
    </Card>
  );
};

export default VocabCard;