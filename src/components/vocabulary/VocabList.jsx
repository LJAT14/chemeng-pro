import React from 'react';
import VocabCard from './VocabCard';

const VocabList = ({ vocabulary, language = 'en' }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vocabulary.map((term) => (
        <VocabCard key={term.id} term={term} language={language} />
      ))}
    </div>
  );
};

export default VocabList;