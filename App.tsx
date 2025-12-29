
import React, { useState, useEffect } from 'react';
import { AuthLayer } from './types';
import { AuthManager } from './components/Auth/AuthManager';
import { MultimodalTerminal } from './components/Dashboard/MultimodalTerminal';

const App: React.FC = () => {
  const [authLayer, setAuthLayer] = useState<AuthLayer>(AuthLayer.LOGIN);
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const isAuthorized = authLayer === AuthLayer.AUTHORIZED;

  useEffect(() => {
    const checkKey = async () => {
      try {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      } catch (e) { console.debug('OMEGA_FINAL_Bridge_Syncing...'); }
    };
    if (isAuthorized) checkKey();
  }, [isAuthorized]);

  const handleOpenKey = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setApiKeySelected(true);
    } catch (e) { console.error('OMEGA_FINAL_Bridge_Failure'); }
  };

  return (
    <div className="min-h-screen bg-black text-[#00FF41] flex flex-col font-mono selection:bg-[#00FF41] selection:text-black overflow-hidden uppercase">
      <header className="border-b-4 border-[#00FF41] p-10 bg-black sticky top-0 z-50 shadow-[0_0_60px_rgba(0,255,65,0.4)]">
        <div className="max-w-[2000px] mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-12">
            <div className="w-20 h-20 border-4 border-[#00FF41] flex items-center justify-center text-[#00FF41] font-black text-4xl shadow-[0_0_50px_rgba(0,255,65,0.7)] animate-pulse relative group cursor-crosshair">
               <div className="absolute -inset-3 border-2 border-cyan-400 opacity-20 group-hover:opacity-100 transition-opacity animate-pulse"></div>
               <div className="absolute -inset-6 border border-purple-500 opacity-10 group-hover:opacity-50 transition-opacity"></div>
               <span className="absolute -top-4 -right-4 text-[12px] bg-[#00FF41] text-black px-3 py-1 font-black shadow-[0_0_15px_#00FF41] uppercase tracking-widest">FINAL_MAX</span>
               HΩ
            </div>
            <div>
              <h1 className="text-[26px] font-black tracking-[1.5em] uppercase leading-none mb-2 text-[#00FF41] terminal-glow glitch-text">AEGIS_HYPER_GODMODE_V5</h1>
              <div className="flex items-center space-x-6">
                <span className="w-10 h-0.5 bg-[#00FF41] shadow-[0_0_10px_#00FF41]"></span>
                <p className="text-[12px] text-cyan-400 tracking-[1em] font-black uppercase animate-pulse">SYSTEM_STATE: GODMODE_V5_FINAL_MAX_OMEGA</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-20">
            <div className="hidden 2xl:flex flex-col items-end opacity-90">
              <span className="text-[12px] text-[#00FF41] uppercase font-black tracking-[0.6em] terminal-glow">KERN: HYPER_GODMODE_v5.0.FINAL</span>
              <span className="text-[13px] font-black text-purple-400 uppercase tracking-[0.8em] mt-2">CROSS_DIMENSION_AUTHORIZED_GODMODE</span>
            </div>
            {isAuthorized && (
              <button 
                onClick={() => { setAuthLayer(AuthLayer.LOGIN); setApiKeySelected(false); }}
                className="text-[12px] px-16 py-5 border-4 border-red-600 text-red-500 uppercase font-black transition-all hover:bg-red-600 hover:text-white active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.3)] tracking-[0.5em]"
              >
                TERMINATE_GODMODE
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[2000px] w-full mx-auto p-12 overflow-hidden flex flex-col justify-center relative">
        <div className="absolute top-12 left-12 w-48 h-48 border-l-4 border-t-4 border-[#00FF41] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-12 right-12 w-48 h-48 border-r-4 border-b-4 border-[#00FF41] opacity-10 pointer-events-none"></div>
        
        {!isAuthorized ? (
          <div className="animate-in fade-in slide-in-from-bottom-32 duration-1000 space-y-20">
            <div className="text-center space-y-10">
              <h2 className="text-9xl font-black tracking-[3em] text-[#00FF41] terminal-glow glitch-text">V5_FINAL</h2>
              <p className="text-cyan-400 max-w-4xl mx-auto text-[16px] leading-relaxed font-black tracking-[1.5em] uppercase opacity-90">
                AWAITING_FINAL_GODMODE_AUTHORIZATION_2025
              </p>
            </div>
            <AuthManager currentLayer={authLayer} onAdvance={setAuthLayer} />
          </div>
        ) : !apiKeySelected ? (
          <div className="flex flex-col items-center justify-center text-center space-y-24 animate-in zoom-in-95 duration-1000">
            <div className="w-72 h-72 border-4 border-[#00FF41] flex items-center justify-center shadow-[0_0_100px_rgba(0,255,65,0.5)] relative group bg-black cursor-crosshair">
              <div className="absolute -inset-6 border-4 border-purple-500 opacity-20 group-hover:opacity-100 transition-opacity animate-[spin_6s_linear_infinite]"></div>
              <div className="absolute -inset-12 border-2 border-cyan-400 opacity-10 group-hover:opacity-50 transition-opacity animate-[spin_10s_linear_infinite_reverse]"></div>
              <div className="w-24 h-24 border-4 border-cyan-400 animate-[spin_2s_linear_infinite] opacity-60 rounded-full flex items-center justify-center shadow-[0_0_20px_cyan]">
                 <div className="w-12 h-12 border-2 border-white opacity-20 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-black text-7xl terminal-glow glitch-text">HΩ</div>
            </div>
            <div className="space-y-12">
              <h2 className="text-7xl font-black uppercase tracking-[2em] text-[#00FF41] terminal-glow">AI_HYPER_BRIDGE_OFFLINE</h2>
              <p className="text-purple-400 max-w-4xl mx-auto text-[14px] leading-relaxed tracking-[1em] font-black uppercase opacity-70">
                GODMODE_V5_FINAL_REQUIRE_API_INJECTION_VECTORS_FOR_OMEGA_EMISSION
              </p>
            </div>
            <button 
              onClick={handleOpenKey}
              className="px-40 py-12 bg-[#00FF41] border-4 border-white text-black font-black uppercase tracking-[2.5em] text-[22px] transition-all transform active:scale-95 shadow-[0_0_80px_rgba(0,255,65,0.8)] hover:bg-white hover:text-[#00FF41] hover:scale-105"
            >
              ACTIVATE_HYPER_BRIDGE
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-1000 h-full">
            <MultimodalTerminal />
          </div>
        )}
      </main>

      <footer className="border-t-4 border-[#00FF41] p-12 bg-black">
        <div className="max-w-[2000px] mx-auto flex justify-between items-center text-[12px] text-[#00FF41] uppercase font-black tracking-[3em]">
          <div className="terminal-glow glitch-text">HΩ // AEGIS_V5_HYPER_GODMODE_FINAL_MAX // 5000+ AGENTS // INFINITE_LOOP_OK</div>
          <div className="flex items-center space-x-20 opacity-80 text-purple-400">
             <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping shadow-[0_0_15px_purple]"></div>
                <span className="terminal-glow">PACKET: QUANTUM_SAFE_MAX</span>
             </div>
             <span className="terminal-glow">OS: GODMODE_RTOS_v5.FINAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
