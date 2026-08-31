import React, { useState } from 'react';
import { AgentPipelineStep } from '../../types';
import { Bot, Sparkles, CheckCircle2, RefreshCw, Cpu, Activity, Play, Zap, ArrowRight, Gauge, Check, ShieldCheck, Layers, Award } from 'lucide-react';
import { audioMixer } from '../../utils/audioSynthesizer';

interface AIAgentsCenterProps {
  agents: AgentPipelineStep[];
  onTriggerAgentPipeline: () => void;
  isExecuting: boolean;
}

// Helper to format camelCase keys into human readable title
function formatKeyLabel(key: string): string {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export const AIAgentsCenter: React.FC<AIAgentsCenterProps> = ({
  agents,
  onTriggerAgentPipeline,
  isExecuting,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'agent_1');

  const activeAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Bot className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold text-white">6-Agent Autonomous Workflow Pipeline</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Orchestrated multi-agent architecture executing niche analysis, scripting, voiceover, ducking, 9:16 compositing, and dispatch.
          </p>
        </div>

        <button
          id="run-full-agent-pipeline-btn"
          disabled={isExecuting}
          onClick={() => {
            audioMixer.playSFX('ding');
            onTriggerAgentPipeline();
          }}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all active:scale-95 ${
            isExecuting
              ? 'bg-emerald-600 animate-pulse'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 shadow-emerald-600/20'
          }`}
        >
          {isExecuting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
              <span>Pipeline Running...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 text-amber-300" />
              <span>Test Full Multi-Agent Pipeline</span>
            </>
          )}
        </button>
      </div>

      {/* Agents Flow Grid (6 Agents in sequence) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, index) => {
          const isSelected = agent.id === activeAgent?.id;
          return (
            <div
              key={agent.id}
              onClick={() => {
                audioMixer.playSFX('pop');
                setSelectedAgentId(agent.id);
              }}
              className={`cursor-pointer rounded-2xl border p-5 transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Top Row: Number & Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-mono font-bold text-slate-300">
                    0{index + 1}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                    {agent.model}
                  </span>
                </div>

                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono ${
                  agent.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : agent.status === 'processing'
                    ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {agent.status}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-white mb-1">{agent.name}</h3>
              <p className="text-xs text-slate-400 leading-snug line-clamp-2 mb-4">
                {agent.description}
              </p>

              {/* Metrics */}
              <div className="flex items-center justify-between text-[11px] font-mono pt-3 border-t border-slate-800/80 text-slate-400">
                <span>Execution Speed</span>
                <span className="text-cyan-400 font-semibold">{agent.latencyMs} ms</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Human-Friendly Agent Activity & Configuration Panel */}
      {activeAgent && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-5">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{activeAgent.name}</h3>
                <p className="text-xs text-slate-400">{activeAgent.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Active Model: {activeAgent.model}
              </span>
              <span className="rounded-lg border border-slate-800 bg-slate-850 px-2.5 py-1 font-mono text-xs text-cyan-300">
                {activeAgent.latencyMs}ms Latency
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-850">
            {activeAgent.description}
          </p>

          {/* Formatted Structured Parameters (No raw JSON) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Agent Output & Synthesis Parameters
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                Verified Autonomous Execution
              </span>
            </div>

            {activeAgent.outputPayload && typeof activeAgent.outputPayload === 'object' ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(activeAgent.outputPayload).map(([key, val]) => {
                  const isConfidence = key.toLowerCase().includes('confidence') || typeof val === 'number';
                  const isArray = Array.isArray(val);

                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
                    >
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                        {formatKeyLabel(key)}
                      </span>

                      {isArray ? (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(val as string[]).map((item, idx) => (
                            <span
                              key={idx}
                              className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : isConfidence && typeof val === 'number' ? (
                        <div className="space-y-1.5 mt-1">
                          <div className="flex items-center justify-between text-xs font-bold text-white">
                            <span>Confidence Score</span>
                            <span className="text-emerald-400">{Math.round(val * 100)}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                              style={{ width: `${Math.round(val * 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-semibold text-white mt-1 break-words">
                          {String(val)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400">
                Agent execution completed. No pending parameters.
              </div>
            )}
          </div>

          {/* Execution Pipeline Roadmap Steps */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              Autonomous Step Verifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 p-2.5 text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Prompt Verification & Safety Filter</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 p-2.5 text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>High-Speed Inference Output</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 p-2.5 text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Auto-Chained to Next Stage</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
