import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Zap, Star } from 'lucide-react';

interface XPProgressCardProps {
  level: number;
  totalXP: number;
  currentStreak: number;
}

export function XPProgressCard({ level, totalXP, currentStreak }: XPProgressCardProps) {
  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeeded = 100;
  const progress = (xpInCurrentLevel / xpNeeded) * 100;

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-card/50 to-card/50 backdrop-blur-xl border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">Level {level}</div>
              <div className="text-sm text-muted-foreground">{totalXP} total XP</div>
            </div>
          </div>
          
          {currentStreak > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Flame className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">{currentStreak}</span>
              <span className="text-sm text-muted-foreground">day streak</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {level + 1}</span>
            <span className="font-medium text-foreground">{xpInCurrentLevel} / {xpNeeded} XP</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Zap className="h-4 w-4" />
            </div>
            <div className="text-lg font-bold text-foreground">{totalXP}</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Star className="h-4 w-4" />
            </div>
            <div className="text-lg font-bold text-foreground">{level}</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Flame className="h-4 w-4" />
            </div>
            <div className="text-lg font-bold text-foreground">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
