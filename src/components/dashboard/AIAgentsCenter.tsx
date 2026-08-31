import React, { useState } from 'react';
import { AgentPipelineStep } from '../../types';
import { Bot, Sparkles, CheckCircle2, RefreshCw, Cpu, Activity, Play, Zap, ArrowRight } from 'lucide-react';
import { audioMixer } from '../../utils/audioSynthesizer';

interface AIAgentsCenterProps {
  agents: AgentPipelineStep[];
  onTriggerAgentPipeline: () => void;
  isExecuting: boolean;
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
                <span>Latency</span>
                <span className="text-cyan-400">{agent.latencyMs} ms</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Inspection Panel for Selected Agent */}
      {activeAgent && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Agent Detail: {activeAgent.name}</h3>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 font-mono text-xs text-emerald-400">
              {activeAgent.model}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{activeAgent.description}</p>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Live Agent Output Payload Stream:
            </span>
            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
              {JSON.stringify(activeAgent.outputPayload, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
