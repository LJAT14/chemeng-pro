import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import ThermodynamicsModule from '../components/chemical-engineering/ThermodynamicsModule';
import ReactionKineticsModule from '../components/chemical-engineering/ReactionKineticsModule';
import SeparationModule from '../components/chemical-engineering/SeparationModule';
import CalculatorTools from '../components/chemical-engineering/CalculatorTools';

const ChemicalEngineering = () => {
  const [activeModule, setActiveModule] = useState('thermo');

  const modules = [
    { id: 'thermo', label: 'Thermodynamics' },
    { id: 'kinetics', label: 'Reaction Kinetics' },
    { id: 'separation', label: 'Separation' },
    { id: 'tools', label: 'Calculator Tools' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <FlaskConical className="w-8 h-8 text-red-400" />
        <h1 className="text-4xl font-bold">Chemical Engineering</h1>
      </div>

      <nav className="flex space-x-2 bg-slate-900/50 rounded-full p-1 border border-slate-800/50">
        {modules.map((module) => {
          const isActive = activeModule === module.id;
          const buttonClass = isActive
            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
            : 'text-slate-400 hover:text-white';
          
          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={'px-6 py-2 rounded-full transition-all duration-300 ' + buttonClass}
            >
              {module.label}
            </button>
          );
        })}
      </nav>

      {activeModule === 'thermo' && <ThermodynamicsModule />}
      {activeModule === 'kinetics' && <ReactionKineticsModule />}
      {activeModule === 'separation' && <SeparationModule />}
      {activeModule === 'tools' && <CalculatorTools />}
    </div>
  );
};

export default ChemicalEngineering;