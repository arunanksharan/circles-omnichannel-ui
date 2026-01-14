'use client';

import { Button } from '@/components/ui/Button';
import { Send, RefreshCw } from 'lucide-react';

interface SubmitButtonProps {
  onClick: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export function SubmitButton({ onClick, isSubmitting, disabled }: SubmitButtonProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onClick}
        isLoading={isSubmitting}
        disabled={disabled || isSubmitting}
        variant="primary"
        size="lg"
        rightIcon={!isSubmitting && <Send className="w-4 h-4" />}
        className="flex-1"
      >
        {isSubmitting ? 'Processing...' : 'Process with Graphiti'}
      </Button>
    </div>
  );
}

interface ResetButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function ResetButton({ onClick, disabled }: ResetButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="ghost"
      size="md"
      leftIcon={<RefreshCw className="w-4 h-4" />}
    >
      Reset
    </Button>
  );
}
