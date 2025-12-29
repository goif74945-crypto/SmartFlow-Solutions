
import React, { useMemo } from 'react';
import { Task, FinalArtifact } from '../../types';

interface AutonomousMonitorProps {
  tasks: Task[];
  vault: FinalArtifact[];
  activeTask?: Task | null;
}

export const AutonomousMonitor: React.FC<AutonomousMonitorProps> = ({ tasks, vault, activeTask }) => {
  const stats = useMemo(() => {
    const totalV = vault.length;
    return {
      total: totalV,
      highIntegrity: vault.filter(v => v.verificationScore >= 100).length,
      globalConsensus: totalV > 0 ? '100.0%' : 'N/A',
      evolutionIndex: totalV > 0 ? `${(totalV * 8.5).toFixed(1)}` : '0.0', // Ultra evolution factor for V5_FINAL
      load: activeTask ? Math.floor(Math.random() * 2) + 98 : 0.4,
      agents: activeTask ? 5120 : 0 
    };
  }, [vault, activeTask]);

  return (
    <div className="flex flex-col space-y-4 font-mono">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-black border-2 border-[#00FF41] p-5 shadow-[inset_0_0_25px_rgba(0,255,65,0.1)] group relative overflow-hidden transition-all hover:border-cyan-400">
          <div className="text-[9px] text-[#00FF41] uppercase mb-3 font-black tracking-[0.6em] opacity-80 group-hover:text-cyan-400">VAULT_OMEGA_V5</div>
          <div className="text-4xl font-black text-[#00FF41] terminal-glow group-hover:text-cyan-400 transition-colors">{stats.total.toString().padStart(6, '0')}</div>
          <div className="absolute bottom-0 left-0 h-[3px] bg-cyan-400 w-0 group-hover:w-full transition-all duration-700"></div>
        </div>
        <div className="bg-black border-2 border-[#00FF41] p-5 shadow-[inset_0_0_25px_rgba(0,255,65,0.1)] group relative overflow-hidden transition-all hover:border-purple-500">
          <div className="text-[9px] text-[#00FF41] uppercase mb-3 font-black tracking-[0.6em] opacity-80 group-hover:text-purple-500">GODMODE_LOCKS</div>
          <div className="text-4xl font-black text-[#00FF41] terminal-glow group-hover:text-purple-500 transition-colors">{stats.highIntegrity.toString().padStart(6, '0')}</div>
          <div className="absolute top-0 right-0 p-2 opacity-30"><div className="w-3 h-3 bg-purple-500 rounded-full animate-ping"></div></div>
        </div>
        <div className="bg-black border-2 border-[#00FF41] p-5 shadow-[inset_0_0_25px_rgba(0,255,65,0.1)] group relative overflow-hidden">
          <div className="text-[9px] text-[#00FF41] uppercase mb-3 font-black tracking-[0.6em] opacity-80">OMNI_LOAD</div>
          <div className="text-4xl font-black text-[#00FF41] terminal-glow">{stats.load}%</div>
          <div className="w-full h-2 bg-zinc-900 mt-4 overflow-hidden border-2 border-[#008F11] relative">
             <div className="h-full bg-[#00FF41] transition-all duration-300 shadow-[0_0_15px_#00FF41]" style={{width: `${stats.load}%`}}></div>
             <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[loading_2s_linear_infinite]"></div>
          </div>
        </div>
        <div className="bg-black border-2 border-[#00FF41] p-5 shadow-[inset_0_0_25px_rgba(0,255,65,0.1)] group relative overflow-hidden">
          <div className="text-[9px] text-[#00FF41] uppercase mb-3 font-black tracking-[0.6em] opacity-80">SWARM_NODES</div>
          <div className="text-4xl font-black text-[#00FF41] terminal-glow">{stats.agents}</div>
          <div className="text-[9px] text-cyan-400 mt-3 tracking-[0.3em] uppercase font-black animate-pulse">SWARM_V5_FINAL_STABLE</div>
        </div>
      </div>

      <div className="bg-black border-4 border-[#00FF41] p-8 h-44 flex flex-col overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,1)] relative">
        <div className="absolute top-0 right-0 p-6 opacity-60">
           <div className="w-16 h-16 border-4 border-purple-500 animate-[spin_4s_linear_infinite] border-t-transparent rounded-full flex items-center justify-center shadow-[0_0_20px_purple]">
              <div className="w-10 h-10 border-4 border-cyan-400 animate-[spin_2s_linear_infinite_reverse] border-b-transparent rounded-full shadow-[0_0_15px_cyan]"></div>
           </div>
        </div>
        <h3 className="text-[11px] text-[#00FF41] uppercase tracking-[0.8em] mb-6 flex justify-between border-b-2 border-[#00FF41]/30 pb-4 font-black terminal-glow glitch-text">
          <span>OMNISCOPE_V5_FINAL_STREAM</span>
          <span className="opacity-80 text-cyan-400">EVOLVE_INDEX: {stats.evolutionIndex}</span>
        </h3>
        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
          {activeTask ? (
            <div className="p-5 bg-[#00FF41]/15 border-2 border-[#00FF41] flex flex-col space-y-4 border-l-8 border-l-purple-500 animate-in slide-in-from-left duration-700 shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-black text-[#00FF41] uppercase tracking-[0.6em] terminal-glow">EXECUTING_GODMODE_V5 :: {activeTask.id}</span>
                   <span className="text-[10px] text-black bg-[#00FF41] px-4 py-1.5 font-black uppercase tracking-widest shadow-[0_0_20px_#00FF41]">{activeTask.modality}</span>
                </div>
                <div className="flex items-center space-x-6">
                   <div className="flex-1 h-1.5 bg-zinc-900 overflow-hidden border-2 border-[#008F11] relative">
                      <div className="h-full bg-cyan-400 animate-[pulse_0.5s_infinite] w-full shadow-[0_0_15px_cyan]"></div>
                   </div>
                   <span className="text-[9px] text-cyan-400 uppercase font-black tracking-widest animate-pulse">SYNCHRONIZING_OMNI_DIMENSIONS...</span>
                </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center opacity-20 text-[14px] uppercase tracking-[3em] font-black text-[#00FF41] terminal-glow">
                OMEGA_IDLE
                <div className="mt-6 text-[10px] tracking-[1em] text-cyan-400 opacity-80 uppercase">AWAITING_GODMODE_V5_FINAL_MAX_MISSION...</div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
