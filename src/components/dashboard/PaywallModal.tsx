import React, { useState } from 'react';
import { Crown, Sparkles, X, Check, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioMixer } from '../../utils/audioSynthesizer';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: (planName: string, allocatedCredits: number) => void;
  currentPlanName: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
  currentPlanName,
}) => {
  const [selectedTierId, setSelectedTierId] = useState<'starter' | 'quarterly' | 'biannual' | 'annual'>('quarterly');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const tiers = [
    {
      id: 'starter' as const,
      name: 'Starter Plan',
      price: 5,
      interval: '1 Month',
      credits: 100,
      badge: '100 Posts / mo',
      popular: false,
    },
    {
      id: 'quarterly' as const,
      name: 'Quarterly Value',
      price: 8,
      interval: '3 Months',
      credits: 500,
      badge: '500 Posts',
      popular: true,
    },
    {
      id: 'biannual' as const,
      name: 'Bi-Annual Saver',
      price: 12,
      interval: '6 Months',
      credits: 1500,
      badge: '1,500 Posts',
      popular: false,
    },
    {
      id: 'annual' as const,
      name: 'Annual Unlimited',
      price: 15,
      interval: '1 Year',
      credits: 999999,
      badge: 'Unlimited Posts',
      popular: false,
    },
  ];

  const handleCheckout = () => {
    setIsProcessing(true);
    audioMixer.playSFX('ding');

    const chosen = tiers.find((t) => t.id === selectedTierId) || tiers[1];

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      onUpgradeSuccess(chosen.name, chosen.credits);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-300">
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>Unlock Unlimited AutoReel Capacity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Supercharge Your Social Autopilot
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Scale your content output with 60 FPS HD rendering, priority queues, and all 6 connected platforms.
          </p>
        </div>

        {/* 4 Tiers Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tiers.map((tier) => {
            const isSelected = tier.id === selectedTierId;
            return (
              <div
                key={tier.id}
                onClick={() => {
                  audioMixer.playSFX('pop');
                  setSelectedTierId(tier.id);
                }}
                className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/30 shadow-lg shadow-purple-500/10 ring-2 ring-purple-500/40'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                    ⭐ Popular
                  </span>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{tier.name}</h4>
                    <p className="text-xs text-slate-400">{tier.interval}</p>
                  </div>
                  <span className="text-xl font-black text-white">${tier.price}</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-emerald-300 font-bold">
                    {tier.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 font-bold text-purple-400 text-[11px]">
                      <Check className="h-3 w-3" />
                      Selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature inclusions */}
        <div className="rounded-xl bg-slate-900/70 p-4 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>All 6 Networks: Instagram, TikTok, YouTube, Facebook, Snap & Twitter</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Dual-Track Voiceover with Real Music Ducking & Sound FX Drops</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Instant Stripe Checkout & 30-Day Money-Back Guarantee</span>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="pt-2">
          <button
            id="paywall-checkout-btn"
            disabled={isProcessing}
            onClick={handleCheckout}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Securing Instant Upgrade...</span>
            ) : (
              <>
                <Zap className="h-4 w-4 text-amber-300" />
                <span>Confirm & Activate Upgrade Now</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>256-bit Encrypted Checkout</span>
          </div>
          <span>•</span>
          <span>Cancel Anytime in 1-Click</span>
        </div>

      </div>
    </div>
  );
};
