import React, { useState, useEffect } from 'react';
import { X, ExternalLink, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface BookingDocumentViewerProps {
  title: string;
  type: string;
  viewUrl: string;
  embedUrl: string;
  onClose: () => void;
}

export default function BookingDocumentViewer({
  title,
  type,
  viewUrl,
  embedUrl,
  onClose,
}: BookingDocumentViewerProps) {
  const [iframeError, setIframeError] = useState(false);

  // Esc key closes the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs transition-opacity overflow-hidden animate-fade-in" role="dialog" aria-modal="true">
      <div className="relative w-full h-full sm:max-w-4xl sm:h-[85vh] bg-white dark:bg-[#0F1B2D] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden border border-transparent dark:border-slate-800 transition-colors duration-305">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-[#111C30]/50 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#006CE4]" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-white leading-none">
                {title}
              </h3>
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-extrabold text-[#006CE4] dark:text-sky-400 mt-1 cursor-default">
                {type} Document
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-[#1A263F] text-slate-505 dark:text-slate-300 cursor-pointer transition duration-150"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - IFrame / Fallback */}
        <div className="flex-1 min-h-0 bg-slate-100 dark:bg-[#070E1A] relative flex items-center justify-center p-2 sm:p-4">
          {!iframeError ? (
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-2xl border-0 shadow-xs"
              allow="autoplay"
              referrerPolicy="no-referrer"
              onError={() => setIframeError(true)}
              title={`${title} Preview`}
            ></iframe>
          ) : (
            <div className="max-w-md text-center p-6 space-y-4 bg-white dark:bg-[#0F1A30] rounded-2.5xl shadow-sm border border-slate-150 dark:border-slate-800">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
              <p className="text-sm text-slate-600 dark:text-slate-305 font-bold leading-relaxed">
                Document preview could not be loaded. Open it in Google Drive.
              </p>
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#006CE4] hover:bg-[#0051BE] text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Google Drive</span>
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-55 dark:bg-[#111C30]/50 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold font-sans">
            💡 Press ESC key anytime to exit viewer
          </span>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-xl text-xs font-black bg-[#006CE4] hover:bg-[#0051BE] text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in Google Drive</span>
            </a>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-505 dark:text-slate-400 border border-slate-250 dark:border-slate-700 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
