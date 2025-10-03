import React from 'react';
import { Atom } from 'lucide-react';
import Card from '../shared/Card';

const ReactionKineticsModule = () => {
  return (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
            <Atom className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Reaction Kinetics</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-blue-400 mb-2">Arrhenius Equation</h3>
            <p className="font-mono text-xl mb-2">k = A · e^(-Ea/RT)</p>
            <p className="text-slate-300 text-sm">
              Rate constant calculation with activation energy
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-blue-400 mb-2">Rate Laws</h3>
            <p className="text-slate-300 text-sm mb-2">Rate = k[A]^m[B]^n</p>
            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
              <li>Zero order: Rate = k</li>
              <li>First order: Rate = k[A]</li>
              <li>Second order: Rate = k[A]²</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReactionKineticsModule;