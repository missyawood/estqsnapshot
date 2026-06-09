'use client';

import { DimensionScore } from '@/lib/types';

const STATUS_CONFIG = {
  clear: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: '✓',
    iconColor: 'text-emerald-600',
  },
  uncertain: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    icon: '~',
    iconColor: 'text-amber-600',
  },
  needs_clarification: {
    border: 'border-rose-200',
    bg: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    icon: '!',
    iconColor: 'text-rose-600',
  },
};

export default function ReadinessCard({ dimension }: { dimension: DimensionScore }) {
  const c = STATUS_CONFIG[dimension.status];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${c.badge}`}>
          {c.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 mb-1">{dimension.label}</p>
          <p className="text-slate-700 text-sm mb-2">{dimension.summary}</p>
          {dimension.why && (
            <p className="text-slate-500 text-sm">{dimension.why}</p>
          )}
          {dimension.resolution && (
            <p className="text-slate-600 text-sm mt-2 font-medium">{dimension.resolution}</p>
          )}
        </div>
      </div>
    </div>
  );
}
