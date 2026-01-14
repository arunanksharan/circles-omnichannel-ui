'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import type { EpisodeSignal, SentimentSignal } from '@/types/demo';
import { useAnimationStore } from '@/stores/animation-store';
import { Radio, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface EpisodicSignalsCardProps {
  signals: EpisodeSignal[];
  sentiment: SentimentSignal | null;
  isLoading: boolean;
}

export function EpisodicSignalsCard({
  signals,
  sentiment,
  isLoading,
}: EpisodicSignalsCardProps) {
  const { highlightedCards } = useAnimationStore();
  const isHighlighted = highlightedCards.includes('episodic-signals');

  return (
    <Card
      id="episodic-signals"
      variant="glass"
      isHighlighted={isHighlighted}
      highlightColor="purple"
    >
      <CardHeader
        badge={
          <Badge variant="episode" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            NON-AUTHORITATIVE
          </Badge>
        }
      >
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-purple-400" />
          Episodic Signals (What We Observed)
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white/70 mb-4">
          Signals derived from episodes - used for AI context but not stored as facts
        </p>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <LoadingSkeleton />
            </motion.div>
          ) : signals.length > 0 || sentiment ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Sentiment Gauge */}
              {sentiment && <SentimentGauge sentiment={sentiment} />}

              {/* Signals List */}
              {signals.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-white/60 font-medium">
                    Detected Signals
                  </p>
                  <div className="space-y-2">
                    {signals.map((signal, index) => (
                      <SignalItem key={signal.id} signal={signal} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-white/30"
            >
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No episodic signals yet</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

interface SentimentGaugeProps {
  sentiment: SentimentSignal;
}

function SentimentGauge({ sentiment }: SentimentGaugeProps) {
  // Map sentiment score (-1 to 1) to percentage (0 to 100)
  const percentage = ((sentiment.score + 1) / 2) * 100;

  const getSentimentColor = () => {
    if (sentiment.score > 0.3) return 'text-green-400';
    if (sentiment.score < -0.3) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentIcon = () => {
    if (sentiment.score > 0.3) return <TrendingUp className="w-4 h-4" />;
    if (sentiment.score < -0.3) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getSentimentLabel = () => {
    if (sentiment.score > 0.5) return 'Very Positive';
    if (sentiment.score > 0.3) return 'Positive';
    if (sentiment.score > 0.1) return 'Slightly Positive';
    if (sentiment.score > -0.1) return 'Neutral';
    if (sentiment.score > -0.3) return 'Slightly Negative';
    if (sentiment.score > -0.5) return 'Negative';
    return 'Very Negative';
  };

  return (
    <div className="bg-black/30 rounded-lg p-4 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/60 font-medium">
          Overall Sentiment
        </span>
        <div className={cn('flex items-center gap-1', getSentimentColor())}>
          {getSentimentIcon()}
          <span className="text-sm font-medium">{getSentimentLabel()}</span>
        </div>
      </div>

      {/* Gauge Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-30" />

        {/* Indicator */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-white rounded-full shadow-lg"
          initial={{ left: '50%' }}
          animate={{ left: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          style={{ transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1 text-[10px] text-white/40">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>

      {/* Score */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-white/50">
          confidence: {(sentiment.confidence * 100).toFixed(0)}%
        </span>
        <span className="text-white/50">
          score: {sentiment.score.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

interface SignalItemProps {
  signal: EpisodeSignal;
  index: number;
}

function SignalItem({ signal, index }: SignalItemProps) {
  const getImportanceColor = () => {
    if (signal.importance >= 0.8) return 'border-red-500/50 bg-red-500/10';
    if (signal.importance >= 0.5) return 'border-yellow-500/50 bg-yellow-500/10';
    return 'border-white/10 bg-white/5';
  };

  const getImportanceLabel = () => {
    if (signal.importance >= 0.8) return 'HIGH';
    if (signal.importance >= 0.5) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'p-3 rounded-lg border transition-colors',
        getImportanceColor()
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-purple-400">
              {signal.type}
            </span>
            <Badge
              variant={
                signal.importance >= 0.8
                  ? 'error'
                  : signal.importance >= 0.5
                  ? 'warning'
                  : 'default'
              }
              className="text-[10px]"
            >
              {getImportanceLabel()}
            </Badge>
          </div>
          <p className="text-sm text-white/80">{signal.value}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
        <span>source: {signal.source}</span>
        <span>importance: {(signal.importance * 100).toFixed(0)}%</span>
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Sentiment skeleton */}
      <div className="bg-black/30 rounded-lg p-4 border border-white/5">
        <div className="h-4 w-32 bg-white/5 rounded animate-pulse mb-3" />
        <div className="h-2 w-full bg-white/5 rounded animate-pulse" />
      </div>

      {/* Signals skeleton */}
      {[1, 2].map((i) => (
        <div key={i} className="p-3 rounded-lg border border-white/10">
          <div className="h-3 w-20 bg-white/5 rounded animate-pulse mb-2" />
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
