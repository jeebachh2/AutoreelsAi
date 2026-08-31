import React from 'react';
import {
  Mic,
  Volume2,
  Sparkles,
  Share2,
  BarChart3,
  Bot,
  Layers,
  Flame,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const FeatureHighlightsSection: React.FC = () => {
  const features = [
    {
      id: 'feature-1',
      number: '01',
      title: 'Voice & Text Niche Scanner',
      subtitle: 'Web Speech API + Trend Scraping',
      description:
        'Dictate your raw idea with your microphone or type a simple concept. The scanner extracts breakout angles, search keywords, and high-retention hooks instantly.',
      icon: Mic,
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'Web Speech API',
      detailBullets: [
        'Instant microphone transcription in browser',
        'Real-time viral keyword extraction',
        'Audience pain point targeting',
      ],
    },
    {
      id: 'feature-2',
      number: '02',
      title: 'Realistic AI Voice & Audio Ducking Engine',
      subtitle: 'ElevenLabs + Web Audio API Mixer',
      description:
        'Generate human-like voiceovers with natural pauses and emotional cadence. The mixer automatically ducks background music volume during speech and drops bass on punchlines.',
      icon: Volume2,
      gradient: 'from-purple-500 to-pink-600',
      badge: 'Dual-Track Ducking',
      detailBullets: [
        '75% automatic music ducking attenuation',
        'Trending Phonk & Lo-Fi viral beat catalog',
        'Synchronized whoosh & pop sound effects',
      ],
    },
    {
      id: 'feature-3',
      number: '03',
      title: 'Multi-Agent AI Script & HD Video Generator',
      subtitle: '6-Agent Autonomous Workflow Pipeline',
      description:
        'Six specialized agents collaborate: Trend Researcher, Copywriting Scriptwriter, Voice Synthesizer, Audio Mixer, 9:16 HD Renderer, and Social Dispatcher.',
      icon: Bot,
      gradient: 'from-emerald-500 to-teal-600',
      badge: '60 FPS 1080x1920',
      detailBullets: [
        'Strict 9:16 vertical full-frame compositing',
        'Animated word-by-word kinetic auto-captions',
        'Timestamped visual scene transitions',
      ],
    },
    {
      id: 'feature-4',
      number: '04',
      title: 'One-Click Social OAuth Auto-Scheduler',
      subtitle: '6-Platform Synchronized Dispatch',
      description:
        'Publish or schedule to Instagram Reels, TikTok, YouTube Shorts, Facebook Reels, Snapchat Spotlight, and Twitter (X) with a single approval payload.',
      icon: Share2,
      gradient: 'from-amber-500 to-orange-600',
      badge: '6 API Connectors',
      detailBullets: [
        'AES-256 encrypted OAuth token storage',
        'Platform-specific viral hashtag optimization',
        'Hands-free automatic cron scheduling',
      ],
    },
    {
      id: 'feature-5',
      number: '05',
      title: 'Real-Time Performance & Credit Dashboard',
      subtitle: 'Atomic Metering & Viral Analytics',
      description:
        'Track posts generated, estimated viral views, active schedule queues, and credit balances with atomic database safeguards and paywall protection.',
      icon: BarChart3,
      gradient: 'from-rose-500 to-red-600',
      badge: 'Atomic Safeguards',
      detailBullets: [
        '10 free posts upon signup with live counter',
        'Viral retention score & engagement estimate',
        'BullMQ asynchronous queue inspector',
      ],
    },
  ];

  return (
    <section className="relative py-20 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-semibold text-purple-300">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Autonomous Social SaaS Architecture</span>
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Five Core Systems Powering Hands-Free Scale
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Engineered for high-volume content creators and media agencies who need high retention 9:16 vertical reels without editing fatigue.
          </p>
        </div>

        {/* 5 Cards Layout (Bento Grid: 3 on top row, 2 on bottom row) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.slice(0, 3).map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feat.gradient} text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500">{feat.number}</span>
                  </div>

                  <span className="inline-block rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300 mb-2">
                    {feat.badge}
                  </span>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mb-3">{feat.subtitle}</p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  {feat.detailBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom 2 Wide Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
          {features.slice(3, 5).map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feat.gradient} text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500">{feat.number}</span>
                  </div>

                  <span className="inline-block rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300 mb-2">
                    {feat.badge}
                  </span>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mb-3">{feat.subtitle}</p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  {feat.detailBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
