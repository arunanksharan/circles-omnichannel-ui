'use client';

import { motion } from 'framer-motion';
import { useDemoStore } from '@/stores/demo-store';
import {
  BusinessEventInput,
  ConversationInput,
  PersonalContextInput,
  PersonalContextPresetSelector,
  PresetSelector,
  SubmitButton,
  ResetButton,
} from '@/components/input';
import { useAnimationStore } from '@/stores/animation-store';
import { cn } from '@/lib/utils/cn';
import { Settings, Zap } from 'lucide-react';
import type { DemoMode } from '@/types/demo';

export function LeftPanel() {
  const {
    businessEvent,
    conversationTranscript,
    conversationMetadata,
    personalContextTranscript,
    selectedPreset,
    isSubmitting,
    mode,
    setBusinessEvent,
    setConversationTranscript,
    setConversationMetadata,
    setPersonalContextTranscript,
    loadPreset,
    submitToGraphiti,
    reset,
    setMode,
  } = useDemoStore();

  const { currentPhase } = useAnimationStore();

  const canSubmit = businessEvent || conversationTranscript.trim().length > 0 || personalContextTranscript.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Omnichannel Inputs
          </h2>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
        <p className="text-sm text-white/70">
          Raw data from various channels before temporal resolution
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
        {/* Business Event Input */}
        <BusinessEventInput
          value={businessEvent}
          onChange={setBusinessEvent}
        />

        {/* ===== TELECOM SECTION ===== */}
        {/* Demo Preset Selector - Telecom Scenarios */}
        <PresetSelector selectedPreset={selectedPreset} onSelect={loadPreset} />

        {/* Customer Support Conversation Input */}
        <ConversationInput
          transcript={conversationTranscript}
          metadata={conversationMetadata}
          onTranscriptChange={setConversationTranscript}
          onMetadataChange={setConversationMetadata}
        />

        {/* ===== PERSONAL CONTEXT SECTION ===== */}
        {/* Personal Context Preset Selector - Avatar/Replika-style memories */}
        <PersonalContextPresetSelector selectedPreset={selectedPreset} onSelect={loadPreset} />

        {/* Personal Context Conversation Input */}
        <PersonalContextInput
          transcript={personalContextTranscript}
          onTranscriptChange={setPersonalContextTranscript}
        />
      </div>

      {/* Footer Actions */}
      <div
        className={cn(
          'flex-shrink-0 pt-4 mt-4 border-t border-white/10',
          'flex items-center gap-3'
        )}
      >
        <div className="flex-1">
          <SubmitButton
            onClick={submitToGraphiti}
            isSubmitting={isSubmitting}
            disabled={!canSubmit}
          />
        </div>
        <ResetButton onClick={reset} disabled={isSubmitting} />
      </div>

      {/* Processing Indicator */}
      {currentPhase !== 'idle' && currentPhase !== 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs text-purple-300">
              {currentPhase === 'ingesting' && 'Ingesting data...'}
              {currentPhase === 'processing' && 'Processing with Graphiti...'}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

interface ModeToggleProps {
  mode: DemoMode;
  onChange: (mode: DemoMode) => void;
}

function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const isMockMode = mode === 'mock';

  return (
    <button
      onClick={() => onChange(isMockMode ? 'live' : 'mock')}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
        isMockMode
          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
          : 'bg-green-500/20 text-green-300 border border-green-500/30'
      )}
    >
      <Settings className="w-3 h-3" />
      {isMockMode ? 'Mock Mode' : 'Live API'}
    </button>
  );
}
