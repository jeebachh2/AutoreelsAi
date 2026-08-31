import React from 'react';
import { ConnectedPlatform } from '../../types';
import { Share2, CheckCircle2, Zap, ArrowUpRight, Shield } from 'lucide-react';

interface PlatformGridSectionProps {
  platforms: ConnectedPlatform[];
  onConnectPlatform: (platformId: string) => void;
}

export const PlatformGridSection: React.FC<PlatformGridSectionProps> = ({
  platforms,
  onConnectPlatform,
}) => {
  return (
    <section className="relative py-16 border-t border-slate-800/80 bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300">
            <Share2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Universal 6-Platform Dispatch Grid</span>
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Connect Once. Publish to All 6 Video Feeds.
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            One single 9:16 vertical MP4 render is automatically adapted, captioned, and scheduled across all major short-form algorithms.
          </p>
        </div>

        {/* 6 Platform Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 transition-all hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-500/10"
            >
              {/* Top Row: Icon & Status Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${platform.iconColor} font-bold text-white shadow-md`}>
                    <span className="text-xs uppercase font-mono">{platform.shortName.slice(0, 2)}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {platform.name}
                    </h3>
                    <p className="font-mono text-xs text-slate-400">{platform.handle}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Live Token
                </span>
              </div>

              {/* Specs & Protocol */}
              <div className="mt-4 space-y-2 rounded-xl bg-slate-950/70 p-3 text-xs border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-400">
                  <span>API Protocol</span>
                  <span className="font-mono font-medium text-slate-200">{platform.badge}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Token Auto-Refresh</span>
                  <span className="font-mono text-cyan-400">{platform.tokenExpiresIn}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Dispatched Posts</span>
                  <span className="font-mono font-bold text-emerald-400">{platform.postsPublished} Reels</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span className="text-[11px] text-slate-500 font-mono">AES-256 Encrypted</span>
                <button
                  onClick={() => onConnectPlatform(platform.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Manage Connector</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
