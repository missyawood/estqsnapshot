'use client';

import { Answers, ReadinessResult } from '@/lib/types';

const PREFERENCE_LABELS: Record<string, string> = {
  heat_pump: 'Heat pump (all-electric)',
  same_type: 'Replace with same system type',
  explore: 'Open to exploring options',
  cost_effective: 'Most cost-effective option',
  most_efficient: 'Most energy-efficient option',
};

const SQFT_LABELS: Record<string, string> = {
  under_1200: 'Under 1,200 sq ft',
  '1200_2000': '1,200–2,000 sq ft',
  '2000_3000': '2,000–3,000 sq ft',
  over_3000: 'Over 3,000 sq ft',
};

const URGENCY_LABELS: Record<string, string> = {
  broken_now: 'Immediate — system is broken',
  soon_1_3mo: '1–3 months',
  planning_3_6mo: '3–6 months',
  researching: 'Researching, no firm timeline',
};

const BUDGET_LABELS: Record<string, string> = {
  rough_budget: 'Has a rough budget in mind',
  understand_first: 'Wants to understand costs first',
  finance: 'Plans to finance',
  rebates_first: 'Wants rebate info first',
};

interface ContractorBriefProps {
  answers: Answers;
  result: ReadinessResult;
  id?: string;
}

export default function ContractorBrief({ answers, result, id }: ContractorBriefProps) {
  const clearItems = result.dimensions.filter(d => d.status === 'clear');
  const needsItems = result.dimensions.filter(d => d.status !== 'clear');

  return (
    <div id={id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Contractor brief</p>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-5">Project summary for your contractor</h3>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Project</p>
          <p className="text-slate-800">
            {PREFERENCE_LABELS[answers.systemPreference || ''] || 'HVAC replacement/upgrade'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Timeline</p>
          <p className="text-slate-800">{URGENCY_LABELS[answers.urgency || ''] || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Home</p>
          <p className="text-slate-800">
            {[
              answers.squareFootage ? SQFT_LABELS[answers.squareFootage] : null,
              answers.stories ? `${answers.stories}-story` : null,
              answers.yearBuilt ? `built ${answers.yearBuilt.replace('_', ' ')}` : null,
            ].filter(Boolean).join(', ') || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Budget approach</p>
          <p className="text-slate-800">
            {BUDGET_LABELS[answers.budgetApproach || ''] || '—'}
          </p>
        </div>
      </div>

      {answers.address && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Address</p>
          <p className="text-slate-800">{answers.address}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {clearItems.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">What's clear</p>
            <ul className="space-y-1">
              {clearItems.map(d => (
                <li key={d.dimension} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>{d.summary}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {needsItems.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Needs contractor assessment</p>
            <ul className="space-y-1">
              {needsItems.map(d => (
                <li key={d.dimension} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">→</span>
                  <span>{d.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
