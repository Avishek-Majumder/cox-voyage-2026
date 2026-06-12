import React, { useState } from 'react';
import { Copy, Check, AlertTriangle } from 'lucide-react';

interface CopyButtonProps {
  value: string;
  label?: string;
  successText?: string;
  className?: string;
}

export default function CopyButton({
  value,
  label = 'Copy',
  successText = 'Copied',
  className = '',
}: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        setStatus('success');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.style.position = 'fixed'; // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          setStatus('success');
        } else {
          throw new Error('Fallback execCommand copy failed');
        }
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setStatus('error');
    }

    setTimeout(() => {
      setStatus('idle');
    }, 1500);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-black transition-all active:scale-95 cursor-pointer ${
        status === 'success'
          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 text-emerald-600 dark:text-emerald-400'
          : status === 'error'
          ? 'bg-rose-50 dark:bg-[#1A111E] border-rose-300 text-rose-500'
          : 'bg-white hover:bg-slate-50 dark:bg-[#111C2E] dark:hover:bg-[#1C2C47] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350'
      } ${className}`}
      aria-label={status === 'success' ? successText : `Copy ${label}`}
    >
      {status === 'success' ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
          <span>{successText}</span>
        </>
      ) : status === 'error' ? (
        <>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>Could not copy. Please copy manually.</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
