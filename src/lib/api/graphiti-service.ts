import type {
  BusinessEvent,
  ConversationMetadata,
  GraphitiCurrentState,
  TemporalFact,
  EpisodeSignal,
  SentimentSignal,
} from '@/types/demo';

const GRAPHITI_SERVICE_URL =
  process.env.NEXT_PUBLIC_GRAPHITI_URL || 'http://localhost:8002';
const MEMORY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MEMORY_SERVICE_URL || 'http://localhost:8001';

interface IngestAndProcessParams {
  businessEvent: BusinessEvent | null;
  conversationTranscript: string;
  conversationMetadata: ConversationMetadata | null;
}

interface ProcessResponse {
  currentState: GraphitiCurrentState;
  temporalFacts: TemporalFact[];
  episodicSignals: EpisodeSignal[];
  sentimentSignal: SentimentSignal | null;
  aiContextProjection: string;
}

/**
 * Ingest business event into the memory service
 */
export async function ingestBusinessEvent(
  tenantId: string,
  event: BusinessEvent
): Promise<{ success: boolean; memory_id?: string }> {
  const response = await fetch(`${MEMORY_SERVICE_URL}/api/v1/memories/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant_id: tenantId,
      event_type: event.event_type,
      payload: event,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to ingest business event: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Ingest conversation transcript directly into Graphiti service
 * This bypasses memory-service and calls graphiti episodes endpoint directly
 */
export async function ingestConversation(
  tenantId: string,
  transcript: string,
  metadata: ConversationMetadata
): Promise<{ success: boolean; episode_id?: string }> {
  const response = await fetch(
    `${GRAPHITI_SERVICE_URL}/api/v1/graphiti/episodes`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenant_id: tenantId,
        unified_user_id: metadata.user_id,
        source_channel: metadata.channel || 'omnichannel_dashboard',
        content: transcript,
        episode_name: `omnichannel_${metadata.conversation_id}`,
        use_custom_types: true,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to ingest conversation: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

/**
 * Get current state from Graphiti
 */
export async function getCurrentState(
  tenantId: string,
  userId: string
): Promise<GraphitiCurrentState> {
  const params = new URLSearchParams({
    tenant_id: tenantId,
    user_id: userId,
  });

  const response = await fetch(
    `${GRAPHITI_SERVICE_URL}/api/v1/graphiti/state/current?${params}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get current state: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get temporal fact history from Graphiti
 */
export async function getTemporalHistory(
  tenantId: string,
  userId: string,
  relationType?: string
): Promise<TemporalFact[]> {
  const params = new URLSearchParams({
    tenant_id: tenantId,
    user_id: userId,
    ...(relationType && { relation_types: relationType }),
  });

  const response = await fetch(
    `${GRAPHITI_SERVICE_URL}/api/v1/graphiti/history/${relationType || 'all'}?${params}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get temporal history: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Build AI context from Graphiti
 */
export async function buildContext(
  tenantId: string,
  userId: string,
  query: string
): Promise<{ formatted_context: string }> {
  const response = await fetch(`${GRAPHITI_SERVICE_URL}/api/v1/graphiti/context`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant_id: tenantId,
      unified_user_id: userId,
      query,
      max_facts: 20,
      include_temporal: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to build context: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Combined ingest and process for demo
 * Uses tenant 'sg' to match circles-memory-service ALLOWED_TENANTS
 */
export async function ingestAndProcess(
  params: IngestAndProcessParams
): Promise<ProcessResponse> {
  // Must use 'sg' tenant - circles-memory-service only allows: sg,jp,tw,au,mn
  const tenantId = 'sg';
  // Default to chitchat demo user ID for end-to-end testing
  const userId =
    params.businessEvent?.user_id ||
    params.conversationMetadata?.user_id ||
    '000000000000000000000001';

  // Ingest conversation directly to Graphiti (skip business event for now)
  if (params.conversationTranscript && params.conversationMetadata) {
    await ingestConversation(
      tenantId,
      params.conversationTranscript,
      params.conversationMetadata
    );
  }

  // Wait for Graphiti LLM processing (entity extraction takes 1-2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Get updated state
  const [currentState, temporalFacts, contextResponse] = await Promise.all([
    getCurrentState(tenantId, userId),
    getTemporalHistory(tenantId, userId),
    buildContext(tenantId, userId, 'current user context'),
  ]);

  // Note: In production, these would come from actual API responses
  // For now, we derive sentiment from the data
  const sentimentSignal: SentimentSignal | null =
    params.conversationTranscript.match(/frustrat|upset|angry/i)
      ? { score: -0.6, confidence: 0.85, derived_from: 'conversation_analysis' }
      : { score: 0, confidence: 0.6, derived_from: 'conversation_analysis' };

  const episodicSignals: EpisodeSignal[] = [
    {
      id: 'episode-live-1',
      type: 'support_episode',
      value: 'User interaction recorded',
      source: 'support_chat',
      importance: 0.8,
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    currentState,
    temporalFacts,
    episodicSignals,
    sentimentSignal,
    aiContextProjection: contextResponse.formatted_context,
  };
}
