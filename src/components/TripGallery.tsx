import React, { useState, useEffect, useMemo } from 'react';
import { 
  Images, 
  Upload, 
  RefreshCw, 
  Search, 
  Image as ImageIcon, 
  Film, 
  Grid, 
  Info, 
  AlertCircle, 
  Lock,
  ArrowUpDown,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { GalleryItem } from '../types/gallery';
import { 
  listGalleryItems, 
  checkBackendStatus 
} from '../services/tripGalleryApi';
import GalleryUploadModal from './GalleryUploadModal';
import GalleryViewer from './GalleryViewer';

export default function TripGallery() {
  const { user, signInWithGoogle } = useAuth();
  
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConfigured, setIsBackendConfigured] = useState<boolean | null>(null);

  // Filter-related states
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'largest' | 'smallest'>('newest');

  // Modal / Lightbox states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Check backend configuration on mount
  useEffect(() => {
    async function verifyBackend() {
      try {
        const status = await checkBackendStatus();
        setIsBackendConfigured(status.configured);
      } catch {
        setIsBackendConfigured(false);
      }
    }
    verifyBackend();
  }, []);

  const loadMedia = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const loadedItems = await listGalleryItems();
      setItems(loadedItems);
    } catch (err: any) {
      console.error("Error loading gallery media:", err);
      setError(err?.message || "Unable to sync gallery photos. Please check your network connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Run initial load once user logs in
  useEffect(() => {
    if (user && isBackendConfigured) {
      loadMedia();
    }
  }, [user, isBackendConfigured]);

  const handleRefresh = () => {
    loadMedia(true);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Failed Google Sign In:", err);
      setError("Login failed or permission declined. Authentication is required to access the central gallery.");
    }
  };

  const handleUploadSuccess = (uploadedCount: number) => {
    loadMedia();
  };

  const handleItemDeletedInViewer = (deletedId: string) => {
    setItems(prev => prev.filter(item => item.driveFileId !== deletedId));
    setViewerIndex(null);
  };

  // Filter & Sort list
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.originalName.toLowerCase().includes(q) || 
        item.uploadedByName.toLowerCase().includes(q)
      );
    }

    // Media type filter
    if (mediaTypeFilter !== 'all') {
      result = result.filter(item => item.type === mediaTypeFilter);
    }

    // Sorting block
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime();
        case 'largest':
          return b.size - a.size;
        case 'smallest':
          return a.size - b.size;
        case 'newest':
        default:
          return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
      }
    });

    return result;
  }, [items, searchQuery, mediaTypeFilter, sortBy]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div id="trip-gallery" className="scroll-mt-16 mb-8 bg-white dark:bg-[#0F1A30] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 transition-all duration-300">
      
      {/* Title Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight uppercase leading-none">
            <Images className="w-5 h-5 text-[#006CE4]" />
            <span>Trip Gallery</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Share and view photos & videos from our Dhaka to Cox's Bazar Voyage 2026 squad trip.
          </p>
        </div>

        {user && isBackendConfigured && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center gap-1 text-xs font-bold uppercase select-none"
              title="Refresh Shared Gallery"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#006CE4] ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#006CE4] hover:bg-[#0051BE] text-white px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-xxs active:scale-95 uppercase select-none"
            >
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span>Upload Photos/Videos</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold uppercase flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Backend non-configured warning */}
      {isBackendConfigured === false ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-[#1A263F]/20 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center">
          <AlertCircle className="w-8 h-8 text-rose-500 mb-3 animate-pulse" />
          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">
            Storage Unconfigured
          </h4>
          <p className="text-[11px] text-slate-505 dark:text-slate-400 max-w-sm leading-relaxed">
            Trip Gallery backend is not configured yet. Organizer setup is required before uploads can work.
          </p>
        </div>
      ) : !user ? (
        // Google auth requirement for Identity
        <div className="p-8 text-center bg-slate-50 dark:bg-[#1A263F]/20 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center">
          <Lock className="w-8 h-8 text-slate-400 mb-3 animate-pulse" />
          <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2">
            Trip Gallery
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mb-5 leading-relaxed">
            Login with Google to upload and view Cox Voyage 2026 photos and videos. All uploads will be saved in the organizer’s central trip gallery storage.
          </p>
          <button
            onClick={handleGoogleSignIn}
            className="px-5 py-3 bg-[#006CE4] hover:bg-[#0051BE] text-white text-xs font-black transition rounded-xl flex items-center gap-2 cursor-pointer shadow-sm uppercase active:scale-95"
          >
            <UserCheck className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>
        </div>
      ) : (
        // Active Gallery Viewport
        <div>
          {/* Controls: Filter, Sort, Search */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
            {/* Search */}
            <div className="relative md:col-span-4">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search file name or uploader..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#006CE4] focus:outline-none placeholder-slate-400 text-slate-800 dark:text-white"
              />
            </div>

            {/* MediaType Select Filter */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-150 dark:border-slate-800 md:col-span-4 font-bold text-[10px] sm:text-xs">
              <button
                type="button"
                onClick={() => setMediaTypeFilter('all')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer select-none text-center ${
                  mediaTypeFilter === 'all' 
                    ? 'bg-[#006CE4] text-white font-black' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                All items
              </button>
              <button
                type="button"
                onClick={() => setMediaTypeFilter('image')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer select-none text-center flex items-center justify-center gap-1 ${
                  mediaTypeFilter === 'image' 
                    ? 'bg-[#006CE4] text-white font-black' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Photos</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaTypeFilter('video')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer select-none text-center flex items-center justify-center gap-1 ${
                  mediaTypeFilter === 'video' 
                    ? 'bg-[#006CE4] text-white font-black' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Film className="w-3 h-3" />
                <span>Videos</span>
              </button>
            </div>

            {/* Sorter Selector */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 px-3 py-1 bg-transparent rounded-xl md:col-span-4 relative">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full bg-transparent border-none text-[10px] sm:text-xs text-slate-650 dark:text-slate-350 font-bold uppercase tracking-wide focus:outline-none cursor-pointer pr-4"
              >
                <option value="newest" className="bg-white dark:bg-[#0F1A30]">Date: NewestFirst</option>
                <option value="oldest" className="bg-white dark:bg-[#0F1A30]">Date: OldestFirst</option>
                <option value="largest" className="bg-white dark:bg-[#0F1A30]">Size: LargestFirst</option>
                <option value="smallest" className="bg-white dark:bg-[#0F1A30]">Size: SmallestFirst</option>
              </select>
            </div>
          </div>

          {/* Loader */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#006CE4] animate-spin" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Loading media catalog...</span>
            </div>
          ) : filteredAndSortedItems.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col items-center justify-center">
              <Grid className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-xs font-extrabold text-slate-700 dark:text-white uppercase tracking-wide">
                No media items found matching the search criteria.
              </p>
              <p className="text-[10px] text-slate-400 mt-1 dark:text-slate-505">
                {items.length === 0 ? "Be the first one to upload a photo or video!" : "Try adjusting your filters or search filters."}
              </p>
            </div>
          ) : (
            /* Media Grid list */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAndSortedItems.map((item, index) => {
                const isVideo = item.type === 'video';
                const actualIndex = items.findIndex(raw => raw.driveFileId === item.driveFileId);

                return (
                  <motion.div
                    key={item.driveFileId}
                    onClick={() => setViewerIndex(actualIndex)}
                    className="group relative aspect-square bg-[#07111F] rounded-xl overflow-hidden border border-slate-150 dark:border-slate-850 cursor-pointer shadow-xs hover:shadow-md transition duration-200 select-none pb-0 mb-0"
                    whileHover={{ scale: 1.015 }}
                  >
                    {/* Media Thumbnail with JSX Referrer Policy */}
                    <img
                      src={item.thumbnailUrl}
                      alt={item.originalName}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Format Icon Badge inside cell upper corner */}
                    <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 shadow-xxs backdrop-blur-xs text-white z-20">
                      {isVideo ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    </div>

                    {/* Backdrop overlay information gradient */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 text-white flex flex-col justify-end min-h-[50%] opacity-90 transition-opacity">
                      <p className="text-[10px] font-black truncate uppercase tracking-tight">
                        {item.originalName}
                      </p>
                      
                      <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-slate-300 font-bold uppercase mt-1">
                        <span className="truncate max-w-[70%]">{item.uploadedByName}</span>
                        <span className="font-mono shrink-0">{formatFileSize(item.size)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Quick info footer */}
          <div className="mt-5 border-t border-slate-100 dark:border-slate-850 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wide">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#006CE4]" />
              <span>Gallery files are stored centrally by the trip organizer.</span>
            </span>
            <span>Total Catalog: {items.length} items • Filtered: {filteredAndSortedItems.length}</span>
          </div>
        </div>
      )}

      {/* Upload Modal overlay */}
      <AnimatePresence>
        {uploadModalOpen && user && (
          <GalleryUploadModal
            isOpen={uploadModalOpen}
            onClose={() => setUploadModalOpen(false)}
            user={user}
            onUploadSuccess={handleUploadSuccess}
          />
        )}
      </AnimatePresence>

      {/* Fullscreen Slider Viewer lightbox */}
      <AnimatePresence>
        {viewerIndex !== null && user && (
          <GalleryViewer
            items={items}
            selectedIndex={viewerIndex}
            onClose={() => setViewerIndex(null)}
            onNavigate={setViewerIndex}
            currentUser={user}
            onItemDeleted={handleItemDeletedInViewer}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
