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

// ============================================================
// API Response Types (what graphiti-service actually returns)
// ============================================================

interface GraphitiEdge {
  uuid: string;
  name: string;
  fact: string;
  source_entity: string;
  target_entity: string;
  created_at: string;
  valid_at: string;
  invalid_at: string | null;
  is_valid: boolean;
}

interface GraphitiStateResponse {
  group_id: string;
  edges: GraphitiEdge[];
  edges_by_type: Record<string, GraphitiEdge[]>;
  summary: Record<string, unknown>;
  total_facts: number;
}

interface GraphitiEntity {
  uuid: string;
  name: string;
  entity_type?: string;
  labels?: string[];
  summary?: string;
}

// ============================================================
// Transform API responses to UI-expected formats
// ============================================================

/**
 * Transform raw Graphiti state response into GraphitiCurrentState format
 * that the UI components expect
 */
function transformStateResponse(
  apiResponse: GraphitiStateResponse,
  userId: string
): GraphitiCurrentState {
  const edges = apiResponse.edges || [];

  // Extract location from TravelsTo or LivesIn edges
  const locationEdge = edges.find(e =>
    e.name === 'TravelsTo' || e.name === 'TRAVELS_TO' ||
    e.name === 'LivesIn' || e.name === 'LIVES_IN'
  );

  // Extract plan from Subscribes or InterestedIn edges
  const planEdge = edges.find(e =>
    e.name === 'Subscribes' || e.name === 'InterestedIn' ||
    e.name === 'INTERESTED_IN'
  );

  // Extract pet from CaresFor or HasPet edges
  const petEdge = edges.find(e =>
    e.name === 'CaresFor' || e.name === 'CARES_FOR' ||
    e.name === 'HasPet' || e.name === 'HAS_PET'
  );

  // Extract preferences
  const preferenceEdges = edges.filter(e =>
    e.name === 'Prefers' || e.name === 'PREFERS'
  );

  // Extract interests
  const interestEdges = edges.filter(e =>
    e.name === 'InterestedIn' || e.name === 'INTERESTED_IN'
  );

  // Build personal context from edges
  const personalContext: GraphitiCurrentState['personal_context'] = {};

  // Extract pet info from CaresFor fact
  if (petEdge) {
    const petMatch = petEdge.fact.match(/cat\s+(\w+)/i) || petEdge.fact.match(/pet\s+(\w+)/i);
    if (petMatch) {
      personalContext.pet = {
        name: petMatch[1],
        species: petEdge.fact.toLowerCase().includes('cat') ? 'cat' : 'unknown',
      };
    }
  }

  // Extract interests from InterestedIn edges
  if (interestEdges.length > 0) {
    personalContext.interests = interestEdges.map(edge => ({
      category: 'general',
      specific_interest: extractEntityFromFact(edge.fact),
      enthusiasm_level: 'interested' as const,
    }));
  }

  return {
    user_id: userId,
    home_market: 'Singapore',
    current_country: locationEdge ? extractLocationFromFact(locationEdge.fact) : 'Singapore',
    active_msisdn: '+65XXXXXXXX',
    roaming_status: locationEdge && locationEdge.name.toLowerCase().includes('travel') ? 'Enabled' : 'Disabled',
    active_plan: planEdge ? extractEntityFromFact(planEdge.fact) : 'Standard Plan',
    open_support_issue: null,
    last_transaction: null,
    personal_context: Object.keys(personalContext).length > 0 ? personalContext : undefined,
    // Store raw edges for graph visualization
    _rawEdges: edges,
  } as GraphitiCurrentState & { _rawEdges?: GraphitiEdge[] };
}

/**
 * Extract location name from a fact string
 */
function extractLocationFromFact(fact: string): string {
  // Common patterns: "travels to Japan", "located in Singapore", "lives in Tokyo"
  const patterns = [
    /(?:travel(?:s|ing)?\s+to|going\s+to|visiting)\s+(\w+)/i,
    /(?:live[sd]?\s+in|located\s+in|currently\s+in)\s+(\w+)/i,
    /(\w+)\s+(?:next\s+month|soon|tomorrow)/i,
  ];

  for (const pattern of patterns) {
    const match = fact.match(pattern);
    if (match) return match[1];
  }

  // Fallback: look for capitalized words that might be locations
  const capitalizedWords = fact.match(/\b[A-Z][a-z]+\b/g);
  if (capitalizedWords) {
    const locations = ['Japan', 'Singapore', 'Tokyo', 'Osaka', 'Thailand', 'Malaysia'];
    for (const word of capitalizedWords) {
      if (locations.includes(word)) return word;
    }
  }

  return 'Unknown';
}

/**
 * Extract entity name from a fact string
 */
function extractEntityFromFact(fact: string): string {
  // Try to extract the object of the fact
  // "User is interested in the unlimited data plan" -> "unlimited data plan"
  const patterns = [
    /interested\s+in\s+(?:the\s+)?(.+?)\.?$/i,
    /prefers?\s+(.+?)(?:\s+for|\.?$)/i,
    /subscribes?\s+to\s+(?:the\s+)?(.+?)\.?$/i,
    /cares?\s+for\s+(?:their\s+)?(.+?)(?:,|\.?$)/i,
  ];

  for (const pattern of patterns) {
    const match = fact.match(pattern);
    if (match) return match[1].trim();
  }

  return fact.substring(0, 50);
}

/**
 * Transform Graphiti edges into TemporalFact format for UI
 */
function transformEdgesToTemporalFacts(edges: GraphitiEdge[]): TemporalFact[] {
  return edges.map((edge, index) => ({
    id: edge.uuid || `fact-${index}`,
    fact_type: edge.name,
    value: edge.fact,
    valid_from: edge.valid_at || edge.created_at,
    valid_to: edge.invalid_at,
    derived_from: 'support_chat' as const,
    confidence: edge.is_valid ? 0.9 : 0.5,
  }));
}

// Valid source_channel values for graphiti-service
type ValidSourceChannel = 'whatsapp' | 'website' | 'mobile_app' | 'customer_care' | 'voice' | 'system';

/**
 * Map internal channel names to valid graphiti-service source_channel values
 */
function mapToValidChannel(channel: string): ValidSourceChannel {
  const channelMap: Record<string, ValidSourceChannel> = {
    'omnichannel_dashboard': 'website',
    'in_app_support_chat': 'mobile_app',
    'in_app_chat': 'mobile_app',
    'whatsapp': 'whatsapp',
    'website': 'website',
    'mobile_app': 'mobile_app',
    'customer_care': 'customer_care',
    'voice': 'voice',
    'system': 'system',
  };
  return channelMap[channel] || 'customer_care';
}

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
        source_channel: mapToValidChannel(metadata.channel || 'customer_care'),
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
 * Transforms the API response into the format expected by UI components
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

  const apiResponse: GraphitiStateResponse = await response.json();
  return transformStateResponse(apiResponse, userId);
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
    console.log('[Graphiti] Starting ingestion...', {
      transcriptLength: params.conversationTranscript.length,
      userId: params.conversationMetadata.user_id,
      channel: params.conversationMetadata.channel,
    });
    await ingestConversation(
      tenantId,
      params.conversationTranscript,
      params.conversationMetadata
    );
    console.log('[Graphiti] Ingestion complete, waiting for LLM processing...');
  } else {
    console.warn('[Graphiti] Skipping ingestion - missing data:', {
      hasTranscript: !!params.conversationTranscript,
      hasMetadata: !!params.conversationMetadata,
    });
  }

  // Wait for Graphiti LLM processing (entity extraction takes 15-20 seconds)
  // This is intentionally long as LLM needs time to extract entities/relationships
  await new Promise((resolve) => setTimeout(resolve, 20000));

  // Get updated state and context
  const [currentState, contextResponse] = await Promise.all([
    getCurrentState(tenantId, userId),
    buildContext(tenantId, userId, 'current user context'),
  ]);

  // Extract temporal facts from the current state's raw edges
  // The API returns edges which we transform into temporal facts
  const rawEdges = (currentState as GraphitiCurrentState & { _rawEdges?: GraphitiEdge[] })._rawEdges || [];
  const temporalFacts = transformEdgesToTemporalFacts(rawEdges);

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
