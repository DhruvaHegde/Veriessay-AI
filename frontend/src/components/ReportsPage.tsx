import React from 'react';
import { EssayHistoryItem } from '../types';
import { Button } from './ui/Button';
import { BarChart3, Download, TrendingUp, ShieldAlert, CheckCircle, PieChart, Users } from 'lucide-react';

interface ReportsPageProps {
  history: EssayHistoryItem[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ history }) => {
  const totalAnalyzed = history.length;
  const avgAiScore = totalAnalyzed > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.ai_score, 0) / totalAnalyzed) : 0;
  const humanCount = history.filter((h) => h.ai_score <= 10).length;
  const mixedCount = history.filter((h) => h.ai_score > 10 && h.ai_score <= 69).length;
  const aiCount = history.filter((h) => h.ai_score >= 70).length;

  return (
    <div className="space-y-6">
      <div className="official-card">
        <div className="official-card-header">
          <div>
            <h2 className="official-card-title">Institutional Analytics & Summary Reports</h2>
            <p className="official-card-subtitle">
              Aggregate application pool statistics, AI risk distribution, and historical compliance data.
            </p>
          </div>

          <Button variant="secondary" size="sm" icon={<Download size={14} />}>
            Download Summary Report (PDF)
          </Button>
        </div>

        {/* Top Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Essays Evaluated</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{totalAnalyzed}</div>
            <span style={{ fontSize: '0.725rem', color: '#1e40af' }}>Active Application Pool</span>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Average Pool AI Risk</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{avgAiScore}%</div>
            <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Mean Statistical Probability</span>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>Human Written</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#14532d', marginTop: '4px' }}>{humanCount}</div>
            <span style={{ fontSize: '0.725rem', color: '#15803d' }}>Low Risk Submissions</span>
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>High AI Risk Flagged</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7f1d1d', marginTop: '4px' }}>{aiCount}</div>
            <span style={{ fontSize: '0.725rem', color: '#b91c1c' }}>Flagged for Review</span>
          </div>
        </div>

        {/* Breakdown Breakdown */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="#2563eb" />
            Application Pool Distribution Ratio
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>Likely Human (0-10%):</span> {humanCount} ({totalAnalyzed > 0 ? Math.round((humanCount / totalAnalyzed) * 100) : 0}%)
            </div>
            <div>
              <span style={{ color: '#d97706', fontWeight: 700 }}>Mixed / Moderate (11-69%):</span> {mixedCount} ({totalAnalyzed > 0 ? Math.round((mixedCount / totalAnalyzed) * 100) : 0}%)
            </div>
            <div>
              <span style={{ color: '#dc2626', fontWeight: 700 }}>High AI Risk (70-100%):</span> {aiCount} ({totalAnalyzed > 0 ? Math.round((aiCount / totalAnalyzed) * 100) : 0}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
