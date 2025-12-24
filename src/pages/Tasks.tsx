import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuests } from '@/hooks/useQuests';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddQuestDialog } from '@/components/quests/AddQuestDialog';
import { Plus, Check, Trash2, Loader2, CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Tasks() {
  const { user, loading: authLoading } = useAuth();
  const { quests, completeQuest, deleteQuest, addQuest } = useQuests();
  const [showAddQuest, setShowAddQuest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleCompleteQuest = async (questId: string) => {
    await completeQuest(questId);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
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
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage your daily quests and goals</p>
          </div>
          <Button onClick={() => setShowAddQuest(true)} className="shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Active Tasks */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Active ({activeQuests.length})
          </h2>
          
          {activeQuests.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 border-dashed">
              <CardContent className="py-12 text-center">
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
                <Card key={quest.id} className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/30 transition-all">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 h-8 w-8 rounded-full border-primary/30 hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleCompleteQuest(quest.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">{quest.title}</h3>
                        {quest.description && (
                          <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteQuest(quest.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {completedQuests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-muted-foreground mb-4">
              Completed ({completedQuests.length})
            </h2>
            <div className="space-y-3">
              {completedQuests.map(quest => (
                <Card key={quest.id} className="bg-card/30 backdrop-blur-xl border-border/30 opacity-60">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground line-through">{quest.title}</h3>
                        {quest.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-through">{quest.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteQuest(quest.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
