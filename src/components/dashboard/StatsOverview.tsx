import React from 'react';
import { CreditState } from '../../types';
import { Sparkles, Calendar, Share2, TrendingUp, ArrowUpRight, Crown, AlertCircle } from 'lucide-react';

interface StatsOverviewProps {
  credits: CreditState;
  activeSchedulesCount: number;
  connectedCount: number;
  totalPlatforms: number;
  totalViews: number;
  avgEngagementRate: number;
  onOpenPaywall: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  credits,
  activeSchedulesCount,
  connectedCount,
  totalPlatforms,
  totalViews,
  avgEngagementRate,
  onOpenPaywall,
}) => {
  const isFreeTrial = credits.planName === 'Free Trial';
  const remainingCredits = Math.max(0, credits.totalAllocated - credits.used);
  const usagePercentage = Math.min(100, Math.round((credits.used / credits.totalAllocated) * 100));
  const isNearLimit = usagePercentage >= 80;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      
      {/* Card 1: Total Posts Generated & Remaining */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Auto-Post Credits
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {credits.used} / {credits.totalAllocated}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {isFreeTrial ? 'Free Used' : 'Allocated'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full transition-all ${
                isNearLimit ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-500'
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className={isNearLimit ? 'font-bold text-rose-400' : 'text-slate-400'}>
              {remainingCredits} posts remaining
            </span>
            <button
              onClick={onOpenPaywall}
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Add Credits
            </button>
          </div>
        </div>
      </div>

      {/* Card 2: Active Automated Schedules */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Schedules
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <Calendar className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {activeSchedulesCount} Queues
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Automated
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Posting frequency: <strong className="text-slate-200">2x daily (Peak 6 PM)</strong>
          </p>

          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            Next: Today 18:00 EST • 6 Platforms
          </div>
        </div>
      </div>

      {/* Card 3: Total Connected Social Accounts (out of 6) */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Connected Channels
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <Share2 className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {connectedCount} / {totalPlatforms}
            </span>
            <span className="text-xs font-medium text-emerald-400">
              {connectedCount === totalPlatforms ? 'All Live' : 'Connected'}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            IG • TikTok • YouTube • FB • X • Snap
          </p>

          <div className="mt-2 flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
            <span>OAuth Tokens Synced</span>
          </div>
        </div>
      </div>

      {/* Card 4: Total Estimated Views & Engagement Metrics */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Estimated Reach
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {(totalViews / 1000).toFixed(1)}k
            </span>
            <span className="text-xs font-medium text-slate-400">Est. Views</span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="rounded bg-pink-500/10 px-2 py-0.5 text-xs font-bold text-pink-300">
              {avgEngagementRate}% Avg Eng.
            </span>
            <span className="text-[11px] text-slate-400">Viral score 93/100</span>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            +38.4% retention vs manual edits
          </div>
        </div>
      </div>

    </div>
  );
};
