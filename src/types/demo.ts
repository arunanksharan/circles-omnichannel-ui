// Demo-specific types for the Omnichannel Intelligence UI

export interface BusinessEvent {
  event_type: 'SIM_TOP_UP' | 'PLAN_CHANGE' | 'BILLING_EVENT' | 'NETWORK_EVENT' | string;
  user_id: string;
  msisdn: string;
  transaction_id: string;
  timestamp: string;
  amount?: number;
  currency?: string;
  source_system?: string;
  metadata?: Record<string, unknown>;
}

export interface ConversationMetadata {
  user_id: string;
  conversation_id: string;
  channel: 'in_app_support_chat' | 'whatsapp' | 'voice' | 'web';
  started_at: string;
  ended_at: string;
}

// ============================================================
// PERSONAL CONTEXT ENTITY TYPES (Replika-Style Avatar Memory)
// ============================================================

export interface PersonalityTrait {
  trait_type: string;
  strength: number; // 0-1 scale
  self_identified: boolean;
}

export interface Interest {
  category: string;
  specific_interest: string;
  enthusiasm_level: 'interested' | 'enthusiast' | 'passionate';
}

export interface Relationship {
  name: string;
  relationship_type: 'parent' | 'sibling' | 'friend' | 'best_friend' | 'partner' | 'ex' | 'colleague' | 'grandparent';
  closeness?: 'close' | 'very_close' | 'estranged';
  notes?: string;
  location?: string;
}

export interface Pet {
  name: string;
  species: string;
  breed?: string;
  age?: string;
  significance?: string;
}

export interface EmotionalState {
  mood: 'happy' | 'stressed' | 'anxious' | 'neutral' | 'sad' | 'excited';
  energy_level: 'high' | 'medium' | 'tired' | 'exhausted';
  stress_level: number; // 1-10 scale
  context?: string;
}

export interface LifeEvent {
  event_type: string;
  date?: string;
  description: string;
  emotional_impact: 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad';
}

export interface Goal {
  goal_type: string;
  description: string;
  progress: 'not_started' | 'in_progress' | 'completed';
}

// Personal Context - Avatar-level memory aggregation
export interface PersonalContext {
  personality_traits?: PersonalityTrait[];
  interests?: Interest[];
  relationships?: Relationship[];
  pet?: Pet;
  emotional_state?: EmotionalState;
  life_events?: LifeEvent[];
  goals?: Goal[];
}

// ============================================================
// GRAPHITI STATE (Extended with Personal Context)
// ============================================================

export interface GraphitiCurrentState {
  user_id: string;
  home_market: string;
  current_country: string;
  active_msisdn: string;
  roaming_status: 'Enabled' | 'Disabled';
  active_plan: string;
  open_support_issue: string | null;
  last_transaction: {
    type: string;
    amount_sgd: number;
    timestamp: string;
  } | null;
  // Personal Context (Avatar Memory)
  personal_context?: PersonalContext;
}

export interface TemporalFact {
  id: string;
  fact_type: string;
  value: string;
  valid_from: string;
  valid_to: string | null; // null = currently valid
  derived_from: 'support_chat' | 'bss_event' | 'voice' | 'system' | 'web';
  confidence: number;
}

export interface EpisodeSignal {
  id: string;
  type: string;
  value: string;
  source: string;
  importance: number; // 0-1 scale
  timestamp: string;
}

export interface SentimentSignal {
  score: number; // -1 to 1
  confidence: number;
  derived_from: string;
}

export interface DemoPreset {
  id: string;
  name: string;
  description: string;
  businessEvent: BusinessEvent;
  conversationTranscript: string;
  conversationMetadata: ConversationMetadata;
  expectedOutcome: {
    currentCountry: string;
    openIssue: string | null;
    sentimentSignal: string;
    keyFacts: string[];
  };
}

export type DemoMode = 'live' | 'mock';

export type AnimationPhase =
  | 'idle'
  | 'ingesting'
  | 'processing'
  | 'resolving'
  | 'complete'
  | 'error';

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration?: number;
}
