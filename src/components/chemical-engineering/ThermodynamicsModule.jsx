import React, { useState } from 'react';
import { Zap, Calculator } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

const ThermodynamicsModule = () => {
  const [temperature, setTemperature] = useState('');
  const [pressure, setPressure] = useState('');
  const [result, setResult] = useState(null);

  const calculateGibbsEnergy = () => {
    const T = parseFloat(temperature);
    const P = parseFloat(pressure);
    
    if (!isNaN(T) && !isNaN(P)) {
      const deltaG = -50 + (0.1 * T) - (0.05 * P);
      setResult(deltaG.toFixed(2));
    }
  };

  return (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Thermodynamics Calculator</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Temperature (K)</label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="298.15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pressure (atm)</label>
            <input
              type="number"
              value={pressure}
              onChange={(e) => setPressure(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="1.0"
            />
          </div>

          <Button onClick={calculateGibbsEnergy} className="w-full">
            <Calculator className="w-5 h-5 mr-2 inline" />
            Calculate ΔG
          </Button>

          {result && (
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
              <p className="text-sm text-slate-400 mb-1">Gibbs Free Energy Change:</p>
              <p className="text-3xl font-bold text-purple-400">{result} kJ/mol</p>
            </div>
          )}
        </div>
      </Card>

      <Card hover={false}>
        <h3 className="text-xl font-bold mb-4">Key Concepts</h3>
        <div className="space-y-3">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="font-semibold text-purple-400">First Law:</p>
            <p className="text-slate-300 text-sm">Energy cannot be created or destroyed</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="font-semibold text-purple-400">Second Law:</p>
            <p className="text-slate-300 text-sm">Entropy always increases</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="font-semibold text-purple-400">Gibbs Free Energy:</p>
            <p className="text-slate-300 text-sm">ΔG = ΔH - TΔS</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThermodynamicsModule;