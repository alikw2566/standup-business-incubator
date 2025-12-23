import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useQuests } from '@/hooks/useQuests';
import { Sidebar } from '@/components/layout/Sidebar';
import { HUD } from '@/components/layout/HUD';
import { QuestCard } from '@/components/quests/QuestCard';
import { AddQuestDialog } from '@/components/quests/AddQuestDialog';
import { AICoFounder } from '@/components/ai/AICoFounder';
import { Button } from '@/components/ui/button';
import { Plus, Rocket, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateXP, updateStreak } = useProfile();
  const { quests, completeQuest, deleteQuest, addQuest } = useQuests();
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Check and update streak on load
    if (profile?.last_active_date) {
      const lastActive = new Date(profile.last_active_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastActive.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        // Streak broken
        updateStreak(0);
      } else if (diffDays === 1) {
        // New day, increment streak
        updateStreak(profile.current_streak + 1);
      }
    }
  }, [profile?.last_active_date]);

  const handleCompleteQuest = async (questId: string) => {
    const xpEarned = await completeQuest(questId);
    if (xpEarned) {
      await updateXP(xpEarned);
      
      // Trigger confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleAddQuest = async (title: string, description: string) => {
    await addQuest(title, description);
    setShowAddQuest(false);
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar onOpenAI={() => setShowAI(true)} />
      
      <div className="flex-1 flex flex-col">
        <HUD 
          level={profile?.current_level || 1}
          xp={profile?.total_xp || 0}
          streak={profile?.current_streak || 0}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Ready to build, {profile?.display_name || 'Founder'}?
            </h1>
            <p className="text-muted-foreground">
              Complete quests to earn XP and level up your founder journey.
            </p>
          </div>

          {/* Active Quests */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Active Quests
              </h2>
              <Button onClick={() => setShowAddQuest(true)} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Quest
              </Button>
            </div>

            {activeQuests.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground mb-4">No active quests yet.</p>
                <Button onClick={() => setShowAddQuest(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add your first quest
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeQuests.map(quest => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={handleCompleteQuest}
                    onDelete={deleteQuest}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completed Quests */}
          {completedQuests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
                Completed ({completedQuests.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedQuests.slice(0, 6).map(quest => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={handleCompleteQuest}
                    onDelete={deleteQuest}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <AddQuestDialog
        open={showAddQuest}
        onOpenChange={setShowAddQuest}
        onAdd={handleAddQuest}
      />

      <AICoFounder 
        open={showAI} 
        onOpenChange={setShowAI}
        profile={profile}
        quests={quests}
      />
    </div>
  );
}