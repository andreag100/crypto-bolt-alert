import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const siteUrl = import.meta.env.VITE_APP_URL;

interface AuthState {
  user: any;
  session: any;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  signIn: async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  checkSession: async () => {
    try {
      console.log('Checking session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session data:', session);
      
      set({
        session,
        user: session?.user ?? null,
        loading: false
      });

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((_event, session) => {
        console.log('Auth state changed:', _event, session);
        set({
          session,
          user: session?.user ?? null,
          loading: false
        });

        if (session) {
          window.location.href = `${siteUrl}/dashboard`;
        }
      });
    } catch (error) {
      console.error('Error checking session:', error);
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null });
      window.location.href = siteUrl;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
}));
