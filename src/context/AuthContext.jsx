import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [guestUser, setGuestUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check guest mode FIRST
        const guestMode = localStorage.getItem('guestMode') === 'true';
        
        if (guestMode) {
          console.log('👤 Guest mode detected');
          const storedGuestUser = localStorage.getItem('guestUser');
          if (storedGuestUser && mounted) {
            try {
              const parsedGuest = JSON.parse(storedGuestUser);
              setGuestUser(parsedGuest);
              setIsGuest(true);
              setUser(null);
              setLoading(false);
            } catch (e) {
              console.error('Failed to parse guest user:', e);
            }
          }
          return;
        }

        // Not guest mode - check for real user
        console.log('🔍 Checking for authenticated user...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session error:', error);
        }

        if (mounted) {
          if (session?.user) {
            console.log('✅ User authenticated:', session.user.email);
            console.log('📋 Raw user object:', session.user);
            console.log('📋 User metadata:', session.user.user_metadata);
            
            // Build full user object with full_name
            const fullName = session.user.user_metadata?.full_name || 
                           session.user.email?.split('@')[0] || 
                           'User';
            
            console.log('🎯 Extracted full_name:', fullName);
            
            const fullUser = {
              ...session.user,
              full_name: fullName
            };
            
            console.log('✅ Final user object:', fullUser);
            console.log('✅ Full name in user:', fullUser.full_name);
            
            setUser(fullUser);
            setIsGuest(false);
            setGuestUser(null);
          } else {
            console.log('❌ No authenticated user');
            setUser(null);
            setIsGuest(false);
            setGuestUser(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Auth initialization error:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth event:', event);
        
        if (mounted) {
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ User signed in:', session.user.email);
            console.log('📋 User metadata on sign in:', session.user.user_metadata);
            
            // Clear guest mode
            localStorage.removeItem('guestMode');
            localStorage.removeItem('guestUser');
            localStorage.removeItem('guestStats');
            
            // Build full_name
            const fullName = session.user.user_metadata?.full_name || 
                           session.user.email?.split('@')[0] || 
                           'User';
            
            console.log('🎯 Full name on sign in:', fullName);
            
            // Set user with full_name
            const fullUser = {
              ...session.user,
              full_name: fullName
            };
            
            console.log('✅ Setting user object:', fullUser);
            
            setUser(fullUser);
            setIsGuest(false);
            setGuestUser(null);
            
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
            setUser(null);
            setIsGuest(false);
            setGuestUser(null);
            
          } else if (event === 'USER_UPDATED' && session?.user) {
            console.log('🔄 User updated');
            const fullName = session.user.user_metadata?.full_name || 
                           session.user.email?.split('@')[0] || 
                           'User';
            const fullUser = {
              ...session.user,
              full_name: fullName
            };
            setUser(fullUser);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, fullName = '') => {
    try {
      console.log('📝 Signing up user:', email);
      console.log('📝 Full name provided:', fullName);
      
      // Clear guest mode
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestUser');
      localStorage.removeItem('guestStats');

      const metadata = {
        full_name: fullName || email.split('@')[0]
      };
      
      console.log('📝 Metadata being sent:', metadata);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      console.log('✅ Signup successful:', data);
      return { data, error: null };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('🔐 Signing in user:', email);
      
      // Clear guest mode
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestUser');
      localStorage.removeItem('guestStats');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      console.log('✅ Login successful');
      console.log('📋 User data:', data.user);
      console.log('📋 User metadata:', data.user?.user_metadata);
      
      return { data, error: null };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Signing out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error && error.message !== 'Auth session missing!') {
        console.warn('⚠️ Sign out warning:', error);
      }

      setUser(null);
      setIsGuest(false);
      setGuestUser(null);
      
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestUser');
      localStorage.removeItem('guestStats');
      
      console.log('✅ Signed out successfully');
      return { error: null };
      
    } catch (error) {
      console.error('❌ Sign out error:', error);
      
      setUser(null);
      setIsGuest(false);
      setGuestUser(null);
      localStorage.clear();
      
      return { error: null };
    }
  };

  // Log whenever user state changes
  useEffect(() => {
    console.log('🔄 User state changed:', user);
    console.log('🔄 Full name:', user?.full_name);
    console.log('🔄 Email:', user?.email);
    console.log('🔄 Is guest:', isGuest);
  }, [user, isGuest]);

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading,
    isGuest,
    guestUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};