import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const siteUrl = import.meta.env.VITE_APP_URL;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  signIn: async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: siteUrl,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
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

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user ?? null,
        loading: false
      });

      supabase.auth.onAuthStateChange((_event, session) => {
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
}));
