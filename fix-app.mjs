import fs from 'fs';

const fixPages = () => {
  console.log('Fixing broken pages...');

  // Fix ChemicalEngineering
  fs.writeFileSync('src/pages/ChemicalEngineering.jsx', `import React from 'react';
import { FlaskConical } from 'lucide-react';
import Card from '../components/shared/Card';

const ChemicalEngineering = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <FlaskConical className="w-8 h-8 text-red-400" />
        <h1 className="text-4xl font-bold">Chemical Engineering</h1>
      </div>
      <Card hover={false}>
        <p className="text-slate-400">Chemical engineering modules coming soon.</p>
      </Card>
    </div>
  );
};

export default ChemicalEngineering;`);

  // Fix PronunciationLab
  fs.writeFileSync('src/pages/PronunciationLab.jsx', `import React from 'react';
import { Mic } from 'lucide-react';
import Card from '../components/shared/Card';

const PronunciationLab = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Mic className="w-8 h-8 text-green-400" />
        <h1 className="text-4xl font-bold">Pronunciation Lab</h1>
      </div>
      <Card hover={false}>
        <p className="text-slate-400">Pronunciation practice coming soon.</p>
      </Card>
    </div>
  );
};

export default PronunciationLab;`);

  // Fix WritingStudio
  fs.writeFileSync('src/pages/WritingStudio.jsx', `import React from 'react';
import { PenTool } from 'lucide-react';
import Card from '../components/shared/Card';

const WritingStudio = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <PenTool className="w-8 h-8 text-purple-400" />
        <h1 className="text-4xl font-bold">Writing Studio</h1>
      </div>
      <Card hover={false}>
        <p className="text-slate-400">Writing tools coming soon.</p>
      </Card>
    </div>
  );
};

export default WritingStudio;`);

  console.log('✓ Fixed all broken pages');
};

fixPages();