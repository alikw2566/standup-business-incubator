import { Quest } from '@/hooks/useQuests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Trash2, Sparkles } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuestCard({ quest, onComplete, onDelete }: QuestCardProps) {
  const isCompleted = quest.is_completed;

  return (
    <Card className={`transition-all duration-200 ${
      isCompleted 
        ? 'opacity-60 bg-muted/50' 
        : 'hover:shadow-md hover:border-primary/30'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className={`text-lg ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
            {quest.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            <Sparkles className="h-3 w-3" />
            +{quest.xp_reward} XP
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {quest.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {quest.description}
          </p>
        )}
        
        <div className="flex items-center gap-2">
          {!isCompleted && (
            <Button 
              onClick={() => onComplete(quest.id)} 
              size="sm"
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
          <Button 
            onClick={() => onDelete(quest.id)} 
            size="sm" 
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}