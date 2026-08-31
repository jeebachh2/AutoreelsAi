import React from 'react';
import { Sparkles, Zap, Shield, Crown, Play, Layers, Menu, X } from 'lucide-react';
import { CreditState } from '../../types';
import { BrandLogo } from './BrandLogo';

export type ViewMode = 'landing' | 'dashboard';

interface NavbarProps {
  viewMode?: ViewMode;
  onChangeViewMode?: (view: ViewMode) => void;
  currentView?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
  credits: CreditState;
  onOpenPaywall: () => void;
  onQuickGenerate?: () => void;
  isMobileDrawerOpen?: boolean;
  onToggleMobileDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode = 'dashboard',
  onChangeViewMode,
  currentView,
  onViewChange,
  credits,
  onOpenPaywall,
  onQuickGenerate,
  isMobileDrawerOpen,
  onToggleMobileDrawer,
}) => {
  const activeView = currentView || viewMode;
  const changeView = (v: ViewMode) => {
    if (onChangeViewMode) onChangeViewMode(v);
    if (onViewChange) onViewChange(v);
  };

  const isLocked = credits.used >= credits.totalAllocated && credits.planName === 'Free Trial';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Menu Button (when in dashboard) & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeView === 'dashboard' && onToggleMobileDrawer && (
            <button
              id="nav-mobile-menu-toggle"
              type="button"
              onClick={onToggleMobileDrawer}
              className="flex h-10 w-10 md:hidden items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}

          {/* Brand Logo with Official 3D Asset */}
          <BrandLogo
            size="md"
            onClick={() => changeView('landing')}
          />
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Navigation Mode Pill */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/90 p-0.5 sm:p-1">
            <button
              id="nav-landing-btn"
              onClick={() => changeView('landing')}
              className={`rounded-md px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-medium transition-all ${
                activeView === 'landing'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="hidden sm:inline">Showcase & Tiers</span>
              <span className="sm:hidden">Home</span>
            </button>
            <button
              id="nav-dashboard-btn"
              onClick={() => changeView('dashboard')}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-medium transition-all ${
                activeView === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400" />
              <span className="hidden sm:inline">SaaS Dashboard</span>
              <span className="sm:hidden">App</span>
            </button>
          </div>

          {/* Credit Tracker Pill */}
          <div 
            onClick={onOpenPaywall}
            title="Click to manage subscription & credits"
            className="group flex cursor-pointer items-center gap-1.5 sm:gap-2.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-1 sm:px-3 sm:py-1.5 transition-all hover:border-indigo-500/50 hover:bg-slate-850"
          >
            <div className="flex flex-col text-right">
              <span className="hidden sm:inline text-[10px] font-medium text-slate-400">
                Credits
              </span>
              <span className={`text-[11px] sm:text-xs font-bold ${isLocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                {credits.used}/{credits.totalAllocated}
              </span>
            </div>
            
            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-950 transition-colors shrink-0">
              {isLocked ? (
                <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400 animate-bounce" />
              ) : (
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-400" />
              )}
            </div>
          </div>

          {/* Upgrade / Start Button */}
          {credits.planName === 'Free Trial' ? (
            <button
              id="nav-upgrade-btn"
              onClick={onOpenPaywall}
              className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-transform active:scale-95 hover:brightness-110 shrink-0"
            >
              <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Upgrade</span>
            </button>
          ) : (
            <button
              id="nav-create-reel-btn"
              onClick={onQuickGenerate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-95 shrink-0"
            >
              <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Generate Reel</span>
              <span className="sm:hidden">Create</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
