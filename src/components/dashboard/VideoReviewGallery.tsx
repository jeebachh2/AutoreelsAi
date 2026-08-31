import React, { useState } from 'react';
import { Film, Sparkles, Filter, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';
import { VideoReel, PlatformId } from '../../types';
import { ReelPlayer } from './ReelPlayer';

interface VideoReviewGalleryProps {
  reels: VideoReel[];
  onApproveAndSchedule: (reelId: string, platforms: PlatformId[]) => void;
  onQuickGenerate: () => void;
  isPublishing?: boolean;
}

export const VideoReviewGallery: React.FC<VideoReviewGalleryProps> = ({
  reels,
  onApproveAndSchedule,
  onQuickGenerate,
  isPublishing = false,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready_for_review' | 'scheduled'>('all');
  const [activeReelId, setActiveReelId] = useState<string>(reels[0]?.id || '');

  const filteredReels = reels.filter((r) => {
    if (filterStatus === 'ready_for_review') return r.status === 'ready_for_review';
    if (filterStatus === 'scheduled') return r.status === 'scheduled' || r.status === 'published';
    return true;
  });

  const activeReel = reels.find((r) => r.id === activeReelId) || reels[0];

  return (
    <div className="space-y-6">
      
      {/* Gallery Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Film className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold text-white">Video Review & Preview Gallery</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review 60 FPS 9:16 HD vertical reels with real audio ducking, kinetic auto-captions, and sound effects before automated distribution.
          </p>
        </div>

        {/* Filter Tabs & Generate Button */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/90 p-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({reels.length})
            </button>
            <button
              onClick={() => setFilterStatus('ready_for_review')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                filterStatus === 'ready_for_review'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({reels.filter((r) => r.status === 'ready_for_review').length})
            </button>
            <button
              onClick={() => setFilterStatus('scheduled')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                filterStatus === 'scheduled'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Scheduled ({reels.filter((r) => r.status === 'scheduled').length})
            </button>
          </div>

          <button
            onClick={onQuickGenerate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:brightness-110"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Generate New Reel</span>
          </button>
        </div>
      </div>

      {/* Reel Selector Strip */}
      {reels.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {reels.map((reel) => {
            const isSelected = reel.id === activeReel?.id;
            return (
              <button
                key={reel.id}
                onClick={() => setActiveReelId(reel.id)}
                className={`shrink-0 rounded-xl border px-3.5 py-2 text-left transition-all max-w-[240px] ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-cyan-400">{reel.duration}s Vertical</span>
                  <span className={reel.status === 'scheduled' ? 'text-emerald-400' : 'text-amber-400'}>
                    {reel.status === 'scheduled' ? 'Scheduled' : 'Ready'}
                  </span>
                </div>
                <p className="text-xs font-bold truncate">{reel.title}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Active 9:16 Video Player Container */}
      {activeReel ? (
        <ReelPlayer
          key={activeReel.id}
          reel={activeReel}
          onApproveAndSchedule={onApproveAndSchedule}
          isPublishing={isPublishing}
        />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <Film className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">No Reels In This Filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Run the 6-agent generator from the Home tab to produce high-retention 9:16 HD vertical reels.
          </p>
        </div>
      )}

    </div>
  );
};
