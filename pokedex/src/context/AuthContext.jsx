import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(authUser) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
      
      if (data) {
        setProfile(data);
      } else {
        // Create initial profile if it doesn't exist
        const username = authUser?.user_metadata?.username || authUser?.email?.split('@')[0] || `Trainer_${Math.floor(Math.random() * 10000)}`;
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: authUser.id, username }])
          .select()
          .single();
        
        if (insertError) {
          console.error('Insert error (RLS?):', insertError);
        } else {
          setProfile(newProfile);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateAvatar(url) {
    if (!user || !profile) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id);
      
      if (error) throw error;
      setProfile({ ...profile, avatar_url: url });
      return true;
    } catch (err) {
      console.error('Error updating avatar:', err);
      return false;
    }
  }

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signUp = (email, password, username) => supabase.auth.signUp({ 
    email, 
    password,
    options: { data: { username } }
  });
  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
