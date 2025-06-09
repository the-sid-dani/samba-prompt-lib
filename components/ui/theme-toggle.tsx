'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ 
  variant = 'ghost', 
  size = 'icon',
  showLabel = false,
  className 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-4 w-4" />;
    }
    return resolvedTheme === 'dark' ? (
      <Moon className="h-4 w-4" />
    ) : (
      <Sun className="h-4 w-4" />
    );
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Theme';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={cn(
            'transition-all duration-200 hover:scale-105 active:scale-95',
            showLabel && 'gap-2',
            className
          )}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
          aria-expanded="false"
        >
          <div className="relative flex items-center justify-center">
            {/* Animated background glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
            
            {/* Icon with smooth transition */}
            <div className="relative transition-transform duration-300 hover:rotate-12">
              {toggleIcon()}
            </div>
          </div>
          
          {showLabel && (
            <span className="text-sm font-medium">
              {getThemeLabel()}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-40 bg-background/95 backdrop-blur-sm border shadow-lg"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={cn(
            'flex items-center gap-2 cursor-pointer transition-colors duration-150',
            theme === 'light' && 'bg-primary/10 text-primary'
          )}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={cn(
            'flex items-center gap-2 cursor-pointer transition-colors duration-150',
            theme === 'dark' && 'bg-primary/10 text-primary'
          )}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={cn(
            'flex items-center gap-2 cursor-pointer transition-colors duration-150',
            theme === 'system' && 'bg-primary/10 text-primary'
          )}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === 'system' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 