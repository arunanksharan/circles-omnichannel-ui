'use client';

import { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import { Heart, User, Users, Cat, Target, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface PersonalContextInputProps {
  transcript: string;
  onTranscriptChange: (text: string) => void;
}

const PLACEHOLDER_TRANSCRIPT = `Agent: Hi there! How can I help you today?
User: Hey, I'm a bit stressed. My data ran out and I need it for work tonight.
Agent: No worries, let me check your account.
User: Thanks. My cat Mochi is sitting on my laptop like she knows I'm stressed 😅
Agent: Aww, cats always seem to know! Scottish Folds are especially intuitive.
User: Yeah, I've been playing Genshin Impact to destress after work lately.`;

// Entity detection patterns for visual highlighting
const ENTITY_PATTERNS = {
  pet: /\b(cat|dog|pet|puppy|kitten|hamster|bird|fish)\s+(?:named?\s+)?(\w+)/gi,
  relationship: /\b(mom|dad|mother|father|grandma|grandmother|grandpa|grandfather|sister|brother|wife|husband|friend|partner)\b/gi,
  emotion: /\b(stressed|anxious|worried|happy|excited|frustrated|tired|exhausted|sad|depressed)\b/gi,
  hobby: /\b(playing|watch(?:ing)?|read(?:ing)?|gaming|cooking|hiking|running|yoga|meditation)\b/gi,
  interest: /\b(Genshin Impact|Netflix|Spotify|Instagram|TikTok|YouTube|anime|K-pop|BTS|manga)\b/gi,
  goal: /\b(want to|planning to|hoping to|goal|dream|aspire)\b/gi,
};

export function PersonalContextInput({
  transcript,
  onTranscriptChange,
}: PersonalContextInputProps) {
  const [showHints, setShowHints] = useState(true);

  // Count detected entities for indicators
  const detectedEntities = {
    pets: (transcript.match(ENTITY_PATTERNS.pet) || []).length,
    relationships: (transcript.match(ENTITY_PATTERNS.relationship) || []).length,
    emotions: (transcript.match(ENTITY_PATTERNS.emotion) || []).length,
    hobbies: (transcript.match(ENTITY_PATTERNS.hobby) || []).length,
    interests: (transcript.match(ENTITY_PATTERNS.interest) || []).length,
    goals: (transcript.match(ENTITY_PATTERNS.goal) || []).length,
  };

  const totalDetected = Object.values(detectedEntities).reduce((a, b) => a + b, 0);

  return (
    <Card id="personal-context-input" variant="glass">
      <CardHeader
        badge={
          <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
            <Heart className="w-3 h-3 mr-1" />
            Avatar Memory
          </Badge>
        }
      >
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-pink-400" />
          Personal Context (Conversational / Interpretive)
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white/70 mb-3">
          Conversations that reveal personal details - pets, relationships, emotions, interests, goals.
        </p>

        {/* Entity Detection Indicators */}
        {transcript.length > 0 && totalDetected > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {detectedEntities.pets > 0 && (
              <EntityIndicator icon={Cat} label="Pet" count={detectedEntities.pets} color="pink" />
            )}
            {detectedEntities.relationships > 0 && (
              <EntityIndicator icon={Users} label="Relationship" count={detectedEntities.relationships} color="purple" />
            )}
            {detectedEntities.emotions > 0 && (
              <EntityIndicator icon={Heart} label="Emotion" count={detectedEntities.emotions} color="red" />
            )}
            {detectedEntities.interests > 0 && (
              <EntityIndicator icon={Sparkles} label="Interest" count={detectedEntities.interests} color="blue" />
            )}
            {detectedEntities.goals > 0 && (
              <EntityIndicator icon={Target} label="Goal" count={detectedEntities.goals} color="green" />
            )}
          </div>
        )}

        {/* Transcript Input */}
        <div className="relative mb-4">
          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder={PLACEHOLDER_TRANSCRIPT}
            rows={8}
            className="w-full bg-black/40 border border-pink-500/20 rounded-lg p-4 font-mono text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none"
            spellCheck={false}
          />
          {transcript && (
            <div className="absolute top-2 right-2">
              <span className="text-xs text-white/40">
                {transcript.length} chars
              </span>
            </div>
          )}
        </div>

        {/* Collapsible Hints Section */}
        <div className="border-t border-white/10 pt-3">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors w-full"
          >
            {showHints ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            What entities are detected?
          </button>

          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              showHints ? 'max-h-96 mt-3' : 'max-h-0'
            )}
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              <HintItem icon={Cat} label="Pets" example="My cat Mochi..." color="pink" />
              <HintItem icon={Users} label="Relationships" example="My mom, grandma..." color="purple" />
              <HintItem icon={Heart} label="Emotions" example="I'm stressed..." color="red" />
              <HintItem icon={Sparkles} label="Interests" example="Playing Genshin..." color="blue" />
              <HintItem icon={Target} label="Goals" example="I want to..." color="green" />
              <HintItem icon={User} label="Personality" example="I'm introverted..." color="yellow" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface EntityIndicatorProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  color: 'pink' | 'purple' | 'red' | 'blue' | 'green' | 'yellow';
}

function EntityIndicator({ icon: Icon, label, count, color }: EntityIndicatorProps) {
  const colorClasses = {
    pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border', colorClasses[color])}>
      <Icon className="w-3 h-3" />
      {label} ({count})
    </span>
  );
}

interface HintItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  example: string;
  color: 'pink' | 'purple' | 'red' | 'blue' | 'green' | 'yellow';
}

function HintItem({ icon: Icon, label, example, color }: HintItemProps) {
  const colorClasses = {
    pink: 'text-pink-400',
    purple: 'text-purple-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="flex items-start gap-2 p-2 bg-white/5 rounded-lg">
      <Icon className={cn('w-3 h-3 mt-0.5 flex-shrink-0', colorClasses[color])} />
      <div>
        <span className="font-medium text-white/90">{label}</span>
        <p className="text-white/50 mt-0.5">{example}</p>
      </div>
    </div>
  );
}
