import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        console.log('Auth callback code:', code);

        if (!code) {
          console.error('No code found in URL');
          toast.error('Authentication failed: No code found');
          navigate('/login', { replace: true });
          return;
        }

        // Exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        console.log('Exchange response:', data, error);

        if (error) {
          console.error('Exchange error:', error);
          toast.error('Authentication failed');
          navigate('/login', { replace: true });
          return;
        }

        if (data.session) {
          console.log('Session obtained:', data.session);
          await checkSession();
          toast.success('Successfully signed in!');
          navigate('/dashboard', { replace: true });
        } else {
          console.error('No session in exchange response');
          toast.error('Authentication failed: No session');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast.error('Authentication failed');
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, checkSession]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}