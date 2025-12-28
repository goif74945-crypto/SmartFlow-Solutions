
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
      } catch (e) { console.debug('Handshake_Syncing...'); }
    };
    if (isAuthorized) checkKey();
  }, [isAuthorized]);

  const handleOpenKey = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setApiKeySelected(true);
    } catch (e) { console.error('Command_Bridge_Failure'); }
  };

  return (
    <div className="min-h-screen bg-black text-[#555] flex flex-col font-mono selection:bg-white selection:text-black overflow-hidden uppercase">
      <header className="border-b border-zinc-900 p-8 bg-black sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-12">
            <div className="w-12 h-12 bg-zinc-100 border border-white flex items-center justify-center text-black font-black text-2xl shadow-2xl">A</div>
            <div>
              <h1 className="text-[16px] font-black tracking-[1.2em] uppercase leading-none mb-2 text-zinc-100">Aegis AI Command Center</h1>
              <div className="flex items-center space-x-4">
                <span className="w-3 h-0.5 bg-zinc-800"></span>
                <p className="text-[10px] text-zinc-700 tracking-[0.6em] font-black uppercase">Private_Operator_Locked</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-16">
            <div className="hidden md:flex flex-col items-end opacity-40">
              <span className="text-[10px] text-zinc-100 uppercase font-black tracking-widest">Protocol: SENTINEL</span>
              <span className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">Auth: LEVEL_01</span>
            </div>
            {isAuthorized && (
              <button 
                onClick={() => { setAuthLayer(AuthLayer.LOGIN); setApiKeySelected(false); }}
                className="text-[10px] px-10 py-3 border border-zinc-900 text-zinc-800 uppercase font-black transition-all hover:bg-zinc-100 hover:text-black active:scale-95"
              >
                TERMINATE_COMMAND
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1800px] w-full mx-auto p-12 overflow-hidden flex flex-col justify-center">
        {!isAuthorized ? (
          <div className="animate-in fade-in duration-1000">
            <div className="text-center mb-32 space-y-12">
              <h2 className="text-7xl font-black tracking-[1.5em] text-zinc-100">LOCKED</h2>
              <p className="text-zinc-900 max-w-2xl mx-auto text-[12px] leading-relaxed font-black tracking-[1em] uppercase">
                AEGIS_SYSTEMS_REQUIRE_VERIFIED_OPERATOR
              </p>
            </div>
            <AuthManager currentLayer={authLayer} onAdvance={setAuthLayer} />
          </div>
        ) : !apiKeySelected ? (
          <div className="flex flex-col items-center justify-center text-center space-y-20 animate-in fade-in duration-500">
            <div className="w-40 h-40 bg-black border border-zinc-900 flex items-center justify-center shadow-inner relative">
              <div className="w-10 h-10 bg-zinc-900 animate-ping"></div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-black uppercase tracking-[1em] text-zinc-100">ESTABLISH_BRIDGE</h2>
              <p className="text-zinc-900 max-w-xl mx-auto text-[12px] leading-relaxed tracking-[0.6em] font-black uppercase">
                High-logic pool execution requires a verified command bridge link.
              </p>
            </div>
            <button 
              onClick={handleOpenKey}
              className="px-32 py-6 bg-zinc-100 border border-white hover:bg-white text-black font-black uppercase tracking-[1em] text-[14px] transition-all transform active:scale-95 shadow-2xl"
            >
              INITIALIZE_AEGIS_LINK
            </button>
          </div>
        ) : (
          <MultimodalTerminal />
        )}
      </main>

      <footer className="border-t border-zinc-900 p-10 bg-black">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center text-[11px] text-zinc-950 uppercase font-black tracking-[2em]">
          <div>Aegis • Command_Core_v5 • Zero_External_Telemetry</div>
          <div className="flex items-center space-x-20 opacity-20">
            <span>Thread: Autonomous</span>
            <span>Handshake: Secure</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
