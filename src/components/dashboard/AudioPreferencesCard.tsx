import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Square, Sparkles, Mic, Music, Sliders, Check, Radio } from 'lucide-react';
import { VoiceOption, MusicTrack } from '../../types';
import { audioMixer, speakSentence } from '../../utils/audioSynthesizer';

interface AudioPreferencesCardProps {
  voices: VoiceOption[];
  selectedVoiceId: string;
  onSelectVoice: (id: string) => void;
  musicMode: 'trending_real' | 'copyright_free';
  onChangeMusicMode: (mode: 'trending_real' | 'copyright_free') => void;
  tracks: MusicTrack[];
  selectedTrackId: string;
  onSelectTrack: (trackId: string) => void;
  duckingIntensity: number;
  onChangeDucking: (value: number) => void;
}

export const AudioPreferencesCard: React.FC<AudioPreferencesCardProps> = ({
  voices,
  selectedVoiceId,
  onSelectVoice,
  musicMode,
  onChangeMusicMode,
  tracks,
  selectedTrackId,
  onSelectTrack,
  duckingIntensity,
  onChangeDucking,
}) => {
  const [isPlayingAudition, setIsPlayingAudition] = useState(false);
  const [isPlayingMusicPreview, setIsPlayingMusicPreview] = useState(false);
  const [activeSpeechCanceler, setActiveSpeechCanceler] = useState<{ cancel: () => void } | null>(null);

  const currentVoice = voices.find((v) => v.id === selectedVoiceId) || voices[0];
  const currentTrack = tracks.find((t) => t.id === selectedTrackId) || tracks[0];

  const filteredTracks = tracks.filter((t) =>
    musicMode === 'trending_real' ? t.isTrending : t.isCopyrightFree
  );

  const handleAuditionVoice = () => {
    if (isPlayingAudition) {
      activeSpeechCanceler?.cancel();
      setIsPlayingAudition(false);
      return;
    }

    audioMixer.playSFX('ding');
    const canceler = speakSentence(
      currentVoice.previewText,
      {
        gender: currentVoice.gender,
        pitch: currentVoice.pitch,
        rate: currentVoice.rate,
      },
      () => setIsPlayingAudition(true),
      () => setIsPlayingAudition(false)
    );
    setActiveSpeechCanceler(canceler);
  };

  const handleToggleMusicPreview = () => {
    if (isPlayingMusicPreview) {
      audioMixer.stopMusic();
      setIsPlayingMusicPreview(false);
    } else {
      audioMixer.init();
      audioMixer.startMusic(currentTrack.trackType);
      setIsPlayingMusicPreview(true);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
            <Volume2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Audio & Voice Engine</h2>
            <p className="text-xs text-slate-400">
              Ultra-realistic voice cadence, trending music selection, and automatic speech ducking.
            </p>
          </div>
        </div>

        <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[11px] font-mono text-purple-300">
          Dual-Track Ducking
        </span>
      </div>

      {/* Voice Selection Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            1. Select AI Voice Persona ({voices.length} Available)
          </label>
          <button
            id="audition-voice-btn"
            type="button"
            onClick={handleAuditionVoice}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              isPlayingAudition
                ? 'bg-rose-600 text-white'
                : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {isPlayingAudition ? (
              <>
                <Square className="h-3 w-3 fill-current" />
                <span>Auditioning...</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>Audition Sample</span>
              </>
            )}
          </button>
        </div>

        {/* Voice Cards Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {voices.map((v) => {
            const isSelected = v.id === selectedVoiceId;
            return (
              <div
                key={v.id}
                onClick={() => {
                  audioMixer.playSFX('pop');
                  onSelectVoice(v.id);
                }}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-md shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                      {v.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{v.accent}</p>
                  </div>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-indigo-400">
                    {v.provider}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px]">
                  <span className="rounded bg-slate-800/80 px-2 py-0.5 text-slate-300">
                    Emotion: <strong>{v.emotion}</strong>
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 font-bold text-emerald-400">
                      <Check className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Music Category Toggle & Track Selector */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            2. Background Music Engine
          </label>

          {/* Trending vs Copyright-Free Mode Toggle */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => {
                audioMixer.playSFX('pop');
                onChangeMusicMode('trending_real');
              }}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                musicMode === 'trending_real'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔥 Trending Real Songs
            </button>
            <button
              type="button"
              onClick={() => {
                audioMixer.playSFX('pop');
                onChangeMusicMode('copyright_free');
              }}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                musicMode === 'copyright_free'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🛡️ Copyright-Free Viral Beats
            </button>
          </div>
        </div>

        {/* Selected Track Pill with Live Beat Player */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleMusicPreview}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                isPlayingMusicPreview
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30'
              }`}
              title="Preview synthesized rhythmic beat"
            >
              {isPlayingMusicPreview ? (
                <Square className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
            </button>
            <div>
              <p className="text-xs font-bold text-white">{currentTrack.title}</p>
              <p className="text-[11px] text-slate-400">
                {currentTrack.genre} • <span className="font-mono text-cyan-400">{currentTrack.bpm} BPM</span>
              </p>
            </div>
          </div>

          {/* Sound FX Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] text-slate-500">Test SFX:</span>
            {(['whoosh', 'ding', 'bass_drop', 'pop'] as const).map((sfx) => (
              <button
                key={sfx}
                type="button"
                onClick={() => audioMixer.playSFX(sfx)}
                className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] font-mono text-slate-300 hover:border-indigo-500 hover:text-white"
              >
                {sfx}
              </button>
            ))}
          </div>
        </div>

        {/* Ducking Intensity Slider */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300">Speech Audio Ducking Attenuation</span>
            <span className="font-mono font-bold text-purple-400">{duckingIntensity}% Volume Drop</span>
          </div>
          <input
            type="range"
            min="20"
            max="90"
            value={duckingIntensity}
            onChange={(e) => onChangeDucking(Number(e.target.value))}
            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-500">
            Automatically lowers background music volume when voice speaks and smoothly restores on pauses.
          </p>
        </div>

      </div>

    </div>
  );
};
