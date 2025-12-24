import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Zap, Bot, CheckSquare, ArrowRight, Sparkles, Target, 
  TrendingUp, Users, Star, Flame, Trophy, Clock
} from 'lucide-react';

const stats = [
  { label: 'Active Founders', value: '2,500+' },
  { label: 'Tasks Completed', value: '50,000+' },
  { label: 'Goals Achieved', value: '10,000+' },
];

const steps = [
  {
    icon: Sparkles,
    title: 'Sign Up in Seconds',
    description: 'Create your account and meet your AI Co-Founder instantly.',
  },
  {
    icon: Target,
    title: 'Set Your Goals',
    description: 'Tell your AI what you\'re building. It remembers everything.',
  },
  {
    icon: TrendingUp,
    title: 'Ship Every Day',
    description: 'Get daily guidance, track progress, and celebrate wins.',
  },
];

const features = [
  {
    icon: Bot,
    title: 'AI Co-Founder',
    description: 'Strategic advice 24/7. Break down goals, get unstuck, stay accountable.',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: CheckSquare,
    title: 'Smart Tasks',
    description: 'Gamified task management. Earn XP, level up, build streaks.',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: Flame,
    title: 'Streaks & Momentum',
    description: 'Never miss a day. Build habits that compound into success.',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: Trophy,
    title: 'Progress Tracking',
    description: 'Watch your level grow. Celebrate milestones. See how far you\'ve come.',
    gradient: 'from-primary/20 to-primary/5',
  },
];

const testimonials = [
  {
    quote: "StandUp keeps me accountable when motivation fades. My AI co-founder remembers everything.",
    author: "Sarah K.",
    role: "Indie Hacker",
  },
  {
    quote: "The gamification makes grinding actually fun. I've shipped more in 30 days than 6 months alone.",
    author: "Marcus T.",
    role: "Startup Founder",
  },
  {
    quote: "Having an AI that understands my business context is a game-changer for daily prioritization.",
    author: "Elena R.",
    role: "Solo Entrepreneur",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">StandUp</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button className="shadow-lg shadow-primary/25" size="sm" asChild>
            <Link to="/auth?mode=signup">
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-16 md:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 md:mb-8 backdrop-blur-sm animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Your AI-Powered Business Operating System
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 md:mb-6 tracking-tight animate-fade-in [animation-delay:100ms]">
              Stop Grinding Alone.{' '}
              <span className="text-primary relative">
                Ship Faster.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5Q50 1 100 5.5T199 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary/40"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms] px-4">
              Your AI co-founder remembers everything, helps you prioritize, and keeps you accountable. 
              Turn goals into shipped products.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:300ms]">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-xl shadow-primary/30 hover-scale" asChild>
                <Link to="/auth?mode=signup">
                  Start Building Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Setup takes 30 seconds
              </p>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 md:mt-16 animate-fade-in [animation-delay:400ms]">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 border-t border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From idea to shipped product in three simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {steps.map((step, i) => (
                <div 
                  key={step.title}
                  className="relative p-6 md:p-8 rounded-2xl bg-background/50 border border-border/50 text-center animate-fade-in"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-lg shadow-primary/30">
                    {i + 1}
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4 mt-2">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Ship
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Built for founders who want to move fast and stay consistent
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div 
                  key={feature.title}
                  className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 animate-fade-in hover-scale"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 border-t border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                <Users className="h-4 w-4" />
                Loved by Founders
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                What Builders Say
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <div 
                  key={testimonial.author}
                  className="p-6 rounded-2xl bg-background/50 border border-border/50 animate-fade-in"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 leading-relaxed">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">
              Ready to Stop Procrastinating?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of founders who ship every single day with their AI co-founder.
            </p>
            <Button size="lg" className="text-lg px-10 py-6 shadow-xl shadow-primary/30 hover-scale" asChild>
              <Link to="/auth?mode=signup">
                Start Building Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 StandUp. Built for founders, by founders.
          </p>
        </div>
      </footer>
    </div>
  );
}
