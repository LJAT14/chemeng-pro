import React from 'react';
import { Handshake } from 'lucide-react';
import Card from '../shared/Card';

const NegotiationPhrases = () => {
  const phrases = [
    {
      category: 'Opening',
      items: [
        { en: 'I appreciate the opportunity to discuss this', pt: 'Agradeço a oportunidade de discutir isso' },
        { en: 'Let us explore mutually beneficial options', pt: 'Vamos explorar opções mutuamente benéficas' }
      ]
    },
    {
      category: 'Making Proposals',
      items: [
        { en: 'What if we were to consider...', pt: 'E se considerássemos...' },
        { en: 'I propose that we...', pt: 'Proponho que...' },
        { en: 'Would you be open to...', pt: 'Você estaria aberto a...' }
      ]
    },
    {
      category: 'Closing',
      items: [
        { en: 'I believe we have reached agreement', pt: 'Acredito que chegamos a um acordo' },
        { en: 'Thank you for your flexibility', pt: 'Obrigado pela sua flexibilidade' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {phrases.map((section, idx) => (
        <Card key={idx} hover={false}>
          <div className="flex items-center space-x-3 mb-4">
            <Handshake className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold">{section.category}</h3>
          </div>
          
          <div className="space-y-3">
            {section.items.map((item, itemIdx) => (
              <div key={itemIdx} className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-slate-100 mb-2">{item.en}</p>
                <p className="text-slate-400 text-sm">{item.pt}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NegotiationPhrases;