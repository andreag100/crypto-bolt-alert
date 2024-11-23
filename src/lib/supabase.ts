import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qunoxnceswfilpbdmaxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bm94bmNlc3dmaWxwYmRtYXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNTY3NzIsImV4cCI6MjA0NzgzMjc3Mn0.SeARfPyczhfd69TtHOVBsG_H2C3Dh2QybAPLbPrRHTU';

// Determine the base URL based on environment
const baseUrl = import.meta.env.PROD
  ? 'https://cryptoalerts.cloud'
  : window.location.origin;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
