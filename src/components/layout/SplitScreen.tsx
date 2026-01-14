'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface SplitScreenProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}

export function SplitScreen({ left, right, className }: SplitScreenProps) {
  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden',
        'bg-black/20 backdrop-blur-xl border border-white/5',
        className
      )}
    >
      {/* Left Panel */}
      <motion.div
        className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-purple-950/10 to-transparent border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {left}
      </motion.div>

      {/* Animated Divider - Desktop only */}
      <div className="hidden lg:flex items-center justify-center relative w-8">
        <DataFlowDivider />
      </div>

      {/* Right Panel */}
      <motion.div
        className="flex-1 p-6 lg:p-8 bg-gradient-to-bl from-blue-950/10 to-transparent overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {right}
      </motion.div>
    </div>
  );
}

function DataFlowDivider() {
  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      {/* Vertical line */}
      <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent absolute" />

      {/* Animated pulse dots */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"
        animate={{
          y: [-150, 150],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50"
        animate={{
          y: [-150, 150],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.8,
        }}
      />
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
        animate={{
          y: [-150, 150],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.6,
        }}
      />

      {/* Arrow indicator */}
      <div className="absolute bg-black/40 rounded-full p-1.5 border border-white/10">
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/50 text-xs"
        >
          →
        </motion.div>
      </div>
    </div>
  );
}
