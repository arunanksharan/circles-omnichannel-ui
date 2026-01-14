'use client';

import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'graphiti'
    | 'temporal'
    | 'episode'
    | 'sentiment-positive'
    | 'sentiment-negative'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  className?: string;
}

const variantStyles = {
  default: 'bg-white/10 text-white/70 border-white/20',
  graphiti: 'badge-graphiti',
  temporal: 'badge-temporal',
  episode: 'badge-episode',
  'sentiment-positive': 'badge-sentiment-positive',
  'sentiment-negative': 'badge-sentiment-negative',
  info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  success: 'bg-green-500/20 text-green-300 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
