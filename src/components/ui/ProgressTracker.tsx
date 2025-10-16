import React from 'react';

interface ProgressTrackerProps {
  completed: number;
  total: number;
}

export function ProgressTracker({ completed, total }: ProgressTrackerProps) {
  const percentage = (completed / total) * 100;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-purple-600">Your Progress 📊</h3>
        <span className="text-2xl font-bold text-green-600">{percentage.toFixed(0)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-600 to-green-500 h-full transition-all duration-1000 rounded-full flex items-center justify-end pr-2"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 20 && <span className="text-white font-bold text-sm">🚀</span>}
        </div>
      </div>

      <p className="text-gray-600 mt-3 text-center">
        {completed} of {total} lessons completed
      </p>
    </div>
  );
}