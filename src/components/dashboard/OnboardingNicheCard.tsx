import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Wand2, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { audioMixer } from '../../utils/audioSynthesizer';

interface OnboardingNicheCardProps {
  nichePrompt: string;
  onChangeNiche: (prompt: string) => void;
  onGenerateReel: () => void;
  isGenerating: boolean;
  isPaywallLocked: boolean;
  onOpenPaywall: () => void;
}

export const OnboardingNicheCard: React.FC<OnboardingNicheCardProps> = ({
  nichePrompt,
  onChangeNiche,
  onGenerateReel,
  isGenerating,
  isPaywallLocked,
  onOpenPaywall,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceVolumeWaveform, setVoiceVolumeWaveform] = useState<number[]>([12, 24, 18, 36, 14, 28, 10]);
  const recognitionRef = useRef<any>(null);

  const nichePresets = [
    { label: '🤖 AI Automation & Wealth', prompt: '3 autonomous AI workflows that make money while you sleep in 2026' },
    { label: '📈 Trading & Crypto Mindset', prompt: 'The brutal psychology truth that separates profitable traders from gamblers' },
    { label: '⚡ Solo Creator Productivity', prompt: 'How solo founders automate 40 hours of manual work with AI agents' },
    { label: '💪 Biohacking & Longevity', prompt: '3 daily neuroscience morning habits for high dopamine and relentless focus' },
    { label: '🚀 SaaS Growth Secrets', prompt: 'The exact viral short-form distribution playbook to hit 100k MRR' },
  ];

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          onChangeNiche(transcript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch {
      setSpeechSupported(false);
    }
  }, [onChangeNiche]);

  // Animated waveform when mic is active
  useEffect(() => {
    if (!isListening) return;
    const interval = setInterval(() => {
      setVoiceVolumeWaveform(
        Array.from({ length: 9 }, () => Math.floor(Math.random() * 32) + 8)
      );
    }, 120);
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleMic = () => {
    audioMixer.playSFX('pop');
    if (!speechSupported || !recognitionRef.current) {
      // Fallback demo speech recognition simulation
      if (!isListening) {
        setIsListening(true);
        const demoWords = [
          'Top 5 AI tools',
          'Top 5 AI tools that replace expensive agencies',
          'Top 5 AI tools that replace expensive agencies in 2026 with hands-free automation',
        ];
        let step = 0;
        const interval = setInterval(() => {
          if (step < demoWords.length) {
            onChangeNiche(demoWords[step]);
            step++;
          } else {
            clearInterval(interval);
            setIsListening(false);
          }
        }, 1200);
      } else {
        setIsListening(false);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  const handleAction = () => {
    if (isPaywallLocked) {
      onOpenPaywall();
    } else {
      onGenerateReel();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-6 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Wand2 className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-white">Niche & Topic Scanner</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Speak your idea with your microphone or type a topic to trigger the 6-agent generation pipeline.
          </p>
        </div>

        {/* Mic live indicator */}
        {isListening && (
          <div className="flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span>Listening to Voice Input...</span>
          </div>
        )}
      </div>

      {/* Main Input Box with Integrated Large Mic Button */}
      <div className="relative rounded-xl border border-slate-700/80 bg-slate-950/80 p-3 shadow-inner focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        <textarea
          id="niche-prompt-input"
          value={nichePrompt}
          onChange={(e) => onChangeNiche(e.target.value)}
          placeholder="e.g., 3 AI Tools That Pay You While You Sleep in 2026, or click the mic to speak..."
          rows={3}
          className="w-full resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none leading-relaxed"
        />

        {/* Bottom toolbar inside input card */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2">
          
          {/* Microphone Button with Speech API */}
          <div className="flex items-center gap-3">
            <button
              id="mic-voice-scanner-btn"
              type="button"
              onClick={toggleMic}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shadow-md active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-600/30 animate-pulse'
                  : 'border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-indigo-500/60'
              }`}
              title="Click to speak with Web Speech API"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 text-white" />
                  <span>Stop Dictation</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 text-indigo-400" />
                  <span>Voice Scanner (Mic)</span>
                </>
              )}
            </button>

            {/* Live Audio Waveform Bars when speaking */}
            {isListening && (
              <div className="flex items-center gap-1 h-6 px-2">
                {voiceVolumeWaveform.map((height, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-rose-400 transition-all duration-100"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            id="generate-reel-submit-btn"
            type="button"
            disabled={isGenerating || !nichePrompt.trim()}
            onClick={handleAction}
            className={`group inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isPaywallLocked
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-orange-500/20'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-600/25 hover:brightness-110'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Agents Orchestrating...</span>
              </>
            ) : isPaywallLocked ? (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Upgrade to Generate ($5)</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Run 6-Agent Reel Generator</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

        </div>
      </div>

      {/* Fast Preset Tags */}
      <div className="mt-4">
        <span className="text-[11px] font-semibold text-slate-400 mr-2">Trending Niche Presets:</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {nichePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                audioMixer.playSFX('pop');
                onChangeNiche(preset.prompt);
              }}
              className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
