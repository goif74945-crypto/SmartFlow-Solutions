
import React, { useState } from 'react';
import { AuthLayer } from '../../types';
import { AUTH_CREDENTIALS, DEFAULT_SESSION_KEY } from '../../constants';

interface AuthManagerProps {
  currentLayer: AuthLayer;
  onAdvance: (next: AuthLayer) => void;
}

export const AuthManager: React.FC<AuthManagerProps> = ({ currentLayer, onAdvance }) => {
  const [formData, setFormData] = useState({ user: '', pass: '', phrase: '', session: '' });
  const [error, setError] = useState('');

  const handleLayer1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.user === AUTH_CREDENTIALS.USERNAME && formData.pass === AUTH_CREDENTIALS.PASSWORD) {
      onAdvance(AuthLayer.PASSPHRASE);
      setError('');
    } else {
      setError('Invalid primary credentials.');
    }
  };

  const handleLayer2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phrase === AUTH_CREDENTIALS.PASSPHRASE) {
      onAdvance(AuthLayer.SESSION_KEY);
      setError('');
    } else {
      setError('Passphrase mismatch.');
    }
  };

  const handleLayer3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.session === DEFAULT_SESSION_KEY) {
      onAdvance(AuthLayer.MANUAL_GATE);
      setError('');
    } else {
      setError('Invalid session validation key.');
    }
  };

  const handleLayer4 = () => {
    onAdvance(AuthLayer.AUTHORIZED);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto">
      <div className="w-full glass p-8 rounded-lg shadow-2xl border-t-4 border-green-500/50">
        <h2 className="text-xl font-bold mb-6 mono text-green-500 uppercase tracking-widest">
          Auth Layer {currentLayer} of 4
        </h2>

        {error && <div className="mb-4 p-2 bg-red-900/30 border border-red-500 text-red-400 text-sm rounded">{error}</div>}

        {currentLayer === AuthLayer.LOGIN && (
          <form onSubmit={handleLayer1} className="space-y-4">
            <input 
              className="w-full bg-black border border-zinc-800 p-3 rounded focus:outline-none focus:border-green-500 text-sm"
              placeholder="System Username"
              value={formData.user}
              onChange={(e) => setFormData({...formData, user: e.target.value})}
            />
            <input 
              type="password"
              className="w-full bg-black border border-zinc-800 p-3 rounded focus:outline-none focus:border-green-500 text-sm"
              placeholder="System Password"
              value={formData.pass}
              onChange={(e) => setFormData({...formData, pass: e.target.value})}
            />
            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 font-bold uppercase tracking-widest text-sm transition-colors rounded">Initialize Handshake</button>
          </form>
        )}

        {currentLayer === AuthLayer.PASSPHRASE && (
          <form onSubmit={handleLayer2} className="space-y-4">
            <p className="text-xs text-zinc-500 mb-2">SECONDARY_ENCRYPTION_LAYER_ACTIVE</p>
            <input 
              type="password"
              className="w-full bg-black border border-zinc-800 p-3 rounded focus:outline-none focus:border-green-500 text-sm"
              placeholder="Enter Secondary Passphrase"
              value={formData.phrase}
              onChange={(e) => setFormData({...formData, phrase: e.target.value})}
            />
            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 font-bold uppercase tracking-widest text-sm transition-colors rounded">Verify Identity</button>
          </form>
        )}

        {currentLayer === AuthLayer.SESSION_KEY && (
          <form onSubmit={handleLayer3} className="space-y-4">
            <p className="text-xs text-zinc-500 mb-2">VALIDATE_SESSION_KEY: <span className="text-green-500">{DEFAULT_SESSION_KEY}</span></p>
            <input 
              className="w-full bg-black border border-zinc-800 p-3 rounded focus:outline-none focus:border-green-500 text-sm"
              placeholder="Re-enter Key to Confirm"
              value={formData.session}
              onChange={(e) => setFormData({...formData, session: e.target.value})}
            />
            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 font-bold uppercase tracking-widest text-sm transition-colors rounded">Finalize Cryptography</button>
          </form>
        )}

        {currentLayer === AuthLayer.MANUAL_GATE && (
          <div className="space-y-6 text-center">
            <p className="text-sm text-zinc-400 italic">"Manual physical gate confirmation required. Unauthorized access is a terminal violation."</p>
            <button 
              onClick={handleLayer4} 
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded shadow-lg terminal-glow transition-all"
            >
              UNLOCK TERMINAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
