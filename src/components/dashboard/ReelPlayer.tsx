import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  Share2,
  Calendar,
  Layers,
  Radio,
  Sliders,
} from 'lucide-react';
import { VideoReel, PlatformId } from '../../types';
import { audioMixer, speakSentence } from '../../utils/audioSynthesizer';

interface ReelPlayerProps {
  reel: VideoReel;
  onApproveAndSchedule: (reelId: string, platforms: PlatformId[]) => void;
  isPublishing?: boolean;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({
  reel,
  onApproveAndSchedule,
  isPublishing = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [activeCueIndex, setActiveCueIndex] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([
    'instagram',
    'tiktok',
    'youtube',
    'facebook',
    'twitter',
    'snapchat',
  ]);
  const [hasApproved, setHasApproved] = useState(reel.status === 'scheduled' || reel.status === 'published');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speechCancelerRef = useRef<{ cancel: () => void } | null>(null);
  const lastSfxTriggeredRef = useRef<number>(-1);

  // Available social platform toggles
  const platformOptions: Array<{ id: PlatformId; label: string; color: string }> = [
    { id: 'instagram', label: 'Instagram Reels', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
    { id: 'tiktok', label: 'TikTok Video', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    { id: 'youtube', label: 'YouTube Shorts', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
    { id: 'facebook', label: 'Facebook Reels', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    { id: 'twitter', label: 'Twitter (X) Video', color: 'bg-slate-700/40 text-slate-300 border-slate-600/40' },
    { id: 'snapchat', label: 'Snapchat Spotlight', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
  ];

  // Playback loop & cue synchronization
  useEffect(() => {
    let interval: number;

    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTimeSec((prev) => {
          const next = prev + 0.2;
          if (next >= reel.duration) {
            // Loop back to start
            return 0;
          }
          return next;
        });
      }, 200);
    }

    return () => clearInterval(interval);
  }, [isPlaying, reel.duration]);

  // Sync active cue, voiceover, and SFX
  useEffect(() => {
    const cueIndex = reel.cues.findIndex(
      (c) => currentTimeSec >= c.timeStart && currentTimeSec <= c.timeEnd
    );

    if (cueIndex !== -1 && cueIndex !== activeCueIndex) {
      setActiveCueIndex(cueIndex);
      const cue = reel.cues[cueIndex];

      // Trigger SFX if cue specifies one and not already triggered
      if (cue.sfxCue && lastSfxTriggeredRef.current !== cueIndex) {
        lastSfxTriggeredRef.current = cueIndex;
        if (!isMuted) {
          audioMixer.playSFX(cue.sfxCue);
        }
      }

      // Speak line with voiceover engine if playing
      if (isPlaying && !isMuted) {
        speechCancelerRef.current?.cancel();
        speechCancelerRef.current = speakSentence(
          cue.text,
          {
            gender: reel.voice.gender,
            pitch: reel.voice.pitch,
            rate: reel.voice.rate,
          }
        );
      }
    }
  }, [currentTimeSec, activeCueIndex, reel.cues, isPlaying, isMuted, reel.voice]);

  const togglePlay = () => {
    if (isPlaying) {
      speechCancelerRef.current?.cancel();
      audioMixer.stopMusic();
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      audioMixer.init();
      if (!isMuted) {
        audioMixer.startMusic(reel.musicTrack.trackType);
      }
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioMixer.startMusic(reel.musicTrack.trackType);
      setIsMuted(false);
    } else {
      audioMixer.stopMusic();
      speechCancelerRef.current?.cancel();
      setIsMuted(true);
    }
  };

  const handleRestart = () => {
    speechCancelerRef.current?.cancel();
    lastSfxTriggeredRef.current = -1;
    setCurrentTimeSec(0);
    setActiveCueIndex(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const togglePlatform = (id: PlatformId) => {
    audioMixer.playSFX('pop');
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleApprove = () => {
    audioMixer.playSFX('ding');
    setHasApproved(true);
    onApproveAndSchedule(reel.id, selectedPlatforms);
  };

  const currentCue = reel.cues[activeCueIndex] || reel.cues[0];
  const progressPercent = Math.min(100, (currentTimeSec / reel.duration) * 100);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-black p-5 shadow-2xl">
      
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
              {reel.resolution}
            </span>
            <span className="rounded-md bg-pink-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-pink-300">
              {reel.duration}s Vertical
            </span>
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
              Viral Score: {reel.metrics.viralScore}/100
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-bold text-white">{reel.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            hasApproved
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}>
            <span className={`h-2 w-2 rounded-full ${hasApproved ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {hasApproved ? 'Scheduled & Dispatched' : 'Ready for Approval'}
          </span>
        </div>
      </div>

      {/* Main Player & Controls Container */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center pt-5">
        
        {/* Left Side: Interactive 9:16 Vertical HD Video Screen (Strict Requirement: No raw text script, pure rendered video) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[290px] sm:max-w-[310px]">
            
            {/* Phone Bezel & Aspect Ratio */}
            <div className="relative rounded-[36px] border-4 border-slate-700/80 bg-slate-950 p-2 shadow-2xl ring-1 ring-slate-800">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 h-3.5 w-20 rounded-full bg-slate-900 border border-slate-800" />

              {/* 9:16 Aspect Canvas/Video Container */}
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[28px] bg-slate-900">
                
                {/* 60 FPS HD Looped Video Background */}
                <video
                  ref={videoRef}
                  src={reel.videoBackgroundUrl}
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />

                {/* Dark Vignette Overlay for Crisp Readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />

                {/* Top Video HUD Badges */}
                <div className="absolute top-7 left-3.5 right-3.5 flex items-center justify-between z-20">
                  <span className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                    <Radio className="h-2.5 w-2.5 text-cyan-400" />
                    HD 9:16
                  </span>

                  {/* Audio Status Pill */}
                  <span className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono text-purple-300 border border-purple-500/30">
                    {reel.musicTrack.title.slice(0, 14)}...
                  </span>
                </div>

                {/* Real-time Word-by-Word Kinetic Auto-Captions in 9:16 Center */}
                <div className="absolute inset-x-3.5 top-1/2 -translate-y-1/2 z-20 text-center">
                  <div className="inline-block rounded-2xl bg-black/80 backdrop-blur-md px-4 py-3 border border-white/15 shadow-2xl">
                    <p className="font-heading text-base sm:text-lg font-black tracking-tight text-white leading-tight uppercase drop-shadow-lg">
                      {currentCue?.text}
                    </p>

                    {/* SFX Marker Drop notification if active */}
                    {currentCue?.sfxCue && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                        <Sparkles className="h-2.5 w-2.5 text-amber-300" />
                        SFX: [{currentCue.sfxCue.toUpperCase()}]
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Social Media Profile Simulation & Progress Bar */}
                <div className="absolute bottom-3 left-3 right-3 z-20 space-y-2">
                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-2">
                      <img
                        src="/autoreel_logo.jpg"
                        alt="AutoReel Creator"
                        referrerPolicy="no-referrer"
                        className="h-7 w-7 rounded-full object-cover ring-1 ring-cyan-400/50 shadow-md"
                      />
                      <div>
                        <p className="font-bold text-[11px] text-white">@AutoReel.AI</p>
                        <p className="text-[9px] text-slate-300">Voice: {reel.voice.name}</p>
                      </div>
                    </div>

                    <span className="rounded bg-indigo-600/90 px-2 py-0.5 text-[9px] font-bold text-white font-mono">
                      {currentTimeSec.toFixed(1)}s / {reel.duration}s
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 transition-all duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Right Side: Player Controls & 6-Platform Dispatch Matrix */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Media Player Controls (Play/Pause, Mute, Restart) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Media & Audio Playback Controls
              </span>
              <span className="font-mono text-xs text-slate-400">
                {currentTimeSec.toFixed(1)}s of {reel.duration}s
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button
                id={`reel-play-btn-${reel.id}`}
                onClick={togglePlay}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-600 shadow-amber-600/20 hover:bg-amber-500'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-600/25 hover:brightness-110'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 fill-current" />
                    <span>Pause Reel</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>Play 9:16 Video + Real Voice & Beats</span>
                  </>
                )}
              </button>

              {/* Mute / Unmute */}
              <button
                onClick={toggleMute}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-rose-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-emerald-400" />
                )}
              </button>

              {/* Restart */}
              <button
                onClick={handleRestart}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                title="Restart Reel from Beginning"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Social Media Distribution Checkboxes (6 Platforms) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Select Destination Feeds ({selectedPlatforms.length}/6 Selected)
              </label>
              <button
                onClick={() =>
                  setSelectedPlatforms(
                    selectedPlatforms.length === 6 ? [] : ['instagram', 'tiktok', 'youtube', 'facebook', 'twitter', 'snapchat']
                  )
                }
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
              >
                {selectedPlatforms.length === 6 ? 'Deselect All' : 'Select All 6'}
              </button>
            </div>

            {/* 6 Platform Checkbox Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {platformOptions.map((plat) => {
                const isChecked = selectedPlatforms.includes(plat.id);
                return (
                  <div
                    key={plat.id}
                    onClick={() => togglePlatform(plat.id)}
                    className={`cursor-pointer rounded-xl border p-2.5 transition-all text-xs font-semibold flex items-center justify-between ${
                      isChecked
                        ? plat.color
                        : 'border-slate-800 bg-slate-950/60 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <span>{plat.label}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="accent-indigo-500 rounded cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prominent "Approve & Schedule All" Action Button */}
          <div className="pt-2">
            <button
              id={`approve-schedule-btn-${reel.id}`}
              disabled={selectedPlatforms.length === 0 || isPublishing}
              onClick={handleApprove}
              className={`w-full rounded-2xl py-4 text-sm font-extrabold text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2.5 ${
                hasApproved
                  ? 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-500'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 shadow-emerald-500/25 hover:brightness-110'
              }`}
            >
              {hasApproved ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Reel Approved & Scheduled Across {selectedPlatforms.length} Platforms</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 text-amber-300" />
                  <span>Approve & Schedule All ({selectedPlatforms.length} Platforms)</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
