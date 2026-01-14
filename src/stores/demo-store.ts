'use client';

import { create } from 'zustand';
import type {
  BusinessEvent,
  ConversationMetadata,
  GraphitiCurrentState,
  TemporalFact,
  EpisodeSignal,
  SentimentSignal,
  DemoMode,
} from '@/types/demo';
import { DEMO_PRESETS, PERSONAL_CONTEXT_PRESETS } from '@/mocks/presets';

interface DemoState {
  // Mode
  mode: DemoMode;

  // Input State
  businessEvent: BusinessEvent | null;
  conversationTranscript: string;
  conversationMetadata: ConversationMetadata | null;
  personalContextTranscript: string; // Separate transcript for personal context

  // Output State
  currentGraphitiState: GraphitiCurrentState | null;
  temporalFacts: TemporalFact[];
  episodicSignals: EpisodeSignal[];
  sentimentSignal: SentimentSignal | null;
  aiContextProjection: string;

  // UI State
  isSubmitting: boolean;
  lastSubmitTime: Date | null;
  error: string | null;
  selectedPreset: string | null;

  // Actions
  setMode: (mode: DemoMode) => void;
  setBusinessEvent: (event: BusinessEvent | null) => void;
  setConversationTranscript: (text: string) => void;
  setConversationMetadata: (meta: ConversationMetadata | null) => void;
  setPersonalContextTranscript: (text: string) => void;
  setCurrentGraphitiState: (state: GraphitiCurrentState | null) => void;
  setTemporalFacts: (facts: TemporalFact[]) => void;
  setEpisodicSignals: (signals: EpisodeSignal[]) => void;
  setSentimentSignal: (signal: SentimentSignal | null) => void;
  setAiContextProjection: (context: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedPreset: (presetId: string | null) => void;
  loadPreset: (presetId: string) => void;
  submitToGraphiti: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  mode: 'mock' as DemoMode,
  businessEvent: null,
  conversationTranscript: '',
  conversationMetadata: null,
  personalContextTranscript: '',
  currentGraphitiState: null,
  temporalFacts: [],
  episodicSignals: [],
  sentimentSignal: null,
  aiContextProjection: '',
  isSubmitting: false,
  lastSubmitTime: null,
  error: null,
  selectedPreset: null,
};

export const useDemoStore = create<DemoState>((set, get) => ({
  ...initialState,

  setMode: (mode) => set({ mode }),

  setBusinessEvent: (event) => set({ businessEvent: event }),

  setConversationTranscript: (text) => set({ conversationTranscript: text }),

  setConversationMetadata: (meta) => set({ conversationMetadata: meta }),

  setPersonalContextTranscript: (text) => set({ personalContextTranscript: text }),

  setCurrentGraphitiState: (state) => set({ currentGraphitiState: state }),

  setTemporalFacts: (facts) => set({ temporalFacts: facts }),

  setEpisodicSignals: (signals) => set({ episodicSignals: signals }),

  setSentimentSignal: (signal) => set({ sentimentSignal: signal }),

  setAiContextProjection: (context) => set({ aiContextProjection: context }),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  setError: (error) => set({ error }),

  setSelectedPreset: (presetId) => set({ selectedPreset: presetId }),

  loadPreset: (presetId) => {
    // Check telecom presets first
    const telecomPreset = DEMO_PRESETS.find((p) => p.id === presetId);

    if (telecomPreset) {
      set({
        selectedPreset: presetId,
        businessEvent: telecomPreset.businessEvent,
        conversationTranscript: telecomPreset.conversationTranscript,
        conversationMetadata: telecomPreset.conversationMetadata,
        personalContextTranscript: '', // Clear personal context
        error: null,
      });
      return;
    }

    // Check personal context presets
    const personalPreset = PERSONAL_CONTEXT_PRESETS.find((p) => p.id === presetId);
    if (personalPreset) {
      set({
        selectedPreset: presetId,
        businessEvent: personalPreset.businessEvent,
        conversationTranscript: '', // Clear telecom transcript
        personalContextTranscript: personalPreset.conversationTranscript,
        conversationMetadata: personalPreset.conversationMetadata,
        error: null,
      });
    }
  },

  submitToGraphiti: async () => {
    const state = get();

    set({ isSubmitting: true, error: null });

    try {
      if (state.mode === 'mock') {
        // Import mock responses dynamically
        const { getMockGraphitiResponse } = await import('@/mocks/graphiti-responses');

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Combine both transcripts for processing
        const mockResponse = getMockGraphitiResponse(
          state.businessEvent,
          state.conversationTranscript,
          state.personalContextTranscript
        );

        set({
          currentGraphitiState: mockResponse.currentState,
          temporalFacts: mockResponse.temporalFacts,
          episodicSignals: mockResponse.episodicSignals,
          sentimentSignal: mockResponse.sentimentSignal,
          aiContextProjection: mockResponse.aiContextProjection,
          isSubmitting: false,
          lastSubmitTime: new Date(),
        });
      } else {
        // Live API mode
        const { ingestAndProcess } = await import('@/lib/api/graphiti-service');

        const response = await ingestAndProcess({
          businessEvent: state.businessEvent,
          conversationTranscript: state.conversationTranscript,
          conversationMetadata: state.conversationMetadata,
        });

        set({
          currentGraphitiState: response.currentState,
          temporalFacts: response.temporalFacts,
          episodicSignals: response.episodicSignals,
          sentimentSignal: response.sentimentSignal,
          aiContextProjection: response.aiContextProjection,
          isSubmitting: false,
          lastSubmitTime: new Date(),
        });
      }
    } catch (error) {
      set({
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  },

  reset: () => set(initialState),
}));
