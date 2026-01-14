'use client';

import { cn } from '@/lib/utils/cn';
import { useMemo } from 'react';

interface JsonDisplayProps {
  data: unknown;
  className?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
}

export function JsonDisplay({
  data,
  className,
  maxHeight = '300px',
  showLineNumbers = false,
}: JsonDisplayProps) {
  const formattedJson = useMemo(() => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      return syntaxHighlight(jsonString);
    } catch {
      return '<span class="text-red-400">Invalid JSON</span>';
    }
  }, [data]);

  const lines = formattedJson.split('\n');

  return (
    <div
      className={cn(
        'code-block overflow-auto',
        className
      )}
      style={{ maxHeight }}
    >
      {showLineNumbers ? (
        <div className="flex">
          <div className="pr-4 text-white/30 select-none border-r border-white/10 mr-4">
            {lines.map((_, i) => (
              <div key={i} className="text-right">
                {i + 1}
              </div>
            ))}
          </div>
          <pre
            className="flex-1"
            dangerouslySetInnerHTML={{ __html: formattedJson }}
          />
        </div>
      ) : (
        <pre dangerouslySetInnerHTML={{ __html: formattedJson }} />
      )}
    </div>
  );
}

function syntaxHighlight(json: string): string {
  // Escape HTML
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g,
    (match) => {
      let cls = 'json-number'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key'; // key
          // Remove the colon from the match for keys
          return `<span class="${cls}">${match.slice(0, -1)}</span>:`;
        } else {
          cls = 'json-string'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean'; // boolean
      } else if (/null/.test(match)) {
        cls = 'json-null'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  error?: string | null;
}

export function JsonEditor({
  value,
  onChange,
  placeholder,
  className,
  rows = 10,
  error,
}: JsonEditorProps) {
  return (
    <div className={cn('relative', className)}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'w-full bg-black/40 border rounded-lg p-4 font-mono text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none',
          error ? 'border-red-500/50' : 'border-white/10'
        )}
        spellCheck={false}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
