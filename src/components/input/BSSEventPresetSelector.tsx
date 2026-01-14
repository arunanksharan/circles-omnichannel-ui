'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Database, ChevronDown, CreditCard, Phone, Signal, Package, RefreshCw, User, Heart } from 'lucide-react';
import type { BusinessEvent } from '@/types/demo';

// BSS Event Presets - Structured deterministic events from telecom systems
// Includes both telecom events AND personal/avatar-level entity updates (Replika-style)
const BSS_EVENT_PRESETS: BSSEventPreset[] = [
  {
    id: 'sim-top-up',
    name: 'SIM Top-Up',
    description: 'User tops up their prepaid balance',
    icon: CreditCard,
    event: {
      event_type: 'SIM_TOP_UP',
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      msisdn: '+6591234567',
      transaction_id: 'txn_9f1c2b7e-3c41-4e21-9b71-2d4a6a91f112',
      timestamp: new Date().toISOString(),
      amount: 20,
      currency: 'SGD',
      source_system: 'circles_bss',
      metadata: {
        top_up_method: 'Credit Card',
        promo_applied: false,
        roaming_pack_active: true,
      },
    },
  },
  {
    id: 'plan-change',
    name: 'Plan Change',
    description: 'User upgrades or downgrades their plan',
    icon: RefreshCw,
    event: {
      event_type: 'PLAN_CHANGE',
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      msisdn: '+6591234567',
      transaction_id: 'txn_plan_' + Date.now(),
      timestamp: new Date().toISOString(),
      amount: 38,
      currency: 'SGD',
      source_system: 'circles_bss',
      metadata: {
        previous_plan: 'Circles Basic',
        new_plan: 'Circles Plus',
        effective_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        data_limit_gb: 50,
      },
    },
  },
  {
    id: 'roaming-activation',
    name: 'Roaming Activation',
    description: 'International roaming pack enabled',
    icon: Signal,
    event: {
      event_type: 'ROAMING_ACTIVATION',
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      msisdn: '+6591234567',
      transaction_id: 'txn_roam_' + Date.now(),
      timestamp: new Date().toISOString(),
      amount: 15,
      currency: 'SGD',
      source_system: 'circles_bss',
      metadata: {
        roaming_pack: 'Asia 7-Day',
        countries_covered: ['Japan', 'South Korea', 'Taiwan', 'Thailand'],
        data_quota_gb: 5,
        valid_days: 7,
      },
    },
  },
  {
    id: 'billing-event',
    name: 'Monthly Billing',
    description: 'Monthly bill generated and charged',
    icon: CreditCard,
    event: {
      event_type: 'BILLING_EVENT',
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      msisdn: '+6591234567',
      transaction_id: 'txn_bill_' + Date.now(),
      timestamp: new Date().toISOString(),
      amount: 85,
      currency: 'SGD',
      source_system: 'circles_bss',
      metadata: {
        billing_cycle: 'monthly',
        base_plan_sgd: 40,
        includes_roaming_charges: true,
        roaming_charges_sgd: 45,
        payment_status: 'completed',
      },
    },
  },
  {
    id: 'data-addon',
    name: 'Data Add-on Purchase',
    description: 'Additional data pack purchased',
    icon: Package,
    event: {
      event_type: 'DATA_ADDON',
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      msisdn: '+6591234567',
      transaction_id: 'txn_data_' + Date.now(),
      timestamp: new Date().toISOString(),
      amount: 10,
      currency: 'SGD',
      source_system: 'circles_bss',
      metadata: {
        addon_name: 'Extra 5GB',
        data_amount_gb: 5,
        validity_days: 30,
        auto_renew: false,
      },
    },
  },
  {
    id: 'sim-swap',
    name: 'SIM Swap',
    description: 'SIM card replacement processed',
    icon: Phone,
    event: {
      event_type: 'SIM_SWAP',
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      msisdn: '+6591234567',
      transaction_id: 'txn_sim_' + Date.now(),
      timestamp: new Date().toISOString(),
      amount: 0,
      currency: 'SGD',
      source_system: 'circles_bss',
      metadata: {
        reason: 'Lost/Stolen',
        new_iccid: '8965' + Math.random().toString().slice(2, 18),
        old_iccid_deactivated: true,
        delivery_method: 'Store Pickup',
      },
    },
  },
  // ============================================================
  // PERSONAL / REPLIKA-STYLE ENTITY EVENTS (Avatar-Level Memory)
  // ============================================================
  {
    id: 'profile-personality-update',
    name: 'Personality & Interests Update',
    description: 'User profile with personality traits, interests, and preferences',
    icon: User,
    event: {
      event_type: 'USER_PROFILE_UPDATE',
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      msisdn: '+6591234567',
      transaction_id: 'txn_profile_' + Date.now(),
      timestamp: new Date().toISOString(),
      amount: 0,
      currency: 'SGD',
      source_system: 'circles_app',
      metadata: {
        // PersonalityTrait entities (Replika-style Big Five)
        personality_traits: [
          { trait_type: 'introverted', strength: 0.7, self_identified: true },
          { trait_type: 'creative', strength: 0.85, self_identified: true },
          { trait_type: 'empathetic', strength: 0.9, self_identified: false },
        ],
        // Interest entities
        interests: [
          { category: 'music', specific_interest: 'K-pop', enthusiasm_level: 'passionate' },
          { category: 'games', specific_interest: 'RPGs', enthusiasm_level: 'enthusiast' },
          { category: 'photography', specific_interest: 'Street photography', enthusiasm_level: 'interested' },
        ],
        // Hobby entities
        hobbies: [
          { hobby_type: 'gaming', frequency: 'regularly', skill_level: 'advanced' },
          { hobby_type: 'photography', frequency: 'occasionally', skill_level: 'intermediate' },
        ],
        // CommunicationPreference entities
        communication_preferences: [
          { preference_type: 'casual', strength: 0.8 },
          { preference_type: 'emoji_loving', strength: 0.6 },
          { preference_type: 'night_owl', strength: 0.9 },
        ],
        // FavoriteEntity
        favorites: [
          { category: 'artist', name: 'BTS', reason: 'Their music got me through tough times' },
          { category: 'game', name: 'Final Fantasy XIV', reason: 'Met my best online friends there' },
        ],
      },
    },
  },
  {
    id: 'relationship-emotional-update',
    name: 'Relationships & Emotional State',
    description: 'User relationships, pets, and current emotional state',
    icon: Heart,
    event: {
      event_type: 'USER_CONTEXT_UPDATE',
      user_id: 'usr_550e8400-e29b-41d4-a716-446655440000',
      msisdn: '+6591234567',
      transaction_id: 'txn_context_' + Date.now(),
      timestamp: new Date().toISOString(),
      amount: 0,
      currency: 'SGD',
      source_system: 'circles_app',
      metadata: {
        // Person entities (relationships)
        relationships: [
          {
            name: 'Mom',
            relationship_type: 'parent',
            closeness: 'very_close',
            notes: 'Talks to her every weekend, she lives in Osaka',
          },
          {
            name: 'Kenji',
            relationship_type: 'best_friend',
            closeness: 'close',
            notes: 'College roommate, now works at same company',
          },
          {
            name: 'Yuki',
            relationship_type: 'ex',
            closeness: 'estranged',
            notes: 'Broke up 6 months ago, still hurts sometimes',
          },
        ],
        // Pet entity
        pet: {
          name: 'Mochi',
          species: 'cat',
          breed: 'Scottish Fold',
          age: '3 years',
          significance: 'Adopted during pandemic, my emotional support',
        },
        // EmotionalState entity
        emotional_state: {
          mood: 'anxious',
          energy_level: 'tired',
          stress_level: 7,
          context: 'Work deadline this week, sleeping poorly',
        },
        // LifeEvent entities
        recent_life_events: [
          {
            event_type: 'promotion',
            date: '2025-11-15',
            description: 'Promoted to Senior Engineer',
            emotional_impact: 'happy',
          },
          {
            event_type: 'breakup',
            date: '2025-07-20',
            description: 'Ended 2-year relationship with Yuki',
            emotional_impact: 'very_sad',
          },
        ],
        // Goal entity
        goals: [
          {
            goal_type: 'career',
            description: 'Become a tech lead by 2027',
            progress: 'in_progress',
          },
          {
            goal_type: 'travel',
            description: 'Visit Seoul to see BTS concert',
            progress: 'not_started',
          },
        ],
      },
    },
  },
];

interface BSSEventPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  event: BusinessEvent;
}

interface BSSEventPresetSelectorProps {
  selectedPreset: string | null;
  onSelect: (presetId: string, event: BusinessEvent) => void;
}

export function BSSEventPresetSelector({
  selectedPreset,
  onSelect,
}: BSSEventPresetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPresetData = BSS_EVENT_PRESETS.find((p) => p.id === selectedPreset);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg border transition-all',
          'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
          isOpen && 'bg-white/10 border-blue-500/50'
        )}
      >
        <div className="flex items-center gap-2">
          {selectedPresetData ? (
            <>
              <selectedPresetData.icon className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">
                {selectedPresetData.name}
              </span>
            </>
          ) : (
            <>
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white/90">
                Select BSS Event Type
              </span>
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-white/60 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          'absolute top-full left-0 right-0 mt-2 py-2 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden transition-all max-h-[320px] overflow-y-auto',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        {BSS_EVENT_PRESETS.map((preset) => {
          const IconComponent = preset.icon;
          return (
            <button
              key={preset.id}
              onClick={() => {
                // Generate fresh event with current timestamp
                const freshEvent = {
                  ...preset.event,
                  timestamp: new Date().toISOString(),
                  transaction_id: `txn_${preset.id}_${Date.now()}`,
                };
                onSelect(preset.id, freshEvent);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-4 py-3 text-left hover:bg-white/5 transition-colors',
                selectedPreset === preset.id && 'bg-blue-500/20'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'p-2 rounded-lg mt-0.5',
                  selectedPreset === preset.id ? 'bg-blue-500/30' : 'bg-white/5'
                )}>
                  <IconComponent className={cn(
                    'w-4 h-4',
                    selectedPreset === preset.id ? 'text-blue-400' : 'text-white/60'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{preset.name}</p>
                    {selectedPreset === preset.id && (
                      <span className="text-xs text-blue-400 ml-2">Selected</span>
                    )}
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">
                    {preset.description}
                  </p>
                  <p className="text-[10px] text-white/40 mt-1 font-mono">
                    {preset.event.event_type}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export { BSS_EVENT_PRESETS };
