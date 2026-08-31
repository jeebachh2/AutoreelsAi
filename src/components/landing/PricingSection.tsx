import React, { useState } from 'react';
import { Check, Sparkles, Zap, Crown, Shield, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PricingSectionProps {
  onSelectPlan: (plan: { name: string; price: number; interval: string; posts: number }) => void;
  currentPlanName?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  currentPlanName = 'Free Trial',
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'bundle'>('bundle');

  const tiers = [
    {
      id: 'free',
      name: 'Free Trial',
      price: 0,
      period: 'Forever',
      subtitle: 'Test all 6 platforms instantly',
      postsBadge: '10 Free Auto-Posts',
      popular: false,
      buttonText: currentPlanName === 'Free Trial' ? 'Current Active Plan' : 'Select Free',
      features: [
        '10 Auto-Generated 9:16 Video Reels',
        'All 6 Social Connectors Enabled',
        '30s & 60s Vertical Video Rendering',
        'Dynamic Word Kinetic Captions',
        'Web Audio Ducking & SFX Engine',
        'Standard Generation Queue',
      ],
      gradient: 'from-slate-800 to-slate-900',
      border: 'border-slate-800',
    },
    {
      id: 'starter',
      name: 'Starter Plan',
      price: 5,
      period: '1 Month',
      subtitle: 'For solo creators testing automation',
      postsBadge: '100 Automated Posts / mo',
      popular: false,
      buttonText: 'Get Starter ($5)',
      features: [
        '100 Auto-Generated 9:16 HD Reels',
        '6 Social Platforms Simultaneous Dispatch',
        'Full ElevenLabs & Neural AI Voice Suite',
        'Trending Real Songs & Viral Beat Catalog',
        'Automated Scheduling & Cron Triggers',
        'No Watermarks on 1080x1920 MP4s',
      ],
      gradient: 'from-blue-900/40 via-indigo-900/30 to-slate-900',
      border: 'border-indigo-500/40',
    },
    {
      id: 'quarterly',
      name: 'Quarterly Value',
      price: 8,
      period: '3 Months ($2.67/mo)',
      subtitle: 'Most popular for channel growth',
      postsBadge: '500 Automated Posts',
      popular: true,
      buttonText: 'Claim Value Plan ($8)',
      features: [
        '500 Auto-Generated 9:16 HD Reels',
        'Priority GPU Video Rendering Queue',
        'Ultra-Realistic Audio Ducking & Sound FX',
        'Microphone Voice Scanner Support',
        'Automated Daily Cron Schedule Engine',
        'Viral Retention Score Analytics',
        'Live Telegram & Discord Alerts',
      ],
      gradient: 'from-purple-900/50 via-indigo-900/50 to-pink-950/30',
      border: 'border-purple-500 ring-2 ring-purple-500/30',
    },
    {
      id: 'biannual',
      name: 'Bi-Annual Saver',
      price: 12,
      period: '6 Months ($2.00/mo)',
      subtitle: 'Best for agencies and power creators',
      postsBadge: '1,500 Automated Posts',
      popular: false,
      buttonText: 'Get Bi-Annual ($12)',
      features: [
        '1,500 Auto-Generated 9:16 HD Reels',
        'Instant Multi-Platform Auto-Posting',
        'Custom Voice Inflection & Pitch Controls',
        '60-Second Deep Dive Viral Hooks',
        'Full Database API & Webhook Dispatch',
        'Multi-Account Social Token Management',
      ],
      gradient: 'from-slate-900 via-slate-850 to-slate-950',
      border: 'border-slate-700',
    },
    {
      id: 'annual',
      name: 'Annual Unlimited',
      price: 15,
      period: '1 Year ($1.25/mo)',
      subtitle: 'Maximum discount & unlimited power',
      postsBadge: 'Unlimited Auto-Posts',
      popular: false,
      buttonText: 'Go Unlimited ($15/yr)',
      features: [
        'Unlimited 9:16 Video Generation',
        'All 6 Connected Social Networks',
        'Fastest Dedicated Rendering Pipeline',
        'Custom Sound Effects & Music Library',
        'VIP 24/7 Priority Engineer Support',
        'Full Commercial Reseller Rights',
      ],
      gradient: 'from-amber-950/40 via-slate-900 to-rose-950/30',
      border: 'border-amber-500/50',
    },
  ];

  const handlePlanClick = (tier: typeof tiers[0]) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}

    onSelectPlan({
      name: tier.name,
      price: tier.price,
      interval: tier.period,
      posts: tier.id === 'free' ? 10 : tier.id === 'starter' ? 100 : tier.id === 'quarterly' ? 500 : tier.id === 'biannual' ? 1500 : 999999,
    });
  };

  return (
    <section className="relative py-20 border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-semibold text-amber-300">
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>Transparent SaaS Pricing</span>
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start Free. Scale With Unbeatable Tiers.
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            10 Free posts included with zero credit card required. Upgrade anytime for higher volumes and priority rendering.
          </p>
        </div>

        {/* Pricing Cards Grid (5 interactive cards) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col justify-between rounded-2xl border ${tier.border} bg-gradient-to-b ${tier.gradient} p-5 shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                  ⭐ Best Value
                </div>
              )}

              <div>
                {/* Title & Badge */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">{tier.name}</h3>
                  <p className="text-[11px] text-slate-400 min-h-[32px]">{tier.subtitle}</p>
                </div>

                {/* Price Display */}
                <div className="my-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">${tier.price}</span>
                    <span className="text-xs font-medium text-slate-400">/ {tier.period}</span>
                  </div>
                  <span className="mt-2 inline-block rounded-full bg-slate-800/90 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/20">
                    {tier.postsBadge}
                  </span>
                </div>

                {/* Feature List */}
                <ul className="space-y-2 text-xs text-slate-300 py-3 border-t border-slate-800/80">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/60 mt-4">
                <button
                  id={`tier-select-btn-${tier.id}`}
                  onClick={() => handlePlanClick(tier)}
                  className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all shadow-md active:scale-95 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white hover:brightness-110 shadow-purple-600/30'
                      : tier.id === 'free'
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20'
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Security & Guarantee Note */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Stripe & LemonSqueezy 256-Bit SSL Encrypted Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Instant API Credits Activation</span>
          </div>
        </div>

      </div>
    </section>
  );
};
