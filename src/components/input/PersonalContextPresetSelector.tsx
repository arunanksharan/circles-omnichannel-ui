'use client';

import { useState } from 'react';
import { PERSONAL_CONTEXT_PRESETS } from '@/mocks/presets';
import { cn } from '@/lib/utils/cn';
import { Heart, ChevronDown, User, Users } from 'lucide-react';

interface PersonalContextPresetSelectorProps {
  selectedPreset: string | null;
  onSelect: (presetId: string) => void;
}

// Map preset IDs to icons
const presetIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'personal-context-pet-stress': Heart,
  'personal-context-family-travel': Users,
};

export function PersonalContextPresetSelector({
  selectedPreset,
  onSelect,
}: PersonalContextPresetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPresetData = PERSONAL_CONTEXT_PRESETS.find(
    (p) => p.id === selectedPreset
  );

  return (
    <div className="relative">
      {/* Section Label */}
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-pink-400" />
        <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
          Personal Context (Avatar Memory)
        </span>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg border transition-all',
          'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
          isOpen && 'bg-white/10 border-pink-500/50'
        )}
      >
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-medium text-white">
            {selectedPresetData
              ? selectedPresetData.name
              : 'Load Personal Context Preset'}
          </span>
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
          'absolute top-full left-0 right-0 mt-2 py-2 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden transition-all',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        {PERSONAL_CONTEXT_PRESETS.map((preset) => {
          const IconComponent = presetIcons[preset.id] || Heart;
          return (
            <button
              key={preset.id}
              onClick={() => {
                onSelect(preset.id);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-4 py-3 text-left hover:bg-white/5 transition-colors',
                selectedPreset === preset.id && 'bg-pink-500/20'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg mt-0.5',
                    selectedPreset === preset.id
                      ? 'bg-pink-500/30'
                      : 'bg-white/5'
                  )}
                >
                  <IconComponent
                    className={cn(
                      'w-4 h-4',
                      selectedPreset === preset.id
                        ? 'text-pink-400'
                        : 'text-white/60'
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">
                      {preset.name}
                    </p>
                    {selectedPreset === preset.id && (
                      <span className="text-xs text-pink-400 ml-2">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">
                    {preset.description}
                  </p>
                  <p className="text-[10px] text-white/40 mt-1 font-mono">
                    {preset.businessEvent.event_type}
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
