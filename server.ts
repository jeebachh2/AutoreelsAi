import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { orchestrateMultiAgentReel } from './server/agents.ts';
import { PRISMA_SCHEMA, BULLMQ_WORKER_CODE } from './server/databaseSchemas.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Endpoints ---

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'AutoReel AI Engine',
      version: '2.4.0',
      timestamp: new Date().toISOString(),
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // Multi-Agent Reel Generation Pipeline
  app.post('/api/agents/generate-reel', async (req: Request, res: Response) => {
    try {
      const {
        nichePrompt = 'AI Automation tools for content creators in 2026',
        duration = 30,
        voiceId = 'marcus_pro',
        musicMode = 'trending_real',
        selectedTrackId = 'track_phonk_1',
        automationMode = 'manual',
        selectedPlatforms = ['instagram', 'tiktok', 'youtube', 'facebook', 'twitter', 'snapchat'],
      } = req.body;

      const result = await orchestrateMultiAgentReel({
        nichePrompt,
        duration: duration === 60 ? 60 : 30,
        voiceId,
        musicMode,
        selectedTrackId,
        automationMode,
        selectedPlatforms,
      });

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Error generating reel:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate reel',
      });
    }
  });

  // Social Distribution Dispatcher Mock/Live Handler
  app.post('/api/social/publish', async (req: Request, res: Response) => {
    try {
      const { videoId, platforms, title, caption } = req.body;

      // Simulate API latency & dispatch confirmation across each network
      const dispatchResults = (platforms || []).map((p: string) => ({
        platform: p,
        status: 'published',
        postId: `${p}_post_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        publishedAt: new Date().toISOString(),
        liveUrl: `https://${p}.com/reel/${Date.now()}`,
        latencyMs: Math.floor(Math.random() * 300) + 150,
      }));

      res.json({
        success: true,
        videoId,
        totalDispatched: dispatchResults.length,
        dispatches: dispatchResults,
        message: `Successfully scheduled & published to ${dispatchResults.length} platforms.`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Schema & Queue Architecture Metadata
  app.get('/api/database/schema', (req: Request, res: Response) => {
    res.json({
      success: true,
      prismaSchema: PRISMA_SCHEMA,
      bullmqWorkerCode: BULLMQ_WORKER_CODE,
      tables: ['User', 'Subscription', 'Niche', 'Video', 'ConnectedSocial', 'PostLog', 'QueueJob'],
      queues: ['video-rendering-pipeline', 'social-distribution-dispatcher'],
    });
  });

  // Stripe / LemonSqueezy Checkout Simulation
  app.post('/api/billing/checkout', (req: Request, res: Response) => {
    const { planTier, price } = req.body;
    res.json({
      success: true,
      sessionId: `cs_test_${Date.now()}_${Math.random().toString(36).substring(5)}`,
      checkoutUrl: '#',
      planTier,
      price,
      message: `Checkout session created for ${planTier} ($${price}).`,
    });
  });

  // --- Vite Dev Server Middleware or Static Production ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoReel AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
