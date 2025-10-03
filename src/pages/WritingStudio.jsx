import React from 'react';
import { PenTool, CheckCircle2 } from 'lucide-react';
import Card from '../components/shared/Card';

const WritingStudio = () => {
  const writingTips = [
    {
      category: 'Scientific Writing',
      tips: [
        'Use passive voice for methods and results',
        'Present tense for established facts',
        'Past tense for your specific research',
        'Avoid first person in formal papers'
      ]
    },
    {
      category: 'Technical Reports',
      tips: [
        'Clear and concise language',
        'Logical flow of information',
        'Proper use of technical terminology',
        'Include data visualization'
      ]
    },
    {
      category: 'Common Mistakes',
      tips: [
        'Avoid contractions in formal writing',
        'Do not start sentences with numbers',
        'Use consistent terminology',
        'Proofread for technical accuracy'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <PenTool className="w-8 h-8 text-purple-400" />
        <h1 className="text-4xl font-bold">Writing Studio</h1>
      </div>

      <Card hover={false}>
        <h2 className="text-2xl font-bold mb-4">Sample Abstract Analysis</h2>
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm font-semibold text-red-400 mb-2">❌ Poor Example:</p>
            <p className="text-slate-300">
              We did experiments on catalysts. The results were good. The conversion rate increased significantly.
            </p>
          </div>
          
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm font-semibold text-green-400 mb-2">✓ Improved Example:</p>
            <p className="text-slate-300">
              This study investigated the catalytic performance of zeolite-supported platinum nanoparticles 
              for methanol oxidation. Under optimized conditions (350°C, 1 atm), the conversion rate increased 
              from 45% to 78%, demonstrating enhanced activity compared to conventional catalysts.
            </p>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm font-semibold text-blue-400 mb-2">💡 Key Improvements:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
              <li>Specific technical details</li>
              <li>Quantitative data</li>
              <li>Professional tone</li>
              <li>Clear methodology</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {writingTips.map((section, idx) => (
          <Card key={idx} hover={false}>
            <h3 className="text-xl font-bold mb-4">{section.category}</h3>
            <ul className="space-y-2">
              {section.tips.map((tip, tipIdx) => (
                <li key={tipIdx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WritingStudio;