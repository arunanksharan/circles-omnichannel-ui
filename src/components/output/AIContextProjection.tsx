'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationStore } from '@/stores/animation-store';
import { Cpu, RefreshCw, Copy, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

interface AIContextProjectionProps {
  context: string;
  isLoading: boolean;
  tokenCount?: number;
  maxTokens?: number;
}

export function AIContextProjection({
  context,
  isLoading,
  tokenCount = 0,
  maxTokens = 4096,
}: AIContextProjectionProps) {
  const { highlightedCards } = useAnimationStore();
  const isHighlighted = highlightedCards.includes('ai-context');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(context);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Estimate token count (rough approximation: ~4 chars per token)
  const estimatedTokens = tokenCount || Math.ceil(context.length / 4);
  const tokenPercentage = Math.min((estimatedTokens / maxTokens) * 100, 100);

  return (
    <Card
      id="ai-context"
      variant="glass"
      isHighlighted={isHighlighted}
      highlightColor="cyan"
    >
      <CardHeader
        badge={
          <Badge variant="default" className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300">
            <RefreshCw className="w-3 h-3" />
            DERIVED
          </Badge>
        }
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          AI Context Projection
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-white/70">
            Recomputed on demand from Graphiti facts + episodic signals. Never
            stored - always fresh. This is what an LLM would receive as context.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <LoadingSkeleton />
            </motion.div>
          ) : context ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {/* Token Usage Bar */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/50">Token Usage</span>
                <span className="text-white/60">
                  ~{estimatedTokens.toLocaleString()} / {maxTokens.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    tokenPercentage > 80
                      ? 'bg-red-500'
                      : tokenPercentage > 50
                      ? 'bg-yellow-500'
                      : 'bg-cyan-500'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${tokenPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              {/* Context Display */}
              <div className="relative group">
                <pre className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-auto max-h-64 text-xs font-mono text-white/80 whitespace-pre-wrap">
                  {context}
                </pre>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className={cn(
                    'absolute top-2 right-2 p-2 rounded-md transition-all',
                    'bg-white/5 hover:bg-white/10',
                    'opacity-0 group-hover:opacity-100'
                  )}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/60" />
                  )}
                </button>
              </div>

              {/* Labels */}
              <div className="flex flex-wrap gap-2">
                <ContextLabel
                  icon={<RefreshCw className="w-3 h-3" />}
                  text="Recomputed on request"
                />
                <ContextLabel
                  icon={<AlertCircle className="w-3 h-3" />}
                  text="Not persisted"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-white/30"
            >
              <Cpu className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No context projection yet</p>
              <p className="text-xs mt-1">
                Submit data to generate AI context
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

interface ContextLabelProps {
  icon: React.ReactNode;
  text: string;
}

function ContextLabel({ icon, text }: ContextLabelProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/70">
      {icon}
      {text}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {/* Token bar skeleton */}
      <div className="h-1.5 bg-white/5 rounded-full animate-pulse" />

      {/* Content skeleton */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="h-3 bg-white/5 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>

      {/* Labels skeleton */}
      <div className="flex gap-2">
        <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
        <div className="h-6 w-24 bg-white/5 rounded animate-pulse" />
      </div>
    </div>
  );
}
