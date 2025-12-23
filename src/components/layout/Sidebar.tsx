import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Bot, 
  LogOut,
  Zap
} from 'lucide-react';

interface SidebarProps {
  onOpenAI: () => void;
}

export function Sidebar({ onOpenAI }: SidebarProps) {
  const { signOut } = useAuth();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">StandUp</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3 h-11">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-11"
          onClick={onOpenAI}
        >
          <Bot className="h-5 w-5" />
          AI Co-Founder
        </Button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}