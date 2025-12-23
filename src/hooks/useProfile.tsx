import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  current_level: number;
  total_xp: number;
  current_streak: number;
  last_active_date: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateXP = async (xpToAdd: number) => {
    if (!user || !profile) return;

    const newTotalXP = profile.total_xp + xpToAdd;
    const newLevel = Math.floor(newTotalXP / 100) + 1;

    const { error } = await supabase
      .from('profiles')
      .update({ 
        total_xp: newTotalXP, 
        current_level: newLevel,
        last_active_date: new Date().toISOString().split('T')[0]
      })
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => prev ? { 
        ...prev, 
        total_xp: newTotalXP, 
        current_level: newLevel 
      } : null);
    }
  };

  const updateStreak = async (newStreak: number) => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({ 
        current_streak: newStreak,
        last_active_date: new Date().toISOString().split('T')[0]
      })
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, current_streak: newStreak } : null);
    }
  };

  return { profile, loading, fetchProfile, updateXP, updateStreak };
}