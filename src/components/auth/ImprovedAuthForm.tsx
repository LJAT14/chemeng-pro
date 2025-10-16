import React, { useState } from 'react';
import { Globe } from 'lucide-react';

export function ImprovedAuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback('🚀 Creating your account...');
    
    // TODO: Replace with your actual auth logic
    setTimeout(() => {
      setFeedback('✅ Welcome to Bacana English!');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-green-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <Globe className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-purple-600">Bacana English</h1>
          <p className="text-gray-600 mt-2">Start your learning journey! 🌍📚</p>
        </div>

        {feedback && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center animate-pulse">
            {feedback}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-green-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? '⏳ Loading...' : '🚀 Get Started'}
          </button>
        </form>

        <button className="w-full mt-4 border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
          Continue as Guest 👤
        </button>
      </div>
    </div>
  );
}