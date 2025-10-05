// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, Zap, Target } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: { full_name: fullName.trim() },
          },
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from('user_profiles').insert({
            user_id: data.user.id,
            email: data.user.email,
            full_name: fullName.trim(),
          });

          await supabase.from('user_progress').insert({
            user_id: data.user.id,
          });

          navigate('/dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (!profile) {
          await supabase.from('user_profiles').insert({
            user_id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || 'Student',
          });
        }

        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      });
      if (error) throw error;
    } catch (error) {
      setError('Google login is not configured yet');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex">
        {/* Left side - Hero section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ChemEng Pro
              </h1>
            </div>
            
            <p className="text-2xl font-light mb-8 text-gray-300">
              Master chemical engineering interviews with AI-powered practice
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">AI Interview Feedback</h3>
                  <p className="text-gray-400">Get instant, personalized feedback on your answers from advanced AI</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Track Your Progress</h3>
                  <p className="text-gray-400">Monitor improvement with detailed analytics and performance metrics</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Voice Recognition</h3>
                  <p className="text-gray-400">Practice with speech-to-text technology for realistic interview simulation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">ChemEng Pro</h1>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-400">
                  {isSignup ? 'Start your journey today' : 'Sign in to continue'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-5">
                {isSignup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {isSignup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>

              {!isSignup && (
                <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <p className="text-indigo-300 text-xs text-center">
                    Demo: test@test.com / test123456
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;