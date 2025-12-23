import { Flame, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface HUDProps {
  level: number;
  xp: number;
  streak: number;
}

export function HUD({ level, xp, streak }: HUDProps) {
  // XP needed for next level (100 XP per level)
  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const xpProgress = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = (xpProgress / xpNeeded) * 100;

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
      {/* Left: Level & Progress */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Level</p>
            <p className="text-lg font-bold text-foreground">{level}</p>
          </div>
        </div>
        
        <div className="hidden sm:block w-48">
          <p className="text-xs text-muted-foreground mb-1">
            {xpProgress} / {xpNeeded} XP
          </p>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* Right: Streak */}
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
          <Flame className={`h-5 w-5 ${streak > 0 ? 'text-warning animate-pulse' : 'text-muted-foreground'}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="text-lg font-bold text-foreground">{streak} days</p>
        </div>
      </div>
    </header>
  );
}