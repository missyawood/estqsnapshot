'use client';

import { ReactNode } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CheckStepProps {
  question: string;
  subtitle?: string;
  options?: Option[];
  selected?: string;
  onSelect?: (value: string) => void;
  children?: ReactNode;
}

export default function CheckStep({
  question,
  subtitle,
  options,
  selected,
  onSelect,
  children,
}: CheckStepProps) {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2 leading-snug">
        {question}
      </h2>
      {subtitle && (
        <p className="text-slate-500 mb-8">{subtitle}</p>
      )}
      {options && onSelect && (
        <div className="space-y-3 mb-6">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-base font-medium ${
                selected === opt.value
                  ? 'border-teal-500 bg-teal-50 text-teal-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
