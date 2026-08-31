import React, { useState } from 'react';
import { ConnectedPlatform, PlatformId } from '../../types';
import { Share2, CheckCircle2, RefreshCw, Key, Shield, ExternalLink, Zap, Lock } from 'lucide-react';
import { audioMixer } from '../../utils/audioSynthesizer';

interface SocialIntegrationCenterProps {
  platforms: ConnectedPlatform[];
  onTogglePlatform: (platformId: PlatformId) => void;
  onRefreshTokens: () => void;
}

export const SocialIntegrationCenter: React.FC<SocialIntegrationCenterProps> = ({
  platforms,
  onTogglePlatform,
  onRefreshTokens,
}) => {
  const [activeModalPlatform, setActiveModalPlatform] = useState<ConnectedPlatform | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    audioMixer.playSFX('ding');
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onRefreshTokens();
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Share2 className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold text-white">Social Media Integration Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage authenticated OAuth 2.0 connections and token lifecycles for all 6 short-form video networks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Tokens & Permissions</span>
          </button>
        </div>
      </div>

      {/* 6 Platform Grid Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => {
          return (
            <div
              key={platform.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 shadow-lg transition-all hover:border-slate-700"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${platform.iconColor} font-bold text-white shadow-md`}>
                      <span className="text-xs font-mono uppercase">{platform.shortName.slice(0, 2)}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{platform.name}</h3>
                      <p className="text-xs font-mono text-slate-400">{platform.handle}</p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    platform.connected
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                  }`}>
                    {platform.connected ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        Connected
                      </>
                    ) : (
                      'Disconnected'
                    )}
                  </span>
                </div>

                {/* API Specs */}
                <div className="mt-4 space-y-2 rounded-xl bg-slate-950/80 p-3.5 text-xs border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Integration Protocol</span>
                    <span className="font-mono text-slate-200">{platform.badge}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Token Expiration</span>
                    <span className="font-mono text-cyan-400">{platform.tokenExpiresIn}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Reels Published</span>
                    <span className="font-mono font-bold text-emerald-400">{platform.postsPublished} Dispatched</span>
                  </div>
                </div>

                {/* Scopes & Permissions List */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Granted OAuth Scopes:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {platform.permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  id={`oauth-manage-btn-${platform.id}`}
                  onClick={() => setActiveModalPlatform(platform)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800/90 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Key className="h-3.5 w-3.5 text-amber-400" />
                  <span>Inspect Token</span>
                </button>

                <button
                  id={`oauth-toggle-btn-${platform.id}`}
                  onClick={() => {
                    audioMixer.playSFX('pop');
                    onTogglePlatform(platform.id);
                  }}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    platform.connected
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {platform.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Token Inspection Modal */}
      {activeModalPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${activeModalPlatform.iconColor} text-white font-bold text-xs`}>
                  {activeModalPlatform.shortName.slice(0, 2)}
                </div>
                <h3 className="text-base font-bold text-white">{activeModalPlatform.name} Credentials</h3>
              </div>
              <button
                onClick={() => setActiveModalPlatform(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="rounded-xl bg-slate-950 p-3 font-mono space-y-1 text-[11px] border border-slate-800">
                <div className="text-slate-500">// AES-256 Encrypted Access Token</div>
                <div className="text-emerald-400 break-all">
                  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...{activeModalPlatform.id}_auth_token_live
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Target Publishing API:</span>
                <p className="font-mono text-[11px] text-cyan-300 bg-slate-950 p-2 rounded-lg border border-slate-800 break-all">
                  {activeModalPlatform.apiEndpoint}
                </p>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Shield className="h-4 w-4" />
                <span>Encrypted at Rest with AES-256 GCM</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModalPlatform(null)}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
