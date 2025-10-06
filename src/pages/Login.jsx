// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
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

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();

    // Load remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful:', data);

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email.trim());
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      if (error.message.includes('Invalid login credentials')) {
        setError('Wrong email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please confirm your email first');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting signup with:', email);

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      console.log('Signup successful:', data);

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            email: data.user.email,
            full_name: fullName.trim(),
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        // Create user progress
        const { error: progressError } = await supabase
          .from('user_progress')
          .insert({
            user_id: data.user.id,
          });

        if (progressError) {
          console.error('Progress initialization error:', progressError);
        }
      }

      // Auto-login after signup
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (loginError) {
        setError('Account created! Please login.');
        setIsSignup(false);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.message.includes('already registered')) {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/assets/logo.svg" alt="Bacana English" className="w-12 h-12" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Bacana English
            </h1>
          </div>
          <p className="text-gray-300">
            {isSignup ? 'Create your account to start learning' : 'Welcome back! Continue your learning journey'}
          </p>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {!isSignup && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-300 text-sm">Remember me</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : isSignup ? (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between login/signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Guest Access */}
          <div className="mt-4 text-center">
            <button
              onClick={handleGuestAccess}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;