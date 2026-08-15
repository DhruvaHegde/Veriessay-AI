import React from 'react';
import { EssayMetrics } from '../types';
import { Activity, Layers, BookOpen, AlertOctagon } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: EssayMetrics;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics }) => {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} color="var(--accent-cyan)" />
          <span className="metric-label">Perplexity Score</span>
        </div>
        <div className="metric-value">{metrics.perplexity}</div>
        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          {metrics.perplexity < 40 ? '⚠️ Low (Predictable)' : '✓ High (Unpredictable)'}
        </span>
      </div>

      <div className="metric-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="var(--accent-primary)" />
          <span className="metric-label">Burstiness CV</span>
        </div>
        <div className="metric-value">{metrics.sentence_length_cv}</div>
        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          {metrics.sentence_length_cv < 0.25 ? '⚠️ Flat Rhythm (AI)' : '✓ Dynamic Rhythm (Human)'}
        </span>
      </div>

      <div className="metric-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={16} color="#10b981" />
          <span className="metric-label">Type-Token Ratio</span>
        </div>
        <div className="metric-value">{metrics.ttr}</div>
        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          MATTR: {metrics.mattr}
        </span>
      </div>

      <div className="metric-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={16} color="#ef4444" />
          <span className="metric-label">LLM Clichés</span>
        </div>
        <div className="metric-value">{metrics.cliche_count}</div>
        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          {metrics.cliche_count > 0 ? metrics.identified_cliches.slice(0, 2).join(', ') : 'None detected'}
        </span>
      </div>
    </div>
  );
};
