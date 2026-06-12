import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Trash2, User, Calendar, HardDrive, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../types/gallery';
import { deleteGalleryItem } from '../services/tripGalleryApi';

interface GalleryViewerProps {
  items: GalleryItem[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  currentUser: any;
  onItemDeleted: (deletedId: string) => void;
}

export default function GalleryViewer({
  items,
  selectedIndex,
  onClose,
  onNavigate,
  currentUser,
  onItemDeleted,
}: GalleryViewerProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const activeItem = items[selectedIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, items]);

  if (!activeItem) return null;

  const handlePrev = () => {
    setVideoLoaded(false);
    const prevIndex = selectedIndex === 0 ? items.length - 1 : selectedIndex - 1;
    onNavigate(prevIndex);
  };

  const handleNext = () => {
    setVideoLoaded(false);
    const nextIndex = selectedIndex === items.length - 1 ? 0 : selectedIndex + 1;
    onNavigate(nextIndex);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const hasDeletePermission = () => {
    if (!currentUser) return false;
    if (currentUser.email === 'avishekmajumderpciu@gmail.com') return true;
    return activeItem.uploadedByUid === currentUser.uid;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGalleryItem(activeItem.driveFileId);
      setIsDeleting(false);
      setShowConfirmDelete(false);
      onItemDeleted(activeItem.driveFileId);
    } catch (err) {
      console.error("Failed to delete gallery file", err);
      setIsDeleting(false);
      alert("Failed to delete file. Please check permissions or try again.");
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = activeItem.downloadUrl || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', activeItem.originalName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isVideo = activeItem.type === 'video';

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 text-white font-sans overflow-hidden">
      {/* Upper Navigation and Details */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between shrink-0 z-55">
        <div className="min-w-0 pr-4">
          <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wide truncate">
            {activeItem.originalName}
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] sm:text-xs text-slate-350 font-bold uppercase tracking-wide">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{activeItem.uploadedByName}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{new Date(activeItem.createdTime).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{formatFileSize(activeItem.size)}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownload}
            className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 transition rounded-xl text-white cursor-pointer"
            title="Download Media"
          >
            <Download className="w-4 h-4" />
          </button>

          {hasDeletePermission() ? (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 sm:p-2.5 bg-rose-500/15 hover:bg-rose-500/35 active:scale-95 transition rounded-xl text-rose-400 cursor-pointer"
              title="Delete Media"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="group relative">
              <button
                disabled
                className="p-2 sm:p-2.5 bg-white/5 text-slate-500 rounded-xl cursor-not-allowed"
                title="Only uploader or organizer can delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <span className="absolute bottom-full right-0 mb-2 w-48 scale-0 transition-all rounded bg-slate-900 border border-slate-700 p-2 text-[10px] text-center text-slate-300 group-hover:scale-100 uppercase font-black z-50">
                Only the uploader or organizer can delete this
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 bg-white/15 hover:bg-white/25 active:scale-95 transition rounded-xl text-white cursor-pointer"
            title="Close Fullscreen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        {/* Next/Prev Navigation overlay (hidden on extremely small screens but accessible on buttons) */}
        <button
          onClick={handlePrev}
          className="absolute left-4 z-40 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-black/60 hover:scale-105 active:scale-95 transition text-white/80 hover:text-white cursor-pointer md:block hidden"
          aria-label="Previous Media"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 z-40 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-black/60 hover:scale-105 active:scale-95 transition text-white/80 hover:text-white cursor-pointer md:block hidden"
          aria-label="Next Media"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Media Block container */}
        <div className="w-full max-w-5xl max-h-[75vh] flex items-center justify-center select-none relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.driveFileId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full flex items-center justify-center"
            >
              {isVideo ? (
                <div className="w-full max-h-[75vh] relative flex flex-col items-center">
                  {!videoLoaded && (
                    <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center bg-transparent gap-2">
                      <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                      <span className="text-xs text-slate-405 font-bold uppercase tracking-wider">Streaming Video...</span>
                    </div>
                  )}
                  {/* Since Direct Drive streaming works best when we use drive webContentLink or embed link, fallback to normal video element */}
                  <video
                    src={activeItem.downloadUrl}
                    controls
                    autoplay
                    playsInline
                    onPlay={() => setVideoLoaded(true)}
                    onLoadedData={() => setVideoLoaded(true)}
                    className="max-w-full max-h-[75vh] rounded-xl shadow-lg border border-slate-900 object-contain"
                  />
                  {!videoLoaded && (
                    <div className="mt-4 flex flex-col items-center gap-1 pb-4">
                      <p className="text-[10px] text-slate-400 uppercase font-black text-center px-4 leading-relaxed">
                        If buffering or streaming is blocked, fall back to opening directly:
                      </p>
                      <a
                        href={activeItem.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                      >
                        Play in Google Drive
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={activeItem.previewUrl || activeItem.thumbnailUrl}
                  alt={activeItem.originalName}
                  className="max-w-full max-h-[75vh] rounded-xl shadow-2xl border border-slate-900 object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Failover image download viewLink
                    const img = e.target as HTMLImageElement;
                    if (activeItem.webViewLink && img.src !== activeItem.webViewLink) {
                      img.src = activeItem.webViewLink;
                    }
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Swipe support status/indicators or Thumb slider details info for Mobile */}
      <div className="p-4 sm:p-5 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between shrink-0 text-slate-400 text-xs font-bold font-sans uppercase">
        <div className="flex gap-4 md:hidden">
          <button
            onClick={handlePrev}
            className="px-3 py-2 bg-white/10 rounded-lg text-white"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-2 bg-white/10 rounded-lg text-white"
          >
            Next
          </button>
        </div>

        <span className="mx-auto select-none font-mono">
          {selectedIndex + 1} / {items.length}
        </span>
      </div>

      {/* Confirmation Modal overlay */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xxs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-850 p-6 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <h5 className="text-sm font-black text-white uppercase tracking-wider mb-2">Delete Media</h5>
              <p className="text-xs text-slate-350 leading-relaxed mb-6">
                Are you sure you want to delete this media from the trip gallery? This will remove the file from the Cox Voyage 2026 digital board.
              </p>
              <div className="flex justify-end gap-3 font-black text-xs uppercase">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 hover:bg-white/10 rounded-xl text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-white cursor-pointer flex items-center gap-1.5"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
