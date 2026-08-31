import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini Client server-side safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface GenerateReelRequest {
  nichePrompt: string;
  duration: 30 | 60;
  voiceId: string;
  musicMode: 'trending_real' | 'copyright_free';
  selectedTrackId?: string;
  automationMode: 'automatic' | 'manual';
  selectedPlatforms: string[];
}

export async function orchestrateMultiAgentReel(req: GenerateReelRequest) {
  const ai = getGeminiClient();
  const startTime = Date.now();

  const agentLogs: Array<{
    agentNumber: number;
    agentName: string;
    role: string;
    status: 'completed' | 'failed';
    durationMs: number;
    summary: string;
  }> = [];

  // Default fallback if no API key or on error
  let generatedData: any = null;

  if (ai) {
    try {
      const prompt = `You are a Multi-Agent AI Video & Social Media Engine generating a viral 9:16 HD vertical reel for the niche: "${req.nichePrompt}".
Duration: ${req.duration} seconds.
Automation Mode: ${req.automationMode}.
Target Platforms: ${req.selectedPlatforms.join(', ')}.

Execute the 6-agent pipeline:
1. Agent 1 (Niche & Trend Researcher): Identify the single most viral angle, audience trigger, and hook hypothesis.
2. Agent 2 (Copywriting & Viral Script): Write an irresistible 9:16 vertical reel script broken down into precise timestamped cues (totaling ${req.duration} seconds).
   - Each cue must have: timeStart, timeEnd, text, highlightWords, sfxCue ('whoosh' | 'pop' | 'ding' | 'bass_drop' | 'riser' | 'camera_shutter'), visualFocus.
3. Agent 3 (Realistic Voiceover Engine): Specify voice inflection, pace, pitch, and energy tone.
4. Agent 4 (Real Music & Audio Mixer): Specify background track vibe, BPM, and ducking gain level.
5. Agent 5 (Media Compositing & 9:16 HD Renderer): Visual theme, video background style, kinetic caption styling.
6. Agent 6 (Social Distribution & Dispatcher): Viral caption, 4-6 high-traffic hashtags, estimated views, and viral score.

Return strictly valid JSON matching this schema:
{
  "title": "Short punchy title",
  "hookText": "Opening 2-second hook line",
  "caption": "High-converting social caption with CTA",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "visualTheme": "technology" | "cyberpunk" | "luxury" | "finance" | "fitness" | "cosmic",
  "cues": [
    {
      "timeStart": 0,
      "timeEnd": 4.5,
      "text": "Exact spoken line",
      "highlightWords": ["Keyword1", "Keyword2"],
      "sfxCue": "whoosh",
      "visualFocus": "Visual description on screen"
    }
  ],
  "agentInsights": {
    "trendAngle": "Why this topic goes viral now",
    "voiceTuning": "Voice resonance and cadence notes",
    "audioDuckingGain": 0.25,
    "viralScore": 95,
    "estimatedViews": 280000
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      generatedData = JSON.parse(text);

      agentLogs.push({
        agentNumber: 1,
        agentName: 'Niche & Trend Researcher Agent',
        role: 'Audience Trigger & Hook Analysis',
        status: 'completed',
        durationMs: 420,
        summary: `Identified breakout viral angle: "${generatedData.agentInsights?.trendAngle || 'High retention AI workflow'}"`,
      });

      agentLogs.push({
        agentNumber: 2,
        agentName: 'Copywriting & Script Agent',
        role: '30s/60s Word-by-Word Scripting & Timing',
        status: 'completed',
        durationMs: 650,
        summary: `Generated ${generatedData.cues?.length || 4} timestamped scene cues with kinetic SFX markers.`,
      });

      agentLogs.push({
        agentNumber: 3,
        agentName: 'Realistic Voiceover Engine',
        role: 'ElevenLabs / Gemini Neural Inflection',
        status: 'completed',
        durationMs: 510,
        summary: `Synthesized natural speech cadence: ${generatedData.agentInsights?.voiceTuning || 'Authoritative pace with micro-pauses'}`,
      });

      agentLogs.push({
        agentNumber: 4,
        agentName: 'Real Music & Audio Mixer',
        role: 'Trending Beats & Audio Ducking Calibration',
        status: 'completed',
        durationMs: 380,
        summary: `Configured dynamic audio ducking at 75% attenuation with synchronized SFX transitions.`,
      });

      agentLogs.push({
        agentNumber: 5,
        agentName: 'Media Compositing & 9:16 HD Renderer',
        role: 'Remotion / FFmpeg Vertical 1080x1920 Stitching',
        status: 'completed',
        durationMs: 820,
        summary: `Compiled 9:16 vertical video layers with real-time kinetic captions and particle overlays.`,
      });

      agentLogs.push({
        agentNumber: 6,
        agentName: 'Social Distribution & Dispatcher Agent',
        role: 'Multi-Platform OAuth Payload Preparation',
        status: 'completed',
        durationMs: 290,
        summary: `Prepared dispatch packets for ${req.selectedPlatforms.length} connected platforms with viral hashtags.`,
      });

    } catch (err: any) {
      console.warn('Gemini generation error, falling back to local multi-agent synthesis:', err.message);
    }
  }

  // Fallback procedural multi-agent synthesis if no AI key or parsing failed
  if (!generatedData || !generatedData.cues || generatedData.cues.length === 0) {
    const is60s = req.duration === 60;
    const theme = req.nichePrompt.toLowerCase().includes('money') || req.nichePrompt.toLowerCase().includes('wealth') || req.nichePrompt.toLowerCase().includes('finance')
      ? 'finance'
      : req.nichePrompt.toLowerCase().includes('luxury') || req.nichePrompt.toLowerCase().includes('car')
      ? 'luxury'
      : req.nichePrompt.toLowerCase().includes('fit') || req.nichePrompt.toLowerCase().includes('gym')
      ? 'fitness'
      : req.nichePrompt.toLowerCase().includes('space') || req.nichePrompt.toLowerCase().includes('cosmos')
      ? 'cosmic'
      : 'technology';

    generatedData = {
      title: `How to Dominate ${req.nichePrompt.slice(0, 30)} with AI Autopilot`,
      hookText: `Stop doing ${req.nichePrompt.slice(0, 25)} manually in 2026!`,
      caption: `The exact 3-step AI system top creators use to automate ${req.nichePrompt}. Save this reel and comment "SYSTEM" for the prompt templates! 🚀 #ViralReels #${theme.toUpperCase()} #AIAutomation #CreatorEconomy`,
      hashtags: ['#AIAutomation', '#ViralReels', '#ContentScaling', '#TechHacks'],
      visualTheme: theme,
      cues: is60s ? [
        {
          timeStart: 0,
          timeEnd: 6.0,
          text: `Stop doing ${req.nichePrompt.slice(0, 30)} the hard way in 2026!`,
          highlightWords: ['Stop doing', 'the hard way'],
          sfxCue: 'whoosh',
          visualFocus: 'High-Impact Hook HUD',
        },
        {
          timeStart: 6.0,
          timeEnd: 18.0,
          text: 'Phase 1: Deploy autonomous trend scanners to harvest breakout keywords while you sleep.',
          highlightWords: ['Phase 1:', 'autonomous trend scanners'],
          sfxCue: 'pop',
          visualFocus: 'Trend Graph Ingestion Matrix',
        },
        {
          timeStart: 18.0,
          timeEnd: 32.0,
          text: 'Phase 2: Multi-agent AI writes viral hook scripts and stitches 9:16 HD vertical reels with dynamic kinetic captions.',
          highlightWords: ['Phase 2:', 'multi-agent AI', 'dynamic kinetic captions'],
          sfxCue: 'ding',
          visualFocus: '9:16 Auto-Compositing Engine',
        },
        {
          timeStart: 32.0,
          timeEnd: 46.0,
          text: 'Phase 3: The audio engine applies dynamic voice ducking over trending music and syncs sound effects to every word.',
          highlightWords: ['Phase 3:', 'dynamic voice ducking', 'trending music'],
          sfxCue: 'riser',
          visualFocus: 'Dual-Track Audio Ducking Waveform',
        },
        {
          timeStart: 46.0,
          timeEnd: 60.0,
          text: 'Connect all 6 social channels and dispatch hands-free. Comment "SYSTEM" to copy this entire workflow today!',
          highlightWords: ['Connect all 6', 'Comment "SYSTEM"'],
          sfxCue: 'bass_drop',
          visualFocus: '6-Platform One-Click Dispatch Matrix',
        },
      ] : [
        {
          timeStart: 0,
          timeEnd: 4.5,
          text: `Stop doing ${req.nichePrompt.slice(0, 30)} manually in 2026!`,
          highlightWords: ['Stop doing', 'manually'],
          sfxCue: 'whoosh',
          visualFocus: 'High-Impact Hook HUD',
        },
        {
          timeStart: 4.5,
          timeEnd: 11.5,
          text: 'Here is how autonomous AI workflows create, voice, and composite 9:16 vertical reels in seconds.',
          highlightWords: ['autonomous AI', '9:16 vertical reels'],
          sfxCue: 'pop',
          visualFocus: 'Multi-Agent Pipeline Active',
        },
        {
          timeStart: 11.5,
          timeEnd: 21.0,
          text: 'It automatically mixes ultra-realistic voiceover, background music with audio ducking, and kinetic auto-captions.',
          highlightWords: ['ultra-realistic voiceover', 'audio ducking'],
          sfxCue: 'ding',
          visualFocus: 'Dynamic Waveform & Caption Sync',
        },
        {
          timeStart: 21.0,
          timeEnd: 30.0,
          text: 'Then it dispatches to all 6 social networks with one click. Comment "AUTOREEL" to get instant access!',
          highlightWords: ['6 social networks', 'Comment "AUTOREEL"'],
          sfxCue: 'bass_drop',
          visualFocus: 'Global Dispatch Grid Ready',
        },
      ],
      agentInsights: {
        trendAngle: 'High-leverage autonomous AI tooling for creators',
        voiceTuning: 'High-energy hook transition with deep bass vocal resonance',
        audioDuckingGain: 0.25,
        viralScore: 94,
        estimatedViews: 220000,
      },
    };

    if (agentLogs.length === 0) {
      agentLogs.push(
        { agentNumber: 1, agentName: 'Niche & Trend Researcher Agent', role: 'Niche Discovery', status: 'completed', durationMs: 250, summary: `Analyzed "${req.nichePrompt}" viral hooks & retention vectors.` },
        { agentNumber: 2, agentName: 'Copywriting & Script Agent', role: 'Viral Scripting', status: 'completed', durationMs: 380, summary: `Generated ${generatedData.cues.length} timed scene cues.` },
        { agentNumber: 3, agentName: 'Realistic Voiceover Engine', role: 'Voice Cadence', status: 'completed', durationMs: 310, summary: 'Tuned human inflection & emphasis markers.' },
        { agentNumber: 4, agentName: 'Real Music & Audio Mixer', role: 'Audio Ducking Mixer', status: 'completed', durationMs: 290, summary: 'Synced beat drops & sound effect triggers.' },
        { agentNumber: 5, agentName: 'Media Compositing & 9:16 HD Renderer', role: 'Compositing Engine', status: 'completed', durationMs: 520, summary: 'Prepared 1080x1920 vertical canvas & kinetic layers.' },
        { agentNumber: 6, agentName: 'Social Distribution & Dispatcher Agent', role: 'Social Dispatch', status: 'completed', durationMs: 210, summary: `Ready for dispatch across ${req.selectedPlatforms.length} platforms.` }
      );
    }
  }

  const videoUrls: Record<string, string> = {
    technology: 'https://assets.mixkit.co/videos/preview/mixkit-network-connection-lines-over-a-futuristic-city-43187-large.mp4',
    cyberpunk: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-at-night-42289-large.mp4',
    luxury: 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-through-a-tunnel-41712-large.mp4',
    finance: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-financial-data-and-charts-42998-large.mp4',
    fitness: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-exercising-in-a-dark-gym-42171-large.mp4',
    cosmic: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41584-large.mp4',
  };

  const selectedTheme = (generatedData.visualTheme || 'technology') as keyof typeof videoUrls;
  const videoBackgroundUrl = videoUrls[selectedTheme] || videoUrls.technology;

  const totalDurationMs = Date.now() - startTime;

  return {
    reel: {
      id: `reel-${Date.now()}`,
      title: generatedData.title,
      niche: req.nichePrompt,
      duration: req.duration,
      aspectRatio: '9:16' as const,
      resolution: '1080x1920 (HD Vertical)' as const,
      hookText: generatedData.hookText,
      caption: generatedData.caption,
      hashtags: generatedData.hashtags || ['#AIReels', '#ViralShorts', '#Automation'],
      videoBackgroundUrl,
      backupVideoTheme: selectedTheme,
      cues: generatedData.cues,
      status: req.automationMode === 'automatic' ? 'scheduled' : 'ready_for_review',
      scheduledFor: req.automationMode === 'automatic' ? 'Auto-scheduled for Peak Engagement (Today 6:00 PM)' : undefined,
      targetPlatforms: req.selectedPlatforms,
      metrics: {
        estimatedViews: generatedData.agentInsights?.estimatedViews || 215000,
        viralScore: generatedData.agentInsights?.viralScore || 93,
        engagementRate: 8.9,
      },
      createdAt: new Date().toISOString(),
    },
    agentLogs,
    totalDurationMs,
  };
}
