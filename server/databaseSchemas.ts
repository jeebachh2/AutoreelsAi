/**
 * Production-Grade Database Schemas (Prisma ORM & PostgreSQL DDL & Mongoose)
 * and BullMQ / Redis Queue Architecture Specification.
 */

export const PRISMA_SCHEMA = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum PlanTier {
  FREE_TRIAL
  STARTER
  QUARTERLY_VALUE
  BI_ANNUAL_SAVER
  ANNUAL_UNLIMITED
}

enum AutomationMode {
  MANUAL
  AUTOMATIC
}

enum VideoStatus {
  GENERATING
  READY_FOR_REVIEW
  APPROVED
  SCHEDULED
  PUBLISHING
  PUBLISHED
  FAILED
}

enum PlatformType {
  INSTAGRAM
  TIKTOK
  YOUTUBE
  FACEBOOK
  TWITTER
  SNAPCHAT
}

enum JobStatus {
  WAITING
  ACTIVE
  COMPLETED
  FAILED
  DELAYED
}

model User {
  id                String             @id @default(uuid())
  email             String             @unique
  name              String?
  avatarUrl         String?
  creditsAllocated  Int                @default(10)
  creditsUsed       Int                @default(0)
  stripeCustomerId  String?            @unique
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  subscription      Subscription?
  niches            Niche[]
  videos            Video[]
  connectedSocials  ConnectedSocial[]
  postLogs          PostLog[]
  queueJobs         QueueJob[]

  @@index([email])
}

model Subscription {
  id                    String        @id @default(uuid())
  userId                String        @unique
  user                  User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  tier                  PlanTier      @default(FREE_TRIAL)
  status                String        @default("active") // active, past_due, canceled
  price                 Decimal       @default(0.00)
  currency              String        @default("USD")
  intervalDays          Int           @default(30)
  stripeSubscriptionId  String?       @unique
  currentPeriodStart    DateTime      @default(now())
  currentPeriodEnd      DateTime
  cancelAtPeriodEnd     Boolean       @default(false)
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
}

model Niche {
  id                String          @id @default(uuid())
  userId            String
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  nicheTitle        String
  promptTemplate    String
  automationMode    AutomationMode  @default(MANUAL)
  targetDurationSec Int             @default(30)
  preferredVoiceId  String          @default("marcus_pro")
  musicCategory     String          @default("trending_real")
  duckingIntensity  Float           @default(0.75)
  cronSchedule      String?         // e.g. "0 9 * * *" (Every day at 9 AM)
  isActive          Boolean         @default(true)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  videos            Video[]
}

model Video {
  id                String          @id @default(uuid())
  userId            String
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  nicheId           String?
  niche             Niche?          @relation(fields: [nicheId], references: [id], onDelete: SetNull)
  title             String
  hookText          String
  scriptContent     Json            // Array of timed dialogue cues & SFX
  durationSec       Int             @default(30)
  aspectRatio       String          @default("9:16")
  resolution        String          @default("1080x1920")
  voiceId           String
  voiceProvider     String          @default("ElevenLabs")
  musicTrackUrl     String
  musicTrackTitle   String
  renderedVideoUrl  String?
  thumbnailUrl      String?
  captionText       String
  hashtags          String[]
  status            VideoStatus     @default(READY_FOR_REVIEW)
  scheduledAt       DateTime?
  publishedAt       DateTime?
  targetPlatforms   PlatformType[]
  viralScore        Int             @default(90)
  estimatedViews    Int             @default(150000)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  postLogs          PostLog[]
  queueJobs         QueueJob[]

  @@index([userId, status])
}

model ConnectedSocial {
  id                String          @id @default(uuid())
  userId            String
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  platform          PlatformType
  accountHandle     String
  accountId         String
  encryptedAccessToken  String      // AES-256 encrypted
  encryptedRefreshToken String?     // AES-256 encrypted
  tokenExpiresAt    DateTime?
  scopes            String[]
  isConnected       Boolean         @default(true)
  lastSyncedAt      DateTime        @default(now())
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  postLogs          PostLog[]

  @@unique([userId, platform, accountId])
}

model PostLog {
  id                String          @id @default(uuid())
  userId            String
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  videoId           String
  video             Video           @relation(fields: [videoId], references: [id], onDelete: Cascade)
  socialId          String
  social            ConnectedSocial @relation(fields: [socialId], references: [id], onDelete: Cascade)
  platform          PlatformType
  externalPostId    String?
  externalPostUrl   String?
  status            String          // SUCCESS, FAILED, RETRYING
  responsePayload   Json?
  errorMessage      String?
  publishedAt       DateTime        @default(now())

  @@index([userId, platform, publishedAt])
}

model QueueJob {
  id                String          @id @default(uuid())
  userId            String
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  videoId           String?
  video             Video?          @relation(fields: [videoId], references: [id], onDelete: SetNull)
  queueName         String          // "video-render-queue" | "social-dispatch-queue"
  bullJobId         String?
  jobType           String          // "RENDER_COMPOSITING" | "AUDIO_MIX" | "AUTO_DISPATCH"
  status            JobStatus       @default(WAITING)
  progress          Int             @default(0) // 0 - 100%
  attempts          Int             @default(0)
  maxAttempts       Int             @default(3)
  payload           Json
  result            Json?
  errorMessage      String?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@index([status, queueName])
}
`;

export const BULLMQ_WORKER_CODE = `/**
 * BullMQ + Redis Asynchronous Queue Processor Architecture
 * Handles heavy video compositing, audio ducking, and 6-platform API dispatching.
 */

import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// 1. Video Compositing & Audio Mixing Queue
export const videoRenderQueue = new Queue('video-rendering-pipeline', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 500 },
    removeOnFail: { count: 1000 },
  },
});

// 2. Social Media Multi-Platform Dispatch Queue
export const socialDispatchQueue = new Queue('social-distribution-dispatcher', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 5000 },
  },
});

// Video Rendering Worker Implementation
export const videoRenderWorker = new Worker(
  'video-rendering-pipeline',
  async (job: Job) => {
    const { videoId, voiceId, musicTrackUrl, cues, duration } = job.data;
    
    // Step 1: ElevenLabs / OpenAI Audio synthesis
    await job.updateProgress(20);
    const audioTrack = await synthesizeRealisticVoiceover(cues, voiceId);

    // Step 2: Real Music Audio Ducking & SFX Synchronization
    await job.updateProgress(50);
    const mixedAudio = await mixAudioWithDucking({
      voiceTrack: audioTrack,
      backgroundMusic: musicTrackUrl,
      duckingGain: 0.25,
      sfxCues: cues.map(c => c.sfxCue).filter(Boolean),
    });

    // Step 3: FFmpeg / Remotion 9:16 HD Compositing with Dynamic Captions
    await job.updateProgress(80);
    const finalMp4Url = await renderVerticalVideo({
      resolution: '1080x1920',
      fps: 60,
      audioUrl: mixedAudio.url,
      wordCues: cues,
      duration,
    });

    await job.updateProgress(100);
    return { success: true, videoUrl: finalMp4Url };
  },
  { connection: redisConnection, concurrency: 4 }
);

// Multi-Platform Social Dispatcher Worker
export const socialDispatcherWorker = new Worker(
  'social-distribution-dispatcher',
  async (job: Job) => {
    const { videoId, platforms, title, caption, videoUrl } = job.data;
    const results: Record<string, any> = {};

    for (const platform of platforms) {
      switch (platform) {
        case 'INSTAGRAM':
          results.instagram = await publishInstagramReel({ videoUrl, caption });
          break;
        case 'TIKTOK':
          results.tiktok = await publishTikTokVideo({ videoUrl, caption });
          break;
        case 'YOUTUBE':
          results.youtube = await publishYouTubeShort({ videoUrl, title, description: caption });
          break;
        case 'FACEBOOK':
          results.facebook = await publishFacebookPageReel({ videoUrl, caption });
          break;
        case 'TWITTER':
          results.twitter = await publishTwitterXVideo({ videoUrl, tweetText: caption });
          break;
        case 'SNAPCHAT':
          results.snapchat = await publishSnapchatSpotlight({ videoUrl, caption });
          break;
      }
    }

    return { dispatched: true, results };
  },
  { connection: redisConnection, concurrency: 8 }
);
`;
