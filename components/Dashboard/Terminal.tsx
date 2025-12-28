
import React, { useState, useEffect, useRef } from 'react';
import { AIRole, PipelineStatus, AIMessage, FinalArtifact, Modality } from '../../types';
import { OrchestrationEngine } from '../../services/orchestrationEngine';

export const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<PipelineStatus>(PipelineStatus.IDLE);
  const [outputs, setOutputs] = useState<AIMessage[]>([]);
  const [artifact, setArtifact] = useState<FinalArtifact | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, outputs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const executePipeline = async () => {
    if (!input.trim()) return;
    
    setArtifact(null);
    setOutputs([]);
    setLogs([]);
    addLog(`INITIATING ORCHESTRATION PIPELINE...`);
    // Fix: Using PipelineStatus.CONTROLLING instead of non-existent ROUTING
    setStatus(PipelineStatus.CONTROLLING);

    try {
      // 1. FEEDER
      addLog(`PHASE 1: FEEDER AI - Normalizing Input...`);
      // Fix: Using AIRole.META_BRAIN_CONTROLLER instead of non-existent SENTINEL_ROUTER
      const feederOut = await OrchestrationEngine.executeStep(AIRole.META_BRAIN_CONTROLLER, Modality.TEXT, input);
      setOutputs(prev => [...prev, feederOut]);
      if (feederOut.status === 'failure') throw new Error("HALT: FEEDER REJECTION");

      // 2. STRATEGY (Corrected from PLANNER)
      // Fix: Using PipelineStatus.SWARMING instead of non-existent GENERATING
      setStatus(PipelineStatus.SWARMING);
      addLog(`PHASE 2: STRATEGY AI - Generating Logic...`);
      // Fix: Using AIRole.SWARM_GENERATOR instead of non-existent PRIMARY_GENERATOR
      const analyzerOut = await OrchestrationEngine.executeStep(AIRole.SWARM_GENERATOR, Modality.TEXT, feederOut.content);
      setOutputs(prev => [...prev, analyzerOut]);
      if (analyzerOut.status === 'failure') throw new Error("HALT: STRATEGY UNCERTAINTY");

      // 3. ADVERSARIAL CRITIC (Corrected from CRITIC)
      // Fix: Using PipelineStatus.DEBATING instead of ADVERSARIAL_CONFLICT
      setStatus(PipelineStatus.DEBATING);
      addLog(`PHASE 3: ADVERSARIAL CRITIC AI - Assessing Logic Integrity...`);
      // Fix: Using AIRole.DEBATE_ENGINE_A instead of non-existent ADVERSARIAL_AUDITOR
      const criticOut = await OrchestrationEngine.executeStep(AIRole.DEBATE_ENGINE_A, Modality.TEXT, analyzerOut.content, feederOut.content);
      setOutputs(prev => [...prev, criticOut]);

      // 4. SABOTEUR
      // Fix: Using PipelineStatus.DEBATING instead of ADVERSARIAL_CONFLICT
      setStatus(PipelineStatus.DEBATING);
      addLog(`PHASE 4: SABOTEUR AI - Initiating Stress Test...`);
      // Fix: Using AIRole.DEBATE_ENGINE_B instead of non-existent ADVERSARIAL_AUDITOR
      const saboteurOut = await OrchestrationEngine.executeStep(AIRole.DEBATE_ENGINE_B, Modality.TEXT, analyzerOut.content, criticOut.content);
      setOutputs(prev => [...prev, saboteurOut]);
      if (saboteurOut.status === 'failure') throw new Error("HALT: CRITICAL VULNERABILITY DETECTED");

      // 5. VERIFICATION ENGINE (Corrected from VERIFIER)
      // Fix: Using PipelineStatus.AUDITING instead of non-existent VERIFYING
      setStatus(PipelineStatus.AUDITING);
      addLog(`PHASE 5: VERIFICATION ENGINE AI - Formal Synthesis...`);
      // Fix: Using AIRole.ERROR_INTELLIGENCE_AUDIT instead of non-existent PEER_VERIFIER
      const verifierOut = await OrchestrationEngine.executeStep(AIRole.ERROR_INTELLIGENCE_AUDIT, Modality.TEXT, analyzerOut.content, `${criticOut.content}\n${saboteurOut.content}`);
      setOutputs(prev => [...prev, verifierOut]);
      if (verifierOut.status === 'failure') throw new Error("HALT: VERIFICATION FAILURE");

      // SUCCESS
      addLog(`PIPELINE EXECUTION SUCCESSFUL. AWAITING HUMAN SIGN-OFF.`);
      // Match score format
      const match = verifierOut.content.match(/(\d+)\/100/);
      const confidence = match ? parseInt(match[1]) : 0;
      
      // Fix: Passing correct arguments to generateFinalArtifact (Modality, input, content, logs, score, retries, rejectedAlternatives)
      const finalArt = OrchestrationEngine.generateFinalArtifact(
        Modality.TEXT, 
        input, 
        verifierOut.content, 
        logs, 
        confidence, 
        0,
        []
      );
      setArtifact(finalArt);
      // Fix: Using PipelineStatus.EMITTING instead of non-existent AWAITING_APPROVAL
      setStatus(PipelineStatus.EMITTING);

    } catch (err: any) {
      addLog(`FATAL ERROR: ${err.message}`);
      setStatus(PipelineStatus.HALTED);
    }
  };

  const handleTerminate = () => {
    setStatus(PipelineStatus.IDLE);
    setOutputs([]);
    setArtifact(null);
    addLog("SYSTEM_TERMINATED: Manual override active.");
  };

  const handleApprove = () => {
    setStatus(PipelineStatus.COMPLETED);
    addLog("ARTIFACT_APPROVED: Permanent record locked.");
  };

  const handleReject = () => {
    // Status is now added to types.ts
    setStatus(PipelineStatus.REJECTED);
    addLog("ARTIFACT_REJECTED: Purging cache.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-160px)]">
      {/* Left: Input & Control */}
      <div className="lg:col-span-4 flex flex-col space-y-4">
        <div className="glass p-4 rounded flex-1 flex flex-col">
          <h3 className="mono text-xs text-zinc-500 mb-2 uppercase">Input Console</h3>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status !== PipelineStatus.IDLE && status !== PipelineStatus.HALTED && status !== PipelineStatus.REJECTED}
            className="flex-1 bg-black/40 border border-zinc-800 rounded p-4 text-sm mono focus:outline-none focus:border-green-500 resize-none placeholder:text-zinc-700"
            placeholder="ENTER MISSION PARAMETERS OR RAW LOGIC..."
          />
          <div className="mt-4 flex space-x-2">
            <button 
              onClick={executePipeline}
              disabled={status !== PipelineStatus.IDLE && status !== PipelineStatus.HALTED && status !== PipelineStatus.REJECTED}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-zinc-800 disabled:text-zinc-600 font-bold uppercase text-xs tracking-tighter transition-all"
            >
              RUN PIPELINE
            </button>
            <button 
              onClick={handleTerminate}
              className="px-4 bg-red-900/40 hover:bg-red-800 border border-red-500/50 text-red-500 font-bold text-xs"
            >
              TERM
            </button>
          </div>
        </div>

        <div className="glass p-4 rounded h-48 overflow-y-auto mono text-[10px] leading-relaxed text-zinc-500" ref={scrollRef}>
          {logs.map((log, i) => (
            <div key={i} className={log.includes('ERROR') ? 'text-red-400' : log.includes('SUCCESS') ? 'text-green-400' : ''}>
              {log}
            </div>
          ))}
          {logs.length === 0 && <span className="opacity-30">SYSTEM_IDLE... WAITING FOR INPUT...</span>}
        </div>
      </div>

      {/* Middle: Live Debate/Verification */}
      <div className="lg:col-span-5 flex flex-col space-y-4 overflow-hidden">
        <div className="glass p-4 rounded flex-1 overflow-y-auto space-y-4">
          <h3 className="mono text-xs text-zinc-500 mb-2 uppercase">AI Orchestration Flow</h3>
          {outputs.map((out, idx) => (
            <div key={idx} className={`p-4 rounded border ${out.status === 'failure' ? 'border-red-900 bg-red-900/10' : out.status === 'warning' ? 'border-yellow-900 bg-yellow-900/10' : 'border-zinc-800 bg-zinc-900/30'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${out.status === 'failure' ? 'bg-red-500 text-white' : out.status === 'warning' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-black'}`}>
                  {out.role}
                </span>
                <span className="text-[10px] opacity-40">{new Date(out.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap mono opacity-80">
                {out.content}
              </div>
            </div>
          ))}
          {/* Fix: Using PipelineStatus.EMITTING instead of non-existent AWAITING_APPROVAL */}
          {status !== PipelineStatus.IDLE && status !== PipelineStatus.EMITTING && status !== PipelineStatus.HALTED && (
            <div className="p-4 rounded border border-zinc-800 animate-pulse flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <span className="mono text-xs uppercase opacity-50">Orchestrating {status}...</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Final Artifact & Verification */}
      <div className="lg:col-span-3 flex flex-col space-y-4">
        <div className="glass p-4 rounded flex-1 overflow-y-auto">
          <h3 className="mono text-xs text-zinc-500 mb-4 uppercase">Governance Artifact</h3>
          
          {artifact ? (
            <div className="space-y-6">
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                <div className="text-[10px] text-green-500 font-bold uppercase mb-1">Confidence Score</div>
                <div className="text-2xl font-black text-green-400">{artifact.verificationScore}/100</div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Safe Usage Scope</h4>
                <p className="text-xs text-zinc-300 bg-black/40 p-2 border border-zinc-800 rounded">{artifact.safeUsageScope}</p>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Known Limitations</h4>
                <ul className="text-[10px] text-zinc-400 list-disc pl-4 space-y-1">
                  {artifact.limitations.map((limit, i) => <li key={i}>{limit}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Verification Result</h4>
                <div className="text-[10px] text-zinc-400 italic bg-black/40 p-2 border border-zinc-800 rounded">
                  {artifact.emissionSpecs}
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button 
                  onClick={handleApprove}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 font-bold uppercase text-xs rounded transition-all"
                >
                  APPROVE & LOCK
                </button>
                <button 
                  onClick={handleReject}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 font-bold uppercase text-xs rounded transition-all"
                >
                  REJECT
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-20 mono text-center space-y-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0a11.955 11.955 0 00-11.72 1.62c-.176.124-.372.232-.58.324a11.955 11.955 0 00-11.72-1.62m17.236 0v14.197a11.955 11.955 0 01-8.618 3.04A11.955 11.955 0 013 19.141V4.983" />
              </svg>
              <p className="text-[10px] uppercase">Waiting for Verification</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
