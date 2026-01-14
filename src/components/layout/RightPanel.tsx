'use client';

import { motion } from 'framer-motion';
import { useDemoStore } from '@/stores/demo-store';
import {
  CurrentStateCard,
  TemporalHistoryTimeline,
  EpisodicSignalsCard,
  AIContextProjection,
} from '@/components/output';
import { KnowledgeGraph } from '@/components/graph';
import { useAnimationStore } from '@/stores/animation-store';
import { cn } from '@/lib/utils/cn';
import { Database, Sparkles } from 'lucide-react';

export function RightPanel() {
  const {
    currentGraphitiState,
    temporalFacts,
    episodicSignals,
    sentimentSignal,
    aiContextProjection,
    isSubmitting,
    lastSubmitTime,
  } = useDemoStore();

  const { currentPhase } = useAnimationStore();

  const isProcessing = currentPhase === 'processing' || currentPhase === 'ingesting';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-green-400" />
            Graphiti Context Engine
          </h2>
          {currentPhase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs"
            >
              <Sparkles className="w-3 h-3" />
              Resolved
            </motion.div>
          )}
        </div>
        <p className="text-sm text-white/50">
          Authoritative temporal facts derived from all channels
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
        {/* Current State Card */}
        <CurrentStateCard
          state={currentGraphitiState}
          isLoading={isProcessing}
          lastUpdated={lastSubmitTime}
        />

        {/* Knowledge Graph Visualization */}
        <KnowledgeGraph
          state={currentGraphitiState}
          facts={temporalFacts}
          isLoading={isProcessing}
        />

        {/* Temporal History Timeline */}
        <TemporalHistoryTimeline
          facts={temporalFacts}
          isLoading={isProcessing}
        />

        {/* Episodic Signals Card */}
        <EpisodicSignalsCard
          signals={episodicSignals}
          sentiment={sentimentSignal}
          isLoading={isProcessing}
        />

        {/* AI Context Projection */}
        <AIContextProjection
          context={aiContextProjection}
          isLoading={isProcessing}
        />
      </div>

      {/* Footer Info */}
      {lastSubmitTime && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'flex-shrink-0 pt-4 mt-4 border-t border-white/10',
            'flex items-center justify-between text-xs text-white/40'
          )}
        >
          <span>Last resolved: {lastSubmitTime.toLocaleTimeString()}</span>
          <span>
            {temporalFacts.length} facts | {episodicSignals.length} signals
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
