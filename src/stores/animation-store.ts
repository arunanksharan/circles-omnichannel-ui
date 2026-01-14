'use client';

import { create } from 'zustand';
import type { AnimationPhase, ProcessingStep } from '@/types/demo';

interface AnimationState {
  // Current animation phase
  currentPhase: AnimationPhase;

  // Data flow animation
  dataFlowActive: boolean;
  dataFlowProgress: number; // 0-100

  // Highlighted elements
  highlightedFacts: string[];
  highlightedCards: string[];

  // Graph visualization
  graphFocusNodeId: string | null;

  // Processing steps visualization
  processingSteps: ProcessingStep[];

  // Actions
  setPhase: (phase: AnimationPhase) => void;
  startDataFlow: () => void;
  stopDataFlow: () => void;
  setDataFlowProgress: (progress: number) => void;
  highlightFacts: (factIds: string[]) => void;
  highlightCards: (cardIds: string[]) => void;
  focusGraphNode: (nodeId: string | null) => void;
  setProcessingSteps: (steps: ProcessingStep[]) => void;
  updateProcessingStep: (stepId: string, status: ProcessingStep['status']) => void;
  resetAnimations: () => void;

  // Animation sequences
  playIngestionSequence: () => Promise<void>;
  playProcessingSequence: () => Promise<void>;
  playCompletionSequence: () => Promise<void>;
}

const initialState = {
  currentPhase: 'idle' as AnimationPhase,
  dataFlowActive: false,
  dataFlowProgress: 0,
  highlightedFacts: [] as string[],
  highlightedCards: [] as string[],
  graphFocusNodeId: null,
  processingSteps: [] as ProcessingStep[],
};

const DEFAULT_PROCESSING_STEPS: ProcessingStep[] = [
  { id: 'ingest', label: 'Ingesting data', status: 'pending' },
  { id: 'extract', label: 'Extracting facts', status: 'pending' },
  { id: 'resolve', label: 'Resolving temporality', status: 'pending' },
  { id: 'context', label: 'Building context', status: 'pending' },
];

export const useAnimationStore = create<AnimationState>((set, get) => ({
  ...initialState,
  processingSteps: DEFAULT_PROCESSING_STEPS,

  setPhase: (phase) => set({ currentPhase: phase }),

  startDataFlow: () => set({ dataFlowActive: true, dataFlowProgress: 0 }),

  stopDataFlow: () => set({ dataFlowActive: false, dataFlowProgress: 0 }),

  setDataFlowProgress: (progress) => set({ dataFlowProgress: progress }),

  highlightFacts: (factIds) => set({ highlightedFacts: factIds }),

  highlightCards: (cardIds) => set({ highlightedCards: cardIds }),

  focusGraphNode: (nodeId) => set({ graphFocusNodeId: nodeId }),

  setProcessingSteps: (steps) => set({ processingSteps: steps }),

  updateProcessingStep: (stepId, status) =>
    set((state) => ({
      processingSteps: state.processingSteps.map((step) =>
        step.id === stepId ? { ...step, status } : step
      ),
    })),

  resetAnimations: () =>
    set({
      ...initialState,
      processingSteps: DEFAULT_PROCESSING_STEPS.map((s) => ({
        ...s,
        status: 'pending' as const,
      })),
    }),

  playIngestionSequence: async () => {
    const { setPhase, startDataFlow, setDataFlowProgress, highlightCards, updateProcessingStep } =
      get();

    // Reset to initial state
    set({
      currentPhase: 'ingesting',
      processingSteps: DEFAULT_PROCESSING_STEPS.map((s) => ({
        ...s,
        status: 'pending' as const,
      })),
    });

    // Highlight input cards
    highlightCards(['business-event', 'conversation']);

    // Start data flow animation
    startDataFlow();

    // Animate progress
    for (let i = 0; i <= 100; i += 5) {
      setDataFlowProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    // Update processing step
    updateProcessingStep('ingest', 'completed');
    setPhase('processing');
  },

  playProcessingSequence: async () => {
    const { updateProcessingStep, highlightFacts, focusGraphNode } = get();

    set({ currentPhase: 'processing' });

    // Extract facts step
    updateProcessingStep('extract', 'active');
    await new Promise((resolve) => setTimeout(resolve, 800));
    updateProcessingStep('extract', 'completed');

    // Resolve temporality step
    updateProcessingStep('resolve', 'active');
    await new Promise((resolve) => setTimeout(resolve, 600));
    highlightFacts(['fact-1', 'fact-2']);
    focusGraphNode('user-node');
    updateProcessingStep('resolve', 'completed');

    // Build context step
    updateProcessingStep('context', 'active');
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateProcessingStep('context', 'completed');

    set({ currentPhase: 'resolving' });
  },

  playCompletionSequence: async () => {
    const { highlightCards, stopDataFlow } = get();

    set({ currentPhase: 'complete' });

    // Highlight output cards
    highlightCards(['current-state', 'temporal-history', 'episodic-signals', 'ai-context']);

    // Stop data flow
    stopDataFlow();

    // Clear highlights after delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    set({ highlightedCards: [], highlightedFacts: [] });
  },
}));
