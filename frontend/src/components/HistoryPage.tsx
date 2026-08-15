import React, { useState } from 'react';
import { EssayHistoryItem } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Search, Filter, Download, Trash2, Eye, Calendar, RefreshCw } from 'lucide-react';

interface HistoryPageProps {
  history: EssayHistoryItem[];
  onSelectEssay: (id: number) => void;
  onDeleteEssay: (id: number) => void;
  onClearHistory: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onSelectEssay,
  onDeleteEssay,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<string>('all');

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerdict = verdictFilter === 'all' || item.risk_level === verdictFilter;
    return matchesSearch && matchesVerdict;
  });

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['ID', 'Date', 'Essay Title', 'Word Count', 'AI Likelihood %', 'Verdict'];
    const rows = history.map((item) => [
      item.id,
      new Date(item.created_at).toLocaleString(),
      `"${item.title.replace(/"/g, '""')}"`,
      item.word_count,
      item.ai_score,
      item.risk_level
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `veriessay_history_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="official-card">
        <div className="official-card-header">
          <div>
            <h2 className="official-card-title">Analysis History & Audit Log</h2>
            <p className="official-card-subtitle">
              Review, filter, export, or audit previously submitted college admissions essay evaluations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={handleExportCSV} disabled={history.length === 0}>
              Export Audit Log (CSV)
            </Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={onClearHistory} disabled={history.length === 0}>
              Clear History
            </Button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by student identifier, title, or prompt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="form-select"
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
            >
              <option value="all">All Verdict Statuses</option>
              <option value="Likely Human Written">Likely Human Written</option>
              <option value="Mostly Human">Mostly Human</option>
              <option value="Moderate / Mixed AI">Moderate / Mixed AI</option>
              <option value="Likely AI">Likely AI</option>
              <option value="Full AI">Full AI</option>
            </select>
          </div>
        </div>

        {/* Table / Empty State */}
        {filteredHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <Calendar size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>No analysis records found</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              {searchTerm ? 'No history entries matched your search criteria.' : 'No essays have been analyzed yet. Paste an essay to begin.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="official-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Essay Title / Identifier</th>
                  <th>Word Count</th>
                  <th>AI Score</th>
                  <th>Human Score</th>
                  <th>Verdict Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => {
                  const aiP = Math.round(item.ai_score);
                  const humanP = Math.round(100 - aiP);
                  return (
                    <tr key={item.id} onClick={() => onSelectEssay(item.id)}>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.title}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{item.word_count} words</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#dc2626', fontWeight: 700 }}>{aiP}%</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#16a34a', fontWeight: 700 }}>{humanP}%</td>
                      <td><Badge verdict={item.risk_level} showIcon={false} /></td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="secondary" size="sm" icon={<Eye size={14} />} onClick={() => onSelectEssay(item.id)}>
                            View
                          </Button>
                          <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => onDeleteEssay(item.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
