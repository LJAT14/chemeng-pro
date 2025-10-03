import React from 'react';
import { FlaskConical } from 'lucide-react';
import Card from '../shared/Card';

const SeparationModule = () => {
  return (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Separation Processes</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">Distillation</h3>
            <p className="text-slate-300 text-sm">
              Vapor-liquid equilibrium separation
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">Extraction</h3>
            <p className="text-slate-300 text-sm">
              Selective dissolution method
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">Absorption</h3>
            <p className="text-slate-300 text-sm">
              Gas to liquid transfer
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">Adsorption</h3>
            <p className="text-slate-300 text-sm">
              Surface adhesion process
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SeparationModule;