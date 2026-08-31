import React from 'react';
import { Sparkles, Zap, Shield, Crown, Play, Layers } from 'lucide-react';
import { CreditState } from '../../types';

export type ViewMode = 'landing' | 'dashboard';

interface NavbarProps {
  viewMode?: ViewMode;
  onChangeViewMode?: (view: ViewMode) => void;
  currentView?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
  credits: CreditState;
  onOpenPaywall: () => void;
  onQuickGenerate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode = 'dashboard',
  onChangeViewMode,
  currentView,
  onViewChange,
  credits,
  onOpenPaywall,
  onQuickGenerate,
}) => {
  const activeView = currentView || viewMode;
  const changeView = (v: ViewMode) => {
    if (onChangeViewMode) onChangeViewMode(v);
    if (onViewChange) onViewChange(v);
  };

  const isLocked = credits.used >= credits.totalAllocated && credits.planName === 'Free Trial';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => changeView('landing')}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                AutoReel<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">.AI</span>
              </span>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                PRO ENGINE
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-400 sm:block">Automated 9:16 Video & 6-Platform Dispatch</p>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Navigation Mode Pill */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/90 p-1">
            <button
              id="nav-landing-btn"
              onClick={() => changeView('landing')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeView === 'landing'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Showcase & Tiers
            </button>
            <button
              id="nav-dashboard-btn"
              onClick={() => changeView('dashboard')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeView === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              SaaS Dashboard
            </button>
          </div>

          {/* Credit Tracker Pill */}
          <div 
            onClick={onOpenPaywall}
            title="Click to manage subscription & credits"
            className="group flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 transition-all hover:border-indigo-500/50 hover:bg-slate-850"
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-medium text-slate-400">
                Auto-Post Credits
              </span>
              <span className={`text-xs font-bold ${isLocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                {credits.used}/{credits.totalAllocated} {credits.planName === 'Free Trial' ? 'Free' : 'Used'}
              </span>
            </div>
            
            <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-950 transition-colors">
              {isLocked ? (
                <Crown className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              )}
            </div>
          </div>

          {/* Upgrade / Start Button */}
          {credits.planName === 'Free Trial' ? (
            <button
              id="nav-upgrade-btn"
              onClick={onOpenPaywall}
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-transform active:scale-95 hover:brightness-110"
            >
              <Crown className="h-3.5 w-3.5" />
              <span>Upgrade ($5)</span>
            </button>
          ) : (
            <button
              id="nav-create-reel-btn"
              onClick={onQuickGenerate}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Generate Reel</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
