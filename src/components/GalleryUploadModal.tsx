import React, { useState, useRef } from 'react';
import { X, Upload, Film, Image as ImageIcon, Loader2, CheckCircle2, AlertTriangle, FileUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { uploadGalleryFile } from '../services/tripGalleryApi';

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUploadSuccess: (uploadedItemsCount: number) => void;
}

interface UploadQueueItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'failed';
  error?: string;
}

export default function GalleryUploadModal({
  isOpen,
  onClose,
  user,
  onUploadSuccess,
}: GalleryUploadModalProps) {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isUploadingGlobal, setIsUploadingGlobal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFilesToQueue(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFilesToQueue(Array.from(e.target.files));
    }
  };

  const validateFile = (file: File): string | null => {
    const isImage = file.type.startsWith('image/') || file.name.endsWith('.heic') || file.name.endsWith('.heif');
    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mov') || file.name.endsWith('.QT');

    if (!isImage && !isVideo) {
      return 'Only photos and videos are allowed.';
    }

    const MAX_IMAGE_SIZE = 100 * 1024 * 1024; // 100 MB
    const MAX_VIDEO_SIZE = 10 * 1024 * 1024 * 1024; // 10 GB

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return 'File is too large. Maximum image size is 100 MB.';
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return 'File is too large. Maximum video size is 10 GB.';
    }

    return null;
  };

  const addFilesToQueue = (files: File[]) => {
    const newItems: UploadQueueItem[] = files.map(file => {
      const error = validateFile(file);
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: error ? 'failed' : 'pending',
        error: error || undefined,
      };
    });

    setQueue(prev => [...prev, ...newItems]);
  };

  const removeQueueItem = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const startUploads = async () => {
    const pendingItems = queue.filter(item => item.status === 'pending');
    if (pendingItems.length === 0) return;

    setIsUploadingGlobal(true);

    let successCount = 0;

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status !== 'pending') continue;

      // Update status to uploading in UI
      setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'uploading' } : q));

      try {
        await uploadGalleryFile(item.file, user);
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'success' } : q));
        successCount++;
      } catch (err: any) {
        console.error("Failed uploading item ", item.file.name, err);
        setQueue(prev => prev.map(q => q.id === item.id ? { 
          ...q, 
          status: 'failed', 
          error: err instanceof Error ? err.message : 'Upload failed. Please try again.' 
        } : q));
      }
    }

    setIsUploadingGlobal(false);
    if (successCount > 0) {
      onUploadSuccess(successCount);
    }
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isPendingInQueue = queue.some(item => item.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-[#0F1B2D] border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#1A263F]/20 text-slate-900 dark:text-white shrink-0">
          <div className="flex items-center gap-2">
            <FileUp className="w-5 h-5 text-[#006CE4]" />
            <h3 className="text-sm font-black tracking-tight uppercase">Upload Trip Memories</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isUploadingGlobal}
            className="p-1 px-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
              dragActive
                ? 'border-[#006CE4] bg-sky-50/20 dark:bg-sky-950/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/10'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploadingGlobal}
            />
            <div className="p-3 bg-sky-50 dark:bg-sky-950/20 rounded-full text-[#006CE4] mb-3">
              <Upload className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wide mb-1">
              Drag & drop photos or videos here
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              or click to browse your files
            </p>
            <div className="flex gap-4 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Max Photo: 25MB</span>
              <span>•</span>
              <span>Max Video: 300MB</span>
            </div>
          </div>

          {/* Upload Queue */}
          {queue.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-black text-slate-505 dark:text-slate-400 uppercase tracking-widest leading-none">
                  Selected Files ({queue.length})
                </span>
                <button
                  type="button"
                  onClick={clearQueue}
                  disabled={isUploadingGlobal}
                  className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 tracking-wide select-none cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {queue.map(item => {
                  const isImage = item.file.type.startsWith('image/');
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 dark:bg-[#1A263F]/20 rounded-xl border border-slate-150 dark:border-slate-800 flex items-center justify-between gap-4 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          isImage ? 'bg-amber-500/10 text-amber-500' : 'bg-sky-500/10 text-sky-500'
                        }`}>
                          {isImage ? <ImageIcon className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate leading-tight">
                            {item.file.name}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {formatFileSize(item.file.size)}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {item.status === 'pending' && (
                          <button
                            onClick={() => removeQueueItem(item.id)}
                            disabled={isUploadingGlobal}
                            className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-rose-500 transition cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {item.status === 'uploading' && (
                          <div className="flex items-center gap-1.5">
                            <Loader2 className="w-3.5 h-3.5 text-[#006CE4] animate-spin" />
                            <span className="text-[10px] font-extrabold text-[#006CE4] uppercase">Uploading...</span>
                          </div>
                        )}

                        {item.status === 'success' && (
                          <div className="flex items-center gap-1.5 text-emerald-500">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span className="text-[10px] font-extrabold uppercase">Done</span>
                          </div>
                        )}

                        {item.status === 'failed' && (
                          <div className="flex flex-col items-end gap-0.5">
                            <div className="flex items-center gap-1 text-rose-500">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-[10px] font-extrabold uppercase">Failed</span>
                            </div>
                            {item.error && (
                              <p className="text-[9px] text-rose-400 max-w-[150px] truncate text-right">
                                {item.error}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-[#1A263F]/10 flex items-center justify-between gap-4 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {queue.filter(q => q.status === 'success').length} of {queue.length} files uploaded successfully.
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={onClose}
              disabled={isUploadingGlobal}
              className="px-4 py-2 text-xs font-black text-slate-600 dark:text-slate-350 bg-transparent hover:bg-slate-100 dark:hover:bg-[#1A263F] border border-slate-200 dark:border-slate-850 rounded-xl transition cursor-pointer active:scale-95 leading-none"
            >
              Close
            </button>
            <button
              onClick={startUploads}
              disabled={!isPendingInQueue || isUploadingGlobal}
              className={`px-4 py-2 text-xs font-black text-white rounded-xl transition active:scale-95 leading-none flex items-center gap-1.5 cursor-pointer ${
                isPendingInQueue && !isUploadingGlobal
                  ? 'bg-[#003B95] hover:bg-[#002B70]'
                  : 'bg-slate-200 dark:bg-[#1A263F] text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {isUploadingGlobal ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload Now</span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
