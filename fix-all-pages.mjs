import fs from 'fs';

const pages = {
  'src/pages/GrammarHub.jsx': `import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import Card from '../components/shared/Card';

const GrammarHub = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <BookOpen className="w-8 h-8 text-purple-400" />
        <h1 className="text-4xl font-bold">Grammar Hub</h1>
      </div>
      <Card hover={false}>
        <p className="text-slate-400">Grammar lessons coming soon.</p>
      </Card>
    </div>
  );
};

export default GrammarHub;`,

  'src/pages/VocabularyHub.jsx': `import React from 'react';
import { MessageSquare } from 'lucide-react';
import Card from '../components/shared/Card';

const VocabularyHub = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <MessageSquare className="w-8 h-8 text-blue-400" />
        <h1 className="text-4xl font-bold">Vocabulary Hub</h1>
      </div>
      <Card hover={false}>
        <p className="text-slate-400">Vocabulary practice coming soon.</p>
      </Card>
    </div>
  );
};

export default VocabularyHub;`,

  'src/pages/BusinessEnglish.jsx': `import React from 'react';
import { Briefcase } from 'lucide-react';
import Card from '../components/shared/Card';

const BusinessEnglish = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Briefcase className="w-8 h-8 text-green-400" />
        <h1 className="text-4xl font-bold">Business English</h1>
      </div>
      <Card hover={false}>
        <p className="text-slate-400">Business English lessons coming soon.</p>
      </Card>
    </div>
  );
};

export default BusinessEnglish;`,

  'src/pages/InterviewSimulator.jsx': `import React from 'react';
import { Briefcase } from 'lucide-react';
import Card from '../components/shared/Card';

const InterviewSimulator = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Briefcase className="w-8 h-8 text-orange-400" />
        <h1 className="text-4xl font-bold">Interview Simulator</h1>
      </div>
      <Card hover={false}>
        <p className="text-slate-400">Interview practice coming soon.</p>
      </Card>
    </div>
  );
};

export default InterviewSimulator;`
};

Object.entries(pages).forEach(([path, content]) => {
  fs.writeFileSync(path, content);
  console.log('Fixed:', path);
});

console.log('\n✓ All pages fixed. Run: npm run dev');