import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

export function AuthCallback() {
  const navigate = useNavigate();
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash
        const hash = window.location.hash;
        console.log('Auth callback URL hash:', hash);

        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Auth callback session:', session);
        
        if (error) {
          console.error('Session error:', error);
          toast.error('Authentication failed');
          throw error;
        }
        
        if (session) {
          console.log('Valid session found, checking session...');
          await checkSession();
          console.log('Session checked, navigating to dashboard...');
          navigate('/dashboard', { replace: true });
          toast.success('Successfully signed in!');
        } else {
          console.log('No session found, redirecting to login...');
          navigate('/login', { replace: true });
          toast.error('Authentication failed');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast.error('Authentication failed');
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, checkSession]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}