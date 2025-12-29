
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Modality, PipelineStatus, FinalArtifact, Task } from '../../types';
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

  const addLog = useCallback((m: string) => setLogs(p => [`> ${new Date().toLocaleTimeString()} :: ${m}`, ...p].slice(0, 150)), []);

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (event: any) => {
        setInput(prev => prev + " " + event.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else { recognitionRef.current?.start(); setIsListening(true); }
  };

  const speak = async (text: string) => {
    if (!voiceOutEnabled) return;
    try {
      const base64 = await gemini.generateAudio(text);
      const audio = new Audio(`data:audio/pcm;base64,${base64}`);
      audio.play();
    } catch (e) { addLog("ERR: HYPER_SONIC_OS_VOID"); }
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
              setVault(v => [art, ...v]);
              setTasks(prev => prev.map(t => t.id === nextTask.id ? { ...t, status: 'completed' } : t));
              setActiveArtifact(art);
              if (voiceOutEnabled) speak("Final Godmode mission complete. 16K artifact synchronized.");
            } catch (e: any) {
              setTasks(prev => prev.map(t => t.id === nextTask.id ? { ...t, status: 'failed' } : t));
              addLog(`ERR: KERNEL_HALT :: ${nextTask.id} :: RETRYING...`);
            } finally { setStatus(PipelineStatus.IDLE); }
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
      id: `HYPER-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      prompt: input, modality, status: 'queued', priority: 1, retryCount: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    setInput('');
    addLog(`GODMODE_INJECT: ${newTask.id} // AGENTS: 5000+ // HDR_16K_SYNC`);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'active': return 'text-[#00FF41]';
      case 'completed': return 'text-cyan-400';
      case 'failed': return 'text-red-500';
      case 'queued': return 'text-purple-500';
      default: return 'text-zinc-500';
    }
  };

  const handleApprove = () => {
    if (activeArtifact) {
        setVault(v => [activeArtifact, ...v]);
        addLog(`GODMODE_LOCK_V5: ${activeArtifact.id} :: VAULT_SECURED`);
        setActiveArtifact(null);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-220px)] font-mono text-[#00FF41] bg-black">
      
      {/* GODMODE COMMAND TERMINAL V5_MAX */}
      <div className="col-span-12 lg:col-span-4 flex flex-col space-y-4 h-full">
        <div className="bg-black border-4 border-[#00FF41] p-8 flex flex-col h-1/2 shadow-[0_0_50px_rgba(0,255,65,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 text-[6px]">Ω_CORE_v5.0_ULTRA_MAX</div>
          <div className="flex justify-between items-center mb-8 border-b-2 border-[#008F11] pb-4">
            <span className="text-[12px] font-black uppercase text-[#00FF41] tracking-[0.8em] terminal-glow glitch-text">HYPER_GODMODE_V5_FINAL</span>
            <div className="flex space-x-3">
               <button onClick={toggleListening} className={`px-3 py-1 text-[10px] border-2 transition-all font-black ${isListening ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_red]' : 'bg-black border-[#00FF41] text-[#00FF41]'}`}>V5_STT</button>
               <button onClick={() => setVoiceOutEnabled(!voiceOutEnabled)} className={`px-3 py-1 text-[10px] border-2 transition-all font-black ${voiceOutEnabled ? 'bg-[#00FF41] text-black shadow-[0_0_20px_#00FF41]' : 'bg-black border-[#008F11] text-[#008F11]'}`}>V5_TTS</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {Object.values(Modality).map(m => (
              <button key={m} onClick={() => setModality(m)} className={`px-3 py-1 text-[8px] font-black border-2 transition-all ${modality === m ? 'bg-[#00FF41] text-black border-[#00FF41] shadow-[0_0_12px_#00FF41]' : 'bg-black text-[#008F11] border-[#008F11] opacity-50 hover:opacity-100'}`}>{m}</button>
            ))}
          </div>

          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="INJECT_GODMODE_MISSION_FINAL_MAX..." className="flex-1 bg-black border-2 border-[#003B00] p-6 text-[14px] focus:outline-none focus:border-[#00FF41] text-[#00FF41] font-black resize-none placeholder:opacity-10 shadow-inner tracking-widest leading-relaxed" />

          <div className="mt-6 flex items-center justify-between">
            <label className="flex items-center space-x-4 cursor-pointer" onClick={() => setIsAutonomous(!isAutonomous)}>
               <div className={`w-12 h-6 border-2 ${isAutonomous ? 'bg-[#00FF41] border-[#00FF41]' : 'bg-black border-[#008F11]'} relative transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-black transition-all ${isAutonomous ? 'left-7' : 'left-0.5'}`}></div>
               </div>
               <span className="text-[10px] font-black tracking-[0.4em] uppercase terminal-glow">INFINITE_EVOLVE_V5</span>
            </label>
            <button onClick={queueTask} className="px-12 py-5 bg-black border-4 border-[#00FF41] hover:bg-[#00FF41] hover:text-black text-[12px] font-black transition-all shadow-[0_0_30px_rgba(0,255,65,0.4)] uppercase tracking-[1em]">EXEC_HYPER</button>
          </div>
        </div>

        <div className="h-1/2 overflow-y-auto p-6 text-[10px] bg-black border-2 border-[#008F11] text-[#00FF41] no-scrollbar shadow-[inset_0_0_30px_rgba(0,0,0,1)] font-mono" ref={logRef}>
          {logs.map((l, i) => (
            <div key={i} className={`mb-2 transition-opacity ${l.includes('ERR') ? 'text-red-500 font-black' : l.includes('SUCCESS') ? 'text-cyan-400 font-black' : 'opacity-60 hover:opacity-100'}`}>
              {l}
            </div>
          ))}
          {logs.length === 0 && <div className="opacity-10 animate-pulse uppercase tracking-[1em] text-center mt-20 font-black text-[14px]">OMEGA_FINAL_IDLE</div>}
        </div>
      </div>

      {/* GODMODE MONITOR V5_MAX */}
      <div className="col-span-12 lg:col-span-5 flex flex-col space-y-4">
        <AutonomousMonitor tasks={tasks} vault={vault} activeTask={tasks.find(t => t.status === 'active')} />
        
        <div className="bg-black border-4 border-[#00FF41] p-8 flex-1 overflow-hidden flex flex-col shadow-2xl relative">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.01)_0px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
          <div className="flex justify-between items-center mb-8 border-b-2 border-[#008F11] pb-4 z-10">
            <h3 className="text-[12px] font-black uppercase text-[#00FF41] tracking-[0.8em] terminal-glow glitch-text">OMEGA_SWARM_V5_LIVE</h3>
            <span className="text-[10px] text-purple-400 animate-pulse font-black uppercase tracking-widest">STATE: {status}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar z-10">
            {tasks.filter(t => t.status !== 'completed').map(task => (
              <div key={task.id} className={`p-5 border-2 transition-all flex justify-between items-center ${task.status === 'active' ? 'border-[#00FF41] bg-[#00FF41]/10 shadow-[0_0_25px_rgba(0,255,65,0.2)]' : 'border-[#003B00] bg-black opacity-40'}`}>
                <div className="flex flex-col">
                  <span className="text-[12px] font-black tracking-[0.4em] uppercase">{task.id}</span>
                  <span className="text-[9px] opacity-60 uppercase mt-1 font-bold">{task.modality} // SWARM_5K+ // FINAL_MAX</span>
                </div>
                <div className="flex items-center space-x-6">
                   <span className={`text-[10px] font-black uppercase tracking-widest ${getStatusColor(task.status)}`}>{task.status}</span>
                   {task.status === 'active' && <div className="w-3 h-3 bg-[#00FF41] rounded-full animate-ping shadow-[0_0_15px_#00FF41]"></div>}
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-8">
                <span className="text-[14px] uppercase tracking-[2.5em] font-black">HYPER_STBY</span>
                <div className="w-48 h-[2px] bg-[#00FF41] animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FINAL OMEGA EMISSION V5_MAX */}
      <div className="col-span-12 lg:col-span-3 bg-black border-4 border-[#00FF41] flex flex-col overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)] relative">
        <div className="p-6 border-b-2 border-[#00FF41] bg-black flex items-center justify-between z-10">
           <span className="text-[12px] font-black uppercase text-[#00FF41] tracking-[0.8em] terminal-glow">GODMODE_EMISSION_V5</span>
           <button onClick={() => setActiveArtifact(null)} className="text-[10px] text-red-500 border-2 border-red-900/50 px-4 py-1.5 hover:bg-red-950/30 font-black tracking-widest">PURGE_V5</button>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto no-scrollbar relative z-10 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.05),transparent)]">
          {activeArtifact ? (
            <div className="space-y-10 animate-in zoom-in-95 duration-700">
              <div className="border-b-2 border-[#003B00] pb-8">
                 <div className="text-[10px] text-[#008F11] mb-3 font-black tracking-[0.4em] uppercase">OMEGA_SPECS: {activeArtifact.emissionSpecs} // LOAD: {activeArtifact.resourceUsage}%</div>
                 <div className="text-6xl font-black text-[#00FF41] terminal-glow tracking-tighter mb-6 uppercase glitch-text">{activeArtifact.modality}</div>
                 <div className="flex flex-wrap gap-3">
                    <div className="text-[11px] bg-[#003B00] text-[#00FF41] px-4 py-1.5 border-2 border-[#00FF41]/40 font-black tracking-widest uppercase shadow-[0_0_10px_rgba(0,255,65,0.2)]">INTEGRITY: {activeArtifact.verificationScore}%</div>
                    <div className="text-[11px] bg-purple-900/30 text-purple-400 px-4 py-1.5 border-2 border-purple-400/40 font-black tracking-widest uppercase">GODMODE_FINAL</div>
                    <div className="text-[11px] bg-cyan-900/30 text-cyan-400 px-4 py-1.5 border-2 border-cyan-400/40 font-black tracking-widest uppercase">HDR_16K_MAX</div>
                 </div>
              </div>

              <div className="space-y-8">
                {(activeArtifact.modality === Modality.TEXT || activeArtifact.modality === Modality.CODE) && (
                  <div className="text-[13px] text-[#00FF41] bg-black p-6 border-2 border-[#008F11] leading-relaxed whitespace-pre-wrap max-h-[450px] overflow-y-auto no-scrollbar font-mono shadow-[inset_0_0_30px_rgba(0,255,65,0.1)] tracking-wider">
                    {activeArtifact.finalOutput}
                  </div>
                )}
                {activeArtifact.modality === Modality.IMAGE && (
                  <div className="relative group overflow-hidden border-2 border-[#003B00] shadow-[0_0_50px_rgba(0,255,65,0.2)]">
                    <img src={activeArtifact.finalOutput} alt="Godmode Artifact" className="w-full h-auto brightness-95 hover:brightness-110 transition-all duration-1000 scale-100 group-hover:scale-105" />
                    <div className="absolute inset-0 border-4 border-[#00FF41] opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none"></div>
                    <div className="absolute top-4 left-4 text-[10px] bg-black/95 px-3 py-1.5 border-2 border-[#00FF41] font-black shadow-[0_0_15px_#00FF41] tracking-widest uppercase">16K_HDR_ULTRA_FINAL</div>
                  </div>
                )}
                {activeArtifact.modality === Modality.VIDEO && <video src={activeArtifact.finalOutput} controls className="w-full h-auto border-4 border-[#003B00] shadow-[0_0_60px_rgba(0,0,0,1)]" />}
                {[Modality.THREE_D, Modality.AR, Modality.VR, Modality.HOLO, Modality.HOLO_META, Modality.HYPER].includes(activeArtifact.modality) && (
                   <div className="aspect-square bg-black border-4 border-[#00FF41] flex flex-col items-center justify-center space-y-10 relative overflow-hidden group shadow-[inset_0_0_40px_rgba(0,255,65,0.2)]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.2),transparent)] animate-[pulse_3s_infinite]"></div>
                      <div className="relative">
                        <div className="w-28 h-28 border-4 border-purple-500 border-t-transparent animate-[spin_1.5s_linear_infinite] rounded-full"></div>
                        <div className="absolute inset-2 border-4 border-cyan-400 border-b-transparent animate-[spin_0.8s_linear_infinite_reverse] rounded-full"></div>
                        <div className="absolute inset-6 border-2 border-white opacity-20 animate-pulse rounded-full"></div>
                      </div>
                      <div className="text-center z-10">
                        <span className="text-[14px] font-black text-white terminal-glow tracking-[0.6em] block mb-3 uppercase glitch-text">{activeArtifact.modality}_FINAL_MAX</span>
                        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.4em] animate-pulse">RENDERING_META_DIMENSIONS...</span>
                      </div>
                      <button className="px-10 py-4 border-4 border-white text-white text-[12px] hover:bg-white hover:text-black transition-all font-black uppercase tracking-[0.5em] z-10 shadow-[0_0_30px_white]">LAUNCH_HOLO_RENDER</button>
                   </div>
                )}
              </div>

              <div className="pt-8 space-y-4">
                <button onClick={handleApprove} className="w-full py-8 bg-[#00FF41] text-black font-black text-[16px] uppercase tracking-[1.2em] hover:bg-white transition-all shadow-[0_0_50px_rgba(0,255,65,0.7)] active:scale-95">COMMIT_GODMODE_V5</button>
                <div className="flex justify-between items-center text-[10px] opacity-40 font-black tracking-[0.5em] text-[#00FF41]">
                   <span>HASH: 0x{activeArtifact.hash}</span>
                   <span>Ω_VER: 5.0.FINAL</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-12">
               <div className="relative">
                  <div className="w-32 h-32 border-4 border-[#00FF41] rotate-45 animate-[pulse_2s_infinite] shadow-[0_0_30px_#00FF41]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-16 h-16 border-4 border-cyan-400 -rotate-45 animate-[spin_3s_linear_infinite] rounded-full"></div>
                  </div>
               </div>
               <p className="text-[14px] tracking-[2.5em] font-black text-center terminal-glow glitch-text">GODMODE_STBY</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
