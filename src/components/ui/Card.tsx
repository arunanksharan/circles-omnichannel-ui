'use client';

import { cn } from '@/lib/utils/cn';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'highlight';
  isHighlighted?: boolean;
  highlightColor?: 'purple' | 'blue' | 'green' | 'yellow' | 'cyan';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      isHighlighted = false,
      highlightColor = 'purple',
      ...props
    },
    ref
  ) => {
    const highlightColors = {
      purple: 'rgba(139, 92, 246, 0.5)',
      blue: 'rgba(59, 130, 246, 0.5)',
      green: 'rgba(34, 197, 94, 0.5)',
      yellow: 'rgba(245, 158, 11, 0.5)',
      cyan: 'rgba(6, 182, 212, 0.5)',
    };

    const variants = {
      default: 'bg-white/[0.03] border border-white/[0.08]',
      glass: 'glass-card',
      highlight: 'bg-white/[0.05] border border-white/[0.12]',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-xl p-5 transition-all duration-300',
          variants[variant],
          className
        )}
        animate={{
          boxShadow: isHighlighted
            ? `0 0 30px ${highlightColors[highlightColor]}`
            : '0 0 0 transparent',
        }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
}

function CardHeader({ children, className, badge }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <h3 className="text-sm font-semibold text-white">{children}</h3>
      {badge}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('text-sm text-white/90', className)}>{children}</div>;
}

export { Card, CardHeader, CardContent };
