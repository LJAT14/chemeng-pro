import React from 'react';
import { BookOpen, Globe } from 'lucide-react';
import Card from '../shared/Card';
import Badge from '../shared/Badge';

const GrammarNoteCard = ({ note, language = 'en' }) => {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{note.title[language]}</h3>
            <Badge variant={note.difficulty}>{note.difficulty}</Badge>
          </div>
        </div>
        <Globe className="w-5 h-5 text-slate-400" />
      </div>
      
      <p className="text-slate-300 mb-4">{note.explanation[language]}</p>
      
      <div className="space-y-2">
        <h4 className="font-semibold text-purple-400">Examples:</h4>
        {note.examples.map((example, idx) => (
          <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-slate-300">{example[language]}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GrammarNoteCard;