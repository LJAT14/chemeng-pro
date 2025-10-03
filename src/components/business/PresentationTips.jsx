import React from 'react';
import { Presentation, CheckCircle2 } from 'lucide-react';
import Card from '../shared/Card';

const PresentationTips = () => {
  const sections = [
    {
      title: 'Opening Strong',
      tips: [
        'Start with a compelling hook',
        'State your objective clearly',
        'Establish credibility early',
        'Use confident body language'
      ]
    },
    {
      title: 'Main Content',
      tips: [
        'Follow the rule of three',
        'Use visual aids effectively',
        'Tell stories to illustrate points',
        'Maintain eye contact'
      ]
    },
    {
      title: 'Closing Impact',
      tips: [
        'Summarize key takeaways',
        'End with a call to action',
        'Allow time for Q&A',
        'Thank your audience'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <Card key={idx} hover={false}>
          <div className="flex items-center space-x-3 mb-4">
            <Presentation className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold">{section.title}</h3>
          </div>
          
          <ul className="space-y-2">
            {section.tips.map((tip, tipIdx) => (
              <li key={tipIdx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
};

export default PresentationTips;