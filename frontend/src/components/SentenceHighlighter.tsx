import React, { useState } from 'react';
import { SentenceReport } from '../types';
import { AlertTriangle, Info } from 'lucide-react';

interface SentenceHighlighterProps {
  sentences: SentenceReport[];
}

export const SentenceHighlighter: React.FC<SentenceHighlighterProps> = ({ sentences }) => {
  const [selectedSentence, setSelectedSentence] = useState<SentenceReport | null>(null);

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--status-ai-bg)', border: '1px solid var(--status-ai)' }} />
          <span>Full AI (70-100%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--status-mixed-bg)', border: '1px solid var(--status-mixed)' }} />
          <span>Moderate / Mixed AI (11-69%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--status-human-bg)', border: '1px solid var(--status-human)' }} />
          <span>Full Human (0-10%)</span>
        </div>
      </div>

      <div
        className="glass-card"
        style={{
          lineHeight: '1.9',
          fontSize: '1.025rem',
          maxHeight: '380px',
          overflowY: 'auto',
          padding: '20px',
          background: 'rgba(10, 14, 23, 0.8)',
        }}
      >
        {sentences.map((sent) => (
          <span
            key={sent.sentence_index}
            className={`sentence-highlight ${sent.classification}`}
            onClick={() => setSelectedSentence(sent)}
            title={`Sentence #${sent.sentence_index + 1} - AI Score: ${Math.round(sent.confidence_score * 100)}%`}
          >
            {sent.text}{' '}
          </span>
        ))}
      </div>

      {selectedSentence && (
        <div
          className="glass-card"
          style={{
            marginTop: '16px',
            borderColor: selectedSentence.classification === 'ai' ? 'var(--status-ai)' : 'var(--border-subtle)',
            background: 'rgba(18, 24, 38, 0.95)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>
              Sentence #{selectedSentence.sentence_index + 1} Inspection
            </span>
            <span className={`badge badge-${selectedSentence.classification}`}>
              {selectedSentence.classification} ({Math.round(selectedSentence.confidence_score * 100)}% AI Confidence)
            </span>
          </div>

          <p style={{ fontStyle: 'italic', color: 'var(--text-main)', marginBottom: '12px' }}>
            "{selectedSentence.text}"
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.825rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Perplexity Score: </span>
              <strong style={{ color: '#fff' }}>{selectedSentence.perplexity}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>POS Signature: </span>
              <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                {selectedSentence.pos_signature || 'N/A'}
              </code>
            </div>
          </div>

          {selectedSentence.flags && selectedSentence.flags.length > 0 && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--status-ai)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} /> Identified Detection Flags:
              </span>
              <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {selectedSentence.flags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
