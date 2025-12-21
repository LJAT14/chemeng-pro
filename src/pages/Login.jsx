import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Sparkles, Loader, Mail, Lock, User, Eye, EyeOff, UserCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        // Check guest mode FIRST
        const isGuest = localStorage.getItem('guestMode') === 'true';
        if (isGuest && isMounted) {
          console.log('Guest mode detected, redirecting...');
          navigate('/dashboard', { replace: true });
          return;
        }

        // Check for active session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (isMounted) {
          if (error) {
            console.error('Session check error:', error);
          } else if (session) {
            console.log('Active session found, redirecting...');
            navigate('/dashboard', { replace: true });
            return;
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
          
          // Load remembered email
          const rememberedEmail = localStorage.getItem('rememberedEmail');
          if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
          }
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleGuestMode = () => {
    try {
      // Clear any existing session first
      supabase.auth.signOut().catch(() => {});
      
      // Set guest mode
      localStorage.setItem('guestMode', 'true');
      localStorage.setItem('guestUser', JSON.stringify({
        id: 'guest-' + Date.now(),
        email: 'guest@bacanaenglish.com',
        full_name: 'Guest User',
        isGuest: true
      }));
      
      // Initialize guest stats
      if (!localStorage.getItem('guestStats')) {
        localStorage.setItem('guestStats', JSON.stringify({
          lessonsCompleted: 0,
          currentStreak: 0,
          totalPoints: 0,
          rank: 'Guest',
          weeklyActivity: 0,
        }));
      }
      
      showToast('Welcome! Exploring as guest 🎉', 'success');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Guest mode error:', error);
      showToast('Failed to enter guest mode', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // CRITICAL: Clear guest mode BEFORE logging in
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestUser');
      localStorage.removeItem('guestStats');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email.trim());
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      showToast('Welcome back! 🎉', 'success');
      
      // Force reload to clear any cached state
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email to confirm your account';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name');
      showToast('Please enter your full name', 'error');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      // CRITICAL: Clear guest mode BEFORE signing up
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestUser');
      localStorage.removeItem('guestStats');

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      // Check if email already exists
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('This email is already registered. Please login instead.');
        showToast('Email already registered. Please login.', 'error');
        setIsSignup(false);
        return;
      }

      if (data.user) {
        // If we have a session, user is logged in immediately (email confirmation disabled)
        if (data.session) {
          showToast('Account created! Welcome! 🎉', 'success');
          // Force reload to clear any cached state
          window.location.href = '/dashboard';
        } else {
          // Email confirmation is enabled
          setMessage('Account created! Please check your email to verify your account.');
          showToast('Check your email to verify account! 📧', 'success');
        }
      }

    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Signup failed';
      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please login instead.';
        setIsSignup(false);
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <img 
                src="/favicon.svg" 
                alt="Bacana English" 
                className="w-10 h-10"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <span className="text-white text-2xl font-bold" style={{ display: 'none' }}>B</span>
            </div>
            <h1 className="text-3xl font-bold text-white">
              Bacana English
            </h1>
          </div>
          
          <p className="text-center text-slate-300 mb-8">
            {isSignup ? 'Create your account to start learning' : 'Welcome back! Continue your learning journey'}
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="John Doe"
                    required={isSignup}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                    required={isSignup}
                    disabled={loading}
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
                    disabled={loading}
                  />
                  <span className="text-sm text-slate-300">Remember me</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : isSignup ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Account
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Guest Mode Button */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-slate-400">or</span>
              </div>
            </div>

            <button
              onClick={handleGuestMode}
              disabled={loading}
              className="mt-4 w-full bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:cursor-not-allowed border border-white/20 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <UserCircle className="w-5 h-5" />
              Continue as Guest
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">
              Try the platform without creating an account
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setMessage('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
              disabled={loading}
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}