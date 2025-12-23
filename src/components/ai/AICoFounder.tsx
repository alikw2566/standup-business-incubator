import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Profile } from '@/hooks/useProfile';
import { Quest } from '@/hooks/useQuests';
import { Bot, Send, User, Loader2 } from 'lucide-react';

interface AICoFounderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  quests: Quest[];
}

export function AICoFounder({ open, onOpenChange, profile, quests }: AICoFounderProps) {
  const { messages, addMessage, addOptimisticMessage, updateLastMessage } = useChatMessages();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

    // Add user message to DB
    await addMessage('user', userMessage);
    
    // Add optimistic assistant message
    addOptimisticMessage('assistant', '');

    try {
      // Build context for AI
      const activeQuests = quests.filter(q => !q.is_completed);
      const completedCount = quests.filter(q => q.is_completed).length;
      
      const context = {
        userName: profile?.display_name || 'Founder',
        level: profile?.current_level || 1,
        totalXP: profile?.total_xp || 0,
        streak: profile?.current_streak || 0,
        activeQuests: activeQuests.map(q => q.title),
        completedQuestsCount: completedCount
      };

      // Get conversation history (last 20 messages for context)
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

      // Handle streaming response
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

      // Save the complete assistant message to DB
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            AI Co-Founder
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Hey {profile?.display_name || 'there'}! I'm your AI Co-Founder. 
                  Ask me anything about strategy, prioritization, or just chat about what you're building.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content || '...'}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask your AI Co-Founder..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              size="icon" 
              className="shrink-0 h-auto"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}