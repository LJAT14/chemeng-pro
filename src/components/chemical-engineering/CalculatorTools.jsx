import React from 'react';
import { Calculator } from 'lucide-react';
import Card from '../shared/Card';

const CalculatorTools = () => {
  const tools = [
    { name: 'Unit Converter', description: 'Convert between unit systems' },
    { name: 'Molar Mass Calculator', description: 'Calculate molecular weight' },
    { name: 'Ideal Gas Law', description: 'PV = nRT calculations' },
    { name: 'Heat Transfer', description: 'Conduction calculations' }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {tools.map((tool, idx) => (
        <Card key={idx}>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Calculator className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{tool.name}</h3>
              <p className="text-sm text-slate-400">{tool.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CalculatorTools;