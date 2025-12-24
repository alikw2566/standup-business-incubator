import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuests } from '@/hooks/useQuests';
import { useProfile } from '@/hooks/useProfile';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AddQuestDialog } from '@/components/quests/AddQuestDialog';
import { QuestCard } from '@/components/quests/QuestCard';
import { Plus, Loader2, CheckSquare, Trophy, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export default function Tasks() {
  const { user, loading: authLoading } = useAuth();
  const { quests, completeQuest, deleteQuest, addQuest } = useQuests();
  const { profile, updateXP } = useProfile();
  const [showAddQuest, setShowAddQuest] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleCompleteQuest = async (questId: string) => {
    const xpEarned = await completeQuest(questId);
    
    if (xpEarned) {
      await updateXP(xpEarned);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast({
        title: `+${xpEarned} XP earned!`,
        description: 'Quest completed. Keep up the momentum!',
      });
    }
  };

  const handleAddQuest = async (title: string, description: string) => {
    await addQuest(title, description, 25);
    setShowAddQuest(false);
    
    toast({
      title: 'Quest added!',
      description: 'Complete it to earn 25 XP.',
    });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeQuests = quests.filter(q => !q.is_completed);
  const completedQuests = quests.filter(q => q.is_completed);
  const totalXPPending = activeQuests.reduce((acc, q) => acc + q.xp_reward, 0);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage your daily quests and goals</p>
          </div>
          <div className="flex items-center gap-3">
            {totalXPPending > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{totalXPPending} XP pending</span>
              </div>
            )}
            <Button onClick={() => setShowAddQuest(true)} className="shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-3 md:p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <CheckSquare className="h-4 w-4" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground">{activeQuests.length}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-3 md:p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Trophy className="h-4 w-4" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground">{completedQuests.length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-3 md:p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Zap className="h-4 w-4" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground">{profile?.total_xp || 0}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Tasks */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Active ({activeQuests.length})
          </h2>
          
          {activeQuests.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 border-dashed">
              <CardContent className="py-10 md:py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
                  <CheckSquare className="h-7 w-7 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">No active tasks yet</p>
                <Button onClick={() => setShowAddQuest(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first task
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  id={quest.id}
                  title={quest.title}
                  description={quest.description}
                  xpReward={quest.xp_reward}
                  isCompleted={false}
                  onComplete={handleCompleteQuest}
                  onDelete={deleteQuest}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {completedQuests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Completed ({completedQuests.length})
            </h2>
            <div className="space-y-3">
              {completedQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  id={quest.id}
                  title={quest.title}
                  description={quest.description}
                  xpReward={quest.xp_reward}
                  isCompleted={true}
                  onComplete={handleCompleteQuest}
                  onDelete={deleteQuest}
                />
              ))}
            </div>
          </div>
        )}

        <AddQuestDialog
          open={showAddQuest}
          onOpenChange={setShowAddQuest}
          onAdd={handleAddQuest}
        />
      </div>
    </AppLayout>
  );
}
