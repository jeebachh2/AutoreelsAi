import React, { useState, useEffect } from 'react';
import { Play, Pause, Sparkles, Zap, ArrowRight, Volume2, VolumeX, ShieldCheck, CheckCircle, Radio } from 'lucide-react';
import { audioMixer } from '../../utils/audioSynthesizer';
import { VIDEO_SOURCES } from '../../data/mockData';

interface HeroSectionProps {
  onStartFree: () => void;
  onExploreDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartFree,
  onExploreDashboard,
}) => {
  const [reelCounter, setReelCounter] = useState(248912);
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(0);

  const demoCaptions = [
    { text: 'Stop creating manual social videos in 2026.', highlight: 'Stop creating manual' },
    { text: 'AutoReel scans viral hooks and generates 9:16 HD reels.', highlight: 'scans viral hooks' },
    { text: 'Real human voiceover with audio ducking & music drops.', highlight: 'audio ducking & music' },
    { text: 'Auto-dispatches across all 6 networks simultaneously.', highlight: 'all 6 networks' },
  ];

  // Dynamic counter ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setReelCounter((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Caption cycling for hero showcase
  useEffect(() => {
    if (!isPlayingDemo) return;
    const interval = setInterval(() => {
      setActiveCaptionIndex((prev) => (prev + 1) % demoCaptions.length);
      if (!isAudioMuted) {
        audioMixer.playSFX('whoosh');
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlayingDemo, isAudioMuted]);

  const toggleAudio = () => {
    if (isAudioMuted) {
      audioMixer.init();
      audioMixer.startMusic('synthesized_phonk');
      audioMixer.playSFX('pop');
      setIsAudioMuted(false);
    } else {
      audioMixer.stopMusic();
      setIsAudioMuted(true);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Background glow ambient circles */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-80 w-80 rounded-full bg-purple-600/15 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: High-Converting Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Reel Counter Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3.5 py-1.5 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-mono text-xs font-semibold text-indigo-200">
                <strong className="text-white">{reelCounter.toLocaleString()}</strong> 9:16 Reels Generated
              </span>
              <span className="text-[10px] text-indigo-400/80 font-medium">• LIVE ENGINE</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12]">
              Automate Viral <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                9:16 Video Reels
              </span>{' '}
              Across All 6 Platforms
            </h1>

            {/* Sub-headline */}
            <p className="text-base text-slate-300 sm:text-lg max-w-2xl leading-relaxed">
              Speak or type your niche. Our 6-Agent AI system writes viral scripts, synthesizes ultra-realistic voiceover, mixes trending beats with audio ducking, and renders 60 FPS HD reels dispatched hands-free.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                id="hero-start-free-cta"
                onClick={onStartFree}
                className="group relative inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 min-h-[44px]"
              >
                <Sparkles className="h-4 w-4 text-amber-300 group-hover:rotate-12 transition-transform shrink-0" />
                <span className="truncate">Start Free — 10 Automated Posts</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 shrink-0" />
              </button>

              <button
                id="hero-live-dashboard-btn"
                onClick={onExploreDashboard}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:border-slate-600 min-h-[44px]"
              >
                <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Open Interactive Dashboard</span>
              </button>
            </div>

            {/* Feature Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>100% Fully Rendered 9:16 Video</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Real Audio Ducking & SFX</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>6 Social OAuth Connectors</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 9:16 Smartphone Mockup with Real Looped Video */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
              
              {/* Phone Bezel Frame */}
              <div className="relative rounded-[40px] border-4 border-slate-700/80 bg-slate-950 p-2.5 shadow-2xl shadow-indigo-500/20 ring-1 ring-slate-800">
                
                {/* Dynamic Island / Speaker Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 h-4 w-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/60" />
                </div>

                {/* 9:16 Vertical Video Screen Area */}
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[32px] bg-slate-900">
                  
                  {/* Real Looped Video Asset */}
                  <video
                    src={VIDEO_SOURCES.technology}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />

                  {/* Top Live Badges on Video */}
                  <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
                      AUTOPILOT REEL
                    </span>

                    {/* Audio Preview Button */}
                    <button
                      onClick={toggleAudio}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700/80 hover:bg-slate-800 transition-colors"
                      title={isAudioMuted ? 'Listen to real synthesized beat' : 'Mute beat'}
                    >
                      {isAudioMuted ? (
                        <VolumeX className="h-4 w-4 text-rose-400" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse" />
                      )}
                    </button>
                  </div>

                  {/* Real-time Dynamic Kinetic Captions in Center of 9:16 Video */}
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 text-center">
                    <div className="inline-block rounded-2xl bg-black/75 backdrop-blur-md px-4 py-3 border border-white/10 shadow-2xl">
                      <p className="font-heading text-lg font-black tracking-tight text-white leading-tight uppercase drop-shadow-md">
                        {demoCaptions[activeCaptionIndex].text}
                      </p>
                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        <span className="h-1 w-6 rounded-full bg-indigo-500" />
                        <span className="h-1 w-2 rounded-full bg-purple-400" />
                        <span className="h-1 w-2 rounded-full bg-pink-400" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Reel Info & 6 Integration Badges */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-white font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[10px]">
                          AR
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white">@AI_AutoReel</p>
                          <p className="text-[10px] text-slate-300">Trending Drift Phonk 140 BPM</p>
                        </div>
                      </div>
                      <span className="rounded bg-pink-600/90 px-2 py-0.5 text-[10px] font-bold text-white">
                        94 Viral Score
                      </span>
                    </div>

                    {/* Social icons row */}
                    <div className="flex items-center justify-between rounded-xl bg-slate-950/80 p-2 border border-slate-800 text-[10px] text-slate-300">
                      <span>Dispatch:</span>
                      <span className="font-bold text-emerald-400">IG • TT • YT • FB • X • SNAP</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
