import React from 'react';

export function AchievementBadges() {
  const badges = [
    { icon: '🌟', name: 'First Step', earned: true },
    { icon: '🔥', name: '7 Day Streak', earned: true },
    { icon: '🎯', name: 'Perfect Score', earned: false },
    { icon: '👑', name: 'Master', earned: false },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-purple-600 mb-4">Achievements 🏆</h3>
      
      <div className="grid grid-cols-4 gap-4">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className={`text-center p-4 rounded-xl transition-all ${
              badge.earned 
                ? 'bg-gradient-to-br from-purple-100 to-green-100 scale-100' 
                : 'bg-gray-100 opacity-50 grayscale'
            }`}
          >
            <div className="text-4xl mb-2">{badge.icon}</div>
            <p className="text-xs font-semibold text-gray-700">{badge.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}