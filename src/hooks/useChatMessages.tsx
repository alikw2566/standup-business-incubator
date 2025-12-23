import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function useChatMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages((data || []) as ChatMessage[]);
    }
    setLoading(false);
  };

  const addMessage = useCallback(async (role: 'user' | 'assistant', content: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        role,
        content
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding message:', error);
      return null;
    }

    const newMessage = data as ChatMessage;
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, [user]);

  const updateLastMessage = useCallback((content: string) => {
    setMessages(prev => {
      const lastIndex = prev.length - 1;
      if (lastIndex < 0 || prev[lastIndex].role !== 'assistant') {
        return prev;
      }
      const updated = [...prev];
      updated[lastIndex] = { ...updated[lastIndex], content };
      return updated;
    });
  }, []);

  const addOptimisticMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      user_id: user?.id || '',
      role,
      content,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);
    return tempMessage;
  }, [user]);

  return { messages, loading, addMessage, addOptimisticMessage, updateLastMessage, fetchMessages };
}