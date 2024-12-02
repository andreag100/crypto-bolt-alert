import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const siteUrl = import.meta.env.VITE_APP_URL;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important: set this to false since we're handling it manually
    storage: window.localStorage,
    storageKey: 'crypto-alerts-auth',
    flowType: 'pkce',
    redirectTo: `${siteUrl}/auth/callback`
  }
});
