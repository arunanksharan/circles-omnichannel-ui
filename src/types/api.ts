// Types derived from circles-memory-service and graphiti-service models

export type MemoryType =
  | 'preference'
  | 'personal_fact'
  | 'opinion'
  | 'biography'
  | 'emotional_trend'
  | 'relationship_state'
  | 'habit'
  | 'goal'
  | 'transaction'
  | 'service'
  | 'location'
  | 'schedule';

export type SourceChannel =
  | 'in_app_support_chat'
  | 'whatsapp'
  | 'voice'
  | 'web'
  | 'mobile_app'
  | 'email'
  | 'bss_event';

export type VerificationStatus = 'verified' | 'unverified' | 'contradicted';

export interface Memory {
  id: string;
  tenant_id: string;
  unified_user_id: string;
  type: MemoryType;
  content: string;
  summary: string | null;
  source: string;
  source_channel: SourceChannel | null;
  importance_score: number;
  confidence: number;
  verification_status: VerificationStatus;
  created_at: string;
  event_timestamp: string | null;
  valid_until: string | null;
}

export interface EpisodeRequest {
  tenant_id: string;
  unified_user_id: string;
  source_channel: SourceChannel;
  content: string;
  episode_name?: string;
  reference_time?: string;
  metadata?: Record<string, unknown>;
}

export interface ContextResponse {
  group_id: string;
  facts: string[];
  entities: EntitySummary[];
  recent_changes: string[];
  formatted_context: string;
  build_time_ms: number;
}

export interface EntitySummary {
  uuid: string;
  name: string;
  entity_type: string;
  summary: string | null;
}

export interface EdgeResult {
  uuid: string;
  name: string;
  fact: string;
  source_entity: string;
  target_entity: string;
  created_at: string | null;
  valid_at: string | null;
  invalid_at: string | null;
  is_valid: boolean;
}

export interface IngestResponse {
  success: boolean;
  message: string;
  memory_id?: string;
  episode_id?: string;
}

export interface GraphitiStateResponse {
  user_id: string;
  current_state: Record<string, unknown>;
  facts: EdgeResult[];
  entities: EntitySummary[];
  timestamp: string;
}
