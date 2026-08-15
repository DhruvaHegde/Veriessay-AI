import React from 'react';
import { HelpCircle, Shield, FileText, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="official-card">
        <div className="official-card-header">
          <div>
            <h2 className="official-card-title">Academic Review Guidelines & Methodology</h2>
            <p className="official-card-subtitle">
              Comprehensive guidance for admissions officers on interpreting statistical writing analysis results.
            </p>
          </div>
        </div>

        <div className="space-y-6" style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.6' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="#2563eb" />
              Statistical Detection Methodology
            </h3>
            <p>
              VeriEssay AI combines multi-signal statistical Natural Language Processing (NLP) models to analyze college application essays.
              Our engine evaluates character/word perplexity proxies, sentence length burstiness variance ($\sigma/\mu$), Type-Token Ratios (MATTR),
              syntax tree depth repetition, and Large Language Model (LLM) admissions cliché tropes (`resilience`, `beacon`, `spearheaded`, `rich tapestry`).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', marginBottom: '6px' }}>🟢 Likely Human Written (0 - 10%)</h4>
              <p style={{ fontSize: '0.8rem', color: '#14532d' }}>
                Essay demonstrates strong organic vocabulary variance, authentic personal detail, and natural sentence length rhythm.
              </p>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', marginBottom: '6px' }}>🔴 High AI Risk (70 - 100%)</h4>
              <p style={{ fontSize: '0.8rem', color: '#7f1d1d' }}>
                Essay exhibits highly predictable token sequences, generic growth narrative arcs, flat rhythm variance, and repeated LLM buzzwords.
              </p>
            </div>
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '16px', borderRadius: '8px', color: '#92400e' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} />
              Important Ethical Advisory for Admissions Committees
            </h4>
            <p style={{ fontSize: '0.8rem' }}>
              Automated AI detection scores must never serve as the sole ground for rejecting an applicant.
              All flagged essays should undergo holistic human review by committee members or candidate interview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
