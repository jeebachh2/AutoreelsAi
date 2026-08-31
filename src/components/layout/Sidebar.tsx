import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Volume2,
  Share2,
  Film,
  CreditCard,
  Settings,
  Flame,
  Radio,
  CheckCircle2,
  Sparkles,
  X,
  ChevronRight,
} from 'lucide-react';

export type DashboardTab =
  | 'home'
  | 'agents'
  | 'audio'
  | 'platforms'
  | 'gallery'
  | 'billing'
  | 'settings';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  pendingReviewsCount: number;
  connectedCount: number;
  totalPlatforms: number;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingReviewsCount,
  connectedCount,
  totalPlatforms,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
}) => {
  const menuItems = [
    {
      id: 'home' as DashboardTab,
      label: 'Dashboard Home',
      shortLabel: 'Home',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'gallery' as DashboardTab,
      label: 'Video Review Gallery',
      shortLabel: 'Gallery',
      icon: Film,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Ready` : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'agents' as DashboardTab,
      label: 'AI Agents Center',
      shortLabel: 'Agents',
      icon: Bot,
      badge: '6 Agents',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'audio' as DashboardTab,
      label: 'Audio & Music Mixer',
      shortLabel: 'Audio',
      icon: Volume2,
      badge: 'Ducking',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'platforms' as DashboardTab,
      label: 'Connected Platforms',
      shortLabel: 'Channels',
      icon: Share2,
      badge: `${connectedCount}/${totalPlatforms}`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'billing' as DashboardTab,
      label: 'Billing & Plans',
      shortLabel: 'Billing',
      icon: CreditCard,
      badge: '10 Free',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'settings' as DashboardTab,
      label: 'Automation Settings',
      shortLabel: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* 1. DESKTOP & LAPTOP VERTICAL SIDEBAR (md:flex) */}
      <aside className="w-60 lg:w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/70 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
        <div className="space-y-6">
          
          {/* Live Engine Status Card */}
          <div className="rounded-xl border border-slate-800/90 bg-gradient-to-b from-slate-900 to-slate-950 p-3.5 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-200">Auto-Scheduler</span>
              </div>
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-mono text-indigo-300">
                60 FPS HD
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Next Dispatch</span>
              <span className="font-mono font-medium text-emerald-400">Today 18:00</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Main Management
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium font-mono shrink-0 ${
                        isActive
                          ? 'border-indigo-400/40 bg-indigo-700/50 text-white'
                          : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Multi-Agent 2.4</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Autonomous Voiceover, Audio Ducking & 9:16 Compositing.
          </p>
        </div>
      </aside>

      {/* 2. MOBILE & TABLET SLIDE-OVER DRAWER (Visible when isMobileDrawerOpen is true) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobileDrawer}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-slate-950 border-r border-slate-800 h-full p-5 flex flex-col justify-between z-10 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="font-heading text-sm font-bold text-white">Dashboard Menu</span>
                </div>
                <button
                  onClick={onCloseMobileDrawer}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    Auto-Scheduler Active
                  </span>
                  <span className="font-mono text-[10px] text-indigo-400">60 FPS</span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
                <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Navigation
                </div>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        if (onCloseMobileDrawer) onCloseMobileDrawer();
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition-all min-h-[44px] ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium font-mono ${
                            isActive
                              ? 'border-indigo-400/40 bg-indigo-700/50 text-white'
                              : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              AutoReel AI • 6-Platform Synchronized Dispatch
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Sticky bottom for phones & small tablets) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md px-2 py-1.5 flex items-center justify-around">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110 text-indigo-400' : ''}`} />
                {item.id === 'gallery' && pendingReviewsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
