
import React, { useState, useEffect } from 'react';
import { AuthLayer } from '../../types';
import { AUTH_CREDENTIALS, DEFAULT_SESSION_KEY } from '../../constants';

interface AuthManagerProps {
  currentLayer: AuthLayer;
  onAdvance: (next: AuthLayer) => void;
}

export const AuthManager: React.FC<AuthManagerProps> = ({ currentLayer, onAdvance }) => {
  const [formData, setFormData] = useState({ user: '', pass: '', phrase: '', session: '' });
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleLayer1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.user === AUTH_CREDENTIALS.USERNAME && formData.pass === AUTH_CREDENTIALS.PASSWORD) {
      onAdvance(AuthLayer.PASSPHRASE);
      setError('');
    } else { setError('CRITICAL_REJECTION: V5_AUTH_FAIL_0x01'); }
  };

  const handleLayer2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phrase === AUTH_CREDENTIALS.PASSPHRASE) {
      onAdvance(AuthLayer.SESSION_KEY);
      setError('');
    } else { setError('CRITICAL_REJECTION: V5_PHRASE_VOID'); }
  };

  const handleLayer3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.session === DEFAULT_SESSION_KEY) {
      onAdvance(AuthLayer.MANUAL_GATE);
      setError('');
    } else { setError('CRITICAL_REJECTION: V5_SESSION_VOID'); }
  };

  const handleLayer4 = () => onAdvance(AuthLayer.BEHAVIOR_ANALYTICS);

  useEffect(() => {
    if (currentLayer >= AuthLayer.BEHAVIOR_ANALYTICS && currentLayer < AuthLayer.META_POLICY) {
      setAnalyzing(true);
      const timer = setTimeout(() => {
        setAnalyzing(false);
        const next = currentLayer + 1;
        onAdvance(next as AuthLayer);
      }, 600); // Accelerated for V5_FINAL
      return () => clearTimeout(timer);
    }
  }, [currentLayer]);

  const handleLayer24 = () => onAdvance(AuthLayer.AUTHORIZED);

  const getLayerName = (layer: number) => {
    const names: Record<number, string> = {
      [AuthLayer.BEHAVIOR_ANALYTICS]: 'BEHAVIOR_ANALYTICS_V5',
      [AuthLayer.GEO_FENCING]: 'ADAPTIVE_GEO_LOCK',
      [AuthLayer.BIOMETRIC]: 'MULTI_FACTOR_BIO_SCAN',
      [AuthLayer.DEVICE_FINGERPRINT]: 'QUANTUM_DEVICE_ID',
      [AuthLayer.CONTEXTUAL_RISK]: 'REALTIME_RISK_ASSESSMENT',
      [AuthLayer.AI_BEHAVIORAL]: 'SENTINEL_AI_MONITOR',
      [AuthLayer.SANDBOX_INIT]: 'HYPER_SANDBOX_LOAD',
      [AuthLayer.QUANTUM_GATE]: 'QUANTUM_SAFE_GATE_ALPHA',
      [AuthLayer.META_POLICY]: 'META_POLICY_GODMODE_VERIFY'
    };
    return names[layer] || `SECURITY_GATE_LAYER_${layer}_OK`;
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="w-full bg-black border-4 border-[#00FF41] p-10 shadow-[0_0_100px_rgba(0,255,65,0.4)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF41] animate-pulse"></div>
        <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00FF41] animate-pulse"></div>
        
        <h2 className="text-[14px] font-black mb-12 text-[#00FF41] uppercase tracking-[0.8em] text-center terminal-glow glitch-text">
          V5_FINAL_GATE_0x{currentLayer}
        </h2>

        {error && <div className="mb-6 p-4 bg-red-950/60 border-2 border-red-500 text-red-500 text-[11px] uppercase font-black text-center tracking-[0.5em] animate-bounce">{error}</div>}

        {currentLayer === AuthLayer.LOGIN && (
          <form onSubmit={handleLayer1} className="space-y-8">
            <input className="w-full bg-black border-2 border-[#008F11] p-5 text-[14px] focus:outline-none focus:border-[#00FF41] text-[#00FF41] font-mono tracking-widest" placeholder="OPERATOR_V5_FINAL" value={formData.user} onChange={(e) => setFormData({...formData, user: e.target.value})} />
            <input type="password" className="w-full bg-black border-2 border-[#008F11] p-5 text-[14px] focus:outline-none focus:border-[#00FF41] text-[#00FF41] font-mono tracking-widest" placeholder="GODMODE_PASS" value={formData.pass} onChange={(e) => setFormData({...formData, pass: e.target.value})} />
            <button type="submit" className="w-full py-6 bg-black border-4 border-[#00FF41] hover:bg-[#00FF41] hover:text-black text-[#00FF41] font-black uppercase tracking-[1em] text-[12px] transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]">INITIATE_GODMODE</button>
          </form>
        )}

        {currentLayer === AuthLayer.PASSPHRASE && (
          <form onSubmit={handleLayer2} className="space-y-8">
            <input type="password" className="w-full bg-black border-2 border-[#008F11] p-5 text-[14px] focus:outline-none focus:border-[#00FF41] text-[#00FF41] font-mono tracking-widest" placeholder="V5_MAX_GODMODE_PHRASE" value={formData.phrase} onChange={(e) => setFormData({...formData, phrase: e.target.value})} />
            <button type="submit" className="w-full py-6 bg-black border-4 border-[#00FF41] hover:bg-[#00FF41] hover:text-black text-[#00FF41] font-black uppercase tracking-[1em] text-[12px] transition-all">DECRYPT_FINAL_GATE</button>
          </form>
        )}

        {currentLayer === AuthLayer.SESSION_KEY && (
          <form onSubmit={handleLayer3} className="space-y-8">
            <input className="w-full bg-black border-2 border-[#008F11] p-5 text-[14px] focus:outline-none focus:border-[#00FF41] text-[#00FF41] font-mono tracking-widest" placeholder="OMEGA_INFINITY_V5" value={formData.session} onChange={(e) => setFormData({...formData, session: e.target.value})} />
            <button type="submit" className="w-full py-6 bg-black border-4 border-[#00FF41] hover:bg-[#00FF41] hover:text-black text-[#00FF41] font-black uppercase tracking-[1em] text-[12px] transition-all">SYNC_HYPER_KERNEL</button>
          </form>
        )}

        {currentLayer === AuthLayer.MANUAL_GATE && (
          <div className="space-y-8 text-center">
            <p className="text-[10px] text-[#008F11] uppercase tracking-[0.5em] font-black leading-relaxed">"MANUAL_OVERRIDE_DETECTED. PROCEED_TO_V5_GODMODE?"</p>
            <button onClick={handleLayer4} className="w-full py-12 border-4 border-red-600 text-red-500 font-black uppercase tracking-[1.2em] hover:bg-red-600 hover:text-black transition-all text-[14px] shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-pulse">CONFIRM_HYPER_UNLOCK_FINAL</button>
          </div>
        )}

        {analyzing && (
          <div className="py-12 flex flex-col items-center justify-center space-y-10">
            <div className="relative">
               <div className="w-32 h-32 border-4 border-[#00FF41] border-t-transparent animate-[spin_1s_linear_infinite] rounded-full"></div>
               <div className="absolute inset-0 flex items-center justify-center text-[14px] font-black text-[#00FF41] terminal-glow">{currentLayer}/24</div>
               <div className="absolute -inset-4 border border-cyan-400 opacity-20 animate-pulse rounded-full"></div>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.6em] text-[#00FF41] animate-pulse terminal-glow">
                {getLayerName(currentLayer)}
              </p>
              <div className="mt-4 w-56 h-2 bg-zinc-900 mx-auto overflow-hidden border border-[#008F11]">
                 <div className="h-full bg-[#00FF41] shadow-[0_0_10px_#00FF41] animate-[loading_1.5s_linear_infinite]" style={{width: '40%'}}></div>
              </div>
            </div>
          </div>
        )}

        {currentLayer === AuthLayer.META_POLICY && !analyzing && (
          <div className="space-y-12 text-center py-6">
            <div className="w-40 h-40 mx-auto border-4 border-[#00FF41] flex items-center justify-center relative cursor-pointer group shadow-[0_0_60px_rgba(0,255,65,0.6)]" onClick={handleLayer24}>
               <div className="absolute inset-0 bg-[#00FF41]/20 group-hover:bg-[#00FF41]/70 transition-all"></div>
               <div className="text-3xl font-black text-[#00FF41] terminal-glow glitch-text">HΩ</div>
            </div>
            <p className="text-[11px] text-[#00FF41] font-black uppercase tracking-[1em] animate-bounce terminal-glow">FINAL_MAX_AUTHORITY_SYNC</p>
          </div>
        )}
      </div>
    </div>
  );
};
