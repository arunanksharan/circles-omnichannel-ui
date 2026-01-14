'use client';

import { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { JsonEditor } from '@/components/ui/JsonDisplay';
import { BSSEventPresetSelector } from './BSSEventPresetSelector';
import type { BusinessEvent } from '@/types/demo';
import { Database } from 'lucide-react';

interface BusinessEventInputProps {
  value: BusinessEvent | null;
  onChange: (event: BusinessEvent | null) => void;
}

const PLACEHOLDER_EVENT = `{
  "event_type": "SIM_TOP_UP",
  "user_id": "usr_550e8400-e29b-41d4-a716-446655440000",
  "msisdn": "+6591234567",
  "transaction_id": "txn_example",
  "timestamp": "${new Date().toISOString()}",
  "amount": 20,
  "currency": "SGD",
  "source_system": "circles_bss",
  "metadata": {
    "roaming_pack_active": true
  }
}`;

export function BusinessEventInput({ value, onChange }: BusinessEventInputProps) {
  const [jsonString, setJsonString] = useState<string>(
    value ? JSON.stringify(value, null, 2) : ''
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleChange = useCallback(
    (newValue: string) => {
      setJsonString(newValue);

      if (!newValue.trim()) {
        setError(null);
        onChange(null);
        return;
      }

      try {
        const parsed = JSON.parse(newValue) as BusinessEvent;

        // Basic validation
        if (!parsed.event_type) {
          setError('Missing required field: event_type');
          return;
        }
        if (!parsed.user_id) {
          setError('Missing required field: user_id');
          return;
        }

        setError(null);
        onChange(parsed);
      } catch {
        setError('Invalid JSON format');
      }
    },
    [onChange]
  );

  const handlePresetSelect = useCallback(
    (presetId: string, event: BusinessEvent) => {
      setSelectedPreset(presetId);
      const newJsonString = JSON.stringify(event, null, 2);
      setJsonString(newJsonString);
      setError(null);
      onChange(event);
    },
    [onChange]
  );

  return (
    <Card id="business-event" variant="glass">
      <CardHeader
        badge={
          <Badge variant="info">
            <Database className="w-3 h-3 mr-1" />
            BSS Event
          </Badge>
        }
      >
        Mobile Network Event (Structured / Deterministic)
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white/70 mb-3">
          This is a factual system event. It may directly update user state.
        </p>

        {/* BSS Event Preset Selector */}
        <div className="mb-4">
          <BSSEventPresetSelector
            selectedPreset={selectedPreset}
            onSelect={handlePresetSelect}
          />
        </div>

        <JsonEditor
          value={jsonString}
          onChange={handleChange}
          placeholder={PLACEHOLDER_EVENT}
          rows={12}
          error={error}
        />
      </CardContent>
    </Card>
  );
}
