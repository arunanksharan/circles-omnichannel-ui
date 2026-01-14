'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { JsonDisplay } from '@/components/ui/JsonDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import type { GraphitiCurrentState, PersonalContext } from '@/types/demo';
import { useAnimationStore } from '@/stores/animation-store';
import { Database, Clock, Heart, Cat, Users, Sparkles, Target, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CurrentStateCardProps {
  state: GraphitiCurrentState | null;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export function CurrentStateCard({
  state,
  isLoading,
  lastUpdated,
}: CurrentStateCardProps) {
  const { highlightedCards } = useAnimationStore();
  const isHighlighted = highlightedCards.includes('current-state');

  // Separate telecom state from personal context for display
  const telecomState = state ? {
    user_id: state.user_id,
    home_market: state.home_market,
    current_country: state.current_country,
    active_msisdn: state.active_msisdn,
    roaming_status: state.roaming_status,
    active_plan: state.active_plan,
    open_support_issue: state.open_support_issue,
    last_transaction: state.last_transaction,
  } : null;

  const personalContext = state?.personal_context;

  return (
    <Card
      id="current-state"
      variant="glass"
      isHighlighted={isHighlighted}
      highlightColor="green"
    >
      <CardHeader
        badge={<Badge variant="graphiti">SOURCE: GRAPHITI</Badge>}
      >
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-green-400" />
          Current Authoritative State
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white/70 mb-3">
          Current user state after resolving all channels and history
        </p>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <LoadingSkeleton />
            </motion.div>
          ) : state ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Telecom State */}
              <div>
                <p className="text-xs text-green-400 font-medium mb-2 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Telecom State
                </p>
                <JsonDisplay data={telecomState} />
              </div>

              {/* Personal Context (Avatar Memory) */}
              {personalContext && Object.keys(personalContext).length > 0 && (
                <PersonalContextDisplay context={personalContext} />
              )}

              {lastUpdated && (
                <div className="flex items-center gap-1 mt-3 text-xs text-white/40">
                  <Clock className="w-3 h-3" />
                  resolved_at: {lastUpdated.toISOString()}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-white/30"
            >
              <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No state resolved yet</p>
              <p className="text-xs mt-1">Submit data to see the current state</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

interface PersonalContextDisplayProps {
  context: PersonalContext;
}

function PersonalContextDisplay({ context }: PersonalContextDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-pink-500/20 pt-4"
    >
      <p className="text-xs text-pink-400 font-medium mb-3 flex items-center gap-1">
        <Heart className="w-3 h-3" />
        Personal Context (Avatar Memory)
      </p>

      <div className="space-y-3">
        {/* Pet */}
        {context.pet && (
          <ContextItem
            icon={Cat}
            label="Pet"
            color="pink"
          >
            <span className="text-white">{context.pet.name}</span>
            <span className="text-white/60 ml-1">
              ({context.pet.species}{context.pet.breed ? `, ${context.pet.breed}` : ''})
            </span>
          </ContextItem>
        )}

        {/* Relationships */}
        {context.relationships && context.relationships.length > 0 && (
          <ContextItem
            icon={Users}
            label="Relationships"
            color="purple"
          >
            <div className="flex flex-wrap gap-1">
              {context.relationships.map((rel, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-purple-500/20 rounded-full text-xs">
                  <span className="text-white">{rel.name}</span>
                  <span className="text-white/50 ml-1">({rel.relationship_type})</span>
                  {rel.location && <span className="text-white/40 ml-1">in {rel.location}</span>}
                </span>
              ))}
            </div>
          </ContextItem>
        )}

        {/* Emotional State */}
        {context.emotional_state && (
          <ContextItem
            icon={Heart}
            label="Emotional State"
            color="red"
          >
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs',
              context.emotional_state.mood === 'stressed' && 'bg-red-500/20 text-red-300',
              context.emotional_state.mood === 'anxious' && 'bg-orange-500/20 text-orange-300',
              context.emotional_state.mood === 'happy' && 'bg-green-500/20 text-green-300',
              context.emotional_state.mood === 'excited' && 'bg-blue-500/20 text-blue-300',
              context.emotional_state.mood === 'neutral' && 'bg-gray-500/20 text-gray-300',
              context.emotional_state.mood === 'sad' && 'bg-purple-500/20 text-purple-300',
            )}>
              {context.emotional_state.mood}
            </span>
            <span className="text-white/50 ml-2 text-xs">
              stress: {context.emotional_state.stress_level}/10
            </span>
          </ContextItem>
        )}

        {/* Interests */}
        {context.interests && context.interests.length > 0 && (
          <ContextItem
            icon={Sparkles}
            label="Interests"
            color="blue"
          >
            <div className="flex flex-wrap gap-1">
              {context.interests.map((interest, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-blue-500/20 rounded-full text-xs text-blue-300">
                  {interest.specific_interest}
                  <span className="text-blue-400/50 ml-1">({interest.enthusiasm_level})</span>
                </span>
              ))}
            </div>
          </ContextItem>
        )}

        {/* Life Events */}
        {context.life_events && context.life_events.length > 0 && (
          <ContextItem
            icon={User}
            label="Life Events"
            color="yellow"
          >
            <div className="space-y-1">
              {context.life_events.map((event, idx) => (
                <div key={idx} className="text-xs">
                  <span className="text-yellow-300">{event.event_type}:</span>
                  <span className="text-white/70 ml-1">{event.description}</span>
                </div>
              ))}
            </div>
          </ContextItem>
        )}

        {/* Goals */}
        {context.goals && context.goals.length > 0 && (
          <ContextItem
            icon={Target}
            label="Goals"
            color="green"
          >
            <div className="space-y-1">
              {context.goals.map((goal, idx) => (
                <div key={idx} className="text-xs flex items-center gap-2">
                  <span className="text-white/70">{goal.description}</span>
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[10px]',
                    goal.progress === 'completed' && 'bg-green-500/20 text-green-300',
                    goal.progress === 'in_progress' && 'bg-yellow-500/20 text-yellow-300',
                    goal.progress === 'not_started' && 'bg-gray-500/20 text-gray-300',
                  )}>
                    {goal.progress.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </ContextItem>
        )}
      </div>
    </motion.div>
  );
}

interface ContextItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: 'pink' | 'purple' | 'red' | 'blue' | 'green' | 'yellow';
  children: React.ReactNode;
}

function ContextItem({ icon: Icon, label, color, children }: ContextItemProps) {
  const colorClasses = {
    pink: 'text-pink-400',
    purple: 'text-purple-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <Icon className={cn('w-3.5 h-3.5 mt-0.5 flex-shrink-0', colorClasses[color])} />
        <div className="flex-1 min-w-0">
          <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-1', colorClasses[color])}>
            {label}
          </p>
          <div className="text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-4 bg-white/5 rounded animate-pulse"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}
