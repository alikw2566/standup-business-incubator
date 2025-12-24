import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useQuests } from '@/hooks/useQuests';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckSquare, Bot, ArrowRight, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const { quests } = useQuests();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

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
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Ready to build, {profile?.display_name || 'Founder'}?
          </h1>
          <p className="text-muted-foreground text-lg">
            Your AI Co-Founder is ready to help you crush it today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* AI Co-Founder Card */}
          <Link to="/ai">
            <Card className="group h-full bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Bot className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                      AI Co-Founder
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-muted-foreground">
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
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <CheckSquare className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                      Tasks
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-muted-foreground">
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
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No tasks yet. Let's get started!</p>
                <Button variant="outline" asChild>
                  <Link to="/tasks">Add your first task</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeQuests.slice(0, 3).map(quest => (
                <Card key={quest.id} className="bg-card/50 backdrop-blur-xl border-border/50">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full bg-primary/50" />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{quest.title}</h3>
                        {quest.description && (
                          <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                        )}
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
    </AppLayout>
  );
}
