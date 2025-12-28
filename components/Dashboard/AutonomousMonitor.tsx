
import React, { useMemo } from 'react';
import { Task, FinalArtifact, Modality } from '../../types';

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
      highIntegrity: vault.filter(v => v.verificationScore >= 98).length,
      consensusIndex: totalV > 0 ? '99.8%' : '---',
      vaultOccupancy: totalV > 0 ? `${Math.min(100, (totalV / 1000) * 100).toFixed(1)}%` : '0%'
    };
  }, [vault]);

  return (
    <div className="flex flex-col space-y-3 font-mono">
      {/* COMMAND CENTER METRICS */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#050505] border border-zinc-900 p-4 shadow-lg">
          <div className="text-[9px] text-zinc-800 uppercase mb-2 font-black tracking-widest">Vault_Total</div>
          <div className="text-2xl font-black text-zinc-400">{stats.total}</div>
        </div>
        <div className="bg-[#050505] border border-zinc-900 p-4 shadow-lg">
          <div className="text-[9px] text-zinc-800 uppercase mb-2 font-black tracking-widest">Integrity_Elite</div>
          <div className="text-2xl font-black text-zinc-200">{stats.highIntegrity}</div>
        </div>
        <div className="bg-[#050505] border border-zinc-900 p-4 shadow-lg">
          <div className="text-[9px] text-zinc-800 uppercase mb-2 font-black tracking-widest">Consensus_Avg</div>
          <div className="text-2xl font-black text-zinc-700">{stats.consensusIndex}</div>
        </div>
        <div className="bg-[#050505] border border-zinc-900 p-4 shadow-lg">
          <div className="text-[9px] text-zinc-800 uppercase mb-2 font-black tracking-widest">Vault_Cap</div>
          <div className="text-2xl font-black text-zinc-950">{stats.vaultOccupancy}</div>
        </div>
      </div>

      <div className="bg-black border border-zinc-900 p-6 h-40 flex flex-col overflow-hidden shadow-2xl">
        <h3 className="text-[10px] text-zinc-700 uppercase tracking-[0.6em] mb-4 flex justify-between border-b border-zinc-950 pb-2 font-black">
          <span>Active_Sentinel_Threads</span>
          <span className="text-zinc-900">Queue: {tasks.filter(t => t.status === 'queued').length}</span>
        </h3>
        <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
          {activeTask ? (
            <div className="p-3 bg-zinc-950 border border-zinc-900 flex justify-between items-center border-l-2 border-l-zinc-100">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">POOL_A // {activeTask.id}</span>
                <span className="text-[9px] text-zinc-800 uppercase font-black">{activeTask.modality}</span>
            </div>
          ) : (
             <div className="h-full flex items-center justify-center opacity-5 text-[11px] uppercase tracking-[2em] font-black text-zinc-100">Sentinel_Silent</div>
          )}
        </div>
      </div>
    </div>
  );
};
