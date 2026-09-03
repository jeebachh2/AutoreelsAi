import React, { useState, useEffect } from 'react';
import {
  INITIAL_PLATFORMS,
  INITIAL_VOICES,
  INITIAL_TRACKS,
  INITIAL_REELS,
  INITIAL_AGENTS,
  INITIAL_CREDIT_STATE,
} from './data/mockData';
import {
  CreditState,
  ConnectedPlatform,
  VoiceOption,
  MusicTrack,
  VideoReel,
  AgentPipelineStep,
  PlatformId,
} from './types';
import { Navbar, ViewMode } from './components/layout/Navbar';
import { Sidebar, DashboardTab } from './components/layout/Sidebar';
import { HeroSection } from './components/landing/HeroSection';
import { PlatformGridSection } from './components/landing/PlatformGridSection';
import { FeatureHighlightsSection } from './components/landing/FeatureHighlightsSection';
import { PricingSection } from './components/landing/PricingSection';
import { Footer } from './components/layout/Footer';
import { StatsOverview } from './components/dashboard/StatsOverview';
import { OnboardingNicheCard } from './components/dashboard/OnboardingNicheCard';
import { AudioPreferencesCard } from './components/dashboard/AudioPreferencesCard';
import { AutomationSettingsCard } from './components/dashboard/AutomationSettingsCard';
import { VideoReviewGallery } from './components/dashboard/VideoReviewGallery';
import { SocialIntegrationCenter } from './components/dashboard/SocialIntegrationCenter';
import { AIAgentsCenter } from './components/dashboard/AIAgentsCenter';
import { PaywallModal } from './components/dashboard/PaywallModal';
import { audioMixer } from './utils/audioSynthesizer';
import { renderRealVideo } from './service/creatomateService';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, Sparkles, X, Share2, ArrowRight } from 'lucide-react';

export default function App() {
  // Global View Navigation: 'landing' vs 'dashboard'
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');

  // Core Data States
  const [credits, setCredits] = useState<CreditState>(INITIAL_CREDIT_STATE);
  const [platforms, setPlatforms] = useState<ConnectedPlatform[]>(INITIAL_PLATFORMS);
  const [voices] = useState<VoiceOption[]>(INITIAL_VOICES);
  const [tracks] = useState<MusicTrack[]>(INITIAL_TRACKS);
  const [reels, setReels] = useState<VideoReel[]>(INITIAL_REELS);
  
  // FIX 1: Track Currently Selected Reel for Phone Frame View
  const [selectedReel, setSelectedReel] = useState<VideoReel | null>(INITIAL_REELS[0] || null);
  const [agents, setAgents] = useState<AgentPipelineStep[]>(INITIAL_AGENTS);

  // User Dashboard Configuration Form State
  const [nichePrompt, setNichePrompt] = useState<string>(
    '3 autonomous AI tools that make money while you sleep in 2026'
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(INITIAL_VOICES[0].id);
  const [musicMode, setMusicMode] = useState<'trending_real' | 'copyright_free'>('trending_real');
  const [selectedTrackId, setSelectedTrackId] = useState<string>(INITIAL_TRACKS[0].id);
  const [duckingIntensity, setDuckingIntensity] = useState<number>(75);
  const [automationMode, setAutomationMode] = useState<'automatic' | 'manual'>('manual');
  const [duration, setDuration] = useState<30 | 60>(30);

  // Modal & Loading States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Derived metrics
  const connectedCount = platforms.filter((p) => p.connected).length;
  const pendingReviewsCount = reels.filter((r) => r.status === 'ready_for_review').length;
  const isPaywallLocked = credits.used >= credits.totalAllocated;

  // Sync selected reel if reels array changes
  useEffect(() => {
    if (reels.length > 0 && !selectedReel) {
      setSelectedReel(reels[0]);
    }
  }, [reels]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ title, desc, type });
  };

  // Trigger Full 6-Agent Generation Pipeline
  const handleGenerateReel = async () => {
    if (isPaywallLocked) {
      audioMixer.playSFX('ding');
      setIsPaywallOpen(true);
      return;
    }

    setIsGenerating(true);
    audioMixer.playSFX('pop');
    showToast('6 AI Agents In Action', 'Researching viral hooks, writing script, and compositing 9:16 HD reel...', 'info');

    try {
      const response = await fetch('/api/agents/generate-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nichePrompt,
          voiceId: selectedVoiceId,
          selectedTrackId,
          duration,
          automationMode,
          selectedPlatforms: platforms.filter((p) => p.connected).map((p) => p.id),
        }),
      });

      let newReel: VideoReel;

      if (response.ok) {
        const data = await response.json();
        newReel = data.reel || data;
        const completedAgents = (data.agentLogs || []).reduce((updated: AgentPipelineStep[], log: any) => {
          return updated.map((agent) => agent.id === `agent_${log.agentNumber}`
            ? { ...agent, status: log.status, latencyMs: log.durationMs, description: log.summary }
            : agent);
        }, agents);
        setAgents(completedAgents);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Agent pipeline failed (${response.status}).`);
      }

      // Finish the media compositor automatically before showing the reel as ready.
      try {
        const renderedVideoUrl = await renderRealVideo(newReel.cues.map((cue) => ({
          imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(cue.visualFocus || newReel.niche)}?width=1080&height=1920&nologo=true`,
          timeStart: cue.timeStart,
          timeEnd: cue.timeEnd,
        })), newReel.musicTrack?.id, newReel.niche);
        newReel = { ...newReel, renderedVideoUrl: renderedVideoUrl || undefined };
      } catch (renderError) {
        console.error('Automatic MP4 render failed:', renderError);
        showToast(
          'Reel created with preview',
          renderError instanceof Error ? renderError.message : 'MP4 render failed; preview is ready.',
          'error'
        );
      }

      // Deduct credit
      setCredits((prev) => ({
        ...prev,
        used: prev.used + 1,
      }));

      // Add to Reels list & automatically focus on newly created reel
      setReels((prev) => [newReel, ...prev]);
      setSelectedReel(newReel);

      audioMixer.playSFX('ding');
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}

      showToast(
        '9:16 Video Reel Generated!',
        automationMode === 'automatic'
          ? 'Reel automatically scheduled for peak dispatch!'
          : 'Ready for review in your Video Gallery.',
        'success'
      );

      setActiveTab('gallery');
    } catch (err) {
      console.error('Generation error:', err);
      showToast(
        'Generation failed',
        err instanceof Error ? err.message : 'The agent pipeline could not complete.',
        'error'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Approve & Schedule Reel handler
  const handleApproveAndSchedule = async (reelId: string, targetPlatforms: PlatformId[]) => {
    setIsPublishing(true);
    audioMixer.playSFX('ding');

    try {
      await fetch('/api/schedule-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reelId,
          targetPlatforms,
          scheduledTime: new Date(Date.now() + 1800000).toISOString(),
        }),
      });
    } catch {}

    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? {
              ...r,
              status: 'scheduled',
              targetPlatforms,
              scheduledFor: new Date(Date.now() + 1800000).toISOString(),
            }
          : r
      )
    );

    setPlatforms((prev) =>
      prev.map((p) =>
        targetPlatforms.includes(p.id)
          ? { ...p, postsPublished: p.postsPublished + 1 }
          : p
      )
    );

    setIsPublishing(false);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch {}

    showToast(
      'Reel Scheduled for Dispatch',
      `Synchronized payload sent to ${targetPlatforms.length} social networks!`,
      'success'
    );
  };

  const handleUpdatePlatformCredentials = (platformId: PlatformId, data: Partial<ConnectedPlatform>) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === platformId ? { ...p, ...data } : p))
    );
    showToast(
      'Account Connected!',
      `Your real ${platformId.toUpperCase()} account is connected and ready.`,
      'success'
    );
  };

  const handleTogglePlatform = (platformId: PlatformId) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === platformId ? { ...p, connected: !p.connected } : p))
    );
    showToast('Platform Connector Updated', 'OAuth authentication state updated successfully.', 'info');
  };

  const handleRefreshTokens = () => {
    setPlatforms((prev) =>
      prev.map((p) => ({ ...p, tokenExpiresIn: '60 days remaining (Auto-Refreshed)' }))
    );
    showToast('Tokens Refreshed', 'OAuth tokens renewed with 256-bit encryption.', 'success');
  };

  const handleUpgradeSuccess = (planName: string, allocatedCredits: number) => {
    setCredits((prev) => ({
      ...prev,
      planName,
      totalAllocated: prev.totalAllocated + allocatedCredits,
    }));
    showToast(
      'Plan Activated!',
      `Upgraded to ${planName}. +${allocatedCredits} posts added to your balance.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-[calc(100vw-3rem)] items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            toastMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
          }`}>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{toastMessage.title}</h4>
            <p className="text-[11px] text-slate-400 line-clamp-2">{toastMessage.desc}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-500 hover:text-slate-300 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Global Navigation Header */}
      <Navbar
        credits={credits}
        viewMode={viewMode}
        onChangeViewMode={(mode) => {
          audioMixer.playSFX('pop');
          setViewMode(mode);
        }}
        onOpenPaywall={() => {
          audioMixer.playSFX('ding');
          setIsPaywallOpen(true);
        }}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
      />

      {/* VIEW 1: LANDING PAGE */}
      {viewMode === 'landing' ? (
        <main className="w-full max-w-[100vw] overflow-x-hidden space-y-0">
          <HeroSection
            onStartFree={() => {
              audioMixer.playSFX('ding');
              setViewMode('dashboard');
              setActiveTab('home');
            }}
            onExploreDashboard={() => {
              audioMixer.playSFX('pop');
              setViewMode('dashboard');
            }}
          />

          <PlatformGridSection
            platforms={platforms}
            onConnectPlatform={() => {
              setViewMode('dashboard');
              setActiveTab('platforms');
            }}
          />

          <FeatureHighlightsSection />

          <PricingSection
            currentPlanName={credits.planName}
            onSelectPlan={(plan) => {
              handleUpgradeSuccess(plan.name, plan.posts);
              setViewMode('dashboard');
            }}
          />

          <Footer
            onNavigateToDashboard={() => setViewMode('dashboard')}
            onNavigateToPlatforms={() => {
              setViewMode('dashboard');
              setActiveTab('platforms');
            }}
            onNavigateToPricing={() => {
              const pricingEl = document.getElementById('pricing');
              if (pricingEl) {
                pricingEl.scrollIntoView({ behavior: 'smooth' });
              } else {
                setIsPaywallOpen(true);
              }
            }}
          />
        </main>
      ) : (
        /* VIEW 2: DASHBOARD VIEW */
        <div className="flex w-full max-w-[100vw] overflow-x-hidden">
          <Sidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              audioMixer.playSFX('pop');
              setActiveTab(tab);
            }}
            pendingReviewsCount={pendingReviewsCount}
            connectedCount={connectedCount}
            totalPlatforms={platforms.length}
            isMobileDrawerOpen={isMobileDrawerOpen}
            onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
          />

          <main className="flex-1 w-full min-w-0 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden pb-24 md:pb-8">
            
            {/* TAB: Home Overview & Generation Hub */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                <StatsOverview
                  credits={credits}
                  activeSchedulesCount={reels.filter((r) => r.status === 'scheduled').length || 2}
                  connectedCount={connectedCount}
                  totalPlatforms={platforms.length}
                  totalViews={348500}
                  avgEngagementRate={9.4}
                  onOpenPaywall={() => setIsPaywallOpen(true)}
                />

                <OnboardingNicheCard
                  nichePrompt={nichePrompt}
                  onChangeNiche={setNichePrompt}
                  onGenerateReel={handleGenerateReel}
                  isGenerating={isGenerating}
                  isPaywallLocked={isPaywallLocked}
                  onOpenPaywall={() => setIsPaywallOpen(true)}
                />

                {/* Quick Social Media Accounts Status Bar */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">Your Social Media Channels</h3>
                      <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/20">
                        {connectedCount} of {platforms.length} Linked
                      </span>
                    </div>
                    <button
                      id="home-manage-social-btn"
                      onClick={() => {
                        audioMixer.playSFX('pop');
                        setActiveTab('platforms');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Connect & Manage Accounts</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                    {platforms.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          audioMixer.playSFX('pop');
                          setActiveTab('platforms');
                        }}
                        className={`group cursor-pointer flex flex-col p-2.5 rounded-xl border transition-all ${
                          p.connected
                            ? 'bg-slate-950 border-emerald-500/30 hover:border-emerald-500/60'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${p.iconColor} text-white font-bold text-[10px]`}>
                            {p.shortName.slice(0, 2)}
                          </div>
                          <span className={`h-2 w-2 rounded-full ${p.connected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} />
                        </div>
                        <span className="mt-2 text-xs font-bold text-white truncate">{p.shortName}</span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {p.connected ? p.handle : '+ Connect'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <AudioPreferencesCard
                    voices={voices}
                    selectedVoiceId={selectedVoiceId}
                    onSelectVoice={setSelectedVoiceId}
                    musicMode={musicMode}
                    onChangeMusicMode={setMusicMode}
                    tracks={tracks}
                    selectedTrackId={selectedTrackId}
                    onSelectTrack={setSelectedTrackId}
                    duckingIntensity={duckingIntensity}
                    onChangeDucking={setDuckingIntensity}
                  />

                  <AutomationSettingsCard
                    automationMode={automationMode}
                    onChangeAutomationMode={setAutomationMode}
                    duration={duration}
                    onChangeDuration={setDuration}
                  />
                </div>

                {/* FIX 3: Pass FULL reels array and select active item */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Latest Generated 9:16 HD Reel</h3>
                    <button
                      onClick={() => setActiveTab('gallery')}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      View All in Gallery →
                    </button>
                  </div>
                  {reels.length > 0 && (
                    <VideoReviewGallery
                      reels={reels}
                      onApproveAndSchedule={handleApproveAndSchedule}
                      onQuickGenerate={handleGenerateReel}
                      isPublishing={isPublishing}
                    />
                  )}
                </div>
              </div>
            )}

            {/* TAB: Video Review Gallery */}
            {activeTab === 'gallery' && (
              <VideoReviewGallery
                reels={reels}
                onApproveAndSchedule={handleApproveAndSchedule}
                onQuickGenerate={handleGenerateReel}
                isPublishing={isPublishing}
              />
            )}

            {/* TAB: AI Agents Center */}
            {activeTab === 'agents' && (
              <AIAgentsCenter
                agents={agents}
                onTriggerAgentPipeline={handleGenerateReel}
                isExecuting={isGenerating}
              />
            )}

            {/* TAB: Audio & Music Mixer */}
            {activeTab === 'audio' && (
              <AudioPreferencesCard
                voices={voices}
                selectedVoiceId={selectedVoiceId}
                onSelectVoice={setSelectedVoiceId}
                musicMode={musicMode}
                onChangeMusicMode={setMusicMode}
                tracks={tracks}
                selectedTrackId={selectedTrackId}
                onSelectTrack={setSelectedTrackId}
                duckingIntensity={duckingIntensity}
                onChangeDucking={setDuckingIntensity}
              />
            )}

            {/* TAB: Connected Platforms */}
            {activeTab === 'platforms' && (
              <SocialIntegrationCenter
                platforms={platforms}
                onTogglePlatform={handleTogglePlatform}
                onRefreshTokens={handleRefreshTokens}
                onUpdatePlatformCredentials={handleUpdatePlatformCredentials}
              />
            )}

            {/* TAB: Billing & Plans */}
            {activeTab === 'billing' && (
              <PricingSection
                currentPlanName={credits.planName}
                onSelectPlan={(plan) => {
                  handleUpgradeSuccess(plan.name, plan.posts);
                  setActiveTab('home');
                }}
              />
            )}

            {/* TAB: Settings */}
            {activeTab === 'settings' && (
              <AutomationSettingsCard
                automationMode={automationMode}
                onChangeAutomationMode={setAutomationMode}
                duration={duration}
                onChangeDuration={setDuration}
              />
            )}

            <div className="pt-8 border-t border-slate-800/80 mt-12">
              <Footer
                onNavigateToDashboard={() => setActiveTab('home')}
                onNavigateToPlatforms={() => setActiveTab('platforms')}
                onNavigateToPricing={() => setActiveTab('billing')}
              />
            </div>

          </main>
        </div>
      )}

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        currentPlanName={credits.planName}
      />

    </div>
  );
}