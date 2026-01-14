import type {
  GraphitiCurrentState,
  TemporalFact,
  KnowledgeGraphData,
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
  GraphNodeType,
} from '@/types/demo';

// Neon/Cyber color palette for stunning visual impact
export const NODE_COLORS: Record<GraphNodeType, string> = {
  user: '#A855F7',      // Vibrant purple - Central user (protagonist glow)
  fact: '#22D3EE',      // Neon cyan - Temporal facts
  pet: '#F472B6',       // Hot pink - Pet
  relationship: '#C084FC', // Soft purple-pink - Relationships
  interest: '#60A5FA',  // Electric blue - Interests
  emotion: '#FBBF24',   // Bright amber - Emotional state
  goal: '#2DD4BF',      // Teal glow - Goals
  event: '#FB923C',     // Neon orange - Life events
  location: '#4ADE80',  // Bright green - Location
  issue: '#F87171',     // Coral red - Support issues
};

// Glow colors (slightly brighter versions for active states)
export const NODE_GLOW_COLORS: Record<GraphNodeType, string> = {
  user: '#D8B4FE',
  fact: '#67E8F9',
  pet: '#F9A8D4',
  relationship: '#E9D5FF',
  interest: '#93C5FD',
  emotion: '#FDE047',
  goal: '#5EEAD4',
  event: '#FDBA74',
  location: '#86EFAC',
  issue: '#FCA5A5',
};

// Node sizes by type - larger for better visibility
export const NODE_SIZES: Record<GraphNodeType, number> = {
  user: 20,
  fact: 12,
  pet: 14,
  relationship: 13,
  interest: 11,
  emotion: 14,
  goal: 11,
  event: 11,
  location: 13,
  issue: 14,
};

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

  // 1. Central User Node
  const userId = 'user-node';
  nodes.push({
    id: userId,
    label: state.user_id || 'User',
    type: 'user',
    fill: NODE_COLORS.user,
    size: NODE_SIZES.user,
  });

  // 2. Location Node
  if (state.current_country) {
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

  // 4. Temporal Facts as nodes
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
      return '#10B981'; // Green
    case 'stressed':
    case 'anxious':
      return '#EF4444'; // Red
    case 'sad':
      return '#6366F1'; // Indigo
    default:
      return NODE_COLORS.emotion;
  }
}
