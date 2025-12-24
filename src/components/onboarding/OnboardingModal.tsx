import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Target, Rocket, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onComplete: (data: { displayName: string; firstGoal: string }) => void;
}

const steps = [
  {
    icon: Zap,
    title: 'Welcome to StandUp!',
    description: 'Your AI co-founder is ready to help you build. Let\'s set you up for success.',
  },
  {
    icon: Target,
    title: 'What\'s your name?',
    description: 'How should your AI co-founder address you?',
    field: 'displayName',
    placeholder: 'Enter your name',
  },
  {
    icon: Rocket,
    title: 'What are you building?',
    description: 'This becomes your first goal. Your AI will help you break it down.',
    field: 'firstGoal',
    placeholder: 'e.g., Launch my SaaS MVP',
  },
];

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [firstGoal, setFirstGoal] = useState('');

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ displayName: displayName.trim(), firstGoal: firstGoal.trim() });
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return true;
    if (currentStep === 1) return displayName.trim().length > 0;
    if (currentStep === 2) return firstGoal.trim().length > 0;
    return true;
  };

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 relative">
              <StepIcon className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {currentStep + 1}
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl">{step.title}</DialogTitle>
          <DialogDescription className="text-base">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
                <Sparkles className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-medium text-foreground">AI-Powered Guidance</div>
                  <div className="text-sm text-muted-foreground">Get strategic advice anytime</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
                <Target className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Goal Tracking</div>
                  <div className="text-sm text-muted-foreground">Earn XP and level up</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
                <Rocket className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Daily Momentum</div>
                  <div className="text-sm text-muted-foreground">Build streaks and ship faster</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-2">
              <Label htmlFor="displayName">Your Name</Label>
              <Input
                id="displayName"
                placeholder={step.placeholder}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoFocus
                className="h-12 text-lg"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-2">
              <Label htmlFor="firstGoal">Your First Goal</Label>
              <Input
                id="firstGoal"
                placeholder={step.placeholder}
                value={firstGoal}
                onChange={(e) => setFirstGoal(e.target.value)}
                autoFocus
                className="h-12 text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Don't worry, you can always add more goals later
              </p>
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep 
                  ? 'w-8 bg-primary' 
                  : i < currentStep 
                    ? 'w-2 bg-primary/50' 
                    : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={handleNext} 
          disabled={!canProceed()}
          className="w-full h-12 text-base shadow-lg shadow-primary/20"
        >
          {currentStep === steps.length - 1 ? (
            <>
              Let's Go!
              <Rocket className="h-5 w-5 ml-2" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
