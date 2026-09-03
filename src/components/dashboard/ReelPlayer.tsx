import React, { useState, useEffect, useRef } from 'react';
import { renderRealVideo } from '../../service/creatomateService';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Zap,
  CheckCircle2,
  Loader2,
  Video,
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

  // Creatomate Video States
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(reel.renderedVideoUrl || null);
  const [isRendering, setIsRendering] = useState(false);

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

      // Speak line with voiceover engine if playing and not using full rendered video
      if (isPlaying && !isMuted && !renderedVideoUrl) {
        speechCancelerRef.current?.cancel();
        speechCancelerRef.current = speakSentence(
          cue.text,
          {
            gender: reel.voice?.gender || 'male',
            pitch: reel.voice?.pitch || 1.0,
            rate: reel.voice?.rate || 1.0,
          }
        );
      }
    }
  }, [currentTimeSec, activeCueIndex, reel.cues, isPlaying, isMuted, reel.voice, renderedVideoUrl]);

  // Creatomate Video Rendering Handler
  const handleRenderCreatomateVideo = async () => {
    try {
      setIsRendering(true);
      const scenes = reel.cues.map((cue) => ({
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(cue.visualFocus || reel.niche)}?width=1080&height=1920&nologo=true`,
        timeStart: cue.timeStart,
        timeEnd: cue.timeEnd,
      }));

      const videoUrl = await renderRealVideo(scenes, reel.musicTrack?.id, reel.niche);
      if (videoUrl) {
        setRenderedVideoUrl(videoUrl);
      }
    } catch (error) {
      console.error("Failed to render Creatomate video:", error);
      alert(error instanceof Error ? error.message : 'Video rendering failed.');
    } finally {
      setIsRendering(false);
    }
  };

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
      if (!isMuted && reel.musicTrack && !renderedVideoUrl) {
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
      if (reel.musicTrack && !renderedVideoUrl) audioMixer.startMusic(reel.musicTrack.trackType);
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

  const isImageMedia =
    reel.videoBackgroundUrl?.includes('image.pollinations.ai') ||
    reel.videoBackgroundUrl?.match(/\.(jpeg|jpg|gif|png|webp)/i);

  const currentVisualFocus = currentCue?.visualFocus || reel.niche;
  const currentImageUrl = isImageMedia
    ? `https://image.pollinations.ai/prompt/${encodeURIComponent(currentVisualFocus)}?width=1080&height=1920&nologo=true`
    : reel.videoBackgroundUrl;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-black p-5 shadow-2xl">
      
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
              {reel.resolution || '1080x1920 (HD Vertical)'}
            </span>
            <span className="rounded-md bg-pink-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-pink-300">
              {reel.duration}s Vertical
            </span>
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
              Viral Score: {reel.metrics?.viralScore || 95}/100
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-bold text-white capitalize">{reel.title}</h3>
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
        
        {/* Left Side: Interactive 9:16 Vertical HD Video/Image Screen */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[290px] sm:max-w-[310px]">
            
            {/* Phone Bezel */}
            <div className="relative rounded-[36px] border-4 border-slate-700/80 bg-slate-950 p-2 shadow-2xl ring-1 ring-slate-800">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 h-3.5 w-20 rounded-full bg-slate-900 border border-slate-800" />

              {/* 9:16 Aspect Canvas/Video Container */}
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[28px] bg-slate-900">
                
                {/* Creatomate Rendered Video OR Fallback Preview */}
                {renderedVideoUrl ? (
                  <video
                    ref={videoRef}
                    src={renderedVideoUrl}
                    loop
                    muted={isMuted}
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : isImageMedia ? (
                  <img
                    src={currentImageUrl}
                    alt={reel.title}
                    className="reel-ken-burns h-full w-full object-cover transition-all duration-700 transform scale-105"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={reel.videoBackgroundUrl}
                    loop
                    muted={isMuted}
                    playsInline
                    className="h-full w-full object-cover"
                  />
                )}

                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  title={isPlaying ? 'Pause video' : 'Play video'}
                  className={`absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white shadow-2xl backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/75 active:scale-95 ${
                    isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="h-7 w-7 fill-current" />
                  ) : (
                    <Play className="ml-1 h-7 w-7 fill-current" />
                  )}
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* Right Side: Player Controls & 6-Platform Dispatch Matrix */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Creatomate Video Generation Button */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Creatomate MP4 Video
              </span>
              {renderedVideoUrl && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  Ready
                </span>
              )}
            </div>

            <button
              onClick={handleRenderCreatomateVideo}
              disabled={isRendering}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-95 hover:brightness-110 disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Rendering Real MP4 Video...</span>
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  <span>{renderedVideoUrl ? "Re-render Real MP4 Video" : "Render Real MP4 Video"}</span>
                </>
              )}
            </button>
          </div>

          {/* Media Player Controls */}
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
                    <span>Pause Story Reel</span>
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

          {/* Action Button */}
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