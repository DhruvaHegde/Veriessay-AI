import React, { useState } from 'react';
import { EssayAnalysisResponse, SentenceReport } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { ShieldAlert, ShieldCheck, AlertTriangle, Calculator, FileText, CheckCircle2, AlertCircle, Info, RefreshCw, Cpu, Layers, HelpCircle } from 'lucide-react';
import { ExplanationSidePanel } from './ExplanationSidePanel';

interface ResultsDashboardProps {
  data: EssayAnalysisResponse;
  onNewAnalysis: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'table' | 'prose' | 'diagnostics' | 'guidance'>('summary');
  const [activeSentence, setActiveSentence] = useState<SentenceReport | null>(null);

  const aiScore = Math.round(data.overall_ai_score);
  const humanScore = Math.round(100 - aiScore);
  const cb = data.calculation_breakdown;

  // Determine official verdict badge
  let verdictLabel = data.risk_level;
  if (aiScore <= 10) verdictLabel = 'Likely Human Written';
  else if (aiScore <= 35) verdictLabel = 'Mostly Human';
  else if (aiScore <= 69) verdictLabel = 'Moderate / Mixed AI';
  else if (aiScore <= 85) verdictLabel = 'Likely AI';
  else verdictLabel = 'Full AI';

  // Determine confidence
  const confidenceLevel = aiScore >= 70 || humanScore >= 70 ? 'High' : 'Medium';

  return (
    <div className="space-y-6">
      {/* Overview Header Summary Card */}
      <div className="official-card">
        <div className="official-card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h2 className="official-card-title">{data.title || 'Admissions Essay Submission'}</h2>
              <Badge verdict={verdictLabel} />
            </div>
            <p className="official-card-subtitle">
              Analyzed on {data.created_at ? new Date(data.created_at).toLocaleString() : new Date().toLocaleString()} • {data.summary?.total_words || 0} Words • {data.summary?.total_sentences || 0} Sentences
            </p>
          </div>

          <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={onNewAnalysis}>
            New Analysis
          </Button>
        </div>

        {/* Primary Scores Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Likelihood</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#991b1b', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {aiScore}%
            </div>
            <span style={{ fontSize: '0.725rem', color: '#b91c1c' }}>Estimated Probability</span>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Human Likelihood</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#14532d', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {humanScore}%
            </div>
            <span style={{ fontSize: '0.725rem', color: '#15803d' }}>Authentic Human Evidence</span>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Confidence & Mode</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
              {confidenceLevel} Confidence
            </div>
            <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Statistical Model Certainty</span>
          </div>
        </div>

        {/* Warning Callout Box */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 500 }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Official Advisory Notice:</strong> This result is an estimate. Human review is recommended before making admissions decisions.
          </span>
        </div>
      </div>

      {/* 5 Result Tabs */}
      <div className="official-card">
        <nav className="result-tabs">
          <button className={`result-tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>
            <FileText size={16} />
            <span>Summary</span>
          </button>
          <button className={`result-tab-btn ${activeTab === 'table' ? 'active' : ''}`} onClick={() => setActiveTab('table')}>
            <Layers size={16} />
            <span>Segment Table</span>
          </button>
          <button className={`result-tab-btn ${activeTab === 'prose' ? 'active' : ''}`} onClick={() => setActiveTab('prose')}>
            <FileText size={16} />
            <span>Highlighted Prose</span>
          </button>
          <button className={`result-tab-btn ${activeTab === 'diagnostics' ? 'active' : ''}`} onClick={() => setActiveTab('diagnostics')}>
            <Calculator size={16} />
            <span>Diagnostics</span>
          </button>
          <button className={`result-tab-btn ${activeTab === 'guidance' ? 'active' : ''}`} onClick={() => setActiveTab('guidance')}>
            <ShieldCheck size={16} />
            <span>Admissions Officer Guidance</span>
          </button>
        </nav>

        {/* TAB 1: SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>Statistical Finding Summary</h3>
                <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.6', marginBottom: '16px' }}>
                  {aiScore >= 70
                    ? 'The statistical model detected strong structural AI generation patterns, repetitive token predictability, and standardized admissions clichés typical of Large Language Models.'
                    : aiScore >= 36
                    ? 'The essay contains a hybrid blend of authentic personal statements and generic AI transitional phrasing. Segment-level review is recommended.'
                    : 'The text exhibits high organic vocabulary diversity, natural sentence rhythm variance, and unique personal specificity consistent with authentic human writing.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Perplexity Proxy</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{data.metrics?.perplexity || 45.0}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Sentence Length CV</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{data.metrics?.sentence_length_cv || 0.35}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Vocabulary MATTR</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{data.metrics?.mattr || 0.85}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Clichés Identified</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{data.metrics?.cliche_count || 0} Phrases</div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Evaluation Protocol</h4>
                <ul style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>✓ Multi-signal statistical token analysis</li>
                  <li>✓ Structural arc & trope scanning</li>
                  <li>✓ Segment-level sentence classification</li>
                  <li>✓ Short human text safety protections</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEGMENT TABLE */}
        {activeTab === 'table' && (
          <div>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Click any row below to open detailed sentence diagnostics.</span>
              <span style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 700 }}>Total Segments: {data.sentences?.length || 0}</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="official-table">
                <thead>
                  <tr>
                    <th>Seg #</th>
                    <th>Text Preview</th>
                    <th>AI Score</th>
                    <th>Human Score</th>
                    <th>Label</th>
                    <th>Confidence</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sentences?.map((s, idx) => (
                    <tr key={idx} onClick={() => setActiveSentence(s)}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#{s.sentence_index + 1}</td>
                      <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{s.text}"</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#dc2626', fontWeight: 700 }}>{Math.round(s.ai_probability || (s.classification === 'ai' ? 85 : 5))}%</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#16a34a', fontWeight: 700 }}>{Math.round(s.human_probability || (s.classification === 'human' ? 95 : 15))}%</td>
                      <td><Badge verdict={s.mixed_classification || (s.classification === 'ai' ? 'Full AI' : 'Likely Human Written')} showIcon={false} /></td>
                      <td>{s.confidence || 'High'}</td>
                      <td style={{ maxWidth: '200px', fontSize: '0.775rem', color: '#475569' }}>{s.reason || s.flags?.[0] || 'Standard style pattern'}</td>
                      <td><Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setActiveSentence(s); }}>Inspect</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: HIGHLIGHTED PROSE */}
        {activeTab === 'prose' && (
          <div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '0.775rem' }}>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>Color Legend:</span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>🟢 Green = Likely Human</span>
              <span style={{ color: '#0d9488', fontWeight: 700 }}>🔷 Teal = Mostly Human</span>
              <span style={{ color: '#d97706', fontWeight: 700 }}>🟧 Amber = Mixed / Moderate AI</span>
              <span style={{ color: '#ea580c', fontWeight: 700 }}>📙 Orange = Likely AI</span>
              <span style={{ color: '#dc2626', fontWeight: 700 }}>🔴 Red = Full AI</span>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '24px', borderRadius: '8px', fontSize: '1rem', lineHeight: '2.0' }}>
              {data.sentences?.map((sent, idx) => {
                let highlightClass = 'human';
                const aiP = sent.ai_probability ?? (sent.classification === 'ai' ? 85 : 5);
                if (aiP > 80) highlightClass = 'ai';
                else if (aiP > 60) highlightClass = 'likely-ai';
                else if (aiP > 35) highlightClass = 'mixed';
                else if (aiP > 10) highlightClass = 'mostly-human';

                return (
                  <span
                    key={idx}
                    className={`sentence-highlight ${highlightClass}`}
                    onClick={() => setActiveSentence(sent)}
                    title={`Click to inspect diagnostic analysis (AI Likelihood: ${Math.round(aiP)}%)`}
                  >
                    {sent.text}{' '}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: DIAGNOSTICS */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} color="#2563eb" />
              Transparent Calculation Output & Factor Weights
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', marginBottom: '8px' }}>Human Signals Detected</h4>
                <ul style={{ fontSize: '0.8rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {cb?.human_signals_detected?.map((sig, i) => <li key={i}>• {sig}</li>) || <li>• Organic vocabulary variance</li>}
                </ul>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', marginBottom: '8px' }}>AI Signals Detected</h4>
                <ul style={{ fontSize: '0.8rem', color: '#7f1d1d', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {cb?.ai_signals_detected?.map((sig, i) => <li key={i}>• {sig}</li>) || <li>• Token sequence predictability</li>}
                </ul>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.8rem' }}>
              <div><span>Base Model Score:</span> <strong>{cb?.base_model_score || aiScore}%</strong></div>
              <div><span>Sentence Rhythm Score:</span> <strong>{data.metrics?.sentence_length_cv || 0.35} CV</strong></div>
              <div><span>Structure Predictability:</span> <strong>{data.metrics?.perplexity ? 'High' : 'Moderate'}</strong></div>
              <div><span>Uncertainty Penalty:</span> <strong>{cb?.uncertainty_penalty || 0}%</strong></div>
              <div><span>Short-Text Penalty:</span> <strong>{cb?.short_text_penalty || 0}%</strong></div>
              <div><span>Final AI Score:</span> <strong>{aiScore}%</strong></div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMISSIONS OFFICER GUIDANCE */}
        {activeTab === 'guidance' && (
          <div className="space-y-4">
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} />
                Recommended Admissions Next Step
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#1e3a8a', lineHeight: '1.6' }}>
                {aiScore >= 70
                  ? 'High risk of automated text generation. Recommend conducting an in-person candidate interview or requesting additional verified writing samples before finalizing evaluation.'
                  : aiScore >= 36
                  ? 'Moderate / mixed AI indicators found. Inspect highlighted segments in Tab 3 to verify whether student used automated grammar/synonym tools.'
                  : 'Low risk. Writing style exhibits authentic human narrative traits. Proceed with standard holistic application review.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sentence Diagnostics Inspector Drawer */}
      {activeSentence && (
        <ExplanationSidePanel
          sentence={activeSentence}
          onClose={() => setActiveSentence(null)}
        />
      )}
    </div>
  );
};
