'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Answers, ReadinessResult } from '@/lib/types';
import { scoreReadiness } from '@/lib/scoring';
import ReadinessBadge from '@/components/ReadinessBadge';
import ReadinessCard from '@/components/ReadinessCard';
import ContractorBrief from '@/components/ContractorBrief';

const LEVEL_CALLOUT: Record<string, (addresses: string[], addr: string) => string> = {
  ready: (_, addr) =>
    `You've given us enough to understand your project clearly. The dimensions below are all well-defined, which means contractors can give you comparable, meaningful quotes. Use the contractor brief below to share context when you reach out.${addr ? ` [Estq pricing for homeowners near ${addr} with similar projects would appear here]` : ''}`,
  mostly_ready: (uncertain, addr) =>
    `Your project has a solid foundation. A few dimensions (${uncertain.join(', ')}) will affect final pricing, but you have enough to get initial quotes and ask the right questions. The contractor brief below helps set expectations upfront.${addr ? ` [Estq pricing range for ${addr} would appear here, reflecting the uncertainty above]` : ''}`,
  needs_work: (needs, _) =>
    `Your project has some open questions that could significantly affect cost. Addressing the items below — especially ${needs.join(', ')} — before getting quotes will help you compare them meaningfully. A contractor site visit is often the fastest path to clarity.`,
};

export default function GuidePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [result, setResult] = useState<ReadinessResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [briefLoading, setBriefLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('snapshot_answers');
    if (!raw) { router.push('/'); return; }
    const a: Answers = JSON.parse(raw);
    const r = scoreReadiness(a);
    const timer = setTimeout(() => {
      setAnswers(a);
      setResult(r);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  const handleDownloadPDF = async () => {
    if (!answers || !result) return;
    setPdfLoading(true);
    try {
      const { downloadReadinessPDF } = await import('@/components/PDFGuide');
      await downloadReadinessPDF(answers, result);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleContractorPDF = async () => {
    if (!answers || !result) return;
    setBriefLoading(true);
    try {
      const { downloadContractorBriefPDF } = await import('@/components/PDFGuide');
      await downloadContractorBriefPDF(answers, result);
    } finally {
      setBriefLoading(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">Generating your readiness guide...</p>
      </div>
    );
  }

  if (!answers || !result) return null;

  const clear = result.dimensions.filter(d => d.status === 'clear');
  const uncertain = result.dimensions.filter(d => d.status === 'uncertain');
  const needs = result.dimensions.filter(d => d.status === 'needs_clarification');

  const calloutText = (() => {
    if (result.level === 'ready') return LEVEL_CALLOUT.ready([], answers.address);
    if (result.level === 'mostly_ready') return LEVEL_CALLOUT.mostly_ready(uncertain.map(d => d.label.toLowerCase()), answers.address);
    return LEVEL_CALLOUT.needs_work(needs.map(d => d.label.toLowerCase()), answers.address);
  })();

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <span className="text-teal-600 font-semibold tracking-tight">Snapshot</span>
        <button
          onClick={() => router.push('/')}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Start over
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-2">{answers.address}</p>
          <div className="flex items-center gap-4 mb-4">
            <ReadinessBadge level={result.level} />
            <span className="text-sm text-slate-500">
              {result.clearCount} clear · {result.uncertainCount} uncertain · {result.needsCount} need clarification
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Your HVAC readiness guide</h1>
        </div>

        {/* Pricing callout */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <p className="text-sm font-semibold text-blue-800 mb-2 uppercase tracking-wide">What this means for pricing</p>
          <p className="text-blue-900 text-sm leading-relaxed">{calloutText}</p>
        </div>

        {/* Clear */}
        {clear.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">What&apos;s clear about your project</h2>
            <div className="space-y-3">
              {clear.map(d => <ReadinessCard key={d.dimension} dimension={d} />)}
            </div>
          </section>
        )}

        {/* Uncertain */}
        {uncertain.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">What&apos;s still uncertain</h2>
            <div className="space-y-3">
              {uncertain.map(d => <ReadinessCard key={d.dimension} dimension={d} />)}
            </div>
          </section>
        )}

        {/* Needs clarification */}
        {needs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">What to clarify before getting quotes</h2>
            <div className="space-y-3">
              {needs.map(d => <ReadinessCard key={d.dimension} dimension={d} />)}
            </div>
          </section>
        )}

        {/* Contractor brief */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your contractor brief</h2>
          <div ref={briefRef}>
            <ContractorBrief answers={answers} result={result} id="contractor-brief" />
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pb-12">
          <button
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
            className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {pdfLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating PDF...
              </>
            ) : (
              '↓ Download readiness guide (PDF)'
            )}
          </button>

          <div className="flex gap-2 flex-1">
            <button
              onClick={handleContractorPDF}
              disabled={briefLoading}
              className="flex-1 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {briefLoading ? 'Generating...' : '↓ Contractor brief'}
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm cursor-pointer"
            >
              {copied ? '✓ Copied!' : '⎘ Copy link'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
