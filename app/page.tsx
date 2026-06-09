'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [address, setAddress] = useState('');
  const router = useRouter();

  const handleStart = () => {
    if (!address.trim()) return;
    sessionStorage.setItem('snapshot_address', address.trim());
    router.push('/check');
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <nav className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
        <span className="text-teal-600 font-semibold text-lg tracking-tight">Snapshot</span>
        <span className="text-sm text-slate-400">Free · No signup</span>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-2xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 text-sm text-teal-700 font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
          Takes about 5 minutes
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
          Don&apos;t get HVAC quotes until you know what to ask.
        </h1>

        <p className="text-lg text-slate-500 mb-12 max-w-xl">
          Take 5 minutes to find out what a fair price looks like, where contractors pad estimates, and the exact questions to ask before anyone gives you a number. Free, no signup.
        </p>

        <div className="w-full max-w-md">
          <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
            Your home address
          </label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="123 Main St, Springfield, IL"
            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-colors text-base mb-4"
          />
          <button
            onClick={handleStart}
            disabled={!address.trim()}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors text-base cursor-pointer disabled:cursor-not-allowed"
          >
            Show me what to ask →
          </button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 max-w-md w-full">
          {[
            { icon: '🔍', text: 'Understand your project' },
            { icon: '📋', text: 'Get a contractor brief' },
            { icon: '📄', text: 'Download a readiness guide' },
          ].map(item => (
            <div key={item.text} className="text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xs text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-100">
        Snapshot never estimates costs or recommends contractors.
      </footer>
    </main>
  );
}
