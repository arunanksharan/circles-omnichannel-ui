import type {
  GraphitiCurrentState,
  TemporalFact,
  KnowledgeGraphData,
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
  GraphNodeType,
} from '@/types/demo';

// Extended state type that includes raw edges from API
interface ExtendedGraphitiState extends GraphitiCurrentState {
  _rawEdges?: Array<{
    uuid: string;
    name: string;
    fact: string;
    source_entity: string;
    target_entity: string;
    created_at: string;
    valid_at: string;
    invalid_at: string | null;
    is_valid: boolean;
  }>;
}

// Graphiti-themed color palette - matches app design system
export const NODE_COLORS: Record<GraphNodeType, string> = {
  user: '#6366F1',      // Indigo - central user (graphiti-node)
  fact: '#F59E0B',      // Amber - temporal facts (graphiti-temporal)
  pet: '#EC4899',       // Pink - pet
  relationship: '#8B5CF6', // Purple - relationships
  interest: '#3B82F6',  // Blue - interests
  emotion: '#EF4444',   // Red - emotional state
  goal: '#10B981',      // Emerald - goals
  event: '#F97316',     // Orange - life events
  location: '#22C55E',  // Green - location
  issue: '#EF4444',     // Red - support issues
};

// Node sizes by type
export const NODE_SIZES: Record<GraphNodeType, number> = {
  user: 16,
  fact: 10,
  pet: 12,
  relationship: 11,
  interest: 9,
  emotion: 12,
  goal: 9,
  event: 9,
  location: 11,
  issue: 12,
};

/**
 * Map edge names to node types for visualization
 */
function getNodeTypeFromEdgeName(edgeName: string): GraphNodeType {
  const edgeTypeMap: Record<string, GraphNodeType> = {
    // Location-related
    'TravelsTo': 'location',
    'TRAVELS_TO': 'location',
    'LivesIn': 'location',
    'LIVES_IN': 'location',
    'OriginatesFrom': 'location',
    // Plan/subscription-related
    'Subscribes': 'fact',
    'InterestedIn': 'interest',
    'INTERESTED_IN': 'interest',
    // Pet-related
    'CaresFor': 'pet',
    'CARES_FOR': 'pet',
    'HasPet': 'pet',
    // Preference-related
    'Prefers': 'fact',
    'PREFERS': 'fact',
    // Relationship-related
    'RelatedTo': 'relationship',
    'RELATED_TO': 'relationship',
    'Knows': 'relationship',
    // Emotional
    'Feels': 'emotion',
    // Goals
    'WantsTo': 'goal',
    'AfraidOf': 'emotion',
  };
  return edgeTypeMap[edgeName] || 'fact';
}

/**
 * Extract a short label from a fact string
 */
function extractLabelFromFact(fact: string, edgeName: string): string {
  // Try to extract the key entity from the fact
  const patterns: Record<string, RegExp> = {
    'TravelsTo': /(?:to|visiting)\s+(\w+)/i,
    'TRAVELS_TO': /(?:to|visiting)\s+(\w+)/i,
    'InterestedIn': /interested\s+in\s+(?:the\s+)?(.+?)\.?$/i,
    'INTERESTED_IN': /interested\s+in\s+(?:the\s+)?(.+?)\.?$/i,
    'Prefers': /prefers?\s+(.+?)(?:\s+for|\.?$)/i,
    'PREFERS': /prefers?\s+(.+?)(?:\s+for|\.?$)/i,
    'CaresFor': /(?:cat|pet|dog)\s+(\w+)/i,
    'CARES_FOR': /(?:cat|pet|dog)\s+(\w+)/i,
    'RelatedTo': /(?:need|needs|will\s+need)\s+(.+?)(?:\s+when|\.?$)/i,
  };

  const pattern = patterns[edgeName];
  if (pattern) {
    const match = fact.match(pattern);
    if (match) return truncateLabel(match[1], 25);
  }

  // Fallback: return truncated fact
  return truncateLabel(fact, 25);
}

/**
 * Transform Graphiti current state and temporal facts into graph data
 */
export function transformToGraphData(
  state: GraphitiCurrentState | null,
  facts: TemporalFact[]
): KnowledgeGraphData {
  const nodes: KnowledgeGraphNode[] = [];
  const edges: KnowledgeGraphEdge[] = [];

  if (!state) {
    return { nodes, edges };
  }

  // Cast to extended type to access _rawEdges
  const extendedState = state as ExtendedGraphitiState;

  // 1. Central User Node
  const userId = 'user-node';
  nodes.push({
    id: userId,
    label: 'User',
    type: 'user',
    fill: NODE_COLORS.user,
    size: NODE_SIZES.user,
  });

  // 2. If we have raw edges from API, use them to build the graph
  if (extendedState._rawEdges && extendedState._rawEdges.length > 0) {
    const addedNodes = new Set<string>();

    extendedState._rawEdges.forEach((edge, index) => {
      const nodeType = getNodeTypeFromEdgeName(edge.name);
      const nodeLabel = extractLabelFromFact(edge.fact, edge.name);
      const nodeId = `node-${edge.uuid || index}`;

      // Add target node if not already added
      if (!addedNodes.has(nodeLabel)) {
        addedNodes.add(nodeLabel);
        nodes.push({
          id: nodeId,
          label: nodeLabel,
          type: nodeType,
          fill: NODE_COLORS[nodeType],
          size: NODE_SIZES[nodeType],
          data: {
            fact: edge.fact,
            edge_type: edge.name,
            valid: edge.is_valid,
          },
        });

        // Add edge from user to this node
        edges.push({
          id: `edge-${edge.uuid || index}`,
          source: userId,
          target: nodeId,
          label: edge.name,
        });
      }
    });
  } else {
    // Fallback to legacy behavior using structured state
    // 2. Location Node
    if (state.current_country && state.current_country !== 'Singapore') {
      const locationId = 'location-node';
      nodes.push({
        id: locationId,
        label: state.current_country,
        type: 'location',
        fill: NODE_COLORS.location,
        size: NODE_SIZES.location,
      });
      edges.push({
        id: `edge-user-location`,
        source: userId,
        target: locationId,
        label: 'LOCATED_IN',
      });
    }

    // 3. Open Issue Node
    if (state.open_support_issue) {
      const issueId = 'issue-node';
      nodes.push({
        id: issueId,
        label: state.open_support_issue,
        type: 'issue',
        fill: NODE_COLORS.issue,
        size: NODE_SIZES.issue,
      });
      edges.push({
        id: `edge-user-issue`,
        source: userId,
        target: issueId,
        label: 'HAS_ISSUE',
      });
    }

    // 4. Temporal Facts as nodes (only if no raw edges)
    facts.forEach((fact, index) => {
      // Only show current facts (valid_to is null) or limit to recent
      if (fact.valid_to === null || index < 5) {
        const factId = `fact-${fact.id}`;
        nodes.push({
          id: factId,
          label: truncateLabel(fact.value, 30),
          type: 'fact',
          fill: fact.valid_to === null ? NODE_COLORS.fact : '#6B7280', // Gray for expired
          size: NODE_SIZES.fact,
          data: {
            fact_type: fact.fact_type,
            confidence: fact.confidence,
            valid_to: fact.valid_to,
          },
        });
        edges.push({
          id: `edge-user-fact-${index}`,
          source: userId,
          target: factId,
          label: fact.fact_type,
        });
      }
    });
  }

  // 5. Personal Context Entities
  const personalContext = state.personal_context;
  if (personalContext) {
    // Pet Node
    if (personalContext.pet) {
      const petId = 'pet-node';
      const pet = personalContext.pet;
      nodes.push({
        id: petId,
        label: `${pet.name} (${pet.species})`,
        type: 'pet',
        fill: NODE_COLORS.pet,
        size: NODE_SIZES.pet,
        data: { breed: pet.breed },
      });
      edges.push({
        id: `edge-user-pet`,
        source: userId,
        target: petId,
        label: 'HAS_PET',
      });
    }

    // Relationship Nodes
    personalContext.relationships?.forEach((rel, index) => {
      const relId = `relationship-${index}`;
      nodes.push({
        id: relId,
        label: `${rel.name}`,
        type: 'relationship',
        fill: NODE_COLORS.relationship,
        size: NODE_SIZES.relationship,
        data: { type: rel.relationship_type, location: rel.location },
      });
      edges.push({
        id: `edge-user-rel-${index}`,
        source: userId,
        target: relId,
        label: rel.relationship_type.toUpperCase(),
      });

      // If relationship has a location, connect to location
      if (rel.location) {
        const relLocId = `rel-location-${index}`;
        nodes.push({
          id: relLocId,
          label: rel.location,
          type: 'location',
          fill: NODE_COLORS.location,
          size: 7,
        });
        edges.push({
          id: `edge-rel-location-${index}`,
          source: relId,
          target: relLocId,
          label: 'LIVES_IN',
        });
      }
    });

    // Interest Nodes
    personalContext.interests?.forEach((interest, index) => {
      const interestId = `interest-${index}`;
      nodes.push({
        id: interestId,
        label: interest.specific_interest,
        type: 'interest',
        fill: NODE_COLORS.interest,
        size: NODE_SIZES.interest,
        data: { category: interest.category, level: interest.enthusiasm_level },
      });
      edges.push({
        id: `edge-user-interest-${index}`,
        source: userId,
        target: interestId,
        label: 'INTERESTED_IN',
      });
    });

    // Emotional State Node
    if (personalContext.emotional_state) {
      const emotionId = 'emotion-node';
      const emotion = personalContext.emotional_state;
      nodes.push({
        id: emotionId,
        label: `${emotion.mood} (stress: ${emotion.stress_level}/10)`,
        type: 'emotion',
        fill: getEmotionColor(emotion.mood),
        size: NODE_SIZES.emotion,
        data: { energy: emotion.energy_level },
      });
      edges.push({
        id: `edge-user-emotion`,
        source: userId,
        target: emotionId,
        label: 'FEELS',
      });
    }

    // Goal Nodes
    personalContext.goals?.forEach((goal, index) => {
      const goalId = `goal-${index}`;
      nodes.push({
        id: goalId,
        label: truncateLabel(goal.description, 25),
        type: 'goal',
        fill: NODE_COLORS.goal,
        size: NODE_SIZES.goal,
        data: { progress: goal.progress, type: goal.goal_type },
      });
      edges.push({
        id: `edge-user-goal-${index}`,
        source: userId,
        target: goalId,
        label: 'HAS_GOAL',
      });
    });

    // Life Event Nodes
    personalContext.life_events?.forEach((event, index) => {
      const eventId = `event-${index}`;
      nodes.push({
        id: eventId,
        label: truncateLabel(event.description, 25),
        type: 'event',
        fill: NODE_COLORS.event,
        size: NODE_SIZES.event,
        data: { type: event.event_type, impact: event.emotional_impact },
      });
      edges.push({
        id: `edge-user-event-${index}`,
        source: userId,
        target: eventId,
        label: 'EXPERIENCED',
      });
    });
  }

  return { nodes, edges };
}

/**
 * Truncate label for better display
 */
function truncateLabel(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Get color based on emotional state
 */
function getEmotionColor(mood: string): string {
  switch (mood) {
    case 'happy':
    case 'excited':
      return '#22C55E'; // Green
    case 'stressed':
    case 'anxious':
      return '#EF4444'; // Red
    case 'sad':
      return '#6366F1'; // Indigo
    default:
      return NODE_COLORS.emotion;
  }
}
