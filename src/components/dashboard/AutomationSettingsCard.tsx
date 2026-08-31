import React from 'react';
import { Settings, Zap, CheckCircle2, Clock, Calendar, ShieldCheck, Flame } from 'lucide-react';
import { audioMixer } from '../../utils/audioSynthesizer';

interface AutomationSettingsCardProps {
  automationMode: 'automatic' | 'manual';
  onChangeAutomationMode: (mode: 'automatic' | 'manual') => void;
  duration: 30 | 60;
  onChangeDuration: (duration: 30 | 60) => void;
}

export const AutomationSettingsCard: React.FC<AutomationSettingsCardProps> = ({
  automationMode,
  onChangeAutomationMode,
  duration,
  onChangeDuration,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <Settings className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Automation & Duration Settings</h2>
            <p className="text-xs text-slate-400">
              Configure posting autonomy rules and 9:16 vertical render length.
            </p>
          </div>
        </div>

        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-mono ${
          automationMode === 'automatic'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
        }`}>
          {automationMode === 'automatic' ? '⚡ Hands-Free Auto' : '👁️ Manual Approval'}
        </span>
      </div>

      {/* Grid: Mode Selector & Duration Selector */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* 1. Automation Mode Toggle Card */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            1. Automation Workflow Mode
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* Automatic Mode */}
            <div
              onClick={() => {
                audioMixer.playSFX('pop');
                onChangeAutomationMode('automatic');
              }}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                automationMode === 'automatic'
                  ? 'border-emerald-500 bg-emerald-950/30 shadow-md shadow-emerald-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-emerald-400" />
                  Automatic
                </span>
                {automationMode === 'automatic' && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Hands-free AI auto-generation & direct multi-platform dispatching on schedule.
              </p>
            </div>

            {/* Manual Mode */}
            <div
              onClick={() => {
                audioMixer.playSFX('pop');
                onChangeAutomationMode('manual');
              }}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                automationMode === 'manual'
                  ? 'border-indigo-500 bg-indigo-950/30 shadow-md shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                  Manual
                </span>
                {automationMode === 'manual' && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Generates 9:16 HD preview into gallery. Dispatches only after one-click approval.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Duration Selector UI */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            2. Reel Duration Selector
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* 30 Seconds */}
            <div
              onClick={() => {
                audioMixer.playSFX('pop');
                onChangeDuration(30);
              }}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                duration === 30
                  ? 'border-cyan-500 bg-cyan-950/30 shadow-md shadow-cyan-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">30 Seconds</span>
                <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-mono text-cyan-300">
                  Maximum Virality
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Rapid 3-part punchy hooks designed for 95%+ completion rate algorithms.
              </p>
            </div>

            {/* 60 Seconds (1 Minute) */}
            <div
              onClick={() => {
                audioMixer.playSFX('pop');
                onChangeDuration(60);
              }}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                duration === 60
                  ? 'border-purple-500 bg-purple-950/30 shadow-md shadow-purple-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">60 Seconds</span>
                <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-mono text-purple-300">
                  Deep Value Hook
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                1-minute in-depth breakdown with 5 timed visual scenes and SFX drops.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
