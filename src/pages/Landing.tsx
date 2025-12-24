import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Zap, Bot, CheckSquare, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">StandUp</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button className="shadow-lg shadow-primary/25">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Your AI-Powered Business Operating System
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Build Faster with Your{' '}
            <span className="text-primary">AI Co-Founder</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Stop grinding alone. StandUp gives you an AI business partner that remembers everything, 
            helps you prioritize, and keeps you accountable every single day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6 shadow-xl shadow-primary/30">
                Start Building Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-32 max-w-4xl mx-auto">
          {/* AI Co-Founder Card */}
          <div className="group relative p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-6">
                <Bot className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">AI Co-Founder</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your always-available business partner. Get strategic advice, break down goals, 
                and stay accountable with an AI that remembers every conversation.
              </p>
            </div>
          </div>

          {/* Task Management Card */}
          <div className="group relative p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-6">
                <CheckSquare className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">Smart Task Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Turn big goals into actionable tasks. Track your progress, celebrate wins, 
                and keep moving forward every single day.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 StandUp. Built for founders, by founders.
          </p>
        </div>
      </footer>
    </div>
  );
}
