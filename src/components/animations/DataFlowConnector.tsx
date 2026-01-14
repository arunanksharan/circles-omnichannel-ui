'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimationStore } from '@/stores/animation-store';
import { cn } from '@/lib/utils/cn';

interface DataFlowConnectorProps {
  className?: string;
}

export function DataFlowConnector({ className }: DataFlowConnectorProps) {
  const { currentPhase } = useAnimationStore();
  const isActive = currentPhase === 'ingesting' || currentPhase === 'processing';

  return (
    <div className={cn('relative', className)}>
      {/* Main connector line */}
      <div className="absolute inset-0 flex items-center">
        <div
          className={cn(
            'w-full h-px transition-colors duration-500',
            isActive ? 'bg-purple-500/50' : 'bg-white/10'
          )}
        />
      </div>

      {/* Animated particles */}
      {isActive && (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <Particle key={i} delay={i * 0.3} />
          ))}
        </>
      )}

      {/* Start and end dots */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
        <motion.div
          animate={isActive ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className={cn(
            'w-3 h-3 rounded-full border-2 transition-colors',
            isActive
              ? 'bg-purple-500 border-purple-400'
              : 'bg-white/20 border-white/30'
          )}
        />
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
        <motion.div
          animate={isActive ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          className={cn(
            'w-3 h-3 rounded-full border-2 transition-colors',
            isActive
              ? 'bg-green-500 border-green-400'
              : 'bg-white/20 border-white/30'
          )}
        />
      </div>

      {/* Arrow indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={isActive ? { x: [0, 10, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={cn(
            'text-lg transition-colors',
            isActive ? 'text-purple-400' : 'text-white/30'
          )}
        >
          →
        </motion.div>
      </div>
    </div>
  );
}

interface ParticleProps {
  delay: number;
}

function Particle({ delay }: ParticleProps) {
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2"
      initial={{ left: '0%', opacity: 0 }}
      animate={{
        left: ['0%', '100%'],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/50" />
    </motion.div>
  );
}
