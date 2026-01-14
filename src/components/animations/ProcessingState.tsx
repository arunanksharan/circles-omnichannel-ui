'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Loader2, CheckCircle, XCircle, Zap } from 'lucide-react';

interface ProcessingStateProps {
  state: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
  className?: string;
}

export function ProcessingState({
  state,
  message,
  className,
}: ProcessingStateProps) {
  const config = {
    idle: {
      icon: <Zap className="w-5 h-5" />,
      color: 'text-white/50',
      bgColor: 'bg-white/5',
      borderColor: 'border-white/10',
      defaultMessage: 'Ready to process',
    },
    processing: {
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      defaultMessage: 'Processing with Graphiti...',
    },
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      defaultMessage: 'Successfully resolved',
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      defaultMessage: 'Error processing data',
    },
  };

  const { icon, color, bgColor, borderColor, defaultMessage } = config[state];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border',
        bgColor,
        borderColor,
        className
      )}
    >
      <span className={color}>{icon}</span>
      <span className={cn('text-sm font-medium', color)}>
        {message || defaultMessage}
      </span>

      {state === 'processing' && (
        <div className="ml-auto flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 rounded-full bg-purple-400"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
