import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useQuests } from '@/hooks/useQuests';
import { useChatMessages } from '@/hooks/useChatMessages';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader2, Sparkles } from 'lucide-react';

export default function AIChat() {
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const { quests } = useQuests();
  const { messages, addMessage, addOptimisticMessage, updateLastMessage } = useChatMessages();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    await addMessage('user', userMessage);
    addOptimisticMessage('assistant', '');

    try {
      const activeQuests = quests.filter(q => !q.is_completed);
      const completedCount = quests.filter(q => q.is_completed).length;
      
      const context = {
        userName: profile?.display_name || 'Founder',
        activeQuests: activeQuests.map(q => q.title),
        completedQuestsCount: completedCount
      };

      const recentMessages = messages.slice(-20).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-cofounder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          message: userMessage,
          context,
          history: recentMessages
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit reached. Please wait a moment and try again.');
        }
        if (response.status === 402) {
          throw new Error('AI credits exhausted. Please add more credits.');
        }
        throw new Error('Failed to get AI response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (line.startsWith(':') || line.trim() === '') continue;
            if (!line.startsWith('data: ')) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                updateLastMessage(assistantContent);
              }
            } catch {
              buffer = line + '\n' + buffer;
              break;
            }
          }
        }
      }

      await addMessage('assistant', assistantContent);

    } catch (error) {
      console.error('AI error:', error);
      updateLastMessage(error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen">
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AI Co-Founder</h1>
              <p className="text-sm text-muted-foreground">Your always-available business partner</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Hey {profile?.display_name || 'there'}!
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  I'm your AI Co-Founder. Ask me anything about strategy, prioritization, 
                  or just chat about what you're building. I remember everything.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                  {['What should I focus on today?', 'Help me break down my goals', 'Review my progress'].map(suggestion => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="bg-card/50 backdrop-blur-xl border-border/50"
                      onClick={() => setInput(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                      : 'bg-card/50 backdrop-blur-xl border border-border/50'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content || '...'}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="shrink-0 p-6 border-t border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Textarea
              placeholder="Ask your AI Co-Founder..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="resize-none bg-card/50 backdrop-blur-xl border-border/50"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              size="icon" 
              className="shrink-0 h-auto w-12 shadow-lg shadow-primary/20"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
