import type { DemoPreset } from '@/types/demo';

// ============================================================
// PERSONAL CONTEXT PRESETS (Replika-Style Avatar Memories)
// These are separated for their own selector in the UI
// ============================================================
export const PERSONAL_CONTEXT_PRESETS: DemoPreset[] = [
  {
    id: 'personal-context-pet-stress',
    name: 'Pet & Emotional Support',
    description: 'User reveals personal context - pet, stress, hobbies during support interaction',
    businessEvent: {
      event_type: 'USER_CONTEXT_UPDATE',
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      msisdn: '+6591234567',
      transaction_id: 'txn_context_personal_1',
      timestamp: '2026-01-14T19:30:00+08:00',
      amount: 0,
      currency: 'SGD',
      source_system: 'circles_app',
      metadata: {
        pet: {
          name: 'Mochi',
          species: 'cat',
          breed: 'Scottish Fold',
          significance: 'Emotional support companion',
        },
        emotional_state: {
          mood: 'stressed',
          energy_level: 'tired',
          stress_level: 7,
          context: 'Work deadline pressure',
        },
        interests: [
          { category: 'games', specific_interest: 'Genshin Impact', enthusiasm_level: 'passionate' },
        ],
      },
    },
    conversationTranscript: `Agent: Hi there! Welcome to Circles support. How can I help you today?
User: Hey, sorry I'm a bit stressed. My data ran out and I really need it for work stuff tonight.
Agent: No worries at all, I understand work deadlines can be stressful. Let me check your account.
User: Thanks. My cat Mochi is literally sitting on my laptop right now like she knows I'm stressed 😅
Agent: Aww, cats always seem to know! Scottish Folds are especially intuitive. I see you're on the 20GB plan.
User: Yeah, I've been using more data lately. Been playing Genshin Impact to destress after work, probably shouldn't do that on mobile data lol
Agent: Ha! Genshin does eat through data quickly with all those updates. Would you like me to add a data booster?
User: Yes please. Also... is there a way to get a reminder before I run out? I get so caught up in things I forget to check.
Agent: Absolutely! I can set up low data alerts for you. You'll get a notification at 80% and 95% usage.
User: That would be amazing. Thank you for being so understanding, this is exactly what I needed.`,
    conversationMetadata: {
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      conversation_id: 'conv_personal_pet_stress',
      channel: 'in_app_support_chat',
      started_at: '2026-01-14T19:30:00+08:00',
      ended_at: '2026-01-14T19:42:00+08:00',
    },
    expectedOutcome: {
      currentCountry: 'Singapore',
      openIssue: null,
      sentimentSignal: 'Stressed but appreciative',
      keyFacts: [
        'Has a cat named Mochi (Scottish Fold) - emotional support',
        'Currently stressed from work deadlines',
        'Plays Genshin Impact to destress',
        'Prefers proactive notifications',
        'Responsive to empathetic support',
      ],
    },
  },
  {
    id: 'personal-context-family-travel',
    name: 'Family & Life Events',
    description: 'User shares family relationships, upcoming travel, and life goals',
    businessEvent: {
      event_type: 'ROAMING_ACTIVATION',
      user_id: 'usr_883h1733-h5c2-74g7-d049-779988773333',
      msisdn: '+6576543210',
      transaction_id: 'txn_roam_family_visit',
      timestamp: '2026-01-14T14:00:00+08:00',
      amount: 25,
      currency: 'SGD',
      source_system: 'circles_bss',
      metadata: {
        roaming_pack: 'Japan 14-Day',
        countries_covered: ['Japan'],
        data_quota_gb: 10,
        valid_days: 14,
        // Personal context
        relationships: [
          { name: 'Mom', relationship_type: 'parent', location: 'Osaka' },
          { name: 'Grandma', relationship_type: 'grandparent', location: 'Osaka' },
        ],
        travel_purpose: 'family_visit',
        life_event: {
          event_type: 'family_reunion',
          description: 'First visit home in 2 years',
          emotional_significance: 'very_important',
        },
      },
    },
    conversationTranscript: `Agent: Good afternoon! How can I assist you today?
User: Hi! I need to make sure my roaming is all set up. I'm flying to Japan tomorrow.
Agent: Exciting! I can see you've activated the Japan 14-Day pack. Is this for business or leisure?
User: It's to visit my mom and grandma in Osaka. Haven't seen them in almost 2 years because of... well, everything.
Agent: Oh that's wonderful! Family reunions are so precious. Two years is a long time to be apart.
User: Yeah, grandma just turned 80 and I promised I'd be there for her birthday this time. Missed it last year and felt terrible.
Agent: That's such a meaningful trip. Your 10GB pack should be perfect for staying connected and sharing photos.
User: I hope so! Mom says grandma has been learning to use LINE just so we can video call. It's adorable.
Agent: That's so sweet! Pro tip - video calls work best on WiFi when you can. Saves your data for when you're out exploring.
User: Good idea. I want to take her to her favorite shrine, she hasn't been able to go alone anymore.
Agent: That sounds like a beautiful plan. Is there anything else you need for your trip?
User: Actually, can you make sure my emergency roaming works? Just in case grandma... you know, at her age...
Agent: Of course. I've confirmed your emergency services are fully active in Japan. Wishing you a wonderful reunion!`,
    conversationMetadata: {
      user_id: 'usr_883h1733-h5c2-74g7-d049-779988773333',
      conversation_id: 'conv_personal_family_travel',
      channel: 'in_app_support_chat',
      started_at: '2026-01-14T14:00:00+08:00',
      ended_at: '2026-01-14T14:18:00+08:00',
    },
    expectedOutcome: {
      currentCountry: 'Singapore (traveling to Japan)',
      openIssue: null,
      sentimentSignal: 'Excited but emotionally vulnerable',
      keyFacts: [
        'Mother lives in Osaka, Japan',
        'Grandmother turned 80 - birthday celebration',
        'First family visit in 2 years (emotionally significant)',
        'Close relationship with grandmother',
        'Concern about grandmother\'s health/age',
        'Values family deeply - feels guilt about missed occasions',
      ],
    },
  },
];

// ============================================================
// TELECOM SCENARIO PRESETS
// ============================================================
export const DEMO_PRESETS: DemoPreset[] = [
  // ChitChat Demo User - Synchronized with chitchat-frontend-react devUserId
  {
    id: 'chitchat-demo-user',
    name: 'ChitChat Demo User',
    description: 'Demo user synchronized with ChitChat frontend for end-to-end testing',
    businessEvent: {
      event_type: 'USER_PROFILE_UPDATE',
      user_id: '000000000000000000000001', // Matches chitchat devUserId
      msisdn: '+6591234567',
      transaction_id: 'txn_demo_sync_001',
      timestamp: '2026-01-15T10:00:00+08:00',
      amount: 0,
      currency: 'SGD',
      source_system: 'omnichannel_demo',
      metadata: {
        sync_source: 'omnichannel-ui',
        demo_mode: true,
      },
    },
    conversationTranscript: `Agent: Welcome to Circles support! How can I help you today?
User: Hi, I'm testing the system integration between the dashboard and voice assistant.
Agent: Great! I can see your account. Is there anything specific you'd like me to note for future reference?
User: Yes, please note that I prefer email communications and I'm interested in the unlimited data plan.
Agent: Perfect, I've noted your preference for email and interest in unlimited data. Anything else?
User: Also, I'll be traveling to Japan next month and will need roaming.
Agent: Noted! I've recorded your upcoming Japan travel. We'll make sure roaming options are ready for you.
User: One more thing - my cat Whiskers is turning 3 next week, so I might be distracted!
Agent: How sweet! Happy early birthday to Whiskers. I've noted that too. Is there anything else?
User: That's all for now. Thank you!`,
    conversationMetadata: {
      user_id: '000000000000000000000001', // Matches chitchat devUserId
      conversation_id: 'conv_demo_sync_001',
      channel: 'omnichannel_dashboard',
      started_at: '2026-01-15T10:00:00+08:00',
      ended_at: '2026-01-15T10:15:00+08:00',
    },
    expectedOutcome: {
      currentCountry: 'Singapore',
      openIssue: null,
      sentimentSignal: 'Neutral - Testing',
      keyFacts: [
        'Prefers email communication',
        'Interested in unlimited data plan',
        'Traveling to Japan next month',
        'Needs roaming service',
        'Has a cat named Whiskers (turning 3)',
      ],
    },
  },
  {
    id: 'international-roaming-issue',
    name: 'International Roaming Issue',
    description: 'User in Japan experiencing roaming connectivity problems after recent top-up',
    businessEvent: {
      event_type: 'SIM_TOP_UP',
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      msisdn: '+6591234567',
      transaction_id: 'txn_9f1c2b7e-3c41-4e21-9b71-2d4a6a91f112',
      timestamp: '2026-01-14T10:42:00+08:00',
      amount: 20,
      currency: 'SGD',
      source_system: 'circles_bss',
      metadata: {
        top_up_method: 'Credit Card',
        promo_applied: false,
        roaming_pack_active: true,
      },
    },
    conversationTranscript: `Agent: Hi, welcome to Circles support. How can I help you today?
User: Hi, my international roaming is not working.
Agent: Sorry to hear that. Which country are you currently in?
User: I am in Japan right now.
Agent: Thanks. Have you already enabled roaming from the app?
User: Yes, I enabled it yesterday but I still have no signal.
Agent: Understood. Let me check this for you.
User: This is really frustrating, I need connectivity urgently.`,
    conversationMetadata: {
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      conversation_id: 'conv_3a7d91c2-98f4-4a6b-bd91-84a6f20c112b',
      channel: 'in_app_support_chat',
      started_at: '2026-01-14T11:05:00+08:00',
      ended_at: '2026-01-14T11:18:00+08:00',
    },
    expectedOutcome: {
      currentCountry: 'Japan',
      openIssue: 'International Roaming Not Connecting',
      sentimentSignal: 'Frustration detected',
      keyFacts: [
        'User is in Japan',
        'Roaming was enabled yesterday',
        'No network signal',
        'User recently topped up',
      ],
    },
  },
  {
    id: 'plan-upgrade-inquiry',
    name: 'Plan Upgrade Inquiry',
    description: 'User inquiring about upgrading their mobile plan',
    businessEvent: {
      event_type: 'BILLING_EVENT',
      user_id: 'usr_661f9511-f3a0-52e5-b827-557766551111',
      msisdn: '+6598765432',
      transaction_id: 'txn_af2d3c8f-4d52-5f32-ac82-3e5b7b02f223',
      timestamp: '2026-01-14T09:15:00+08:00',
      amount: 28,
      currency: 'SGD',
      source_system: 'circles_bss',
      metadata: {
        billing_cycle: 'monthly',
        current_plan: 'Circles Basic',
        data_usage_gb: 18.5,
        data_limit_gb: 20,
      },
    },
    conversationTranscript: `Agent: Good morning! How can I assist you today?
User: Hi, I'm thinking about upgrading my plan. I keep running out of data.
Agent: I can help with that! I can see you're currently on the Circles Basic plan with 20GB.
User: Yes, that's not enough for me anymore. What options do I have?
Agent: We have Circles Plus with 50GB and Circles Unlimited. Would you like me to explain the differences?
User: Yes please, and what's the price difference?`,
    conversationMetadata: {
      user_id: 'usr_661f9511-f3a0-52e5-b827-557766551111',
      conversation_id: 'conv_4b8e02d3-a9f5-5b7c-ce02-95b7f31d223c',
      channel: 'in_app_support_chat',
      started_at: '2026-01-14T09:30:00+08:00',
      ended_at: '2026-01-14T09:45:00+08:00',
    },
    expectedOutcome: {
      currentCountry: 'Singapore',
      openIssue: null,
      sentimentSignal: 'Neutral - Inquiry',
      keyFacts: [
        'User on Circles Basic plan',
        'Considering upgrade',
        'Data usage near limit',
        'Interested in pricing',
      ],
    },
  },
  {
    id: 'billing-dispute',
    name: 'Billing Dispute',
    description: 'User disputing an unexpected charge on their bill',
    businessEvent: {
      event_type: 'BILLING_EVENT',
      user_id: 'usr_772g0622-g4b1-63f6-c938-668877662222',
      msisdn: '+6587654321',
      transaction_id: 'txn_bg3e4d9g-5e63-6g43-bd93-4f6c8c13g334',
      timestamp: '2026-01-13T14:22:00+08:00',
      amount: 85,
      currency: 'SGD',
      source_system: 'circles_bss',
      metadata: {
        billing_type: 'monthly',
        includes_roaming_charges: true,
        roaming_charges_sgd: 45,
        base_plan_sgd: 40,
      },
    },
    conversationTranscript: `Agent: Hello, how can I help you today?
User: I just received my bill and it's way higher than expected!
Agent: I'm sorry to hear that. Let me look into your account.
User: I was charged $85 when my plan is only $40!
Agent: I can see there are roaming charges from your recent trip. Were you overseas recently?
User: Yes, but I thought I had a roaming package! This is unacceptable.
Agent: Let me check your roaming package status for you.
User: I'm very upset about this. I need this resolved immediately.`,
    conversationMetadata: {
      user_id: 'usr_772g0622-g4b1-63f6-c938-668877662222',
      conversation_id: 'conv_5c9f13e4-b0g6-6c8d-df13-06c8g42e334d',
      channel: 'in_app_support_chat',
      started_at: '2026-01-14T15:00:00+08:00',
      ended_at: '2026-01-14T15:25:00+08:00',
    },
    expectedOutcome: {
      currentCountry: 'Singapore',
      openIssue: 'Billing Dispute - Roaming Charges',
      sentimentSignal: 'High frustration - Angry',
      keyFacts: [
        'Unexpected high bill',
        'Roaming charges dispute',
        'User expects roaming package coverage',
        'Immediate resolution needed',
      ],
    },
  },
];

export function getPresetById(id: string): DemoPreset | undefined {
  // Check telecom presets first, then personal context presets
  return DEMO_PRESETS.find((preset) => preset.id === id)
    || PERSONAL_CONTEXT_PRESETS.find((preset) => preset.id === id);
}
