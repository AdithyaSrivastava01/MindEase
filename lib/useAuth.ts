'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        sessionStorage.clear();
        router.push('/auth');
      } else if (event === 'SIGNED_IN' && session) {
        const username = session.user.user_metadata?.username || 'User';
        setUser({ id: session.user.id, username });
        sessionStorage.setItem('userId', session.user.id);
        sessionStorage.setItem('username', username);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const username = session.user.user_metadata?.username || 'User';
        setUser({ id: session.user.id, username });
        sessionStorage.setItem('userId', session.user.id);
        sessionStorage.setItem('username', username);
      } else {
        // Check sessionStorage
        const userId = sessionStorage.getItem('userId');
        const username = sessionStorage.getItem('username');

        if (userId && username) {
          setUser({ id: userId, username });
        } else if (requireAuth) {
          router.push('/auth');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (requireAuth) {
        router.push('/auth');
      }
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    sessionStorage.clear();
    setUser(null);
    router.push('/auth');
  }

  return { user, loading, signOut };
}
