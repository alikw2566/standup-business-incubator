import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  xp_reward: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export function useQuests() {
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setQuests([]);
      setLoading(false);
      return;
    }

    fetchQuests();
  }, [user]);

  const fetchQuests = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quests:', error);
    } else {
      setQuests(data || []);
    }
    setLoading(false);
  };

  const addQuest = async (title: string, description?: string, xpReward: number = 25) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('quests')
      .insert({
        user_id: user.id,
        title,
        description,
        xp_reward: xpReward
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding quest:', error);
      return null;
    }

    setQuests(prev => [data, ...prev]);
    return data;
  };

  const completeQuest = async (questId: string) => {
    if (!user) return null;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return null;

    const { error } = await supabase
      .from('quests')
      .update({ 
        is_completed: true, 
        completed_at: new Date().toISOString() 
      })
      .eq('id', questId);

    if (error) {
      console.error('Error completing quest:', error);
      return null;
    }

    setQuests(prev => prev.map(q => 
      q.id === questId 
        ? { ...q, is_completed: true, completed_at: new Date().toISOString() }
        : q
    ));

    return quest.xp_reward;
  };

  const deleteQuest = async (questId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('id', questId);

    if (!error) {
      setQuests(prev => prev.filter(q => q.id !== questId));
    }
  };

  return { quests, loading, addQuest, completeQuest, deleteQuest, fetchQuests };
}