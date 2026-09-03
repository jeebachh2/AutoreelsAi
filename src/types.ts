export type PlatformId = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'snapchat' | 'twitter';

export interface ConnectedPlatform {
  id: PlatformId;
  name: string;
  shortName: string;
  iconColor: string;
  badge: string;
  handle: string;
  connected: boolean;
  tokenExpiresIn: string;
  permissions: string[];
  avatarUrl: string;
  postsPublished: number;
  scheduledQueueCount: number;
  apiEndpoint: string;
  developerPortalUrl: string;
  setupGuide: string[];
  requiredFields: Array<{
    key: 'apiKey' | 'apiSecret' | 'accessToken' | 'pageId' | 'handle';
    label: string;
    placeholder: string;
    isSecret?: boolean;
    description?: string;
  }>;
  isRealAccount?: boolean;
  authMethod?: 'oauth_popup' | 'custom_api_key' | 'token';
  customAccessToken?: string;
  customApiKey?: string;
  customPageId?: string;
  lastConnectedAt?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  emotion: 'Energetic' | 'Storyteller' | 'Authoritative' | 'Casual' | 'Inspirational' | 'Deep Focus';
  previewText: string;
  pitch: number;
  rate: number;
  provider: 'Gemini Neural' | 'ElevenLabs Pro' | 'OpenAI Audio HD';
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  duration: number;
  isTrending: boolean;
  isCopyrightFree: boolean;
  waveformColor: string;
  trackType: 'synthesized_phonk' | 'lofi_ambient' | 'synthwave_energy' | 'trap_viral' | 'cinematic_epic';
}

export interface ScriptCue {
  id?: string;
  timeStart: number; // in seconds
  timeEnd: number;
  text: string;
  highlightWords?: string[];
  sfxCue?: 'whoosh' | 'pop' | 'ding' | 'bass_drop' | 'riser' | 'camera_shutter';
  visualFocus?: string;
}

export interface VideoReel {
  id: string;
  title: string;
  niche: string;
  duration: number; // 30 or 60 in seconds
  aspectRatio: '9:16';
  resolution: string;
  hookText?: string;
  caption?: string;
  hashtags?: string[];
  videoBackgroundUrl: string;
  renderedVideoUrl?: string;
  backupVideoTheme?: 'cyberpunk' | 'luxury' | 'technology' | 'finance' | 'fitness' | 'nature' | 'cosmic';
  voice: VoiceOption;
  musicTrack: MusicTrack;
  cues: ScriptCue[];
  status: 'ready_for_review' | 'scheduled' | 'published' | 'generating' | 'rejected';
  scheduledFor?: string;
  publishedAt?: string;
  targetPlatforms: PlatformId[];
  metrics: {
    estimatedViews: number;
    viralScore: number; // 0-100
    engagementRate?: number;
    estimatedEngagementRate?: number;
  };
  createdAt: string;
}

export interface AgentPipelineStep {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'idle' | 'running' | 'processing' | 'completed' | 'failed';
  latencyMs: number;
  description: string;
  outputPayload?: any;
}

export interface CreditState {
  totalAllocated: number;
  used: number;
  planName: string;
  resetDate?: string;
  isUnlimited?: boolean;
}
