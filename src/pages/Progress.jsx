import React from 'react';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import Card from '../components/shared/Card';
import ProgressBar from '../components/shared/ProgressBar';
import useProgress from '../hooks/useProgress';

const Progress = () => {
  const { progress } = useProgress();

  const stats = [
    {
      icon: Target,
      label: 'Grammar Completed',
      value: progress.grammar.completed + '/' + progress.grammar.total,
      progress: (progress.grammar.completed / progress.grammar.total) * 100,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      label: 'Vocabulary Mastered',
      value: progress.vocabulary.completed + '/' + progress.vocabulary.total,
      progress: (progress.vocabulary.completed / progress.vocabulary.total) * 100,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      label: 'Total Points',
      value: progress.totalPoints.toLocaleString(),
      progress: 75,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Calendar,
      label: 'Interviews Completed',
      value: progress.interviews.completed,
      progress: (progress.interviews.completed / 20) * 100,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <TrendingUp className="w-8 h-8 text-green-400" />
        <h1 className="text-4xl font-bold">Your Progress</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const iconBg = 'p-3 rounded-xl bg-gradient-to-br inline-flex mb-4 ' + stat.color;
          
          return (
            <Card key={idx}>
              <div className={iconBg}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-slate-400 mb-4">{stat.label}</p>
              <ProgressBar progress={stat.progress} color={stat.color} />
            </Card>
          );
        })}
      </div>

      <Card hover={false}>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { activity: 'Completed Grammar Quiz: Present Perfect', points: 100, time: '2 hours ago' },
            { activity: 'Mastered 10 new vocabulary terms', points: 50, time: '5 hours ago' },
            { activity: 'Pronunciation practice: 15 words', points: 75, time: '1 day ago' },
            { activity: 'Completed technical interview simulation', points: 200, time: '2 days ago' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div>
                <p className="font-semibold">{item.activity}</p>
                <p className="text-sm text-slate-400">{item.time}</p>
              </div>
              <span className="text-purple-400 font-semibold">+{item.points} pts</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Progress;