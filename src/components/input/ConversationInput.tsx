'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { JsonEditor } from '@/components/ui/JsonDisplay';
import { cn } from '@/lib/utils/cn';
import type { ConversationMetadata } from '@/types/demo';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface ConversationInputProps {
  transcript: string;
  metadata: ConversationMetadata | null;
  onTranscriptChange: (text: string) => void;
  onMetadataChange: (meta: ConversationMetadata | null) => void;
}

const PLACEHOLDER_TRANSCRIPT = `Agent: Hi, welcome to Circles support. How can I help?
User: My international roaming is not working.
Agent: Which country are you currently in?
User: I am in Japan.`;

// Static placeholder to avoid hydration mismatch (no Date.now() or dynamic values)
const PLACEHOLDER_METADATA = `{
  "user_id": "usr_550e8400-e29b-41d4-a716-446655440000",
  "conversation_id": "conv_example",
  "channel": "in_app_support_chat",
  "started_at": "2025-01-15T00:00:00.000Z",
  "ended_at": "2025-01-15T00:05:00.000Z"
}`;

export function ConversationInput({
  transcript,
  metadata,
  onTranscriptChange,
  onMetadataChange,
}: ConversationInputProps) {
  const [metadataString, setMetadataString] = useState<string>(
    metadata ? JSON.stringify(metadata, null, 2) : ''
  );
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);

  // Sync metadataString when metadata prop changes (e.g., from preset loading)
  useEffect(() => {
    if (metadata) {
      setMetadataString(JSON.stringify(metadata, null, 2));
      setMetadataError(null);
    } else {
      setMetadataString('');
    }
  }, [metadata]);

  const handleMetadataChange = useCallback(
    (newValue: string) => {
      setMetadataString(newValue);

      if (!newValue.trim()) {
        setMetadataError(null);
        onMetadataChange(null);
        return;
      }

      try {
        const parsed = JSON.parse(newValue) as ConversationMetadata;

        if (!parsed.user_id) {
          setMetadataError('Missing required field: user_id');
          return;
        }

        setMetadataError(null);
        onMetadataChange(parsed);
      } catch {
        setMetadataError('Invalid JSON format');
      }
    },
    [onMetadataChange]
  );

  // Highlight emotional keywords and speaker labels
  const highlightedTranscript = transcript
    .split('\n')
    .map((line) => {
      // Highlight speaker labels
      let highlighted = line.replace(
        /^(Agent|User):/,
        '<span class="text-purple-400 font-semibold">$1:</span>'
      );

      // Highlight emotional keywords
      highlighted = highlighted.replace(
        /\b(frustrat|upset|angry|urgent|problem|issue|not working|thank|great|appreciate)\w*/gi,
        '<span class="text-yellow-400">$&</span>'
      );

      return highlighted;
    })
    .join('\n');

  return (
    <Card id="conversation" variant="glass">
      <CardHeader
        badge={
          <Badge variant="episode">
            <MessageSquare className="w-3 h-3 mr-1" />
            Chat
          </Badge>
        }
      >
        Customer Support Interaction (Conversational / Interpretive)
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white/70 mb-3">
          This is what the user said. Facts must be inferred and validated.
        </p>

        {/* Transcript Input */}
        <div className="relative mb-4">
          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder={PLACEHOLDER_TRANSCRIPT}
            rows={8}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
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

        {/* Collapsible Metadata Section */}
        <div className="border-t border-white/10 pt-3">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors w-full"
          >
            {showMetadata ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            <span className="flex-1 text-left">Conversation Metadata</span>
            <span className="text-white/40 text-[10px]">
              {metadata ? 'Configured' : 'Optional'}
            </span>
          </button>

          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              showMetadata ? 'max-h-[500px] mt-3' : 'max-h-0'
            )}
          >
            <p className="text-xs text-white/50 mb-2">
              Channel context used by Graphiti for temporal resolution (user_id, channel, timestamps).
              Auto-populated when loading presets.
            </p>
            <JsonEditor
              value={metadataString}
              onChange={handleMetadataChange}
              placeholder={PLACEHOLDER_METADATA}
              rows={6}
              error={metadataError}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
