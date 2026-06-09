'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import CheckStep from '@/components/CheckStep';
import {
  SITUATION_OPTIONS, URGENCY_OPTIONS, SYSTEM_KNOWLEDGE_OPTIONS,
  SYSTEM_AGE_OPTIONS, FUEL_TYPE_OPTIONS, SYSTEM_PREFERENCE_OPTIONS,
  SQUARE_FOOTAGE_OPTIONS, STORIES_OPTIONS, YEAR_BUILT_OPTIONS,
  DUCTWORK_OPTIONS, PERMIT_AWARENESS_OPTIONS, ELECTRICAL_PANEL_OPTIONS,
  BUDGET_APPROACH_OPTIONS, BUDGET_RANGE_OPTIONS, TOTAL_QUESTIONS,
} from '@/lib/questions';
import { Answers } from '@/lib/types';

type Step =
  | 'opening'
  | 'q1_urgency'
  | 'q2_system'
  | 'q3_preference'
  | 'q4_home'
  | 'q5_ductwork'
  | 'q6_permits'
  | 'q7_electrical'
  | 'q8_budget';

const STEP_ORDER: Step[] = [
  'opening', 'q1_urgency', 'q2_system', 'q3_preference',
  'q4_home', 'q5_ductwork', 'q6_permits', 'q7_electrical', 'q8_budget',
];

function stepNumber(step: Step): number {
  const base: Record<Step, number> = {
    opening: 0,
    q1_urgency: 1,
    q2_system: 2,
    q3_preference: 3,
    q4_home: 4,
    q5_ductwork: 5,
    q6_permits: 6,
    q7_electrical: 7,
    q8_budget: 8,
  };
  return base[step];
}

export default function CheckPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('opening');
  const [answers, setAnswers] = useState<Answers>({ address: '' });
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const addr = sessionStorage.getItem('snapshot_address') || '';
    setAnswers(prev => ({ ...prev, address: addr }));
  }, []);

  const update = (key: keyof Answers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const goNext = (nextStep?: Step) => {
    const currentIdx = STEP_ORDER.indexOf(step);
    let next: Step;

    if (nextStep) {
      next = nextStep;
    } else {
      let idx = currentIdx + 1;
      // skip electrical if no heat pump preference
      if (STEP_ORDER[idx] === 'q7_electrical' && answers.systemPreference !== 'heat_pump') {
        idx++;
      }
      next = STEP_ORDER[idx];
    }

    if (!next) {
      // done
      sessionStorage.setItem('snapshot_answers', JSON.stringify(answers));
      router.push('/guide');
      return;
    }
    setAnimKey(k => k + 1);
    setStep(next);
  };

  const goBack = () => {
    const currentIdx = STEP_ORDER.indexOf(step);
    let idx = currentIdx - 1;
    if (STEP_ORDER[idx] === 'q7_electrical' && answers.systemPreference !== 'heat_pump') {
      idx--;
    }
    if (idx >= 0) {
      setAnimKey(k => k + 1);
      setStep(STEP_ORDER[idx]);
    }
  };

  const totalQuestions = answers.systemPreference === 'heat_pump' ? TOTAL_QUESTIONS : TOTAL_QUESTIONS - 1;
  const currentQ = stepNumber(step);
  const showProgress = step !== 'opening';

  const canContinue = () => {
    switch (step) {
      case 'opening': return !!answers.situation;
      case 'q1_urgency': return !!answers.urgency;
      case 'q2_system': return !!answers.systemKnowledge;
      case 'q3_preference': return !!answers.systemPreference;
      case 'q4_home': return true;
      case 'q5_ductwork': return !!answers.ductwork;
      case 'q6_permits': return !!answers.permitAwareness;
      case 'q7_electrical': return !!answers.electricalPanel;
      case 'q8_budget': return !!answers.budgetApproach;
      default: return false;
    }
  };

  const handleFinish = () => {
    sessionStorage.setItem('snapshot_answers', JSON.stringify(answers));
    router.push('/guide');
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <span className="text-teal-600 font-semibold tracking-tight">Snapshot</span>
          {showProgress && (
            <div className="flex-1 ml-8">
              <ProgressBar current={currentQ} total={totalQuestions} />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-12">
        <div key={animKey}>
          {step === 'opening' && (
            <CheckStep
              question="Tell us what's going on with your home's heating and cooling."
              options={SITUATION_OPTIONS}
              selected={answers.situation}
              onSelect={v => update('situation', v)}
            >
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Anything else you want us to know? <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={400}
                  value={answers.situationNotes || ''}
                  onChange={e => update('situationNotes', e.target.value)}
                  placeholder="Any context that might help us understand your situation..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-colors text-sm resize-none"
                />
              </div>
            </CheckStep>
          )}

          {step === 'q1_urgency' && (
            <CheckStep
              question="How urgent is this project?"
              options={URGENCY_OPTIONS}
              selected={answers.urgency}
              onSelect={v => update('urgency', v)}
            />
          )}

          {step === 'q2_system' && (
            <CheckStep
              question="What do you know about your current HVAC system?"
              options={SYSTEM_KNOWLEDGE_OPTIONS}
              selected={answers.systemKnowledge}
              onSelect={v => update('systemKnowledge', v)}
            >
              {(answers.systemKnowledge === 'know_details' || answers.systemKnowledge === 'some_basics') && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Approximate age</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {SYSTEM_AGE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => update('systemAge', opt.value)}
                          className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            answers.systemAge === opt.value
                              ? 'border-teal-500 bg-teal-50 text-teal-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Fuel type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FUEL_TYPE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => update('fuelType', opt.value)}
                          className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            answers.fuelType === opt.value
                              ? 'border-teal-500 bg-teal-50 text-teal-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Brand <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={answers.systemBrand || ''}
                      onChange={e => update('systemBrand', e.target.value)}
                      placeholder="e.g., Carrier, Trane, Lennox"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-colors text-sm"
                    />
                  </div>
                </div>
              )}
            </CheckStep>
          )}

          {step === 'q3_preference' && (
            <CheckStep
              question="Do you have a preference for what kind of system you want?"
              options={SYSTEM_PREFERENCE_OPTIONS}
              selected={answers.systemPreference}
              onSelect={v => update('systemPreference', v)}
            />
          )}

          {step === 'q4_home' && (
            <CheckStep question="Tell us about your home.">
              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Square footage</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SQUARE_FOOTAGE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => update('squareFootage', opt.value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                          answers.squareFootage === opt.value
                            ? 'border-teal-500 bg-teal-50 text-teal-800'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Stories</label>
                  <div className="grid grid-cols-3 gap-2">
                    {STORIES_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => update('stories', opt.value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          answers.stories === opt.value
                            ? 'border-teal-500 bg-teal-50 text-teal-800'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Year built</label>
                  <div className="grid grid-cols-2 gap-2">
                    {YEAR_BUILT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => update('yearBuilt', opt.value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                          answers.yearBuilt === opt.value
                            ? 'border-teal-500 bg-teal-50 text-teal-800'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CheckStep>
          )}

          {step === 'q5_ductwork' && (
            <CheckStep
              question="Do you know the condition of your ductwork?"
              options={DUCTWORK_OPTIONS}
              selected={answers.ductwork}
              onSelect={v => update('ductwork', v)}
            />
          )}

          {step === 'q6_permits' && (
            <CheckStep
              question="Are you aware that HVAC work in your area typically requires permits?"
              options={PERMIT_AWARENESS_OPTIONS}
              selected={answers.permitAwareness}
              onSelect={v => update('permitAwareness', v)}
            />
          )}

          {step === 'q7_electrical' && (
            <CheckStep
              question="Do you know your home's electrical panel capacity?"
              subtitle="Heat pump installations often require adequate electrical service."
              options={ELECTRICAL_PANEL_OPTIONS}
              selected={answers.electricalPanel}
              onSelect={v => update('electricalPanel', v)}
            />
          )}

          {step === 'q8_budget' && (
            <CheckStep
              question="How are you thinking about budget?"
              options={BUDGET_APPROACH_OPTIONS}
              selected={answers.budgetApproach}
              onSelect={v => update('budgetApproach', v)}
            >
              {answers.budgetApproach === 'rough_budget' && (
                <div className="mt-4 animate-fadeIn">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rough budget range</label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUDGET_RANGE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => update('budgetRange', opt.value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                          answers.budgetRange === opt.value
                            ? 'border-teal-500 bg-teal-50 text-teal-800'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CheckStep>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
          <button
            onClick={goBack}
            className={`text-slate-500 hover:text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors ${step === 'opening' ? 'invisible' : ''}`}
          >
            ← Back
          </button>

          {step === 'q8_budget' ? (
            <button
              onClick={handleFinish}
              disabled={!canContinue()}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 px-8 rounded-xl transition-colors text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              See my readiness guide →
            </button>
          ) : (
            <button
              onClick={() => goNext()}
              disabled={!canContinue()}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 px-8 rounded-xl transition-colors text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
