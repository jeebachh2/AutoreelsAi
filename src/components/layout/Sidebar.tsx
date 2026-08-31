import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Volume2,
  Share2,
  Film,
  Database,
  CreditCard,
  Settings,
  Flame,
  Radio,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export type DashboardTab =
  | 'home'
  | 'agents'
  | 'audio'
  | 'platforms'
  | 'gallery'
  | 'database'
  | 'billing'
  | 'settings';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  pendingReviewsCount: number;
  connectedCount: number;
  totalPlatforms: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingReviewsCount,
  connectedCount,
  totalPlatforms,
}) => {
  const menuItems = [
    {
      id: 'home' as DashboardTab,
      label: 'Dashboard Home',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'gallery' as DashboardTab,
      label: 'Video Review Gallery',
      icon: Film,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Ready` : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'agents' as DashboardTab,
      label: 'AI Agents Center',
      icon: Bot,
      badge: '6 Agents',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'audio' as DashboardTab,
      label: 'Audio & Music Mixer',
      icon: Volume2,
      badge: 'Ducking',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'platforms' as DashboardTab,
      label: 'Connected Platforms',
      icon: Share2,
      badge: `${connectedCount}/${totalPlatforms}`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'database' as DashboardTab,
      label: 'Database & Schemas',
      icon: Database,
      badge: 'Prisma + Redis',
      badgeColor: 'bg-slate-700/40 text-slate-300 border-slate-600/30',
    },
    {
      id: 'billing' as DashboardTab,
      label: 'Billing & Plans',
      icon: CreditCard,
      badge: '10 Free',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'settings' as DashboardTab,
      label: 'Automation Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/60 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        
        {/* Live Engine Status Card */}
        <div className="rounded-xl border border-slate-800/90 bg-gradient-to-b from-slate-900 to-slate-950 p-3.5 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-200">Auto-Scheduler Active</span>
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
        <nav className="space-y-1.5">
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
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
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

      {/* Footer info */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Multi-Agent 2.4</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Autonomous Voiceover, Audio Ducking & 9:16 Video Compositing.
        </p>
      </div>
    </aside>
  );
};
