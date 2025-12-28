
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AIRole, Modality, PipelineStatus, FinalArtifact, Task } from '../../types';
import { OrchestrationEngine } from '../../services/orchestrationEngine';
import { AutonomousMonitor } from './AutonomousMonitor';
import * as gemini from '../../services/geminiService';

export const MultimodalTerminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [modality, setModality] = useState<Modality>(Modality.TEXT);
  const [status, setStatus] = useState<PipelineStatus>(PipelineStatus.IDLE);
  const [activeArtifact, setActiveArtifact] = useState<FinalArtifact | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [vault, setVault] = useState<FinalArtifact[]>([]);
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [voiceOutEnabled, setVoiceOutEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const logRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const addLog = useCallback((m: string) => setLogs(p => [...p, `>> ${m}`].slice(-50)), []);

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + " " + transcript);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = async (text: string) => {
    if (!voiceOutEnabled) return;
    try {
      const base64 = await gemini.generateAudio(text);
      const audio = new Audio(`data:audio/pcm;base64,${base64}`);
      audio.play();
    } catch (e) { addLog("TTS_ERROR: Voice engine offline."); }
  };

  useEffect(() => {
    let mounted = true;
    const runner = async () => {
      while (mounted) {
        if (isAutonomous && status === PipelineStatus.IDLE) {
          const nextTask = tasks.find(t => t.status === 'queued');
          if (nextTask) {
            setTasks(prev => prev.map(t => t.id === nextTask.id ? { ...t, status: 'active' } : t));
            try {
              const art = await OrchestrationEngine.runCommandPipeline(nextTask, setStatus, addLog);
              
              if (art.verificationScore < 100) {
                setTasks(prev => prev.map(t => t.id === nextTask.id ? { ...t, status: 'escalated' } : t));
                addLog(`ESCALATED: ${art.id} - Consensus Threshold Triggered.`);
                if (voiceOutEnabled) speak("Attention. Meta-Brain escalation required.");
              } else {
                setVault(v => [...v, art]);
                addLog(`VAULTED: ${art.id} successfully emitted.`);
                setTasks(prev => prev.map(t => t.id === nextTask.id ? { ...t, status: 'completed' } : t));
              }
              setActiveArtifact(art);
            } catch (e: any) {
              setTasks(prev => prev.map(t => t.id === nextTask.id ? { ...t, status: 'failed' } : t));
              addLog(`PIPELINE_FAILURE: ${nextTask.id} halted.`);
            } finally {
              setStatus(PipelineStatus.IDLE);
            }
          }
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    };
    runner();
    return () => { mounted = false; };
  }, [isAutonomous, tasks, status, addLog, voiceOutEnabled]);

  const queueTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: `MISSION-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      prompt: input,
      modality,
      status: 'queued',
      priority: 1,
      retryCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    setInput('');
    addLog(`INGESTED: ${newTask.id}`);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-160px)] font-mono text-zinc-500 bg-black">
      
      {/* 1. COMMAND PANEL */}
      <div className="col-span-12 lg:col-span-4 flex flex-col space-y-4">
        <div className="bg-[#050505] border border-zinc-900 p-6 flex flex-col flex-1 shadow-2xl relative">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-black uppercase text-zinc-200 tracking-[0.5em]">Layer_0_Human_Command</span>
            <div className="flex space-x-2">
              <button onClick={toggleListening} className={`p-2 border transition-all ${isListening ? 'bg-red-900 border-red-500 text-white' : 'bg-black border-zinc-800 text-zinc-700'}`}>
                {isListening ? 'ON' : 'MIC'}
              </button>
              <button onClick={() => setVoiceOutEnabled(!voiceOutEnabled)} className={`p-2 border transition-all ${voiceOutEnabled ? 'bg-zinc-100 text-black' : 'bg-black border-zinc-800 text-zinc-700'}`}>
                TTS
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
            {Object.values(Modality).map(m => (
              <button 
                key={m}
                onClick={() => setModality(m)}
                className={`px-3 py-1 text-[8px] font-black border transition-all ${modality === m ? 'bg-zinc-200 text-black border-zinc-200' : 'bg-black text-zinc-800 border-zinc-900'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <textarea 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="AWAITING MISSION PARAMETERS..."
            className="flex-1 bg-black border border-zinc-900 p-4 text-[12px] focus:outline-none focus:border-zinc-600 placeholder:text-zinc-900 resize-none text-zinc-400 leading-relaxed"
          />

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#080808] border border-zinc-900">
               <label className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsAutonomous(!isAutonomous)}>
                <div className={`w-10 h-5 border ${isAutonomous ? 'bg-zinc-200 border-white' : 'bg-black border-zinc-900'} relative transition-all`}>
                  <div className={`absolute top-0.5 w-3.5 h-3.5 bg-black transition-all ${isAutonomous ? 'left-5.5' : 'left-0.5'}`}></div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Continuous_Loop</span>
              </label>
              <button onClick={() => { setIsAutonomous(false); setStatus(PipelineStatus.IDLE); }} className="text-[9px] text-red-900 hover:text-red-500 font-black uppercase">Term_All</button>
            </div>
            <button 
              onClick={queueTask} 
              disabled={!input.trim()}
              className="w-full py-5 bg-zinc-100 hover:bg-white text-black font-black text-[12px] uppercase tracking-[0.5em] transition-all disabled:opacity-5"
            >
              Initialize_Meta_Brain
            </button>
          </div>
        </div>

        <div className="h-40 overflow-y-auto p-4 text-[9px] bg-[#020202] border border-zinc-900 no-scrollbar text-zinc-700" ref={logRef}>
          {logs.map((l, i) => <div key={i} className="mb-1 border-b border-zinc-950 pb-1">■ {l}</div>)}
        </div>
      </div>

      {/* 2. SWARM STATUS */}
      <div className="col-span-12 lg:col-span-5 flex flex-col space-y-4">
        <AutonomousMonitor tasks={tasks} vault={vault} activeTask={tasks.find(t => t.status === 'active')} />
        
        <div className="bg-[#050505] border border-zinc-900 p-5 flex-1 overflow-hidden flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-2">
            <h3 className="text-[10px] font-black uppercase text-zinc-200 tracking-[0.5em]">Active_Swarm_Orchestration</h3>
            <span className="text-[9px] text-zinc-800 uppercase font-bold">{status}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
            {tasks.filter(t => t.status !== 'completed').map(task => (
              <div 
                key={task.id} 
                className={`p-4 border transition-all flex justify-between items-center ${task.status === 'active' ? 'border-zinc-200 bg-zinc-900' : task.status === 'escalated' ? 'border-red-900 bg-red-950/20' : 'border-zinc-900 bg-black'}`}
                onClick={() => task.status === 'escalated' && setActiveArtifact(vault.find(v => v.originalInput === task.prompt) || activeArtifact)}
              >
                <div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${task.status === 'escalated' ? 'text-red-500' : 'text-zinc-500'}`}>{task.id}</div>
                  <div className="text-[8px] text-zinc-800 uppercase mt-1">Modality: {task.modality} // State: {task.status}</div>
                </div>
                {task.status === 'escalated' && <span className="text-[8px] text-red-500 font-black animate-pulse">ESC_REQUIRED</span>}
              </div>
            ))}
            {tasks.length === 0 && <div className="h-full flex items-center justify-center opacity-5 text-[12px] uppercase tracking-[1.5em] font-black">Meta_Idle</div>}
          </div>
        </div>
      </div>

      {/* 3. EMISSION FORGE */}
      <div className="col-span-12 lg:col-span-3 bg-black flex flex-col overflow-hidden border border-zinc-900 shadow-2xl">
        <div className="p-4 border-b border-zinc-900 bg-[#080808] flex items-center justify-between">
           <span className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.5em]">Layer_7_Emission</span>
           <button onClick={() => setActiveArtifact(null)} className="text-[10px] text-zinc-100 hover:text-red-900 font-black">PURGE</button>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
          {activeArtifact ? (
            <div className="space-y-8">
              <div className="border-b border-zinc-900 pb-6">
                 <div className="text-[9px] text-zinc-800 font-black uppercase mb-4 tracking-widest">{activeArtifact.emissionSpecs}</div>
                 <div className="text-4xl font-black text-white tracking-tighter uppercase mb-4">{activeArtifact.modality}</div>
                 <div className="text-[9px] text-zinc-500 uppercase font-black">Chain: {activeArtifact.sourceChain.join(' → ')}</div>
              </div>

              <div className="space-y-6">
                {(activeArtifact.modality === Modality.TEXT || activeArtifact.modality === Modality.CODE) && (
                  <div className="text-[11px] text-zinc-600 bg-[#010101] p-4 border border-zinc-900 leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto no-scrollbar font-mono">
                    {activeArtifact.finalOutput}
                  </div>
                )}
                
                {activeArtifact.rejectedAlternatives.length > 0 && (
                  <div className="p-3 bg-red-950/10 border border-red-900/20">
                     <span className="text-[8px] font-black text-red-900 uppercase tracking-widest block mb-2">Rejected_Alternatives: {activeArtifact.rejectedAlternatives.length}</span>
                  </div>
                )}

                <div className="text-[9px] space-y-2 text-zinc-800 border-t border-zinc-900 pt-4">
                  <div><span className="text-zinc-500">Integrity:</span> {activeArtifact.verificationScore}%</div>
                  <div><span className="text-zinc-500">Scope:</span> {activeArtifact.safeUsageScope}</div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                 <button onClick={() => { setVault(v => [...v, activeArtifact]); setActiveArtifact(null); addLog(`AUTHORIZED: Mission ${activeArtifact.id}`); }} className="w-full py-5 bg-zinc-100 text-black font-black text-[12px] uppercase tracking-[0.5em] shadow-xl hover:bg-white transition-all">Authorize_Release</button>
                 {activeArtifact.humanActionRequired && (
                   <div className="text-[8px] text-red-900 bg-red-950/10 p-2 text-center uppercase font-black">{activeArtifact.humanActionRequired}</div>
                 )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-5 space-y-8">
               <div className="w-12 h-12 border border-zinc-900 animate-spin"></div>
               <p className="text-[12px] uppercase tracking-[1em] text-zinc-100 font-black">Awaiting_Forge</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
