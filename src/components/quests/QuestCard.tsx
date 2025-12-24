import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Trash2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestCardProps {
  id: string;
  title: string;
  description?: string | null;
  xpReward: number;
  isCompleted: boolean;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuestCard({ 
  id, 
  title, 
  description, 
  xpReward, 
  isCompleted,
  onComplete,
  onDelete 
}: QuestCardProps) {
  return (
    <Card className={cn(
      "group transition-all duration-300",
      isCompleted 
        ? "bg-card/30 backdrop-blur-xl border-border/30 opacity-60" 
        : "bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    )}>
      <CardContent className="py-4 px-4 sm:px-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {isCompleted ? (
            <div className="shrink-0 h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="h-5 w-5 text-primary" />
            </div>
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 h-9 w-9 rounded-full border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              onClick={() => onComplete(id)}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-medium text-foreground",
                isCompleted && "line-through"
              )}>
                {title}
              </h3>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0",
                isCompleted 
                  ? "bg-muted text-muted-foreground" 
                  : "bg-primary/10 text-primary"
              )}>
                <Zap className="h-3 w-3" />
                {xpReward} XP
              </div>
            </div>
            {description && (
              <p className={cn(
                "text-sm text-muted-foreground mt-1",
                isCompleted && "line-through"
              )}>
                {description}
              </p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
