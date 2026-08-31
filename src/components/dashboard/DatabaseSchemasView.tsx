import React, { useState } from 'react';
import { Database, Server, Cpu, ShieldCheck, Code, Layers, Zap, Copy, Check } from 'lucide-react';
import { PRISMA_SCHEMA, BULLMQ_WORKER_CODE } from '../../../server/databaseSchemas';
import { audioMixer } from '../../utils/audioSynthesizer';

export const DatabaseSchemasView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'prisma' | 'queues' | 'migrations'>('prisma');
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    audioMixer.playSFX('ding');
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
              <Database className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold text-white">Database & Queue Architecture</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production-grade PostgreSQL (Prisma ORM), BullMQ Redis Queue, and AES-256 Token Vault.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1">
          <button
            onClick={() => setActiveSubTab('prisma')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              activeSubTab === 'prisma' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Prisma Schema
          </button>
          <button
            onClick={() => setActiveSubTab('queues')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              activeSubTab === 'queues' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BullMQ Queue Topology
          </button>
        </div>
      </div>

      {/* Schema or Queue View */}
      {activeSubTab === 'prisma' ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-xs text-slate-300">prisma/schema.prisma</span>
            </div>
            <button
              onClick={() => handleCopy(PRISMA_SCHEMA)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800"
            >
              {hasCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Schema</span>
                </>
              )}
            </button>
          </div>

          <pre className="rounded-xl border border-slate-900 bg-slate-900/60 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed">
            {PRISMA_SCHEMA}
          </pre>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-purple-400" />
              <span className="font-mono text-xs text-slate-300">BullMQ & Redis Queue Topology</span>
            </div>
          </div>

          <pre className="rounded-xl border border-slate-900 bg-slate-900/60 p-4 font-mono text-xs text-cyan-300 overflow-x-auto max-h-[500px] leading-relaxed">
            {BULLMQ_WORKER_CODE}
          </pre>
        </div>
      )}

    </div>
  );
};
