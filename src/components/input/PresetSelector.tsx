'use client';

import { useState } from 'react';
import { DEMO_PRESETS } from '@/mocks/presets';
import { cn } from '@/lib/utils/cn';
import { Sparkles, ChevronDown } from 'lucide-react';

interface PresetSelectorProps {
  selectedPreset: string | null;
  onSelect: (presetId: string) => void;
}

export function PresetSelector({ selectedPreset, onSelect }: PresetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPresetData = DEMO_PRESETS.find((p) => p.id === selectedPreset);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg border transition-all',
          'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
          isOpen && 'bg-white/10 border-purple-500/50'
        )}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white/80">
            {selectedPresetData ? selectedPresetData.name : 'Load Demo Preset'}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-white/50 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          'absolute top-full left-0 right-0 mt-2 py-2 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden transition-all',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        {DEMO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              onSelect(preset.id);
              setIsOpen(false);
            }}
            className={cn(
              'w-full px-4 py-3 text-left hover:bg-white/5 transition-colors',
              selectedPreset === preset.id && 'bg-purple-500/20'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/90">{preset.name}</p>
                <p className="text-xs text-white/50 mt-0.5">
                  {preset.description}
                </p>
              </div>
              {selectedPreset === preset.id && (
                <span className="text-xs text-purple-400">Selected</span>
              )}
            </div>
          </button>
        ))}
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
