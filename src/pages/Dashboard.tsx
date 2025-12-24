import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useQuests } from '@/hooks/useQuests';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XPProgressCard } from '@/components/dashboard/XPProgressCard';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { Loader2, CheckSquare, Bot, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { profile, fetchProfile } = useProfile();
  const { quests, addQuest } = useQuests();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Check if new user needs onboarding
  useEffect(() => {
    if (profile && !profile.display_name) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const handleOnboardingComplete = async (data: { displayName: string; firstGoal: string }) => {
    if (!user) return;

    // Update profile with display name
    await supabase
      .from('profiles')
      .update({ display_name: data.displayName })
      .eq('user_id', user.id);

    // Add first goal as a quest
    if (data.firstGoal) {
      await addQuest(data.firstGoal, 'Your first goal on StandUp!', 50);
    }

    await fetchProfile();
    setShowOnboarding(false);
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
  const totalXPEarned = completedQuests.reduce((acc, q) => acc + q.xp_reward, 0);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 md:space-y-8">
        {/* Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">
              Ready to build, {profile?.display_name || 'Founder'}?
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Your AI Co-Founder is ready to help you crush it today.
            </p>
          </div>
          {completedQuests.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 shrink-0">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">{totalXPEarned}</span>
              <span className="text-sm text-muted-foreground">XP earned</span>
            </div>
          )}
        </div>

        {/* XP Progress Card */}
        <XPProgressCard 
          level={profile?.current_level || 1}
          totalXP={profile?.total_xp || 0}
          currentStreak={profile?.current_streak || 0}
        />

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* AI Co-Founder Card */}
          <Link to="/ai">
            <Card className="group h-full bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/5">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Bot className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                      AI Co-Founder
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Get strategic advice, break down goals, and stay accountable
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Tasks Card */}
          <Link to="/tasks">
            <Card className="group h-full bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/5">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <CheckSquare className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                      Tasks
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {activeQuests.length} active · {completedQuests.length} completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Today's Focus */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Today's Focus
          </h2>
          
          {activeQuests.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 border-dashed">
              <CardContent className="py-10 md:py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
                  <CheckSquare className="h-7 w-7 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">No tasks yet. Let's get started!</p>
                <Button variant="outline" asChild>
                  <Link to="/tasks">Add your first task</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeQuests.slice(0, 3).map(quest => (
                <Card key={quest.id} className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/30 transition-all">
                  <CardContent className="py-4 px-4 md:px-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="h-3 w-3 rounded-full bg-primary/50" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{quest.title}</h3>
                        {quest.description && (
                          <p className="text-sm text-muted-foreground mt-1 truncate">{quest.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                        <Zap className="h-3 w-3" />
                        {quest.xp_reward} XP
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {activeQuests.length > 3 && (
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/tasks">
                    View all {activeQuests.length} tasks
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <OnboardingModal 
        open={showOnboarding} 
        onComplete={handleOnboardingComplete}
      />
    </AppLayout>
  );
}
