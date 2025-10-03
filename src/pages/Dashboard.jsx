import React from 'react';
import { TrendingUp, BookOpen, MessageSquare, Award } from 'lucide-react';
import Card from '../components/shared/Card';
import ProgressBar from '../components/shared/ProgressBar';

const Dashboard = () => {
  const stats = [
    { label: 'Grammar Lessons', value: '24/50', icon: BookOpen, color: 'from-purple-500 to-pink-500', progress: 48 },
    { label: 'Vocabulary Mastered', value: '156/300', icon: MessageSquare, color: 'from-blue-500 to-cyan-500', progress: 52 },
    { label: 'Pronunciation Score', value: '85%', icon: TrendingUp, color: 'from-green-500 to-emerald-500', progress: 85 },
    { label: 'Total Points', value: '2,450', icon: Award, color: 'from-orange-500 to-red-500', progress: 75 }
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 p-8">
        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
        <p className="text-slate-300 text-lg">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
              <p className="text-slate-400 text-sm mb-4">{stat.label}</p>
              <ProgressBar progress={stat.progress} color={stat.color} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;