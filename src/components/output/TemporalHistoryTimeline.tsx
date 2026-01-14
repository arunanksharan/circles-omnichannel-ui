'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import type { TemporalFact } from '@/types/demo';
import { useAnimationStore } from '@/stores/animation-store';
import { History, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface TemporalHistoryTimelineProps {
  facts: TemporalFact[];
  isLoading: boolean;
}

export function TemporalHistoryTimeline({
  facts,
  isLoading,
}: TemporalHistoryTimelineProps) {
  const { highlightedCards, highlightedFacts } = useAnimationStore();
  const isHighlighted = highlightedCards.includes('temporal-history');

  // Sort facts by valid_from date (most recent first)
  const sortedFacts = [...facts].sort(
    (a, b) => new Date(b.valid_from).getTime() - new Date(a.valid_from).getTime()
  );

  return (
    <Card
      id="temporal-history"
      variant="glass"
      isHighlighted={isHighlighted}
      highlightColor="yellow"
    >
      <CardHeader badge={<Badge variant="temporal">TEMPORAL</Badge>}>
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-yellow-400" />
          Temporal Fact History (Why This Is True)
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white/70 mb-4">
          Older facts are retained but not active (valid_to is set)
        </p>

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
          ) : sortedFacts.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />

              {/* Facts */}
              <div className="space-y-4">
                {sortedFacts.map((fact, index) => (
                  <TimelineItem
                    key={fact.id}
                    fact={fact}
                    index={index}
                    isHighlighted={highlightedFacts.includes(fact.id)}
                  />
                ))}
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
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No temporal facts yet</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

interface TimelineItemProps {
  fact: TemporalFact;
  index: number;
  isHighlighted: boolean;
}

function TimelineItem({ fact, index, isHighlighted }: TimelineItemProps) {
  const isActive = fact.valid_to === null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative pl-6 py-2',
        isHighlighted && 'bg-yellow-500/10 -mx-2 px-8 rounded'
      )}
    >
      {/* Timeline dot */}
      <div
        className={cn(
          'absolute left-0 top-3 w-4 h-4 rounded-full border-2 flex items-center justify-center',
          isActive
            ? 'bg-green-500/20 border-green-500'
            : 'bg-white/5 border-white/20'
        )}
      >
        {isActive ? (
          <Check className="w-2 h-2 text-green-400" />
        ) : (
          <X className="w-2 h-2 text-white/40" />
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-purple-400">
            {fact.fact_type}
          </span>
          {isActive && (
            <Badge variant="success" className="text-[10px]">
              CURRENT
            </Badge>
          )}
        </div>
        <p className="text-sm text-white/80">{fact.value}</p>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <span>
            valid_from: {new Date(fact.valid_from).toLocaleString()}
          </span>
          {fact.valid_to && (
            <span>
              valid_to: {new Date(fact.valid_to).toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/40">derived_from:</span>
          <Badge variant="default" className="text-[10px]">
            {fact.derived_from}
          </Badge>
          <span className="text-white/40">
            confidence: {(fact.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 pl-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
