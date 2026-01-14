import type {
  BusinessEvent,
  GraphitiCurrentState,
  TemporalFact,
  EpisodeSignal,
  SentimentSignal,
  PersonalContext,
  Pet,
  Relationship,
  EmotionalState,
  Interest,
  LifeEvent,
  Goal,
} from '@/types/demo';

interface MockGraphitiResponse {
  currentState: GraphitiCurrentState;
  temporalFacts: TemporalFact[];
  episodicSignals: EpisodeSignal[];
  sentimentSignal: SentimentSignal | null;
  aiContextProjection: string;
}

/**
 * Extract personal context entities from conversation transcript
 */
function extractPersonalContext(transcript: string): PersonalContext {
  const context: PersonalContext = {};

  // Extract Pet
  const petMatch = transcript.match(/(?:my\s+)?(cat|dog|pet|puppy|kitten)\s+(?:named?\s+)?(\w+)/i);
  if (petMatch) {
    const breedMatch = transcript.match(/(Scottish Fold|Persian|Siamese|Golden Retriever|Labrador|Bulldog|Poodle)/i);
    context.pet = {
      name: petMatch[2],
      species: petMatch[1].toLowerCase(),
      breed: breedMatch?.[1],
      significance: 'Mentioned in conversation',
    };
  }

  // Extract Relationships
  const relationships: Relationship[] = [];
  const relationshipPatterns = [
    { regex: /\b(mom|mother)\b/i, type: 'parent' as const, name: 'Mom' },
    { regex: /\b(dad|father)\b/i, type: 'parent' as const, name: 'Dad' },
    { regex: /\b(grandma|grandmother)\b/i, type: 'grandparent' as const, name: 'Grandma' },
    { regex: /\b(grandpa|grandfather)\b/i, type: 'grandparent' as const, name: 'Grandpa' },
    { regex: /\b(sister)\b/i, type: 'sibling' as const, name: 'Sister' },
    { regex: /\b(brother)\b/i, type: 'sibling' as const, name: 'Brother' },
  ];

  for (const pattern of relationshipPatterns) {
    if (pattern.regex.test(transcript)) {
      // Check for location
      const locationMatch = transcript.match(new RegExp(`(?:${pattern.name}|${pattern.type}).*?(?:in|from|lives in)\\s+(\\w+)`, 'i'));
      relationships.push({
        name: pattern.name,
        relationship_type: pattern.type,
        closeness: 'close',
        location: locationMatch?.[1],
      });
    }
  }
  if (relationships.length > 0) {
    context.relationships = relationships;
  }

  // Extract Emotional State
  const emotionPatterns = {
    stressed: /\b(stressed|stress|stressful)\b/i,
    anxious: /\b(anxious|anxiety|worried|worry)\b/i,
    happy: /\b(happy|excited|great|wonderful)\b/i,
    sad: /\b(sad|upset|down|depressed)\b/i,
    tired: /\b(tired|exhausted|drained)\b/i,
  };

  for (const [mood, regex] of Object.entries(emotionPatterns)) {
    if (regex.test(transcript)) {
      const tiredMatch = /\b(tired|exhausted)\b/i.test(transcript);
      context.emotional_state = {
        mood: mood as EmotionalState['mood'],
        energy_level: tiredMatch ? 'tired' : 'medium',
        stress_level: mood === 'stressed' || mood === 'anxious' ? 7 : 3,
        context: 'Detected from conversation',
      };
      break;
    }
  }

  // Extract Interests
  const interests: Interest[] = [];
  const interestPatterns = [
    { regex: /\bGenshin Impact\b/i, category: 'games', name: 'Genshin Impact', level: 'passionate' as const },
    { regex: /\bFinal Fantasy\b/i, category: 'games', name: 'Final Fantasy', level: 'enthusiast' as const },
    { regex: /\bK-pop|BTS|BLACKPINK\b/i, category: 'music', name: 'K-pop', level: 'passionate' as const },
    { regex: /\banime|manga\b/i, category: 'entertainment', name: 'Anime/Manga', level: 'enthusiast' as const },
    { regex: /\bphotography\b/i, category: 'hobby', name: 'Photography', level: 'interested' as const },
    { regex: /\bgaming\b/i, category: 'hobby', name: 'Gaming', level: 'enthusiast' as const },
  ];

  for (const pattern of interestPatterns) {
    if (pattern.regex.test(transcript)) {
      interests.push({
        category: pattern.category,
        specific_interest: pattern.name,
        enthusiasm_level: pattern.level,
      });
    }
  }
  if (interests.length > 0) {
    context.interests = interests;
  }

  // Extract Life Events
  const lifeEvents: LifeEvent[] = [];
  if (/birthday|celebration|turning \d+/i.test(transcript)) {
    lifeEvents.push({
      event_type: 'celebration',
      description: 'Family celebration mentioned',
      emotional_impact: 'happy',
    });
  }
  if (/visit|reunion|haven't seen/i.test(transcript)) {
    lifeEvents.push({
      event_type: 'family_reunion',
      description: 'Family visit/reunion planned',
      emotional_impact: 'very_happy',
    });
  }
  if (lifeEvents.length > 0) {
    context.life_events = lifeEvents;
  }

  // Extract Goals
  const goals: Goal[] = [];
  if (/want to|planning to|hope to|going to visit/i.test(transcript)) {
    const goalMatch = transcript.match(/(?:want to|planning to|hope to|going to)\s+(.+?)(?:\.|,|$)/i);
    if (goalMatch) {
      goals.push({
        goal_type: 'personal',
        description: goalMatch[1].trim().substring(0, 50),
        progress: 'in_progress',
      });
    }
  }
  if (goals.length > 0) {
    context.goals = goals;
  }

  return context;
}

/**
 * Generate mock Graphiti response based on input data
 */
export function getMockGraphitiResponse(
  businessEvent: BusinessEvent | null,
  conversationTranscript: string,
  personalContextTranscript: string = ''
): MockGraphitiResponse {
  const now = new Date().toISOString();

  // Combine transcripts for analysis
  const combinedTranscript = [conversationTranscript, personalContextTranscript].filter(Boolean).join('\n');

  // Detect location from conversation
  const locationMatch = combinedTranscript.match(
    /(?:in|at|from)\s+(Japan|Singapore|Malaysia|Thailand|Indonesia|Vietnam|Australia)/i
  );
  const currentCountry = locationMatch ? locationMatch[1] : 'Singapore';

  // Detect sentiment from conversation
  const negativeSentiment =
    /frustrat|upset|angry|unacceptable|immediately|urgent|problem|issue|not working/i.test(
      combinedTranscript
    );
  const positiveSentiment = /thank|great|perfect|excellent|appreciate/i.test(combinedTranscript);

  // Detect issue type
  let openIssue: string | null = null;
  if (/roaming|signal|network|connectivity/i.test(combinedTranscript)) {
    openIssue = 'International Roaming Not Connecting';
  } else if (/bill|charge|payment|expensive/i.test(combinedTranscript)) {
    openIssue = 'Billing Dispute';
  } else if (/upgrade|plan|data/i.test(combinedTranscript)) {
    openIssue = null; // Inquiry, not an issue
  }

  // Extract personal context from personal context transcript (or combined if no dedicated transcript)
  const personalContext = extractPersonalContext(personalContextTranscript || combinedTranscript);
  const hasPersonalContext = Object.keys(personalContext).length > 0;

  // Build current state
  const currentState: GraphitiCurrentState = {
    user_id: businessEvent?.user_id || 'usr_unknown',
    home_market: 'Singapore',
    current_country: currentCountry,
    active_msisdn: businessEvent?.msisdn || '+65XXXXXXXX',
    roaming_status: businessEvent?.metadata?.roaming_pack_active ? 'Enabled' : 'Disabled',
    active_plan: 'Circles One',
    open_support_issue: openIssue,
    last_transaction: businessEvent
      ? {
          type: businessEvent.event_type,
          amount_sgd: businessEvent.amount || 0,
          timestamp: businessEvent.timestamp,
        }
      : null,
    // Include personal context if detected
    personal_context: hasPersonalContext ? personalContext : undefined,
  };

  // Build temporal facts
  const temporalFacts: TemporalFact[] = [
    {
      id: 'fact-location',
      fact_type: 'USER_IN_COUNTRY',
      value: currentCountry,
      valid_from: now,
      valid_to: null,
      derived_from: 'support_chat',
      confidence: 0.95,
    },
  ];

  if (businessEvent) {
    temporalFacts.push({
      id: 'fact-transaction',
      fact_type: 'COMPLETED_TRANSACTION',
      value: `${businessEvent.event_type} - ${businessEvent.amount} ${businessEvent.currency}`,
      valid_from: businessEvent.timestamp,
      valid_to: null,
      derived_from: 'bss_event',
      confidence: 1.0,
    });
  }

  if (openIssue) {
    temporalFacts.push({
      id: 'fact-issue',
      fact_type: 'HAS_OPEN_ISSUE',
      value: openIssue,
      valid_from: now,
      valid_to: null,
      derived_from: 'support_chat',
      confidence: 0.9,
    });
  }

  // Add personal context facts
  if (personalContext.pet) {
    temporalFacts.push({
      id: 'fact-pet',
      fact_type: 'HAS_PET',
      value: `${personalContext.pet.species} named ${personalContext.pet.name}${personalContext.pet.breed ? ` (${personalContext.pet.breed})` : ''}`,
      valid_from: now,
      valid_to: null,
      derived_from: 'support_chat',
      confidence: 0.85,
    });
  }

  if (personalContext.relationships && personalContext.relationships.length > 0) {
    personalContext.relationships.forEach((rel, idx) => {
      temporalFacts.push({
        id: `fact-relationship-${idx}`,
        fact_type: 'HAS_RELATIONSHIP',
        value: `${rel.name} (${rel.relationship_type})${rel.location ? ` in ${rel.location}` : ''}`,
        valid_from: now,
        valid_to: null,
        derived_from: 'support_chat',
        confidence: 0.8,
      });
    });
  }

  if (personalContext.emotional_state) {
    temporalFacts.push({
      id: 'fact-emotional-state',
      fact_type: 'EMOTIONAL_STATE',
      value: `${personalContext.emotional_state.mood} (stress: ${personalContext.emotional_state.stress_level}/10)`,
      valid_from: now,
      valid_to: null,
      derived_from: 'support_chat',
      confidence: 0.75,
    });
  }

  if (personalContext.interests && personalContext.interests.length > 0) {
    personalContext.interests.forEach((interest, idx) => {
      temporalFacts.push({
        id: `fact-interest-${idx}`,
        fact_type: 'HAS_INTEREST',
        value: `${interest.specific_interest} (${interest.enthusiasm_level})`,
        valid_from: now,
        valid_to: null,
        derived_from: 'support_chat',
        confidence: 0.8,
      });
    });
  }

  // Build episodic signals with updated interface
  const episodicSignals: EpisodeSignal[] = [];

  if (conversationTranscript || personalContextTranscript) {
    episodicSignals.push({
      id: 'episode-1',
      type: 'support_episode',
      value: `User contacted support regarding ${openIssue || 'general inquiry'}`,
      source: 'support_chat',
      importance: openIssue ? 0.9 : 0.5,
      timestamp: now,
    });
  }

  if (businessEvent) {
    episodicSignals.push({
      id: 'episode-2',
      type: 'transaction_episode',
      value: `${businessEvent.event_type} of ${businessEvent.amount} ${businessEvent.currency}`,
      source: 'bss_event',
      importance: 0.6,
      timestamp: businessEvent.timestamp,
    });
  }

  // Build sentiment signal with updated interface
  let sentimentSignal: SentimentSignal | null = null;
  if (negativeSentiment) {
    sentimentSignal = {
      score: -0.6,
      confidence: 0.85,
      derived_from: 'conversation_analysis',
    };
  } else if (positiveSentiment) {
    sentimentSignal = {
      score: 0.5,
      confidence: 0.75,
      derived_from: 'conversation_analysis',
    };
  } else {
    // Neutral sentiment
    sentimentSignal = {
      score: 0,
      confidence: 0.6,
      derived_from: 'conversation_analysis',
    };
  }

  // Build AI context projection
  const contextLines = [
    `User is currently in ${currentCountry}${currentCountry !== 'Singapore' ? ' with roaming enabled' : ''}.`,
  ];

  if (businessEvent) {
    contextLines.push(
      `They recently completed a ${businessEvent.event_type.replace(/_/g, ' ').toLowerCase()}.`
    );
  }

  if (openIssue) {
    contextLines.push(`There is an unresolved ${openIssue.toLowerCase()} issue.`);
  }

  // Add personal context to AI projection
  if (hasPersonalContext) {
    contextLines.push('');
    contextLines.push('--- Personal Context (Avatar Memory) ---');

    if (personalContext.pet) {
      contextLines.push(`Has a ${personalContext.pet.species} named ${personalContext.pet.name}${personalContext.pet.breed ? ` (${personalContext.pet.breed})` : ''}.`);
    }

    if (personalContext.relationships && personalContext.relationships.length > 0) {
      const relNames = personalContext.relationships.map(r =>
        `${r.name} (${r.relationship_type})${r.location ? ` in ${r.location}` : ''}`
      );
      contextLines.push(`Key relationships: ${relNames.join(', ')}.`);
    }

    if (personalContext.emotional_state) {
      contextLines.push(`Current mood: ${personalContext.emotional_state.mood}, stress level: ${personalContext.emotional_state.stress_level}/10.`);
    }

    if (personalContext.interests && personalContext.interests.length > 0) {
      const interestNames = personalContext.interests.map(i => i.specific_interest);
      contextLines.push(`Interests: ${interestNames.join(', ')}.`);
    }

    if (personalContext.life_events && personalContext.life_events.length > 0) {
      const events = personalContext.life_events.map(e => e.description);
      contextLines.push(`Recent life events: ${events.join(', ')}.`);
    }

    if (personalContext.goals && personalContext.goals.length > 0) {
      const goalDescs = personalContext.goals.map(g => g.description);
      contextLines.push(`Goals: ${goalDescs.join(', ')}.`);
    }

    contextLines.push('');
    contextLines.push('--- Communication Guidance ---');
    contextLines.push('Personalize responses using known context. Show empathy based on emotional state.');
  }

  if (negativeSentiment) {
    contextLines.push('User sentiment indicates frustration.');
    contextLines.push('Respond concisely and focus on resolution.');
  } else if (personalContext.emotional_state?.mood === 'stressed') {
    contextLines.push('User is feeling stressed. Be supportive and understanding.');
  }

  const aiContextProjection = contextLines.join('\n');

  return {
    currentState,
    temporalFacts,
    episodicSignals,
    sentimentSignal,
    aiContextProjection,
  };
}

/**
 * Simulated delay for realistic UX
 */
export function simulateProcessingDelay(minMs: number = 500, maxMs: number = 1500): Promise<void> {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
