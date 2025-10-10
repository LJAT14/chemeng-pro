 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check for guest mode
    const guestMode = localStorage.getItem('guestMode') === 'true';
    
    if (guestMode) {
      const guestUser = JSON.parse(localStorage.getItem('guestUser') || '{}');
      setUser(guestUser);
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // Check for real authenticated user
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setIsGuest(false);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsGuest(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    if (isGuest) {
      // Clear guest mode
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestUser');
      setUser(null);
      setIsGuest(false);
      return;
    }

    // Regular logout
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, isGuest, logout };
}

// Helper function to get current user (guest or real)
export function getCurrentUser() {
  const guestMode = localStorage.getItem('guestMode') === 'true';
  
  if (guestMode) {
    return JSON.parse(localStorage.getItem('guestUser') || '{}');
  }

  return null; // Will be handled by Supabase auth
}

// Helper to check if user is authenticated (guest or real)
export function isAuthenticated() {
  const guestMode = localStorage.getItem('guestMode') === 'true';
  return guestMode || Boolean(supabase.auth.getUser());
}