'use client';

import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { Answers, ReadinessResult, DimensionScore } from '@/lib/types';

const TEAL = '#0D9488';
const NAVY = '#0F172A';
const EMERALD = '#065F46';
const AMBER = '#92400E';
const ROSE = '#9F1239';
const GRAY = '#64748B';
const LIGHT = '#F8FAFC';

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { marginBottom: 28 },
  logo: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: TEAL, marginBottom: 4 },
  tagline: { fontSize: 10, color: GRAY },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginVertical: 16 },
  sectionTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 10 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  card: { borderRadius: 6, padding: 12, marginBottom: 8, borderWidth: 1 },
  cardLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  cardSummary: { fontSize: 10, marginBottom: 3 },
  cardBody: { fontSize: 9, color: GRAY },
  briefGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  briefCell: { width: '50%', marginBottom: 10 },
  briefLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: GRAY, textTransform: 'uppercase', marginBottom: 2 },
  briefValue: { fontSize: 10, color: NAVY },
  callout: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 6, padding: 14, marginBottom: 16 },
  calloutText: { fontSize: 10, color: '#14532D', lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48 },
  footerText: { fontSize: 8, color: '#CBD5E1', textAlign: 'center' },
});

const LEVEL_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  ready: { bg: '#ECFDF5', text: EMERALD, label: 'Ready to price' },
  mostly_ready: { bg: '#FFFBEB', text: AMBER, label: 'Mostly ready' },
  needs_work: { bg: '#FFF1F2', text: ROSE, label: 'Needs more info' },
};

const STATUS_CARD: Record<string, { bg: string; border: string; labelColor: string }> = {
  clear: { bg: '#F0FDF4', border: '#BBF7D0', labelColor: EMERALD },
  uncertain: { bg: '#FFFBEB', border: '#FDE68A', labelColor: AMBER },
  needs_clarification: { bg: '#FFF1F2', border: '#FECDD3', labelColor: ROSE },
};

const SQFT_LABELS: Record<string, string> = {
  under_1200: 'Under 1,200 sq ft', '1200_2000': '1,200–2,000 sq ft',
  '2000_3000': '2,000–3,000 sq ft', over_3000: 'Over 3,000 sq ft',
};
const PREFERENCE_LABELS: Record<string, string> = {
  heat_pump: 'Heat pump (all-electric)', same_type: 'Same system type',
  explore: 'Open to options', cost_effective: 'Most cost-effective', most_efficient: 'Most efficient',
};
const URGENCY_LABELS: Record<string, string> = {
  broken_now: 'Immediate', soon_1_3mo: '1–3 months', planning_3_6mo: '3–6 months', researching: 'Still researching',
};
const BUDGET_LABELS: Record<string, string> = {
  rough_budget: 'Has budget in mind', understand_first: 'Wants cost info first',
  finance: 'Plans to finance', rebates_first: 'Wants rebate info first',
};

function DimCard({ d }: { d: DimensionScore }) {
  const c = STATUS_CARD[d.status];
  return (
    <View style={[styles.card, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.cardLabel, { color: c.labelColor }]}>{d.label}</Text>
      <Text style={styles.cardSummary}>{d.summary}</Text>
      {d.why && <Text style={styles.cardBody}>{d.why}</Text>}
      {d.resolution && <Text style={[styles.cardBody, { marginTop: 3, fontFamily: 'Helvetica-Bold' }]}>{d.resolution}</Text>}
    </View>
  );
}

function ReadinessDoc({ answers, result }: { answers: Answers; result: ReadinessResult }) {
  const badge = LEVEL_BADGE[result.level];
  const clear = result.dimensions.filter(d => d.status === 'clear');
  const uncertain = result.dimensions.filter(d => d.status === 'uncertain');
  const needs = result.dimensions.filter(d => d.status === 'needs_clarification');

  const calloutText = result.level === 'ready'
    ? `You've given us enough to understand your project clearly. The dimensions below are all well-defined, which means contractors can give you comparable, meaningful quotes. Use the contractor brief below to share context when you reach out.`
    : result.level === 'mostly_ready'
    ? `Your project has a solid foundation. A few dimensions (${uncertain.map(d => d.label.toLowerCase()).join(', ')}) will affect final pricing, but you have enough to get initial quotes. The contractor brief below helps set expectations upfront.`
    : `Your project has some open questions that could significantly affect cost. Addressing the items below before getting quotes will help you compare them meaningfully. A contractor site visit is often the fastest way to resolve most of these.`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>Snapshot</Text>
          <Text style={styles.tagline}>HVAC Project Readiness Guide — {answers.address || 'Your home'}</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
          <Text style={{ fontSize: 10, color: GRAY, marginLeft: 10 }}>
            {result.clearCount} clear · {result.uncertainCount} uncertain · {result.needsCount} need clarification
          </Text>
        </View>

        <View style={[styles.callout, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
          <Text style={[styles.calloutText, { color: '#0C4A6E' }]}>{calloutText}</Text>
        </View>

        {clear.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>What's clear about your project</Text>
            {clear.map(d => <DimCard key={d.dimension} d={d} />)}
          </View>
        )}

        {(uncertain.length > 0 || needs.length > 0) && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>What's still uncertain</Text>
            {uncertain.map(d => <DimCard key={d.dimension} d={d} />)}
          </View>
        )}

        {needs.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>What to clarify before getting quotes</Text>
            {needs.map(d => <DimCard key={d.dimension} d={d} />)}
          </View>
        )}

        <View style={[styles.divider, { marginTop: 20 }]} />
        <Text style={[styles.sectionTitle, { marginTop: 4 }]}>Contractor brief</Text>
        <View style={styles.briefGrid}>
          {[
            ['Project', PREFERENCE_LABELS[answers.systemPreference || ''] || '—'],
            ['Timeline', URGENCY_LABELS[answers.urgency || ''] || '—'],
            ['Home', [answers.squareFootage ? SQFT_LABELS[answers.squareFootage] : null, answers.stories ? `${answers.stories}-story` : null, answers.yearBuilt ? `built ${answers.yearBuilt.replace('_',' ')}` : null].filter(Boolean).join(', ') || '—'],
            ['Budget approach', BUDGET_LABELS[answers.budgetApproach || ''] || '—'],
          ].map(([label, value]) => (
            <View key={label} style={styles.briefCell}>
              <Text style={styles.briefLabel}>{label}</Text>
              <Text style={styles.briefValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 20 }}>
          {clear.length > 0 && (
            <View style={{ flex: 1 }}>
              <Text style={[styles.briefLabel, { color: EMERALD, marginBottom: 4 }]}>What's clear</Text>
              {clear.map(d => (
                <Text key={d.dimension} style={{ fontSize: 9, color: NAVY, marginBottom: 3 }}>✓ {d.summary}</Text>
              ))}
            </View>
          )}
          {(uncertain.length > 0 || needs.length > 0) && (
            <View style={{ flex: 1 }}>
              <Text style={[styles.briefLabel, { color: AMBER, marginBottom: 4 }]}>Needs assessment</Text>
              {[...uncertain, ...needs].map(d => (
                <Text key={d.dimension} style={{ fontSize: 9, color: NAVY, marginBottom: 3 }}>→ {d.label}</Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated by Snapshot · snapshot.formus.ai · Not a cost estimate</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function downloadReadinessPDF(answers: Answers, result: ReadinessResult) {
  const blob = await pdf(<ReadinessDoc answers={answers} result={result} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'snapshot-readiness-guide.pdf';
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadContractorBriefPDF(answers: Answers, result: ReadinessResult) {
  const clear = result.dimensions.filter(d => d.status === 'clear');
  const needs = result.dimensions.filter(d => d.status !== 'clear');

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.logo}>Snapshot — Contractor Brief</Text>
        <Text style={[styles.tagline, { marginBottom: 16 }]}>{answers.address || 'HVAC Project'}</Text>
        <View style={styles.divider} />
        <View style={[styles.briefGrid, { marginTop: 12 }]}>
          {[
            ['Project', PREFERENCE_LABELS[answers.systemPreference || ''] || '—'],
            ['Timeline', URGENCY_LABELS[answers.urgency || ''] || '—'],
            ['Home', [answers.squareFootage ? SQFT_LABELS[answers.squareFootage] : null, answers.stories ? `${answers.stories}-story` : null, answers.yearBuilt ? `built ${answers.yearBuilt.replace('_',' ')}` : null].filter(Boolean).join(', ') || '—'],
            ['Budget', BUDGET_LABELS[answers.budgetApproach || ''] || '—'],
          ].map(([label, value]) => (
            <View key={label} style={styles.briefCell}>
              <Text style={styles.briefLabel}>{label}</Text>
              <Text style={styles.briefValue}>{value}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 8 }}>
          {clear.length > 0 && (
            <View style={{ flex: 1 }}>
              <Text style={[styles.briefLabel, { color: EMERALD, marginBottom: 4 }]}>What's clear</Text>
              {clear.map(d => <Text key={d.dimension} style={{ fontSize: 9, color: NAVY, marginBottom: 3 }}>✓ {d.summary}</Text>)}
            </View>
          )}
          {needs.length > 0 && (
            <View style={{ flex: 1 }}>
              <Text style={[styles.briefLabel, { color: AMBER, marginBottom: 4 }]}>Needs assessment</Text>
              {needs.map(d => <Text key={d.dimension} style={{ fontSize: 9, color: NAVY, marginBottom: 3 }}>→ {d.label}</Text>)}
            </View>
          )}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated by Snapshot · snapshot.formus.ai</Text>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'snapshot-contractor-brief.pdf';
  a.click();
  URL.revokeObjectURL(url);
}
