'use client';

import { ReadinessLevel } from '@/lib/types';

const CONFIG: Record<ReadinessLevel, { label: string; color: string; bg: string; dot: string }> = {
  ready: {
    label: 'Ready to price',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  mostly_ready: {
    label: 'Mostly ready',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    dot: 'bg-amber-500',
  },
  needs_work: {
    label: 'Needs more info',
    color: 'text-rose-700',
    bg: 'bg-rose-50 border-rose-200',
    dot: 'bg-rose-500',
  },
};

export default function ReadinessBadge({ level }: { level: ReadinessLevel }) {
  const c = CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${c.color} ${c.bg}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
