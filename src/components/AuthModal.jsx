import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AuthModal = () => {
  const { login, shopInfo } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both Username and Password!');
      return;
    }

    const res = login(username, password);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 border border-slate-200 shadow-2xl space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-amber-500/30 font-bold text-white">
            {shopInfo.logoIcon || '💊'}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{shopInfo.name || 'Yellow Pharmacy'}</h2>
            <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mt-0.5">Admin Security Login</p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{errorMessage}</p>
              <p className="text-[11px] text-rose-600 mt-0.5">Correct details: Username = <code className="bg-rose-100 px-1 py-0.5 rounded font-mono font-bold">boss</code>, Password = <code className="bg-rose-100 px-1 py-0.5 rounded font-mono font-bold">BOSS55</code></p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              <span>Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter username (e.g. boss)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none transition shadow-sm"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password (e.g. BOSS55)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none transition shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-lg shadow-amber-600/20 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Secure Admin Login</span>
          </button>
        </form>

        {/* Credentials Info Footer */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
          <p className="text-[11px] text-amber-900 font-medium">
            🔒 Protected Portal. Login with <strong className="font-extrabold underline">boss</strong> / <strong className="font-extrabold underline">BOSS55</strong>
          </p>
        </div>

      </div>
    </div>
  );
};
